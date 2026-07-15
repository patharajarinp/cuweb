import React from 'react';
import { Link } from '../../../../utils/i18n';

const MobileNocart = (props) => {
  const { t } = props;
  
  
  return ( 
    <>
      <div className="bg-light-less-gray">
        <div className="container bg-white ">
          <div className="d-flex align-items-center justify-content-center vh-100">
            <div>
              <div className="d-flex align-items-center justify-content-center">
                <img className="img-fluid mb-4" src="/mobile/image/icon/not-cart.svg" />
              </div>

              <h2 className="text-pink text-center">{t("mobile_translations:no_items_cart")}</h2>
            </div>
          </div>
        </div>

      </div>
      <div className="success-manu">
        <Link href='/'>
          <a className="btn-success-menu bg-pink"><h4 className="text-white m-auto">{t("mobile_translations:continue_shopping")}</h4></a>
        </Link>
      </div>
    </>
  )
}

export default MobileNocart
