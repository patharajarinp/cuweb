import React from 'react';
import Layout from '../components/layout';
import { withTranslation } from '../utils/i18n';
import PreOrderPage from '../components/main_page/PreOrderPage';
import useMediaQuery from '../hooks/useMediaQuery';
import MobilePreOrderPage from '../components/main_page/mobile/MobilePreOrderPage';

const MainProducts = ({query, t}) =>{

  const isMobile = useMediaQuery(992);

  return (
    <Layout title={`${t('translations:pre_order')} | ศูนย์หนังสือจุฬาฯ`} isBanner={true}>

      {
        !isMobile ? (
          <PreOrderPage t={t} query={query} />
        ) : (
          <MobilePreOrderPage t={t} query={query} />
        )
      }
      
    </Layout>
  )
}

MainProducts.getInitialProps = ({query}) => {
  return {query}
}

export default withTranslation('home')(MainProducts)