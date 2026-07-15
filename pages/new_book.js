import React, { useState } from 'react';
import Layout from '../components/layout';
import Loading from '../components/loading';
import MobileNewBookPage from '../components/main_page/mobile/MobileNewBookPage';
import NewBookPage from '../components/main_page/NewBookPage';
import useMediaQuery from '../hooks/useMediaQuery';
import { withTranslation } from "../utils/i18n";

const MainProducts = ({t, query}) =>{
  const [loading, setLoading] = useState(false)
  
  const isMobile = useMediaQuery(992);

  return (
    <Layout isBanner={true}>
      {loading && <Loading />}
      
      {
        !isMobile ? (
          <NewBookPage 
            t={t} query={query} 
            loading={loading}
            setLoading={setLoading}
          />
        ) : (
          <MobileNewBookPage 
            t={t} query={query} 
            loading={loading}
            setLoading={setLoading}
          />
        )
      }
      

    </Layout>
  )
}

MainProducts.getInitialProps = ({query}) => {
  return {query}
}

export default withTranslation('news', 'mobile_best-seller') (MainProducts) 