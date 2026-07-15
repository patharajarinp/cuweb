import classNames from 'classnames';
import Router from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Datetime from 'react-datetime';
import { usePaymentInputs } from 'react-payment-inputs';
import Sidenav from '../../../components/user/sidenav';
import Loadbutton from '../../../components/widget/Button';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import AuthService from '../../../utils/AuthService';
import tools from '../../../utils/tools';

const MainTransferMenber = (props) => {
  const { t, loading, setLodding } = props;
  const { user, setUser, onSocket } = useContext(UserContext)
  // const [user, setUser] = useState();
  const [order, setOrder] = useState();
  const [orderID, setOrderID] = useState();
  //Payment
  const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs();
  const [cardholderName, setCardholderName] = useState();
  const [CVC, setCVC] = useState();
  const [maskedCardNo, setMaskedCardNo] = useState();
  const [expMonth, setExpMonth] = useState();
  const [expYear, setExpYear] = useState();

  const [cardId, setCardId] = useState(null);


  const [paymentType, setPaymentType] = useState(1);

  const [qrcode, setQRCOde] = useState();
  const [qrStatus, setQRStatus] = useState(0);

  //QR Time
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);



  const [form, setForm] = useState();
  const [loadButton, setLoadButton] = useState(false)

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);
  

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


  // const  fetchUser = () => {
  //   api.getProfile().then(res =>{
  //       const data = res.data;
  //       setUser(data);
  //   })
  //   .catch(err =>{
  //     console.log(err.response);
  //   })
  // };


  useEffect(() => {
    // fetchUser();
    fetchOrder();
  }, []);

  const  fetchOrder = () => {
    const id = AuthService.getProfile().id;
    api.getMemberOne(id).then(res =>{
        const data = res.data;
        setOrder(data)
        setOrderID(data.order_id);
        // ;
    })
    .catch(err =>{
      console.log(err.response);
    })
  };
  // useEffect(() => {
  //   if(!orderID) {
  //     return;
  //   }
  //   fetchDetail();
  // },[orderID]);




  const savePaymentType = (type) => {
    var order_id = orderID;
    api.updatePaymentType(order_id, { payment_type: type })
      .then(res => {
        const data = res.data;
        //;
      })
      .catch(err => {
        console.log(err.response);
      })
  }


  const changePaymentType = (payType) => {
    setPaymentType(payType);
    savePaymentType(payType);
  }

  useEffect(() => user && onSocket(user.id, eventSuccessQR, 'qr'), [user])


  useEffect(() => {
    const script = document.createElement('script');
    script.src = process.env.payment_script ||  "https://t.2c2p.com/securepayment/api/my2c2p.1.6.9.min.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }

  }, []);
  const eventSuccessQR = (data, response) => {
    ;
    console.log(response);
    api.updatePaymentType(data.order_id, { status: 2 })
      .then(res => {
        const data = res.data;
      })
      .catch(err => {
        console.log(err.response);
      })
    Router.push(`/user/order-detail/${orderID}`);
  }


  const getQRCode = () => {
    //console.log(order_id);
    api.getNewQR({ order_id:orderID, order_from: 'desktop' })
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
  const handlePaymentWithUserCard = (e) =>{
    e.preventDefault();
    setLodding(true);

    api.paymentData({ order_id:orderID, card_info:cardId }).then(res => {
          savePaymentType(1);
          const data = res.data;
          
          setForm(data.form)
      
          document.getElementById("paymentRequestForm").submit();

          // setLodding(false);
          // Router.push(`/user/order-detail/${orderID}`);
        }).catch(err => {
          console.log(err);
        })
  }


  const handlePayment = () => {
    setLoadButton(true)
    event.preventDefault();
    My2c2p.getEncrypted("2c2p-payment-form", function (h, errCode, errDesc) {
      if (errCode != 0) {
        alert(errDesc + " (" + errCode + ")");
      } else {
        const store_card = document.getElementById('item-card').checked;
        const card_info = { name: cardholderName, encrypted: h.encryptedCardInfo, store_card }
        setLodding(true);
        api.paymentData({ order_id:orderID, card_info }).then(res => {
          savePaymentType(1);
          const data = res.data;
          setLoadButton(false)
          setForm(data.form)
      
          document.getElementById("paymentRequestForm").submit();
        
          // setLodding(false);
          // Router.push(`/user/order-detail/${orderID}`);
          //setOrder_id(data.order_id);
          //localStorage.removeItem('pass');
        }).catch(err => {
          setLoadButton(false)
          console.log(err);
        })
      }
    });
  }


  const handleChangeExpiryDate = React.useCallback(
    (props = {}) => {
      return e => {
        setInputTouched('expiryDate', false);

        expiryDateField.current.value = utils.formatter.formatExpiry(e);

        props.onChange && props.onChange(e);
        onChange && onChange(e);
        const expiryDateError = utils.validator.getExpiryDateError(expiryDateField.current.value, expiryValidator, {
          errorMessages
        });
        if (!expiryDateError) {
          cvcField.current && cvcField.current.focus();
        }
        setInputError('expiryDate', expiryDateError);
      };
    },
    [{}]
  );

  const subExpire = (e) => {
    var val = e.target.value;
    var item = val.split(' / ');

    if (item.length == 2 && item[1].length > 0) {
      setExpMonth(item[0]);
      setExpYear(parseInt(item[1]) + 2000);
    }

  }

  const saveSlip = () => {
    var data = new FormData(event.target)
    const user_id = AuthService.getProfile().id;
    event.preventDefault()
    data.append("user_id", user_id);
    data.append("order_id", orderID);
    //const jsonData = tools.toJson(data);
    //;
    api.uploadSlip(data)
      .then(res => {
        const data = res.data;
        setShow(false);
        Router.push(`/user/member`);
      })
      .catch(err => {
        console.log(err.response);
      })
  }


  const [showCredit,setshowCredit]=useState(true);
  const ToggleshowCredit = () => setshowCredit(!showCredit);
  //console.log(order);

  const images = ["/images/JCB.png","/images/VISA.png","/images/MASTERCARD.png"]

  const delCard = (card_id, index) => {
    var r = confirm(t('shippingInfo:delete_card'));
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

  // console.log(order);

  const valid = (current) => {
    if(!order){
      return true;
    } 
    var getStart = new Date(order.createdAt);
    getStart.setHours(0,0,0,0);
    return current._d >= getStart;
  }
  

  return ( 
    <>
      <Sidenav user={user} page="order" >
        <div className="box-main-account">
          <div className="row mx-0 px-0">
            <div className="col-12 px-0">
              <div className="mt-2 mb-4">
                <h6 className="text-black">{t("choose_payment")}</h6>
              </div>
              {/* <div className="main">
              <div className="">
                <div className="">
                  <h4 className="">เลือกวิธีการชำระเงิน</h4>
                </div>
              </div>
            </div> */}
            </div>
          </div>
          <div className="row mx-0 px-0">
            <div className="col-12 px-0">
              <div className="border-detail">
                <div className="p-3 d-flex justify-content-between align-items-center header-detail">
                  <div>
                    <p className="font-weight-bold">{t( "order_no")} #{orderID}</p>
                    <p>{t("date_order")} {order ? tools.formatDate(order.createdAt) : ''}</p>
                  </div>
                  <div className="sum-price">
                    <p className="font-bold-18">{t("grand_total")} <font className="text-sum">฿ {order ? tools.currencyFormatDE(order.total_price) : ''}</font></p>
                  </div>
                </div>
                <div className="border-bottom"></div>
                <div className="p-3">
                  <div className="row mx-0 select-payment mt-4">
                    <div className={classNames("col-3 box-pay", paymentType == "1" ? 'active' : '')} onClick={() => { (changePaymentType(1)) }}>
                      <img src="/icon/credit-card.svg" />
                      <p>{t("credit_debit")}</p>
                    </div>
                    <div className={classNames("col-3 box-pay", paymentType == "2" ? 'active' : '')} onClick={() => { (changePaymentType(2)) }}>
                      <img src="/icon/tranfers.svg" />
                      <p>{t("bank_transfer")}</p>
                    </div>
                    <div className={classNames("col-3 box-pay", paymentType == "3" ? 'active' : '')} onClick={() => { (changePaymentType(3)) }}>
                      <img src="/icon/qr-code.svg" />
                      <p>QR CODE</p>
                    </div>
                  </div>
                  { user &&
                    <div className={classNames("mt-4", paymentType == "1" ? '' : 'd-none')}>
                      <div className="d-flex justify-content-between align-items-center">
                        <h3 className="font-20 text-black mb-0">{showCredit? `${t("select_payment")}`:`${t("specify_details")}`}</h3>
                        {user.cards.length > 0 && <button className="btn btn-outline-primary" onClick={ToggleshowCredit}>{showCredit? `${t("add_credit")}`:`${t("choose_card")}`}</button>}
                      </div>
                          { (user.cards.length > 0 && showCredit) ?
                            <div className={"d-block"}>
                              <div className="row pt-3">
                                {
                                  user.cards.map((card, index)=>
                                    <div className="form-group d-flex align-items-center  col-12" key={card.card_id}>
                                      <label className="radio-button d-flex w-100 align-items-center">
                                        <input type="radio" className="radio-button__input" name="chk_card" onClick={()=>setCardId(card)} />
                                        <span className="radio-button__control"></span>
                                        <span className="radio-button__label"></span>

                                        <div className="box-sum-account align-items-center credit-choice w-100">
                                          <img className="img-fluid img-credit-icon" src={images[parseInt(card.pan[0])-3]} />
                                          <div className="ml-4">
                                            <p className="text-black mb-0">{t("bank")} : {t(card.bank_name)}</p>
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
                                <input type="button" className="btn btn-primary" value={t("shippingInfo:payment")} onClick={handlePaymentWithUserCard} />
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
                                    <label>{t("card_number")} <span className="text-pink">*</span></label>
                                    <input type="text" pattern="[0-9]*" autoComplete="off" value={maskedCardNo} onChange={(event) => setMaskedCardNo(event.target.value)} data-encrypt="cardnumber" maxLength="16" placeholder={t('shippingInfo:card_number')} className="form-control invalid" required />
                                  </div>
                                </div>
                              </div>
                              <div className="row mx-0">
                                <div className="col-4 px-0">
                                  <div className="form-group">
                                    <label>{t("name_on_card")} <span className="text-pink">*</span></label>
                                    <input placeholder={t("shippingInfo:name_on_card")} value={cardholderName} onChange={(event) => setCardholderName(event.target.value)} name="cardholderName" type="text" className="form-control"  pattern="[A-Za-z\s]+" title={t("AtoZBig")} required />
                                  </div>
                                </div>
                              </div>
                              <div className="row mx-0">
                                <div className="col-4 px-0">
                                  <div className="row">
                                    <div className="col-6">
                                      <div className="form-group">
                                        <label>{t("expiration_date")} <span className="text-pink">*</span></label>
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
                                      {t('shippingInfo:remember_card')}
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
                  }
                  <div className={classNames("mt-4", paymentType == "2" ? '' : 'd-none')}>
                    <p className="">{t("saveaccount")} “{t("cubook")}” {t("under_account")}</p>
                    <div className="row">
                      <div className="col-6">
                        <div className="box-sum-account d-flex align-items-center">
                          <img src="/images/SCB.png" className="" />
                          <div className="ml-4">
                            <p className="mb-0">{t("shippingInfo:scb_bank")} {t("shippingInfo:branch")} : {t("shippingInfo:surawong")}</p>
                            <p className="mb-0">{t("shippingInfo:account_number")} : <font className="text-account">002-2-08292-3</font></p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="box-sum-account d-flex align-items-center">
                          <img src="/images/Kb.png" className="" />
                          <div className="ml-4">
                            <p className="mb-0">{t("shippingInfo:k_bank")} {t("shippingInfo:branch")} : {t("shippingInfo:siam_square")}</p>
                            <p className="mb-0">{t("shippingInfo:account_number")} : <font className="text-account">026-2-42844-3</font></p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-6">
                        <div className="box-sum-account d-flex align-items-center">
                          <img src="/images/KT.png" className="" />
                          <div className="ml-4">
                            <p className="mb-0">{t("shippingInfo:bangkok_bank")} {t("shippingInfo:branch")} : {t("shippingInfo:siam_square")}</p>
                            <p className="mb-0">{t("shippingInfo:account_number")} : <font className="text-account">152-0-91525-5</font></p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="box-sum-account d-flex align-items-center">
                          <img src="/images/KTH.png" className="" />
                          <div className="ml-4">
                            <p className="mb-0">{t("shippingInfo:krung_thai_bank")} {t("shippingInfo:branch")} : {t("shippingInfo:siam_square")}</p>
                            <p className="mb-0">{t("shippingInfo:account_number")} : <font className="text-account">052-1-25100-1</font></p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary mt-5" onClick={() => { setShow(true) }}>{t("shippingInfo:inform_payment")}</button>
                  </div>
                  <div className={classNames("mt-4", paymentType == "3" ? '' : 'd-none')}>
                    {
                      isRunning == 1 ? (
                        <p className="mb-0">{t("shippingInfo:scan_to_pay")}/ QR CODE `{'>'}`{t("shippingInfo:time_left")} <font className="text-success font-time-qr">{parseInt(count / (60))} : {count % 60}</font> {t("shippingInfo:minute")}</p>
                      ) : qrStatus == 1 && isRunning == 0 ? (
                      <p className="mb-0">QR CODE {t("shippingInfo:expire")} <a className="text-pink" onClick={getQRCode}>{t("shippingInfo:please_click_here")}</a> {t("shippingInfo:create_code")}</p>
                      ) : (
                            <button type="button" className="btn btn-primary" onClick={getQRCode}>{t("shippingInfo:payment")}</button>
                          )
                    }
                    {
                      qrStatus == 1 ? (
                        <div className="mt-3">
                          <div className="box-qr">
                                <div className="box-qr-th">
                                  <img className="img-fluid h-48px" src="/images/thai_qr.png" />
                                </div>
                                <div className="box-qr-area">
                                  <img src={qrcode ? qrcode.qrImage : ''} className="img-qrcode" />
                                </div>
                                <div className="box-qr-content">
                                  <h5 className="text-center">{t("account_name")} : {t("cu_book")}
                                  </h5><br/>
                                  <h5 className="text-center">{t("Order:order")} #{order ? order.order_id : ''}
                                </h5><br/>
                                  <h5 className="text-center">{t("total_payment_qr")} {order ? tools.currencyFormatDE(order.total_price) : ''} {t("bath")}
                                  </h5>
                                </div>
                                <div className="box-qr-footer px-2">
                                  <img className="img-fluid" src="/images/footer-qr.svg" />
                                </div>
                              </div>
                        </div>
                      ) : ''
                    }
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>


        <Modal className="modal-cart" show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{t("shippingInfo:payment_confirmation")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={saveSlip} className="" encType="multipart/form-data">
              <div className="sum-all d-flex justify-content-between">
                  <p className="font-weight-bold">{t("shippingInfo:total_payment")}</p>
                <p className="text-num">฿ {order ? tools.currencyFormatDE(order.total_price) : ''}</p>
              </div>
              <div className="border-bottom my-3"></div>
              <p className="mb-0">{t("shippingInfo:upload_photo_patment")}</p>
              <div className="border-bottom my-3"></div>
              <div className="form-group">
                <label>{t("shippingInfo:upload_form_payment")} <span className="text-danger">*</span></label>
                <input type="file" name="image" required />
              </div>
              <div className="border-bottom my-3"></div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>{t("shippingInfo:date_time_transfer")} <span className="text-pink">*</span></label>
                    <Datetime
                      dateFormat="YYYY-MM-DD"
                      timeFormat="HH:mm"
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
                    <label>{t("shippingInfo:transfer_from_bank")} <span className="text-pink">*</span></label>
                    {/* <input type="text" name="from_bank" className="form-control" required placeholder="ธนาคารไทยพาณิชย์" /> */}
                    <select id="options"   name="from_bank" className="form-control" required>
                      <option value="" className="selected">{t("select_bank")}</option>
            <option data-index="0">{t("scb")}</option><option data-index="1" className="selected">{t("kasikorn")}</option><option data-index="2">{t("krungthai")}</option><option data-index="3">{t("bangkok_bank")}</option><option data-index="4">{t("krungsri")}</option><option data-index="5">{t("thanachart")}</option><option data-index="6">{t("tmb")}</option><option data-index="7">{t("gsb")}</option><option data-index="8">{t("baac")}</option><option data-index="9">{t("kiatnakin")}</option><option data-index="10">{t("sc")}</option><option data-index="11">{t("uob")}</option><option data-index="12">{t("tisco")}</option><option data-index="13">{t("cimb")}</option><option data-index="14">{t("icbc")}</option></select>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>{t("shippingInfo:transfer_to")} <span className="text-pink">*</span></label>
                    <select className="form-control" name="to_bank" required>
                      <option value="" className="selected">{t("select_bank")}</option>
                      <option value="SCB">{t("scb")}</option>
                      <option value="KBANK">{t("kasikorn")}</option>
                      <option value="BBL">{t("bangkok_bank")}</option>
                      <option value="KTB">{t("krungthai")}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>{t("shippingInfo:amount_already_transferred")} <span className="text-danger">*</span></label>
                    <input type="text" name="amount" defaultValue={order ? tools.currencyFormatDE(order.total_price) : ''} className="form-control" required />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group mb-0">
                    <label>{t("shippingInfo:last_4")} <span className="text-danger">*</span></label>
                    <input type="text" name="pin" pattern="[0-9]*" className="form-control" required minLength="4" maxLength="4" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="text-right">
                    <p className="text-danger font-14">{t("shippingInfo:for_bank_transfer")}</p>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-12">
                  <div className="text-right">
                    <button type="button" className="btn btn-outline-primary mr-3" onClick={handleClose}>{t("shippingInfo:cancel")}</button>
                    {/* <button type="submit" className="btn btn-primary">{t("shippingInfo:confirm")}</button> */}
                    <Loadbutton loading={loadButton} name={t("shippingInfo:confirm")} type="submit" classNmae="w-auto" />
                  </div>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>



        </Sidenav>
      
    </>
  )
}

export default MainTransferMenber