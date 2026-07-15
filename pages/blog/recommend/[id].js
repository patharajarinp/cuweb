import React from 'react';
import MobileMainRecommend from '../../../components/blog_res/mobile/recommend/MobileMainRecommend';
import MainRecommend from '../../../components/blog_res/recommend/MainRecommend';
import Layout from '../../../components/layout';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { withTranslation } from "../../../utils/i18n";
function home({query,t}) {

  const isMobile = useMediaQuery(992);

  return (
    <div>
      <Layout title={"Blog"} isBanner={true} active={1}>
        {
          !isMobile ? (
            <MainRecommend t={t} query={query} />
          ) : (
            <MobileMainRecommend t={t} query={query} />
          )
        }
      </Layout>
    </div>
  )
}
home.getInitialProps = ({ query, pathname }) => {
  return { query, pathname };
};

export default withTranslation("blog_index")(home);
