import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import BtnAddBank from '../../../../../components/mobile/return/btn-add-bank';
import BtnCancelChange from '../../../../../components/mobile/return/btn-cancel-change';
import BtnNotiChange from '../../../../../components/mobile/return/btn-noti-change';
import Collapsetrack from '../../../../../components/mobile/return/collapse-track';
import ReturnProduct from '../../../../../components/mobile/return/return-product';
import api from '../../../../../utils/api';
import { Link } from '../../../../../utils/i18n';
import tools from '../../../../../utils/tools';

const MobileMainReturnDetail = (props) => {
  const { t } = props;
  const [returns, setReturns] = useState();
  const router = useRouter();
  const return_id = router.query.id;
  const [show, setShow] = useState(false);
  const [note, setNote] = useState('');
  const [data, setData] = useState({});
  const [dates, setdates] = useState()

  const fecthReturnOne = () => {
    api.getPackageReturnOne(return_id).then(res => {
      const data = res.data;
      setReturns(data);
      if(data.old_type == '2' && data.change_type == '1' && !data.book_bank) {
        setShow(true);
      }
     let date = new Date(data.createdAt)
      var data1 = date.setDate(date.getDate() +5 );
      setdates(date)
      // console.log('data', data,date)
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  
  useEffect(() => {
    if(!return_id) return;
    fecthReturnOne();
   
  }, [return_id]);

  const changeStatus = (return_id, status) => {
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
    
    api.updatePackageReturn(return_id, form_data).then(res => {
      const data = res.data;
      fecthReturnOne();
    
    })
    .catch(err => {
      console.log(err)
      console.log(err.response);
    })
  }
  const onConfirmCancel = () => {
    changeStatus(return_id, '10');
  }

  const onConfirmSlip = () => {
    changeStatus(return_id, '20');
  }
  
  return ( 
    <>
      <div className="cart-nav">
          <div className=" text-center cart-nav-title">
              <h4>รายละเอียดการคืนสินค้า</h4>
          </div>
          <Link href="/user/order_return">
              <a className="btn-back cart-nav-back">
                  <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
              </a>
          </Link>
      </div>
      {
          returns ? 
          
      
      <div className="bg-light-less-gray min-vh-100">
      <div className="h-64px"></div>
            {
              returns.status == 10 && (
                <div className="container">
                    <div className="notification-transfer-nav-change row">
                        <img className="img-fluid mr-3 my-auto" src="/mobile/image/icon/icon-notification-orange.svg" />
                        <p className="p-12 w-75 my-auto">ส่งคำขอร้องขอคืนสินค้าสำเร็จ ร้านค้าจะพิจารณาใน 5 วัน (สิ้นสุดในวันที่ {tools.formatDate(dates)})</p>
                    </div>
                </div>
              )
            }
            
          
          {returns.detail.map((val,index)=>(
            <ReturnProduct val={val} t={t} />
          ))}
          

          {/* <hr className="row use-line my-0"></hr> */}
          
          
          
          {
          (returns.old_type == '2' && returns.change_type == '1' && !returns.book_bank) &&
          <div className="container  d-flex justify-content-center my-3">  
            <BtnAddBank change={returns} fecthReturnOne={fecthReturnOne}  t={t} show={show} setShow={setShow} />
          </div>
        }
        {
          returns.status == 10 && (
            <div className="container  d-flex justify-content-center my-3">  
            <BtnCancelChange change={returns} onSubmit={onConfirmCancel}  note={note} setNote={setNote} t={t} />
          </div>
          )
        }
        {
          returns.status == 20 && (
            <div className="container d-flex justify-content-center my-3">
                      <BtnNotiChange change={returns} onSubmit={onConfirmSlip} data={data} setData={setData} t={t} />
                  </div>
          )
        }
          
          <div className="container bg-white mb-3">
              <Collapsetrack returns={returns} t={t} />
          </div>

          <div className="container bg-white mb-1">
              <div>
                  <div className="py-2">
                  <Link href={`/user/order-change/[order_id]?order_id=${returns.id}`} as={`/user/order-change/${returns.id}`}>
                          <h4 className="text-black mb-1">หมายเลขการคืนสินค้า : #{returns.id}</h4>
                      </Link>
                      <p className="text-content-news mb-1">ขอคืนสินค้าเมื่อวันที่ : {tools.formatDate(returns.createdAt)}</p>
                      <p className="text-content-news mb-1">หมายเลขคำสั่งซื้อ : #{returns.order_id}</p>
                      <p className="text-content-news ">จัดจำหน่ายโดย : {returns.seller ? returns.seller.shop_name :'CHULABOOK'}</p>
                  </div> 
              </div>
          </div>
      </div>
        :null
      }  
    </>
  )
}

export default MobileMainReturnDetail