import React from 'react';
import Layout from '../../components/layout';
import MainCart from '../../components/user/cart/MainCart';
import MoblieMainCart from '../../components/user/mobile/cart/MoblieMainCart';
import Navbar from '../../components/mobile/layout/Navbar';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from '../../utils/i18n';

const Cart = (props) => {
  const { t } = props

  const isMobile = useMediaQuery(992);

  return (
    <Layout title="User | Cart">
      {
        !isMobile ? (
          <MainCart t={t} />
        ) : (
          <>
            <Navbar />
            <MoblieMainCart t={t} />
          </>
        )
      }

    </Layout>
  )
}
export default withTranslation(['shippingInfo', 'header', 'mobile_shippingInfo', 'mobile_header', 'mobile_address'])(Cart)