import React from 'react';
import { withTranslation } from '../../../utils/i18n';
const list_payment = ['credit', 'bank_transfer', 'qr_code', 'cod','shopee_pay']
const PaymentDetail = (props) => {
    const { paymentType, numProduct, productPriceTotal, shippingPrice, totalPrice, discount, paymentStatus,t, order, tools, total_price } = props;

    console.log('order', order);

    return (
        <>
            <div className="container bg-white mt-3">
                <h4 className="text-black py-3 mb-0">{t("mobile_order_detail:payment_details")}</h4>
                <hr className="row use-line my-0 "></hr>
                {
                    order.total_price != 0 ? (
                        <>
                            {paymentStatus ? <p className="text-black py-2 mb-0">{t("mobile_order_detail:pay_by")} {t(list_payment[paymentType-1])}</p>:''}
                        </>
                    ) : (
                        <>
                            <p className="text-black py-2 mb-0">{t("mobile_order_detail:pay_by")} 
                                {(order.total_price == 0 && (order.member_discount == 0 && order.promotion_discount == 0)) ? ` ${t('mobile_order_detail:free_of_charge')}` : ''}
                                {(order.total_price == 0 && (order.member_discount != 0 || order.promotion_discount != 0)) ? ` ${t('mobile_order_detail:pay_with_code')}` : ''}
                            </p> 
                        </>
                    )
                }
                <div className="d-flex justify-content-between mt-3 ">
                    <p className="p-12 text-disable mb-0">{t("mobile_order_detail:default_price")}</p>
                    <h6 className="font-weight-bold text-disable mb-0">฿ {productPriceTotal}</h6>
                </div>
                {
                    discount && discount > 0 ?
                    <div className="d-flex justify-content-between">
                        <p className="p-12 text-disable mb-0">{t("mobile_translations:discount")}</p>
                        <h6 className="font-weight-bold text-disable text-danger mb-0">- {discount ? tools.currencyFormatDE(discount - order.promotion_discount - order.member_discount) : '0.00'}</h6>
                    </div> : ''
                }
                <div className="d-flex justify-content-between">
                    <p className="p-12 text-disable mb-0">{t("mobile_order_detail:promotion_discount")}</p>
                    <h6 className="font-weight-bold text-disable text-danger mb-0">- {order.promotion_discount ? tools.currencyFormatDE(order.promotion_discount) : '0.00'}</h6>
                </div>
                <div className="d-flex justify-content-between">
                    <p className="p-12 text-disable mb-0">{t("mobile_order_detail:total_price")}</p>
                    <h6 className="font-weight-bold text-disable mb-0">฿ {total_price ? tools.currencyFormatDE(total_price - discount) : '0.00'}</h6>
                </div>
                <div className="d-flex justify-content-between">
                    <p className="p-12 text-disable mb-0">{t("mobile_order_detail:shipping_cost")}</p>
                    <h6 className="font-weight-bold text-disable mb-0">฿ {shippingPrice}</h6>
                </div>
                <div className="d-flex justify-content-between">
                    <p className="p-12 text-disable">{t("mobile_order_detail:member_discount")}</p>
                    <h6 className="font-weight-bold text-disable text-danger">- {order.member_discount ? tools.currencyFormatDE(order.member_discount) : '0.00'}</h6>
                </div>
                <hr className="use-line my-0"></hr>
                <div className="d-flex justify-content-between my-3">
                    <p className="text-black">{t("mobile_order_detail:total")}</p>
                    <h4 className="font-weight-bold">฿ {totalPrice}</h4>
                </div>

            </div>
        </>
    )
}
export default withTranslation('order_detail')(PaymentDetail);