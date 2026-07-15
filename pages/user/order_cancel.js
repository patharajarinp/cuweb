import React, { useState } from 'react';
import Layout from '../../components/layout';
import MobileOrderCancel from '../../components/user/mobile/order/order_cancel/MobileOrderCancel';
import MainOrderCancel from '../../components/user/order/order_cancel/MainOrderCancel';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from "../../utils/i18n";

const Order = (props) => {
  const {t} = props;
  const [loading, setLoading] = useState(false)

  const isMobile = useMediaQuery(992);

  return (
 
  <Layout title="User | Order" loading={loading} >
    {
      !isMobile ? (
        <MainOrderCancel t={t} setLoading={setLoading} />
      ) : (
        <MobileOrderCancel t={t} />
      )
    }
    
    
  </Layout>
)}

export default withTranslation(['Order'])(Order)