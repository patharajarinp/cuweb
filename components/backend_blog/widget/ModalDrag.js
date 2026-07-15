import React from "react";
import Drag from "../drag/Drag";
import {Modal} from 'react-bootstrap';
export default function ModalDrag({
  cate,
  handleCateChange,
  show,
  onHide,
  size,
}) {
 
  return (
    <div>
      <Modal
        className="modal-alert"
        centered
        show={show}
        onHide={onHide}
        size={size}
      >
        <Modal.Body>
            <h3>จัดเรียงตอน</h3>
            <p>* ลากเพื่อสลับตำแหน่ง</p>
          <Drag cate={cate} handleCateChange={handleCateChange} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
