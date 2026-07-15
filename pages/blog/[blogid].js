import React from "react";
import MainDetailblog from "../../components/blog_res/detail/MainDetailblog";
import MobileDetailBlog from "../../components/blog_res/mobile/detail/MobileDetailBlog";
import useMediaQuery from "../../hooks/useMediaQuery";

function Home({t}) {
  
  const isMobile = useMediaQuery(992);

  return (
    <>
      {
        !isMobile ? (
          <MainDetailblog />
        ) : (
          <MobileDetailBlog />
        )
      }
    </>
  );
}
export default Home;
