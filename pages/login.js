import Router from 'next/router'
import { useState,useEffect } from 'react'
import Layout from '../components/layout'
import LoginLayoutDestop from '../components/layout/login_layout'
import LoginLayouMobile from '../components/mobile/login/LoginLayoutMobile'
import AuthService from '../utils/AuthService'
import { withTranslation } from '../utils/i18n'
import Head from 'next/head';
import useWindowSize from '../hooks/useWindowSize'
import useMediaQuery from '../hooks/useMediaQuery'


const LoginScreen = (props) => {
  const { t } = props;
  const [loading, setLodding] = useState(true);
  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
    // document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    if(AuthService.isLoggin() != null){
      setLodding(false);
      Router.push('/')
    }else{
      setLodding(false);
    }
  },[]);

  const isMobile = useMediaQuery(992);
  
  return (
  <Layout loading={loading} title={"กรุณาเข้าสู่ระบบ (Login) | ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย"}>
    <Head>
      <meta name="description" content={`ท่านสามารถเข้าเยี่ยมชมเว็บไซต์ www.chulabook.com ได้ เพื่อการค้นหาสินค้าและบริการต่างๆและยินดีต้อนรับเข้าสู่ศูนย์หนังสือจุฬาฯ กรุณาเข้าสู่ระบบ (Login)`} />
      <meta name="keywords" content={`chulabook login,เข้าสู่ระบบ,ศูนย์หนังสือจุฬา,chulabook,cubook`} />
    </Head>
   
    {
      !isMobile ? (
        <LoginLayoutDestop t={t} key={'desktop'} />
      ) : (
        <LoginLayouMobile t={t} key={'mobile'} />
      )
    }
    
    
    
  </Layout>
)}


export default withTranslation('login', 'mobile_login')(LoginScreen)
