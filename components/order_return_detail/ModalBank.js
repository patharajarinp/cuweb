import React, { useState, useEffect } from 'react'
import classNames from 'classnames';
import api from '../../utils/api';
import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import myData from '../../public/json/raw_database.json';
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";
const ModalCancel = ({returns, show, setShow, t, fecthReturnOne}) => {

  
  const handleSubmit = () => {
    event.preventDefault();
    var r = confirm("คุณยืนยันที่จะบันทึกข้อมูลนี้หรือไม่!!!");
    if (r) {
      var return_id = returns.id;
      var form_data = new FormData(event.target);
      form_data.append('add_bank', 1);
      api.updatePackageReturn(return_id, form_data).then(res => {
        const data = res.data;
        alert('บันทึกข้อมูลสำเร็จ!!!');
        fecthReturnOne();
        setShow(false);
      })
      .catch(err => {
        setShow(false);
        console.log(err)
        console.log(err.response);
      })
    }
    return false;
  }

  return (
    <>
      {
        returns && (
          <>
            <Modal className="modal-cart" show={show} centered onHide={() => setShow(false)} size="lg">
              <Modal.Header closeButton>
                <Modal.Title className="font-20">ชื่อบัญชีธนาคารสำหรับคืนเงิน</Modal.Title>
              </Modal.Header>
              <Modal.Body className="row">
                <p className="font-weight-bold col-6">{t('Order:return_id')} #{returns.id}</p>
                <p className="text-right col-6">{t('Order:return_date')} {tools.formatDate(returns.createdAt)}</p>
                <div className="col-12 mb-3">
                  <hr className="use-line"></hr>
                </div>
                <form className="col-12" onSubmit={handleSubmit} >
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>ชื่อบัญชี<span className="text-pink">*</span></label>
                        <input type="text" className="form-control" name="bank_bookname" required />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>ธนาคาร<span className="text-pink">*</span></label>
                        <select id="options"   name="bank_name" className="form-control" required>
                          <option value="" className="selected">{t("select_bank")}</option>
                          <option data-index="0">{t("scb")}</option><option data-index="1" className="selected">{t("kasikorn")}</option><option data-index="2">{t("krungthai")}</option><option data-index="3">{t("bangkok_bank")}</option><option data-index="4">{t("krungsri")}</option><option data-index="5">{t("thanachart")}</option><option data-index="6">{t("tmb")}</option><option data-index="7">{t("gsb")}</option><option data-index="8">{t("baac")}</option><option data-index="9">{t("kiatnakin")}</option><option data-index="10">{t("sc")}</option><option data-index="11">{t("uob")}</option><option data-index="12">{t("tisco")}</option><option data-index="13">{t("cimb")}</option><option data-index="14">{t("icbc")}</option>
                        </select>
                        {/* <input type="text" className="form-control" name="bank_name" required /> */}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>เลขที่บัญชี<span className="text-pink">*</span></label>
                        <input type="text" className="form-control" name="bank_number" required />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>สาขา</label>
                        <input type="text" className="form-control" name="branch" />
                      </div>
                    </div>
                    <div className="col-12 d-flex justify-content-end mt-4">
                      <button type="button" className="btn btn-outline-primary mr-3 text-black" onClick={() => setShow(false)}>{t('ConfirmDialog:cancel')}</button>
                      <button type="submit" className="btn btn-primary"  >{t('ConfirmDialog:save')}</button>
                    </div>
                  </div>
                  
                </form>
              </Modal.Body>
            </Modal>
          </>
        )
      }

    </>
  )
}

export default withTranslation('order_detail')(ModalCancel)