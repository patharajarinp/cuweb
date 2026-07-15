import React, { useContext, useState, useEffect } from "react";
import { Link, Router, withTranslation } from "../../../../utils/i18n";
import { Fade, UncontrolledCarousel } from "reactstrap";
import UserContext from "../../../../contexts/UserContext";
import Layout from "../../../../components/layout";
import api from "../../../../utils/api";
import { useRouter } from "next/router";
import HeadDetail from "../../../../components/mobile/blog/detail/headDetail";
import StoryDetail from "../../../../components/mobile/blog/detail/storyDetail";
import CardGrid from '../../../../components/mobile/widget/Card';
import AuthService from "../../../../utils/AuthService";

const MobileDetailBlog = (props) => {
  const { t } = props;

  const { user, handleCart, fetchUser, onSocket } = useContext(UserContext);
  const [dropdownInfo, setdropdownInfo] = useState(false);

  const toggledropdownInfo = () => setdropdownInfo(!dropdownInfo);
  const router = useRouter();
  const preview = router.query.preview;
  const blog_id = router.query.blogid;
  const [blog, setblog] = useState(null);
  const [bData, setbData] = useState(null);
  const [vote_count, setvote_count] = useState(0);
  const [votesMb, setvotesMb] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [Followeds, setFolloweds] = useState(null);
  const [orderb, setorderb] = useState("ASC");
  const [img, setImg] = useState();
  const [pageRec, setPageRecommend] = useState();
  const fetchPageRecommend = () => {
    api.blogProductGet(blog_id,4).then(res =>{
        const data = res.data;
        // 
        let tmp = []
        data.rows.forEach((val,index) => {
          tmp.push(val.product)
          
        });
        // console.log('data', tmp)
        setPageRecommend(tmp);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const handleCloseLogin = () => {
    setShowLogin(false);
  };
  const fetchPage = () => {
    api
      .getBlogPage(blog_id)
      .then(async (res) => {
        const data = res.data;
        setblog(data);
        let tmp = data.blog_group_banners
          .filter((val) => val.type == 1)
          .map((val) => {
            return val.picture;
          });
        let src1 = [];
        for (const item of tmp) {
          src1.push({
            src: item,
            altText: item,
            caption: item,
            header: "Header",
          });
        }

        if (src1.length) setImg(src1);
        else
          setImg([
            {
              src: "/mobile/icon/blog/blog-icon-banner.svg",
              altText: "Slide 3",
              caption: "Slide 3",
              header: "Slide 3 Header",
            },
          ]);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchBlogData = (order) => {
    setorderb(order);
    api
      .getBlogDataPage(blog_id, { order })
      .then(async (res) => {
        setbData(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchVotes = async (id) => {
    api
      .getVotes(blog_id, { member_id: id })
      .then(async (res) => {
        setvote_count(res.data.data.vote_count);
        setvotesMb(res.data.votes_mb);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchFollowed = async (id) => {
    api
      .getFollowed(blog && blog.writer_id, { member_id: id })
      .then(async (res) => {
        setFolloweds(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const shareData = () => {
    if (!blog) {
      return false;
    }
    return {
      title: blog.title,
      // text: `${t("name_book")} : ${blog.title}, ${t("author")} : ${blog.title}`,
      url: `https://chulabook.com/blog/${blog_id}`,
    }
  }

  const handleShare = (e) => {
    try {
      // console.log(navigator);
      navigator.share(shareData())
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if (user && blog) {
      fetchVotes(user.id);
      fetchFollowed(user.id);
      if (preview) {
        if(AuthService.isLoggin() == null){
      
          Router.push('/blog')
        }else if (user && !user.blog_writer) {
          Router.push('/blog')
        }else if (user && user.blog_writer && user.blog_writer.id != blog.writer_id) {
          Router.push('/blog')
        }
        
      
        }else if(blog.status_approve == 1 && blog.publish_status == 1  ) {}
        else Router.push('/blog')
    }
   
    //  else {fetchVotes(0); fetchFollowed(0)}
    //  console.log('object')
  }, [user, blog]);
  useEffect(() => {
    fetchPage();
    fetchPageRecommend()
    fetchBlogData(orderb);
  }, []);
  const showCount = () => {
    if (!user || user.cart.length == 0)
      return ''
    return user.cart.length > 9 ? <span>9<span>+</span></span> : <span>{user.cart.length}</span>
  }
  return (
    <>
      <div>
        <Layout className="mb-5">
          <div className="product-book-nav">
            <Link href="/blog">
              <a className="btn-back row" style={{flex:' 0 0 auto'}}>
                <img
                  className="img-fluid ml-2"
                  src={"/mobile/image/icon/icon-back.svg"}
                />
              </a>
            </Link>
            <div className="d-flex justify-content-between ">
              <a className="btn-share mr-3" onClick={handleShare}>
                <img className="" src={"/mobile/image/icon/icon-share.svg"} />
              </a>
              {user ? (
                <Link href="/user/cart">
                  <a className="btn-cart mr-3 img-cart">
                    <img className="" src={"/mobile/image/icon/icon-cart.svg"} />{showCount()}
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a className="btn-cart mr-3">
                    <img className="" src={"/mobile/image/icon/icon-cart.svg"} />
                  </a>
                </Link>
              )}
              <a className="btn-info-info" onClick={toggledropdownInfo}>
                <img className="" src={"/mobile/image/icon/icon-info.svg"} />
              </a>
            </div>
            <Fade in={dropdownInfo} className="dropdown-info">
              <Link href='/'>
                <a className="text-default">
                  <p className="text-black mb-1">หน้าหลัก</p>
                </a>
              </Link>
              {user && (
                <Link href="/user/favorite">
                  <a className="text-default">
                    <p className="text-black mb-1">รายการที่ชอบ</p>
                  </a>
                </Link>
              )}

              <Link href="/categories">
                <a className="text-default">
                  <p className="text-black mb-1">ค้นหา</p>
                </a>
              </Link>
              {user && (
                <Link href="/user/dashboard">
                  <a className="text-default">
                    <p className="text-black mb-1">บัญชีของฉัน</p>
                  </a>
                </Link>
              )}
            </Fade>
          </div>
          <div className="h-64px"></div>
          {blog && (   
              <div className="bg-light-less-gray">
              
              {img && <UncontrolledCarousel items={img} />}
              <HeadDetail
              t={t}
                title={blog.title}
                writer={blog.blog_writer}
                tags={blog.blog_group_tags}
                numdata={bData && bData.length}
                blog_id={blog_id}
                user={user}
                vote_count={vote_count}
                votes_mb={votesMb}
                onVotes={() => fetchVotes(user.id)}
                onClickVotes={() => {
                  Router.push(`/login?redirect=/blog/${blog_id}`)
                }}
                followeds={Followeds}
                onFollow={() => fetchFollowed(user.id)}
              />
              <div className="all-card-book-none-text-left bg-white my-3">
                <StoryDetail  data1={bData&&bData} blog_id={blog.id} onFillterBy={(val)=>fetchBlogData(val)} orderb={orderb} title={blog.title} writer={blog.blog_writer}/>
              </div>
              
              {
          (pageRec && pageRec.length) ? (
            <>
            <div className="container">
              <hr className=" product-content-line my-2"></hr>
            </div>
            <div className="all-card-book-none-text-left  bg-white">
              <div className="container py-3">
                <div className="d-flex justify-content-between">
                <div>  <h4 className="text-black">{t('related_products')}</h4></div>
                  
                    <Link href={`/blog/[blogid]/related?blogid=${blog_id}`} as={`/blog/${blog_id}/related`}>
                    <a>
                      <p className="blog-text-yellow see-all-link">{t('view_all')} </p>
                    </a>
                  </Link>
                  
                </div>
                
                <div className="d-flex justify-content-between flex-wrap p-2">
                  {
                    pageRec.map((val, index) =>
                      <CardGrid product={val} show={2} _class="my-2" key={index}/>
                    )
                  }
                </div>
              </div>
              <div className="footer-space"></div>
            </div>
            </>
          ) : (
            <div className="footer-space"></div>
          )
        }
                </div>
            
          )}

        </Layout>
      </div>
    </>
  )
}
export default withTranslation('mobile_blog_group')(MobileDetailBlog)
