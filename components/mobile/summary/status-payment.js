import classNames from 'classnames';
import React from 'react';
import { withTranslation } from '../../../utils/i18n';
const StatusPayment = (props) => {
    const {statusPaymentL,statusPaymentC,statusPaymentR,t} = props;
    return (
        <>
            <div className="status-payment">
                <div className="status-payment-line-area container">
                    <div className="status-payment-line"></div>
                    <div className={classNames("circle-left",{"status-payment-default": statusPaymentL == 1,"status-payment-this-state" :statusPaymentL == 2,"status-payment-success-state":statusPaymentL == 3})}></div>
                    <div className={classNames("circle-center",{"status-payment-default": statusPaymentC == 1,"status-payment-this-state" :statusPaymentC == 2,"status-payment-success-state":statusPaymentC == 3})}></div>
                    <div className={classNames("circle-right",{"status-payment-default": statusPaymentR == 1,"status-payment-this-state" :statusPaymentR == 2,"status-payment-success-state":statusPaymentR == 3})}></div>
    
                </div>
            </div>

        </>
    )
}
export default withTranslation('shippingInfo')(StatusPayment);