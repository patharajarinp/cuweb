// import Link from 'next/link';
import React from 'react';
import { withTranslation, Link } from '../../utils/i18n';
const Nocart = (props) => {
    const { t } = props;
    return (
        <>

            <div className="container ">
                <div className="d-flex align-items-center justify-content-center">
                    <div>
                        <div className="d-flex align-items-center justify-content-center">
                            <img className="img-fluid mb-4" src="/mobile/image/icon/not-cart.svg" />
                        </div>

                        <h2 className="text-pink text-center">{t("Order:there_are_no_order")}</h2>
                    </div>

                </div>


            </div>
            <div className="success-manu">
                <Link href='/'>
                    <a className="btn-success-menu bg-pink"><h4 className="text-white m-auto">{t("continue_shopping")}</h4></a>
                </Link>
            </div>
        </>
    );
}
export default withTranslation('mobile_translations')(Nocart);