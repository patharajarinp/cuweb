import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";
import ModalCancel from './ModalCancel';
import ModalSlip from './ModalSlip';
import ModalProduct from './ModalProduct';
const OrderHeader = ({changes, t, fecthReturnOne, show, setShow}) => {
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [modalSlip, setModalSlip] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);


  const [note, setNote] = useState('');
  const [data, setData] = useState({});
  const change_id = changes.id;

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
      setModalCancel(false);
      setModalShow(false);
      setModalSlip(false);
      setModalConfirm(false);
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
   {
      changes && (
        <>
          <div className="p-3 d-flex justify-content-between align-items-center header-detail">
            <div>
              <p className="font-weight-bold">{t('Order:change_id')} #{changes.id}</p>
              <p>{t('Order:order')} #{changes.order_id}</p>
              <p>{t('Order:change_date')} {tools.formatDate(changes.createdAt)}</p>
            </div>
            <div>
              { 
                (changes.old_type == '1' && changes.change_type == '1' && !changes.address) &&
                <a className="mr-3" onClick={() => setShow(true)}>
                  <button className="btn btn-outline-primary-orange">{t('add_address')}</button>
                </a>
              }
              {
                changes.status == 10 && (
                  <a className="mr-3" onClick={() => setModalCancel(true)}>
                    <button className="btn btn-cancel">{t('link_cancel_change')}</button>
                  </a>
                )
              }
              {
                changes.status == 20 && (
                  <a className="mr-3" onClick={() => setModalSlip(true)}>
                    <button className="btn btn-outline-primary-orange">{t('Order:change_slip')}</button>
                  </a>
                )
              }

              {
                changes.status == 51 && (
                  <a className="mr-3" onClick={() => setModalConfirm(true)}>
                    <button className="btn btn-outline-primary-orange">{t('confirm_product')}</button>
                  </a>
                )
              }
            </div>
          </div>
          <ModalCancel show={modalCancel} handleClose={() => setModalCancel(false)} 
          note={note} setNote={setNote} changes={changes} t={t} onConfirm={onConfirmCancel} 
          modalShow={modalShow} setModalShow={setModalShow} handleModalClose={() => setModalShow(false)} />

          {
            changes.status == 20 && (
              <ModalSlip show={modalSlip} handleClose={() => setModalSlip(false)} 
              changes={changes} t={t} onConfirm={onConfirmSlip} 
              setData={setData} data={data}
              modalShow2={modalShow2} setModalShow2={setModalShow2} handleModalClose2={() => setModalShow2(false)} />
            )
          }

          {
            changes.status > 20 && (
              <ModalProduct show={modalConfirm} handleClose={() => setModalConfirm(false)} 
              changes={changes} t={t} onConfirm={onConfirmProduct} 
              setData={setData} data={data}
              modalShow2={modalShow2} setModalShow2={setModalShow2} handleModalClose2={() => setModalShow2(false)} />
            )
          }

          
        </>
      )
    }
   </>
  )
}

export default OrderHeader