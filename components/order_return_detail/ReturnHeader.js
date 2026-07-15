import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";
import ModalCancel from '../order_return_detail/ModalCancel';
import ModalSlip from '../order_return_detail/ModalSlip';
const OrderHeader = ({returns, t, fecthReturnOne, show, setShow}) => {
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [modalSlip, setModalSlip] = useState(false);

  const [note, setNote] = useState('');
  const [data, setData] = useState({});
  const return_id = returns.id;

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
      setModalCancel(false);
      setModalShow(false);
      setModalSlip(false);
      setModalShow2(false);
    })
    .catch(err => {
      console.log(err)
      console.log(err.response);
      if(!err.response) {
        return;
      }
      if(err.response.data.code == 3002){
        alert('ไม่สามารถใช้หมายเลขพัสดุนี้ได้ เนื่องจากถูกใช้ไปแล้ว!!!');
        return;
      }
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
   {
      returns && (
        <>
          <div className="p-3 d-flex justify-content-between align-items-center header-detail">
            <div>
              <p className="font-weight-bold">{t('Order:return_id')} #{returns.id}</p>
              <p>{t('Order:order')} #{returns.order_id}</p>
              <p>{t('Order:return_date')} {tools.formatDate(returns.createdAt)}</p>
            </div>
            <div>
              {
                (returns.old_type == '2' && returns.change_type == '1' && !returns.book_bank) &&
                <a className="mr-3" onClick={() => setShow(true)}>
                  <button className="btn btn-outline-primary-orange">{t('add_bank')}</button>
                </a>
              }
              {
                returns.status == 10 && (
                  <a className="mr-3" onClick={() => setModalCancel(true)}>
                    <button className="btn btn-cancel">{t('link_cancel_return')}</button>
                  </a>
                )
              }
              {
                returns.status == 20 && (
                  <a className="mr-3" onClick={() => setModalSlip(true)}>
                    <button className="btn btn-outline-primary-orange">{t('Order:return_slip')}</button>
                  </a>
                )
              }
            </div>
          </div>
          <ModalCancel show={modalCancel} handleClose={() => setModalCancel(false)} 
          note={note} setNote={setNote} returns={returns} t={t} onConfirm={onConfirmCancel} 
          modalShow={modalShow} setModalShow={setModalShow} handleModalClose={() => setModalShow(false)} />

          <ModalSlip show={modalSlip} handleClose={() => setModalSlip(false)} 
          returns={returns} t={t} onConfirm={onConfirmSlip} 
          setData={setData} data={data}
          modalShow2={modalShow2} setModalShow2={setModalShow2} handleModalClose2={() => setModalShow2(false)} />
        </>
      )
    }
   </>
  )
}

export default OrderHeader