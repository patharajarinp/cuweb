import React from 'react';
import Layout from '../../../components/layout';
import MobileMainChangeDetail from '../../../components/user/mobile/order/order_change/MobileMainChangeDetail';
import MainChangeDetail from '../../../components/user/order/order_cancel/MainChangeDetail';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { withTranslation } from "../../../utils/i18n";

const OrderReturn = (props) => {
  const { t } = props
 
  const isMobile = useMediaQuery(992);

  return (

    <Layout title="User | Order Change Detail" >
      {
        !isMobile ? (
          <MainChangeDetail t={t} />
        ) : (
          <MobileMainChangeDetail t={t} />
        )
      }
      
    </Layout>
  )
}

OrderReturn.getInitialProps = ({ query }) => {
  return { query }; //has to be like an object
}


export default withTranslation(['order_detail', 'add_address'])(OrderReturn)