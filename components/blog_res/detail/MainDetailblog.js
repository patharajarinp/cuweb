import React, { useEffect, useState,useContext } from "react";
import Layout from "../../../components/layout";
import { Link, withTranslation, Router } from "../../../utils/i18n";

import HeadDetail from "../../../components/blog/detail/headDetail";
import StoryDetail from "../../../components/blog/detail/storyDetail";
import TableContents from "../../../components/blog/detail/tableContents";
import ShowProduct from "../../../components/blog/detail/showProduct";
import Comment from "../../../components/blog/detail/comment";
import Card from "../../../components/blog/card";
import { Carousel } from "react-bootstrap";
import api from "../../../utils/api";
import { useRouter } from "next/router";
import UserContext from '../../../contexts/UserContext'
import LoginLayout from "../../../components/layout/login_layout";
import { Modal } from "react-bootstrap";
import AuthService from "../../../utils/AuthService";
import Head from "next/head";

const MainDetailblog = (props) => {
  const { t } = props;
  const { user ,local } = useContext(UserContext);
  const router = useRouter();
  const preview =router.query.preview;
  const blog_id = router.query.blogid;
  const [blog, setblog] = useState(null);
  const [bData, setbData] = useState(null)
  const [vote_count, setvote_count] = useState(0)
  const [votesMb, setvotesMb] = useState(null)
  const [showLogin, setShowLogin] = useState(false);
  const [Followeds, setFolloweds] = useState(null)
  const [orderb, setorderb] = useState("ASC")
  const handleCloseLogin = () => {
    setShowLogin(false);
  };
  const fetchPage = async () => {
    api
      .getBlogPage(blog_id)
      .then(async (res) => {

       if (!res.data) {
        Router.push('/blog')
       }
       setblog(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchBlogData = (order) => {
    setorderb(order)
    api
      .getBlogDataPage(blog_id,{order})
      .then(async (res) => {
        setbData(res.data);
       
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchVotes = async(id)=>{
   
    api
      .getVotes(blog_id,{member_id:id})
      .then(async (res) => {
        setvote_count( res.data.data.vote_count)
        setvotesMb(res.data.votes_mb)
      })
      .catch((err) => {
        console.log(err.response);
      });
  } 
  const fetchFollowed = async(id)=>{
   
    api
      .getFollowed(blog&&blog.writer_id,{member_id:id})
      .then(async (res) => {
        setFolloweds(res.data)
      })
      .catch((err) => {
        console.log(err.response);
      });
  } 
  useEffect(() => {
   if(user &&blog) {
     fetchVotes(user.id); fetchFollowed(user.id)
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
  
  }, [user,blog])
  useEffect(() => {
   fetchPage();
    fetchBlogData(orderb)
  }, []);

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName("main-layout")[0].style.backgroundColor = "rgb(248, 249, 250)";
    }
  },[]);

  return (
    <>
      <div className="blog-blog-show">
        <Layout title={blog?blog.title:"blog"} isPreview={preview}>
          {blog ? (
            <div className="container">
              {!preview?
              <div className="row">
                <div className="col-12">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link href='/' as={'/'}>
                          <a>{t('home')}</a>
                        </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link href="/blog" as={`/blog`}>
                          <a>{t('blog')}</a>
                        </Link>
                      </li>
                      {/* <li className="breadcrumb-item">
                        <Link href={`/blog/filter?cate=${blog.blog_category.id}&blog=`} as={`/blog/filter?cate=${blog.blog_category.id}&blog=`}>
                        <a>{blog.blog_category['name_'+local] || blog.blog_category.name_th}</a>
                        </Link>
                      </li> */}
                      <li className="breadcrumb-item active">
                        <a>{blog.title}</a>
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>

              :null}
                        
              <div className="row">
                <div className="col-12">
                  <Carousel>
                    {blog.blog_group_banners.length != 0 ? (
                      blog.blog_group_banners.map((val, index) => (
                        
                          val.type == 0 && (
                            <Carousel.Item key={Math.random()}>
                              <div className="blog-pages-detail-img-l">
                                <div className="blog-pages-detail-img-m">
                                  <img
                                    className="blog-pages-detail-img-s"
                                    src={val.picture}
                                  />
                                </div>
                              </div>
                            </Carousel.Item>
                          )
                        
                      ))
                    ) : (
                      <Carousel.Item>
                        <div className="blog-pages-detail-img-l">
                          <div className="blog-pages-detail-img-m">
                            <img
                              className="blog-pages-detail-img-s"
                              src={"/icon/blog-icon-banner.svg"}
                            />
                          </div>
                        </div>
                      </Carousel.Item>
                    )}
                  </Carousel>
                </div>
              </div>
              <div className="row mt-4 pb-4">
                <div className="col-12">
                  <HeadDetail title={blog.title} writer={blog.blog_writer} tags={blog.blog_group_tags} numdata={bData&&bData.length} 
                  blog_id={blog_id} user={user} vote_count={vote_count} votes_mb={votesMb} 
                  onVotes={()=>fetchVotes(user.id)} onClickVotes={()=>{setShowLogin(true)}} followeds={Followeds} onFollow={()=>fetchFollowed(user.id)} t={t} />
                </div>
              </div>
              <div className="row pr-5 pl-5">
                <div className="col-12 pr-5 pl-5">{/* <StoryDetail /> */}</div>
              </div>
              {!preview?
              <div className="row pb-4">
                <div className="col-12 ">
                  <TableContents head={true} page data1={bData&&bData} blog_id={blog.id} onFillterBy={(val)=>fetchBlogData(val)}  orderb={orderb} title={blog.title} writer={blog.blog_writer} />
                </div>
              </div>
              :<div style={{height:'280px'}}></div>}
              

            </div>
          ) : null}
          <Modal
          className="modal-cart"
          centered
          show={showLogin}
          onHide={handleCloseLogin}
          size="xl"
        >
          <Modal.Header closeButton>
            <div>
              <Modal.Title className="d-flex">ลงชื่อเข้าใช้งานระบบ</Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <LoginLayout loginBy="modal" closeModal={handleCloseLogin} isModal={true}  />
          </Modal.Body>
        </Modal>

          
          {/* <div className="container">
            <div className="row pr-5 pl-5 pb-3">
              <div className="col-12 pr-5 pl-5">
                <Comment />
              </div>
            </div>
          </div>  */}
          <div className="blog-blogid-blog ">
            <div className="container">
              <div className="row">
                <div className="col-12"><ShowProduct blog_id={blog_id} t={t} /></div>
              </div>
            </div>
          </div> 
        </Layout>
      </div>
    </>
  )
}
export default withTranslation("blog_group")(MainDetailblog);