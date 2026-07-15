import React, { useEffect } from 'react';
import { Link, withTranslation } from "../../../utils/i18n";

const Nocart = (props) => {
  const { t } = props;

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  return ( 
    <>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-8 ">
            <div className="bg-white p-5 text-center border-radius-8px">
              <img className="img-fluid" src="/images/not-cart.svg" alt="ศูนย์หนังสือจุฬาฯ" />
              <h3 className="text-pink py-3">{t('no-more')}</h3>
              <Link href='/'>
                <button className="btn btn-primary mt-3">{t("shoping-now")}</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="end-page"></div>
    </>
  )
}

export default Nocart