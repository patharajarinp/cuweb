import React from 'react';
import Layout from '../../components/layout';
import MainFollow from '../../components/user/follow/MainFollow';
import MobileFollow from '../../components/user/mobile/follow/MobileFollow';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from '../../utils/i18n';

const Favorite = (props) => {
  const { t } = props
  
  const isMobile = useMediaQuery(992);

  return (

    <Layout title="User | Favorite" >
      {
        !isMobile ? (
          <MainFollow t={t} />
        ) : (
          <MobileFollow t={t} />
        )
      }
    </Layout>
  )
}
export default withTranslation(['follow'])(Favorite)