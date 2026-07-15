import React, { useState, useEffect } from 'react'
import classNames from 'classnames';
import api from '../../utils/api';

import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import ConfirmDialog from '../ConfirmDialog'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";
const ModalCancel = ({ order, show, handleClose, t ,onConfirm, setForm}) => {
  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const handleModalOpen = (event) => {
    setModalShow(true);  
    event.preventDefault(); 
    var data = new FormData(event.target);
    setForm(data);
    handleClose(); 
  };
  let options_val = [];
  for (let i = 1; i <= 8; i++) {
    options_val.push(<option value={i} key={'reason' + i}>{t('reason_cancel' + i)}</option>)
  }

  return (
    <>
      {
        order && (<>
          <Modal className="modal-cart" show={show} centered onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="font-20">{t("link_cancel")}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="row">
              <p className="font-weight-bold col-6">{t('order_no')} #{order.order_id}</p>
              <p className="text-right col-6">{t('date_order')} {tools.formatDate(order.createdAt)}</p>
              <div className="col-12 mb-3">
                <hr className="use-line"></hr>
              </div>
              <form className="col-12" id="cancel-form" onSubmit={handleModalOpen} >
                <div className="row">

                  <input type="hidden" name="status" value="0" />
                  <div className="form-group styleSelect col-12 mb-3">
                    <label>{t("choose_reason")}<span className="text-pink">*</span></label>
                    <div className="d-block position-relative align-items-center">
                      <select className="form-control w-100" required name="cancel_type">
                        <option value="" disabled selected hidden>{t("choose_reason")}*</option>
                        {options_val}
                      </select>
                      <img src="/icon/icon-arrow-down.svg" className="select-icon" />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label>{t("more_info")} ({t("if_have")})</label>
                      <textarea name="cancel_note" className="form-control" placeholder={t("type_message")} rows="3"></textarea>
                    </div>
                  </div>
                  <div className="form-group col-12">
                    <div className="custom-control custom-checkbox mb-3">
                      <input type="checkbox" className="custom-control-input" id="customCheck" name="information" value="1" required />
                      <label className="custom-control-label" htmlFor="customCheck">
                        <p>
                          {t('read_and_accept')}<span className="text-success"><u>{t("product_cancellation_policy")}</u></span>
                        </p>
                      </label>
                    </div>
                  </div>
                  <div className="col-12 d-flex justify-content-end ">
                    <button type="button" className="btn btn-outline-primary mr-3 text-black" onClick={handleClose}>{t('ConfirmDialog:cancel')}</button>
                    <button type="submit" className="btn btn-primary"  >{t('ConfirmDialog:save')}</button>
                    {/* <input type="submit" className="btn btn-primary" /> */}
                  </div>
                </div>
                
              </form>
            </Modal.Body>
          </Modal>
          <Modal className="modal-alert" centered show={modalShow} onHide={handleModalClose} size="md">
            <Modal.Body>
              
                <div className="row mt-4 justify-content-center">
                  <div className="col-12">
                    <div className="text-center">
                      <img src="/icon/Attention.svg" />
                    </div>
                  </div>
                  <div className="col-12 my-4">
                    <div className="text-center">
                      <h3>{t("confirm_cancel")}</h3>
                    </div>
                  </div>
                  <div className="col-12 mb-4">
                    <div className="text-center">
                      
                          <button type="button" className="btn btn-outline-primary mr-4" onClick={handleModalClose}>{t('ConfirmDialog:cancel')}</button>
                        
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

export default withTranslation('order_detail')(ModalCancel)