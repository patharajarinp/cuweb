import React, { useEffect, useState } from 'react';
import { Link, withTranslation } from "../../utils/i18n";
import LayoutEcode from '../../components/ecode/LayoutEcode';

const Custom404 = (props) => {
  const { t } = props;
  useEffect(() => {
    if (document.getElementsByClassName('main-layout')[0]) {
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  }, []);
  return (
    <LayoutEcode title="ขออภัย ไม่พบหน้าที่คุณค้นหา">
      <div style={{ backgroundColor: '#f2f2f2', minHeight: '100vh' }}>
        <div className="container">
          <div className="error-page-const-ecode">
            <div className='error-page-box-ecode'>
              <div className="d-flex">
                <img className="img-fluid m-auto w-194px" src="/mobile/image/banner/error.png" />
              </div>
              <div className="text-center mt-4">
                <h3 className="mb-4">ขออภัย ไม่พบหน้าที่คุณค้นหา</h3>
                <Link href={'/'}>
                  <button className="btn bg-pink h-40px my-2"><h4 className="text-white m-auto ">{t("mobile_translations:back_to_home")}</h4></button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </LayoutEcode>
  )
}
export default withTranslation('home')(Custom404);