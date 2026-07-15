import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";

const MainReturn = ({data, handleDeleteFile, handleFile, MAX, returns}) => {
  if(!data) {
    return;
  }

  return (
   <>
      <div className={`${returns ? 'img-order-return' : ''}`}>
        <div className="form-group d-none">
          <input type="file" name="image" accept="image/*" />
        </div>
        <div className="form-group mr-3">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              {
                data.images.map((val2,i) => (
                  <div className="position-relative m-2 mt-4 ">
                    <div className="review-img-upload">
                      <img src={val2.src} className="img-middle"  />
                      
                      <a className="text-pink text-delete" onClick={()=>handleDeleteFile(i)}>ลบ</a>
                    </div>
                  </div>
                ))
              }
            </div>
            {
              data.images.length < MAX ? (
                <div className="d-flex align-items-center m-2 mt-4">
                <label className="review-img" htmlFor={"input-img-"+data.product_id} >
                  <input type="file" className="d-none" name="image" id={"input-img-"+data.product_id} onChange={handleFile} accept="image/*" />
                  <img src="/images/set-image.png" className="img-middle" />
                </label>
              </div>
              ) : null
            }
            {
              data.error && data.error === 'image' && 
                <div id={"img-error-"+data.product_id} className="text-danger font-14">กรุณาเพิ่มรูปภาพ </div>
            }
          </div>
        </div>
      </div>
   </>
  )
}

export default MainReturn