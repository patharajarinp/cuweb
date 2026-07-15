import {useState,useEffect} from 'react'
import ProductCart from './ProductCart'
import tools from '../../utils/tools'
const Footbar = ({t,calDetail,cartDetail,shippingInfo,handleShow2,
  ship,type,canShip,seller_id,setCartDetail,setShow2,
  calShipping,setHandleChangePackage, setShippingClick, seller}) => {

  const handleChangeSeller = (type) => {
    let tmp = {...cartDetail};
    if(seller_id == 'cu')
      tmp.shipping_type = type;
    tmp.seller[seller_id].shipping_type = type
    setCartDetail(tmp)
    setShow2(false);
  }
  // const type = (cartDetail && cartDetail.seller && cartDetail.seller[seller_id]) && cartDetail.seller[seller_id].shipping_type || 1

  const showSelector = () =>{
    setHandleChangePackage({
      handle:handleChangeSeller,
      seller : shippingInfo.find((info)=>info.id == seller_id),
      shippingCost : calDetail.shipping_list.find(val => val.seller_id == seller_id) ,
      list:((seller_id != 'cu') ? shippingInfo.find((info)=>info.id == seller_id).seller_shippings : [{shipping_type:1},{shipping_type:2}]),
      type : type || 1})
    handleShow2()
    setShippingClick(seller);
  }
  return (
    <tr className="bg-change">
      <td colSpan="100%">
        <div className="d-flex justify-content-between">
          <p className="p-medium">{t('translations:shipping_options')} </p>
         
          {
            ship ? (
              type == 1 ?
              <p className="text-pink">{t('translations:standard_delivery_m')}</p>
              :
              type == 2 ?
              <p className="text-pink">{t('translations:express_delivery_m')}</p>
              :
              <p className="text-pink">{t('translations:cod_delivery_m')}</p>
            )
            :null
            
          } 
          {
            ship ?(
              !canShip ? (
                  <p className="text-num">{t('ไม่จัดส่ง')}</p>
              )
              :
              calShipping == 0 || calShipping == '0.00' ? (
                <p className="text-num">{t('translations:free_shipping')}</p>
              ) :(
                <p className="text-num">฿ {tools.currencyFormatDE(calShipping)}</p>
              )
            )
            :null
            
          }
          {
            ship ?(
              <p className="change-track font-weight-bold ">
              <a onClick={showSelector} className="change-shipping-s text-white">
                {t('change')}
              </a>
            </p>
            )
            :null
          }
          
        </div>
      </td>
    </tr>
  )
}



const Seller = ({t,list,seller_id,data,calDetail,cartDetail,setCheckall,handleShow2,
  shippingInfo,handleCart,isCheck,setCartDetail,user,handleCheck,delCart,setHandleChangePackage,setShow2, setShippingClick}) =>{
  
    // console.log('aa',list.filter((cart)=>cartDetail.cart_id.includes(cart.id)).length,list.length)

  const [check,setCheck] = useState(list.filter((cart)=>cartDetail.cart_id.includes(cart.id)).length == list.length)
  useEffect(()=>{
    let bool = list.filter((cart)=>cartDetail.cart_id.includes(cart.id)).length == list.length;
    if(check !== bool) setCheck(bool)
  },[list,cartDetail])
  
  const handleCheckallSeller = (e) => {
    var checked = e.target.checked;
    var val = e.target.value;
    let cart_id = [];
    if(checked){
      setCheck(true);
      var dataCheck = [...cartDetail.cart_id];
      for(var i = 0; i < list.length; i++){
        dataCheck.push(list[i].id)
      }
      cart_id = [...new Set(dataCheck)];
      setCartDetail({cart_id})
    }else{
      cart_id = cartDetail.cart_id.filter((cart)=>list.findIndex((l)=>l.id == cart) == -1);
      setCartDetail({cart_id})
      setCheck(false);
    }
    setCheckall(cart_id.length == user.cart.length);
  }

  const handleCheckSeller = (e) => {
    var tmp = handleCheck(e);
    setCheck(list.filter((cart)=>tmp.cart_id.includes(cart.id)).length == list.length);
  }
  //console.log('cal_detail',calDetail)

  return(
    <div className="bg-white br-8 mt-3">
      <div className="row mx-0">
        <div className="col-12 pl-3 pt-3">
          <div className="form-group mb-0 d-flex justify-content-between align-items-center">
            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" checked={check} id={"seller_"+seller_id} name={"seller_"+seller_id} value="all"  onChange={handleCheckallSeller} />
              <label className="custom-control-label" htmlFor={"seller_"+seller_id}>
                <p>{seller_id == 'cu'? 'CHULABOOK':data.shop_name} <i className="fas fa-chevron-right text-pink ml-2"></i></p>
              </label>
            </div>
            {(!!data.support_cod || seller_id == 'cu') && <p>รองรับการจัดส่งแบบปลายทาง</p>}  
          </div>
        </div>
        <div className="col-12 px-0">
          <table className="table table-cart">
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td>ชื่อสินค้า</td>
                <td className="text-center">ราคา/หน่วย</td>
                <td className="text-center">จำนวน</td>
                <td className="text-right">ราคารวม</td>
                <td></td>
              </tr>
              {
                list.map((val, index) => { 
                  // let percent = (calDetail && calDetail.discount_shelf && calDetail.discount_shelf.cart_per) ? calDetail.discount_shelf.cart_per.filter((per)=>per.id == val.product_id) :null
                  let total_price = val.cover_price * val.quantity;
                  let promotion;
                  if(calDetail && calDetail.discount_shelf){
                    
                    let {discount_list} = calDetail.discount_shelf;
                    let item = discount_list.find(d => d.product_id == val.product_id)
                    if(item){
                      total_price -= item.total_discount + item.discount_web;
                    }

                    if(calDetail.discount_shelf.cart_promotion){
                      let fp = calDetail.discount_shelf.cart_promotion.find((c)=>c.id == val.product_id)
                      promotion = fp ? fp.promotion : undefined
                    }
                    
                  }

                  return (
                    <ProductCart key={val.id} 
                      t={t}
                      handleCheck={handleCheckSeller} 
                      handleCart={handleCart}
                      product={val} 
                      checked={ (isCheck(val.id))}
                      delCart={delCart}
                      quantity={val.quantity} 
                      promotion={promotion}
                      total_price={total_price} />
                    )
                })
              }
              <Footbar ship={data.ship}
                t={t}
                calDetail={calDetail}
                cartDetail={cartDetail}
                seller_id={seller_id}
                handleShow2={handleShow2}
                setCartDetail={setCartDetail}
                setShow2={setShow2}
                setHandleChangePackage={setHandleChangePackage}
                calShipping = {(calDetail && calDetail.shipping_list) ? calDetail.shipping_list.find((sl)=>sl.seller_id == seller_id).total : 0}
                canShip={(calDetail && calDetail.shipping_list) ? calDetail.shipping_list.find((sl)=>sl.seller_id == seller_id).canShip : true}
                type={(cartDetail && cartDetail.seller && cartDetail.seller[seller_id]) && cartDetail.seller[seller_id].shipping_type || 1}
                shippingInfo={shippingInfo} setShippingClick={setShippingClick}
                seller={data} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
    )
}

export default Seller