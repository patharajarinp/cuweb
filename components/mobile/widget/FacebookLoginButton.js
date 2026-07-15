const { useState, useEffect } = require("react");
import api from '../../../utils/api'

const FacebookLoginButton = (props) =>{
  const [isFBLoaded,setIsFBLoaded] = useState(false);
  const [checkCount,setCheckCount] = useState(0)
  useEffect(()=>{
    window.fbAsyncInit = function() {
        window.FB.init({
            appId      : '215297538010306',
            xfbml      : true,
            version    : 'v11.0'
          });
        window.FB.AppEvents.logPageView();
      };
  
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    
  },[])
  useEffect(() => {
    
    // const loginButton = document.getElementById('btn-fb-login')
    // if(!window){
    //   return;
    // }
    // if(!loginButton || !window.FB){
    //   return;
    // }
    function checkFbScript(){
      // console.log(window?.FB)
      if(!window?.FB || checkCount >= 5){
        setCheckCount(checkCount + 1)
        return;
        
      } 
      setIsFBLoaded(true)
      clearInterval(checkFbScript)
    }
    setInterval(checkFbScript , 100)
    return () => {
      clearInterval(checkFbScript)
    };
  },[]);

  useEffect(() => {
    
    if(!isFBLoaded) return;
    const loginButton = document.getElementById('btn-fb-login')
    if(!loginButton ){
      return;
    }

    const onClickButton = function(){
      
      FB.init({
        appId : props.appId,
        xfbml            : true,
        version          : 'v13.0'
      });
      
      // FB.login(props?.handleResponse);
      FB.login(response => {
        console.log('FB response',response)
        console.log('FB response authResponse',response?.authResponse)
        if(response?.authResponse)
          props?.handleResponse({tokenDetail : response?.authResponse})
      }, {scope: 'email,public_profile'});
    }
    // console.log(FB)
    loginButton.addEventListener("click", onClickButton);
    return () => {
      loginButton.removeEventListener('click',onClickButton)
    };

    console.log('FB ready')
  },[isFBLoaded])

  if(!props.appId){
    console.log('FacebookLoginButton : No AppId provided')
  }
  return (
    <button className="btn btn-facebook" id="btn-fb-login" type="button" >
      <img src={`${api.frontend_url}/icon/facebook.svg`} alt="" className="mr-2" />FACEBOOK
    </button>
  )
}

export default FacebookLoginButton;