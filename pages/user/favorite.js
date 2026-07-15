import React from 'react';
import Layout from '../../components/layout';
import MainFav from '../../components/user/favorite/MainFav';
import MobileFav from '../../components/user/mobile/favorite/MobileFav';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from '../../utils/i18n';

const Favorite = (props) => {
  const { t } = props
 
  const isMobile = useMediaQuery(992);

  return (

    <Layout title="User | Favorite" >
      {
        !isMobile ? (
          <MainFav t={t} />
        ) : (
          <MobileFav t={t} />
        )
      }
    </Layout>
  )
}
export default withTranslation(['favorite'])(Favorite)