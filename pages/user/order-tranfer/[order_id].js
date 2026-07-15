import React, { useState } from 'react';
import Layout from '../../../components/layout';
import MobileMainOrderTransfer from '../../../components/user/mobile/order/order-tranfer/MobileMainOrderTransfer';
import MainOrderTransfer from '../../../components/user/order/order-tranfer/MainOrderTransfer';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { withTranslation } from '../../../utils/i18n';

const OrderDetail = (props) => {
  const { t } = props
  const [loading, setLodding] = useState(false);

  const isMobile = useMediaQuery(992);

  return (

    <Layout title="User | Order Detail" loading={loading}>
      {
        !isMobile ? (
          <MainOrderTransfer t={t} setLodding={setLodding}  />
        ) : (
          <MobileMainOrderTransfer t={t} setLodding={setLodding}  />
        )
      }
      
    </Layout>
  )
}

OrderDetail.getInitialProps = ({ query }) => {
  return { query }; //has to be like an object
}

export default withTranslation('order_detail')(OrderDetail)