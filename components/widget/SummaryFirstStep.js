import classNames from 'classnames'
import { useEffect, useState } from 'react'
import Loadbutton from '../../components/widget/Button'
import api from '../../utils/api'
import { Link, Router, withTranslation } from '../../utils/i18n'
import tools from '../../utils/tools'
import ModalPoint from '../modal/point'
import ModalAddress from '../modal/selector_address'
import SelectorShipment from '../modal/selector_shipment'
import ModalEbook from './ModalEbook'

const SummaryFirstStep = ({ t, user, setUser, calDetail, promotion, setPromotion, setCalDetail, setCartDetail, cartDetail, setStep, pointState, setPointState, setCalDetailTemp }) => {
  const [loading, setLoadding] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [require_tax, setRequire_tax] = useState(0);

  const [showPoint, setShowPoint] = useState(false);
  const pointClose = () => setShowPoint(false);
  const pointShow = () => setShowPoint(true);

  const [showAddress, setShowAddress] = useState(false);
  const showAddressClose = () => setShowAddress(0);
  const showAddressShow = (index) => setShowAddress(index);

  const [tax_address, setTaxAddress] = useState(null);
  const [checkcode, setCode] = useState(null);
  const [promotionErr, setPromotionErr] = useState(null);
  const [error, setError] = useState(null)

  const [address_id, setAddress] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);

  const [changePackage, setHandleChangePackage] = useState(null)
  const [cart, setCart] = useState([]);
  const [shippingInfoCu, setShippingInfoCu] = useState(null)

  const [shippingClick, setShippingClick] = useState('cu');

  const [modalebook, setModalebook] = useState(false);


  useEffect(() => {
    if (!user || !cart.length) return;
    // if(user.cart.length == 0 && !cart.find(c => c.cart_type == 'express')){
    //   Router.push('/')
    // }
    if (user.addresses.length == 0) {
      localStorage.removeItem("pass")
      Router.replace('/')
      return
    }
  }, [user, cart])

  const getPromoCode = () => {
    const data = new FormData(event.target)
    event.preventDefault()
    const jsonData = tools.toJson(data);
    var code = jsonData['code'];
    if (!code) {

      if (checkcode) {
        clearPromotion();
      }
      else {
        setPromotionErr(`${t('please_select_code')}`)
      }

      return;
    }
    api.getPromotion(code)
      .then(res => {
        const data = res.data;
        if (!data || data.status == 0 || (data.amount_limit == 1 && data.amount <= 0) || (data.time_limit != 0 && !(data.time_limit == 1 && new Date(data.start_date) < Date.now() && new Date(data.end_date) > Date.now()))) {
          setPromotionErr(`${t('code_expired')}`)
          if (promotion) setPromotion(null);
          if (checkcode) setCode(null)
          return;
        }
        setPromotionErr(null)
          ;
        calPromotionDiscount(data);
      })
      .catch(err => {

        console.log(err);
        if (err.response) {
          console.log(err.response)
        }
      })
  }


  const calPromotionDiscount = (data) => {
    const { seller_id = 'cu', use_with, apply_with, category_id, products_in, user_id: only_user } = data;
    var cart;

    if (only_user) {
      let users_id = only_user.split(',')
      if (!users_id.includes(user.id)) {
        return setPromotionErr(`${t('ไม่ผ่านเงื่อนไขโปรโมชั่น')}`)
      }
    }

    let con1 = use_with == 'platform'
    if (apply_with == 'category') {

      cart = cartDetail.cart.filter(val => (val.seller_id == seller_id || con1) && (val.cate == category_id || val.cate_id == category_id))

    }
    else if (apply_with == 'product') {
      const product_id_arr = products_in.map(val => parseInt(val.product_id))
      cart = cartDetail.cart.filter(val => (val.seller_id == seller_id || con1) && product_id_arr.includes(parseInt(val.product_id)))

    }
    else {
      cart = cartDetail.cart.filter(val => (val.seller_id == seller_id || con1))

    }
    // other_cart = cartDetail.cart.filter(val => val.seller_id != seller_id )



    if (!cart.length) {
      return setPromotionErr(`${t('not_found_promotion_products')}`)
    }
    // let total_price = cart.reduce((a,b) => a+b.price);
    let tp = 0;
    const discount_list = calDetail.discount_shelf ? calDetail.discount_shelf.discount_list : []
    cart.forEach(val => {
      let total_discount = 0;
      const index = discount_list.findIndex(d => d.product_id == val.product_id)
      if (index != -1) {
        let dis_for_web = (val.cover_price - val.price) * (val.quantity - discount_list[index].qty)
        //console.log(dis_for_web)
        let extra_discount = discount_list[index].total_discount
        total_discount = dis_for_web + extra_discount;
      }
      else {
        total_discount = (val.cover_price - val.price);
      }
      tp += val.cover_price * val.quantity - total_discount
    })


    // const {discount,dis_for_web_cu} = calDetail.discount_shelf
    let total_price_cu = calDetail.total_price_cu;

    //tp - calDetail.discount_shelf.discount

    let total_price = tp;
    // console.log('calDetail',calDetail)
    // console.log(use_with,total_price,total_price_cu,tp)
    if (checkcode != data.promotion_code) {
      var dis = 0;

      if (data.min_discount && total_price < data.min_discount) {
        dis = 0;
      }
      else if (data.type == 4) {
        dis = parseFloat(total_price * data.discount1 / 100);
        console.log(dis)
      } else if (data.type == 5) {
        dis = parseFloat(data.discount1);
      }

      if (data.max_discount && dis > data.max_discount)
        dis = parseFloat(data.max_discount)

      if (dis > total_price)
        dis = total_price;

      data.price = parseFloat(dis);
      setPromotion(data);
      var tmp = { ...calDetail };
      tmp.promotion = data;
      tmp.discount = dis;
      setCalDetail(tmp)

      if (!dis) {
        return setPromotionErr(`${t('ไม่ผ่านเงื่อนไขโปรโมชั่น')}`)
      }
      else {
        setCode(data.promotion_code);
      }
    }





  }

  const clearPromotion = () => {
    // alert('asdas')
    var tmp = { ...calDetail };
    tmp.promotion = null;
    tmp.discount = 0;
    setPromotion(null)
    setCode(null)
    setCalDetail(tmp)
  }

  const setData = () => {
    var shipping_type = cartDetail.shipping_type;
    var area;
    var getarea;

    getarea = user.addresses.find((item) => item.id == cartDetail.address_id).province_code

    var setarea = ['10', '11', '12', '13'];
    var area;
    if (setarea.includes(getarea)) {
      area = 1;
    } else {
      area = 0;
    }

    if (shipping_type == 1) {
      area = 2;
    }

    var type = 'qr';
    var seller = { ...cartDetail.seller }

    for (var key of Object.keys(seller)) {
      let seller_info = shippingInfo.find(s => s.id == key)
      if (!seller_info) {
        delete seller[key];
        continue;
      }
      if (!seller_info.carts.length) delete seller[key];
    }

    var cart_data = { seller, carts: cartDetail.cart_id, address_id: cartDetail.address_id, tax_address_id: cartDetail.tax_address, area, shipping_type, type, user_id: user.id, use_point: pointState };
    return cart_data;
  }

  const saveOrder = () => {
    setLoadding(true);
    var pass = JSON.parse(localStorage.getItem('pass'));
    //let cart = [];


    // localStorage.removeItem('pass')
    var cart_data = setData();
    cart_data.require_tax = require_tax;
    cart_data.promotion = checkcode;
    let haveItemEbook = false;
    for (let i = 0; i < cart.length; i++) {
      let item = cart[i];
      if (item?.type == "ebook") {
        haveItemEbook = true;
        break;
      }
    }
    if (haveItemEbook) {
      setModalebook(true);
      setLoadding(false);
    } else {
      api.getQRCode({ cart_data, qrcode: false, order_from: 'desktop' })
        .then(res => {
          const data = res.data;
          const { order } = data;
          console.log({ order })
          if (order && order.status > 1) {
            Router.push(`/user/success_order/[order_id]?order_id=${data.order_id}`, `/user/success_order/${data.order_id}`);
            return;
          }
          var temp = user;
          temp.carts = [];
          var tmp = cartDetail
          tmp.order_id = data.order_id
          tmp.order = data.order
          setCalDetailTemp(calDetail)
          setCartDetail(tmp)
          setStep(2);
          setLoadding(false);



        })
        .then(() => {
          let tmp = { ...user };
          if (pass && pass.cart) {
            tmp.cart = tmp.cart.filter((c) => c.id != pass.cart.id)
          } else {
            tmp.cart = tmp.cart.filter(val => !cart_data.carts.includes(val.id));
          }
          setUser(tmp);
        })
        .catch(err => {
          setError(err)
          setLoadding(false);
          console.log(err.response);
          console.log(err)
        })
    }

  }

  const handleAfterPassPage = () => {
    // เรียก getQRCode ต่อ
    var cart_data = setData();
    cart_data.require_tax = require_tax;
    cart_data.promotion = checkcode;

    api.getQRCode({ cart_data, qrcode: false, order_from: 'desktop' })
      .then(res => {
        const data = res.data;
        const { order } = data;
        if (order && order.status > 1) {
          Router.push(`/user/success_order/[order_id]?order_id=${data.order_id}`, `/user/success_order/${data.order_id}`);
          return;
        }
        var tmp = cartDetail
        tmp.order_id = data.order_id
        tmp.order = data.order
        setCalDetailTemp(calDetail)
        setCartDetail(tmp)
        setStep(2);
        setLoadding(false);
      })
      .catch(err => {
        console.log(err.response)
        setError(err);
        setLoadding(false);
      });
  }


  const getUsePoint = () => {
    const data = new FormData(event.target)
    event.preventDefault()
    const point = parseInt(tools.toJson(data).point);
    const POINT_BALANCE = parseInt(user.member.POINT.replace(/,/g, ''));

    let _mod = parseInt(POINT_BALANCE / 80),
      mod = parseInt(point / 80)

    var inputPoint = document.getElementById("point");

    if (mod <= _mod)
      inputPoint.value = mod * 80;
    else {
      alert(`${t('not_enough_points')}\n${t('you_have_points')} : ` + POINT_BALANCE)
      inputPoint.value = (_mod * 80)
    }
    setPointState(inputPoint.value)

  }

  // console.log(calDetail)

  useEffect(() => {
    var pass = JSON.parse(localStorage.getItem('pass'));
    let cart_tmp = [];
    // let _user = user;


    if (pass == null)
      Router.push('/')



    if (pass && user) {
      if (pass.cart) {
        // let tmp = {...user};
        cart_tmp.push({ ...pass.cart, cart_type: 'express' });
        // setUser(tmp);
      }
      else {
        user.cart.forEach((product) => {
          if (pass.cart_id.includes(product.id))
            cart_tmp.push({ ...product })
        })
      }


      pass.cart = cart_tmp

      setCart(cart_tmp)
      if (cart_tmp.length == 0) {
        Router.push('/')
        return
      }

      let tax_list = user.addresses.filter((address) => address.at == 'tax').sort((a, b) => b.tax - a.tax)
      if (tax_list.length > 0) {
        pass.tax_address = tax_list[0].id
      }

      //   let count = Object.keys(tools.groupBy(user.cart,'seller_id')).length;
      // if(count == 0){
      //   Router.push('/user/no-cart')
      // }

      if (!shippingInfo) {
        const seller_obj = tools.groupBy(cart_tmp, 'seller_id');
        api.getShipmentInfo({ seller_id: Object.keys(seller_obj) })
          .then(res => {
            let data = [];
            // console.log(tools.groupBy(pass.cart,'seller_id')['cu'])
            if (seller_obj['cu'] && seller_obj['cu'].length > 0) {
              data.push({ id: 'cu' })
            }
            data.push(...res.data)

            if (!pass.seller) {
              pass.seller = {}

              data.forEach((dt, index) => {
                pass.seller[dt.id] = {};
                pass.seller[dt.id].shipping_type = 2
                if (dt.id != 'cu') {
                  let ship = dt.seller_shippings.find(ship => ship.status == 1)
                  pass.seller[dt.id].shipping_type = ship ? ship.shipping_type : 1
                }
              })
            }
            let cart_id = cart_tmp.map(v => v.id)
            data.forEach((dt, index) => {
              let filtered_cart = seller_obj[dt.id].filter(val => cart_id.includes(val.id))
              // console.log('filtered_cart',filtered_cart)
              let ship = filtered_cart.findIndex(val => val.type != 'ebook' && val.type != 'course') != -1;
              data[index].carts = filtered_cart
              data[index].ship = ship
            })

            // console.log('cart_id',cart_id)
            // console.log('info',data)
            setCartDetail(pass)
            setShippingInfo(data)


          })
          .catch(err => {
            console.log(err);
          })
      } else {
        setCartDetail(pass)
      }

      // 

      setAddress(pass.address_id)
      // tools.calAll(user,pass.address_id,pass.shipping_type,user && user.member && user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ,pass.cart_id).then(data=>{
      //   setCalDetail(data);
      //   setUser(_user)
      // })
    }
  }, [])

  useEffect(() => {
    if (cartDetail.address_id == 0) return;

    // console.log('address changed!')
    let address = user.addresses.find(ad => ad.id == cartDetail.address_id)

    if (!address) return

    // console.log('asdad')
    api.getShippingInfoCU({ province_code: address.province_code })
      .then(res => setShippingInfoCu(res.data))
      .catch(err => {
        setShippingInfoCu(-1)
        console.log(err);
        console.log(err.response)
      })
  }, [cartDetail.address_id])

  // useEffect(()=>{
  //   cartDetail && tools.calAll(user,cartDetail.address_id,cartDetail.shipping_type,user && user.member && user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ,cartDetail.cart_id).then(data=>{
  //     setCalDetail(data)
  //   })
  // },[pointState])

  useEffect(() => {
    if (!user || !cartDetail || !shippingInfo || !shippingInfoCu) {
      return;
    }

    tools.calAllSeller({ ...user, cart }, cartDetail, shippingInfo, promotion, shippingInfoCu).then(data => {
      setCalDetail(data)
    })
  }, [cartDetail, shippingInfo, show, promotion, shippingInfoCu]);

  const handleChange = (e) => {
    var chk = e.target.checked;
    if (chk == true) {
      setRequire_tax(1);
    } else {
      setRequire_tax(0);
    }
  }



  const SellerSummary = ({ list, seller_id, number = 1, data }) => {

    //console.log('list',list)
    var isAllEbook = false;
    if (list) {
      let index = list.findIndex(val => val.item_code)
      // console.log('index',index)
      isAllEbook = index == -1
    }

    // console.log('isAllEbook',isAllEbook)
    const Footbar = () => {

      const handleChangeSeller = (type) => {
        let tmp = cartDetail;
        if (seller_id == 'cu')
          tmp.shipping_type = type;
        tmp.seller[seller_id].shipping_type = type
        setCartDetail(tmp)
        setShow(false);
      }


      const [type, setType] = useState((cartDetail && cartDetail.seller && cartDetail.seller[seller_id]) && cartDetail.seller[seller_id].shipping_type || 1)
      const showSelector = () => {
        setHandleChangePackage({
          handle: handleChangeSeller,
          seller: shippingInfo.find((info) => info.id == seller_id),
          shippingCost: calDetail.shipping_list.find(val => val.seller_id == seller_id),
          list: ((seller_id != 'cu') ? shippingInfo.find((info) => info.id == seller_id).seller_shippings : [{ shipping_type: 1 }, { shipping_type: 2 }]),
          type: type || 1
        })
        handleShow()
        setShippingClick(shippingInfo.find((info) => info.id == seller_id));
      }

      let canShip = (calDetail && calDetail.shipping_list) ? calDetail.shipping_list.find((sl) => sl.seller_id == seller_id).canShip : true;
      let calShipping = (calDetail && calDetail.shipping_list) ? calDetail.shipping_list.find((sl) => sl.seller_id == seller_id).total : 0;



      return (
        <tr className="bg-change">
          <td colSpan="6">
            <div className="d-flex justify-content-between">
              <p className="p-medium">{t('translations:shipping_options')}</p>

              {
                data.ship ? (
                  type == 1 ?
                    <p className="text-pink">{t('translations:standard_delivery_m')}</p>

                    :
                    type == 2 ?
                      <p className="text-pink">{t('translations:express_delivery_m')}</p>
                      :
                      <p className="text-pink">{t('translations:cod_delivery_m')}</p>
                )
                  : null
              }
              {
                data.ship ? (
                  !canShip ? (
                    <p className="text-num">{t('ไม่จัดส่ง')}</p>
                  )
                    :
                    calShipping == 0 || calShipping == '0.00' ? (
                      <p className="text-num">{t('translations:free_shipping')}</p>
                    ) : (
                      <p className="text-num">฿ {tools.currencyFormatDE(calShipping)}</p>
                    )
                )
                  : null

              }
              {
                data.ship && (
                  <p className="change-track font-weight-bold ">
                    <a onClick={showSelector} className="change-shipping-s text-white">
                      {t('change')}
                    </a>
                  </p>
                )
              }

            </div>
          </td>
        </tr>
      )
    }
    // console.log(user)
    // console.log(calDetail)

    const Product = (props) => {
      const { product: val, total_price } = props;
      var total_discount = (val.cover_price * val.quantity) - total_price;
      return (
        <tr key={val.id}>
          <td>
            <div className="img-cart">
              {
                (val.video_type == 0 || val.video_type == null) && (
                  <img src={val.picture ? val.picture : '/images/book.png'} />
                )
              }
              {
                (val.video_type == 1 || val.video_type == 2) && (
                  <img src={'/images/video.svg'} className="mh-100 video" />
                )
              }
            </div>
          </td>
          <td>
            <Link  {...tools.getUrlProduct(val)}>
              <a><p className="text-dark p-medium product_name_2row">{val.name}</p></a>
            </Link>
            <p className="p-14 text-grey">{val.author}</p>
            <div className="d-flex align-items-center">
              <div className={classNames("tag-cat ", {
                "tag-book": (val.type == 'book'), "tag-stationary": (val.type == 'non_book'), "tag-ebook": (val.type == 'ebook'), "tag-course": (val.type == 'course'),
                "tag-course-ecode": (val.type == 'course_ecode')
              })}>{(val.type == 'book') ? t('header:book_menu') : val.type == 'non_book' ? t('header:stationary') : val.type == 'ebook' ? t('header:e_book') : val.type == 'course_ecode' ? t('header:course_online_ecode') : val.type == 'course' && t('header:course_online')}</div>
              {!!val.is_preorder && <div className={classNames("tag-cat px-3")} style={{ backgroundColor: '#DE5C6E' }}>Preorder</div>}
            </div>
            {
              calDetail && calDetail.discount_shelf && calDetail.discount_shelf.cart_promotion && calDetail.discount_shelf.cart_promotion.find((c) => c.id == val.product_id) ?
                <p className="font-12 text-grey mt-1 border-promotion">
                  {calDetail.discount_shelf.cart_promotion.find((c) => c.id == val.product_id).promotion}
                </p> : ''
            }
          </td>
          <td className="text-center">
            {
              val.cover_price == 0 ? (
                <>
                  <p className="text-ebook">{t('free')} </p>
                  {/* <p className="cart-discount"><span className="position-relative">฿ {tools.currencyFormatDE(val.cover_price)}</span></p> */}
                </>
              ) : (
                <>
                  <p className="cart-no-discount"><span className="position-relative">฿ {tools.currencyFormatDE(val.cover_price)}</span></p>
                </>
              )
            }
          </td>
          {
            <td className="text-right">
              {
                total_price ? (
                  <>
                    <p className="cart-price">฿ {tools.currencyFormatDE(total_price)}</p>
                    {
                      !!total_discount && (
                        <>
                          <p className="text-prayut">ประหยัด</p>
                          <p className="cart-price-prayut"><span className="position-relative">฿ {tools.currencyFormatDE(total_discount)}</span></p>
                        </>
                      )
                    }
                  </>
                ) : (
                  <p className="text-ebook">{t('free')} </p>
                )
              }
            </td>
          }
          <td className="cart-q text-right">
            {t('quantity')} : {val.quantity}
          </td>
        </tr>
      )
    }


    return (
      <div className="bg-white br-8 mt-4">
        <div className="d-flex justify-content-between p-3">
          <div>{t('package')} {number}</div>
          <div>{t('transpot_by')} : <font className="font-weight-bold">{seller_id == 'cu' ? 'CHULABOOK' : shippingInfo.find((info) => info.id == seller_id).shop_name}</font></div>

        </div>
        <table className="table table-cart table-sum">
          <tbody>
            <tr>
              <td></td>
              <td>ชื่อสินค้า</td>
              <td className="text-center">ราคา/หน่วย</td>
              <td className="text-right">ราคารวม</td>
              <td></td>
            </tr>
            {
              list.map((val) => {
                let total_price = val.cover_price * val.quantity;
                if (calDetail && calDetail.discount_shelf) {
                  let { discount_list } = calDetail.discount_shelf;
                  let item = discount_list.find(d => d.product_id == val.product_id)
                  if (item) {
                    total_price -= item.total_discount + item.discount_web;
                  }

                }
                return <Product product={val} total_price={total_price} />
              })
            }
            <Footbar />
          </tbody>
        </table>
      </div>
    )
  }

  const calNetTotal = () => {
    if (!calDetail) return 0;
    let total_price = calDetail.total_discount;
    let member_discount = (parseInt(pointState) / 8)
    let promotion_discount = promotion && promotion.price ? promotion.price : 0

    if (total_price - promotion_discount < 0) {
      promotion_discount = total_price;

    }


    total_price -= promotion_discount;
    total_price += calDetail.shipping;

    if (total_price - member_discount < 0) {
      member_discount = total_price;
      // total_price -= member_discount;
    }
    total_price -= member_discount;

    // console.log('member_discount',member_discount,pointState)
    return total_price

    // total_price = total_price- promotion_discount-member_discount
    // if(total_price < 0) total_price = 0
    // return total_price   + calDetail.shipping;

  }

  const canShipping = () => {
    if (!calDetail.shipping_list) return false;
    // console.log(calDetail)
    for (let i = 0; i < calDetail.shipping_list.length; i++) {
      if (!calDetail.shipping_list[i].canShip) return false;
    }

    return true;
  }

  const canCodShip = () => {
    if (!cartDetail.seller || !shippingInfo) return true;
    // console.log(calDetail)
    var cod_count = 0;
    var checked_sellers_count = 0;
    // console.log(shippingInfo)
    for (var key of Object.keys(cartDetail.seller)) {
      let seller_info = shippingInfo.find(s => s.id == key)
      if (!seller_info) return true;
      if (seller_info.carts.length) checked_sellers_count++;
      if (cartDetail.seller[key].shipping_type == 3 && seller_info.carts.length) cod_count++;
    }
    // console.log(checked_sellers_count,cod_count)
    // return cod_count == 0 || cod_count == Object.keys(cartDetail.seller).length
    if (cod_count == 0) return true;
    else if (cod_count == checked_sellers_count) return true;
    else return false;

  }
  var selectedAddress, taxAddress;
  if (user && cartDetail) {
    selectedAddress = user.addresses.find((a) => a.id == cartDetail.address_id)
  }
  if (user && cartDetail && cartDetail.tax_address) {
    taxAddress = user.addresses.find((a) => a.id == cartDetail.tax_address)
  }

  // console.log('calDetail', calDetail);
  // console.log('promotion', promotion);

  var limit_point = 0;
  if (calDetail) {
    limit_point = calDetail.total_discount;
  }
  if (promotion) {
    limit_point = limit_point - promotion.price;
  }

  limit_point = limit_point + (calDetail ? calDetail.shipping : 0);

  console.log('limit_point', limit_point);

  // const Limit_point = calDetail && (calDetail.total_discount - (promotion.price)) ;


  return (
    <>
      {(cartDetail && user) &&
        <>
          <div className="container pt-5">
            <div className="row">
              <div className="col-xl-8 col-12 mb-4 mb-xl-0">
                <div className="row mx-0">
                  <div className="col-12 px-0">
                    <div className="bg-white br-8">
                      <table className="table table-cart table-cart2">
                        <tr>
                          <td colSpan="3">{cartDetail.cart ? cartDetail.cart.length : ''} {t('piece')}</td>
                          <td>{t('price')}</td>
                          <td className="text-right">{t('quantity')}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row mx-0">
                  <div className="col-12 px-0">
                    {
                      shippingInfo ? shippingInfo.map((seller, index) => {
                        let list = cart.filter((c) => c.seller_id == seller.id && cartDetail.cart_id.includes(c.id))

                        return <SellerSummary list={list} seller_id={seller.id} key={seller.id} data={seller} number={index + 1} />
                      }) : ''
                    }
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-12">
                <div className="row mx-0">
                  <div className="col-12 px-0">
                    <div className="bg-white br-8 p-3">
                      <div>
                        <div>
                          <h5>{t('address_or_tax_detail')}</h5>
                          <div className="addresss mt-3">
                            <p className="text-address">
                              <font className="font-weight-bold">{selectedAddress && selectedAddress?.firstname + ' ' + selectedAddress?.lastname}</font><br></br>
                              {selectedAddress && selectedAddress?.full_address}
                            </p>
                            <p className="text-num" style={{ textDecoration: 'underline', color: '#999899' }} onClick={() => { showAddressShow(1) }}>{t('changeAddress')}</p>
                          </div>
                        </div>
                        <div className="pt-3">
                          <div className="form-group">
                            <div className="custom-control custom-checkbox">
                              <input type="checkbox" className="custom-control-input" id="chk1" name="require_tax" value={require_tax} onChange={(e) => handleChange(e)} />
                              <label className="custom-control-label" htmlFor="chk1">
                                <p className="mb-0">{t('request_tax')}</p>
                              </label>
                            </div>
                          </div>
                        </div>
                        {
                          require_tax ?
                            <div className="mt-1 mb-2">
                              <div className="addresss">
                                {
                                  (taxAddress) ? (
                                    <>
                                      <p className="text-address">
                                        <font className="font-weight-bold">{taxAddress?.firstname + ' ' + taxAddress?.lastname}</font><br></br>
                                        {taxAddress?.full_address}
                                      </p>
                                      <p className="text-num" style={{ textDecoration: 'underline', color: '#999899' }} onClick={() => { showAddressShow(2) }}>{t('changeTax')}</p>
                                    </>
                                  ) : (
                                    <div className="text-left">
                                      <div className="mb-3">
                                        <button className="btn btn-primary" onClick={() => { showAddressShow(2) }}>+ {t('translations:add_new_tax')}</button>
                                      </div>
                                    </div>
                                  )
                                  // ) : (
                                  //     <h5>
                                  //       {t('address_tax')}d<br></br>
                                  //       {t('as_define')}
                                  //     </h5>
                                  //   )
                                }
                              </div>
                            </div> : ''
                        }
                      </div>
                      <div className="">
                        <h5>{t('used_coupon')}</h5>
                        <div className="mt-3">
                          <form onSubmit={getPromoCode}>
                            <div className="form-group d-flex">
                              <input type="text" name="code" placeholder={t('placeholder_coupon')} minLength="6" maxLength="10" className="form-control" />
                              <button className="btn-promotion btn-outline-primary ml-5">{t('confirm')}</button>
                            </div>
                            {promotionErr && <p style={{ fontSize: "12px", color: "red" }}>{promotionErr}</p>}
                          </form>
                        </div>
                      </div>
                      {
                        user && user.member && user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ? (
                          <div className="">
                            <h5>{t('label_point')}</h5>
                            <div className="mt-3">
                              <form onSubmit={getUsePoint}>
                                <div className="form-group d-flex">
                                  <input type="text" name="point" placeholder={t('placeholder_point')} value={pointState == 0 ? '' : pointState} maxLength="6" id="point" className="form-control" onClick={() => setShowPoint(true)} />
                                  {/*<button className="btn-promotion btn-outline-primary ml-5">{t('confirm_member')}</button>*/}
                                </div>
                              </form>
                            </div>
                          </div>
                        ): (
                          <div className="mt-3 text-center">
                            <p>สมัครสมาชิกเพื่อสะสมแต้ม แลกส่วนลด</p>
                            <button 
                              className="btn btn-primary"
                              onClick={() => Router.push('/user/member')}
                            >
                              สมัครสมาชิก
                            </button>
                          </div>
                        )
                      }
                      {calDetail &&
                        <div className="mt-4">
                          <h5>{t('order_summary')}</h5>
                          <div className="sum mt-3">
                            <div className="sum-price d-flex justify-content-between">
                              <p>{t('product_price')}</p>
                              <p className="text-num">฿ {tools.currencyFormatDE(calDetail.total)}</p>
                            </div>

                            {
                              user && (
                                <>
                                  <div className="sum-price d-flex justify-content-between">
                                    <h5>{t('label_discount')}</h5>
                                    <p className="text-num">- {tools.currencyFormatDE(calDetail.discount_shelf.total_discount)}</p>
                                  </div>
                                  <hr />
                                  <div className="sum-price d-flex justify-content-between">
                                    <h5>{t('total_price')}</h5>
                                    <p className="text-num">฿ {tools.currencyFormatDE(calDetail.total_discount)}</p>
                                  </div>
                                  <hr />

                                </>
                              )
                            }

                            {promotion ? (
                              <>

                                <div className="sum-price d-flex justify-content-between">
                                  <p>{t('used_coupon')}</p>
                                  <p className="text-num">- {tools.currencyFormatDE(promotion.price)}</p>
                                </div>
                                <p className="p-12 text-gray">{promotion.promotion_name}</p>
                                <hr />
                              </>
                            ) : ''
                            }


                            <div className="sum-price d-flex justify-content-between">
                              <p>{t('transpot_cost')}</p>
                              <p className="text-num">
                                {
                                  user ? (
                                    user.addresses.length > 0 ? (
                                      <>
                                        ฿ {tools.currencyFormatDE(calDetail.shipping)}
                                      </>
                                    ) : (
                                      <button className="btn btn-primary" onClick={handleShow}>{t('add_address')}</button>
                                    )
                                  ) : ''
                                }
                              </p>
                            </div>
                            <hr />

                            {pointState > 0 ? (
                              <>

                                <div className="sum-price d-flex justify-content-between">
                                  <h5>{t('label_point')}</h5>
                                  <p className="text-num">- {tools.currencyFormatDE(pointState / 8)}</p>
                                </div>
                                <hr />
                              </>
                            ) : ''
                            }

                            {user && user.member && user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" && calDetail.member_discount > 0 ? (
                              <div className="sum-price d-flex justify-content-between">
                                <h5>{t('label_member')}</h5>
                                <p className="text-num">- {tools.currencyFormatDE(calDetail.member_discount)}</p>
                              </div>
                            ) : ''
                            }


                            <div className="mt-4 sum-all d-flex justify-content-between">
                              <p className="text">{t('net_price')}</p>
                              <p className="text-num">
                                {
                                  user && `฿ ${tools.currencyFormatDE(calNetTotal())}`
                                }
                              </p>
                            </div>

                            {error ? <div className="text-danger my-3">{t('save_order_error')}</div> : null}
                            {!canCodShip() ? <div className="text-danger my-3">{t('cod_cant_ship')}</div> : null}
                            <div className="mt-3">
                              {
                                user ? (
                                  user.addresses.length > 0 && canShipping() && canCodShip() ? (
                                    <Loadbutton loading={loading} name={t('next_to_payment')} click={() => { saveOrder() }} />
                                    // <button type="button" className="btn btn-primary w-100" onClick={() => { saveOrder() }}>{t('next_to_payment')}</button>
                                  ) : (
                                    <button type="button" className="btn btn-disabled w-100" disabled>{t('next_to_payment')}</button>
                                  )
                                ) : ''
                              }

                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            show &&
            <SelectorShipment handleClose={handleClose} packageInfo={changePackage} show={show} shippingClick={shippingClick} />
          }
          {
            showPoint &&
            <ModalPoint user={user} show={showPoint} order_price={limit_point} action={setPointState} handleClose={pointClose} pointState={pointState} />
          }
          {
            showAddress && cartDetail &&
            <ModalAddress cartDetail={cartDetail} setUser={setUser} setCalDetail={setCalDetail} setAddress={(address_id) => setCartDetail({ address_id })} setCartDetail={setCartDetail} user={user} show={showAddress} handleClose={showAddressClose} />
          }
          <ModalEbook show={modalebook} setShow={setModalebook} t={t} setStep={setStep} onPassPage={handleAfterPassPage} />
        </>
      }
    </>
  )
}

export default withTranslation(['shippingInfo'])(SummaryFirstStep)