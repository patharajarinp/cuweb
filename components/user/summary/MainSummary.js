import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Datetime from 'react-datetime';
import { usePaymentInputs } from 'react-payment-inputs';
import Layout from '../../../components/layout';
import ModalSuccess from '../../../components/modal/success_order';
import SummaryFirstStep from '../../../components/widget/SummaryFirstStep';
// import Router, { useRouter } from 'next/router'
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import AuthService from '../../../utils/AuthService';
import { Router, withTranslation } from '../../../utils/i18n';
import { useMergeState } from '../../../utils/state_tools';
import tools from '../../../utils/tools';
import Loadbutton from '../../../components/widget/Button'
import axios from 'axios';
import router from 'next/router';

const MainSummary = (props) => {
  const { t, loading, setLodding } = props;
  const [cartDetail,setCartDetail] = useMergeState({
    address_id:0,
    shipping_type:1,
    cart_id:[],
  })
  const [calDetail, setCalDetail] = useState(null);
  const [calDetailTemp, setCalDetailTemp] = useState(null);
  const [pointState, setPointState] = useState(0);

  const [cardId, setCardId] = useState(null);
  
  const images = ["/images/JCB.png","/images/VISA.png","/images/MASTERCARD.png"]

  ////////////////////////////////////////////////////////////////////////
  const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs();
  const [loading2, setLodding2] = useState(false);
  const { user, handleCart, fetchUser, setUser, onSocket } = useContext(UserContext)
  const [cart, setCart] = useState();
  const [summary, setSummary] = useState('0.00');
  const [defaultSum, setDefaultSum] = useState('0.00');
  const [shipping, setShipping] = useState('0.00');
  const [sumweight, setSumWeight] = useState('0.00');
  const [discount, setDiscount] = useState('0.00');
  const [changeDefaut, setChangeDefaut] = useState(0);
  const [message, setMassage] = useState();
  const [startDate, setStartDate] = useState(null);
  const [loadButton, setLoadButton] = useState(false)

  const [showS,setshowS] = useState(false);
  const [show, setShow] = useState(false);
  const [show3, setShow3] = useState(false);
  const openShowS =()=>setshowS(!showS);
  const handleClose = () => {
    setShow(false);
    setSwitchAdd(0);
  };
  const handleShow = (chk) => {
    setChangeDefaut(chk);
    setShow(true);
    //console.log(selected2);
  }
  const handleClose3 = () => setShow3(false);
  const handleClose4 = () => setShow4(false);

  const [showCredit,setshowCredit]=useState(true);
  const ToggleshowCredit = () => setshowCredit(!showCredit);

  //Type & Area Shipping

  //Promotion
  const [promotion, setPromotion] = useState();
  const [checkcode, setCode] = useState();

  //Payment
  const [cardholderName, setCardholderName] = useState();
  const [CVC, setCVC] = useState();
  const [maskedCardNo, setMaskedCardNo] = useState();
  const [expMonth, setExpMonth] = useState();
  const [expYear, setExpYear] = useState();

  const [paymentType, setPaymentType] = useState(0);
  const [qrImg, setQRImg] = useState();
  const [qrcode, setQRCOde] = useState();
  const [qrStatus, setQRStatus] = useState(0);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState();

  //QR Time
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);


  const [require_tax, setRequire_tax] = useState(0);


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
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);
  const setarea = ['10', '11', '12', '13'];


  const saveStep = (step) => {setStep(step)}

  useEffect(() => user && onSocket(user.id, eventSuccessQR, 'qr'), [user])

  const getQRCode = () => {
  
    api.getNewQR({ order_id:cartDetail.order_id, order_from: 'desktop' })
      .then(res => {
        const data = res.data;
        //;
        savePaymentType(3);
        setQRStatus(1);
        setQRCOde(data);
        setCount(15 * 60);
        setIsRunning(true);
      })
      .catch(err => {
        console.log(err.response);
      })
  }

  const savePaymentType = (type) => {
    api.updatePaymentType(cartDetail.order_id, { payment_type: type })
      .then(res => {
        const data = res.data;
      })
      .catch(err => {
        console.log(err.response);
      })
  }

  const changePaymentType = (payType) => {
    setPaymentType(payType);
    if(payType != 4) {
      savePaymentType(payType);
    }
    
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = process.env.payment_script ||  "https://t.2c2p.com/securepayment/api/my2c2p.1.6.9.min.js";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const eventSuccessQR = (data, response) => {
    // api.updatePaymentType(data.order_id, { status: 2 })
    //   .then(res => {
    //     const data = res.data;
    //   })
    //   .catch(err => {
    //     console.log(err.response);
    //   })
    Router.push(`/user/success_order/${data.order_id}`);
  }

  const handlePayment = () => {
    event.preventDefault();
    My2c2p.getEncrypted("2c2p-payment-form", function (h, errCode, errDesc) {
      if (errCode != 0) {
        alert(errDesc + " (" + errCode + ")");
      } else {
        const store_card = document.getElementById('item-card').checked;
        const card_info = { name: cardholderName, encrypted: h.encryptedCardInfo, store_card }
        setLodding(true);
        api.paymentData({ order_id:cartDetail.order_id, card_info }).then(res => {
          savePaymentType(1);
          const data = res.data;
          setForm(data.form)
         
          document.getElementById("paymentRequestForm").submit();
       

        }).catch(err => {
          console.log(err);
        })
      }
    });
  }

  const handlePaymentWithUserCard = () =>{
    setLodding(true);
    api.paymentData({ order_id:cartDetail.order_id, card_info:cardId }).then(res => {
      savePaymentType(1);
      const data = res.data;
      
      setForm(data.form)
      
      document.getElementById("paymentRequestForm").submit();
      
      // setLodding(false);
    }).catch(err => {
      console.log(err);
    })
  }




  const subExpire = (e) => {
    var val = e.target.value;
    var item = val.split(' / ');
    if (item.length == 2 && item[1].length > 0) {
      setExpMonth(item[0]);
      setExpYear(parseInt(item[1]) + 2000);
    }

  }

  const showOrder = () => {
    localStorage.removeItem('pass');
    Router.push(`/user/order-detail/[order_id]?order_id=${cartDetail.order_id}`, `/user/order-detail/${cartDetail.order_id}`);
  }

  const handleCOD = () => {
    api.updatePaymentType(cartDetail.order_id, { status: 2, payment_type : 4 })
      .then(res => {
        const data = res.data;
        Router.push(`/user/success_order/[order_id]?order_id=${cartDetail.order_id}`, `/user/success_order/${cartDetail.order_id}`);
      })
      .catch(err => {
        console.log(err.response);
      })
  }

  const saveSlip = () => {
    setLoadButton(true)
    var data = new FormData(event.target)
    const user_id = AuthService.getProfile().id;
    event.preventDefault()
    data.append("user_id", user_id);
    data.append("order_id", cartDetail.order_id);
    api.uploadSlip(data)
      .then(res => {
        setLoadButton(false)
        const data = res.data;
        setShow3(false);
        Router.push(`/user/success_order/[order_id]?order_id=${cartDetail.order_id}`, `/user/success_order/${cartDetail.order_id}`);
      })
      .catch(err => {
        setLoadButton(false)
        console.log(err.response);
      })
  }

  const showstartDate = (e) => {
    var today = e._i;
    var data = e._d;
    setStartDate(data);
  }
  
  const delCard = (card_id, index) => {
    var r = confirm(t('delete_card'));
    if (r == true) {
      if(!user && user.cards.length) {
        return;
      }
      api.deleteCard(card_id).then(res => {
        const data = res.data;
  
        var tmp = {...user};
        tmp.cards.splice(index, 1);
        setUser(tmp)
      })
      .catch(err => {
        console.log(err.response);
      })
    }
  }

  const valid = (current) => {
    if(!cartDetail){
      return true;
    } 
    if(!cartDetail.order) {
      return true;
    }
    var getStart = new Date(cartDetail.order.createdAt);
    getStart.setHours(0,0,0,0);
    return current._d >= getStart;
  }

  const createShopeePayFunc = () => {
    setLodding(true)
    let data = {}
    data.order_id = cartDetail.order?.order_id
    data.total = cartDetail.order?.total_price
    data.site = "pc"
    data.return_url = `${api.frontend_url}/user/success_order/${cartDetail.order?.order_id}`
    api.createShopeePay(data)
    // axios.post(`http://localhost:8080/order/payment/shopee-pay/create`,data)
    .then(res => {
      setLodding(false)
      const {errcode,redirect_url_http,debug_msg} = res.data;
      if(errcode == 0) {
        window.location.href = redirect_url_http;
      } else {
        alert("การเชื่อมต่อผิดพลาด กรุณาลองใหม่อีกครั้ง")
      }

    })
    .catch(err => {
      alert("การเชื่อมต่อผิดพลาด กรุณาลองใหม่อีกครั้ง")
      setLodding(false)
      console.log(err.response);
    })
  }

  return ( 
    <>
      <div className="bg-step ">
        <div className="container ">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <ul className="progressbar">
                  <li className={classNames((step == "1" || step == "2" || step == "3") ? 'active' : '')}><span>{t('shipping_address')}</span></li>
                  <li className={classNames((step == "2" || step == "3") ? 'active' : '')}><span>{t('payment')}</span></li>
                  <li className={classNames((step == "3") ? 'active' : '')}><span>{t('order_successful')}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        user && step == "1" &&
        <SummaryFirstStep user={user} 
        setUser={setUser} 
        promotion={promotion ? promotion : null} 
        setPromotion={setPromotion} 
        pointState={pointState} 
        setPointState={setPointState} 
        setCalDetail={setCalDetail} 
        calDetail={calDetail} 
        cartDetail={cartDetail} 
        setCartDetail={setCartDetail} 
        setCalDetailTemp={setCalDetailTemp}
        setStep={setStep}/>
      }
      <div className={classNames(step == "2" ? '' : 'd-none')}>
        <div className="container pt-5">
          <div className="row">
            <div className="col-xl-8 col-12">
            {
              user &&
              <div className="row mx-0">
                <div className="col-12 px-0">
                  <div className="bg-white br-8 p-4">
                    <h4>{t('select_payment_method')}</h4>
                    <div className="row mx-0 select-payment mt-4">
                      <div className={classNames("col-3 box-pay", paymentType == "1" ? 'active' : '')} onClick={() => { (changePaymentType(1)) }}>
                        <img src="/icon/credit-card.svg" />
                        <p>{t('credit_debit_card')}</p>
                      </div>
                      {/* {api.mode != "production" && */}
                        <div className={classNames("col-3 box-pay", paymentType == "5" ? 'active' : '')} onClick={() => { (changePaymentType(5)) }}>
                          <img className="icon-shopeepay" src="/icon/shopee-pay.svg" />
                          <p>{t('shopee_pay')}</p>
                        </div>
                      {/* } */}
                      <div className={classNames("col-3 box-pay", paymentType == "2" ? 'active' : '')} onClick={() => { (changePaymentType(2)) }}>
                        <img src="/icon/tranfers.svg" />
                        <p>{t('bank_transfer')}</p>
                      </div>
                      <div className={classNames("col-3 box-pay", paymentType == "3" ? 'active' : '')} onClick={() => { (changePaymentType(3)) }}>
                        <img src="/icon/qr-code.svg" />
                        <p>{t('qr_code')}</p>
                      </div>
                      {/* {(user && user.id == "160570368") && */}
                      
                      {/* } */}
                      
                      {/* {
                        user && cartDetail && ((parseFloat(cartDetail.order && cartDetail.order.total_weight)) <= 5) && (cartDetail.order && cartDetail.order.shipping_type == 2) && setarea.includes(user.addresses.find((item)=> item.id == cartDetail.address_id).province_code) == 1 ? (
                          <div className={classNames("col-3 box-pay", paymentType == "4" ? 'active' : '')} onClick={() => { (changePaymentType(4)) }}>
                            <img src="/icon/cod.svg" />
                            <p>{t('cod')}</p>
                          </div>
                        ) : ''
                      } */}
                    </div>
                    <div className={classNames("mt-4", paymentType == "1" ? '' : 'd-none')}>
                      <div className="d-flex justify-content-between align-items-center">
                        <h3 className="font-20 text-black mb-0">{showCredit? "เลือกบัญชีการชำระเงิน":"ระบุรายละเอียด"}</h3>
                        {user.cards.length > 0 && <button className="btn btn-outline-primary" onClick={ToggleshowCredit}>{showCredit? "เพิ่มบัตรเครดิต/บัตรเดบิต":"เลือกใช้บัตรที่มีอยู่"}</button>}
                      </div>
                        { (user.cards.length > 0 && showCredit) ?
                            <div className={"d-block"}>
                              <div className="row pt-3">
                                {
                                  user.cards.map((card, index)=>
                                    <div className="form-group d-flex align-items-center  col-12" key={card.card_id}>
                                      <label className="radio-button d-flex w-100 align-items-center">
                                        <input type="radio" className="radio-button__input" name="chk_card" onClick={()=>{setCardId(card);setLodding2(true)}} />
                                        <span className="radio-button__control"></span>
                                        <span className="radio-button__label"></span>

                                        <div className="box-sum-account align-items-center credit-choice w-100">
                                          <img className="img-fluid img-credit-icon" src={images[parseInt(card.pan[0])-3]} />
                                          <div className="ml-4">
                                            <p className="text-black mb-0">ธนาคาร : {t(card.bank_name)}</p>
                                            <h6>{card.pan}</h6>
                                          </div>
                                        </div>
                                      </label>
                                      <a className="ml-3" onClick={() => delCard(card.card_id, index)}><i className="fas fa-trash"></i></a>
                                    </div>

                                    )
                                }
                              </div>
                              <div className="col-4 px-0">
                                {
                                  loading2 ? (
                                    <input type="button" className="btn btn-primary" value="ชำระเงิน" onClick={handlePaymentWithUserCard} />
                                  ) : (
                                    <button type="button" className="btn btn-primary" disabled>ชำระเงิน</button>
                                  )
                                }
                                
                              </div>
                            </div>
                            :
                            <form id="2c2p-payment-form" onSubmit={handlePayment} className={"d-block"}>
                              <input type="hidden" value={expMonth} onChange={(event) => setExpMonth(event.target.value)} data-encrypt="month" maxLength="2" placeholder="MM" />
                              <input type="hidden" value={expYear} onChange={(event) => setExpYear(event.target.value)} data-encrypt="year" maxLength="4" placeholder="YYYY" />

                              <div className="row mx-0">
                                <div className="col-12 px-0">
                                  <div className="d-flex">
                                    <img src="/icon/visa.svg" className="" />
                                    <img src="/icon/master-card.svg" className="px-3" />
                                    <img src="/icon/jcb.svg" className="" />
                                  </div>
                                </div>
                              </div>
                              <div className="row mx-0">
                                <div className="col-4 px-0">
                                  <div className="form-group">
                                    <label>หมายเลขบัตร <span className="text-pink">*</span></label>
                                    <input type="text" pattern="[0-9]*" autoComplete="off" value={maskedCardNo} onChange={(event) => setMaskedCardNo(event.target.value)} data-encrypt="cardnumber" maxLength="16" placeholder={t('card_number')} className="form-control invalid" required />
                                  </div>
                                </div>
                              </div>
                              <div className="row mx-0">
                                <div className="col-4 px-0">
                                  <div className="form-group">
                                    <label>ชื่อผู้ถือบัตร <span className="text-pink">*</span></label>
                                    <input placeholder={t('name_on_card')} value={cardholderName} onChange={(event) => setCardholderName(event.target.value)} name="cardholderName" type="text" className="form-control"  pattern="[A-Za-z\s]+" title='ตัวอักษร A-Z ทั้งพิมพ์เล็กเเละใหญ่' required />
                                  </div>
                                </div>
                              </div>
                              <div className="row mx-0">
                                <div className="col-4 px-0">
                                  <div className="row">
                                    <div className="col-6">
                                      <div className="form-group">
                                        <label>วันหมดอายุ <span className="text-pink">*</span></label>
                                        <input {...getExpiryDateProps({ onChange: subExpire })} autoComplete="off" className="form-control invalid" required />
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <div className="form-group">
                                        <label>CVV <span className="text-pink">*</span></label>
                                        <input type="password" value={CVC} onChange={(event) => setCVC(event.target.value)} data-encrypt="cvv" required maxLength="3" autoComplete="off" placeholder="CVV2/CVC" className="form-control" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row mx-0 mt-2">
                                <div className="col-12 px-0">
                                  <div className="form-group">
                                    <div className="custom-control custom-checkbox">
                                      <input type="checkbox" className="custom-control-input" id={`item-card`} name="store_card" value="1"  />
                                      <label className="custom-control-label" htmlFor={`item-card`}>
                                      {t('remember_card')}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="row mx-0 mt-2">
                                <div className="col-4 px-0">
                                  <input type="submit" className="btn btn-primary" value={t("shippingInfo:payment")} />
                                </div>
                              </div>
                            </form>
                        }

                        {
                          form && <div className="d-none" dangerouslySetInnerHTML={{ __html: form }} />
                        }
                    </div>
                    <div className={classNames("mt-4", paymentType == "2" ? '' : 'd-none')}>
                      <p className="">{t('saving_account')}</p>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <div className="box-sum-account d-flex align-items-center">
                            <img src="/images/SCB.png" className="" />
                            <div className="ml-4">
                              <p className="mb-0">{t('scb_bank')} {t('branch')} : {t('surawong')}</p>
                              <p className="mb-0">{t('account_number')} : <font className="text-account">002-2-08292-3</font></p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12  mb-3">
                          <div className="box-sum-account d-flex align-items-center">
                            <img src="/images/Kb.png" className="" />
                            <div className="ml-4">
                              <p className="mb-0">{t('k_bank')} {t('branch')} : {t('siam_square')}</p>
                              <p className="mb-0">{t('account_number')} : <font className="text-account">026-2-42844-3</font></p>
                            </div>
                          </div>
                        </div>

                        <div className="col-12  mb-3">
                          <div className="box-sum-account d-flex align-items-center">
                            <img src="/images/KT.png" className="" />
                            <div className="ml-4">
                              <p className="mb-0">{t('bangkok_bank')} {t('branch')} : {t('siam_square')}</p>
                              <p className="mb-0">{t('account_number')} : <font className="text-account">152-0-91525-5</font></p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12  mb-3">
                          <div className="box-sum-account d-flex align-items-center">
                            <img src="/images/KTH.png" className="" />
                            <div className="ml-4">
                              <p className="mb-0">{t('krung_thai_bank')} {t('branch')} : {t('siam_square')}</p>
                              <p className="mb-0">{t('account_number')} : <font className="text-account">052-1-25100-1</font></p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="btn btn-primary mt-5" onClick={() => { setShow3(true) }}>{t('inform_payment')}</button>
                      <button type="button" className="btn btn-outline-primary mt-5 ml-4" onClick={openShowS}>{t('pay_later')}</button>
                      
                    </div>
                    <div className={classNames("mt-4", paymentType == "3" ? '' : 'd-none')}>
                      {
                        isRunning == 1 ? (
                          <p className="mb-0">{t('scan_to_pay')} / QR CODE {t('time_left')} <font className="text-success font-time-qr">{parseInt(count / (60))} : {count % 60}</font> {t('minute')}</p>
                        ) : qrStatus == 1 && isRunning == 0 ? (
                          <p className="mb-0">QR CODE {t('expire')} <a className="text-pink" onClick={getQRCode}>{t('please_click_here')}</a> {t('create_code')}</p>
                        ) : (
                              <button type="button" className="btn btn-primary" onClick={getQRCode}>{t('payment')}</button>
                            )
                      }
                      {
                        qrStatus == 1 ? (
                          <>
                            <div className="mt-3">
                              <div className="box-qr">
                                <div className="box-qr-th">
                                  <img className="img-fluid h-48px" src="/images/thai_qr.png" />
                                </div>
                                <div className="box-qr-area">
                                  <img src={qrcode ? qrcode.qrImage : ''} className="img-qrcode" />
                                </div>
                                <div className="box-qr-content">
                                  <h5 className="text-center">{t("order_detail:account_name")} : {t("order_detail:cu_book")}
                                  </h5><br/>
                                  <h5 className="text-center">{t("Order:order")} #{cartDetail.order ? cartDetail.order.order_id : ''}
                                </h5><br/>
                                  <h5 className="text-center">{t("order_detail:total_payment_qr")} {
                                    cartDetail.order ? cartDetail.order.total_price : '0'
                                  } {t("order_detail:bath")}
                                  </h5>
                                </div>
                                <div className="box-qr-footer px-2">
                                  <img className="img-fluid" src="/images/footer-qr.svg" />
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <p className="mb-0 text-danger">{t("Order:qr_remark")}</p>
                            </div>
                          </>
                        ) : ''
                      }
                    </div>
                    <div className={classNames("mt-4", paymentType == "5" ? '' : 'd-none')}>
                      <button type="button" className="btn btn-primary" onClick={createShopeePayFunc} >{t('payment')}</button>
                    </div>
                    {/* <div className={classNames("mt-4", paymentType == "4" ? '' : 'd-none')}>
                      <p className="">{t('pay_cod')}</p>
                      <button type="button" className="btn btn-primary" onClick={handleCOD}>{t('cod_payment')}</button>
                    </div> */}
                  </div>
                </div>
              </div>
            }
            </div>
            <div className="col-xl-4 col-12 mt-3 mt-xl-0">
              <div className="row mx-0">
                <div className="col-12 px-0">
                  <div className="bg-white br-8 p-3">
                    { (calDetailTemp && cartDetail) &&
                        <div className="mt-0">
                          <h5>{t('order_summary')}</h5>
                          <div className="sum mt-3">
                            <div className="sum-price d-flex justify-content-between">
                              <p>ราคาสินค้า</p>
                              <p className="text-num">฿ {tools.currencyFormatDE(calDetailTemp.total)}</p>
                            </div>
                            { calDetailTemp.discount_shelf.total_discount > 0 && (
                              <>
                                <div className="sum-price d-flex justify-content-between">
                                  <h5>{t('label_discount')}</h5>
                                  <p className="text-num">- {tools.currencyFormatDE(calDetailTemp.discount_shelf.total_discount)}</p>
                                </div>
                                <hr/>
                                <div className="sum-price d-flex justify-content-between">
                                  <h5>{t('total_price')}</h5>
                                  <p className="text-num">฿ {tools.currencyFormatDE(calDetailTemp.total_discount)}</p>
                                </div>
                                <hr/>
                              </>
                            )
                            }
                            
                            {/* {user && user.member && user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ? (
                              <div className="sum-price d-flex justify-content-between">
                                <h5>{t('label_member')}</h5>
                                <p className="text-num">- ฿ {tools.currencyFormatDE(calDetail.member_discount)}</p>
                              </div>
                            ) : ''
                            } */}
                            
                            {cartDetail.order && cartDetail.order.promotion_discount ? (
                              <>
                                
                                <div className="sum-price d-flex justify-content-between">
                                  <p>{t('used_coupon')}</p>
                                  <p className="text-num">- {tools.currencyFormatDE(cartDetail.order.promotion_discount)}</p>
                                </div>
                                <p className="p-12 text-gray">{cartDetail.order.promotion_name}</p>
                                <hr/>
                              </>
                            ) : ''
                            }
                            {pointState > 0 ? (
                              <>
                              <div className="sum-price d-flex justify-content-between">
                                <h5>{t('label_point')}</h5>
                                <p className="text-num">- {tools.currencyFormatDE(pointState / 8)}</p>
                              </div>
                              <hr/>
                              </>
                            ) : ''
                            }
                            <div className="sum-track d-flex justify-content-between">
                              <p>{t('transpot_cost')}</p>
                              <p className="text-num">
                                {
                                  user ? (
                                    user.addresses.length > 0 ? (
                                      <>
                                        ฿ {tools.currencyFormatDE(calDetailTemp.shipping)}
                                      </>
                                    ) : (
                                        <button className="btn btn-primary" onClick={handleShow}>{t('add_address')}</button>
                                      )
                                  ) : ''
                                }
                              </p>
                            </div>
                            <div className="mt-4 sum-all d-flex justify-content-between">
                              <p className="text">{t('net_price')}</p>
                              <p className="text-num">
                                {
                                  cartDetail.order &&  `฿ ${tools.currencyFormatDE(cartDetail.order.total_price)}`
                                }
                              </p>
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
      </div>

      <div className="end-page"></div>
      {
        cartDetail && (
          <ModalSuccess show={showS} order_id={cartDetail.order_id} setshowS={setshowS} />
        )
      }
      
      <Modal className="modal-cart" show={show3} onHide={handleClose3} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t('payment_confirmation')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={saveSlip} className="" encType="multipart/form-data">
            <div className="sum-all d-flex justify-content-between">
              <p className="font-weight-bold">{t('total_payment')}</p>
              <p className="text-num">
                {
                  (cartDetail && cartDetail.order) && `฿ ${tools.currencyFormatDE(cartDetail.order.total_price)}`
                }
              </p>
            </div>
            <div className="border-bottom my-3"></div>
            <p className="mb-0">{t('upload_photo_patment')}</p>
            <div className="border-bottom my-3"></div>
            <div className="form-group">
              <label>{t('upload_form_payment')} <span className="text-danger">*</span></label>
              <input type="file" name="image" required />
            </div>
            <div className="border-bottom my-3"></div>
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label>{t('date_time_transfer')} <span className="text-pink">*</span></label>
                  <Datetime
                    dateFormat="YYYY-MM-DD"
                    timeFormat="HH:mm"
                    // onChange={(e) => { showstartDate(e) }}
                    defaultValue={new Date()}
                    inputProps={{ name: 'date', required: true, autoComplete: 'off' }}
                    isValidDate={ valid } />
                </div>
              </div>
              {/* <div className="col-6">
                <div className="form-group">
                  <label>วันที่โอน</label>
                  <input type="text" name="date" className="form-control" value="09-01-2020" required />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>เวลาที่โอน</label>
                  <input type="text" name="time" className="form-control" value="10:00" required />
                </div>
              </div> */}
            </div>
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label>{t('transfer_from_bank')} <span className="text-pink">*</span></label>
                  {/* <input type="text" name="from_bank" className="form-control" required placeholder="{t('scb_bank')}" /> */}
                  <select id="options"   name="from_bank" className="form-control" required>
                    <option value="" className="selected">กรุณาเลือกธนาคาร</option>
                    <option data-index="0">ไทยพาณิชย์ (SCB)</option>
                    <option data-index="1">กสิกรไทย (Kbank)</option>
                    <option data-index="2">กรุงไทย (KTB)</option>
                    <option data-index="3">กรุงเทพ (BBL)</option>
                    <option data-index="4">กรุงศรี (BAY)</option>
                    <option data-index="5">ธนชาติ (Thanachart)</option>
                    <option data-index="6">ทหารไทย (TMB)</option>
                    <option data-index="7">ออมสิน (Government Savings Bank)</option>
                    <option data-index="8">ธ.ก.ส. (BAAC)</option>
                    <option data-index="9">เกียรตินาคิน (Kiatnakin)</option>
                    <option data-index="10">แสตนดาร์ดชาร์เตอร์ด (Standard Chartered)</option>
                    <option data-index="11">ยูโอบี (UOB)</option>
                    <option data-index="12">ทิสโก้ (TISCO)</option>
                    <option data-index="13">ซีไอเอ็มบี (CIMB)</option>
                    <option data-index="14">ไอซีบีซี (ICBC)</option>
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>{t('transfer_to')} <span className="text-pink">*</span></label>
                  <select className="form-control" name="to_bank" required>
                    <option value="" className="selected">กรุณาเลือกธนาคาร</option>
                    <option value="SCB">{t('scb_bank')} (SCB)</option>
                    <option value="KBANK">{t('k_bank')} (KBANK)</option>
                    <option value="BBL">{t('bangkok_bank')} (BBL)</option>
                    <option value="KTB">{t('krung_thai_bank')} (KTB)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              {
                (cartDetail && cartDetail.order) && (
                  <div className="col-6">
                    <div className="form-group">
                      <label>{t('amount_already_transferred')} <span className="text-danger">*</span></label>
                      <input type="text" name="amount" className="form-control" defaultValue={tools.currencyFormatDE(cartDetail.order.total_price)} required />
                    </div>
                  </div>
                )
              }
              
              <div className="col-6">
                <div className="form-group mb-0">
                  <label>{t('last_4')} <span className="text-danger">*</span></label>
                  <input type="text" name="pin" pattern="[0-9]*" className="form-control" required minLength="4" maxLength="4" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="text-right">
                  <p className="text-danger font-14">{t('for_bank_transfer')}</p>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12">
                <div className="text-right">
                  <button type="button" className="btn btn-outline-primary mr-3" onClick={handleClose3}>{t('cancel')}</button>
                  {/* <button type="submit" className="btn btn-primary">{t('send')}</button> */}
                  <Loadbutton loading={loadButton} name={t('send')} type="submit" classNmae="w-auto" />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

    </>
  )
}

export default MainSummary