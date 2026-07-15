import {withTranslation} from '../../utils/i18n';
import CookieConsent from "react-cookie-consent";
const Cookies = (props) =>{
	const {t} = props
 	return(
 	  <CookieConsent
 	     location="bottom"
 	     buttonText={t("confirm")}
 	     cookieName="AcceptCookie"
 	     buttonClasses="btn button-accept"
 	     expires={150}
 	     enableDeclineButton
 	     declineButtonText={t("reject")}
 	     declineButtonClasses="btn decline-button"
 	   > 
 	   <p className="m-0" style={{fontWeight:400}}>{t("cookies")}<br/>
 	     {t("cookiess")}</p>
 	 	</CookieConsent>
  )
}

export default withTranslation(['translations'])(Cookies)
