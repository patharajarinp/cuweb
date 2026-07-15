import { default as classNames, default as classnames } from 'classnames';
import React, { useState } from 'react';
import { Form, FormGroup } from 'reactstrap';
import { withTranslation } from '../../../utils/i18n';
import tools from '../../../utils/tools';
const Package = ({ user, setCartDetail, cartDetail, toggleGuarantee, calDetail, onChangeShippingType, shippingCost, packageInfo, selected, t }) => {

  // const toggleHidden = () => setShow(false);
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);


  const checkpreOrder = (carts) =>{
    if(!carts?.length) return true
    // if(l.shipping_type != 3 ) return false
    return !!carts.find(val => val.is_preorder == 1)
  }

  const havePreOrder = checkpreOrder(packageInfo?.carts)


  //const canShip = shippingCost.total3 >= 0
  const canShip = (shippingCost?.total3 ?? -1) >= 0;

  // console.log('canShip'+canShip);

  const setarea = ['10', '11', '12', '13'];


  var ship = false;
  // console.log('cartDetail',cartDetail)
  if (packageInfo) {
    ship = packageInfo.carts.findIndex(val => val.type != 'ebook' && val.type != 'course') != -1;

  }

  //const {total,total1,total2,total3} = shippingCost;
  const {
    total = -1,
    total1 = -1,
    total2 = -1,
    total3 = -1,
    canShip: costCanShip = false
  } = shippingCost || {};

  // console.log('shippingCost',shippingCost)


  return (
    <>
      {
        cartDetail && packageInfo && (
          <>
            <div className="container bg-white mt-3">

              {ship && (


                <>
                  <div className="package-name">
                    {/* <h4 className="text-black my-auto">แพคเกจ 1 จาก 2</h4> */}
                    <h4 className="text-black my-auto"></h4>
                    <h5 className="my-auto"><span className="p-12">{t("mobile_translations:shipped_by")} : </span>{packageInfo.shop_name}</h5>
                  </div>
                  <div className="chose-delivery-title">
                    <p className="text-black my-auto">{t("mobile_translations:shipping_options")}</p>
                    <a className="d-flex" onClick={toggleGuarantee}>
                      <img className="img-fluid mr-2" src="/mobile/image/icon/icon-guarantee.svg" />
                      <p className="p-12 text-pink my-auto ">{t("mobile_summary:guaranteed_by")} CHULABOOK</p>
                    </a>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {
                        user.addresses.length > 0 ? (
                          calDetail && cartDetail.seller && (
                            <h5 className="text-black my-auto font-14">{
                              cartDetail.seller[packageInfo.id].shipping_type == 1 ? t("mobile_translations:standard_delivery") : cartDetail.seller[packageInfo.id].shipping_type == 2 ? t("mobile_translations:express_delivery") : cartDetail.seller[packageInfo.id].shipping_type == 3 ? t("mobile_translations:cash_on_delivery") : ''
                            }</h5>
                          )
                        ) : ''
                      }

                      {
                        user.addresses.length > 0 ? (
                          calDetail && cartDetail.seller && (
                            <h4 className="font-weight-bold text-black mb-0">{
                              !shippingCost.canShip ? (
                                t('mobile_translations:unsupported_shipping')
                              ) 
                              : shippingCost.total == 0 ? (
                                `${t("mobile_translations:free_shipping")}`
                              ) 
                              : (
                                  <>
                                    ฿ {tools.currencyFormatDE(shippingCost.total)}
                                  </>
                                )
                             
                                
                            }</h4>
                          )
                        ) : ''
                      }

                    </div>
                    <div className="d-flex justify-content-between align-items-center">

                      <h5 className="text-pink my-auto" onClick={toggleShow}>{t("mobile_address:edit")}</h5>
                    </div>
                  </div>
                  <hr className="row use-line mt-4 mb-0"></hr>
                </>
              )}


              {
                packageInfo.carts.map((val, index) => {
                  let total_price = val.cover_price * val.quantity;

                  if(calDetail && calDetail.discount_shelf){
                    // console.log('calDetail',calDetail)
                    let {discount_list} = calDetail.discount_shelf;
                    let item = discount_list.find(d => d.product_id == val.product_id)
                    if (item) {
                      total_price -= item.total_discount + item.discount_web;
                    }

                  }

                  var total_discount = (val.cover_price * val.quantity) - total_price;
                  // console.log('total_discount',total_discount)
                  return (
                    <div className="product-in-cart d-block" key={index}>
                      <div className="w-100 d-flex ">
                        <div className="product-in-cart-pic-area">
                          <div className="product-in-cart-pic ">
                            <img className="img-fluid" src={val.picture ? val.picture : '/mobile/image/product/book.png'} />
                          </div>
                        </div>
                        <div className="product-in-cart-content">
                          <h4 className="text-black two-line">{val.name}</h4>
                          <div className="d-flex align-items-center">
                            <div className={classNames("tag-cat ", { "tag-book": 
                            (val.item_code == 10000 || val.item_code == 20000)
                            , "tag-stationary": (val.item_code == 30000)
                            , "tag-ebook": (val.item_code == null)
                            , "tag-course": (val.type == "course")
                            , "tag-ecode": (val.type == "ecode")
                             })}>{(val.item_code == 10000 || val.item_code == 20000)
                              ? t('mobile_header:book_menu') : val.item_code == 30000 
                              ? t('mobile_header:stationary') : val.item_code == null 
                              ? t('mobile_header:e-code') : val.type == "ecode" 
                              ? t('mobile_header:e_book') : val.type == "course" 
                              ? t('mobile_header:online_course') : null}</div>
                            {!!val.is_preorder && <div className="tag-cat px-3" style={{ backgroundColor: '#DE5C6E' }}>Preorder</div>}
                          </div>
                        </div>
                      </div>
                      <div className="w-100 d-flex align-items-center">
                        <div className="product-in-cart-content m-0 mt-3">
                          <div className="d-flex justify-content-between align-items-center w-100 flex-wrap mb-3">
                            <div>
                              <p className="text-gray font-12 mb-0  lineh-1 d-flex align-items-center justify-content-between">{t('mobile_shippingInfo:unit_price')} </p>
                              {
                                val.cover_price == 0 ? (
                                  <h4 className=" text-black mb-0 font-weight-bold">{t('mobile_shippingInfo:free')}</h4>
                                ) : (
                                  <h4 className=" text-black mb-0 font-weight-bold">฿ {tools.currencyFormatDE(val.cover_price)}</h4>
                                )
                              }
                            </div>
                            <h4 className="text-black font-weight-bold my-auto"><span className="font-weight-normal text-grey p-14">{t("mobile_translations:quantity")} :</span> {val.quantity}</h4>
                           
                          </div> 
                          {
                            total_price ? (
                              <>
                                <p className="text-gray font-12 mb-1  lineh-1 d-flex align-items-center justify-content-between">{t('mobile_shippingInfo:total_prices')} <span className="font-14 text-pink mb-0 font-weight-bold">฿ {tools.currencyFormatDE(total_price)}</span></p>
                                {
                                  !!total_discount && (
                                    <p className="text-gray font-12 mb-0  lineh-1 d-flex align-items-center justify-content-between">{t('mobile_shippingInfo:save')} <span className="font-12 text-green mb-0 font-weight-bold">฿ {tools.currencyFormatDE(total_discount)}</span></p>
                                  )
                                }
                              
                              </>
                            ) : (
                              <p className="text-gray font-12 mb-1  lineh-1 d-flex align-items-center justify-content-between">{t('mobile_summary:total_prices')} <span className="font-14 text-pink mb-0 font-weight-bold">{t('mobile_summary:free')}</span></p>
                            )
                          }
                          {
                            calDetail && calDetail.discount_shelf && calDetail.discount_shelf.cart_promotion && calDetail.discount_shelf.cart_promotion.find((c)=>c.id == val.product_id)  ? 
                            <p className="font-12 text-grey mt-1 border-promotion">
                              {calDetail.discount_shelf.cart_promotion.find((c)=>c.id == val.product_id).promotion}
                            </p> : ''
                          }
                        </div>
                      </div>
                    </div>

                  )
                }
                )
              }
            </div>
            <div className={classnames("select-deli-ar", { "show": show })}>
              <div className="cart-nav">
                <div className="btn-back row " onClick={toggleShow} style={{ flex: "none" }} >
                  <img className="img-fluid ml-2" src={'/mobile/image/icon/icon-back.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
                </div>
                <h3 className="title-sdal">{t("mobile_translations:shipping_options")}</h3>
              </div>
              <div className="select-deli-ar-ls">
                <Form>
                  {
                    user.addresses.length > 0 ? (
                      calDetail && cartDetail.seller && (
                        <FormGroup >
                          <div className="deli-c custom-radio custom-control">
                            <input type="radio" id={packageInfo.id + "Delivery01_01"} name="customRadio" className="custom-control-input" disabled={total1 < 0} checked={cartDetail.seller[packageInfo.id].shipping_type == 1 && total1 >= 0 } onClick={() => { onChangeShippingType(packageInfo.id, 1) }} />
                            <label className={classnames("custom-control-label", { "bg-gray-dis": total1 < 0 })} htmlFor={packageInfo.id + "Delivery01_01"}>
                              <h5 className={classnames("mb-0 text-14", { "text-black": total1 >= 0 })}>{t("mobile_translations:standard_delivery")}</h5>
                              <h4 className={classnames("font-weight-bold  mb-0", { " text-black": total1 >= 0 })}>
                                {
                                  total1 == 0 ? (
                                    `${t("mobile_translations:free_shipping")}`
                                  ) : total1 > 0 ?  (
                                      <>
                                        ฿ {tools.currencyFormatDE(total1)}
                                      </>
                                    )
                                    : t('mobile_translations:unsupported_shipping')
                                }
                              </h4>

                              {/* <p className="p-12 mb-0">{t("mobile_summary:will_inherit")} 24-31 ธ.ค.</p> */}
                            </label>
                          </div>
                          <div className="deli-c custom-radio custom-control ">
                            <input type="radio" id={packageInfo.id + "Delivery01_02"} name="customRadio"  className="custom-control-input" disabled={shippingCost.total2 < 0} checked={cartDetail.seller[packageInfo.id].shipping_type == 2} onClick={() => { onChangeShippingType(packageInfo.id, 2) }} />
                            <label className={classnames("custom-control-label", { "bg-gray-dis": total2 < 0 })} htmlFor={packageInfo.id + "Delivery01_02"}>
                              <h5 className={classnames("mb-0 text-14", { "text-black": total2 >= 0 })}>{t("mobile_translations:express_delivery")}</h5>
                              <h4 className={classnames("font-weight-bold  mb-0", { " text-black": total2 >= 0 })}>
                                {
                                  total2 == 0 ? (
                                    `${t("mobile_translations:free_shipping")}`
                                  ) : total2 > 0 ? (
                                      <>
                                        ฿ {tools.currencyFormatDE(total2)}
                                      </>
                                    )
                                    :  t('mobile_translations:unsupported_shipping')
                                }
                              </h4>

                              {
                                (user && cartDetail && calDetail) && (parseFloat(calDetail.weight)) <= 5 && setarea.includes(user.addresses.find((item) => item.id == user.addresses[selected].id).province_code) == 1 ? (
                                  <p className="p-12">{t("mobile_summary:payment_support")}</p>
                                ) : ''
                              }
                              {/* <p className="p-12 mb-0">{t("mobile_summary:will_inherit")} 24-31 ธ.ค.</p> */}
                              {/* <p className="p-12">รองรับการชำระเงินแบบปลายทาง</p> */}
                            </label>
                          </div>
                          <div className="deli-c custom-radio custom-control ">
                            <input type="radio" id={packageInfo.id + "Delivery01_03"} name="customRadio" className="custom-control-input" checked={cartDetail.seller[packageInfo.id].shipping_type == 3} disabled={!canShip || havePreOrder} onClick={() => { onChangeShippingType(packageInfo.id, 3) }} />
                            <label className={classnames("custom-control-label", { "bg-gray-dis": !canShip || havePreOrder })} htmlFor={packageInfo.id + "Delivery01_03"}>
                              <h5 className={classnames("mb-0 text-14", { "text-black": canShip && !havePreOrder })}>{t("mobile_translations:cash_on_delivery")}</h5>
                              <h4 className={classnames("font-weight-bold  mb-0", { " text-black": canShip && !havePreOrder })}>
                                {
                                  total3 == 0 ? (
                                    `${t("mobile_translations:free_shipping")}`
                                  ) : total3 > 0 && !havePreOrder ? (
                                    <>
                                      ฿ {tools.currencyFormatDE(total3)}
                                    </>
                                  ) :  (
                                    <>
                                      <div>{t('mobile_translations:unsupported_shipping')}</div>
                                      
                                      {total3 == -2 && <small>เนื่องจากยอดเงินเกินที่กำหนด</small>} 
                                    
                                    </>
                                    )
                                }
                              </h4>


                              {
                                (user && cartDetail && calDetail) && (parseFloat(calDetail.weight)) <= 5 && setarea.includes(user.addresses.find((item) => item.id == user.addresses[selected].id).province_code) == 1 ? (
                                  <p className="p-12">{t("mobile_summary:payment_support")}</p>
                                ) : ''
                              }
                              {/* <p className="p-12 mb-0">{t("mobile_summary:will_inherit")} 24-31 ธ.ค.</p> */}
                              {/* <p className="p-12">รองรับการชำระเงินแบบปลายทาง</p> */}

                            </label>
                          </div>
                        </FormGroup>
                      )
                    ) : ''
                  }
                </Form>
              </div>
            </div>
            {/* <div className={classnames("guarantee-pop-area", { "show": show })}>
            <div className={classnames("guarantee-pop-box", { "show": show })}>
              <div className="guarantee-pop">
                <h3 className="text-black text-center">{t("mobile_summary:shipping_supported_by_cu")}</h3>
                <p className="text-black text-center">{t("mobile_summary:delivery_track")}</p>
              </div>
              <a className="btn-pink-submit" onClick={toggleHidden}>
                <h4 className="text-white m-auto">{t("mobile_summary:more_products")}</h4>
              </a>
            </div>
          </div> */}
          </>
        )
      }

    </>
  )
}
export default withTranslation('summary', 'shippingInfo', 'mobile_summary', 'mobile_shippingInfo')(Package);