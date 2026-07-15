// import { Collapse, CustomInput } from 'reactstrap';
import classnames from "classnames";
// import Link from 'next/link';
// import Router from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/layout';
import UserContext from '../../contexts/UserContext';
import api from '../../utils/api';
import AuthService from '../../utils/AuthService';
import { Link,Router, withTranslation } from '../../utils/i18n';
import tools from '../../utils/tools';
const register_fill_info = (props) => {
  const [isPasswordShow, setisPasswordShow] = useState(false);
  const { user, handleCart, fetchUser } = useContext(UserContext)
  const togglePasswordVisiblity = () => setisPasswordShow(!isPasswordShow);
  const [validform, setValid] = useState(false);
  const [confirmcancel,setconfirmcancel] = useState(false);
  const { t } = props;
  useEffect(() => {
    var formemail = localStorage.getItem('email');
    var email = document.getElementById('email').value = formemail;
    /*  setDate(); */
  }, []);


  function transformData(input) {
    // 1. ฟังก์ชันช่วยลบเครื่องหมาย " (Double Quote) ที่ซ้อนทับอยู่ออก
    const removeQuotes = (str) => str ? str.replace(/"/g, '') : str;

    // 2. แยกปี เดือน วัน ออกจากฟิลด์ date ("2541-08-08" -> ["2541", "08", "08"])
    const [year, month, day] = input.date.split('-');

    // 3. สร้าง Object ใหม่ตามรูปแบบที่ต้องการ
    const newJson = {
        "social_id": input.social_id,
        "picture": input.picture,
        "provider": input.provider,
        "access_token": input.access_token,
        "firstname": removeQuotes(input.firstname),
        "lastname": removeQuotes(input.lastname),
        "day": day,
        // ใช้ parseInt เพื่อลบเลข 0 ด้านหน้าเดือน (เช่น "08" -> "8") ตามที่คุณต้องการ
        "month": parseInt(month, 10).toString(), 
        "year": year,
        "phone": removeQuotes(input.phone),
        "email": input.email,
        "password": input.password
    };

    return newJson;
}

  const headleRegister = (event) => {
   
    const data = new FormData(event.target)
    event.preventDefault()
  
    const jsonData = tools.toJson(data);
    const targetJson = transformData(jsonData);
    api.register(targetJson)
      .then(res => {
        const data = res.data;
        ;
        AuthService.setToken(data.token)
        AuthService.setProfile(data.user);
     
        localStorage?.removeItem('user')
        setProfile()
        fetchUser();
        localStorage.removeItem('email');
        Router.push('/')
      })
      .catch(err => {
        console.log(err.response);
      })

  }
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const txt = localStorage?.getItem('user')
    setProfile(JSON.parse(txt))
  },[])

  return (
    <Layout className="mb-5" title={'สร้างบัญชี (register) | ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย'}>
      <div className="cancel-product ">

        <div className="container">
          <form onSubmit={headleRegister}>

            <input type="hidden" name="social_id" value={profile?.social_id} />
            <input type="hidden" name="picture" value={profile?.picture} />
            <input type="hidden" name="provider" value={profile?.provider} />
            {profile?.provider == "line" ? <input type="hidden" name="line_code" value={profile?.access_token} />:
            <input type="hidden" name="access_token" value={profile?.access_token} />}


            <div className="w-100 clearfix">
              <div onClick={()=>setconfirmcancel(!confirmcancel)}>
                <img className="img-fluid my-auto on-left" src={'/mobile/image/icon/icon-back.svg'} /></div>
              <h2 className="text-black ">กรุณากรอกข้อมูล <br /> เพื่อลงทะเบียน</h2>
              <div className="info-creditcard-100 mt-5 mb-1">
                <input className="effect-16" name="email" id="email" type="text" placeholder="" required defaultValue={profile?.email} />
                <label>{t('mobile_translations:email')}<span>*</span></label>
                <span className="focus-border"></span>
              </div>
              <div className="info-creditcard-100 mt-5 mb-1">
                <input className="effect-16" name="phone" id="phone" type="text" placeholder="" required defaultValue={profile?.phone} maxLength={12}/>
                <label>{t('mobile_translations:phone_number')}<span>*</span></label>
                <span className="focus-border"></span>
              </div>
              <div className="input-effect-50 mr-for-50 mt-5">
                <input className="effect-16" type="text" name="firstname" placeholder="" defaultValue={profile?.firstname} required />
                <label>{t('mobile_translations:name')}<span>*</span></label>
                <span className="focus-border"></span>
              </div>
              <div className="input-effect-50 mt-5">
                <input className="effect-16" type="text" name="lastname" placeholder="" defaultValue={profile?.lastname} required />
                <label>{t('mobile_translations:surname')}<span>*</span></label>
                <span className="focus-border"></span>
              </div>
              <div className="info-creditcard-100 mt-5 mb-1">
                <input className="effect-16" name="password" type="password" minLength="6" maxLength="16" placeholder="" required />
                <label>{t('password')}<span>*</span></label>
                <span className="focus-border"></span>
              </div>
              <div className="info-creditcard-100 mt-5 mb-1">
                <input className="select-box-address has-content effect-16" name="date" type="date" placeholder="" required />
                <label>{t('mobile_translations:birthday')}<span>*</span></label>
                <span className="focus-border"></span>
              </div>
            </div>


            <div className="mt-5">
                  <button type="submit" className="btn btn-pink-submit h-40px mb-3"><h4 className="text-white m-auto ">{t('mobile_translations:confirm')}</h4></button>
            </div>

            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <p className="text-black mr-2">{t('already_account')}? </p>
                <Link href={`/login`}>
                  <a><p className="text-pink">{t('login')}</p></a>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className={classnames("modals-confirm-cancel-area", { "show": confirmcancel })}>
        <div className="modals-confirm-cancel">
          <div className="d-flex">
            <img className="img-fluid m-auto" src="/mobile/image/icon/Attention.svg" />
          </div>
                  <p className="text-black text-center mt-2">{t('want_cancel')}</p>
          <div className="btn-modals-confirm-cancel-area">
                  <h4 className="m-auto text-pink" onClick={()=>setconfirmcancel(false)}>{t('mobile_ConfirmDialog:cancel')}</h4>
            <div className="btn-line-cancel"></div>
            <Link href="/login">
            <h4 className="m-auto text-pink">{t('mobile_ConfirmDialog:save')}</h4>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withTranslation('mobile_register')(register_fill_info);