import React, { useContext, useEffect, useState } from 'react';
import Banner from '../../components/banner';
import Seller from './SellerCart';
import ConfirmDialog from '../../components/ConfirmDialog';
import ModalAddress from '../../components/modal/selector_address';
import SelectorShipment from '../../components/modal/selector_shipment';
import ModalEbook from '../../components/widget/ModalEbook';
import api from '../../utils/api';
import { Router } from '../../utils/i18n';
import { useMergeState } from '../../utils/state_tools';
import tools from '../../utils/tools';
import UserContext from '../../contexts/UserContext';

const EcodeMainCartDesktop = (props) => {
  const { t } = props;
  const { currencyFormatDE } = tools
  const { user, setUser, handleCart, test } = useContext(UserContext)
  const [address, setAddress] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [shippingInfoCu, setShippingInfoCu] = useState(null)

  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const [packages, setPackages] = useState([])
  const [cartDetail, setCartDetail] = useMergeState({
    address_id: 0,
    shipping_type: 1,
    cart_id: [],
  })

  const [calDetail, setCalDetail] = useMergeState({});

  useEffect(() => {
    // if(!user || !cartDetail || !shippingInfo || !shippingInfoCu){
    //   return;
    // }
    if (!user?.cart.length) return;

    tools.calAllSeller(user, cartDetail, shippingInfo, null, shippingInfoCu).then(data => {
      // console.log('ffff',cartDetail)
      setCalDetail(data)

    })
  }, [cartDetail, shippingInfo, shippingInfoCu]);

  useEffect(() => {
    if (!user || !cartDetail || !shippingInfo) {
      return;
    }
    let tmp = [...shippingInfo]
    const { cart_id } = cartDetail;


    let seller_cart = tools.groupBy(user.cart, 'seller_id');
    cartDetail.seller && Object.keys(cartDetail.seller).forEach((s) => {
      if (seller_cart[s]) {
        let filtered_cart = seller_cart[s].filter(val => cart_id.includes(val.id))
        // let isAllEbook = true;
        let ship = filtered_cart.findIndex(val => val.type != 'ebook' && val.type != 'course') != -1;
        // filtered_cart.forEach(val =>{
        //   if(val.item_code) isAllEbook = false;
        // })
        let index = tmp.findIndex(val => val.id == s)
        if (index != -1) {
          // tmp[index].isAllEbook = isAllEbook
          tmp[index].carts = filtered_cart;
          tmp[index].ship = ship;
        }


      }


    })
    // console.log('cart',tmp)

    setShippingInfo(tmp)

  }, [cartDetail])

  useEffect(() => {
    if (document.getElementsByClassName('main-layout')[0]) {
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  }, []);

  useEffect(() => {
    if (!user)
      return

    if (!user.cart.length) {
      Router.push('/ecode/no-cart')
      return;
    }
    let dataCheck = [];
    if (cartDetail.cart_id.length) {

      dataCheck = cartDetail.cart_id.filter(v => user.cart.find(c => c.id == v));

    }
    else {
      for (var i = 0; i < user.cart.length; i++) {
        dataCheck.push(user.cart[i].id);
      }
    }
    // for(var i = 0; i < user.cart.length; i ++){
    //   dataCheck.push(user.cart[i].id);
    // }

    // console.log(user.cart)
    let address_id
    if (cartDetail.address_id) {
      address_id = cartDetail.address_id
    }
    else {
      address_id = user.addresses.find((a) => a.default == 1) ? user.addresses.find((a) => a.default == 1).id : (user.addresses.find(val => val.at != 'tax') ? user.addresses.find(val => val.at != 'tax').id : null)
    }

    let obj = tools.groupBy(user.cart, 'seller_id')
    let count = Object.keys(obj).length;
    if (count == 0) {
      Router.push('/user/no-cart')
    }

    if (!shippingInfo || count != shippingInfo.length) {
      api.getShipmentInfo({ seller_id: Object.keys(obj) })
        .then(res => {
          let data = [];
          // console.log(obj)
          if (obj['cu'] && obj['cu'].length > 0) {
            data.push({ id: 'cu' })
          }
          data.push(...res.data)


          let tmp = { ...cartDetail };
          tmp.address_id = address_id;
          tmp.cart_id = dataCheck;

          tmp.shipping_type = 1;
          tmp.seller = {}


          data.forEach((dt, index) => {
            let filtered_cart = obj[dt.id].filter(val => dataCheck.includes(val.id))
            data[index].carts = filtered_cart
            tmp.seller[dt.id] = {};
            tmp.seller[dt.id].shipping_type = 1
            if (dt.id != 'cu') {
              let ship = dt.seller_shippings.find(ship => ship.status == 1)
              tmp.seller[dt.id].shipping_type = ship ? ship.shipping_type : 1
            }


          })

          setShippingInfo(data)
          setCartDetail(tmp)
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      // console.log('test',dataCheck)
      setCartDetail({ address_id, cart_id: dataCheck })
    }
  }, [user])


  useEffect(() => {
    if (cartDetail.address_id == 0) return;

    // console.log('address changed!')
    let address = user.addresses.find(ad => ad.id == cartDetail.address_id)

    if (!address) return

    // console.log('asdad')
    api.getShippingInfoCU({ province_code: address.province_code })
      .then(res => {
        const info = res.data
        setShippingInfoCu(info)

        // console.log('shipingInfoCu',res.data)
      })
      .catch(err => {
        setShippingInfoCu(-1)
        console.log(err);
        console.log(err.response)
      })
  }, [cartDetail.address_id])

  useEffect(() => {
    if (!shippingInfoCu) return;
    // console.log('shippingInfoCu',shippingInfoCu)
    var tmp = { ...cartDetail }
    const info = shippingInfoCu
    // console.log('tmp',tmp)
    // let cu_index = tmp.sellers.findIndex(val => val.seller_id === 'cu')
    // if(cu_index === -1) return;
    const shipping_type = info?.shipping_zone_types[0]?.type || 1
    tmp.shipping_type = shipping_type;
    if (tmp.seller.cu) {
      tmp.seller['cu'].shipping_type = shipping_type
    }
    setCartDetail(tmp)
    // setShippingInfo({...shippingInfo,shipping_type : info.shipping_zone_types[0]?.type || 1 })
  }, [shippingInfoCu])




  const [ref_id, setRef_id] = useState();
  const [thisQuantity, setThisQuantity] = useState();
  const [totalQuantity, setTotalQuantity] = useState();
  const delCart = (product_id, thisnum, totalnum) => {
    setThisQuantity(thisnum);
    setTotalQuantity(totalnum);
    setRef_id(product_id);
    setModalShow(true);
  }

  const onConfirm = (ref_id) => {
    if (thisQuantity == totalQuantity) {
      delPorductIncart(ref_id);
    } else {
      updatePorductIncart(ref_id, totalQuantity, thisQuantity);
    }

  }

  const delPorductIncart = (ref_id) => {
    api.delCart(ref_id)
      .then(() => {
        let tmp = { ...user }
        tmp.cart = tmp.cart.filter((cart) => cart.id != ref_id)

        let info_tmp = [...shippingInfo]
        let cartDetail_tmp = { ...cartDetail }
        // let {cart_id} = cartDetail_tmp
        // let idx1 = cart_id.findIndex(val => val == ref_id)
        // cartDetail_tmp.cart_id = cartDetail_tmp.cart_id.filter(val=> val != ref_id)
        // console.log('info_tmp',info_tmp)
        // const obj = tools.groupBy(tmp.cart,'seller_id')
        // let index;
        // for(let i = 0 ; i < info_tmp.length ;i++){

        //   if(!obj[info_tmp[i].id]){
        //     index = i;
        //   }
        // }
        // if(index || index ==0){
        //   info_tmp.splice(index,1)

        //   setShippingInfo(info_tmp)
        // }
        // console.log('info_tmp2',info_tmp)
        // setCartDetail(cartDetail_tmp)
        setUser(tmp)
      })
      .catch(err => {
        console.log(err);
      })
  }

  const updatePorductIncart = (ref_id, totalnum, thisnum) => {
    var amount = totalnum - thisnum;
    // alert(ref_id + ' : ' + amount);
    api.updateNumcard(ref_id, { quantity: amount })
      .then((res) => {
        const data = res.data;
        // console.log(data);
        let tmp = { ...user }
        var index = tmp.cart.findIndex((cart) => cart.id == ref_id)
        if (index != -1) {
          tmp.cart[index].quantity = amount;
        }
        setUser(tmp)
      })
      .catch(err => {
        console.log(err);
      })
  }

  const shouldCuShip = () => {
    if (!shippingInfo) return false;
    let cu = shippingInfo.find(val => val.id == 'cu')
    if (cu) return cu.ship;
    else return false;
  }


  const [checkall, setCheckall] = useState(true);

  const handleCheckall = (e) => {
    var checked = e.target.checked;
    var val = e.target.value;
    if (checked) {
      if (!user) {
        return;
      }
      // setCheckall(true);
      var dataCheck = [];
      for (var i = 0; i < user.cart.length; i++) {
        dataCheck.push(user.cart[i].id);
      }
      setCartDetail({ cart_id: dataCheck })
    } else {
      setCartDetail({ cart_id: [] })
      // setCheckall(false);
    }
  }
  const isCheckAll = () => {
    if (!user) return;

    let bool = true;

    for (let i = 0; i < user.cart.length; i++) {
      if (!cartDetail.cart_id.includes(user.cart[i].id)) {
        bool = false;
        break;
      }
    }

    return bool;
  }

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [changePackage, setHandleChangePackage] = useState(null)
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const isCheck = (id) => {
    if (cartDetail.cart_id.includes(id)) {
      return true;
    }
    return false;
  }

  const handleCheck = (e) => {
    var checked = e.target.checked;
    var id = e.target.value;
    var tmp = { ...cartDetail };

    if (checked) {
      tmp.cart_id.push(id)
    } else {
      var index = tmp.cart_id.findIndex((cart) => cart == id);
      tmp.cart_id.splice(index, 1)
    }
    setCartDetail(tmp);
    if ((tmp.cart_id.length == user.cart.length))
      setCheckall(true);

    if ((tmp.cart_id.length != user.cart.length))
      setCheckall(false);

    return tmp;
  }

  const [modalebook, setModalebook] = useState(false);
  const passSummary = () => {
    var selected_item = user.cart.filter(val => cartDetail.cart_id.includes(val.id))
    let haveItemEbook = false;
    for (let i = 0; i < selected_item.length; i++) {
      let item = selected_item[i];
      console.log(item)
      if (item.type == 'ecode') {
        break;
      }
    }
    localStorage.setItem('pass', JSON.stringify(cartDetail));
    if (haveItemEbook) {
      setModalebook(true);
    }
    else {
      Router.push('/ecode/summary');
    }


  }

  const canShipping = () => {
    console.log(calDetail)
    if (!calDetail.shipping_list) return false;
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

  // console.log('shippingInfo',shippingInfo)


  const calTotalWithSeller = (cart, seller_id) => {
    let price = cart.filter((c) => c.seller_id == seller_id).reduce((price, product) => {
      price = product.price * product.quantity;
      return price
    }, 0)
    return price;
  }

  var total_price_cu = 0;
  if (calDetail) {
    // const {discount,dis_for_web_cu} = calDetail.discount_shelf
    total_price_cu = calDetail.total_price_cu;
  }


  // console.log('shippingInfo',shippingInfo)

  // const handleCheckProduct = (e)=>{
  //   var {value,checked} = e.target
  //   var cart_tmp = [...cartDetail.cart_id]

  //   if(checked){


  //     cart_tmp.push(value)
  //   }else{
  //     let index = cart_tmp.findIndex(v => v.id == value)
  //     if(index != -1) cart_tmp.splice(index,1)
  //   }
  //   setCartDetail({cart_id : cart_tmp})
  // }

  // const handleCheckAllSeller = (e) =>{
  //   var {value : seller_id,checked} = e.target
  //   var cart_tmp = [...cartDetail.cart_id]

  //   var cart_seller_id = user.cart.filter(v => v.seller_id == seller_id).map(v => v.id)

  //   if(checked){
  //     //[...new Set(dataCheck)];
  //     cart_tmp = [...new Set([...cart_tmp,...cart_seller_id])]
  //     // cart_tmp.push(value)
  //   }else{
  //     cart_tmp = cart_tmp.filter(c => !cart_seller_id.find(c.id))
  //   }
  //   setCartDetail({cart_id : cart_tmp})

  // }
  const checkAddress = () => {
    let tmp = user.addresses.filter(val => val.at !== 'tax')
    if (tmp.length) {
      return true
    }
    return false
  }

  const [banner, setBanner] = useState();
  const fetchPage = () => {
    var page = 'cart';
    var vendor = 'cu';
    api.getBanner(page, vendor).then(res => {
      const data = res.data;
      setBanner(data);
    })
      .catch(err => {
        console.log(err.response);
      })
  }

  useEffect(() => {
    fetchPage();
  }, []);
  // console.log(cartDetail);

  const [shippingClick, setShippingClick] = useState('cu');

  return (
    <>
      <div className="container" style={{ marginTop: '15px' }}>
        <div className="row">
          <div className="col-xl-8 col-12 mb-2 mb-xl-0">
            <div className="row mx-0">
              <div className="col-12 px-0">
                <div className="bg-white br-8">
                  <div className="row mx-0">
                    <div className="col-12 pl-3 pt-3">
                      <div className="form-group mb-0">
                        <div className="custom-control custom-checkbox">
                          <input type="checkbox" className="custom-control-input" checked={isCheckAll()} id="chk2" name="chk2" value="all" required onChange={handleCheckall} />
                          <label className="custom-control-label" htmlFor="chk2">
                            <p>{t('translations:select_all')}  ( {cartDetail ? cartDetail.cart_id.length : user ? user.cart.length : 0} {t('translations:piece')} ){/* <i className="fas fa-chevron-right text-pink ml-2"></i>*/}</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  shippingInfo && user.cart.length ? shippingInfo.map((seller, index) => {
                    let list = user.cart.filter((c) => c.seller_id == seller.id)
                    return (
                      <Seller key={'st' + seller.id}
                        t={t}
                        list={list}
                        data={seller}
                        handleCart={handleCart}
                        isCheck={isCheck}
                        seller_id={seller.id}
                        calDetail={calDetail}
                        cartDetail={cartDetail}
                        setCheckall={setCheckall}
                        setCartDetail={setCartDetail}
                        handleCheck={handleCheck}
                        setHandleChangePackage={setHandleChangePackage}
                        user={user}
                        setShow2={setShow2}
                        handleShow2={handleShow2}
                        delCart={delCart}
                        shippingInfo={shippingInfo}
                        setShippingClick={setShippingClick} />
                    )
                  }) : ''
                }

                {/* {
                  packages.map(val => (
                    <Package key={val.id} 
                    t={t}
                    data={val} 
                    calDetail={calDetail} 
                    cartDetail={cartDetail} 
                    handleCheck={handleCheck}
                    handleCheckAllSeller={handleCheckAllSeller}
                    isCheck={isCheck}
                    />
                  ))
                } */}

              </div>
            </div>
          </div>
          <div className="col-xl-4 col-12">
            {
              user ? (
                user.addresses.length > 0 && checkAddress() ? (
                  <div className="row mx-0 mb-xl-4 mb-2">
                    <div className="col-12 px-0">
                      <div className="bg-white br-8 p-3">
                        <h5>{t('translations:shipping_address')}</h5>
                        <div className="sum s-address mt-3 d-flex justify-content-between">
                          <div>
                            {
                              (cartDetail.address_id && user.addresses.length > 0) ? (
                                <>
                                  <img src="/icon/icon-m-address.svg" className="mr-1" /> {user.addresses.find((a) => a.id == cartDetail.address_id).full_address}
                                </>
                              ) : ''
                            }
                          </div>
                          <p className="mb-0" style={{ textDecoration: 'underline', marginTop: '6px', color: '#999899', cursor: "pointer" }} onClick={handleShow}>{t('shippingInfo:changeAddress')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : ''
              ) : ''
            }
            {
              !!calDetail &&
              <div className="row mx-0">
                <div className="col-12 px-0">
                  <div className="bg-white br-8 p-3">
                    <h5>{t('translations:order_summary')}</h5>
                    <div className="sum mt-3">
                      <div className="sum-price d-flex justify-content-between">
                        <p>{t('translations:product_price')}</p>
                        <p className="text-num">฿ {calDetail.total && !isNaN(calDetail.total) ? currencyFormatDE(calDetail.total) : 0}</p>
                      </div>
                      {
                        calDetail.discount_shelf ? calDetail.discount_shelf.total_discount > 0 &&
                          <>
                            <div className="sum-price d-flex justify-content-between">
                              <p>{t('translations:discount')}</p>
                              <p className="text-num">- {currencyFormatDE(calDetail.discount_shelf.total_discount)}</p>
                            </div>
                            <hr />
                            <div className="sum-price d-flex justify-content-between">
                              <p>{t('translations:subtotal')}</p>
                              <p className="text-num">฿ {currencyFormatDE(calDetail.total_discount)}</p>
                            </div>
                            <hr />
                          </> : ''
                      }

                      {/* <div className="sum-track d-flex justify-content-between">
                        <p>{t('translations:shipping_fee')}</p>      
                        <p className="text-num">
                          {
                            user ? (
                              user.addresses.length > 0 && checkAddress() ? (
                                <>
                                {
                                  cartDetail.cart_id.length > 0 ? (
                                    <>
                                    ฿ {currencyFormatDE(calDetail.shipping || 0)}
                                    </>
                                  ):'฿ 0.00'
                                }
                                </>
                                
                              ) : (
                                <div className="text-right">
                                  <div className="mb-1">
                                    <button className="btn btn-primary mt-3" onClick={handleShow}>+ {t('translations:add_new_address')}</button>
                                  </div>
                                  <span className="text-default font-14 font-weight-normal">{t('calculated_address')}</span>
                                </div>
                              )
                            ) : ''
                          }
                        </p>    
                      </div> */}
                      <div className="mt-4 sum-all d-flex justify-content-between">
                        <p className="text">{t('translations:total')}</p>
                        <p className="text-num">
                          {
                            cartDetail.cart_id.length > 0 ? (
                              <div className="text-right">
                                <div className="mb-1 text-danger">
                                  ฿ {currencyFormatDE(calDetail.net_price || 0)}
                                </div>
                                {/* {
                                  (user && !user.addresses.length) && (
                                    <span className="text-default font-14 font-weight-normal">{t('include_shipping')}</span>
                                  )
                                }  */}

                              </div>
                            ) : '฿ 0.00'
                          }
                        </p>
                      </div>
                      {/* {
                        (user && cartDetail) && (
                          (total_price_cu != 0 && !shouldCuShip() &&cartDetail.shipping_type == 1) ? (
                            total_price_cu< 700 && (
                              <div className="border-top pt-3 text-center">
                                <p className="mb-0">{t('buy_more')} <span className="text-num text-danger">฿ { currencyFormatDE(700 - total_price_cu)}</span>  {t('translations:free_shipping')} ({t('only_cu')})</p>
                              </div>
                            )
                          ) : ''
                        )
                      } */}



                      {!canCodShip() ? <div className="text-danger my-3">{t('cod_cant_ship')}</div> : null}

                      <div className="mt-3">
                        {
                          user ? (
                            // user.addresses.length > 0 && cartDetail.cart_id.length > 0  && canCodShip() ? (
                            cartDetail.cart_id.length > 0 && canCodShip() ? (
                              <button type="button" className="btn btn-primary w-100" onClick={passSummary}>{t('translations:payment')}</button>
                            ) : (
                              <button type="button" className="btn btn-disabled w-100" disabled>{t('translations:payment')}</button>
                            )
                          ) : ''
                        }
                      </div>
                      {/* {
                        (user && !user.addresses.length) && (
                          <div className="mt-3 text-center">
                            <span className="text-danger">{t('new_address_payment')}</span>
                          </div>
                        )
                      }  */}
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <div className="end-page"></div>

      {user && cartDetail ? <ModalAddress cartDetail={cartDetail} setAddress={(address_id) => setCartDetail({ address_id })} setUser={setUser} setCalDetail={setCalDetail} setCartDetail={setCartDetail} user={user} show={show} handleClose={handleClose} /> : ''}
      <SelectorShipment handleClose={handleClose2} packageInfo={changePackage} show={show2} calDetail={calDetail} shippingClick={shippingClick} />

      <ConfirmDialog show={modalShow}
        text={t('translations:do_you_confirm_to_delete')}
        onConfirm={onConfirm}
        size="md" onHide={handleModalClose}
        cancel_btn={true}
        ref_id={ref_id} />

      <ModalEbook show={modalebook} setShow={setModalebook} t={t} />

    </>
  )
}

export default EcodeMainCartDesktop