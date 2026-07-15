import React from 'react';
import { withTranslation } from '../../../utils/i18n';
const WaitPayment = (props) => {
    const {  date, paymentStatus,t } = props;
    return (
        <> {
            paymentStatus ? "" : <div className="container">
                <div className="notification-transfer-nav row">
                    <img className="img-fluid mr-2 my-auto" src="/mobile/image/icon/icon-notification-pink.svg" />
                    <p className="p-12 w-75 my-auto">{t("mobile_order_detail:please_pay_within")} {date}</p>
                </div>

            </div>
        }

        </>
    )
}
export default withTranslation('order_detail')(WaitPayment);