import React, { useState } from 'react';
import Layout from '../../../components/layout';
import MainRenewMember from '../../../components/user/member/MainRenewMember';
import MobileMainRenewMember from '../../../components/user/mobile/member/MobileMainRenewMember';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { withTranslation } from '../../../utils/i18n';


const OrderDetail = (props) => {
  const {t} = props
  const [loading, setLodding] = useState(false);

  const isMobile = useMediaQuery(992);

  return (

    <Layout title="User | Order Detail" loading={loading}>
      {
        !isMobile ? (
          <MainRenewMember t={t} loading={loading} setLodding={setLodding} />
        ) : (
          <MobileMainRenewMember t={t} />
        )
      }
    </Layout>
  )
}

OrderDetail.getInitialProps = ({ query }) => {
  return { query }; //has to be like an object
}


export default withTranslation('order_detail')(OrderDetail)