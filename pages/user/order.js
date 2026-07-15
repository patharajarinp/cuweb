import React, { useState } from 'react';
import Layout from '../../components/layout';
import MobileMainOrder from '../../components/user/mobile/order/MobileMainOrder';
import MainOrder from '../../components/user/order/MainOrder';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from "../../utils/i18n";

const Order = (props) => {
  const {t} = props;
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery(992);

  return (
 
  <Layout title="User | Order" loading={loading} >
    {
      !isMobile ? (
        <MainOrder t={t} setLoading={setLoading} />

      ) : (
        <MobileMainOrder t={t} setLoading={setLoading} />
      )
    }
  </Layout>
)}

export default withTranslation(['Order', 'mobile_translations'])(Order)