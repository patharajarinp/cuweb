import jwt from 'jwt-decode'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Layout from '../../components/layout'
import api from '../../utils/api'
import {  Router, withTranslation } from '../../utils/i18n'
import tools from '../../utils/tools'

const MainChangePassword = (props) => {
  const { t, loading, setLodding } = props;
  const router = useRouter();
  const {token} = router.query;

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);
  
  useEffect(() => {
    $('#modal-success').on('hidden.bs.modal', function (e) {
      $('#modal-success').modal('hide');
      setTimeout(function() {
        Router.push('/login?success=true')
      }, 200);
    })
    
  },[]);
 
  const getEmail = () =>{
    try{
      var decoded = jwt(token);
   
      return decoded.email;
    }
    catch(err){
      return ''
    }
  }
  
  const validateEmail = (email) => {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( email );
  }

  const [imgPassword1,setStateImg1] = React.useState(['icon-hide-password.svg'])
  const [imgPassword2,setStateImg2] = React.useState(['icon-hide-password.svg'])
  const [imgPassword3,setStateImg3] = React.useState(['icon-hide-password.svg'])
  const handlePassword1 = () => {
    var x = document.getElementById("old_password");
    if (x.type === "password") {
      x.type = "text";
      setStateImg1('icon-show-password.svg');
    } else {
      x.type = "password";
      setStateImg1('icon-hide-password.svg');
    }
  }
  const handlePassword2 = () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      setStateImg2('icon-show-password.svg');
    } else {
      x.type = "password";
      setStateImg2('icon-hide-password.svg');
    }
  }
  const handlePassword3 = () => {
    var x = document.getElementById("confirm_password");
    if (x.type === "password") {
      x.type = "text";
      setStateImg3('icon-show-password.svg');
    } else {
      x.type = "password";
      setStateImg3('icon-hide-password.svg');
    }
  }

  const handleChange = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const jsonData = tools.toJson(data);

    var password = $('#password').val();
    var confirm_password = $('#confirm_password').val();

    if(password != confirm_password){
      alert('รหัสผ่านใหม่ และ ยืนยันรหัสผ่านใหม่ ไม่ตรงกัน');
      return;
    } 

    api.changePassword(jsonData)
    .then(res=>{
      const data = res.data;
      ;
      $('#modal-success').modal('toggle');
      // Router.push('/login')
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  const handleSave = () => {
    $('#modal-success').modal('hide');
    setTimeout(function() {
      Router.push('/login?success=true')
    }, 200);
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
          <div className="col-xl-10 col-12 bg bg-white">
            <div className="row mx-0 justify-content-center">
              <div className="col-xl-10 col-12 px-0 mx-0">
                  <form id="forgot-form" onSubmit={handleChange}>
                  <div className="row justify-content-center mx-0 px-0">
                    <div className="col-xl-12 col-12 mx-0 px-0">
                      <div className="text-center">
                        <h4>บัญชี ของคุณคือ <span className="text-transform-none">{getEmail()} </span>กรุณาระบุรหัสผ่านใหม่ของท่าน</h4>
                      </div>
                    </div>
                  </div>
                    <div className="row justify-content-center mx-0 px-0">
                          <div className="col-xl-6 col-12 d-flex">
                              <div className="w-100">
                              <div className="form-group">
                                <input type="hidden" name="token" defaultValue={token ? token : ''} className="form-control" id="token" />
                              </div>
                              </div>
                          </div>
                      </div>
                    
                      <div className="row justify-content-center mx-0 px-0">
                          <div className="col-xl-6 col-lg-8 col-md-8 col-12 d-flex">
                              <div className="w-100">
                              <div className="form-group">
                                  <label>รหัสผ่านใหม่ <span className="text-pink">*</span></label>
                                  <div className="position-relative">
                                  <input type="password" id="password" className="form-control" name="password" placeholder={t('placeholder_changepasswordfill')} minLength="8" maxLength="16" required pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" />
                                  <label className="font-14">รหัสผ่านประกอบด้วยตัวเลขและตัวอักษรพิมพ์เล็กพิมพ์ใหญ่ 8 - 16 ตัว</label>
                                  <img src={`/icon/${imgPassword2}`} id="toggle-password" alt="" className="toggle-password" onClick={handlePassword2} />
                                  </div>
                              </div>
                              </div>
                          </div>
                      </div>
                      <div className="row justify-content-center mx-0 px-0">
                          <div className="col-xl-6 col-lg-8 col-md-8 col-12 d-flex">
                              <div className="w-100">
                              <div className="form-group">
                                  <label>ยืนยันรหัสผ่านใหม่ <span className="text-pink">*</span></label>
                                  <div className="position-relative">
                                  <input type="password" id="confirm_password" className="form-control" name="confirm_password" placeholder={t('placeholder_changepasswordfill')} minLength="8" maxLength="16" required pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" />
                                  <img src={`/icon/${imgPassword3}`} id="toggle-password" alt="" className="toggle-password" onClick={handlePassword3} />
                                  </div>
                              </div>
                              </div>
                          </div>
                      </div>
                      <div className="row  justify-content-center mx-0 px-0 mt-4">
                          <div className="col-xl-6 col-lg-8 col-md-8 col-12">
                              <div>
                              <div className="">
                                  <button className="btn btn-primary w-100" type="submit">รีเซ็ตรหัสผ่าน</button>
                              </div>
                              </div>
                          </div>
                      </div>
                  </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="modal-success" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content default-radius">
            <div claclassNames="modal-body">
              <div className="text-center py-5">
                <div>
                  <img src="/icon/lock.svg" alt="" className="" />
                </div>
                <div className="mt-4">
                  <h4 className="text-pink">เปลี่ยนรหัสผ่านแล้ว</h4>
                </div>
                <div className="mt-4">
                  <p>ยินดีต้อนรับสู่ CHULABOOK กลับไปหน้าหลัก</p>
                </div>
                <div className="mt-5">
                  <button type="button" className="btn btn-primary" onClick={handleSave}>ตกลง</button>
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

export default MainChangePassword