import React from "react";
import MainBlog from "../../components/blog/MainBlog";
import Layout from "../../components/layout";
import MobileMainBlog from "../../components/mobile/blog/MobileMainBlog";
import useMediaQuery from "../../hooks/useMediaQuery";
import api from "../../utils/api";
import { withTranslation } from "../../utils/i18n";

const Home = (props) => {
  const { t ,blogNew , blogLike ,writer,rec,banner} = props;

  const isMobile = useMediaQuery(992);

  
  return (
    <Layout title={"Blog"} isBanner={true} active={1} show={true}>
      {
        !isMobile ? (
          <MainBlog 
            t={t} 
            blogNew={blogNew}
            blogLike={blogLike}
            writer={writer}
            rec={rec}
            banner={banner}
          />
        ) : (
          <MobileMainBlog 
            t={t} 
            blogNew={blogNew}
            blogLike={blogLike}
            writer={writer}
            rec={rec}
            banner={banner}
          />
        )
      }
      
      
    </Layout>
  );
};

Home.getInitialProps = async ({query}) => {
  const [new_res,like_res,writer_res,rec_res,page_rec] = await Promise.all([
    api.getBlogGroupNew(),
    api.getBlogGroupLiked(),
    api.getWriterPage(),
    api.getRecommedAllFont(),
    api.getBanner('blog', 'cu')
  ])
  const blogNew = new_res.data
  const blogLike = like_res.data
  const writer = writer_res.data
  const rec = rec_res.data
  const banner = page_rec.data
  return {query,blogNew , blogLike ,writer,rec,banner}
}

export default withTranslation("blog_index")(Home);
