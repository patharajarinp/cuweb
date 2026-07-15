import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import MainDataDetail from "../../../components/blog_res/data/MainDataDetail";
import MobileMainDataDetail from "../../../components/blog_res/mobile/data/MobileMainDataDetail";
import Layout from "../../../components/layout";
import UserContext from "../../../contexts/UserContext";
import useMediaQuery from "../../../hooks/useMediaQuery";
import api from "../../../utils/api";
import AuthService from "../../../utils/AuthService";
import { Router, withTranslation } from "../../../utils/i18n";

const cookies = new Cookies();
let limit = 2;
function dataId(props) {
  const {t,blog,bData}= props
  const { user , local } = useContext(UserContext);
  const router = useRouter();
  const blog_id = Number(router.query.blogid);
  const data_id = Number(router.query.data_id);
  const preview = Number(router.query.preview);
  // const [blog, setblog] = useState(null);
  // const [bData, setbData] = useState([]);
  const [dLike, setdLike] = useState(null);
  const [dViewe, setdViewe] = useState(0);
  const [dComment, setdComment] = useState([]);
  const [inrteres, setinrteres] = useState();
  const [all, setall] = useState(0);
  function getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    // console.log('match', match)
    if (match && match[2].length == 11) {
        return 'https://www.youtube.com/embed/'+ match[2];
    } else {
      var matchF = url.split("/");;
      // console.log('matchF', matchF)
        return 'https://www.facebook.com/video/embed?video_id='+ matchF[5];
    }
  }
  useEffect(() => {
    const tmp =  document.querySelectorAll( 'oembed[url]' )
     document.querySelectorAll('figure[class="media"]').forEach( (element,index) => {
      if (tmp[index]) {
        let vurl = tmp[index].getAttribute( 'url' )
        element.innerHTML='<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;"> <iframe src="' +getId(vurl) + '" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>';
      }
    });
   
  }, [blog]);
  const ferchData = async (data) => {
    await api
      .blogDataFont(data)
      .then(async (res) => {
        const data = res.data;
        // console.log('data', data)
        if (!data) {
           Router.push('/blog')
        }
        setblog(data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const ferchInteres = async () => {
    await api
      .getBlogGroupInterested(blog_id)
      .then(async (res) => {
        const data = res.data;

        setinrteres(data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchBlogData = () => {
    api
      .getBlogDataPage(blog_id, { order: "ASC" })
      .then(async (res) => {
        setbData(res.data);
        const data = res.data;
        if (!data) {
           Router.push('/blog')
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchBlogLike = (id) => {
    let member_id = id;

    api
      .getDataLike(data_id, { member_id })
      .then(async (res) => {
        const data = res.data;
        setdLike(data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchComment = (limit) => {
    api
      .getComments(data_id, { limit })
      .then(async (res) => {
        const data = res.data;
        setdComment(data);
        // let all = data.filter((val) => val.all);

        setall(data.count);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  useEffect(() => {
    let data;
    if (preview) {
      data = { blog_id, data_id, preview };
    } else {
      data = { blog_id, data_id };
      if (cookies.get(`Blog${data_id}`) == undefined) {
        onViewe();
        cookies.set(`Blog${data_id}`, data_id, { maxAge: 3600 });
      }
      fetchBlogViewe();
    }
    // cookies.set(`Blog${data_id}`,data_id, { maxAge : 10 })
    limit = 2;
    fetchComment(limit);
    // ferchData(data);
    // fetchBlogData();
    ferchInteres();
  }, [data_id]);
  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName("main-layout")[0].style.backgroundColor = "rgb(248, 249, 250)";
    }
  },[]);
  useEffect(() => {
    if (user) fetchBlogLike(user.id);
    else fetchBlogLike(0);
    if (preview) {
      if(AuthService.isLoggin() == null){
     
        Router.push('/blog')
      }else if (user && !user.blog_writer) {
       Router.push('/blog')
      }else if (user && user.blog_writer && user.blog_writer.id != blog.blog_group.writer_id) {
        Router.push('/blog')
       }
      
    }
  }, [user, data_id]);
  // console.log(bData, blog)
  const onLike = () => {
    api
      .dataLiked({
        blog_id,
        data_id,
        member_id: Number(user.id),
        like: !dLike.checkMember ? "like" : "unlike",
      })
      .then(async (res) => {
        fetchBlogLike(user.id);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const onViewe = () => {
    api
      .dataViewed({ blog_id, data_id })
      .then(async (res) => {
        fetchBlogViewe();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchBlogViewe = () => {
    api
      .getdataViewed(data_id)
      .then(async (res) => {
        let data = res.data;
        setdViewe(data.viewed);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  
  var detail ='';
  if(blog){
    if(blog.content) {
      detail = blog.content.replace(/<[^>]+>/g, '').substring(0, 180);
      // console.log('detail', detail)
    }    
  }

  const isMobile = useMediaQuery(992);

  return (
    <div>
      <Layout
        title={blog ? t('ep')+" " + blog.index + " : " + blog.title : ""}
        isPreview={preview}
        className="mb-5"
      >
      <Head>
        <link rel="stylesheet" href={`${api.frontend_url}/css/content-styles.css`}/>

        <meta name="description" content={detail ? detail : (blog.title ? blog.title : 'Blog Details')} />
        <meta name="keywords" content={`${blog.title}, ${blog.blog_group.title}, ${blog.blog_group.blog_writer.penname1}, ศูนย์หนังสือจุฬาฯ, CHULABOOK`} />
        <meta property="og:type" content="website" /> 
        <meta property="og:title" content={blog.title ? blog.title : 'Blog Details'} /> 
        <meta property="og:description" content={detail ? detail : (blog.title ? blog.title : 'Blog Details')} /> 
        <meta property="og:image" content={blog.blog_data_banner && blog.blog_data_banner.picture ? blog.blog_data_banner.picture : `${api.frontend_url}/images/blog-icon-chapter.png`} /> 
        <meta property="og:url" content={`https://www.chulabook.com/blog/${blog_id}/${data_id}`} /> 
        <meta property="og:site_name" content="CHULABOOK" /> 

        <meta name="twitter:image" content={blog.blog_data_banner && blog.blog_data_banner.picture ? blog.blog_data_banner.picture : `${api.frontend_url}/images/blog-icon-chapter.png`} /> 
        <meta name="twitter:title" content={blog.title} /> 
        <meta name="twitter:description" content={detail ? detail : blog.title} /> 
        <meta name="twitter:site" content="CHULABOOK" /> 
        <meta name="twitter:creator" content="CHULABOOK" /> 
      </Head>
       
      {
        !isMobile ? (
          <MainDataDetail 
            t={t} blog={blog} preview={preview} inrteres={inrteres} 
            onLike={onLike} bData={bData} blog_id={blog_id} data_id={data_id}
            dLike={dLike} user={user} dViewe={dViewe} dComment={dComment}
            fetchComment={fetchComment} limit={limit} all={all}
          />
        ) : (
          <MobileMainDataDetail 
            t={t} blog={blog} preview={preview} inrteres={inrteres} 
            onLike={onLike} bData={bData} blog_id={blog_id} data_id={data_id}
            dLike={dLike} user={user} dViewe={dViewe} dComment={dComment}
            fetchComment={fetchComment} limit={limit} all={all}
          />
        )
      }
       
        
      </Layout>
      <div id="blogAlert1" ></div>
    </div>
  );
}

dataId.getInitialProps = async ({query,res}) => {
  const blog_id = Number(query.blogid);
  const data_id = Number(query.data_id);
  const preview = Number(query.preview);
  let data;
  if (preview) {
    data = { blog_id, data_id, preview };
  } else {
    data = { blog_id, data_id };
    
  }
  const [blog_res,blogData_res] = await Promise.all([
    api.blogDataFont(data),
    api.getBlogDataPage(blog_id, { order: "ASC" }),
  ])
  var blog = blog_res.data;
  if (!blog) {
    res.redirect('/blog')
    res.end();
  }
  var bData = blogData_res.data;
  if (!bData) {
    res.redirect('/blog')
    res.end();
 }

  return { 
    blog,bData
  }; 
}

export default withTranslation("blog_data")(dataId);