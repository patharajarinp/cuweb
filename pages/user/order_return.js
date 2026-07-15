import React, { useState } from 'react';
import Layout from '../../components/layout';
import MobileOrderReturn from '../../components/user/mobile/order/order_return/MobileOrderReturn';
import MainOrderReturn from '../../components/user/order/order_return/MainOrderReturn';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from "../../utils/i18n";

const Order = (props) => {
  const {t} = props;
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery(992);

  return (
 
  <Layout title="User | Order Return" loading={loading} >
    {
      !isMobile ? (
        <MainOrderReturn t={t} setLoading={setLoading} />
      ) : (
        <MobileOrderReturn t={t} />
      ) 
    }
    
  </Layout>
)}

export default withTranslation(['Order'])(Order)