import axios from 'axios';
// import Router from 'next/router';
import React, { useState } from 'react';
import Datetime from 'react-datetime';
import api from '../../../utils/api';
import AuthService from '../../../utils/AuthService';
import { withTranslation, Router } from '../../../utils/i18n';
import tools from '../../../utils/tools';
import Loadbutton from '../../../components/mobile/widget/Button';

const Slip = ({ tranfer, setTranfer, user, setUser, setCartDetail, cartDetail, setCalDetail, calDetail, promotion, setPromotion, pointState, setPointState, t, query, setLoadding, loading }) => {
  const [image, setImage] = useState({ preview: '', raw: '' })
  const [startDate, setStartDate] = useState(new Date());

  const handleChange = (e) => {
    setImage({
      preview: URL.createObjectURL(e.target.files[0]),
      raw: e.target.files[0]
    })
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('image', image.raw)
    const config = { headers: { 'content-type': 'multipart/form-data' } }
    try {
      await axios.post('http://localhost:3000/upload', { image: image.raw }, config)
    } catch (error) {
      console.log(error.response)
    }
  }

  const goBack = () => {
    setTranfer(false);
  }

  const saveSlip = () => {
    setLoadding(true);
    var data = new FormData(event.target)
    const user_id = AuthService.getProfile().id;
    event.preventDefault()
    data.append("user_id", user_id);
    data.append("order_id", cartDetail.order_id);
    api.updatePaymentType(cartDetail.order_id, { payment_type : 2 })
    .then(res => {
      // const data = res.data;
      return api.uploadSlip(data);
    }).then(res => {
      const data = res.data;
      if(query) {
        Router.push(query);
      }else{
        Router.push(`/user/success_order/[order_id]?order_id=${cartDetail.order_id}`, `/user/success_order/${cartDetail.order_id}`);
        // Router.push(`/user/success_order/${cartDetail.order_id}`);
      }
    })
    .catch(err => {
      setLoadding(false);
      console.log(err.response);
    })
   
  }

  const showstartDate = (e) => {
    var today = e._i;
    var data = e._d;
    setStartDate(data);
  }

  const valid = (current) => {
    // console.log('cartDetail', cartDetail)
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

  return (
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4>{t("mobile_summary:payment_confirmation")}</h4>
        </div>
        <a className="btn-back cart-nav-back" onClick={goBack}>
          <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
        </a>
      </div>
      <div className="bg-light-less-gray">
        <div className="container bg-white px-0 pb-3">
          <form onSubmit={saveSlip} className="" encType="multipart/form-data">
            <h4 className="text-black pt-3">{t("mobile_summary:upload_form_payment")}<span className="text-red">*</span></h4>
            <p className="p-12">{t("mobile_summary:upload_photo_patment")}</p>
            <div align="left" style={{ marginTop: "16px", height: "80px", width: "80px" }}>
              <label htmlFor="upload-button">
                {
                  image.preview ? (
                    <div className="img-preview">
                      <img src={image.preview}  alt="preview" className="img-preview-on" />
                    </div>
                  ) : (
                      <>
                        <div className="input-image">
                          <i className="fas fa-plus fa-stack-1x fa-inverse text-grey my-3"><h5 className="text-center">{t("mobile_order_detail:photo")}</h5></i>
                        </div>
                      </>
                    )
                }
              </label>
              <input type="file" name="image" id="upload-button" style={{ display: 'none' }} onChange={handleChange} required />
              <br />
            </div>
            <a><p className="p-12 text-red my-2">{t("mobile_summary:payment_proof")}</p></a>
            <div className="py-3 clearfix ">
              <div className="info-creditcard-100 z-9999 d-flex justify-content-between">
                {/*z-9999  <Datetime
                dateFormat="YYYY-MM-DD"
                timeFormat="HH:mm"
                onChange={(e) => { showstartDate(e) }}
                value={startDate ? startDate : ''}
                inputProps={{ name: 'date', required: true, autoComplete: 'off' }} />
                <label>{t("mobile_summary:date_time_transfer")}<span>*</span></label>
                <span className="focus-border"></span> */}
               <div className="select-date-input mr-4">
                <Datetime
                dateFormat="YYYY-MM-DD"
                timeFormat={false}
                onChange={(e) => { showstartDate(e) }}
                value={startDate ? startDate : `${t("mobile_summary:transfer_date")}`}
                inputProps={{ name: 'date', required: true, autoComplete: 'off' }} isValidDate={ valid }/>
                </div>
                <div className="select-date-input">
                <Datetime
                dateFormat={false}
                timeFormat="HH:mm"
                onChange={(e) => { showstartDate(e) }}
                value={startDate ? startDate : `${t("mobile_summary:transfer_time")}`}
                inputProps={{ name: 'date', required: true, autoComplete: 'off' }} />
                </div>
               {/*  <select className="select-box-address mr-2" name="date" required>
                  <option value="" disabled selected hidden>{t("mobile_summary:transfer_date")}</option>
                  <option>10</option>
                  <option>11</option>
                </select> */}
                
                {/* <select className="select-box-address" required>
                  <option value="" disabled selected hidden>{t("mobile_summary:transfer_time")}</option>
                  <option>04.00</option>
                  <option>04.01</option>
                </select> */}
              </div>
              <div className="info-creditcard-100 mt-5">
                <select className="w-100" name="from_bank" required>
                  <option value="" disabled selected hidden>{t("mobile_summary:select_bank")}</option>
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
              <div className="info-creditcard-100 mt-5">
                <select className="w-100" name="to_bank" required>
                  <option value="" disabled selected hidden>{t("mobile_summary:select_bank")}</option>
                  <option value="SCB">ไทยพาณิชย์ (SCB)</option>
                  <option value="KBANK">กสิกรไทย (KBANK)</option>
                  <option value="BBL">กรุงเทพ (BBL)</option>
                  <option value="KTB">กรุงไทย (KTB)</option>
                </select>
              </div>
              {
                calDetail && (
                  <div className="info-creditcard-100 mt-5">
                    <input className="effect-16" name="amount" defaultValue={tools.currencyFormatDE(calDetail.net_price - (pointState / 2) - (promotion && promotion.price ? promotion.price : 0))} type="text" placeholder="" required />
                    <label>{t("mobile_summary:amount_already_transferred")}<span>*</span></label>
                    <span className="focus-border"></span>
                  </div>
                )
              }

              <div className="info-creditcard-100 mt-5 mb-1">
                <input className="effect-16" name="pin" type="text" maxLength="4" pattern="[0-9]*" placeholder="" required />
                <label>{t("mobile_summary:last_4")}<span>*</span></label>
                <span className="focus-border"></span>
              </div>
              <a><p className="p-12 text-red ">{t("mobile_summary:for_bank_transfer")}</p></a>
            </div>
            <Loadbutton loading={loading} name={t('mobile_translations:send')} btntype="submit" />
          </form>
        </div>
      </div>
    </>
  );
}

export default withTranslation('summary')(Slip);