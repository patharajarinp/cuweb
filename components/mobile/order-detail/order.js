import React from 'react';
import { withTranslation } from '../../../utils/i18n';
const Orderlist = (props) => {
    const { orderId, date, price, paymentStatus,t } = props;
    return (
        <>
            <div className="container bg-white py-3">
                <div className="d-flex">
                    <p className="text-black my-auto mr-1">{t("mobile_order_detail:order_no")}</p>
                    <h4 className="text-black my-auto">#{orderId}</h4>
                </div>
                <div className="d-flex">
                    <p className="text-black my-auto mr-1">{t("mobile_order_detail:date_order")}</p>
                    <h4 className="text-black my-auto">{date}</h4>
                </div>
                <div className="d-flex justify-content-between">
                    <p className="text-black my-auto mr-1">{t("mobile_order_detail:total")} :</p>
                    <div className="my-auto text-right">
                        <h2 className="h20 text-pink mb-0">฿ {price}</h2>
                        <p className="p-12 mb-0"> { paymentStatus ? t('mobile_order_detail:paid') : t('mobile_order_detail:to_be_paid')}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default withTranslation('order_detail')(Orderlist) ;