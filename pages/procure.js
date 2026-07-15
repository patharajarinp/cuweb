import React from 'react';
import Layout from '../components/layout';
import MobilePrecureAll from '../components/mobile/precure/MobilePrecureAll';
import PrecureAll from '../components/procure/PrecureAll';
import useMediaQuery from '../hooks/useMediaQuery';
import { withTranslation } from "../utils/i18n";



const Home = (props) => {
  const {t} = props;
  
  const isMobile = useMediaQuery(992);

  return (
    <Layout title="ประกาศจัดซื้อจัดจ้าง | ศูนย์หนังสือจุฬาฯ">
      
      {
        !isMobile ? (
          <PrecureAll t={t} />
        ) : (
          <MobilePrecureAll t={t} />
        )
      }

    </Layout>
  )
}

export default withTranslation('news') (Home)