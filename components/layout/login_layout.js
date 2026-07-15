import React, { memo, useContext, useState, useEffect } from 'react';
import Toast from 'react-bootstrap/Toast';
import { FacebookProvider, Login } from 'react-facebook';
import { GoogleLogin } from 'react-google-login';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../utils/AuthService';
import { Link, Router, withTranslation } from '../../utils/i18n';
import tools from '../../utils/tools';
import api from '../../utils/api';
import FacebookLoginButton from '../widget/FacebookLoginButton';


const LoginLayout = memo(props => {
  const { user, handleCart, fetchUser } = useContext(UserContext)
  const [check, setCheck] = useState(false);
  const [isFBLoaded, setIsFBLoaded] = useState(false);
  const [checkCount, setCheckCount] = useState(0)
  const { t, isModal = false } = props;



  const headleLogin = (event) => {
    const data = tools.toJson(new FormData(event.target));
    // ;
    event.preventDefault()
    AuthService.login(data, function (success, err) {
      if (success) {
        fetchUser();
        if (props.loginBy == 'modal') {
          props.closeModal();
        } else {
          Router.push('/');
        }
      }
      else {
        if (!err.response) {
          setCheck('อีเมล หรือ รหัสผ่าน ไม่ถูกต้อง');
        }
        if (err.response.data.code == 1001 || err.response.data.code == 1003) {
          setCheck('อีเมล หรือ รหัสผ่าน ไม่ถูกต้อง');
        }
        console.log(err);
      }
    })
  }

  const responseGoogle = (response) => {
    // console.log(response);
    const gg_token = response.accessToken;
    AuthService.loginGoogle(gg_token, function (success, err) {
      if (success) {
        fetchUser();
        if (props.loginBy == 'modal') {
          props.closeModal();
          location.reload();
        } else {
          Router.push('/');
        }
      }
      else {
        console.log(err);
      }
    })
  }

  const handleResponse = (data) => {

    const fb_token = data.tokenDetail.accessToken;
    AuthService.loginFacebook(fb_token, function (success, err) {
      if (success) {
        fetchUser();
        if (props.loginBy == 'modal') {
          props.closeModal();
          location.reload();
        } else {
          Router.push('/');
        }
      }
      else {
        // facebookFail();
        console.log(err);
      }
    })

  }
  const handlesubmit = (event) => {
    document.getElementById('form-login').click();
    event.preventDefault()
  }

  const [imgPassword, setStateImg] = React.useState(['icon-hide-password.svg'])
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
    console.log(error);
  }

  const loginLine = () => {
    AuthService.loginLine(function (success, err) {
      // console.log(success)
      if (success) {
        fetchUser();
        if (props.loginBy == 'modal') {
          props.closeModal();
          location.reload();
        } else {
          // window.location = '/'
          Router.push('/');
        }
      }
      else {
        console.log(err);
      }
    })
  }

  const [show, setShow] = useState(false);
  const facebookFail = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShow(true)
  }

  return (
    <>
      <div className={!isModal ? `container` : ''}>
        <div className="row mt-5 mb-4">
          <div className="col-12">
            <div className="text-center">
              <h3>{t('welcome')}</h3>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-xxl-10 col-xl-10 col-lg-10 col-md-12 col-12 bg bg-white">
            <div className="row mx-0 justify-content-center">
              <div className="col-xxl-10 col-xl-8 col-lg-10 col-md-10 col-12 px-0 mx-0">
                <div className="row justify-content-center mx-0">
                  <div className="col-xxl-6 col-12">
                    <form id="contact-form" onSubmit={headleLogin}>
                      <div className="form-group">
                        <label>{t('label_email_or_phone')}<span className="text-pink">*</span></label>
                        <input type="text" id="login" className="form-control" name="username" placeholder={t('placeholder_email_or_phone')} required />
                      </div>
                      <div className="form-group">
                        <label>{t('label_password')}<span className="text-pink">*</span></label>
                        <div className="position-relative">
                          <input type="password" id="password" className="form-control" name="password" placeholder={t('character_passwordfill')} title="ต้องมีทั้งตัวเลข ตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก อย่างน้อย 6 ตัว และ สูงสุด 16 ตัว" minLength="6" maxLength="16" required />
                          <label className="font-14">{t('placeholder_password')}</label>
                          <img src={`${api.frontend_url}/icon/${imgPassword}`} id="toggle-password" alt="" className="toggle-password" onClick={handlePassword} />
                        </div>
                      </div>
                      {
                        check && (
                          <div className="form-group mb-0 font-14">
                            <span className="text-danger">{check}</span>
                          </div>
                        )

                      }
                      <input type="submit" name="form-login" id="form-login" className="d-none" value="Log In" />
                      <div className="form-group mt-4">
                        <div>
                          <button className="btn btn-primary w-100" type="submit" >
                            {t('btn_login')}
                          </button>
                        </div>
                      </div>
                    </form>
                    <div className="form-group">
                      <div className="d-inline-block w-100">
                        <label>{t('or_login_with')}</label>
                        <div className="pt-2">
                          {/* <FacebookProvider appId="816450210506993">
                        <Login scope="email" onCompleted={handleResponse} onError={handleError}>
                          {({ loading, handleClick, error, data }) => (
                            <button className="btn btn-facebook" id="btn-fb-login" onClick={handleClick}>
                              <img src={`${api.frontend_url}/icon/facebook.svg`} alt="" className="" /> FACEBOOK
                            </button>
                          )}
                        </Login>
                      </FacebookProvider> */}

                          <FacebookLoginButton appId="816450210506993" handleResponse={handleResponse} />
                          {/* <button className="btn btn-facebook" id="btn-fb-login" >
                          <img src={`${api.frontend_url}/icon/facebook.svg`} alt="" className="" /> FACEBOOK
                        </button> */}
                        </div>
                      </div>
                    </div>
                    {/* <div className="form-group">
                    <div className="d-inline-block w-50 pr-2">
                      <GoogleLogin clientId="518152823288-133gpvb080d8avgc3t60atmsjq70os8a.apps.googleusercontent.com"
                        render={renderProps => (
                          <button className="btn btn-google" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                          <img src={`${api.frontend_url}/icon/google-plus.svg`} alt="" className="" /> GOOGLE
                          </button>
                        )}
                      buttonText="Login" onSuccess={responseGoogle}nonFailure={responseGoogle} cookiePolicy={'single_host_origin'} />
                    </div>
                    <div className="d-inline-block w-50 pl-2">
                      <button type="button" className="btn btn-line"  onClick={loginLine}>
                      <img src={`${api.frontend_url}/icon/line.svg`} alt="" className="" /> LINE
                      </button>
                    </div>
                  </div> */}
                    <div className="form-group">
                      <div className="float-left">
                        <label>
                          {t('new_member')}
                          <Link href={'/register'} as={`/register`} >
                            <a className="text-success"> {t('register')} </a>
                          </Link>
                          {t('here')}
                        </label>
                      </div>
                      <div className="float-right">
                        <Link href={'/user/forgot-password'} as={`/user/forgot-password`} >
                          <a>{t('forgot_password')}</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="end-page"></div>
      <Toast onClose={() => setShow(false)} show={show} delay={4000} autohide>
        <Toast.Body>
          <i className="fas fa-exclamation-triangle"></i>
          <p className="mb-0 text-danger">{t('facebook_fail')}</p>
          <p className="mb-0">{t('facebook_text')}</p>
        </Toast.Body>
      </Toast>
    </>
  )
})

export default withTranslation('login')(LoginLayout)
