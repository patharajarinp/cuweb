import React, { useEffect, useState } from 'react';
import Loadbutton from '../../../components/mobile/widget/Button';
import api from '../../../utils/api';
import { Link,Router,  withTranslation } from '../../../utils/i18n';
import tools from '../../../utils/tools';

const MobileMainForgetPassword = (props) => {
  const { t, loading, setLodding } = props;
  const [checkmail, setCheckmail] = useState(false);

  const validateEmail = (email) => {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( email );
  }

  const handleForgot = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    var email = document.getElementById('email').value;
    const jsonData = tools.toJson(data);
    setLodding(true);
    api.forgotPassword(jsonData)
    .then(res=>{
      const data = res.data;
      setCheckmail(false);
      Router.push('/login/forget-sendmail?email='+email + '&success=true');
    })
    .catch(err => {
        setLodding(false);
        setCheckmail(true);
        console.log(err.response);
    })
  }

  return (
    <>
      <div className="cancel-product ">
        <div className="container">
          <Link href="/login">
            <img className="img-fluid my-auto on-left" src={'/mobile/image/icon/icon-back.svg'} />
          </Link>
          <form id="reset-form" onSubmit={handleForgot}>
            <h2 className="text-black ">{t("forgot_password")}?</h2>
            <p className="text-black ">{t("please_specify")}</p>

            <div className="info-creditcard-100 mt-3">
              <input className="effect-16" name="email" id="email" type="text" placeholder="" required />
              <label>{t("mobile_translations:email")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            {
              checkmail ? (
                <div>
                  <p className="font-14 text-danger">{t('not_true')}</p>
                </div>
              ) : ""
            }
            
            <div className="pt-5">
              <Loadbutton loading={loading} btntype="submit" name={t('mobile_translations:confirm')} _class="" />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default MobileMainForgetPassword