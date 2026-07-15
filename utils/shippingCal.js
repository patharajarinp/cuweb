
const api_list = [
    'ALPHA',
    'HAPPY'
]

function calShippingCostCu({ type, weight, totalPrice, shippingInfoCu, isSeller }) {
    // type = type == 1 ? 'normal'  : type == 2 ? 'express' : 'cod'

    // console.log('weight',weight,'totalPrice',totalPrice)
    //price = -1  is not shipped
    if (shippingInfoCu == -1 || !shippingInfoCu) {
        //console.log('shippingInfoCu 1')
        return -1;
    }

    const { shipping_zone_types } = shippingInfoCu;

    // console.log('weight',weight)
    const zone = shipping_zone_types.find(z => z.type == type)

    if (!zone) {
        console.log('zone 1')
        return -1
    }

    const { enable_free_basket, free_minprice, shipping_prices } = zone;



    var price_key = 'price', company_key = 'company'
    if (enable_free_basket == 1 && totalPrice >= free_minprice) {
        price_key = 'price2'
        company_key = 'company2'
        // return 0;
    }

    // console.log('shipping_prices',shipping_prices)
    // console.log('weight',weight)

    const price_data = shipping_prices.find(p => weight > p.min_weight && weight <= p.max_weight)

    // console.log('price_data',price_data,totalPrice)
    console.log(weight, 'weight')
    if (!price_data) {
        console.log('price_data')
        return -1
    };

    // console.log()

    // if(isSeller && type == 3 && price_data[company_key] !== 'ALPHA'){
    //     return -1;
    // }
    if (isSeller && type == 3 && !api_list.includes(price_data[company_key])) {
        return -1;
    }

    if (price_data[company_key] === 'ALPHA' && totalPrice >= 10000 && type == 3) {
        return -2;
    }

    if (price_data[company_key] == 0) {
        return -1;
    }
    else {
        if (isSeller && !api_list.includes(price_data[company_key])) return -1;

        return price_data[price_key];
    }


}

function calShippingCostSeller({ type, weight, totalPrice = 0, sellerShippingInfo, shippingInfoCu }) {
    //price = -1  is not shipped
    let price = 0;
    if (!sellerShippingInfo) return price;
    let range = sellerShippingInfo.seller_shippings.find((ss) => ss.shipping_type == type)
    // console.log('sellerShippingInfo',range)
    if (type == 3) {
        if (sellerShippingInfo.support_cod != 1) {
            return -1
        }


        price = calShippingCostCu({ type, weight, totalPrice, shippingInfoCu, isSeller: true })
        // console.log('sellerShippingInfo',price,weight)
        return price
    }

    if (!range) return -1;
    if (range.status == 0) return -1;
    var range_data = range ? range.rate_list : [{ weight: 0, price: 0 }];
    range_data = range_data.sort((a, b) => b.weight - a.weight);


    var index = -1;
    // price = range_data.find((rg)=>{return weight >= rg.weight}).price
    for (var i = 0; i < range_data.length; i++) {
        if (weight >= range_data[i].weight) {
            price = range_data[i].price;
            index = i;
            break;
        }
    }
    // console.log('range_data',range_data)
    if (index === 0 && range.notShipped == 1) return -1;
    return price
    // return 0;
}

export { calShippingCostCu, calShippingCostSeller }