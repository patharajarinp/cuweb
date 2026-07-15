import React, { useContext, useState } from 'react';
import { CustomInput } from 'reactstrap';
import Loadbutton from '../../../../components/mobile/widget/Button';
import UserContext from '../../../../contexts/UserContext';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { Link, Router } from '../../../../utils/i18n';
import tools from '../../../../utils/tools';

const MobileMainActivateMember = (props) => {
  const { t } = props;

  const [OTP, setOTP] = useState(0);
  const { user, handleCart, fetchUser, local, setLocal } = useContext(UserContext)
  const [token, settoken] = useState()
  const [reOtp, setreOtp] = useState(true)
  const [errorOtp, seterrorOtp] = useState(false)
  const [loading, setLoading] = useState(false)


  const handleSave = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const id = AuthService.getProfile().id;
    data.append("token",token.token)
    const jsonData = tools.toJson(data);
    setLoading(true)
    if(document.getElementById("phone").value == ''){
      alert(t('mobile_translations:please_phone_number'));
    }else{
      api.activateMember(id, jsonData)
      .then(res=>{
        const data = res.data;
        ;
        fetchUser();
        setLoading(false)
        Router.push('/user/member');
      })
      .catch(err => {
        if(err.response.data.code == '1001') {
          alert(t('phone_number_cannot'));
        }else if(err.response.data.code == '1101') {
          alert(t('member_exists'));
        }
        console.log(err.response);
        if(err.response){
          seterrorOtp(true)
         
        } 
        setLoading(false)
        
      })
    }
  }

  const getOTP = () => {
    var phone = document.getElementById("phone").value;
    if(phone.length) {
      const id = AuthService.getProfile().id;
     
      api.checkPhome(id, {phone})
      .then(res=>{
        const data = res.data;
        let tmp = {phone}
        tmp.token = data.token
        settoken(tmp)
        setOTP(1);
        setreOtp(true)
        reOTP();
        ;
    
      })
      .catch(err => {
        if(err.response.data.code == '1001') {
          alert(t('phone_number_cannot'));
        }else if(err.response.data.code == '1101') {
          alert(t('member_exists'));
        }
        console.log(err.response);
     
      })
      
    }else{
      alert(t('correct_phone_number'));
    }
    
  }
  const reOTP = ()=>{
    setTimeout(()=>{
      setreOtp(false)
    },60000)
  }

  return ( 
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4>{t("confirm_membership")}</h4>
        </div>
        <Link href="/user/dashboard">
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
        </Link>
      </div>

      <div className="bg-white min-vh-100">
        <div className="h-64px">

        </div>

        <form onSubmit={handleSave}>
          <div className="container bg-white">
            <div className="w-100 clearfix">
              <div className="info-creditcard-100 mt-5 mb-1">
                <input className="effect-16" type="text" name="phone" id="phone" placeholder="" required />
                <label>{t("mobile_translations:phone_number")}/{t("mobile_premiumMember:membership_id")}<span>*</span></label>
                <span className="focus-border"></span>
              </div>
            </div>
            {
              OTP ? (
                <>
                <div className="w-100 clearfix">
                  <div className="info-creditcard-100 mt-5 mb-1">
                    <input className="effect-16" type="text" name="otp" id="otp" minLength="4" maxLength="4" pattern="[0-9]*" placeholder="" required />
                    <label>{t("confirm_otp")}<span>*</span></label>
                    <span className="focus-border"></span>
                  </div>
                </div>
                <div className={`${errorOtp ? 'd-flex':'d-none'} mt-3`}><span className="text-danger">รหัส OTP ไม่ถูกต้อง หรือหมดอายุ </span></div>
                <button className="btn btn-outline-primary w-100 mt-3 h-40px" type="button" disabled={reOtp}  onClick={getOTP} ><h4 className="text-pink m-auto">ขอรับรหัส OTP อีกครั้ง</h4></button>
                <div className="d-flex mt-4">
                  <CustomInput type="checkbox" id="accept" className="my-auto" required />
                  <p className="p-12 my-auto">{t("receive")}</p>
                </div>
                
                {loading?<Loadbutton loading={loading} name="btn-member" _class="" />:
                      <button type="submit" className="btn btn-pink-submit my-3 h-40px" ><h4 className="text-white m-auto">{t("mobile_translations:confirm")}</h4></button>
                      }
                
                </>
              ) : (
                <button type="button" className="btn btn-pink-submit my-3 h-40px" onClick={getOTP}><h4 className="text-white m-auto">{t("mobile_translations:confirm")}</h4></button>
              )
            }
            <p className="text-black">{t("not_registered_premium")}? 
              <Link href={`/user/member-register`}>
                <span className="text-pink ml-2">{t("mobile_premiumMember:register_premium")}</span>
              </Link>
            </p>
          </div>
        </form>
        <div className="footer-space"></div>
      </div>
      
    </>
  )
}

export default MobileMainActivateMember