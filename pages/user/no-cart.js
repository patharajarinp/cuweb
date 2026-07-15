import React, { useEffect } from 'react';
import Layout from '../../components/layout';
import Nocart from '../../components/user/cart/NOcart';
import MobileNocart from '../../components/user/mobile/cart/MobileNocart';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Link, withTranslation } from "../../utils/i18n";

const NoCart = (props) => {
  const {t} = props

  const isMobile = useMediaQuery(992);

  return (
    <Layout title="User | Cart">
      {
        !isMobile ? (
          <Nocart t={t} />
        ) : (
          <MobileNocart t={t} />
        )
      }
      
    </Layout>
)}
export default withTranslation(['static_nav'])(NoCart)