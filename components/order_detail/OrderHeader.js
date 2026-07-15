import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import ConfirmDialog1 from '../ConfirmDialog'
// import ConfirmDialog2 from '../ConfirmDialog'
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";
import ModalCancel from '../order_detail/ModalCancel';
const OrderHeader = ({order, order_id, t}) => {
  const [modalShow1, setModalShow1] = useState(false);
  const handleModalClose1 = () => setModalShow1(false);

  const [modalShow2, setModalShow2] = useState(false);
  const handleModalClose2 = () => setModalShow2(false);
  const [form, setForm] = useState({});

  const [package_id, setPackageId] = useState(0);

  const changeStatus = (order_id) => {
    var data = form;
    // console.log(data.get('cancel_note'));
    api.updateOrderStatus(order_id, data).then(res => {
      const data = res.data;
      Router.push('/user/order_cancel');
    })
    .catch(err => {
      console.log(err)
      console.log(err.response);
    })
  }
  
  
  const onConfirm1 = () => {
    changeStatus(order_id);
  }
  // const onConfirm2 = () => {
  //   var val = order && order.packages[0].package_id;
  //   setPackageId(val);
  //   updatePackage(val);
  // }



  

  

  return (
   <>
   {
      order && (
        <>
          <div className="p-3 d-flex justify-content-between align-items-center header-detail order">
            <div>
              <p className="font-weight-bold">{t('order_no')} #{order.order_id}</p>
              <p>{t('date_order')} {tools.formatDate(order.createdAt)}</p>
            </div>
            <div>
              {
                ((order.payment_type == 2 && order.status == 1) && (order.slips && !order.slips.length)) && (
                  <>
                    <a className="mr-3" onClick={() => setModalShow1(true)}>
                      <button className="btn btn-cancel">{t('link_cancel')}</button>
                    </a>
                    <Link href={`/user/order-tranfer/[order_id]?order_id=${order.order_id}`} as={`/user/order-tranfer/${order.order_id}`}>
                      <a><button type="button" className="btn btn-primary">{t('shippingInfo:inform_payment')}</button></a>
                    </Link>
                  </>
                )
              }
              {
                (order.payment_type == 4 && order.status == 1) && (
                  <a className="mr-3" onClick={() => setModalShow1(true)}>
                    <button className="btn btn-cancel">{t('link_cancel')}</button>
                  </a>
                )
              }
              {
                (order.payment_type == 2 && order.status == 1 && order.slips.length > 0 && order.slips[0].status == 1) && (
                  <a><button type="button" className="btn btn-disabled" disabled>{t('awaiting_summary')}</button></a>
                )
              }
              {
                (order.payment_type != 2 && order.status == 1) && (
                  <>
                    <a className="mr-3" onClick={() => setModalShow1(true)}>
                      <button className="btn btn-cancel">{t('link_cancel')}</button>
                    </a>
                    <Link href={`/user/order-tranfer/[order_id]?order_id=${order.order_id}`} as={`/user/order-tranfer/${order.order_id}`}>
                      <a><button type="button" className="btn btn-primary">{t('shippingInfo:payment')}</button></a>
                    </Link>
                  </>
                )
              }
              

              {
                (order.payment_type == 2 && order.status == 1 && order.slips.length > 0 && order.slips[0].status == 0) && (
                  <>
                    <Link href={`/user/order-tranfer-detail/${order.order_id}`} >
                      <a><button type="button" className="btn btn-primary">{t('invalid_verify')}</button></a>
                    </Link>
                  </>
                )
              }

            </div>
          </div>
          <ModalCancel show={modalShow1} handleClose={handleModalClose1} order={order} t={t} onConfirm={onConfirm1} setForm={setForm} />
         {/*  <ConfirmDialog1 show={modalShow1}
          text="คุณต้องการที่จะยกเลิกคำสั่งซื้อ ?"
          onConfirm={onConfirm1}
          size="md" onHide={handleModalClose1}
          cancel_btn={true} />
 */}
          {/* <ConfirmDialog2 show={modalShow2}
          text="ยืนยันได้รับสินค้าแล้ว ?"
          onConfirm={onConfirm2}
          size="md" onHide={handleModalClose2}
          cancel_btn={true} /> */}
        </>
      )
    }
   </>
  )
}

export default OrderHeader