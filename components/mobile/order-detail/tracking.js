import classnames from "classnames";
import React from 'react';
import { withTranslation } from '../../../utils/i18n';
import tools from '../../../utils/tools';
const Tracking = (props) => {
    const { tracking, OpenTracking, invoice, t, order } = props;

    function copy() {
        function listener(e) {
            e.clipboardData.setData('text/plain', invoice.tracking_id);
            e.preventDefault();
        }

        document.addEventListener('copy', listener);
        document.execCommand('copy');
        document.removeEventListener('copy', listener);
    }
    return (
        <div className={classnames("tracking", { "show": !tracking })}>
            <div className="order-manage-nav">
                <div className="text-center m-auto">
                    <h3 className="mb-0">{t("mobile_order_detail:track_package")}</h3>
                </div>

                <a className="btn-back order-manage-back" onClick={OpenTracking}>
                    <img className="img-fluid my-auto" src={'/mobile/image/icon/icon-back.svg'} />
                </a>

            </div>
            <div className="bg-light-less-gray min-vh-100">
                <div className="h-56px"></div>
                <div className="container bg-white p-3 tracking-banner">
                    {
                        !invoice.isOnlyEbook ? (
                            <>
                                <h4 className="text-course">{(invoice.company == 'THAI_POST' || invoice.company == 'HAPPY') ? `${t("mobile_translations:standard_delivery")}` : `${t("mobile_translations:express_delivery")}`}</h4>
                                <p className="p-12 mb-0">{t("mobile_order_detail:tracking_number")} {t(invoice.company)} :  </p>
                                <p className="p-12 mb-2">{invoice.tracking_id}</p>
                                <p onClick={copy} className="p-12 text-course">{t("mobile_order_detail:copy")}</p>
                            </>
                        ) : ''
                    }
                </div>
                <div className="container bg-white mt-3">
                    <h4 className="text-black py-3 m-0">{t("mobile_order_detail:shipment_tracking")}</h4>
                    <hr className="row use-line my-0"></hr>
                    <div className="d-flex py-3">
                        <div className="line-track"></div>
                        <div className="w-100">
                            {
                                ((order.slips && order.slips.length > 0) || (invoice.trackings.length > 0)) &&
                                <>

                                    {
                                        !!(invoice.status >= 5 && invoice.isOnlyEbook) && 
                                        <div className="list-track">
                                            <div className="on-track"></div>
                                            <div>
                                                <p className={classnames("text-course mb-0")}>{t('mobile_order_detail:ebook_success')}</p>
                                                <p className="p-12 mb-0" key={Math.random()}>{t("mobile_translations:day")} {tools.formatDate(invoice.paid_time, false)}  </p>
                                            </div>
                                        </div>

                                    }
                                    {
                                        invoice.trackings.sort((a, b) => new Date(b.date) - new Date(a.date)).map((tracking, index) => <div className="list-track">
                                            <div className={index == 0  ? "on-track" : 'off-track'}></div>
                                            <div>
                                                <p className="text-course m-0">
                                                {index == invoice.trackings.length - 1 ? (
                                                    <>
                                                    {
                                                        invoice.company != 'CHULABOOK' ? (
                                                            <a className="text-course m-0" href={t(invoice.company + "_link")} target="__blank" >{t('tracking_click')}</a> 
                                                        ) : (
                                                            <span className="text-course m-0">{t('tracking_chualabook_info')}</span> 
                                                        )
                                                    }
                                                    </>
                                                )
                                                
                                                : tracking.description}</p>
                                                <p className="p-12 mb-0" key={Math.random()}>{t("mobile_translations:day")} {tools.formatDate(tracking.date, false)}</p>

                                            </div>
                                        </div>
                                            
                                        )
                                    }

                                    {
                                        (invoice.status > 2 && !invoice.isOnlyEbook) && 
                                        <div className="list-track">
                                            <div className={invoice.status == 3 ? "on-track" : 'off-track'}></div>
                                            <div>
                                                <p className={classnames(" mb-0",{"text-course": (invoice.status == 3)})}>
                                                        {t('mobile_order_detail:pickup_success')}</p>
                                                <p className="p-12 mb-0" key={Math.random()}>{t("mobile_translations:day")} {tools.formatDate(invoice.pickup_date, false)}  </p>
                                            </div>
                                        </div>
                                        
                                    }

                                    {
                                        order.slips && order.slips.map((slip) =>
                                            <>{slip.status == 2 && <div className="list-track">
                                                <div className={invoice.status <= 2 && slip.status == 2 && !invoice.trackings.length ? "on-track" : 'off-track'}></div>
                                                <div className={(invoice.status <= 2 && slip.status == 2 && !invoice.trackings.length) ? "":"ml-1" }>

                                                    <p className={classnames(" mb-0",{"text-course": (invoice.status <= 2 && slip.status == 2 && !invoice.trackings.length)})}>
                                                        {t('mobile_order_detail:slip_success')}</p>
                                                    <p className="p-12 mb-0" key={Math.random()}>{t("mobile_translations:day")} {tools.formatDate(slip.updatedAt, false)}  </p>
                                                </div>
                                            </div>

                                            }
                                                {
                                                    slip.status == 0 && <div className="list-track">
                                                        <div className={slip.status == 0 ? "on-track" : 'off-track'}></div>
                                                        <div className={(slip.status == 0) ? "":"ml-1" }>

                                                            <p className={classnames(" mb-0",{"text-course": (slip.status == 0)})}>
                                                                {t('mobile_order_detail:slip_error')}</p>
                                                            <p className="p-12 mb-0" key={Math.random()}>{t("mobile_translations:day")} {tools.formatDate(slip.updatedAt, false)} </p>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="list-track">
                                                    <div className={slip.status == 1 ? "on-track" : 'off-track'}></div>
                                                    <div className={(slip.status == 1) ? "":"ml-1" } >

                                                        <p className={classnames(" mb-0",{"text-course": (slip.status == 1)})}>
                                                            {t('mobile_order_detail:silp_pending')}</p>
                                                        <p className="p-12 mb-0" key={Math.random()}>{t("mobile_translations:day")} {tools.formatDate(slip.createdAt, false)} </p>
                                                    </div>
                                                </div>


                                            </>
                                        )
                                    }
                                </>
                            }

                           
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default withTranslation('order_detail')(Tracking);