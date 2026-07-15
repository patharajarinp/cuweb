import React from 'react';
import Layout from '../../../components/layout';
import MobileMainReturnDetail from '../../../components/user/mobile/order/order_return/MobileMainReturnDetail';
import MainReturnDetail from '../../../components/user/order/order_return/MainReturnDetail';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { withTranslation } from "../../../utils/i18n";

const OrderReturn = (props) => {
  const { t } = props
  
  const isMobile = useMediaQuery(992);

  return (

    <Layout title="User | Order Return Detail" >
      {
        !isMobile ? (
          <MainReturnDetail t={t} />
        ) : (
          <MobileMainReturnDetail t={t} />
        )
      }
      
    </Layout>
  )
}

OrderReturn.getInitialProps = ({ query }) => {
  return { query }; //has to be like an object
}


export default withTranslation(['order_detail'])(OrderReturn)