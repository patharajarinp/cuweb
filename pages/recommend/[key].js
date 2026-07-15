import React, { useState } from 'react';
import Layout from '../../components/layout';
import Loading from '../../components/loading';
import DesktopRecommend from '../../components/main_page/recommend/DesktopRecommend';
import MobileDesktopRecommend from '../../components/main_page/recommend/mobile/MobileDesktopRecommend';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from "../../utils/i18n";

const MainProducts = ({ t, query }) => {
  const [loading, setLoading] = useState(false)

  const isMobile = useMediaQuery(992);

  return (
    <Layout isBanner={true}>
      {loading && <Loading />}

      {
        !isMobile ? (
          <DesktopRecommend 
            t={t} query={query}
            loading={loading} setLoading={setLoading} 
          />
        ) : (
          <MobileDesktopRecommend 
            t={t} query={query}
            loading={loading} setLoading={setLoading} 
          />
        )
      }
      

    </Layout>
  )
}

MainProducts.getInitialProps = ({ query }) => {
  return { query }
}

export default withTranslation('news') (MainProducts) 