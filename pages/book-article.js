import React from 'react';
import Layout from '../components/layout';
import MobileBookArticleAll from '../components/mobile/book_article/MobileBookArticleAll';
import BookArticleAll from '../components/book-article/BookArticleAll';
import useMediaQuery from '../hooks/useMediaQuery';
import { withTranslation } from "../utils/i18n";



const Home = (props) => {
  const {t} = props;
  
  const isMobile = useMediaQuery(992);

  return (
    <Layout title="ข่าวประชาสัมพันธ์ | ศูนย์หนังสือจุฬาฯ" className="mb-5">

      
      {
        !isMobile ? (
          <BookArticleAll t={t} />
        ) : (
          <MobileBookArticleAll t={t} />
        )
      }

    </Layout>
  )
}

export default withTranslation('news') (Home)