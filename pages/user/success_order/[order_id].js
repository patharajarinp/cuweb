import React from 'react';
import Layout from '../../../components/layout';
import MobileMainSuccess from '../../../components/user/mobile/order/success_order/MobileMainSuccess';
import MainSuccess from '../../../components/user/order/success_order/MainSuccess';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { withTranslation } from "../../../utils/i18n";

const Success = (props) => {
  const {t} = props

  const isMobile = useMediaQuery(992);

  return (
    <Layout title="User | Order Success" isFooter={false}>
      {
        !isMobile ? (
          <MainSuccess t={t} />
        ) : (
          <MobileMainSuccess t={t} />
        )
      }
    </Layout>
  )}

export default withTranslation(['mobile_translations'])(Success)