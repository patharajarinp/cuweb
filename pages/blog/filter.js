import React from "react";
import MainFilter from "../../components/blog_res/filter/MainFilter";
import MobileMainFilter from "../../components/blog_res/mobile/filter/MobileMainFilter";
import Layout from "../../components/layout";
import useMediaQuery from "../../hooks/useMediaQuery";
import { withTranslation } from "../../utils/i18n";

function Blogfiller({ query,t }) {
 
  const isMobile = useMediaQuery(992);

  return (
    <div>
      <Layout title="Blog Filter">
        {
          !isMobile ? (
            <MainFilter t={t} query={query} />
          ) : (
            <MobileMainFilter t={t} query={query} />
          )
        }
      </Layout>
    </div>
  );
}
Blogfiller.getInitialProps = ({ query, pathname }) => {
  return { query, pathname };
};
export default withTranslation("blog_filter")(Blogfiller);
