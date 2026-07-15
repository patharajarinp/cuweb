import React from 'react';
import Layout from '../../components/layout';
import AddAddress from '../../components/user/address/AddAddress';
import MobileAddAddress from '../../components/user/mobile/address/MobileAddAddress';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from '../../utils/i18n';

const PageAddAddress = (props) => {
  const { t } = props;
  
  const isMobile = useMediaQuery(992);

  return (
 
  <Layout title="User | Add Address" isFooter={false} >
    {
      !isMobile ? (
        <AddAddress t={t} />             
      ) : (
        <MobileAddAddress t={t} />             
      )
    }
  </Layout>
)}
export default withTranslation(['add_address'])(PageAddAddress)