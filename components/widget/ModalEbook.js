import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Router } from "../../utils/i18n";
import api from "../../utils/api";
const ModalEbook = ({ show, setShow, t, setStep, onPassPage }) => {
  const [checked, setChecked] = useState(false);

  const passPage = () => {
    setShow(false);
    setStep(2);
    if (typeof onPassPage === "function") {
      onPassPage();
    }
    //Router.push('/user/summary');
  }

  return (
    <>
      <Modal className="modal-alert modal-ebook" centered show={show} onHide={() => setShow(false)} size="md">
        <Modal.Body>
            <div className="row my-4 justify-content-center">
              <div className="col-12">
                <div className="text-center">
                  <h2 className="text-ebook">{t('modal_ebook1')}</h2>
                </div>
              </div>
              <div className="col-12">
                <div className="text-center">
                  <p className="mb-0">{t('modal_ebook2')}</p>
                  <p>{t('modal_ebook3')}</p>
                </div>
              </div>
              <div className="col-12">
                <div className="text-center">
                  <img src={`${api.frontend_url}/images/google-play.png`} className="img-app mx-4" />
                  <img src={`${api.frontend_url}/images/app-store.png`} className="img-app mx-4" />
                </div>
              </div>
              <div className="col-12 mt-4">
                <div className="text-center">
                  <p className="mb-0 text-danger">{t('modal_ebook4')}</p>
                  <p className="text-danger">{t('modal_ebook5')}</p>
                </div>
              </div>
              <div className="col-12">
                <div className="text-center">
                  <div className="form-group">
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" className="custom-control-input" id={`item1`} checked={checked} onChange={() => setChecked(!checked)} name="checked"  />
                      <label className="custom-control-label" htmlFor={`item1`}>
                        {t('modal_ebook6')}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-4">
                <div className="text-center">
                  <button type="button" className="btn text-black btn-outline-ebook" onClick={() => setShow(false)}>{t('modal_ebook7')}</button>
                  <button type="button" className={`btn ml-4 ${checked ? 'btn-ebook' : 'btn-disabled'}`} disabled={!checked} onClick={() => passPage()}>{t('modal_ebook8')}</button>
                </div>
              </div> 
            </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ModalEbook