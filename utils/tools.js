import api from '../utils/api';
import { i18n } from './i18n'
import { calShippingCostCu, calShippingCostSeller } from './shippingCal'

const groupBy = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
}

const formatDate = (date, use_option = true, time = true, short = false, year = true, local = 'th') => {
  var d = new Date(date)
  var lang = 'en-US'
  // if ((i18n.language || window.localStorage.i18nextLng || 'th') == "th") {
  //   lang = 'th-TH'
  // }
  if (local == 'th')
    lang = 'th-TH'

  // console.log(lang)
  if (use_option) {
    var options = { month: short ? 'short' : 'long', day: '2-digit' };
    if (year) {
      options.year = 'numeric'
    }
    if (time) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }
    return d.toLocaleDateString(lang, options);
  }
  else {
    var options = { month: '2-digit', day: '2-digit' };
    if (year) {
      options.year = 'numeric'
    }
    if (time) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }

    return d.toLocaleDateString(lang, options).replace(/\//g, '-');
  }
}


const currencyFormatDE = (num, fixed = 2) => {
  if (!isNaN(num) && num >= 1) {
    num = parseFloat(num);
    return (
      num
        .toFixed(fixed) // always two decimal digits
        .replace(',', '.') // replace decimal point character with ,
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    ) // use . as a separator
  }
  return parseFloat(0).toFixed(fixed) // always two decimal digits
    .replace(',', '.') // replace decimal point character with ,
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

}

const calShelfPromotion = async (cart, selected_in_cart) => {
  var tmp = [];
  cart = cart.filter((product) => !selected_in_cart || selected_in_cart.includes(product.id));

  if (cart.length == 0)
    return {
      discount: 0,
      dis_for_web: 0,
      total_discount: 0,
      discount_list: []
    };

  let new_products = cart.map((p) => p.product_id);
  try {
    let produsts_in_shelf = (await api.getNewsWithProduct({ products: new_products })).data
    //console.log(produsts_in_shelf);
    let shelf = groupBy(produsts_in_shelf, 'news_id')
    var total_price = 0;
    var discount = 0;

    let shelf_key = Object.keys(shelf)
    var cart_per = [];
    var cart_promotion = [];
    var discount_list = [];

    for (let index = 0; index < shelf_key.length; index++) {
      let key = shelf_key[index]

      let count_in_shelf = 0;
      shelf[key].forEach((s) => {
        count_in_shelf += cart.find((c) => c.product_id == s.product_id).quantity
      })

      let promotion = (await api.getPromotionAll({ cate_key: key, condition1: count_in_shelf, active: 1 })).data;
      var dis = 0;
      if (promotion.rows.length > 0) {
        let data = promotion.rows[0];
        //console.log('promotions',data)

        var temp = cart.filter((c) => {
          return produsts_in_shelf.find((p) => c.product_id == p.product_id && p.news_id == key)
        });
        //console.log('data', data);
        var detail;
        if (data.type == 1) {
          detail = promotion_type1(data, temp)

          // console.log("type 1 : ",detail)
        } else if (data.type == 2) {
          detail = promotion_type2(data, temp)

          // console.log("type 2 : ",detail)
        } else if (data.type == 3) {
          detail = promotion_type3(data, temp)

          // console.log("type 3 : ",detail)
        } else if (data.type == 4) {
          detail = promotion_type4(data, temp)

          // console.log("type 4 : ",detail)
        } else if (data.type == 112) {
          detail = promotion_c112(data, temp)

          // console.log("type 112 : ",detail)
        } else if (data.type == 6) {
          detail = promotion_type6(data, temp)

          // console.log("type 6 : ",detail)
        }


        dis += detail.dis
        let detail_cart = detail.cart_per;

        if (detail_cart.length > 0) cart_per = [...cart_per, ...detail_cart]
        //let detail_promotion = detail.cart_promotion;
        //if(detail_promotion.length > 0) cart_promotion = [...cart_promotion,...detail_promotion]
        //dis += detail.dis

        if (data.max_discount && dis > data.max_discount)
          dis = parseFloat(data.max_discount)

        if (detail.dis) {
          //console.log('dis',dis)

          let detail_promotion = temp.map(val => { return { id: val.product_id, promotion: data.description } })
          cart_promotion = [...cart_promotion, ...detail_promotion]
          discount_list = [...discount_list, ...detail.discount_list]
          //console.log('Get promo !!')

        }
        //console.log('dis',dis)
      }
      discount += dis;

    }
    //console.log('cart_promotion',cart_promotion)

    let dis_for_web = 0;
    let dis_for_web_cu = 0;
    cart.forEach((c) => {
      //if(!cart_promotion.find(val => val.id == c.product_id)){
      let discount_item = discount_list.find(v => c.product_id == v.product_id)
      let discount_qty = 0;
      if (discount_item) {
        discount_qty = discount_item.qty
      }
      let discount_web = (c.quantity - discount_qty) * (c.cover_price - c.price);
      dis_for_web += discount_web

      if (discount_item) {
        discount_item.discount_web = discount_web
      }
      else {
        discount_list.push({ product_id: c.product_id, qty: 0, total_discount: 0, discount_web: discount_web })
      }

      // console.log(c.quantity - discount_qty)

      // dis_for_web += ((c.quantity - (cart_per.filter(x => x.id==c.product_id).length * (c.price_code == 'c112' ? c.quantity:1)) ) * (c.cover_price - c.price))
      if (c.seller_id == 'cu') {
        dis_for_web_cu += (c.quantity - discount_qty) * (c.cover_price - c.price)
        // dis_for_web_cu += ((c.quantity - (cart_per.filter(x => x.id==c.product_id).length * (c.price_code == 'c112' ? c.quantity:1)) ) * (c.cover_price - c.price))
      }
      //}



    })
    // console.log('discount',discount)
    // console.log('discount list',discount_list)
    // console.log('dis_for_web',dis_for_web)


    return {
      discount,
      dis_for_web, dis_for_web_cu,
      total_discount: discount + dis_for_web,
      cart_per,
      cart_promotion,
      discount_list
    };
  } catch (err) {
    console.log(err)
  }
}

const calWeightBook = (product) => {
  var weight = parseInt(product.weight);
  var language = product.category[0]
  if (weight == 0 && product.pages == 0) {
    if (language == 1 && product.cover_code == 1) {
      weight = 708
    } else if (language == 1 && product.cover_code == 2) {
      weight = 1200
    } else if (language == 2 && product.cover_code == 1) {
      weight = 1016
    } else if (language == 2 && product.cover_code == 2) {
      weight = 1672
    }
  } else if (weight == 0) {
    if (language == 1 && product.cover_code == 1) {
      weight = 1.3 * product.pages
    } else if (language == 1 && product.cover_code == 2) {
      weight = 2.1 * product.pages
    } else if (language == 2 && product.cover_code == 1) {
      weight = 1.6 * product.pages
    } else if (language == 2 && product.cover_code == 2) {
      weight = 2.5 * product.pages
    }
  }
  weight = Math.ceil(weight * product.quantity);
  if (weight <= 5000) {
    weight += 200;
  } else {
    weight += 350;
  }
  return weight;
}

const calWeightAllBook = (cart, selected_in_cart, seller_id = 'cu') => {
  // if(!cart) return 0;
  let weight = cart.reduce((weight, product) => {
    if (!(!selected_in_cart || selected_in_cart.includes(product.id)))
      return weight
    if (product.type != 'ebook' && product.type != 'course')
      weight += seller_id == 'cu' ? parseInt(calWeightBook(product)) : Math.ceil(product.weight * product.quantity);
    return weight
  }, 0)
  return weight
}

const summaryPriceBook = (cart, selected_in_cart) => {
  let price = cart.reduce((price, product) => {
    if (!(!selected_in_cart || selected_in_cart.includes(product.id)))
      return price
    price += parseFloat(product.cover_price) * parseInt(product.quantity);
    return price
  }, 0)

  return price
}

const summaryPriceSeller = (cart, selected_in_cart, seller_id) => {
  cart = cart.filter(item => item.seller_id == seller_id)
  let price = cart.reduce((price, product) => {
    if (!(!selected_in_cart || selected_in_cart.includes(product.id)))
      return price
    price += parseFloat(product.cover_price) * parseInt(product.quantity);
    return price
  }, 0)

  return price
}

const promotion_type1 = (promotion, cart) => {

  // console.log('promotion',promotion)
  var dis = 0;
  var cart_per = [];
  var cart_promotion = [];
  var temp = [...cart];
  var discount_list = []
  const { promotion_code, promotion_name } = promotion;
  temp.sort((a, b) => b.cover_price - a.cover_price)
  // var length = parseInt(promotion.condition1) + parseInt(promotion.discount1);
  // var cart_length = 0;
  // cart.forEach(element => cart_length += element.quantity)
  // var count = parseInt(cart_length/length);
  // // console.log('count',count)
  // // console.log('cart_length',cart_length)

  // var down_cart = 0;
  // var down_cart_only = 1;
  // let discount_index = [];
  // // console.log('sep')
  // for(let i = 0; i < count; i++){
  //   for(let j = 1; j <= promotion.discount1; j++){
  //     let index = temp.length - (j+(i*promotion.discount1)-down_cart)
  //     let pd = temp[index]
  //     // console.log('pd',pd)
  //     dis += parseFloat(pd.cover_price);
  //     if(pd.quantity > down_cart_only){
  //       down_cart++;
  //       down_cart_only++;
  //     }else{
  //       down_cart_only = 1;
  //     }
  //     //discount_index.push(index)
  //     cart_per.push({id: pd.product_id,per: 1})
  //     // if(cart_promotion.findIndex((c)=>c.id == pd.product_id) == -1)
  //     //   cart_promotion.push({id:pd.product_id,promotion:promotion.description})
  //   }
  // }

  let items = [];
  temp.forEach(val => {
    for (let i = 0; i < val.quantity; i++)
      items.push(val)
  })


  let dis_index = items.length - 1;
  for (let i = 0; i < dis_index; i++) {
    //console.log(i + 1 ,3 % promotion.condition1)

    //console.log('i',i)
    if ((i + 1) % promotion.condition1 == 0) {
      let start = dis_index;
      // console.log('in if',i,'start',start)
      // console.log('start-promotion.discount1',start-promotion.discount1)
      let count = 0;

      for (let j = start; j > i && count < promotion.discount1; j--) {
        let product = items[j];
        let discount = parseFloat(items[j].cover_price);
        dis_index = j - 1;
        // console.log('i',i,'j',j,items[j])
        count++;
        dis += discount;
        cart_per.push({ id: items[j].product_id, per: 1 })
        let discount_index = discount_list.findIndex(val => val.product_id == items[j].product_id)
        if (discount_index == -1) {
          discount_list.push({ product_id: items[j].product_id, qty: items[j].quantity, total_discount: discount, promotion_id: promotion_code, promotion_name })
        }
        else {
          discount_list[discount_index].total_discount += discount;
          // discount_list[discount_index].qty += 1;
        }
        //console.log(items[j])


        if (cart_promotion.findIndex((cart) => cart.id == product.product_id) == -1) {
          cart_promotion.push({ id: items[j].product_id, promotion: promotion.description, qty: 1 })
        }


      }
    }

  }


  if (dis > 0) {
    for (let i = 0; i < items.length; i++) {
      let discount_index = discount_list.findIndex(val => val.product_id == items[i].product_id)
      if (discount_index == -1) {
        discount_list.push({ product_id: items[i].product_id, qty: items[i].quantity, total_discount: 0, promotion_id: promotion_code, promotion_name })
      }

    }
  }


  // console.log('items',items)


  //console.log('discount_index' ,discount_index)
  // console.log('filtered cart',cart)
  // console.log('cart_per',cart_per)
  // console.log('cart_promotion',cart_promotion)
  return { dis, cart_per, cart_promotion, discount_list }
}

const promotion_type2 = (promotion, cart) => {
  var dis = 0;
  var cart_per = [];
  var cart_promotion = [];
  var discount_list = []
  var sum = 0;
  const { promotion_code, promotion_name, min_discount, max_discount } = promotion;

  cart.sort((a, b) => b.cover_price - a.cover_price)
  var cart_length = 0;
  var length = parseInt(promotion.condition1);
  cart.forEach(element => {
    sum += element.cover_price * element.quantity;
    cart_length += element.quantity
  })
  // console.log('sum',sum)
  // console.log('cart',cart)

  var count = parseInt(cart_length / length);
  var down_cart = 0;
  var down_cart_only = 1;

  if (sum >= min_discount) {
    for (let i = 0; i < count; i++) {
      for (let j = 1; j <= length; j++) {
        let pd = cart[cart.length - (j + (i * length) - down_cart)]
        let discount = parseFloat(pd.cover_price * (parseFloat(promotion.discount1 / 100)));

        if (dis + discount > max_discount) {
          discount = max_discount - dis;
        }

        dis += discount;
        if (pd.quantity > down_cart_only) {
          down_cart++;
          down_cart_only++;
        } else {
          down_cart_only = 1;
        }
        cart_per.push({ id: pd.product_id, per: parseFloat(promotion.discount1 / 100) })
        if (cart_promotion.findIndex((c) => c.id == pd.product_id) == -1)
          cart_promotion.push({ id: pd.product_id, promotion: promotion.description })

        let discount_index = discount_list.findIndex(val => val.product_id == pd.product_id)
        if (discount_index == -1) {
          discount_list.push({ product_id: pd.product_id, qty: pd.quantity, total_discount: discount, promotion_id: promotion_code, promotion_name })
        }
        else {
          discount_list[discount_index].total_discount += discount;
          // discount_list[discount_index].qty += 1;
        }
      }
    }
  }

  // console.log('dis',dis,discount_list)

  return { dis, cart_per, cart_promotion, discount_list }
}

const promotion_type3 = (promotion, cart) => {
  //console.log('type 3')
  var dis = 0;
  var cart_per = [];
  var cart_promotion = [];
  var discount_list = [];
  var sum = 0;
  var { min_discount, max_discount } = promotion;
  const { promotion_code, promotion_name } = promotion;
  cart.sort((a, b) => a.cover_price - b.cover_price)


  let items = [];
  cart.forEach(val => {
    sum += val.cover_price * val.quantity;
    for (let i = 0; i < val.quantity; i++)
      items.push(val)
  })
  let in_condition = items.length >= promotion.condition2 ? 2 : items.length >= promotion.condition1 ? 1 : 0

  // console.log('sum',sum)
  if (in_condition && sum >= min_discount) {
    const discount_multiplier = in_condition == 2 ? (parseFloat(promotion.discount2 / 100)) : (parseFloat(promotion.discount1 / 100))
    for (let i = 0; i < items.length; i++) {
      let pd = items[i]
      let discount = parseFloat(pd.cover_price * discount_multiplier)
      // if(i === items.length-1){
      //   // console.log('dis',dis,'discount',discount,'max_discount',max_discount)
      // }
      if (dis + discount > max_discount) {
        discount = max_discount - dis;
      }


      dis += discount;

      cart_per.push({ id: pd.product_id, per: discount_multiplier })
      if (cart_promotion.findIndex((c) => c.id == pd.product_id) == -1)
        cart_promotion.push({ id: pd.product_id, promotion: promotion.description })

      let discount_index = discount_list.findIndex(val => val.product_id == pd.product_id)
      if (discount_index == -1) {
        discount_list.push({ product_id: pd.product_id, qty: 1, total_discount: discount, promotion_id: promotion_code, promotion_name })
      }
      else {
        discount_list[discount_index].total_discount += discount;
        discount_list[discount_index].qty += 1;
      }
    }
  }

  return { dis, cart_per, cart_promotion, discount_list }
}

const promotion_type6 = (promotion, cart) => {
  var dis = 0;
  var cart_per = [];
  var cart_promotion = [];
  var discount_list = []
  const { promotion_code, promotion_name } = promotion;
  cart.sort((a, b) => b.cover_price - a.cover_price)
  var range = [parseInt(promotion.condition1), parseInt(promotion.condition2)];
  var cart_length = 0;
  cart.forEach(element => cart_length += element.quantity)
  var count = parseInt(cart_length / range[1]);

  var max = range[1];
  for (let i = 1; i <= range[1]; i++) {
    if ((cart_length % range[1]) % i == 0) {
      max = i
    }
  }
  var add = 0;
  var down_cart = 0;
  var down_cart_only = 1;
  var index = 0;
  for (var i = range[1]; i >= range[0]; i--) {
    if (max >= i && max != range[1])
      add = 1;
    for (var j = 1; j <= count + add; j++) {
      let pd = cart[cart.length - (++index - down_cart)]
      let discount = 0;
      if (i == range[1])
        discount += parseFloat(pd.cover_price * (parseFloat(promotion.discount2 / 100)));
      else
        discount += parseFloat(pd.cover_price * (parseFloat(promotion.discount1 / 100)));
      dis += discount;
      if (pd.quantity > down_cart_only) {
        down_cart++;
        down_cart_only++;
      } else {
        down_cart_only = 1;
      }
      if (i == range[1])
        cart_per.push({ id: pd.product_id, per: parseFloat(promotion.discount2 / 100) })
      else
        cart_per.push({ id: pd.product_id, per: parseFloat(promotion.discount1 / 100) })

      if (cart_promotion.findIndex((c) => c.id == pd.product_id) == -1)
        cart_promotion.push({ id: pd.product_id, promotion: promotion.description })

      let discount_index = discount_list.findIndex(val => val.product_id == pd.product_id)
      if (discount_index == -1) {
        discount_list.push({ product_id: pd.product_id, qty: 1, total_discount: discount, promotion_id: promotion_code, promotion_name })
      }
      else {
        discount_list[discount_index].total_discount += discount;
        discount_list[discount_index].qty += 1;
      }
    }
  }
  return { dis, cart_per, cart_promotion, discount_list }
}

const promotion_type4 = (promotion, cart) => {
  var dis = 0;
  var cart_per = [];
  var cart_promotion = [];
  var discount_list = [];

  const { promotion_code, promotion_name, max_discount, min_discount } = promotion;
  var total_price = cart.reduce((total, item) => total + item.cover_price * item.quantity, 0)
  cart.sort((a, b) => a.cover_price - b.cover_price)
  if (total_price >= min_discount) {
    cart.forEach((c) => {
      for (var i = 0; i < c.quantity; i++) {
        let discount = (parseFloat(c.cover_price) * (parseFloat(promotion.discount1) / 100))

        if (dis + discount > max_discount) {
          discount = max_discount - dis;
        }
        dis += discount
        cart_per.push({ id: c.product_id, per: parseFloat(promotion.discount1 / 100) })

        if (cart_promotion.findIndex((cart) => cart.id == c.product_id) == -1)
          cart_promotion.push({ id: c.product_id, promotion: promotion.description })
        let discount_index = discount_list.findIndex(val => val.product_id == c.product_id)
        if (discount_index == -1) {
          discount_list.push({ product_id: c.product_id, qty: 1, total_discount: discount, promotion_id: promotion_code, promotion_name })
        }
        else {
          discount_list[discount_index].total_discount += discount;
          discount_list[discount_index].qty += 1;
        }
      }
    })
  }
  return { dis, cart_per, cart_promotion, discount_list }
}

const promotion_c112 = (promotion, cart) => {
  var dis = 0;
  var cart_per = [];
  var cart_promotion = [];
  var discount_list = [];

  const { promotion_code, promotion_name } = promotion;
  cart.forEach((c) => {
    let amount = parseFloat(c.cover_price) * (parseFloat(c.quantity));
    if (amount > promotion.condition1) {
      let discount = (amount * parseFloat(promotion.discount1) / 100);
      dis += discount
      cart_per.push({ id: c.product_id, per: parseFloat(promotion.discount1 / 100) })

      if (cart_promotion.findIndex((cart) => cart.id == c.product_id) == -1)
        cart_promotion.push({ id: c.product_id, promotion: promotion.description })
      let discount_index = discount_list.findIndex(val => val.product_id == c.product_id)
      if (discount_index == -1) {
        discount_list.push({ product_id: c.product_id, qty: c.quantity, total_discount: discount, promotion_id: promotion_code, promotion_name })
      }
      else {
        discount_list[discount_index].total_discount += discount;
        discount_list[discount_index].qty += c.quantity;
      }
    }
  })
  return { dis, cart_per, cart_promotion, discount_list }
}

const getProvinceCode = (user, selected) => {
  if (!user) {
    return;
  }
  if (!user.addresses.length) {
    return;
  }
  var province_code;
  province_code = user.addresses.find((item) => item.id == parseInt(selected ? selected : user.addresses[0].id)).province_code
  return province_code;
}

const calShipping = (weight = 0, sum, user, selected_address, type_shipment, allSeller = false) => {
  var setarea = ['10', '11', '12', '13'];
  var area = setarea.includes(getProvinceCode(user, selected_address)) ? 1 : 0;



  if (allSeller == true) {
    weight = weight
  }


  let list_weight =
    [
      {
        type_shipment: 1,
        in_area: 0,
        data: [
          { weight: 0, price: 60 }
        ]
      }, {
        type_shipment: 1,
        in_area: 1,
        data: [
          { weight: 0, price: 100 }
        ]
      },
      {
        type_shipment: 2,
        in_area: 1,
        data: [
          { weight: 0, price: 60 },
          { weight: 5, price: 130 },
          { weight: 9, price: 170 },
          { weight: 13, price: 250 },
          { weight: 25, price: 325 },

        ]
      }, {
        type_shipment: 2,
        in_area: 0,
        data: [
          { weight: 0, price: 60 },
          { weight: 1, price: 80 },
          { weight: 3, price: 110 },
          { weight: 5, price: 150 },
          { weight: 9, price: 185 },
          { weight: 13, price: 280 },
          { weight: 25, price: 360 },
          // {weight:30,price:280},

        ]
      },
    ];

  var price = 0;
  var range = list_weight.find((lw) => lw.in_area == area && lw.type_shipment == type_shipment);

  var range_data = range ? range.data : [{ weight: 0, price: 0 }];

  range_data = range_data.sort((a, b) => b.weight - a.weight);

  price = range_data.find((rg) => { return weight >= rg.weight }).price

  //CU Only
  if (type_shipment == 2 && area == 1 && (weight > 0 && weight <= 5)) {
    if (sum >= 700) {
      price = 50
    }
    else {
      price = 60
    }

  }
  else if ((type_shipment == 1 && weight > 0)) {
    if (sum >= 700) {
      price = 0
    }
    else {
      price = 50
    }
    // price = 50
  } else if (weight > 30) {
    price = 0
  }
  return price;
}

const calShippingSeller = (cart, selected_in_cart, seller, type_shipment) => {
  if (!cart.length || !seller) return 0;

  let weight = calWeightAllBook(cart, selected_in_cart, seller.id);

  weight = weight / 1000

  let price = 0;
  let range = seller.seller_shippings.find((ss) => ss.shipping_type == type_shipment)


  var range_data = range ? range.rate_list : [{ weight: 0, price: 0 }];
  range_data = range_data.sort((a, b) => b.weight - a.weight);


  price = range_data.find((rg) => { return weight >= rg.weight }).price
  return price
}

const calShippingAllSeller = (user, cartDetail, shippingInfo, total_price_cu, shippingInfoCu, discount_shelf) => {
  let shipping = [];
  const { cart } = user;
  const { cart_id } = cartDetail;

  let seller_cart = groupBy(cart, 'seller_id');
  cartDetail.seller && Object.keys(cartDetail.seller).forEach((s) => {
    let total = 0;
    let total1 = 0, total2 = 0, total3 = 0;
    if (!seller_cart[s]) {
      return;
    }
    let filtered_cart = seller_cart[s].filter(val => cart_id.includes(val.id) && val.type != 'ebook' && val.type != 'course' && val.type != 'course_ecode' && val.type != 'ecode')
    let weight = 0;
    let ship = filtered_cart.findIndex(val => val.type != 'ebook' && val.type != 'course' && val.type != 'course_ecode' && val.type != 'ecode') != -1;
    // let isAllEbook = true;
    // filtered_cart.forEach(val =>{
    //   if(val.item_code) isAllEbook = false;
    // })


    var package_total_price = 0;
    filtered_cart.forEach(val => {
      // console.log('val weight',val.weight)
      weight += val.weight ? parseInt(val.weight) * val.quantity : 0;
      if (discount_shelf) {
        let { discount_list } = discount_shelf;
        let total_price = val.cover_price * val.quantity;
        let item = discount_list.find(d => d.product_id == val.product_id)
        if (item) {
          total_price -= item.total_discount + item.discount_web;
        }
        package_total_price += total_price

      }

    })
    weight /= 1000;

    // console.log('weight',weight)
    // let index = tmp.findIndex(val => val.id == s)

    // if(isAllEbook){}

    // console.log('weight',weight);

    if (!filtered_cart.length || !ship) {
      total = 0;
    }

    else if (s != 'cu') {
      let info = shippingInfo.find((info) => info.id == s)
      // total = calShippingSeller(filtered_cart,cartDetail.cart_id,info,cartDetail.seller[s].shipping_type)
      // total1 = calShippingSeller(filtered_cart,cartDetail.cart_id,info,1)
      // total2 = calShippingSeller(filtered_cart,cartDetail.cart_id,info,2)
      total = calShippingCostSeller({ type: cartDetail.seller[s].shipping_type, weight, totalPrice: package_total_price, sellerShippingInfo: info, shippingInfoCu })
      total1 = calShippingCostSeller({ type: 1, weight, totalPrice: package_total_price, sellerShippingInfo: info, shippingInfoCu })
      total2 = calShippingCostSeller({ type: 2, weight, totalPrice: package_total_price, sellerShippingInfo: info, shippingInfoCu })
      total3 = calShippingCostSeller({ type: 3, weight, totalPrice: package_total_price, sellerShippingInfo: info, shippingInfoCu })
    } else {

      let weight = calWeightAllBook(filtered_cart, cartDetail.cart_id) / 1000;

      // total = calShipping(weight,total_price_cu,user,cartDetail.address_id,cartDetail.seller[s].shipping_type)
      // total1 = calShipping(weight,total_price_cu,user,cartDetail.address_id,1)
      // total2 = calShipping(weight,total_price_cu,user,cartDetail.address_id,2)

      total = calShippingCostCu({ type: cartDetail.seller[s].shipping_type, weight, totalPrice: total_price_cu, shippingInfoCu })
      total1 = calShippingCostCu({ type: 1, weight, totalPrice: total_price_cu, shippingInfoCu })
      total2 = calShippingCostCu({ type: 2, weight, totalPrice: total_price_cu, shippingInfoCu })
      total3 = calShippingCostCu({ type: 3, weight, totalPrice: total_price_cu, shippingInfoCu })
    }
    var canShip = true;
    if (total < 0) {
      // console.log(total)
      canShip = false;
      total = 0;
    }
    var error;
    if (total == -2) {
      error = 'OVERPRICE'
    }


    let tmp = {
      seller_id: s,
      canShip, error,
      total, total1, total2, total3
    }

    shipping.push(tmp)
  })
  console.log(shipping, 'shipping555')

  return shipping;
}

const dataCategory = (cate, main_category, sub_category, category) => {
  if (!cate) return [];
  var data = [];
  if (main_category) {
    if (sub_category) {
      if (category) {

        let subs = cate?.find(val => val.id == main_category)?.subs?.filter(item => sub_category.includes(item.id.toString()));
        for (let sub_item of subs) {
          let items = sub_item?.items?.filter(item => category.includes(item.id.toString()))
          data = [...data, ...items]
        }
      } else {
        data = cate?.find(val => val.id == main_category)?.subs?.filter(item => sub_category.includes(item.id.toString()));
      }
    } else {
      data = cate?.filter(val => val.id == main_category);
    }
  }
  return data;
}

const serializeURL = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      if (Array.isArray(obj[p])) {
        obj[p].forEach(val => {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(val));
        })
      }
      else {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }

    }
  return str.join("&");
}

const getUrlProduct = (product) => {
  let href = `/[product_cate]/[product_id]?product_cate=${product && product.main_url_name ? product.main_url_name : 'other'}&product_id=${product && product.id ? product.id : 0}`;
  let as = `/${product && product.main_url_name ? product.main_url_name : 'other'}/${product && product.id ? product.id : 0}`;
  return {
    href, as
  }
}

const getUrlCategory = (product, level) => {
  let path = product.type == 'book' ? 'books' : product.type == 'ebook' ? 'ebooks' : product.type == 'course' ? 'courses' : 'stationeries';
  var href;
  var as;
  if (level == 1) {
    href = `/${path}/[main_category]?main_category=${product.main_url_name}`;
    as = `/${path}/${product.main_url_name}`;
  }
  if (level == 2) {
    href = `/${path}/[main_category]/[sub_category]?main_category=${product.main_url_name}&sub_category=${product.sub_url_name}`;
    as = `/${path}/${product.main_url_name}/${product.sub_url_name}`;
  }
  if (level == 3) {
    href = `/${path}/[main_category]/[sub_category]/[category]?main_category=${product.main_url_name}&sub_category=${product.sub_url_name}&category=${product.item_url_name}`;
    as = `/${path}/${product.main_url_name}/${product.sub_url_name}/${product.item_url_name}`;
  }
  return {
    href, as
  }
}

const getUrlCategoryFilter = (mainData, subData, cateData, type, currentLanguage) => {
  let path = type == 'book' ? 'books' : type == 'ebook' ? 'ebooks' : type == 'course' ? 'courses' : 'stationeries';
  var url;
  if (mainData && subData && cateData) {
    // href = `/${path}/[main_category]/[sub_category]/[category]?main_category=${mainData.url_name}&sub_category=${subData.url_name}&category=${cateData.url_name}`;
    url = `${currentLanguage == 'en' ? '/en' : ''}/${path}/${mainData.url_name}/${subData.url_name}/${cateData.url_name}`;
  } else if (mainData && subData && !cateData) {
    // href = `/${path}/[main_category]/[sub_category]?main_category=${mainData.url_name}&sub_category=${subData.url_name}`;
    url = `${currentLanguage == 'en' ? '/en' : ''}/${path}/${mainData.url_name}/${subData.url_name}`;
  } else if (mainData && !subData && !cateData) {
    // href = `/${path}/[main_category]?main_category=${mainData.url_name}`;
    url = `${currentLanguage == 'en' ? '/en' : ''}/${path}/${mainData.url_name}`;
  } else {
    // href = `/categories`;
    url = `${currentLanguage == 'en' ? '/en' : ''}/categories`;
  }
  return {
    url
  }
}

export default {
  serializeURL,
  formatDate,
  getUrlProduct,
  getUrlCategory,
  getUrlCategoryFilter,
  groupBy,
  dataCategory,
  toJson: (formData) => {
    var object = {};
    formData.forEach((value, key) => { object[key] = value });
    return object;

  },
  getQueryString: (data = {}) => {
    return Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  },
  currencyFormatDE,
  calShelfPromotion,
  calWeightBook,
  calWeightAllBook,
  summaryPriceBook,
  calShipping,
  calShippingSeller,
  calAll: async (user, selected_address, type_shipment, member = false, selected_in_cart = null) => {
    let { cart } = user
    let total = summaryPriceBook(cart, selected_in_cart),
      discount_shelf = await calShelfPromotion(cart, selected_in_cart),
      total_discount = total - (discount_shelf.total_discount),
      weight = calWeightAllBook(cart, selected_in_cart),
      shipping = user.addresses.length > 0 ? calShipping(weight, total_discount, user, selected_address, type_shipment) : 0,
      // member_discount = (member && user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N") ? total_discount*0.1 : 0,
      member_discount = 0,
      net_price = total_discount + shipping - member_discount;
    return {
      total, discount_shelf, total_discount, weight, shipping, member_discount, net_price
    }
  },
  calAllSeller: async (user, cartDetail, shippingInfo, promotion, shippingInfoCu) => {

    let { cart } = user,

      promotion_discount = promotion ? promotion.price : 0,
      total = summaryPriceBook(cart, cartDetail.cart_id),


      discount_shelf = await calShelfPromotion(cart, cartDetail.cart_id),
      total_discount = total - (discount_shelf.total_discount),
      total_price_cu = summaryPriceSeller(cart, cartDetail.cart_id, 'cu') - discount_shelf.discount - discount_shelf.dis_for_web_cu - promotion_discount,
      shipping_list = calShippingAllSeller(user, cartDetail, shippingInfo, total_price_cu, shippingInfoCu, discount_shelf),
      shipping = shipping_list.length > 0 ? shipping_list.reduce((price, s) => { return price + s.total }, 0) : 0,

      net_price = total_discount + shipping;
    // console.log('net_price', net_price);
    return {
      total, total_price_cu, discount_shelf, total_discount, shipping_list, shipping, net_price
    }

  }
}