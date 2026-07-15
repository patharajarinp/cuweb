import React, { useState, useEffect } from 'react'
import classNames from 'classnames';
import api from '../../utils/api';

import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import ConfirmDialog from '../ConfirmDialog'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";
const ModalCancel = ({ returns, show, handleClose, t ,onConfirm, note, setNote, modalShow, setModalShow, handleModalClose}) => {
  const handleModalOpen = () => {setModalShow(true);  event.preventDefault(); handleClose(); };
  

  return (
    <>
      {
        returns && (
          <>
            <Modal className="modal-cart" show={show} centered onHide={handleClose} size="lg">
              <Modal.Header closeButton>
                <Modal.Title className="font-20">{t("link_cancel_return")}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="row">
                <p className="font-weight-bold col-6">{t('Order:return_id')} #{returns.id}</p>
                <p className="text-right col-6">{t('Order:return_date')} {tools.formatDate(returns.createdAt)}</p>
                <div className="col-12 mb-3">
                  <hr className="use-line"></hr>
                </div>
                <form className="col-12" onSubmit={handleModalOpen} >
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>{t("more_info")} ({t("if_have")})</label>
                        <textarea name="cancel_note" className="form-control" value={note ? note : ''} placeholder={t("type_message")} rows="3" onChange={(e) => setNote(e.target.value)}></textarea>
                      </div>
                    </div>
                    <div className="col-12 d-flex justify-content-end ">
                      <button type="button" className="btn btn-outline-primary mr-3 text-black" onClick={handleClose}>{t('ConfirmDialog:cancel')}</button>
                      <button type="submit" className="btn btn-primary"  >{t('ConfirmDialog:save')}</button>
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