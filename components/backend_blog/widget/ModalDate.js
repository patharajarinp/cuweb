import React, { useState,useEffect,useContext,useRef } from 'react'
import Router from 'next/router'
import {Button, Modal} from 'react-bootstrap';
import Datetime from "react-datetime";
const Dialog = ({show, onHide, size, text, cancel_btn, ref_id, onConfirm,startDate,validStartDate,showstartDate}) => {

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
                <img src="/icon/blog-icon-be-clock-y.svg" width="50px" />
              </div>
            </div>
            <div className="col-12 my-4">
              <div className="text-center">
              <h4>เลือกเวลาที่ต้องการตั้งล่วงหน้า</h4>
               <Datetime
            dateFormat="YYYY-MM-DD"
            timeFormat="hh:mm"
            onChange={(e) => {
              showstartDate(e);
            }}
            value={startDate ? startDate : ""}
            isValidDate={validStartDate}
            inputProps={{
              name: "start_date",
              required: true,
              autoComplete: "off",
            }}
          />
              </div>
            </div>
            <div className="col-12 mb-4">
              <div className="text-center">
                {
                  cancel_btn && (
                     <button type="button" className="blog-detail-story-detail-card-btn-b" onClick={onHide}>ยกเลิก</button>
                  )
                }
                <button type="button" className="blog-detail-story-detail-card-btn-n" onClick={handleConfirm}>บันทึก</button>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>  
  )
}

export default Dialog