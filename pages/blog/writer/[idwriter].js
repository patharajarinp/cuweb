import React, { useEffect, useState,useContext } from "react";
import Layout from "../../../components/layout";
import HeadWriter from "../../../components/blog/detail/headwriter";
import Card from "../../../components/blog/card";
import SlideFolow from "../../../components/blog/detail/slideFolow";
import { useRouter } from "next/router";
import api from "../../../utils/api";
import { Carousel } from "react-bootstrap";
import { Link, withTranslation, Router } from "../../../utils/i18n";
import UserContext from '../../../contexts/UserContext'
import LoginLayout from "../../../components/layout/login_layout";
import Ebooks from '../../../components/blog/ebook'
import { Modal } from "react-bootstrap";
import CardPH from "../../../components/shimmer/Card";
import AuthService from "../../../utils/AuthService";
import Head from 'next/head'
function Home({t}) {
  const router = useRouter();
  const writer_id = Number(router.query.idwriter);
  const { user } = useContext(UserContext);
  const preview = Number(router.query.preview);
  const [writer, setwriter] = useState(null);
  const [profile, setprofile] = useState([]);
  const [penname, setpenname] = useState("");
  const [bData, setbData] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [Followeds, setFolloweds] = useState(null)
  const [product, setProduct] = useState()
  const [banner, setBanner] = useState()
  function getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
  }
  const handleCloseLogin = () => {
    setShowLogin(false);
  };
  useEffect(() => {
    let data;
    if (preview) {
      data = { writer_id, preview };

    } else {
      data = { writer_id };
    }
    fetchWriter(data);
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#EEEEEE";
    }
      fetchProduct()
  }, []);
  useEffect(() => {
    if(user) fetchFollowed(user.id)
    else fetchFollowed(0)
    if (preview) {
      if(AuthService.isLoggin() == null){
     
        Router.push('/blog')
      }else if (user && !user.blog_writer) {
       Router.push('/blog')
      }else if (user && user.blog_writer && user.blog_writer.id != writer_id) {
        Router.push('/blog')
       }
      
    }
   }, [user]);
  const fetchWriter = async (data) => {
    api
      .getBannerwriterFont(data)
      .then(async (res) => {
        const data = res.data;
        // console.log('data', data)
        if (!data.writer) {
          window.history.back();
        }
        setpenname(data.writer.penname1);
        setwriter(data.writer);
        
        if (preview) {
          const bpp = data.writer.blog_writer_banners
          .filter((val) => val.mimetype == "desktop" && val.status == 0)
          .map((val) => {
            return { id: val.id, img: val.picture };
          });
          // console.log('bpp', bpp)
          if (bpp.length) setBanner(bpp);

          const bd = data.writer.blog_writer_banners
          .filter((val) => val.mimetype == "profile" && val.status == 0)
          .map((val) => {
            return { id: val.id, img: val.picture };
          });
        if (bd.length) setprofile(bd);

        } else {
          const bpp = data.writer.blog_writer_banners
          .filter((val) => val.mimetype == "desktop"&& val.status == 1)
          .map((val) => {
            return { id: val.id, img: val.picture };
          });
          // console.log('bpp', bpp)
          if (bpp.length) setBanner(bpp);
          const bd = data.writer.blog_writer_banners
          .filter((val) => val.mimetype == "profile" && val.status == 1)
          .map((val) => {
            return { id: val.id, img: val.picture };
          });
        if (bd.length) setprofile(bd);
        }
        
        setbData(data.data)
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  
  const fetchFollowed = async(id)=>{
   
    api
      .getFollowed(writer_id,{member_id:id})
      .then(async (res) => {
        setFolloweds(res.data)
      })
      .catch((err) => {
        console.log(err.response);
      });
  } 
  const fetchProduct = async()=>{
   
    api
      .getBlogProductwriter(writer_id)
      .then(async (res) => {
        setProduct(res.data)
      })
      .catch((err) => {
        console.log(err.response);
      });
  } 
  useEffect(() => {
    
     const tmp =  document.querySelectorAll( 'oembed[url]' )
      document.querySelectorAll('figure[class="media"]').forEach( (element,index) => {
        if (tmp[index]) {
          element.innerHTML='<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;"> <iframe src="https://www.youtube.com/embed/' + getId(tmp[index].getAttribute( 'url' )) + '" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>';
        }
    });
    
   }, [bData]);
  return (
    <div>
      <Layout title="Profile Writer" isPreview={preview}>
        <Head>
        <link rel="stylesheet" href={`${api.frontend_url}/css/content-styles.css`}/>
        </Head>
      {writer?
        <div className="container">
          <div className="row mt-4">
            <div className="col-12 blog-blog-show">
           
               <Carousel indicators={false}>
                  {banner&&banner.length !=0 ? (
                    banner.map((val, index) => (
                      
                    
                          <Carousel.Item key={Math.random()}>
                            <div className="blog-pages-detail-img-l">
                              <div className="blog-pages-detail-img-m">
                                <img
                                  className="blog-pages-detail-img-s"
                                  src={val.img}
                                />
                              </div>
                            </div>
                          </Carousel.Item>
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
          <div className="row mt-4">
            <div className="col-12">
              <HeadWriter t={t} followeds={Followeds} onClickVotes={()=>setShowLogin(true)} user={user} writer={writer} penname={penname} profile={profile} onFollow={()=>{fetchFollowed(user.id); fetchWriter({writer_id});}}/>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12 text-center">
             {!!bData&&<h3>{t('blog')}</h3> } 
            </div>
          </div>
          <div className="row mt-4">
            {bData.length != 0&&bData.map((val,index)=>
              <div key={Math.random()} className="col-xl-3 col-lg-3 col-md-4">
            
                  <Card penname={penname} data={val} />
                 
                
             </div>
            )}
            {preview ?<> 
            <div className="d-none d-xl-flex w-100">
              <CardPH show={4} grid={4} new_padding={true}/>
            </div>
            <div className="d-none d-xl-none d-flex w-100">
              <CardPH show={3} grid={3} new_padding={true}/>
            </div>
            
            </>:null}
            
          </div>
        </div>
 
      :null}
           {!preview?<>
            
              {
                product && !!product.length && 
                <Ebooks data={product} t={t}/>
              }
              <SlideFolow t={t} writer={writer} />
           


           </>:<div style={{height:'280px'}}></div>}   

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
        
      </Layout>
      
    </div>
  );
}
export default withTranslation("blog_writer")(Home);