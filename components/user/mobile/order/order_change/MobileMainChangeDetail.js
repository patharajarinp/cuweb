import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import BtnCancelChange from '../../../../../components/mobile/change/btn-cancel-change';
import BtnChange from '../../../../../components/mobile/change/btn-change';
import BtnNotiChange from '../../../../../components/mobile/change/btn-noti-change';
import ChangeProduct from '../../../../../components/mobile/change/change-product';
import Collapsetrack from '../../../../../components/mobile/change/collapse-track';
import api from '../../../../../utils/api';
import { Link } from '../../../../../utils/i18n';
import BtnAddAddress from '../../../../../components/mobile/change/btn-add-address';
import tools from '../../../../../utils/tools';

const MobileMainChangeDetail = (props) => {
  const { t } = props;
  const [changes, setChanges] = useState();
  const router = useRouter();
  const change_id = router.query.id;
  const [show, setShow] = useState(false);
  const [note, setNote] = useState('');
  const [data, setData] = useState({});
  const [dates, setdates] = useState()

  const fecthReturnOne = () => {
    api.getPackageReturnOne(change_id).then(res => {
      const data = res.data;
      setChanges(data);
      if(data.old_type == '1' && data.change_type == '1' && !data.address) {
        setShow(true);
      }
      let date = new Date(data.createdAt)
      var data1 = date.setDate(date.getDate() +5 );
      setdates(date)
      // console.log('data', data)
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  useEffect(() => {
    if(!change_id) return;
    fecthReturnOne();
   
  }, [change_id]);

  const changeStatus = (change_id, status) => {
    var form_data = new FormData();

    //Default now status 10 to cancel status 00
    if(status == '10') {
      form_data.append('status', '00');
      form_data.append('cancel_note', note);
    }

    //Manual Approve
    // if(status == '10') {
    //   form_data.append('status', '20');
    // }

    //now status 20 to sendForm status 30
    if(status == '20') {
      form_data.append('shipping_company1', data.shipping_company1);
      form_data.append('file_upload1', data.file_upload1);
      form_data.append('tracking_number1', data.tracking_number1);
      form_data.append('status', '30');
    }

    if(status == '61') {
      var dta_status = data.status;
      if(dta_status == '62') {
        form_data.append('dispute4', 1);
        form_data.append('dispute4_note', data.dispute4_note);
        form_data.append('status', '62');
      }else{
        form_data.append('status', '61');
      }
    }
    
    api.updatePackageReturn(change_id, form_data).then(res => {
      const data = res.data;
      fecthReturnOne();
      
    })
    .catch(err => {
      console.log(err)
      console.log(err.response);
    })
  }
  const onConfirmCancel = () => {
    changeStatus(change_id, '10');
  }

  const onConfirmSlip = () => {
    changeStatus(change_id, '20');
  }

  const onConfirmProduct = () => {
    changeStatus(change_id, '61');
  }

  return ( 
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4>รายละเอียดการเปลี่ยนสินค้า</h4>
        </div>
        <Link href="/user/order_change">
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
        </Link>
      </div>
      {
        changes ? 
                
            
          <div className="bg-light-less-gray min-vh-100">
            <div className="h-64px"></div>
                {
                  changes.status == 10 && (
                    <div className="container">
                        <div className="notification-transfer-nav-change row">
                            <img className="img-fluid mr-3 my-auto" src="/mobile/image/icon/icon-notification-orange.svg" />
                            <p className="p-12 w-75 my-auto">ส่งคำขอร้องขอเปลี่ยนสินค้าสำเร็จ ร้านค้าจะพิจารณาใน 5 วัน (สิ้นสุดในวันที่ {tools.formatDate(dates)})</p>
                        </div>
                    </div>
                  )
                }
                {
                  changes.status == 51 && (
                  <div className="container">
                      <div className="notification-transfer-nav-change row">
                          <img className="img-fluid mr-3 my-auto" src="/mobile/image/icon/icon-notification-orange.svg" />
                          <p className="p-12 w-75 my-auto">ร้านค้าส่งสินค้าชิ้นใหม่มาให้แล้ว กรุณาตรวจสอบสินค้า และยืนยันการได้รับสินค้า เพื่อระบบจะทำการจ่ายเงินให้ร้านค้า</p>
                      </div>
                  </div>
                  )
                }
              
              {changes.detail.map((val,index)=>(
                <ChangeProduct val={val} t={t}/>
              ))}
              

              {/* <hr className="row use-line my-0"></hr> */}
              
              
              { 
                  (changes.old_type == '1' && changes.change_type == '1' && !changes.address) &&
                      <div className="container  d-flex justify-content-center my-3">  
                        <BtnAddAddress change={changes}   fecthReturnOne={fecthReturnOne} t={t} show={show} setShow={setShow} />
                      </div>
              }
              {
                  changes.status == 10 && (
                      <div className="container  d-flex justify-content-center my-3">  
                        <BtnCancelChange change={changes} onSubmit={onConfirmCancel}  note={note} setNote={setNote} t={t} />
                      </div>
                  )
              }
              {
                  changes.status == 20 && (
                      <div className="container d-flex justify-content-center my-3">
                          <BtnNotiChange change={changes} onSubmit={onConfirmSlip} data={data} setData={setData} t={t} />
                      </div>
                  )
              }

              {
                  changes.status == 51 && (
                      <div className="container d-flex justify-content-center my-3">
                          <BtnChange change={changes} onSubmit={onConfirmProduct} data={data} setData={setData} t={t} />
                      </div>
                  )
              }
              
              <div className="container bg-white mb-3">
                  <Collapsetrack change={changes} t={t} />
              </div>

              <div className="container bg-white mb-1">
                  <div>
                      <div className="py-2">
                      <Link href={`/user/order-change/[order_id]?order_id=${changes.id}`} as={`/user/order-change/${changes.id}`}>
                              <h4 className="text-black mb-1">หมายเลขการเปลี่ยนสินค้า : #{changes.id}</h4>
                          </Link>
                          <p className="text-content-news mb-1">ขอเปลี่ยนสินค้าเมื่อวันที่ : {tools.formatDate(changes.createdAt)}</p>
                          <p className="text-content-news mb-1">หมายเลขคำสั่งซื้อ : #{changes.order_id}</p>
                          <p className="text-content-news ">จัดจำหน่ายโดย : {changes.seller ? changes.seller.shop_name :'CHULABOOK'}</p>
                      </div> 
                  </div>
              </div>
          </div>
        :null
      }  
    </>
  )
}

export default MobileMainChangeDetail