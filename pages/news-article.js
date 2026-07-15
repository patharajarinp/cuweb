import React from 'react';
import Layout from '../components/layout';
import MobileNewsAll from '../components/mobile/news/MobileNewsAll';
import NewsAll from '../components/news/NewsAll';
import useMediaQuery from '../hooks/useMediaQuery';
import { withTranslation } from "../utils/i18n";



const Home = (props) => {
  const {t} = props;
  
  const isMobile = useMediaQuery(992);

  return (
    <Layout title="ข่าวประชาสัมพันธ์ | ศูนย์หนังสือจุฬาฯ" className="mb-5">

      
      {
        !isMobile ? (
          <NewsAll t={t} />
        ) : (
          <MobileNewsAll t={t} />
        )
      }

    </Layout>
  )
}

export default withTranslation('news') (Home)