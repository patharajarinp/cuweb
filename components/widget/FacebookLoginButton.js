const { useState, useEffect } = require("react");
import api from '../../utils/api'

const FacebookLoginButton = (props) =>{
  const [isFBLoaded, setIsFBLoaded] = useState(false);

  useEffect(() => {
    function loadFacebookSDK() {
      // Load the Facebook SDK asynchronously
      window.fbAsyncInit = function () {
        FB.init({
          appId: props.appId,
          xfbml: true,
          version: 'v13.0'
        });
        setIsFBLoaded(true);
      };

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      document.body.appendChild(script);
    }

    loadFacebookSDK();
  }, [props.appId]);

  const handleButtonClick = () => {
    FB.login(response => {
      console.log('FB response', response);
      console.log('FB response authResponse', response?.authResponse);
      if (response?.authResponse) {
        props?.handleResponse({ tokenDetail: response?.authResponse });
      }
    }, { scope: 'email,public_profile' });
  };

  if(!props.appId){
    console.log('FacebookLoginButton : No AppId provided')
  }
  return (
    <button className="btn btn-facebook" id="btn-fb-login" type="button" onClick={handleButtonClick}>
      <img src={`${api.frontend_url}/icon/facebook.svg`} alt="" className="" /> FACEBOOK
    </button>
  )
}

export default FacebookLoginButton;