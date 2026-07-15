import React, { useEffect, useState } from 'react';
import { Link, withTranslation } from '../utils/i18n';
import Layout from '../components/layout';

const testPage = (props) => {
  const {t} = props;
  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  return (
    <Layout title={'Test Page'}>
      <div className="container">
        <div className="error-page-const">
          <div className='error-page-box'>
            <div className="d-flex">
              <img className="img-fluid m-auto w-194px" src="/mobile/image/banner/error.png"/>
            </div>
            <div className="text-center mt-4">
              <h3 className="mb-4">ทดสอบหน้าเว็บ Test Page</h3>
              <Link href={'/'}>
                <button className="btn bg-pink h-40px my-2"><h4 className="text-white m-auto ">{t("mobile_translations:back_to_home")}</h4></button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  ) 
}
export default withTranslation('home')(testPage);