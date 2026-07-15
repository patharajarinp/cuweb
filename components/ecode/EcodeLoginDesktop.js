import api from "../../utils/api";
import { Link, withTranslation } from "../../utils/i18n";
const EcodeLoginDesktop = ({ t, headleLogin, imgPassword, handlePassword, check, Toast, show, linkPath }) => {
  return (
    <>
      <div className="container">
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
                      <div className="float-left">
                        <label>
                          {t('new_member')}
                          <Link href={{
                            pathname: '/ecode/register_ecode',
                            query: { name: linkPath.name }
                          }} >
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


}
export default withTranslation('login')(EcodeLoginDesktop)