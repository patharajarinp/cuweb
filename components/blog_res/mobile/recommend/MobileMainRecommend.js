import React,{useContext,useState,useEffect} from 'react'
import Layout from '../../../../components/layout'
import { Link } from '../../../../utils/i18n'
import Banner from '../../../../components/mobile/carousel';
import UserContext from '../../../../contexts/UserContext';
import { useRouter } from 'next/router';
import api from '../../../../utils/api';
import Card from "../../../../components/mobile/blog/card";
import InfiniteScroll from 'react-infinite-scroller';
import BeatLoader from "react-spinners/BeatLoader";

const MobileMainRecommend = (props) => {
  const { t, query } = props;
  const { user ,local } = useContext(UserContext);
  const router = useRouter();
  const [blog, setblog] = useState();
  const id = router.query.id;
  const [loading, setLoading] = useState(true)
  const [productType, setProductType] = useState();
  const [img, setImg] = useState();
  const [pageCount,setPageCount] = useState(1)
  const [pageNumber, setPagenumber] = useState(0);
  const [pagename, setpagename] = useState()
  const [amount, setamount] = useState(0)
  const [rec, setrec] = useState()
  const LIMIT = 20;
  
  const hasMore = !blog ? true : (blog.rows.length < blog.count);
  const fetchPage = () => {
      var page = id;
      var vendor = 'cu';
      api.getBanner(page, vendor).then(res => {
        const data = res.data;
        var items = [];
        data.banner_images.forEach((item) => {
          if (item.index != 5)
            return true;
          let temp = {
            src: item.image,
            key: 'banner' + Math.random(),
            href: item.link
          }
  
          items.push(temp)
        });
        setImg(items)
      })
        .catch(err => {
          console.log(err.response);
        })
    }

  const fetchdata = async (params) => {
    
    params.page=params.page||1
      api
        .getRecommedAll(id,{...params})
        .then(async (res) => {
          let data = res.data
          let tmp;
          if (blog) {
              tmp = { ...blog };
              const { rows } = tmp;
              tmp.rows = [...rows, ...data.rows];
          }
          else {
              tmp = data;
          }
          setblog(tmp);
          setLoading(false)
          
        })
        .catch((err) => {
          setLoading(false)
          console.log(err.response);
        });
    };
    const fetch = async () => {
      
      api
        .getRecommedCateOne(id)
        .then(async (res) => {
          setrec(res.data)
        })
        .catch((err) => {
          console.log(err.response);
        });
    };
    const fetchLike = async (params) => {
      params.page=params.page||1
      // setLoading(true)
      api
        .getBlogGroupLikedPage({...params})
        .then(async (res) => {
          let data = res.data
          let tmp;
          if (blog) {
              tmp = { ...blog };
              const { rows } = tmp;
              tmp.rows = [...rows, ...data.rows];
          }
          else {
              tmp = data;
          }
          setblog(tmp);
          setLoading(false)
        })
        .catch((err) => {
          console.log(err.response);
          setLoading(false)
        });
    };
    
    const fetchNew = async (params) => {
      params.page=params.page||1
      // setLoading(true)
      api
        .getBlogGroupNewPage({...params})
        .then(async (res) => {
          let data = res.data
          let tmp;
          if (blog) {
              tmp = { ...blog };
              const { rows } = tmp;
              tmp.rows = [...rows, ...data.rows];
          }
          else {
              tmp = data;
          }
          setblog(tmp);
          setLoading(false)
        })
        .catch((err) => {
          console.log(err.response);
          setLoading(false)
        });
    };
  useEffect(() => {
    
      fetchPage()
      if (id == 'blog-new') {
          fetchNew({})
          setpagename('บทความมาใหม่')
      } else if (id == 'blog-pop') {
          fetchLike({})
          setpagename('บทความยอดนิยม')
      }else{
          fetchdata({})
          fetch()
      }
      
  }, [])
  const loadFunc = (page) => {
    setLoading(true)
    if (id == 'blog-new') {
      fetchNew({ page })
        setpagename('บทความมาใหม่')
    } else if (id == 'blog-pop') {
        fetchLike({ page })
        setpagename('บทความยอดนิยม')
    }else{
        fetchdata({ page })
        fetch()
    }
  }
  return (
    <>
      <div className="cart-nav">
          <div className=" text-center cart-nav-title">
          <h4>{rec&&rec.name_th||pagename}</h4>
          </div>
          <Link href="/blog">
              <a className="btn-back cart-nav-back">
              <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
              </a>
          </Link>
      </div>
      <div className="bg-light-less-gray min-vh-100 ">
      <div className="h-64px"></div>
      
          {img && <Banner items={img} />}
          <InfiniteScroll
              pageStart={1}
              loadMore={loadFunc}
              hasMore={!loading && hasMore}
              initialLoad={false}

          >

          <div className="all-card-news ">
          <div className="container d-flex flex-wrap justify-content-between ">
          
              {blog&&
              blog.rows.map((val) => (
                  <div key={Math.random()}className="blog-card-show my-2">
                  <Card data={val.blog_group||val} penname={val.blog_group&&val.blog_group.blog_writer.penname1||val.blog_writer.penname1} />
                  </div>
              ))
              }
              
          </div>
          </div>
        </InfiniteScroll>
        <div className="text-center mt-3" key="loader"><BeatLoader color={"#e9c869"} loading={loading} /></div>
          <div className="h-64px"></div>
      </div>
    </>
  )
}


export default MobileMainRecommend