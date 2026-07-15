import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout'
import MobileMainForgetPassword from '../../components/mobile/user/MobileMainForgetPassword';
import MainForgetPassword from '../../components/user/MainForgetPassword'
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from '../../utils/i18n';

const ForgotPass = (props) => {
  const [loading, setLodding] = useState(false);
  const { t } = props;

  const isMobile = useMediaQuery(992);

  return (
  <Layout loading={loading} title="User | Forgot Password">
    {
      !isMobile ? (
        <MainForgetPassword t={t} loading={loading} setLodding={setLodding}  />
      ) : (
        <MobileMainForgetPassword t={t} loading={loading} setLodding={setLodding} />
      )
    }
  </Layout>
)}

export default  withTranslation('mobile_login')(ForgotPass);
