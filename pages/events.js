import React from 'react';
import EventAll from '../components/event/EventAll';
import Layout from '../components/layout';
import MobileEventAll from '../components/mobile/event/MobileEventAll';
import useMediaQuery from '../hooks/useMediaQuery';
import { withTranslation } from "../utils/i18n";

const Home = (props) => {
  const {t} = props;

  const isMobile = useMediaQuery(992);

  return (
    <Layout title="ภาพกิจกรรม | ศูนย์หนังสือจุฬาฯ">
      {
        !isMobile ? (
          <EventAll t={t} />
        ) : (
          <MobileEventAll t={t} />
        )
      }
      
    </Layout>
  )
}

export default withTranslation('news') (Home)