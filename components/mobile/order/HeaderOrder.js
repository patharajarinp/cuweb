import React from 'react';
import { Link } from '../../../utils/i18n';
import tools from '../../../utils/tools';
const HeaderOrder = (props) => {
  const {order, btnStatus,t, currencyFormatDE, Datemonth} = props;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="pt-2">
          <Link href={`/user/order-detail/[order_id]?order_id=${order.order_id}`} as={`/user/order-detail/${order.order_id}`}>
            <h4 className="text-black">{t("order")} <span className="text-pink">#{order.order_id}</span></h4>
          </Link>
          <p className="text-date-news "> {tools.formatDate(order.createdAt)}</p>
        </div> 
        <div className="d-flex justify-content-end">
          {
            ((order.payment_type == 2 && order.status == 1) && (order.slips && !order.slips.length)) && (
              <Link href={`/user/order-tranfer/[order_id]?order_id=${order.order_id}`} as={`/user/order-tranfer/${order.order_id}`}>
                <a className="btn-nonw bg-pink text-white h-40px">{t('shippingInfo:inform_payment')}</a>
              </Link>
            )
          }
          {
            (order.payment_type != 2 && order.status == 1) && (
              <Link href={`/user/order-tranfer/[order_id]?order_id=${order.order_id}`} as={`/user/order-tranfer/${order.order_id}`}>
                <a className="btn-nonw bg-pink text-white h-40px">{t('shippingInfo:payment')}</a>
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
          {/* {
            (order.payment_type == 2 && order.status == 1 && order.slips.length > 0 && order.slips[0].status == 0) && (
              <>
                <Link href={`/user/order-tranfer-detail/${order.order_id}`} >
                  <a className="btn-nonw bg-pink text-white h-40px">{t('order_detail:invalid_verify')}</a>
                </Link>
              </>
            )
          } */}
        </div>
        {/* {
          (order.packages[0].status == 1 && (order.slips && order.slips.length == 0)) == 1 && (
            
            <div className="d-flex justify-content-end">
              <Link href={`/user/order-tranfer/[order_id]?order_id=${order.order_id}`} as={`/user/order-tranfer/${order.order_id}`}>
                <a className="btn-nonw bg-pink text-white h-40px">{t("payment")}</a>
              </Link>
            </div>
          )
        }
        {
          (order.packages[0].status == 1 && (order.slips && order.slips.length > 0)) == 1 && (
            <div className="d-flex justify-content-end">
              <a><button type="button" className="btn-nonw btn-disabled" disabled>{t("awaiting_summary")}</button></a>
            </div>
          )
        } */}
      </div>
      
    </>
  )
}
export default HeaderOrder