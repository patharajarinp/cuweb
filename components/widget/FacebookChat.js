import { useEffect } from "react";

const FacebookChat = () => {
  useEffect(() => {
    // Load Facebook Chat SDK script
    var script;
    var script_x;

    const loadFacebookChatSDK = () => {
      script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';


      
      script.onload = initializeChatbox;

      document.body.appendChild(script);
      console.log('appendChild');

      
    };

    // Set chatbox attributes and initialize Facebook SDK
    const initializeChatboxLoad = () => {
      const chatbox = document.getElementById('fb-customer-chat');
      chatbox.setAttribute('page_id', '240453878505');
      chatbox.setAttribute('attribution', 'biz_inbox');
    };
    
    const initializeChatbox = () => {
      initializeChatboxLoad()
      window.fbAsyncInit = function() {
        FB.init({
          xfbml: true,
          version: 'v13.0'
        });
        window.FbInit = true;
      };

      script_x = document.createElement('script');
      script_x.src = 'https://connect.facebook.net/th_TH/sdk/xfbml.customerchat.js';
      script_x.async = true;
      script_x.defer = true;
      document.body.appendChild(script_x);
    };

    loadFacebookChatSDK();
    // initializeChatboxLoad();
    // initializeChatbox();

    return () => {
      delete window.FB;
      if (script) {
        script.remove();
      }
      if (script_x) {
        script_x.remove();
      }
    };

  }, []);

  useEffect(() => {
    // Reinitialize the Facebook SDK and reload chatbox when the component mounts again after navigation
    if (window.FB?.XFBML) {
      window.FB.XFBML.parse();
    }
  });

  return (
    <>
      <div id="fb-root">
        <div id="fb-customer-chat" className="fb-customerchat"></div>
      </div>
    </>
  )
}

export default FacebookChat;