import classnames from "classnames";
// import { CustomInput, Form, FormGroup, Label } from 'reactstrap';
// import Link from 'next/link';
// import Router from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { usePaymentInputs } from 'react-payment-inputs';
import Add_address from '../../../../components/mobile/chose-address';
import ChoosePaymentthis from '../../../../components/mobile/summary/choose-payment';
import Package from '../../../../components/mobile/summary/package';
import StatusPayment from '../../../../components/mobile/summary/status-payment';
import TaxFill from '../../../../components/mobile/summary/tax-fill';
import UserContext from '../../../../contexts/UserContext';
import api from '../../../../utils/api';
import { withTranslation, Router, Link } from '../../../../utils/i18n';
import tools from '../../../../utils/tools';
import { CustomInput } from "reactstrap";

const MobileMainSummary = (props) => {
  const { t, loading, setLodding } = props;
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  /* payment */
  const [showDetail, setShowDeatail] = useState(false);
  const toggleGuarantee = () => setShowGuarantee(!showGuarantee);
  const toggleHidden = () => setShowGuarantee(false);
  const [showGuarantee, setShowGuarantee] = useState(false);
  const [expMonth, setExpMonth] = useState('12');
  const [expYear, setExpYear] = useState('2019');
  const [showPayment, setshowPayment] = useState(false);
  // const [checkcode,setCode] = useState(null);
  const [promotionErr,setPromotionErr] = useState(null);
  const [shippingInfo,setShippingInfo] = useState(null);
  const [shippingInfoCu,setShippingInfoCu] = useState(null)



  const toggleshowDetail = () => setShowDeatail(!showDetail);
  const CloseshowDetail = () => setShowDeatail(false);

  const [showTranfer, setshowTranfer] = useState(false);
  const toggleshowTranfer = () => setshowTranfer(!showTranfer);

  const [showQrP, setshowQrP] = useState(false);
  const toggleshowQrP = () => setshowQrP(!showQrP);

  const [showQr, setshowQr] = useState(false);
  const openQr = () => setshowQr(true);
  /* user */
  const { user, setUser, onSocket } = useContext(UserContext)
  const [selected, setSelectedAddress] = useState(0);
  const [selectedTax, setSelectedTax] = useState(0);
  const toggle = () => { setShow(!show) };
  const toggle2 = () => { setShow2(!show2) };

  const [cartDetail, setCartDetail] = useState({
    address_id:0,
    shipping_type:1,
    cart_id:[],
  });
  const [calDetail, setCalDetail] = useState(null);
  const [pointState, setPointState] = useState(0);
  const [promotion, setPromotion] = useState();
  const [checkcode, setCode] = useState();
  const [paymentType, setPaymentType] = useState(0);
  const [require_tax, setRequire_tax] = useState(0);
  const [calDetailTemp, setCalDetailTemp] = useState(null);

  const [cart,setCart] = useState([]);

  const [showM, setShowM] = useState(false);
  const toggleM = () => {
    setShowM(!showM);
  };

  const [ebookCheck, setEbookCheck] = useState(false);
  //
  useEffect(()=>{
    if(!user || !cart.length) return;
    if(user.cart.length == 0 && !cart.find(c => c.cart_type == 'express')){
      Router.push('/')
    }
  },[user,cart])


  useEffect(() => {
    var pass = JSON.parse(localStorage.getItem('pass'));
    if (!user) {
      return;
    }

    if(cartDetail.order){
      return;
    }
    
    let cart_tmp = [];
    if(pass == null)
      Router.push('/')

    

    if(pass&&user){
      var selectIndex;
      selectIndex = user.addresses.findIndex((item) => item.id == pass.address_id)
      setSelectedAddress(selectIndex);
      setSelectedTax(selectIndex);
      // let cart = [];
      
      if(pass.cart) {
        // let tmp = {...user};
        cart_tmp.push({...pass.cart,cart_type:'express'});
        // setUser(tmp);
      }
      else{
        user.cart.forEach((product)=>{
          if(pass.cart_id.includes(product.id))
          cart_tmp.push({...product})
        })
      }
     
      pass.cart = cart_tmp
      setCart(cart_tmp)

      if(cart_tmp.length == 0){
        Router.push('/')
        return;
      }

      if(!shippingInfo ){
        const seller_obj = tools.groupBy(cart_tmp,'seller_id');
        api.getShipmentInfo({seller_id:Object.keys(seller_obj)})
        .then(res=>{
          let data = [];
          // console.log(tools.groupBy(pass.cart,'seller_id')['cu'])
          if(seller_obj['cu'] && seller_obj['cu'].length > 0){
            data.push({id:'cu',shop_name :'CHULABOOK'})
          }
          data.push(...res.data)
          if(!pass.seller){
            pass.seller = {}
            data.forEach((dt,index)=>{
              var ship = dt.id != 'cu'? dt.seller_shippings.find(ship => ship.status == 1) : {shipping_type : 1}
              // console.log('ship',ship)
              pass.seller[dt.id] = {};
              pass.seller[dt.id].shipping_type = ship ? ship.shipping_type :  1;
            })
          }
          else{
            data.forEach((dt,index)=>{
              var ship = dt.id != 'cu'? dt.seller_shippings.find(ship => ship.status == 1) : {shipping_type : 1}
              // console.log('ship',ship)
              pass.seller[dt.id].shipping_type = ship ? ship.shipping_type :  1;
            })
          }

          // console.log('data',data)
          let cart_id = pass.cart_id
          data.forEach((dt,index)=>{
            let filtered_cart = seller_obj[dt.id].filter(val => cart_id.includes(val.id))
            data[index].carts = filtered_cart
          })
          
          // console.log('cart_id',cart_id)
          setShippingInfo(data)
   
          
        })
        .catch(err => {
          console.log(err);
        })
      }
      setCartDetail(pass)
      


      
    }
    // user && tools.calAll(user, pass.address_id, pass.shipping_type, user && user.member && user.member.STATUS == "Y", pass.cart_id).then(data => {
    //   setCalDetail(data)
    // })
  }, [user]);


  useEffect(()=>{
    if(cartDetail.address_id == 0 ) return;

    // console.log('address changed!')
    let address = user.addresses.find(ad => ad.id == cartDetail.address_id)

    if(!address) return

    // console.log('asdad')
    api.getShippingInfoCU({province_code : address.province_code})
    .then(res => setShippingInfoCu(res.data))
    .catch(err =>{
      setShippingInfoCu(-1)
      console.log(err);
      console.log(err.response)
    })
  },[cartDetail.address_id])

  // console.log(cartDetail)

  const onChangeShippingType = (seller_id,type)=>{
    let tmp ={...cartDetail}
    tmp.seller[seller_id].shipping_type = type;
    setCartDetail(tmp)
  }

  // useEffect(() =>{
  //   if(!cartDetail || !user){
  //     return
  //   }
  //   console.log(user.addresses[selected||0].id)
  //   tools.calAll(user, user.addresses[selected||0].id, cartDetail.shipping_type,user && user.member && user.member.STATUS == "Y" ,cartDetail.cart_id).then(data=>{
  //     setCalDetail(data)
  //   })
  // },[selected])
  const eventSuccessQR = (data, response) => {
    // api.updatePaymentType(data.order_id, { status: 2 })
    //   .then(res => {
    //     const data = res.data;
    //   })
    //   .catch(err => {
    //     console.log(err.response);
    //   })
    Router.push(`/user/success_order/[order_id]?order_id=${data.order_id}`, `/user/success_order/${data.order_id}`);
    // Router.push(`/user/success_order/${data.order_id}`);
  }

  useEffect(() => user && onSocket(user.id, eventSuccessQR, 'qr'), [user])

  // useEffect(()=>{
  //   if(!cartDetail || !user){
  //     return
  //   }
   
  //   tools.calAll(user,cartDetail.address_id,cartDetail.shipping_type,user && user.member && user.member.STATUS == "Y" ,cartDetail.cart_id).then(data=>{
  //     setCalDetail(data);
  //     //
  //     //setUser(_user)     
  //   })

  // },[cartDetail])

  // useEffect(()=>{
  //   cartDetail && tools.calAll(user,cartDetail.address_id,cartDetail.shipping_type,user && user.member && user.member.STATUS == "Y" ,cartDetail.cart_id).then(data=>{
  //     setCalDetail(data)
  //   })
  // },[pointState])


  useEffect(() => {
    if(!user || !cartDetail || !shippingInfo || !shippingInfoCu){
      return;
    }

    tools.calAllSeller({...user,cart},cartDetail,shippingInfo,promotion,shippingInfoCu).then(data=>{
      setCalDetail(data)
    })
  }, [cartDetail,shippingInfo,show,promotion,shippingInfoCu]); 

  const getPromoCode = () => {
    const data = new FormData(event.target)
    event.preventDefault()
    const jsonData = tools.toJson(data);
    var code = jsonData['code'];
    if(!code) {
      
      if(checkcode){
        clearPromotion();
      }
      else{
        setPromotionErr(`${t('mobile_summary:please_select_code')}`)
      }
      return;
    }
    api.getPromotion(code)
      .then(res => {
        const data = res.data;
        if(!data || data.status == 0 || (data.amount_limit == 1 && data.amount <= 0) || (data.time_limit != 0 && !(data.time_limit == 1 && new Date(data.start_date) < Date.now() && new Date(data.end_date) > Date.now()))){
          setPromotionErr(`${t('mobile_summary:code_expired')}`)
          if(promotion) setPromotion(null);
          if(checkcode) setCode(null)
          return ;
        }
        setPromotionErr(null)
        ;
        calPromotionDiscount(data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const calPromotionDiscount = (data)=>{
    const {seller_id='cu',apply_with,category_id,products_in,use_with,user_id : only_user} = data;

    if(only_user){
      let users_id = only_user.split(',')
      if(!users_id.includes(user.id)){
        return setPromotionErr(`${t('ไม่ผ่านเงื่อนไขโปรโมชั่น')}`)
      }
    }
    var cart;
    let con1 = use_with == 'platform'
    if(apply_with == 'category'){

      cart = cartDetail.cart.filter(val => (val.seller_id == seller_id || con1)  && (val.cate == category_id ||val.cate_id == category_id ) )
      
    }
    else if(apply_with == 'product'){
      const product_id_arr = products_in.map(val => parseInt(val.product_id) )
      cart = cartDetail.cart.filter(val => (val.seller_id == seller_id || con1)  && product_id_arr.includes(parseInt(val.product_id)))
      
    }
    else{
      cart = cartDetail.cart.filter(val => (val.seller_id == seller_id || con1))
      
    }
 

    if(!cart.length){
      return setPromotionErr(`${t('mobile_summary:not_found_promotion_products')}`)
    }
    // let total_price = cart.reduce((a,b) => a+b.price);
    let tp = 0;
    const discount_list =  calDetail.discount_shelf ?  calDetail.discount_shelf.discount_list : []
    cart.forEach(val => {
      let total_discount =  0 ;
      const index = discount_list.findIndex(d => d.product_id == val.product_id)
      if(index != -1) {
        let dis_for_web = (val.cover_price - val.price) * (val.quantity - discount_list[index].qty)
        //console.log(dis_for_web)
        let extra_discount =  discount_list[index].total_discount 
        total_discount = dis_for_web + extra_discount;
      }
      else{
        total_discount = (val.cover_price - val.price);
      }
      tp += val.cover_price * val.quantity - total_discount
    })


    // const {discount,dis_for_web_cu} = calDetail.discount_shelf
    let total_price_cu = calDetail.total_price_cu;
  
    
    let total_price = tp;

    if (checkcode != data.promotion_code) {
      var dis = 0;
    
      if (data.min_discount && total_price  < data.min_discount){
        dis = 0;
      }
      else if (data.type == 4) {
        dis = parseFloat(total_price * data.discount1 / 100);
      } else if (data.type == 5) {
        dis = parseFloat(data.discount1);
      }

      if (data.max_discount && dis > data.max_discount)
        dis = parseFloat(data.max_discount)

      if(dis > total_price)
        dis = total_price;

      data.price = parseFloat(dis);
      setPromotion(data);
      var tmp = {...calDetail};
      tmp.promotion = data;
      tmp.discount = dis;
      setCalDetail(tmp)
      if(!dis){
        return setPromotionErr(`${t('ไม่ผ่านเงื่อนไขโปรโมชั่น')}`)
      }
      else{
        setCode(data.promotion_code);
      }
    }
    
    


  }

  useEffect(() => {
    if(!shippingInfo?.length ) return;
    // console.log('sss',cartDetail)
    var tmp = {...cartDetail}
    const info = shippingInfoCu
    // let cu_index = tmp.sellers.findIndex(val => val.seller_id === 'cu')
    // if(cu_index === -1) return;
    const shipping_type = info.shipping_zone_types[0]?.type || 1
    tmp.shipping_type = shipping_type;
    tmp.seller['cu'].shipping_type = shipping_type
    setCartDetail(tmp)
    // setShippingInfo({...shippingInfo,shipping_type : info.shipping_zone_types[0]?.type || 1 })
  },[shippingInfoCu])

  const clearPromotion =() =>{
    // alert('asdas')
    var tmp = {...calDetail};
    tmp.promotion = null;
    tmp.discount = 0;
    setPromotion(null)
    setCode(null)
    setCalDetail(tmp)
  }

  const getUsePoint = () => {
    const data = new FormData(event.target)
    event.preventDefault()
    const point = parseInt(tools.toJson(data).point);
    const POINT_BALANCE = parseInt(user.member.POINT);

    let _mod = parseInt(POINT_BALANCE / 80),
      mod = parseInt(point / 80)
    var inputPoint = document.getElementById("point");

    if (mod <= _mod)
      inputPoint.value = mod * 80;
    else {
      alert(`${t("mobile_summary:not_enough_points")}\n${t("mobile_summary:you_have_points")} : ` + POINT_BALANCE)
      inputPoint.value = (_mod * 80)
    }
    setPointState(inputPoint.value)

  }

  const calNetTotal = () => {
    if(!calDetail) return 0;
    let total_price = calDetail.total_discount;
    let member_discount = (parseInt(pointState)  / 8)
    let promotion_discount = promotion && promotion.price ? promotion.price : 0
    
    if(total_price - promotion_discount < 0){
      promotion_discount = total_price;
      
    }

    
    total_price -= promotion_discount;
    total_price += calDetail.shipping;

    if(total_price - member_discount < 0){
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


  const setData = () => {
    var shipping_type = cartDetail.shipping_type;
    var area;
    var getarea;

    getarea = user.addresses.find((item)=> item.id == cartDetail.address_id).province_code

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

    var seller = {...cartDetail.seller}

    for(var key of Object.keys(seller)){
      let seller_info = shippingInfo.find(s => s.id == key)
      if(!seller_info) {
        delete seller[key];
        continue;
      } 
      if(!seller_info.carts.length) delete seller[key];
    }

    var cart_data = { seller ,carts:cartDetail.cart_id, address_id:cartDetail.address_id , tax_address_id:cartDetail.tax_address, area, shipping_type, type, user_id:user.id, use_point: pointState };
    return cart_data;
  }

  const togglePayment = () => {
    var pass = JSON.parse(localStorage.getItem('pass'));
    let cart = [];
    let tmp = user;
    if (pass && pass.cart) {
      delete tmp.cart.find((c) => c.id == pass.cart.id)
    } else {
      tmp.cart = []
    }
    setUser(tmp);

    localStorage.removeItem('pass')
    var cart_data = setData();
    cart_data.require_tax = require_tax;
    cart_data.promotion = checkcode;
    let haveItemEbook = false;
    for (let i = 0; i < cartDetail.cart.length; i++) {
      let item = cartDetail.cart[i];
      if (item?.type == "ebook") {
        haveItemEbook = true;
        break;
      }
    }
    if (haveItemEbook) {
      setShowM(true);
      
    } else {
      api.getQRCode({ cart_data, qrcode: false, order_from: 'mobile' })
        .then(res => {
          const data = res.data;
          const { order } = data;
          console.log('tesss')
          if (order && order.status > 1) {
            Router.push(`/user/success_order/[order_id]?order_id=${data.order_id}`, `/user/success_order/${data.order_id}`);

            // Router.push(`/user/success_order/${data.order_id}`);
            return;
          }

          var temp = { ...user };
          // temp.carts = [];
          var tmp = { ...cartDetail }
          tmp.order_id = data.order_id
          tmp.order = data.order
          temp.cart = temp.cart.filter(val => !cart_data.carts.includes(val.id));
          tmp.tax_address_id = user.addresses[selectedTax].id;
          tmp.address_id = user.addresses[selected].id;
          setCalDetailTemp(calDetail)
          setCartDetail(tmp)
          setshowPayment(!showPayment)
        })
        .catch(err => {
          console.log(err)
          console.log(err.response);
        })
      }

  };

  const canCodShip = ()=>{
    if(!cartDetail.seller || !shippingInfo) return true;
    // console.log(calDetail)
    var cod_count = 0;
    var checked_sellers_count = 0;
    // console.log(shippingInfo)
    for (var key of Object.keys(cartDetail.seller)) {
      let seller_info = shippingInfo.find(s => s.id == key)
      if(!seller_info) return true;
      if(seller_info.carts.length) checked_sellers_count++;
      if(cartDetail.seller[key].shipping_type == 3 && seller_info.carts.length) cod_count++;
    }
    // console.log(checked_sellers_count,cod_count)
    // return cod_count == 0 || cod_count == Object.keys(cartDetail.seller).length
    if(cod_count == 0) return true;
    else if(cod_count == checked_sellers_count) return true;
    else return false;
    
  }

  const canShipping =()=>{
    if(!calDetail) return false;
    if(!calDetail.shipping_list) return false;
    // console.log(calDetail)
    for(let i = 0 ; i < calDetail.shipping_list.length ;i++){
      if(!calDetail.shipping_list[i].canShip) return false;
    }
    
    return true;
  }

  const handleShowPayment = () => {
    setshowPayment(true);
    var cart_data = setData();
    cart_data.require_tax = require_tax;
    cart_data.promotion = checkcode;
    api.getQRCode({ cart_data, qrcode: false, order_from: 'mobile' })
        .then(res => {
          const data = res.data;
          const { order } = data;
          console.log('tesss')
          if (order && order.status > 1) {
            Router.push(`/user/success_order/[order_id]?order_id=${data.order_id}`, `/user/success_order/${data.order_id}`);

            // Router.push(`/user/success_order/${data.order_id}`);
            return;
          }

          var temp = { ...user };
          // temp.carts = [];
          var tmp = { ...cartDetail }
          tmp.order_id = data.order_id
          tmp.order = data.order
          temp.cart = temp.cart.filter(val => !cart_data.carts.includes(val.id));
          tmp.tax_address_id = user.addresses[selectedTax].id;
          tmp.address_id = user.addresses[selected].id;
          setCalDetailTemp(calDetail)
          setCartDetail(tmp)
          setshowPayment(!showPayment)
        })
        .catch(err => {
          console.log(err)
          console.log(err.response);
        })
    
  };

  // console.log('cartDetail',cartDetail)

  return ( 
    <>
      <div className={showPayment ? "d-none" : "choese-address "}>
        <div className="cart-nav box-shadow-none bg-white">
          <div className=" text-center cart-nav-title">
            <h3 className="mb-0 text-black">{t("mobile_summary:choose_ship")}</h3>
          </div>
          <Link href="/user/cart">
            <a className="btn-back cart-nav-back">
              <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
            </a>
          </Link>
        </div>
        <StatusPayment statusPaymentL={2} statusPaymentC={1} statusPaymentR={1} />
        <div className="bg-light-less-gray ">
        <div className={classnames("categories-dropedown sp", { show: showM })}>
            <div className="cart-nav">
              <div className=" text-center cart-nav-title"></div>

              <a className="btn-back cart-nav-back" onClick={toggleM}>
                <img className="img-fluid" src={"/mobile/image/icon/icon-back.svg"} />
              </a>
            </div>
            <div className="container  onscroll">
              <div className="h-64px"></div>
              <div className="me-area ">
                <div>
                  <div className="title-me text-ebook pt-3">
                    {t("mobile_shippingInfo:modal_ebook1")}
                  </div>
                  <div className=" text-center pt-3">
                    {t("mobile_shippingInfo:modal_ebook2")} {t("mobile_shippingInfo:modal_ebook3")}
                  </div>
                  <div className="d-flex justify-content-center align-items-center pt-4">
                    <img className="img-fluid" src={"/mobile/image/logo/g.png"} />
                  </div>
                  <div className="d-flex justify-content-center align-items-center pt-3">
                    <img className="img-fluid" src={"/mobile/image/logo/a.png"} />
                  </div>
                  <div className="text-red text-center pt-4">
                    {t("mobile_shippingInfo:modal_ebook4")} {t("mobile_shippingInfo:modal_ebook5")}
                  </div>
                  <div className="d-flex justify-content-center align-items-center pt-3">
                    <CustomInput
                      type="checkbox"
                      id="check-ebook"
                      label={t("mobile_shippingInfo:modal_ebook6")}
                      checked={ebookCheck}
                      onChange={() => setEbookCheck(!ebookCheck)}
                      className="my-auto"
                    />
                  </div>
                </div>
              </div>
              <div className="footer-space"></div>
            </div>
            <div className="product-nav-main onneedEbook">
              <a
                className="btn-add-cart product-nav-main-btn product-book ebook nonecart"
                onClick={toggleM}
              >
                <h4> {t("mobile_shippingInfo:modal_ebook7")}</h4>
              </a>
              <a
                className={`btn-buy product-nav-main-btn product-book ebook ${!ebookCheck && "disable"
                  }`}
                onClick={ebookCheck ? handleShowPayment : null}
              >
                <h4>{t("mobile_shippingInfo:modal_ebook8")}</h4>
              </a>
            </div>
          </div>
          <div className="h-102px"></div>
          <div className="container bg-white pb-3">
            {
              user && user.addresses.length > 0 ?
                <>
                  <div className="info-address w-100">
                    <img className="img-fluid mr-2 mb-auto" src="/mobile/image/icon/icon-location.svg" />
                    <div className="info-address-detail w-100">
                      <div className="d-flex justify-content-between align-items-center">
                        {
                          user.addresses[selected].at == 'home' ?
                            <div className="btn-address-home-add-list mr-2">
                              <p className="p-14">{t('mobile_address:home')}</p>
                            </div> :
                            <div className="btn-address-work-add-list mr-2">
                              <p className="p-14">{t('mobile_address:office')}</p>
                            </div>
                        }
                        <a onClick={toggle}><p className="text-pink mb-0">{t("mobile_address:edit")}</p></a>
                      </div>
                      <p className="text-black mb-0 mt-1">{user.addresses[selected].firstname} {user.addresses[selected].lastname}</p>

                      <p className="p-12 text-black two-line mb-0">{user.addresses[selected].full_address}
                      </p>
                      <p className="p-12 text-black mb-1">{user.addresses[selected].phone}</p>
                    </div>
                  </div>
                  <Add_address show={show} user={user} toggle={toggle} selected={selected} setSelectedAddress={setSelectedAddress} addresschoose={"delivery"} />
                  <TaxFill user={user} setRequire_tax={setRequire_tax} require_tax={require_tax} show2={show2} toggle2={toggle2} selectedTax={selectedTax} setSelectedTax={setSelectedTax} />
                </> :
                <Link href="/user/add-address">
                  <a className="add-address container">
                      <h4 className="text-pink my-auto"><img className="img-fluid mr-8px" src={"/mobile/image/icon/icon-location.svg"} />{t("mobile_add_address:add_address")}</h4>
                    <i className="fas fa-chevron-right text-pink my-auto"></i>
                  </a>
                </Link>
            }
          </div>
          {
            shippingInfo && calDetail && !showPayment && shippingInfo.map((info) => (
              <Package
                key={info.id}
                user={user} setUser={setUser}
                onChangeShippingType={onChangeShippingType}
                packageInfo={info}
                toggleGuarantee={toggleGuarantee}
                shippingCost={calDetail.shipping_list.find(s => s.seller_id == info.id)}
                setCalDetail={setCalDetail} calDetail={calDetail}
                cartDetail={cartDetail} setCartDetail={setCartDetail}
                selected={selected}
              />
            ))
              
            
          }
          {
            calDetail && (
              <div className="container bg-white mt-3">
                <h4 className="text-black py-3 mb-0">{t("mobile_translations:order_summary")}</h4>
                <hr className="row use-line my-0 "></hr>
                <form onSubmit={getPromoCode}>
                  <div className="d-flex mt-4">
                    
                      <div className="input-for-edit for-onsalecode my-auto">
                        <img className="img-fluid mr-2 mb-12px" src="/mobile/image/icon/icon-codeonsale-gray.svg" />
                        <input type="text" name="code" className="input_mobile" placeholder={t('mobile_shippingInfo:discount_code')} />
                        <span className="input-border"></span>
                      </div>
                      <button className="submit-codeonsale my-auto">{t("mobile_translations:confirm")}</button>
                     
                  </div> 
                  {promotionErr && <p style={{fontSize:"12px",color:"red"}}>{promotionErr}</p>}
                </form>
                {
                   user && user.member && user.member.STATUS == 'Y' ? (
                    <form onSubmit={getUsePoint}>
                      <div className="d-flex mt-3">
                        <div className="input-for-edit for-onsalecode my-auto">
                          <img className="img-fluid mr-2 mb-12px" src="/mobile/image/icon/icon-promotion-gray.svg" />
                          <input type="text" name="point" id="point" className="input_mobile" required placeholder={t('mobile_summary:use_reward_points')} />
                          <span className="input-border"></span>
                        </div>
                        <button className="submit-codeonsale my-auto">{t("mobile_translations:confirm")}</button>
                      </div>
                    </form>
                  ) : (
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
                <div className="d-flex justify-content-between mt-3 ">
                  <p className="p-12 text-disable mb-0">{t("mobile_summary:product_price")}</p>
                  <h6 className="font-weight-bold mb-0">฿ {tools.currencyFormatDE(calDetail.total)}</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="p-12 text-disable mb-0">{t("mobile_summary:discount")}</p>
                  <h6 className="font-weight-bold mb-0">- {tools.currencyFormatDE(calDetail.discount_shelf.total_discount)}</h6>
                </div>
                <hr className="use-line mt-3 mb-0"></hr>
                <div className="d-flex justify-content-between py-2">
                  <p className="p-12 text-disable mb-0">{t("mobile_summary:subtotal")}</p>
                  <h6 className="font-weight-bold mb-0">฿ {tools.currencyFormatDE(calDetail.total_discount)}</h6>
                </div>
                <hr className="use-line my-0"></hr>
                
                {
                  promotion ? (
                    <>
                      <div className="d-flex justify-content-between mt-3">
                        <p className="p-12 text-disable mb-0">{t("mobile_summary:use_discount")}</p>
                        <h6 className="font-weight-bold mb-0">- {tools.currencyFormatDE(promotion.price)}</h6>
                      </div>
                    </>
                  ) : ''
                }
                <div className="d-flex justify-content-between mt-3">
                  <p className="p-12 text-disable mb-0">{t("mobile_summary:shipping_fee")}</p>
                  <h6 className="font-weight-bold mb-0">฿ {tools.currencyFormatDE(calDetail.shipping)}</h6>
                </div>

                {
                  pointState > 0 ? (
                    <div className="d-flex justify-content-between mt-3">
                      <p className="p-12 text-disable mb-0">{t("mobile_summary:use_reward_points")}</p>
                      <h6 className="font-weight-bold mb-0">- {tools.currencyFormatDE(pointState / 8)}</h6>
                    </div>
                  ) : ''
                }
                
                
                <hr className="use-line mt-3 mb-0"></hr>
                <div className="d-flex justify-content-between my-3">
                  <p className="text-black">{t("mobile_translations:total")}</p>
                  <h4 className="font-weight-bold">
                    {
                      user && `฿ ${tools.currencyFormatDE(calNetTotal())}`
                    }
                  </h4>
                </div>
                {!canCodShip () && <h6 className="font-weight-bold text-danger mb-0">{t('mobile_summary:cod_cant_ship')}</h6>} 
              </div>
            )
          }
          

          {/* <div className="container bg-white mt-3">
            <h4 className="text-black py-3 mb-0">สรุปรายการสั่งซื้อ</h4>
            <hr className="row use-line my-0 "></hr>
            <div className="d-flex mt-4">
              <div className="input-for-edit for-onsalecode my-auto">
                <img className="img-fluid mr-2 mb-12px" src="/mobile/image/icon/icon-codeonsale-gray.svg" />
                <input type="text" className="input_mobile" required placeholder="กรุณากรอกโค้ดส่วนลด" />
                <span className="input-border"></span>
              </div>
              <button className="submit-codeonsale my-auto">ยืนยัน</button>
            </div>
            <div className="d-flex mt-3">
              <div className="input-for-edit for-onsalecode my-auto">
                <img className="img-fluid mr-2 mb-12px" src="/mobile/image/icon/icon-promotion-gray.svg" />
                <input type="text" className="input_mobile" required placeholder="ใช้แต้มสะสมของคุณ" />
                <span className="input-border"></span>
              </div>
              <button className="submit-codeonsale my-auto">ยืนยัน</button>
            </div>
            <div className="d-flex justify-content-between mt-3 ">
              <p className="p-12 text-disable mb-0">ยอดรวม (จำนวน 2 ชิ้น)</p>
              <h6 className="font-weight-bold mb-0">฿ 2,200.00</h6>
            </div>
            <div className="d-flex justify-content-between">
              <p className="p-12 text-disable">ค่าจัดส่ง</p>
              <h6 className="font-weight-bold">฿ 80.00</h6>
            </div>
            <hr className="use-line my-0"></hr>
            <div className="d-flex justify-content-between my-3">
              <p className="text-black">รวมทั้งหมด</p>
              <h4 className="font-weight-bold">฿ 2,280.00</h4>
            </div>
          </div> */}
          <div className="footer-space"></div>
        </div>
        <div className="cart-nav-to-payment">
          <div className="container d-flex">
            <div className="check-all-product justify-content-end">
              <div className="my-auto text-right">
                {
                  calDetail && (
                    <h4 className="text-pink m-0 font-weight-bold">
                      ฿ {tools.currencyFormatDE(calDetail.net_price - (pointState / 8) - (promotion && promotion.price ? promotion.price : 0))}
                    </h4>
                  )
                }

              <p className="p-12 mb-0">{t("mobile_summary:includ_vat")}</p>
              </div>
            </div>
            {
              canCodShip() && canShipping() ? (
                <a className="btn-cart-to-payment-has-address" onClick={togglePayment}>
                  <h4 className="text-white m-auto">{t("mobile_translations:payment")}</h4>
                </a>
              )
              : (
                <a className="btn-cart-to-payment" >
                    <h4 className="text-white m-auto">{t("mobile_translations:payment")}</h4>
                </a>
              )
            }
            
          </div>
        </div>
      </div>

      <div className={showPayment && !showTranfer && !showQrP ? "payment" : "d-none"}>
        <div className="cart-nav box-shadow-none">
          <div className=" text-center cart-nav-title">
            <h3 className="mb-0 text-black">{t("mobile_shippingInfo:select_payment_method")}</h3>
          </div>
          <Link href={'/'}>
            <a className="btn-back cart-nav-back">
              <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
            </a>
          </Link>
        </div>
        <StatusPayment statusPaymentL={3} statusPaymentC={2} statusPaymentR={1} />
        <div className="bg-gray-area min-vh-100">
          <div className="h-102px"></div>
          <ChoosePaymentthis
            paymentType={paymentType} setPaymentType={setPaymentType}
            user={user} setUser={setUser}
            promotion={promotion ? promotion : null} setPromotion={setPromotion}
            pointState={pointState} setPointState={setPointState}
            setCalDetail={setCalDetail} calDetail={calDetail}
            cartDetail={cartDetail} setCartDetail={setCartDetail}
            canCodShip={cartDetail?.seller ? !!Object.keys(cartDetail.seller).find(k => cartDetail.seller[k].shipping_type == 3 ) : false}
            // shippingCost={calDetail.shipping_list.find(s => s.seller_id == info.id)}
          />
          <div className="footer-space bg-light-less-gray"></div>
        </div>



        <div className={classnames("bg-gray-for-pop", { "show": showDetail })}>
          <div className={classnames("summay-shipping", { "show": showDetail })}>
            <a className="btn-close" onClick={CloseshowDetail} ></a>
            <h4 className="text-black text-center">{t("mobile_shippingInfo:order_summary")}</h4>
            {
             (calDetailTemp && cartDetail) && (
                <>
                  <div className="d-flex justify-content-between mt-3 ">
              <p className="p-12 text-disable mb-0">{t("mobile_shippingInfo:product_price")}</p>
                    <h6 className="font-weight-bold mb-0">฿ {tools.currencyFormatDE(calDetailTemp.total)}</h6>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="p-12 text-disable mb-0">{t("mobile_shippingInfo:label_discount")}</p>
                    <h6 className="font-weight-bold mb-0">- {tools.currencyFormatDE(calDetailTemp.discount_shelf.total_discount)}</h6>
                  </div>
                  <hr className="use-line mt-3 mb-0"></hr>
                  <div className="d-flex justify-content-between py-2">
              <p className="p-12 text-disable mb-0">{t("mobile_shippingInfo:total_price")}</p>
                    <h6 className="font-weight-bold mb-0">฿ {tools.currencyFormatDE(calDetailTemp.total_discount)}</h6>
                  </div>
                  <hr className="use-line my-0"></hr>
                  <div className="d-flex justify-content-between mt-3">
              <p className="p-12 text-disable mb-0">{t("mobile_shippingInfo:transpot_cost")}</p>
                    <h6 className="font-weight-bold mb-0">฿ {tools.currencyFormatDE(calDetailTemp.shipping)}</h6>
                  </div>
                  {/* {
                    user && user.member && user.member.STATUS == 'Y' ? (
                      <div className="d-flex justify-content-between">
                        <p className="p-12 text-disable mb-0">ส่วนลดสมาชิกพรีเมี่ยม</p>
                        <h6 className="font-weight-bold mb-0">- ฿ {tools.currencyFormatDE(calDetail.member_discount)}</h6>
                      </div>
                    ) : ''
                  } */}
                  
                  {
                    cartDetail.order && cartDetail.order.promotion_discount ? (
                      <>
                        <div className="d-flex justify-content-between mt-3">
                          <p className="p-12 text-disable mb-0">ใช้ส่วนลด</p>
                          <h6 className="font-weight-bold mb-0">- {tools.currencyFormatDE(cartDetail.order.promotion_discount)}</h6>
                        </div>
                      </>
                    ) : ''
                  }
                  {
                    pointState > 0 ? (
                      <div className="d-flex justify-content-between">
                        <p className="p-12 text-disable mb-0">{t("mobile_shippingInfo:label_point")}</p>
                        <h6 className="font-weight-bold mb-0">- {tools.currencyFormatDE(pointState / 8)}</h6>
                      </div>
                    ) : ''
                  }
                  {/* <hr className="use-line mt-3 mb-0"></hr>
                  <div className="d-flex justify-content-between my-3">
                    <p className="text-black">ยอดรวมทั้งสิ้น</p>
                    <h4 className="font-weight-bold">
                      {
                        user && `฿ {tools.currencyFormatDE(calDetail.net_price - (pointState / 2)  - (promotion && promotion.price ? promotion.price : 0))}`
                      }
                    </h4>
                  </div> */}
                </>
              )
            }
          </div>
        </div>
        <div className="cart-nav-to-payment">
          <div className="container px-3 d-flex">
            <div className="check-all-product w-100 align-items-center justify-content-between">
          <p className="text-black m-0">{t("mobile_shippingInfo:net_price")}</p>
              <a className="my-auto text-left d-flex" onClick={toggleshowDetail}>
                {
                  cartDetail && (
                    <h4 className="text-pink m-0 font-weight-bold mr-2">
                      {
                        cartDetail.order &&  `฿ ${tools.currencyFormatDE(cartDetail.order.total_price)}`
                      }
                    </h4>
                  )
                }

                <i className={classnames("text-pink my-auto", { "fas fa-chevron-down": !showDetail, "fas fa-chevron-up": showDetail })}></i>
              </a>
            </div>
            {/* {
              paymentType == 1 && (
                <a className="btn-cart-to-payment-has-address">
                  <h4 className="text-white m-auto">ชำระเงิน1</h4>
                </a>
              )
            }
            {
              paymentType == 4 && (
                <a className="btn-cart-to-payment-has-address">
                  <h4 className="text-white m-auto">ชำระเงิน4</h4>
                </a>
              )
            } */}

          </div>
        </div>

      </div>

      <div className={classnames("guarantee-pop-area", { "show": showGuarantee })} onClick={toggleGuarantee} >
        <div className={classnames("guarantee-pop-box", { "show": showGuarantee })}>
          <div className="guarantee-pop">
            <h3 className="text-black text-center">{t("mobile_summary:shipping_supported_by_cu")}</h3>
            <p className="text-black text-center">{t("mobile_summary:delivery_track")}</p>
          </div>
          <a className="btn-pink-submit" onClick={toggleHidden}>
            <h4 className="text-white m-auto">{t("mobile_summary:more_products")}</h4>
          </a>
        </div>
      </div>
    </>
  )
}

export default MobileMainSummary