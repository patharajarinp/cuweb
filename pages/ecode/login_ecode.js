import React, { memo, useContext, useState, useEffect } from 'react';
import Toast from 'react-bootstrap/Toast';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../utils/AuthService';
import { Link, Router, withTranslation } from '../../utils/i18n';
import tools from '../../utils/tools';
import EcodeLoginDesktop from '../../components/ecode/EcodeLoginDesktop'
import EcodeLoginMobile from '../../components/ecode/EcodeLoginMobile'
import useMediaQuery from '../../hooks/useMediaQuery';
import LayoutEcode from '../../components/ecode/LayoutEcode';
import { route } from 'next/dist/next-server/server/router';
import { useRouter } from 'next/router';

const LoginLayoutEcode = memo(props => {
  const { fetchUser } = useContext(UserContext)
  const [check, setCheck] = useState(false);
  const { t, isModal = false } = props;
  const isMobile = useMediaQuery(992);
  const router = useRouter();
  const linkPath = router.query;

  

  

  const headleLogin = (event) => {
    const data = tools.toJson(new FormData(event.target));
    event.preventDefault()
    AuthService.login(data, function (success, err) {
      if (success) {
        fetchUser();
        if (props.loginBy == 'modal') {
          props.closeModal();
        } else {
          window.location.replace(linkPath.name);
          // Router.push(linkPath.name);
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


  // console.log(linkPath.name);


  return (
    <LayoutEcode>

      {
        isMobile ? <EcodeLoginMobile t={t} headleLogin={headleLogin} imgPassword={imgPassword} handlePassword={handlePassword} check={check} Toast={Toast} show={show} /> :


          <EcodeLoginDesktop t={t} headleLogin={headleLogin} imgPassword={imgPassword} handlePassword={handlePassword} check={check} Toast={Toast} show={show} linkPath={linkPath} />

      }
    </LayoutEcode>

  )
})

export default withTranslation('login')(LoginLayoutEcode)
