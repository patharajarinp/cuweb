import React from 'react';
import Layout from '../../../components/layout';
import MobileMainFail from '../../../components/user/mobile/order/fail_order/MobileMainSuccess';
import MainFail from '../../../components/user/order/fail_order/MainFail';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { withTranslation } from "../../../utils/i18n";

const Fail = (props) => {
  const { t } = props;

  const isMobile = useMediaQuery(992);

  return (
    <Layout title="User | Order Failed">
      {
        !isMobile ? (
          <MainFail t={t} />
        ) : (
          <MobileMainFail t={t} />
        )
      }
      
    </Layout>
  )
}

export default withTranslation(['mobile_translations'])(Fail)