import React, { useState,useEffect } from 'react'
import Layout from '../../../components/layout'

import Link from 'next/link'
import api from '../../../utils/api';
import Sidenav from '../../../components/user/sidenav'
import AuthService from '../../../utils/AuthService'
import tools from '../../../utils/tools'
import myData from '../../../public/json/raw_database.json';
import Router, { useRouter } from 'next/router'
import classNames  from 'classnames';
import {Button, Modal} from 'react-bootstrap';
import Datetime  from 'react-datetime';
import { withTranslation } from '../../../utils/i18n'
import Loadbutton from '../../../components/widget/Button'

const OrderDetail = (props) => {
  const [user, setUser] = useState();
  const [order, setOrder] = useState();
  const [sum, setSum] = useState();
  const [amount, setAmount] = useState();
  const [orderType, setOrderType] = useState();
  const [startDate,setStartDate] = useState(null);
  const { t } = props
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [loadButton, setLoadButton] = useState(false)

  const router = useRouter()
  const order_id = router.query.order_id

  const  fetchUser = () => {
    api.getProfile().then(res =>{
        const data = res.data;
        setUser(data);
    })
    .catch(err =>{
      console.log(err.response);
    })
  };
  const  fetchDetail = () => {
    // console.log(order_id);
    api.getOrderDetail(order_id).then(res =>{
        const data = res.data;
        setOrder(data);
        setOrderType(data.type);
        ;
        var sum = 0;
        var num = 0;
        data.products.map((val, index) => {
          sum += val.quantity * val.price;
          num += val.quantity;
        })
        setAddressID(data.address_id);
        setTaxID(data.tax_address_id);
    
        setSum(sum);
        setAmount(num);
    })
    .catch(err =>{
      console.log(err.response);
    })
  };

  
  useEffect(() => {
    fetchUser();
    fetchDetail();
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
    
  },[]);


  const getDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hours = '' +d.getHours(),
        minutes = '' +d.getMinutes(),
        second = '' +d.getSeconds();

    if (day.length < 2) 
        day = '0' + day;
    if (month.length < 2) 
      month = '0' + month;

    var dataDate = [day, month, (year + 543)].join('-');
    return dataDate;
  }
  const getTime = (date) => {
    var d = new Date(date),
        hours = '' +d.getHours(),
        minutes = '' +d.getMinutes(),
        second = '' +d.getSeconds();

    if (hours.length < 2) 
        hours = '0' + hours;
    if (minutes.length < 2) 
        minutes = '0' + minutes;
    var dataTime = [hours, minutes].join(':');
    return dataTime;
  }


  const saveSlip = () => {
    setLoadButton(true)
    var data = new FormData(event.target)
    const user_id = AuthService.getProfile().id;
    event.preventDefault()
    data.append("user_id", user_id);
    data.append("order_id", order_id);
    api.uploadSlip(data)
    .then(res=>{
      setLoadButton(false)
      const data = res.data;
      setShow(false);
      if(orderType == "member"){
        Router.push(`/user/member`);
      }else{
        Router.push(`/user/order-detail/${order_id}`);
      }
      
    })
    .catch(err => {
      setLoadButton(false)
      console.log(err.response);
    })
  }

  const showstartDate = (e) => {
    var today = e._i;
    var data = e._d;
    // var da = setD(data);
    setStartDate(data);
  }


  const valid = (current) => {
    if(!order){
      return true;
    } 
    var getStart = new Date(order.createdAt);
    getStart.setHours(0,0,0,0);
    return current._d >= getStart;
  }
  

  return (
 
  <Layout title="User | Order Detail" >
    <Sidenav user={user}  page="order" >
     
      <div className="box-main-account">
        <div className="row mx-0 px-0">
          <div className="col-12 px-0">
            <div className="mt-2 mb-4">
              <h6 className="text-black">หลักฐานการโอนเงิน</h6>
            </div>
            {/* <div className="main">
              <div className="">
                <div className="">
                  <h4 className="">รายละเอียดคำสั่งซื้อ</h4>
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
                  <p className="font-weight-bold">คำสั่งซื้อ #{order_id}</p>
                  <p>สั่งซื้อวันที่ {order ? tools.formatDate(order.createdAt) : ''}</p>
                </div>
                <div>
                  <Link href="/contact">
                    <a><button type="button" className="btn btn-outline-primary">ติดต่อเจ้าหน้าที่</button></a>  
                  </Link>
                </div>
              </div>
              <div className="border-bottom"></div>
              <div className="p-3">

                    <div className="tranfer-fail">
                      <div className="row">
                        <div className="col-12">
                          <p>รูปหลักฐานการชำระเงิน</p>
                          <div className="img-slip mt-2">
                            <img src={order ? order.slips[0].image : ''} className="h-100" />
                          </div>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-4">
                          <p>วันที่โอน</p>
                          <p>{order ? getDate(order.slips[0].date) : ''}</p>
                        </div>
                        <div className="col-4">
                          <p>เวลาที่โอน</p>
                          <p>{order ? getTime(order.slips[0].date) : ''}</p>
                        </div>
                        <div className="col-4">
                          <p>โอนจากธนาคาร</p>
                          <p>{order ? order.slips[0].from_bank : ''}</p>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-4">
                          <p>โอนไปยัง</p>
                          <p>{order ? order.slips[0].to_bank : ''}</p>
                        </div>
                        <div className="col-4">
                          <p>จำนวนที่ถูกโอนเงินแล้ว</p>
                          <p>{order ? tools.currencyFormatDE(order.slips[0].amount) : ''}</p>
                        </div>
                        <div className="col-4">
                          <p>เลขที่บัญชีที่โอน 4 หลักสุดท้าย</p>
                          <p>{order ? order.slips[0].pin : ''}</p>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-12">
                          <p className="text-danger">* {order ? order.slips[0].note : ''}</p>
                        </div>
                      </div>
                      <div className="row mt-5">
                        <div className="col-12">
                          <a><button type="button" className="btn btn-primary" onClick={() => {setShow(true)}}>แจ้งผลการโอนเงินใหม่</button></a> 
                        </div>
                      </div>
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
                  <select id="options" name="from_bank" className="form-control" required>
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
                  <label>{t("shippingInfo:last_4")} <span className="text-pink">*</span></label>
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
  </Layout>
)}

OrderDetail.getInitialProps = ({query}) => {
    return {query}; //has to be like an object
}
  
export default withTranslation('order_detail')(OrderDetail)