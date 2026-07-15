import React, { useState,useEffect,useContext,useRef } from 'react'
import Router from 'next/router'
import {Button, Modal} from 'react-bootstrap';

const Dialog = ({show, onHide, size, text, cancel_btn, ref_id, onConfirm}) => {

  const handleConfirm = e =>{
    if(onHide){
      onHide();
    }
    if(onConfirm){
      onConfirm(ref_id ? ref_id : null);
    }
  }

  return (
    <Modal className="modal-alert" centered show={show} onHide={onHide} size={size}>
      <Modal.Body>
        <form>
          <div className="row mt-4 justify-content-center">
            <div className="col-12">
              <div className="text-center">
                <img src="/icon/Attention.svg" />
              </div>
            </div>
            <div className="col-12 my-4">
              <div className="text-center">
                <h3>{text}</h3>
              </div>
            </div>
            <div className="col-12 mb-4">
              <div className="text-center">
                {
                  cancel_btn && (
                     <button type="button" className="btn btn-outline-primary mr-4" onClick={onHide}>ยกเลิก</button>
                  )
                }
                <button type="button" className="btn btn-primary" onClick={handleConfirm}>บันทึก</button>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>  
  )
}

export default Dialog