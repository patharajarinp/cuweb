import React from 'react';
import Layout from '../../components/layout';
import MainAddress from '../../components/user/address/MainAddress';
import MobileMainAddress from '../../components/user/mobile/address/MobileMainAddress';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from '../../utils/i18n';

const Address = (props) => {
  const { t } = props;

  const isMobile = useMediaQuery(992);

  return (
    <Layout title="User | Address" isFooter={false} >
      {
        !isMobile ? (
          <MainAddress t={t} />             
        ) : (
          <MobileMainAddress t={t} />             
        )
      }
    </Layout>
)}
export default withTranslation(['address'])(Address)