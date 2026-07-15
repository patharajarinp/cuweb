import Router, { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { FacebookProvider, Login } from 'react-facebook';
import { GoogleLogin } from 'react-google-login';
import FacebookLoginButton from '../../../components/widget/FacebookLoginButton';
import UserContext from '../../../contexts/UserContext';
import AuthService from '../../../utils/AuthService';
import { Link, withTranslation } from '../../../utils/i18n';

const LoginLayoutMobile = (props) => {
  const [isPasswordShow, setisPasswordShow] = useState(false);
  const togglePasswordVisiblity = () => setisPasswordShow(!isPasswordShow);
  const { user, handleCart, fetchUser } = useContext(UserContext)
  const { t } = props;
  const router = useRouter()
  const { redirect } = router.query;
  const [checkLogin, setCheckLogin] = useState(false);


  const headleLogin = (event) => {
    const data = new FormData(event.target);
    ;
    event.preventDefault()
    AuthService.login(data, function (success, err) {
      if (success) {
        fetchUser();
        if (redirect) {
          window.location = redirect;
          // Router.push(redirect);
        } else {
          Router.push('/');
        }

      }
      else {
        setCheckLogin('อีเมล หรือ รหัสผ่าน ไม่ถูกต้อง')
        console.log(err);
      }
    })
  }

  const handleResponse = (data) => {

    const fb_token = data.tokenDetail.accessToken;
    AuthService.loginFacebook(fb_token, function (success, err) {
      if (success) {
        fetchUser();
        if (redirect) {
          window.location = redirect;
          // Router.push(redirect);
        } else {
          Router.push('/');
        }
      }
      else {
        console.log(err);
      }
    })
  }

  const loginLine = () => {
    AuthService.loginLine(function (success, err) {
      if (success) {
        // fetchUser();
        if (redirect) {
          window.location = redirect;
          // Router.push(redirect);
        } else {
          Router.push('/');
          // window.location = '/'
        }
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
        if (redirect) {
          window.location = redirect;
          // Router.push(redirect);
        } else {
          Router.push('/');
        }
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
        <Link href='/'>

          <a className="btn-close-left" ></a>
        </Link>
        <div className="container">
          <h2 className="text-black ">{t("mobile_login:welcome")}</h2>
          <form id="contact-form" onSubmit={headleLogin}>
            <div className="information-list-link border-0" >
              <div className="input-for-edit pr-2">
                <input type="text" className="input_mobile" name="username" placeholder={`${t("mobile_translations:phone_number")} / ${t("mobile_translations:email")}`} required />
                <span className="input-border"></span>
              </div>
            </div>
            <div className="information-list-link border-0" >
              <div className="input-for-edit pr-2">
                <input type={isPasswordShow ? "text" : "password"} minLength="6" name="password" className="input_mobile" placeholder={t("mobile_register:password")} required />
                <i className={isPasswordShow ? "fas fa-eye fa-flip-horizontal text-gray my-auto" : "fas fa-eye-slash fa-flip-horizontal text-pink my-auto"} onClick={togglePasswordVisiblity}></i>
                <span className="input-border"></span>
              </div>
            </div>
            <button className="btn btn-pink-submit h-40px my-3" type="submit"><h4 className="text-white m-auto ">{t("mobile_login:login")}</h4></button>
          </form>
          {
            checkLogin && (
              <div className="form-group mb-0 font-14">
                <span className="text-danger">{checkLogin}</span>
              </div>
            )

          }
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <p className="text-black mr-2">{t("mobile_login:not_account")}</p>
              <Link href="/register">
                <a><p className="text-pink">{t("mobile_login:register")}</p></a>
              </Link>
            </div>
            <Link href="/user/forgot-password">
              <a><p className="text-red">{t("mobile_login:forgot_password")}?</p></a>
            </Link>

          </div>
          <div className="d-flex justify-content-between">
            <hr className="use-line my-auto w-100"></hr>
            <p className="p-12 my-auto w-100 text-center text-disable">{t("mobile_login:or_login")}</p>
            <hr className="use-line my-auto w-100"></hr>
          </div>
          {/* <FacebookProvider appId="816450210506993">
            <Login scope="email" onCompleted={handleResponse} onError={handleError}>
              {
                ({ loading, handleClick, error, data }) => (
                  <button className="btn btn-facebook h-40px my-3" onClick={handleClick}>
                    <h4 className="text-white m-auto ">
                      <img className="img-fluid mr-2" src="/mobile/image/icon/icon-facebook-login.svg" />
                      FACEBOOK
                        </h4>
                  </button>
                )
              }
            </Login>
          </FacebookProvider> */}
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

export default LoginLayoutMobile