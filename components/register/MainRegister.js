import React, { useContext, useEffect, useRef, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import { FacebookProvider, Login } from 'react-facebook';
import { GoogleLogin } from 'react-google-login';
import Layout from '../../components/layout';
import UserContext from '../../contexts/UserContext';
import api from '../../utils/api';
import AuthService from '../../utils/AuthService';
import { Link, Router, withTranslation } from '../../utils/i18n';
import tools from '../../utils/tools';
import Head from 'next/head';
import FacebookLoginButton from '../../components/widget/FacebookLoginButton';

const MainRegister = (props) => {
  const { t, setLodding } = props;

  const { user, handleCart, fetchUser } = useContext(UserContext)
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [checkemail, setCheckemail] = useState(false);
  const [sendmail, setSendmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  var set;

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(
    () => {
      // Your custom logic here
      setCount(count - 1);
      setIsRunning(!count == 0);
    },
    isRunning ? delay : null
  );

  const countDown = () => {
    sendCode();
    setCount(59);
    setIsRunning(true);
  }

  useEffect(() => {
    if (document.getElementsByClassName('main-layout')[0]) {
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  }, []);

  React.useEffect(() => {
    if (AuthService.isLoggin()) {
      setLodding(false);
      Router.push('/')
    } else {
      setLodding(false);
      setDate();
      // setSlide();  
    }
    return clearInterval(set);
  }, []);
  const responseGoogle = (response) => {
    // console.log(response);
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

  const handleResponse = (data) => {

    const fb_token = data.tokenDetail.accessToken;
    AuthService.loginFacebook(fb_token, function (success, err) {
      if (success) {
        fetchUser();
        Router.push('/');
      }
      else {
        // facebookFail();
        console.log(err);
      }
    })

  }

  const loginLine = () => {
    AuthService.loginLine(function (success, err) {
      // console.log(success)
      if (success) {
        fetchUser();
        Router.push('/');
      }
      else {
        console.log(err);
      }
    })
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

  const setDate = () => {
    //Day Value
    var textDay = "";
    var i;
    for (i = 1; i <= 31; i++) {
      if (i < 10) {
        i = '0' + i;
      }
      textDay += '<option value="' + i + '">' + i + '</option><br>';
    }
    document.getElementById("day").innerHTML = textDay;

    var textYear = "";
    var i;
    for (i = 2547; i >= 2400; i--) {
      textYear += '<option value="' + i + '">' + i + '</option><br>';
    }
    document.getElementById("year").innerHTML = textYear;
  }


  const sendCode = () => {
    var email = document.getElementById('email').value;
    const data = { email: email }
    event.preventDefault()

    api.sendEmailCode(data)
      .then(res => {
        const data = res.data;
        // 
        setCheck1(false);
      })
      .catch(err => {
        if (err.response.data.code == 1005) {
          setCheck1(true);
          setIsRunning(false);
        }
        console.log(err.response)
      })
  }

  const validateEmail = (email) => {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(email);
  }

  //bank
  const chkcode = () => {

    var email = document.getElementById('email').value;
    var validate = validateEmail(email);
    if (email == '' || validate == false) {
      setSendmail(false);
      setCheckemail(true);
    } else {
      const data = { email: email }
      api.sendEmailCode(data)
        .then(res => {
          const data = res.data;
          setSendmail(true);
          setCheck1(false);
          setCheckemail(false);
        })
        .catch(err => {
          if (err.response.data.code == 1005) {
            setSendmail(false);
            setCheck1(true);
            setCheckemail(false);
          }
          console.log(err.response)
        })
    }
  }



  const headleRegister = (event) => {

    const data = new FormData(event.target)
    event.preventDefault()

    const jsonData = tools.toJson(data);
    api.register(jsonData)
      .then(res => {
        const data = res.data;
        // ;
        AuthService.setToken(data.token)
        AuthService.setProfile(data.user);

        localStorage?.removeItem('user')
        setProfile()
        fetchUser();
        setCheck1(false);
        setIsSubmitting(false);
        Router.push('/')

      })
      .catch(err => {
        setIsSubmitting(false);
        if (err.response.data.code == 1002) {
          setCheck2(true);
        }
        if (err.response.data.code == 1005) {
          setCheck1(true);
        }
        console.log(err.response);
      })

  }

  const [chValidate, setchValidate] = useState("");
  const [chError, setchError] = useState("");
  const handleUsernameChange = (e) => {
    const target = e.target;
    setchValidate(target.value);
    setchError(target.validationMessage)

  }


  const [show, setShow] = useState(false);
  const facebookFail = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShow(true)
  }

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const txt = localStorage?.getItem('user')
    setProfile(JSON.parse(txt))
  }, [])
  return (
    <>
      <div className="container">
        <div className="row mt-5 mb-4">
          <div className="col-12">
            <div className="text-center">
              <h3>{t('create_account')}</h3>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-xxl-10 col-xl-8 col-lg-10 col-md-10 col-12 bg bg-white">

            <div className="row mx-0 justify-content-center">
              <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-10 col-12 px-0 mx-0">
                {/* <input type="text"/> */}
                <form id="register-form" onSubmit={headleRegister}>

                  <input type="hidden" name="social_id" value={profile?.social_id} />
                  <input type="hidden" name="picture" value={profile?.picture} />
                  <input type="hidden" name="provider" value={profile?.provider} />
                  {profile?.provider == "line" ? <input type="hidden" name="line_code" value={profile?.access_token} /> :
                    <input type="hidden" name="access_token" value={profile?.access_token} />}

                  <div className="row">
                    <div className="col-lg-6 col-12 mx-0">
                      <div className="col-12">
                        <div className="form-group mb-4">
                          <label>{t('name')}<span className="text-pink">*</span></label>
                          <input type="text" id="firstname" className="form-control"
                            name="firstname" defaultValue={profile?.firstname}
                            pattern="[A-Za-zก-๏\s]+" title='ตัวอักษร ก-ฮ เเละ A-Z ทั้งพิมพ์เล็กเเละใหญ่' placeholder={t('name')} spellcheck="true" required />
                        </div>
                        <div className="form-group mb-4">
                          <label>{t('surname')}<span className="text-pink">*</span></label>
                          <input type="text" id="lastname" className="form-control"
                            name="lastname" defaultValue={profile?.lastname}
                            pattern="[A-Za-zก-๏\s]+" title='ตัวอักษร ก-ฮ เเละ A-Z ทั้งพิมพ์เล็กเเละใหญ่' placeholder={t('surname')} required />
                        </div>
                        <div className="form-group mb-4">
                          <label>{t('birthday')}<span className="text-pink">*</span></label>
                          <div>
                            <div className="styleSelect input-day">
                              <div className="d-block position-relative">
                                <select className="form-control border-radius-right-none" name="day" id="day">
                                </select>
                                <img src={`${api.frontend_url}/icon/icon-arrow-down.svg`} className="select-icon" />
                              </div>
                            </div>
                            <div className="styleSelect input-month">
                              <div className="d-block position-relative">
                                <select className="form-control border-radius-none" name="month" id="month">
                                  <option value="1">{t('january')}</option>
                                  <option value="2">{t('february')}</option>
                                  <option value="3">{t('march')}</option>
                                  <option value="4">{t('april')}</option>
                                  <option value="5">{t('may')}</option>
                                  <option value="6">{t('june')}</option>
                                  <option value="7">{t('july')}</option>
                                  <option value="8">{t('august')}</option>
                                  <option value="9">{t('september')}</option>
                                  <option value="10">{t('october')}</option>
                                  <option value="11">{t('november')}</option>
                                  <option value="12">{t('december')}</option>
                                </select>
                                <img src={`${api.frontend_url}/icon/icon-arrow-down.svg`} className="select-icon" />
                              </div>
                            </div>
                            <div className="styleSelect input-year">
                              <div className="d-block position-relative">
                                <select className="form-control border-radius-left-none" name="year" id="year">
                                </select>
                                <img src={`${api.frontend_url}/icon/icon-arrow-down.svg`} className="select-icon" />
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                      <div className="col-12">
                      <div className="form-group mb-4">
                          <label>{t('phone_number')}<span className="text-pink">*</span></label>
                          <input type="tel" id="phone" className="form-control" name="phone" defaultValue={profile?.phone}
                            placeholder={t('please_phone_number')} maxLength={12} required />
                        </div>
                        <div className="form-group mb-4">
                          <label>{t('email')}<span className="text-pink">*</span></label>
                          <input type="email" id="email" className="form-control" name="email" defaultValue={profile?.email}
                            placeholder={t('enter_your_email')} required />
                        </div>
                        {
                          checkemail && (
                            <div className="fail-email-register">
                              <span className="text-danger">{t('valid_email')}</span>
                            </div>
                          )
                        }
                        {
                          check1 && (
                            <div className="fail-email-register">
                              <span className="text-danger">{t('this_email_already_exists')}</span>
                            </div>
                          )
                        }
                        {
                          sendmail ? (
                            <div id="verfication">
                              <div className="form-group mb-4">
                                <label>{t('password_email')}<span className="text-pink">*</span></label>
                                <div className="position-relative">
                                  <input type="text" id="code" className="form-control" name="code" defaultValue="" placeholder={t('six_number')} minLength="6" maxLength="6" pattern="[0-9]*" required />
                                  {
                                    isRunning ? (
                                      <button type="button" className="btn-resend" id="btn-resend"><span id="resend-sec">{count % 60}</span></button>
                                    ) : (
                                      <button type="button" className="btn-resend" id="btn-resend" onClick={countDown} >{t('resend')}</button>
                                    )
                                  }

                                </div>
                              </div>
                              {
                                check2 && (
                                  <div className="fail-email-register">
                                    <span className="text-danger">{t('please_enter_digits')}</span>
                                  </div>
                                )
                              }
                            </div>
                          ) : (
                            <div id="silde-check">
                              <div className="margin-top-58px mb-4">
                                <div>
                                  <button type="button" className="btn btn-outline-primary min-38 w-100 " onClick={chkcode}>{t('confirm_email')}</button>
                                </div>
                              </div>
                            </div>
                          )
                        }


                        <div className="form-group mb-4">
                          <label>{t('password')}<span className="text-pink">*</span></label>
                          <div className="position-relative">
                            <input type="password" id="password" className="form-control" name="password" placeholder={t('character_passwordfill')} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" title="ต้องมีทั้งตัวเลข ตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก อย่างน้อย 6 ตัว และ สูงสุด 16 ตัว" minLength="6" maxLength="16" required />
                            <label className="font-14">{t('character_password')}</label>
                            <img src={`${api.frontend_url}/icon/${imgPassword}`} id="toggle-password" alt="" className="toggle-password" onClick={handlePassword} />
                          </div>
                        </div>

                      </div>

                      <div className="row justify-content-center px-0 mx-0">
                        <div className="col-5">
                          <div className="form-group mt-4">
                            <div>
                              <button className="btn btn-login" type="submit" disabled={isSubmitting} >
                                {t('sign_up')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6 col-12 mx-0 mt-4 border-left-register d-flex align-items-center justify-content-center text-center">
                      <div className="col-12 ">
                        <div className="form-group">
                          <label>
                            {t('already_member')}
                            <Link href={'/login'} as={`/login`} >
                              <a className="text-success"> {t('login')} </a>
                            </Link>
                            {t('here')} {t('or_sign_up_with')}
                          </label>
                        </div>
                        <div className="form-group d-none d-lg-block ">
                          <div className="d-inline-block col-lg-12 col-12  pl-0 pr-0  mt-3">

                            <FacebookLoginButton appId="816450210506993" handleResponse={handleResponse} />
                          </div>
                          {/* <div className="d-inline-block col-lg-12 col-12  px-0  mt-3">
                            <GoogleLogin clientId="518152823288-133gpvb080d8avgc3t60atmsjq70os8a.apps.googleusercontent.com"
                              render={renderProps => (
                                <button className="btn btn-google" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                  <img src={`${api.frontend_url}/icon/google-plus.svg`} alt="" className="" /> GOOGLE
                          </button>
                              )}
                              buttonText="Login" onSuccess={responseGoogle} nonFailure={responseGoogle} cookiePolicy={'single_host_origin'} />
                          </div>
                          <div className="d-inline-block col-lg-12 col-12  pr-lg-0 pl-0 pr-0  mt-3">
                            <button type="button" className="btn btn-line" onClick={loginLine}>
                              <img src={`${api.frontend_url}/icon/line.svg`} alt="" className="" /> LINE
                            </button>
                          </div> */}
                        </div>
                        <div className="d-block d-lg-none">
                          <div className="form-group">
                            <div className="d-inline-block w-100">
                              <div>

                                <FacebookLoginButton appId="816450210506993" handleResponse={handleResponse} />
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="d-inline-block w-50 pr-2">
                              <GoogleLogin clientId="518152823288-133gpvb080d8avgc3t60atmsjq70os8a.apps.googleusercontent.com"
                                render={renderProps => (
                                  <button className="btn btn-google" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                    <img src={`${api.frontend_url}/icon/google-plus.svg`} alt="" className="" /> GOOGLE
                                  </button>
                                )}
                                buttonText="Login" onSuccess={responseGoogle} nonFailure={responseGoogle} cookiePolicy={'single_host_origin'} />
                            </div>
                            <div className="d-inline-block w-50 pl-2">
                              <button type="button" className="btn btn-line" onClick={loginLine}>
                                <img src={`${api.frontend_url}/icon/line.svg`} alt="" className="" /> LINE
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="row px-0 mx-0 mt-2">
                          <div className="col-12">
                            <div className="form-group pt-1 mb-0">
                              <div className="agree-lable">
                                <p className="mb-0">
                                  {t('privacy_polocy_clicking')} <Link href="/privacy_policy/privacy_policy"><a className="text-success"><u>{t('privacy_polocy_condition')}</u></a></Link>
                                </p>
                              </div>
                            </div>
                          </div>
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
      <Toast onClose={() => setShow(false)} show={show} delay={4000} autohide>
        <Toast.Body>
          <i className="fas fa-exclamation-triangle"></i>
          <p className="mb-0 text-danger">{t('facebook_fail')}</p>
          <p className="mb-0">{t('facebook_text')}</p>
        </Toast.Body>
      </Toast>
      <div className="end-page"></div>

    </>
  )
}

export default MainRegister