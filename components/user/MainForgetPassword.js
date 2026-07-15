import { Link, withTranslation } from '../../utils/i18n';
import React, { useEffect, useState } from 'react'
import tools from '../../utils/tools'
import api from '../../utils/api'

const MainForgetPassword = (props) => {
  const { t, loading, setLodding } = props;

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);
 
  const validateEmail = (email) => {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( email );
  }

  
  const handleForgot = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const jsonData = tools.toJson(data);
    setLodding(true);
    api.forgotPassword(jsonData)
    .then(res=>{
      const data = res.data;
      setLodding(false);
      $('#forget-password').addClass('d-none');
      $('#forget-text').removeClass('d-none');
    })
    .catch(err => {
      setLodding(false);
      console.log(err.response);
    })
  }

  return (
    <>
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <div className="text-center">
              <h3>ลืมรหัสผ่านหรือไม่?</h3>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-xxl-8 col-lg-8 col-md-10 col-12 bg bg-white">
            <div className="row mx-0 justify-content-center">
              <div className="col-lg-10 col-md-12 col-12 px-0 mx-0" id="forget-password">
                <form id="reset-form" onSubmit={handleForgot}>
                  <div className="row">
                    <div className="col-12">
                      <div>
                        <h4 className="text-center">โปรดระบุบัญชีที่ต้องการรีเซ็ตรหัสผ่าน</h4>
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-center mx-0">
                    <div className="col-xxl-8 col-xl-8 col-lg-10 col-md-10 col-12">
                      
                      <div className="form-group my-4">
                        <label>โปรดระบุบัญชีที่ต้องการรีเซ็ตรหัสผ่าน<span className="text-pink">*</span></label>
                        <input type="text" id="email" className="form-control" name="email" placeholder="โปรดป้อนอีเมลของคุณ" required/>
                      </div>
                      <div className="form-group mb-3">
                        <button type="submit" className="btn btn-primary w-100">รีเซ็ตรหัสผ่าน</button>
                      </div>
                      <div className="form-group">
                        <Link href={'/login'} as={`/login`} >
                          <a className="text-pink mt-3 pt-3">กลับไป</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-12 d-none" id="forget-text">
                <div className="text-center">
                  <div>
                    <img src="/icon/mail.svg" alt="" className="" />
                  </div>
                  <div className="mt-4">
                    <h4 className="text-pink">ส่งอีเมลแล้ว</h4>
                  </div>
                  <div className="mt-4">
                    <p>กรุณาตรวจสอบกล่องอีเมลของคุณจากนั้นทำตามขั้นตอนในอีเมลเพื่อรีเซ็ตรหัสผ่าน</p>
                  </div>
                  <div className="mt-5">
                    <Link href={'/login'} as={`/login`} >
                      <button type="button" className="btn btn-primary">กลับสู่หน้าหลัก</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="end-page"></div>
    </>
  )
}

export default MainForgetPassword