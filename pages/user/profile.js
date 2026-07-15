import React from 'react';
import Layout from '../../components/layout';
import MobileProfile from '../../components/user/mobile/profile/MobileProfile';
import MainProfile from '../../components/user/profile/MainProfile';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from '../../utils/i18n';


const Profile = (props) => {
  const {t} = props;
  
  const isMobile = useMediaQuery(992);
  
  return (
 
  <Layout title="User | Profile" isFooter={false} >
    {
      !isMobile ? (
        <MainProfile t={t} />             
      ) : (
        <MobileProfile t={t} />             
      )
    }
  </Layout>
)}
export default  withTranslation(['profile'])(Profile)