import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";

const HeaderOrder = ({order, t}) => {
  
  // console.log(order);
  return (
    <>
      <div className="order-date">
        {t('order')} 
        <Link href={`/user/order-detail/[order_id]?order_id=${order.order_id}`} as={`/user/order-detail/${order.order_id}`}>
          <a> #{order.order_id}</a>
        </Link>
        <br></br>
        {t('order_date')} {tools.formatDate(order.createdAt)}
      </div>
      {
        ((order.payment_type == 2 && order.status == 1) && (order.slips && !order.slips.length)) && (
          <Link href={`/user/order-tranfer/[order_id]?order_id=${order.order_id}`} as={`/user/order-tranfer/${order.order_id}`}>
            <a><button type="button" className="btn btn-primary">{t('shippingInfo:inform_payment')}</button></a>
          </Link>
        )
      }
      {
        (order.payment_type != 2 && order.status == 1) && (
          <Link href={`/user/order-tranfer/[order_id]?order_id=${order.order_id}`} as={`/user/order-tranfer/${order.order_id}`}>
            <a><button type="button" className="btn btn-primary">{t('shippingInfo:payment')}</button></a>
          </Link>
        )
      }
      {
        (order.payment_type == 2 && order.status == 1 && order.slips.length > 0 && order.slips[0].status == 1) && (
          <a className="text-cancel">{t('awaiting_summary')}</a>
        )
      }
      {
        order.status != 1 && (
          <div className="">
            <Link href={`/user/order-detail/[order_id]?order_id=${order.order_id}`} as={`/user/order-detail/${order.order_id}`}>
              <a>
                {t('manage_order')}
              </a>
            </Link>
          </div>
        )
      }
      {
        (order.payment_type == 2 && order.status == 1 && order.slips.length > 0 && order.slips[0].status == 0) && (
          <>
            <Link href={`/user/order-tranfer-detail/${order.order_id}`} >
              <a><button type="button" className="btn btn-primary">{t('order_detail:invalid_verify')}</button></a>
            </Link>
          </>
        )
      }
    </>
  )
}

export default HeaderOrder