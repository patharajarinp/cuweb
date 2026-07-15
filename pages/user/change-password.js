import React, { useEffect } from 'react'
import Layout from '../../components/layout'
import MobileMainChangePassword from '../../components/mobile/user/MobileMainChangePassword'
import MainChangePassword from '../../components/user/MainChangePassword'
import useMediaQuery from '../../hooks/useMediaQuery'
import { withTranslation } from '../../utils/i18n'


const ChangePass = (props) => {
  const {t} = props;
  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
    
  },[]);

  const isMobile = useMediaQuery(992);

  
  return (
  <Layout className="mb-5" title="User | Change Password">
    {
      !isMobile ? (
        <MainChangePassword t={t} />
      ) : (
        <MobileMainChangePassword t={t} />
      )
    }
  </Layout>
)}

export default withTranslation(['translations', 'mobile_translations'])(ChangePass)
