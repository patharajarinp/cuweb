import React, { useState,useEffect,useContext,useRef } from 'react'
import { withTranslation } from '../../utils/i18n'
import {Modal} from 'react-bootstrap';

const ModalPromotion = (props) => {
  const { t, promotion, ModalClose,showModal, handleCloseMadal, copySuccess, setCopySuccess, shop_name } = props;
  if(!promotion) {
    return null;
  }

  const copyToClipboard = (e) => {
    var copyText = document.getElementById("myInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
    setCopySuccess('Copied!');
  }

  return (
    <Modal className="modal-alert" centered show={showModal} onHide={() => handleCloseMadal()} size={`md`}>
      <Modal.Header closeButton>
        <Modal.Title>{promotion.promotion_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {
            document.queryCommandSupported('copy') &&
            <>
              <div className="mb-3">
                <span>{promotion.use_with == 'platform' ? 'ส่วนลดสินค้าทั้งเว็บ	: ' : `ส่วนลดเฉพาะร้านค้า (${promotion.seller_id != 'cu' ? shop_name : 'CHULABOOK'}) : `}</span>
                <span>
                  {promotion.apply_with == "all" && 'สินค้าทั้งหมด'}
                  {promotion.apply_with == "category" && 'เฉพาะหมวด'}
                  {promotion.apply_with == "product" && 'รายสินค้า'}
                </span>
              </div>
              <div>
                <input type="text" className="input-copy" value={promotion.promotion_code} id="myInput" readOnly />
                <button type="button" className="btn-copy" onClick={copyToClipboard}>COPY</button> 
                {copySuccess && <span className="ml-2 text-success">{copySuccess}</span>}
              </div>
              <div className="my-3">
                <span  dangerouslySetInnerHTML={{__html: promotion.description ? promotion.description.replace(/\n/g,'<br>') : ''}}></span>
              </div>
              <div className="my-3">
                <span>เงื่อนไข : 
                  {promotion?.min_discount != 0 ? ` ซื้อขั้นต่า ${promotion.min_discount} บาท` : ' ไม่มีขั้นต่ำ'}
                  {promotion?.max_discount ? ` ลดสูงสุด ${promotion.max_discount} บาท` : ''}
                </span>
              </div>
            </>
          }
        </div>
      </Modal.Body>
    </Modal>  
  )
}

export default withTranslation('ConfirmDialog')(ModalPromotion)