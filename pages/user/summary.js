import React, { useState } from 'react';
import Layout from '../../components/layout';
import MobileMainSummary from '../../components/user/mobile/summary/MobileMainSummary';
import MainSummary from '../../components/user/summary/MainSummary';
import useMediaQuery from '../../hooks/useMediaQuery';
import Navbar from '../../components/mobile/layout/Navbar';
import { withTranslation } from '../../utils/i18n';


const Summary = (props) => {
  const { t } = props
  const [loading, setLodding] = useState(false);
  
  const isMobile = useMediaQuery(992);

  return (
    <Layout title="User | Summary" loading={loading}>
      {
        !isMobile ? (
          <MainSummary t={t} loading={loading} setLodding={setLodding} />
        ) : (
          <>
            <Navbar />
            <MobileMainSummary t={t} loading={loading} setLodding={setLodding} />
          </>
        )
      }
    </Layout>
  )
}
export default withTranslation(['shippingInfo','header', 'mobile_shippingInfo','mobile_header','mobile_address'])(Summary)