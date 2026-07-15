import jwt from 'jwt-decode'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import api from '../../../utils/api'
import { Link,Router,  withTranslation } from '../../../utils/i18n'
import tools from '../../../utils/tools'

const MobileMainChangePassword = (props) => {
  const { t, loading, setLodding } = props;
  const router = useRouter();
  const {token} = router.query;

  const getEmail = () =>{
    try{
      var decoded = jwt(token);
   
      return decoded.email;
    }
    catch(err){
      return null
    }
  }

  const handleChange = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const jsonData = tools.toJson(data);

    var password = document.getElementById('password').value;
    var confirm_password = document.getElementById('confirm_password').value;

    if(password != confirm_password){
      alert('รหัสผ่านใหม่ และ ยืนยันรหัสผ่านใหม่ ไม่ตรงกัน');
      return;
    } 

    api.changePassword(jsonData)
    .then(res=>{
      const data = res.data;
      ;
      Router.push('/login?success=true');
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  return (
    <>
      <div className="cancel-product ">
        <form id="forgot-form" onSubmit={handleChange}>
          <div className="container">
            
            <input type="hidden" name="token" defaultValue={token ? token : ''} className="form-control" id="token" />
            <Link href="/login">
              <img className="img-fluid my-auto on-left" src={'/mobile/image/icon/icon-back.svg'} />
            </Link>
            <h2 className="text-black ">เปลี่ยนรหัสผ่าน</h2>
            <p className="text-black ">บัญชี ของคุณคือ {getEmail()} <br/>กรุณาระบุรหัสผ่านใหม่ของท่าน</p>
            <div className="info-creditcard-100 mt-3 mb-4">
              <input className="effect-16" type="password" id="password" name="password" placeholder="" required minLength="8" maxLength="16" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" />
              <label>รหัสผ่านใหม่<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="info-creditcard-100 mt-3">
              <input className="effect-16" type="password" id="confirm_password" name="confirm_password"placeholder="" required minLength="8" maxLength="16" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" />
              <label>ยืนยันรหัสผ่านใหม่<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div>
              <p className="font-14">รหัสผ่านทั้งตัวเลขและตัวอักษร 8 - 16 ตัว</p>
            </div>
            <div className="mt-3 pt-2">
              <button type="submit" className="btn btn-pink-submit h-40px mb-3"><h4 className="text-white m-auto ">รีเซ็ตรหัสผ่าน</h4></button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default MobileMainChangePassword