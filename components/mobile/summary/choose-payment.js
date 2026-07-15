import axios from 'axios';
import classnames from 'classnames';
// import Router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { usePaymentInputs } from 'react-payment-inputs';
import Slip from '../../../components/mobile/summary/Slip';
import Loadbutton from '../../../components/mobile/widget/Button';
import api from '../../../utils/api';
import { withTranslation, Router } from '../../../utils/i18n';
import tools from '../../../utils/tools';

const ChoosePaymentthis = ({ paymentType, setPaymentType, user, setUser, setCartDetail, cartDetail, setCalDetail, calDetail, promotion, setPromotion, pointState, setPointState, t, query, canCodShip }) => {
  const [showDetail, setShowDeatail] = useState(false);
  const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps, wrapperProps, getCardImageProps } = usePaymentInputs();
  const [cardholderName, setCardholderName] = useState();
  const [CVC, setCVC] = useState();
  const [maskedCardNo, setMaskedCardNo] = useState();
  const [expMonth, setExpMonth] = useState();
  const [expYear, setExpYear] = useState();
  const [showPayment, setshowPayment] = useState(false);
  const togglePayment = () => setshowPayment(!showPayment);


  const subExpire = (e) => {
    var val = e.target.value;
    var item = val.split(' / ');
    // console.log(val);
    if (item.length == 2 && item[1].length > 0) {
      setExpMonth(item[0]);
      setExpYear(parseInt(item[1]) + 2000);
    }

  }
  const [showQrP, setshowQrP] = useState(false);
  const [showTranfer, setshowTranfer] = useState(false);
  const [showInfoCard, setshowInfoCard] = useState(false);
  const [showCashOnDelivery, setshowCashOnDelivery] = useState(false);
  const [showShopeePay, setShowShopeePay] = useState(false);

  const ClosecollapseInfoCard = () => {
    setshowInfoCard(false);
    setshowCashOnDelivery(false);
    setshowTranfer(false);
    setshowQrP(false);
  }
  const toggleshowDetail = () => setShowDeatail(!showDetail);
  const CloseshowDetail = () => setShowDeatail(false);

  const collapseInfoCard = () => {
    setshowInfoCard(true);
    setshowCashOnDelivery(false);
    setshowTranfer(false);
    setshowQrP(false);
    setShowShopeePay(false)
    setPaymentType(1);
  }

  const toggleshowTranfer = () => {
    setshowTranfer(!showTranfer);
    setshowInfoCard(false);
    setshowCashOnDelivery(false);
    setshowQrP(false);
    setShowShopeePay(false)
    setPaymentType(2);
  };


  const toggleshowQrP = () => {
    setshowQrP(!showQrP);
    setshowInfoCard(false);
    setshowCashOnDelivery(false);
    setshowTranfer(false);
    setShowShopeePay(false)
    setPaymentType(3);
  };

  const toggleshowCOD = () => {
    setshowInfoCard(false);
    setshowCashOnDelivery(true);
    setshowTranfer(false);
    setshowQrP(false);
    setShowShopeePay(false)
    setPaymentType(4);
  };

  const toggleshowShopeePay = () => {
    setShowShopeePay(!showShopeePay)
    setshowTranfer(false);
    setshowInfoCard(false);
    setshowCashOnDelivery(false);
    setshowQrP(false);
    setPaymentType(5);
  };

  const [showQr, setshowQr] = useState(false);
  // const openQr = () => setshowQr(true);

  const [form, setForm] = useState();
  const [qrImg, setQRImg] = useState();
  const [qrcode, setQRCOde] = useState();
  const [qrStatus, setQRStatus] = useState(0);
  //QR Time
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [tranfer, setTranfer] = useState(false);
  const [loading, setLoadding] = useState(false);

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(
    () => {
      // Your custom logic here
      setCount(count - 1);
      setIsRunning(!count == 0);
    },
    isRunning ? delay : null
  );


  useEffect(() => {
    const script = document.createElement('script');
    script.src = process.env.payment_script || "https://t.2c2p.com/securepayment/api/my2c2p.1.6.9.min.js";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);
  const setarea = ['10', '11', '12', '13'];

  const savePaymentType = (type) => {
    api.updatePaymentType(cartDetail.order_id, { payment_type: type })
      .then(res => {
        const data = res.data;
      })
      .catch(err => {
        console.log(err.response);
      })
  }

  const handlePayment = () => {
    //setLoadding(true);
    event.preventDefault();
    My2c2p.getEncrypted("2c2p-payment-form", function (h, errCode, errDesc) {
      if (errCode != 0) {
        alert(errDesc + " (" + errCode + ")");
        setLoadding(false);
      } else {

        const card_info = { name: cardholderName, encrypted: h.encryptedCardInfo }
         setLoadding(true);
        api.paymentData({ isMobile: true, order_id: cartDetail.order_id, card_info }).then(res => {
          savePaymentType(1);
          const data = res.data;
          setForm(data.form)
          document.getElementById("paymentRequestForm").submit();
          setLoadding(false);

        }).catch(err => {
          setLoadding(false);
          console.log(err);
        })
      }
    });
  }

  const getQRCode = () => {
    //console.log(order_id);
    api.getNewQR({ order_id: cartDetail.order_id, order_from: 'mobile' })
      .then(res => {
        const data = res.data;
        //;
        setshowQr(true);
        savePaymentType(3);
        setQRStatus(1);
        setQRCOde(data);
        setCount(15 * 60);
        setIsRunning(true);
      })
      .catch(err => {
        setshowQr(false);
        console.log(err.response);
      })
  }

  const handleCOD = () => {
    api.updatePaymentType(cartDetail.order_id, { status: 2, payment_type: 4 })
      .then(res => {
        const data = res.data;
        if (query) {
          Router.push(query);
        } else {
          Router.push(`/user/success_order/[order_id]?order_id=${cartDetail.order_id}`, `/user/success_order/${cartDetail.order_id}`);

          // Router.push(`/user/success_order/${cartDetail.order_id}`);
        }
      })
      .catch(err => {
        console.log(err.response);
      })
  }

  const tranferSlip = () => {
    setTranfer(true);
  }
  const handleSlip = () => {
    if (query) {
      Router.push(query);
    } else {
      Router.push(`/user/success_order/[order_id]?order_id=${cartDetail.order_id}`, `/user/success_order/${cartDetail.order_id}`);

      // Router.push(`/user/success_order/${cartDetail.order_id}`);
    }
  }

  const handleOrder = () => {
    if (query) {
      Router.push(query);
    } else {
      Router.push(`/user/order-detail/[order_id]?order_id=${cartDetail.order_id}`, `/user/order-detail/${cartDetail.order_id}`);

      // Router.push(`/user/order-detail/${cartDetail.order_id}`);
    }
  }
  // console.log('cartDetail', cartDetail);
  // console.log('calDetail', calDetail);
  const timeRunning = (count) => {
    var minute = '' + parseInt(count / (60));
    var second = '' + parseInt(count % (60));
    if (minute.length < 2) {
      minute = '0' + minute;
    }
    if (second.length < 2) {
      second = '0' + second;
    }
    return minute + ' : ' + second;
  }

  // console.log(cartDetail);
  const createShopeePayFunc = () => {
    let data = {}
    data.order_id = cartDetail.order_id
    data.total = calDetail.net_price
    data.site = "mweb"
    data.return_url = `${api.frontend_url}/user/success_order/${cartDetail.order_id}`
    api.createShopeePay(data)
      // axios.post(`http://192.168.150.66:8080/order/payment/shopee-pay/create`,data)
      .then(res => {
        const { errcode, redirect_url_http, debug_msg } = res.data;
        if (errcode == 0) {
          window.location.href = redirect_url_http;
        } else {
          alert(debug_msg)
        }

      })
      .catch(err => {
        console.log(err.response);
      })
  }


  return (
    <>

      <div className="container bg-white ">
        {
          !tranfer && (
            <>{
              <div className="radio-collapse custom-radio custom-control row payment-border">
                <input type="radio" id="Creditcard_info_chx" name="customRadio" className="custom-control-input" onClick={collapseInfoCard} />
                <label className="custom-control-label" for="Creditcard_info_chx">
                  <img className="img-fluid mr-2 my-auto" src="/mobile/image/icon/icon-creditcard.svg" />
                  <p className="text-black my-auto">{t("mobile_shippingInfo:credit_debit_card")}</p>
                </label>
              </div>}
              <form id="2c2p-payment-form" className={classnames("credit", { "show": showInfoCard })} onSubmit={handlePayment}>
                <div className={classnames("info-creditcard clearfix", { "show": showInfoCard })}>
                  <input type="hidden" value={expMonth} onChange={(event) => setExpMonth(event.target.value)} data-encrypt="month" maxLength="2" placeholder="MM" />
                  <input type="hidden" value={expYear} onChange={(event) => setExpYear(event.target.value)} data-encrypt="year" maxLength="4" placeholder="YYYY" />

                  <div className="my-3 d-flex">
                    <img className="img-fluid mr-2" src="/mobile/image/icon/icon-visa.svg" />
                    <img className="img-fluid mr-2" src="/mobile/image/icon/icon-mastercard.svg" />
                    <img className="img-fluid mr-2" src="/mobile/image/icon/icon-jcb.svg" />
                  </div>
                  <div className="info-creditcard-100 mt-4">
                    <input type="text" pattern="[0-9]*" autoComplete="off" value={maskedCardNo} onChange={(event) => setMaskedCardNo(event.target.value)} data-encrypt="cardnumber" maxLength="16" className="effect-16 invalid" required />
                    {/* <input className="effect-16" {...getCardNumberProps()} autoComplete="off" type="text" value={maskedCardNo} onChange={(event) => setMaskedCardNo(event.target.value)} data-encrypt="cardNumber" maxLength="16" placeholder="" required /> */}
                    <label>{t("mobile_shippingInfo:card_number")}<span>*</span></label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="info-creditcard-100 mt-50px">
                    <input className="effect-16" value={cardholderName} onChange={(event) => setCardholderName(event.target.value)} name="cardholderName" type="text" required />
                    <label>{t("mobile_shippingInfo:name_on_card")}<span>*</span></label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="info-creditcard-50 mt-50px mr-for-50">
                    <input  {...getExpiryDateProps({ onChange: subExpire })} placeholder="" autoComplete="off" className="effect-16" required />
                    <label>{t("mobile_shippingInfo:expiration_date")}<span>*</span></label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="info-creditcard-50 mt-50px">
                    <input type="password" value={CVC} onChange={(event) => setCVC(event.target.value)} data-encrypt="cvv" maxLength="3" autoComplete="off" placeholder="" className="effect-16" required />
                    <label>CVV<span>*</span></label>
                    <span className="focus-border"></span>
                  </div>
                  <Loadbutton loading={loading} name={t('mobile_shippingInfo:payment')} btntype="submit" />
                </div>

              </form>
              {
                form && <div className="d-none" dangerouslySetInnerHTML={{ __html: form }} />
              }
              {/* {api.mode != "production" && */}
              <div className="radio-collapse custom-radio custom-control row payment-border">
                <input type="radio" id="shopee_pay_info_chx" name="customRadio" className="custom-control-input" checked={paymentType == 5} onClick={toggleshowShopeePay} />
                <label className="custom-control-label" for="shopee_pay_info_chx">
                  <img className="img-fluid mr-2 my-auto icon-shopee-pay" src="/mobile/image/icon/shopee-pay.svg" />
                  <p className="text-black my-auto">{t("mobile_shippingInfo:shopee_pay")}</p>
                </label>
              </div>
              {/* } */}
              <div className={showShopeePay ? "qr show" : "qr"}>
                <div className="container bg-white px-0 pb-3">
                  <hr className="use-line my-0"></hr>
                  <button className={classnames("btn bg-pink w-100 text-white mb-2 mt-4", { "d-none": showQr })} onClick={createShopeePayFunc} >{t("mobile_shippingInfo:payment")}</button>
                </div>
              </div>
              {cartDetail?.order?.type === 'ecode' ? '' : <div className="radio-collapse custom-radio custom-control row payment-border">
                <input type="radio" id="Transfer_info_chx" name="customRadio" className="custom-control-input" checked={paymentType == 2} onClick={toggleshowTranfer} />
                <label className="custom-control-label" for="Transfer_info_chx">
                  <img className="img-fluid mr-2 my-auto" src="/mobile/image/icon/icon-bank.svg" />
                  <p className="text-black my-auto">{t("mobile_shippingInfo:bank_transfer")}</p>
                </label>
              </div>}


              <div className={showTranfer ? "transfer  show" : "transfer"}>
                <hr className="use-line my-0"></hr>
                <p className="text-black pt-3 py-1 mb-0">{t("mobile_shippingInfo:saving_account")}<br />
                </p>
                <div className="d-flex  pt-3 pb-2">
                  <img className="img-fluid mr-3 my-auto" src="/mobile/image/icon/icon-scb.svg" />
                  <div className="my-auto">
                    <p className="text-black mb-0">{t("mobile_shippingInfo:scb_bank")} {t("mobile_shippingInfo:branch")} : {t("mobile_shippingInfo:surawong")}</p>
                    <p className="text-black mb-0">{t("mobile_shippingInfo:account_number")} : <span className="font-weight-bold h20">002-2-08292-3</span></p>
                  </div>
                </div>
                <div className="d-flex pt-3 pb-2">
                  <img className="img-fluid mr-3 my-auto" src="/mobile/image/icon/icon-kbank.svg" />
                  <div className="my-auto">
                    <p className="text-black mb-0">{t("mobile_shippingInfo:k_bank")} {t("mobile_shippingInfo:branch")} : {t("mobile_shippingInfo:siam_square")}</p>
                    <p className="text-black mb-0">{t("mobile_shippingInfo:account_number")} : <span className="font-weight-bold h20">026-2-42844-3</span></p>
                  </div>
                </div>
                <div className="d-flex  pt-3 pb-2">
                  <img className="img-fluid mr-3 my-auto" src="/mobile/image/icon/icon-bualuang.svg" />
                  <div className="my-auto">
                    <p className="text-black mb-0">{t("mobile_shippingInfo:bangkok_bank")} {t("mobile_shippingInfo:branch")} : {t("mobile_shippingInfo:siam_square")}</p>
                    <p className="text-black mb-0">{t("mobile_shippingInfo:account_number")} : <span className="font-weight-bold h20">152-0-91525-5</span></p>
                  </div>
                </div>
                <div className="d-flex  pt-3 pb-4">
                  <img className="img-fluid mr-3 my-auto" src="/mobile/image/icon/icon-ktb.svg" />
                  <div className="my-auto">
                    <p className="text-black mb-0">{t("mobile_shippingInfo:krung_thai_bank")} {t("mobile_shippingInfo:branch")} : {t("mobile_shippingInfo:siam_square")}</p>
                    <p className="text-black mb-0">{t("account_number")} : <span className="font-weight-bold h20">052-1-25100-1</span></p>
                  </div>
                </div>
                <button className="btn bg-pink w-100 text-white my-2" type="button" onClick={tranferSlip}>{t("mobile_shippingInfo:inform_payment")}</button>
                <button type="button" className="btn text-black w-100 btn-border-pink  my-2" onClick={() => handleSlip()}>{t("mobile_shippingInfo:pay_later")}</button>
              </div>

              <div className="radio-collapse custom-radio custom-control row payment-border">
                <input type="radio" id="Qr_info_chx" name="customRadio" className="custom-control-input" checked={paymentType == 3} onClick={toggleshowQrP} />
                <label className="custom-control-label" for="Qr_info_chx">
                  <img className="img-fluid mr-2 my-auto" src="/mobile/image/icon/icon-qr.svg" />
                  <p className="text-black my-auto">QR CODE</p>
                </label>
              </div>
              <div className={showQrP ? "qr show" : "qr"}>
                <div className="container bg-white px-0 pb-3">
                  <hr className="use-line my-0"></hr>
                  {
                    isRunning == 1 ? (
                      <div className={classnames("qr-area", { "show": showQr })}>
                        <p className="text-black mb-0">{t("mobile_shippingInfo:scan_to_pay")} / QR CODE</p>
                        <p className="text-black">{t("mobile_shippingInfo:time_left")}  <span className="text-pink">{timeRunning(count)}</span> {t("mobile_shippingInfo:minute")}</p>
                        {
                          qrStatus == 1 ? (
                            <>
                              <div className="box-qr">
                                <div className="box-qr-th">
                                  <img className="img-fluid h-48px" src="/mobile/image/logo/thai_qr.png" />
                                </div>
                                <div className="box-qr-area">
                                  <img src={qrcode ? qrcode.qrImage : ''} className="img-qrcode" />
                                </div>
                                <div className="box-qr-content">
                                  <h4 className="text-center">{t("mobile_shippingInfo:account_name")} : {t("mobile_shippingInfo:cu_book")}
                                  </h4>
                                  <h4 className="text-center">{t("mobile_Order:order")} #{cartDetail ? cartDetail.order_id : ''}
                                  </h4>
                                  <h4 className="text-center">{t("mobile_shippingInfo:total_payment_qr")} {calDetail ? tools.currencyFormatDE(calDetail.net_price) : ''} {t("mobile_shippingInfo:bath")}
                                  </h4>
                                </div>
                                <div className="box-qr-footer px-2">
                                  <img className="img-fluid" src="/mobile/image/logo/footer-qr.svg" />
                                </div>
                              </div>
                            </>
                          ) : ''
                        }
                        <a href={qrcode ? qrcode.qrImage : ''} download>
                          <button className="btn bg-pink w-100 text-white my-2">{t("mobile_shippingInfo:save_photo_gallery")}</button>
                        </a>
                        <button type="button" className="btn text-black w-100 btn-border-pink  mt-2" onClick={() => handleOrder()}>ดูคำสั่งซื้อ</button>
                        <div className="mt-4">
                          <p className="mb-0 text-danger">{t("mobile_Order:qr_remark")}</p>
                        </div>
                      </div>
                    ) : qrStatus == 1 && isRunning == 0 ? (
                      <div className={classnames("qr-area", { "show": showQr })}>
                        <p className="text-black">QR CODE {t("mobile_shippingInfo:expire")}  <a className="text-pink" onClick={getQRCode}>{t("mobile_shippingInfo:please_click_here")}</a></p>
                      </div>
                    ) : (
                      <button className={classnames("btn bg-pink w-100 text-white mb-2 mt-4", { "d-none": showQr })} onClick={getQRCode} >{t("mobile_shippingInfo:view")} QR CODE</button>
                    )
                  }


                </div>
              </div>



              {
                (cartDetail && cartDetail.order) && cartDetail.order.isOnlyEbook != 1 && canCodShip ? (
                  <>
                    {
                      user && cartDetail && ((parseFloat(cartDetail.order && cartDetail.order.total_weight)) <= 5) && (cartDetail.order && cartDetail.order.shipping_type == 2) && setarea.includes(user.addresses.find((item) => item.id == cartDetail.address_id).province_code) == 1 ? (
                        <>
                          <div className="radio-collapse custom-radio custom-control row payment-border">
                            <input type="radio" id="CashOnDelivery_chx" name="customRadio" className="custom-control-input" checked={paymentType == 4} onClick={toggleshowCOD} />
                            <label className="custom-control-label" for="CashOnDelivery_chx">
                              <img className="img-fluid mr-2 my-auto" src="/mobile/image/icon/icon-wallet.svg" />
                              <p className="text-black my-auto">{t("mobile_shippingInfo:cod")}</p>
                            </label>
                          </div>
                          <div className={classnames("cash-on-delivery px-0", { "show": showCashOnDelivery })}>
                            <p className="text-black mb-0">
                              {t("mobile_shippingInfo:pay_cod")}
                            </p>
                            <input type="button" className="btn btn-primary w-100 my-3" value={t('mobile_shippingInfo:cod_payment')} onClick={handleCOD} />
                          </div>
                        </>
                      ) : ''
                    }
                  </>
                ) : ''
              }
            </>
          )
        }


        {
          tranfer && (
            <Slip
              tranfer={tranfer} setTranfer={setTranfer}
              user={user} setUser={setUser}
              promotion={promotion ? promotion : null} setPromotion={setPromotion}
              pointState={pointState} setPointState={setPointState}
              setCalDetail={setCalDetail} calDetail={calDetail}
              cartDetail={cartDetail} setCartDetail={setCartDetail}
              query={query} setLoadding={setLoadding} loading={loading}
            />
          )
        }
      </div>
    </>
  )
}
export default withTranslation('shippingInfo')(ChoosePaymentthis);