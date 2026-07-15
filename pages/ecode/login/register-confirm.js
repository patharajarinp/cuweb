// import Link from 'next/link';
// import Router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../../components/layout';
import api from '../../../utils/api';
import { Link, Router, withTranslation } from '../../../utils/i18n';

const register_confirm = (props) => {
  const [validform, setValid] = useState(false);
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const { t } = props;
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

  useEffect(() => {
    var formemail = localStorage.getItem('email');
    var email = document.getElementById('email').value = formemail;
  }, []);

  const checkCode = () => {
    // var email = document.getElementById('email').value;
    const data = new FormData(event.target)

    //data.append("password",event.target.code.value);
    event.preventDefault()
    api.checkCode(data)
      .then(res => {
        const data = res.data;
        Router.push('/login/register-fill-info');

      })
      .catch(err => {
        if (err.response.data.code == '1002') {
          setValid(true)
        }
        console.log(err.response.data.code);
        console.log(err.response)
      })
  }

  const sendCode = () => {
    var email = document.getElementById('email').value;
    const data = { email: email }
    event.preventDefault()
    api.sendEmailCode(data)
      .then(res => {
        const data = res.data;
      })
      .catch(err => {
        console.log(err.response)
      })
  }

  const countDown = () => {
    setCount(59);
    setIsRunning(true);
    sendCode();
  }
  return (
    <Layout className="mb-5" title={'สร้างบัญชี (register) | ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย'}>
      <div className="cancel-product ">

        <div className="container">
          <form onSubmit={checkCode}>
            <Link href="/login">
              <img className="img-fluid my-auto on-left" src={'/mobile/image/icon/icon-back.svg'} />
            </Link>
            <h2 className="text-black ">{t("mobile_login:register")} {t("mobile_translations:please_email")}</h2>
            <div className="w-100 clearfix">
              <div className="info-creditcard-100 mt-3 mb-1">
                <input className="effect-16" name="email" id="email" type="text" placeholder="" required />
                <label>{t('email')}<span>*</span></label>
                <span className="focus-border"></span>
              </div>
              <div className="info-creditcard-100 mt-4 mb-3">
                <input className="effect-16 w-100 pr-2" name="code" type="text" pattern="[0-9]*" minLength="6" maxLength="6" placeholder="" required />
                <label>{t('password_confirm_email')}<span>*</span></label>
                {
                  isRunning ? (
                    <h4 className="text-pink w-25 text-right btn-right-input">{count % 60}</h4>
                  ) : (
                    <h4 className="text-pink w-25 text-right btn-right-input" onClick={countDown}>{t('resend')}</h4>
                  )
                }

                <span className="focus-border"></span>
              </div>
            </div>



            {
              validform && (
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-error">{t('email_codeincorect')}</span>
                </div>
              )
            }
            <div className="mt-2">
              <button type="submit" className="btn btn-pink-submit h-40px mb-3"><h4 className="text-white m-auto ">{t('mobile_translations:confirm')}</h4></button>
            </div>

          </form>
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <p className="text-black mr-2">{t('already_account')}?</p>
              <Link href={`/login`}>
                <a><p className="text-pink">{t('login')}</p></a>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}

export default withTranslation('mobile_register')(register_confirm);