import { Modal } from 'react-bootstrap';

import React from 'react';

const ModalStock = ({ show, t, handleClose }) => {
 return (
  <Modal className="modal-alert" show={show} onHide={handleClose} size="lg">
   <Modal.Body>
    <div className='text-center'>
     <h3>{t('out_stock')}</h3>
    </div>
   </Modal.Body>
  </Modal>
 )
}

export default ModalStock;