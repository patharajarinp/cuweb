// import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { FacebookProvider, Login } from 'react-facebook';
import { GoogleLogin } from 'react-google-login';
import FacebookLoginButton from '../../../components/mobile/widget/FacebookLoginButton';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import AuthService from '../../../utils/AuthService';
import { Link, Router, withTranslation } from '../../../utils/i18n';

const MobileMainRegister = (props) => {
  const { t, setLodding } = props;

  const [isPasswordShow, setisPasswordShow] = useState(false);
  const togglePasswordVisiblity = () => setisPasswordShow(!isPasswordShow);
  const [validform, setValid] = useState(false);
  const { user, handleCart, fetchUser } = useContext(UserContext)

  const sendCode = () => {
    var email = document.getElementById('email').value;
    const data = new FormData(event.target)
    event.preventDefault()
    Router.push('/login/register-confirm');
    localStorage.setItem('email', email);
    /*api.sendEmailCode(data)
      .then(res => {
        const data = res.data;
        Router.push('/login/register-confirm');
        localStorage.setItem('email', email);

      })
      .catch(err => {
        if (err.response.data.code == '1005') {
          setValid(true)
        }
        console.log(err.response.data.code);
        console.log(err.response)
      })*/
  }


  const handleResponse = (data) => {
    const fb_token = data.tokenDetail.accessToken;
    AuthService.loginFacebook(fb_token, function (success, err) {
      if (success) {
        fetchUser();
        Router.push('/');
      }
      else {
        console.log(err);
      }
    })
  }
  const loginLine = () => {
    AuthService.loginLine(function (success, err) {
      if (success) {
        fetchUser();
        Router.push('/');
      }
      else {
        console.log(err);
      }
    })
  }

  const responseGoogle = (response) => {
    const gg_token = response.accessToken;
    AuthService.loginGoogle(gg_token, function (success, err) {
      if (success) {
        fetchUser();
        Router.push('/');
      }
      else {
        console.log(err);
      }
    })
  }


  const handleError = (error) => {
    console.log(error);
  }

  return (
    <>
      <div className="cancel-product ">
        <div className="container">
          <img className="img-fluid my-auto on-left" src={'/mobile/image/icon/icon-back.svg'} onClick={() => Router.back()} />
          <h2 className="text-black ">{t("mobile_login:register")} {t("translations:please_email")}</h2>
          <form onSubmit={sendCode}>
            <div className="w-100 clearfix">
              <div className="info-creditcard-100 mt-3 mb-1">
                <input className="effect-16" id="email" name="email" type="text" placeholder="" required />
                <label>{t("mobile_register:email")}<span>*</span></label>
                <span className="focus-border"></span>
              </div>
            </div>
            {
              validform && (
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-error">{t("mobile_register:email_already")}</span>
                </div>
              )
            }
            <div className="mt-2">
              <button className="btn btn-pink-submit h-40px mb-3" type="submit">
                <h4 className="text-white m-auto ">{t("mobile_register:receive")}</h4>
              </button>
            </div>
          </form>


          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <p className="text-black mr-2">{t("mobile_register:already_account")}?</p>
              <Link href={`/login`}>
                <a><p className="text-pink">{t("mobile_register:login")}</p></a>
              </Link>
            </div>


          </div>

          <div className="d-flex justify-content-between">
            <hr className="use-line my-auto w-100"></hr>
            <p className="p-12 my-auto w-100 text-center text-disable">{t("mobile_login:or_login")}</p>
            <hr className="use-line my-auto w-100"></hr>
          </div>

          <FacebookLoginButton appId="816450210506993" handleResponse={handleResponse} />

          <button className="btn btn-google h-40px my-3" onClick={loginLine}><h4 className="text-white m-auto "><img className="img-fluid mr-2" src="/mobile/image/icon/icon-line.svg" />LINE</h4></button>
          <GoogleLogin clientId="518152823288-133gpvb080d8avgc3t60atmsjq70os8a.apps.googleusercontent.com"
            render={renderProps => (
              <button className="btn btn-line h-40px my-3" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                <h4 className="text-white m-auto "><img className="img-fluid mr-2" src="/mobile/image/icon/icon-google-plus.svg" />GOOGLE</h4>
              </button>
            )}
            buttonText="Login" onSuccess={responseGoogle} nonFailure={responseGoogle} cookiePolicy={'single_host_origin'} />

        </div>
      </div>

    </>
  )
}

export default MobileMainRegister