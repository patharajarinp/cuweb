import React, { useState,useContext } from 'react'
import AuthService from '../../utils/AuthService'
import Router, { useRouter } from 'next/router'
import Link from "next/link";
import UserContext from '../../contexts/UserContext'
import Button from '../../components/widget/Button'
import tools from '../../utils/tools';
import api from '../../utils/api';

const LoginLayout = (props) => {  
  const {user,handleCart, fetchUser} = useContext(UserContext)
  const [check, setCheck] = useState(false);
  const headleLogin = (event) => {
    event.preventDefault()
    const data = tools.toJson(new FormData(event.target));
    AuthService.login(data,function(success,err){
      if(success){
        fetchUser();
        Router.push('/');
      }
      else{
        console.log(err);
        if(!err.response) {
          setCheck('อีเมล หรือ รหัสผ่าน ไม่ถูกต้อง');
        }
        if(err.response.data.code == 1001 || err.response.data.code == 1003){
          setCheck('อีเมล หรือ รหัสผ่าน ไม่ถูกต้อง');
        }
        console.log(err);
      }
    })
  }

  const handlesubmit = (event) => {
    document.getElementById('form-login').click();
    event.preventDefault()
  }
  
  const [imgPassword,setStateImg] = React.useState(['icon-hide-password.svg'])
  const handlePassword = () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      setStateImg('icon-show-password.svg');
    } else {
      x.type = "password";
      setStateImg('icon-hide-password.svg');
    }
  }
  const handleError = (error) => {
    console.log( error);
  }

  
  return (
  <>
      <div className="row justify-content-center">
        <div className="col-xxl-10 col-xl-10 col-lg-10 col-md-12 col-12 bg bg-white">
          <div className="row justify-content-center mx-0">
            <div className="col-xxl-5 col-12">
              <form id="contact-form" onSubmit={headleLogin}>
                <div className="form-group">
                  <label>อีเมล<span className="text-pink">*</span></label>
                  <input type="text" id="login" className="form-control" name="username" placeholder="โปรดป้อนอีเมลของคุณ" required />
                </div>
                <div className="form-group">
                  <label>รหัสผ่าน<span className="text-pink">*</span></label>
                  <div className="position-relative">
                    <input type="password" id="password" className="form-control" name="password" placeholder="กรุณาระบุรหัสผ่าน" title="ต้องมีทั้งตัวเลข ตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก อย่างน้อย 6 ตัว และ สูงสุด 16 ตัว" minLength="6" maxLength="16" required />
                    <label className="font-14">กรุณาระบุตัวเลข ตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก อย่างน้อย 6 ตัว และ สูงสุด 16 ตัว</label>
                    <img src={`/icon/${imgPassword}`} id="toggle-password" alt="" className="toggle-password" onClick={handlePassword} />
                  </div>
                </div>
                {
                  check && (
                    <div className="form-group mb-0 font-14">
                      <span className="text-danger">{check}</span>
                    </div>
                  )
                  
                }
                <input type="submit" name="form-login" id="form-login" className="d-none" value="Log In"/>
                <div className="form-group mt-4">
                  <div>
                    <Button _type="submit" _className="btn-primary w-100" _name="เข้าสู่ระบบ" />
                  </div>
                </div>
              </form>
              <div className="form-group">
                <div className="float-left">
                  <label>
                    สมาชิกใหม่ ?
                    <Link href={'/register'} as={`/register`} >
                      <a className="text-success"> ลงทะเบียน </a> 
                    </Link>
                    ที่นี่
                  </label>
                </div>
                <div className="float-right">
                  <Link href={'/forgot-password'} as={`/forgot-password`} >
                    <a>ลืมรหัสผ่าน</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </>
)}

export default LoginLayout
