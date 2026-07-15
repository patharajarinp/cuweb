import React, { useState, useEffect } from 'react'
import classNames from 'classnames';
import api from '../../utils/api';

import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import ConfirmDialog from '../ConfirmDialog'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";
const ModalSlip = ({ changes, show, handleClose, t ,onConfirm, data, setData, modalShow2, setModalShow2, handleModalClose2}) => {
  // const handleModalOpen = () => {setModalShow(true);  event.preventDefault(); handleClose(); };
  
  const handleChange = (e) => {
    var {name, value,type} = e.target;
    if(type == 'file') value = e.target.files[0]
    setData({...data, [name] : value});
  }

  const checkRequired = () => {
    event.preventDefault();
    if(!data.shipping_company1 || !data.file_upload1 || !data.tracking_number1) {
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
                <Modal.Title className="font-20">{t("Order:change_slip")}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="row">
                <p className="font-weight-bold col-6">{t('Order:change_id')} #{changes.id}</p>
                <p className="text-right col-6">{t('Order:change_date')} {tools.formatDate(changes.createdAt)}</p>
                <div className="col-12 mb-3">
                  <hr className="use-line"></hr>
                </div>
                <form className="col-12" onSubmit={checkRequired} >
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>{t("user_file_upload1")}</label>
                        <input type="file" name="file_upload1" className="form-control" placeholder={t("placeholder_file_upload1")} onChange={handleChange} />
                        {/* <input type="text" name="file_upload1" className="form-control" placeholder={t("placeholder_file_upload1")} /> */}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>{t("user_shipping_company1")}</label>
                        <input type="text" name="shipping_company1" className="form-control" placeholder={t("placeholder_shipping_company1")} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>{t("user_tracking_number1")}</label>
                        <input type="text" name="tracking_number1" className="form-control" placeholder={t("placeholder_tracking_number1")} onChange={handleChange} />
                      </div>
                    </div>
                    {
                      data && !!data.error && (
                        <div className="col-12">
                          <div className="form-group">
                            <label className="text-danger">{t("text_warning_require")}</label>
                          </div>
                        </div>
                      )
                      
                    }
                    <div className="col-12 d-flex justify-content-end ">
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

export default withTranslation('order_detail')(ModalSlip)