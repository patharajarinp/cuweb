import Navcontactus from '../../../components/mobile/NavContactus';
import api from '../../../utils/api';
import { Router, withTranslation } from '../../../utils/i18n';

const MobileMainContact = (props) => {
  const {t, setLodding, loading} = props;
  const handleSave = (event) => {
    var data = new FormData(event.target)
    event.preventDefault();
    api.sendContact(data)
    .then(res => {
      const data = res.data;
      alert(t("successful"));
      Router.push('/');
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  
  return (
    <>
      <Navcontactus activeSlideNav="tab1">
        <div className="container">
          <form id="promo-form" onSubmit={handleSave} encType="multipart/form-data">
            <p>{t("more_information")}</p>
            <div className="info-creditcard-100 mt-4 mb-3">
              <input className="effect-16 " type="text" name="name" placeholder="" required />
              <label>{t("mobile_translations:name_surname")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="info-creditcard-100 mt-4 mb-3">
              <input className="effect-16 " name="email" type="text" placeholder="" required />
              <label>{t("mobile_translations:email")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="info-creditcard-100 mt-4 mb-3">
              <input className="effect-16 " name="phone" type="text" placeholder="" required />
              <label>{t("mobile_translations:phone_number")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="info-creditcard-100 mt-4 mb-3">
              <input className="effect-16 " name="address" type="text" placeholder="" required />
              <label>{t("mobile_translations:address")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="info-creditcard-100 mt-4 mb-3">
              <input className="effect-16 " name="subject" type="text" placeholder="" required />
              <label>{t("heading")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="info-creditcard-100 mt-4 mb-4">
              <input className="effect-16 " name="detail" type="text" placeholder="" required />
              <label>{t("details")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="mt-3 pt-2">
              <button type="submit" className="btn btn-pink-submit h-40px mt-5 mb-3"><h4 className="text-white m-auto ">{t("mobile_translations:send")}</h4></button>
            </div>
          </form>
        </div>
      </Navcontactus>
    </>
  )
}
export default MobileMainContact