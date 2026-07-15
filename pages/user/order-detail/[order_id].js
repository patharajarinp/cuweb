import React from 'react';
import Layout from '../../../components/layout';
import MobileMainOrderDetail from '../../../components/user/mobile/order/order_detail/MobileMainOrderDetail';
import MainOrderDetail from '../../../components/user/order/order_detail/MainOrderDetail';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { withTranslation } from "../../../utils/i18n";

const OrderDetail = (props) => {
  const { t } = props
  
  const isMobile = useMediaQuery(992);

  return (

    <Layout title="User | Order Detail" >

      {
        !isMobile ? (
          <MainOrderDetail t={t} />
        ) : (
          <MobileMainOrderDetail t={t} />
        )
      }
      
      
    </Layout>
  )
}

OrderDetail.getInitialProps = ({ query }) => {
  return { query }; //has to be like an object
}


export default withTranslation(['order_detail', 'mobile_order_detail'])(OrderDetail)