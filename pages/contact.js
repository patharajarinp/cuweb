import React, { useState } from 'react'
import MainContact from '../components/contact/MainContact';
import Layout from '../components/layout'
import MobileMainContact from '../components/mobile/contact/MobileMainContact';
import useMediaQuery from '../hooks/useMediaQuery';
import { Link, withTranslation } from '../utils/i18n';

const ContactUs = (props) =>{
  const {t} = props;
  const [loading, setLodding] = useState(false);

  const isMobile = useMediaQuery(992);
   
  return (
    <Layout title="ติดต่อเรา | ศูนย์หนังสือจุฬาฯ" loading={loading}>
      {
        !isMobile ? (
          <MainContact t={t} loading={loading} setLodding={setLodding} />
        ) : (
          <MobileMainContact t={t}  loading={loading} setLodding={setLodding} />
        )
      }
    </Layout>
  )
}

export default withTranslation('mobile_contact')(ContactUs);