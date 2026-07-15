import React from 'react';
import Layout from '../../../components/layout';
import EditAddress from '../../../components/user/address/EditAddress';
import MobileEditAddress from '../../../components/user/mobile/address/MobileEditAddress';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { withTranslation } from '../../../utils/i18n';

const PageEditAddress = (props) => {
  const { t } = props;
  
  const isMobile = useMediaQuery(992);

  return (
 
  <Layout title="User | Edit Address" isFooter={false} >
    {
      !isMobile ? (
        <EditAddress t={t} />             
      ) : (
        <MobileEditAddress t={t} />             
      )
    }
  </Layout>
)}

EditAddress.getInitialProps = ({query}) => {
    return {query}; //has to be like an object
}
  

export default withTranslation(['edit_address'])(PageEditAddress)