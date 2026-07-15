import React, { useState } from 'react';
import Layout from '../../../components/layout';
import MainTransferMenber from '../../../components/user/member/MainTransferMenber';
import MobileMainTransferMenber from '../../../components/user/mobile/member/MobileMainTransferMenber';
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
          <MainTransferMenber t={t} loading={loading} setLodding={setLodding} />
        ) : (
          <MobileMainTransferMenber t={t} />
        )
      }
    </Layout>
  )
}

OrderDetail.getInitialProps = ({ query }) => {
  return { query }; //has to be like an object
}


export default withTranslation('order_detail')(OrderDetail)