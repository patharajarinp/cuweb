import React, { useState, useEffect } from 'react'
import classNames from 'classnames';
import api from '../../utils/api';

import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import ConfirmDialog from '../ConfirmDialog'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";
const ModalProduct = ({ changes, show, handleClose, t ,onConfirm, data, setData, modalShow2, setModalShow2, handleModalClose2}) => {
  // const handleModalOpen = () => {setModalShow(true);  event.preventDefault(); handleClose(); };
  const [selected, setSelected] = useState(0);

  const handleChange = (e, datatype) => {
    var {name, value,type} = e.target;
    setData({...data, [name] : value});
    setSelected(datatype);
  }

  const checkRequired = () => {
    event.preventDefault();
    console.log(data);
    if(!data.status) {
      setData({...data, error : true});
    }else{
      setData({...data, error : false});
      handleClose();
      setModalShow2(true);
    }
  }

  return (
    <>
      {
        changes && (
          <>
            <Modal className="modal-cart" show={show} centered onHide={handleClose} size="lg">
              <Modal.Header closeButton>
                <Modal.Title className="font-20">{t("confirm_approve_product")}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="row">
                <p className="font-weight-bold col-6">{t('Order:change_id')} #{changes.id}</p>
                <p className="text-right col-6">{t('Order:change_date')} {tools.formatDate(changes.createdAt)}</p>
                <div className="col-12 mb-3">
                  <hr className="use-line"></hr>
                </div>
                <form className="col-12" onSubmit={checkRequired} >
                  <div className="row">
                    <div className="col-12 d-flex">
                      <div className="form-group w-100 mb-0">
                        <label className="radio-button mb-0">
                          <input type="radio" className="radio-button__input" name="status" value="61" checked={selected == 1} onChange={(e) => handleChange(e, 1)} required />
                          <span className="radio-button__control"></span>
                          <span className="radio-button__label"></span>
                          <span>ยืนยันรับสินค้าจากผู้ขาย</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-12 d-flex mt-3">
                      <div className="form-group w-100 mb-0 pt-3 border-top">
                        <label className="radio-button mb-0">
                          <input type="radio" className="radio-button__input" name="status" value="62" checked={selected == 2} onChange={(e) => handleChange(e, 2)} required />
                          <span className="radio-button__control"></span>
                          <span className="radio-button__label"></span>
                          <span>ยังไม่ได้รับสินค้าจากผู้ขาย</span>
                        </label>
                      </div>
                    </div>
                    {
                      selected == 2 ? (
                        <>
                        {/* <input type="hidden" name="dispute4" value="1" onChange={(e) => handleChange(e, 2)} /> */}
                        <div className="col-12 mt-3">
                          <div className="form-group mb-0">
                            <label>ข้อมูลเพิ่มเติม</label>
                            <textarea className="form-control" rows="4" name="dispute4_note" id="dispute4_note"></textarea>
                          </div>
                        </div>
                        </>
                      ) : ''
                    }
                    <div className="col-12 d-flex justify-content-end border-top pt-3 mt-3">
                      <button type="button" className="btn btn-outline-primary mr-3 text-black" onClick={handleClose}>{t('ConfirmDialog:cancel')}</button>
                      <button type="submit" className="btn btn-primary"  >{t('ConfirmDialog:save')}</button>
                    </div>
                  </div>
                  
                </form>
              </Modal.Body>
            </Modal>
            <Modal className="modal-alert" centered show={modalShow2} onHide={handleModalClose2} size="md">
              <Modal.Body>
                <div className="row mt-4 justify-content-center">
                  <div className="col-12">
                    <div className="text-center">
                      <img src="/icon/Attention.svg" />
                    </div>
                  </div>
                  <div className="col-12 my-4">
                    <div className="text-center">
                      <h3>{t("confirm_save")}</h3>
                    </div>
                  </div>
                  <div className="col-12 mb-4">
                    <div className="text-center">
                      <button type="button" className="btn btn-outline-primary mr-4" onClick={handleModalClose2}>{t('ConfirmDialog:cancel')}</button>
                      <button type="button" className="btn btn-primary" onClick={onConfirm}>{t('ConfirmDialog:save')}</button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </>
        )
      }

    </>
  )
}

export default withTranslation('order_detail')(ModalProduct)