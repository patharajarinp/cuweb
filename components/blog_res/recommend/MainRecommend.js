import React,{useState,useEffect,useContext} from 'react'
import Layout from '../../../components/layout'
import { useRouter } from 'next/router';
import Banner from '../../../components/banner';
import api from '../../../utils/api';
import CardPH from "../../../components/shimmer/Card";
import { Link, withTranslation ,Router } from "../../../utils/i18n";
import Card from "../../../components/blog/card";
import Paginate from "react-paginate";
import UserContext from '../../../contexts/UserContext';

const MainRecommend = (props) => {
  const { t, query } = props;
  const { user ,local } = useContext(UserContext);
  const router = useRouter();
  const pathname = router.pathname;
  const [blog, setblog] = useState([]);
  const id = router.query.id;
  const [loading, setLoading] = useState(false)
  const [productType, setProductType] = useState();
  const [img, setImg] = useState();
  const [pagename, setpagename] = useState()
  const [pageCount,setPageCount] = useState(1)
  const [pageNumber, setPagenumber] = useState(0);
  const [amount, setamount] = useState(0)
  const [rec, setrec] = useState()
  const LIMIT = 20;
  const fetchPage = () => {
      var page = id;
      var vendor = 'cu';
      api.getBanner(page, vendor).then(res => {
      const data = res.data;
      setProductType(data.type);
      setImg(data.banner_images);
      })
      .catch(err => {
          console.log(err.response);
      })
  } 
  
  const fetchData = async (params) => {
    params.page=params.page||1
      api
        .getRecommedAll(id,{...params})
        .then(async (res) => {
          let data = res.data
          setblog(data.rows);
          setPageCount(Math.ceil(data.count / LIMIT))
          
        })
        .catch((err) => {
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
    const fetchNew = async (params) => {
      params.page=params.page||1
      api
        .getBlogGroupNewPage({...params})
        .then(async (res) => {
          let data = res.data
          setblog(data.rows);
          setPageCount(Math.ceil(data.count / LIMIT))
        })
        .catch((err) => {
          console.log(err.response);
        });
    };
    const fetchLike = async (params) => {
      params.page=params.page||1
      api
        .getBlogGroupLikedPage({...params})
        .then(async (res) => {
          let data = res.data
          setblog(data.rows);
          setPageCount(Math.ceil(data.count / LIMIT))
        })
        .catch((err) => {
          console.log(err.response);
        });
    };
    useEffect(() => { 
      fetchPage()
    }, [])
    useEffect(() => {
      if(document.getElementsByClassName('main-layout')[0]){
        document.getElementsByClassName("main-layout")[0].style.backgroundColor = "rgb(248, 249, 250)";
      }
    },[]);
  useEffect(() => {
// console.log('pathname', pathname)
    query.page &&  setPagenumber(Number(query.page)-1);
      if(id == 'blog_new'){
        query.page ? fetchNew({page:Number(query.page)}) : fetchNew({})
          setpagename(t('blog_new'))
      } else if(id == 'blog_pop'){
        query.page ? fetchLike({page:Number(query.page)}) : fetchLike({})
          setpagename(t('blog_popula'))
      } 
      else{
            fetch()
            query.page ? fetchData({page:Number(query.page)}) : fetchData({})
          }
  }, [query])
  const handlePageClick = (data) => {
    let selected = data.selected;
    
    window.scrollTo(0, 0);
    Router.push({
      pathname,
      query: {
        ...query,
        page: selected + 1,
      },
    },`/blog/recommend/${id}?page=${selected + 1}`);
        
  };

  return (
    <>
    
      <div className="container">      
        <div className="row">
            <Banner data={img} type={productType} />
        </div>
        <div className="row mt-5 pb-4">
            <div className="col-12">
            <div className="text-center">
                <h2>{rec&&rec['name_'+local]||pagename}</h2>
            </div>
            </div>
        </div>
        <div className="row mt-5 pb-4">
            {/* <CardPH show={20} grid={4} /> */}
            {blog.length != 0 ? (
                blog.map((val) => (
                    <div key={Math.random()} className=" col-lg-3 col-4">
                    <Card data={val.blog_group||val} penname={val.blog_group&&val.blog_group.blog_writer.penname1||val.blog_writer.penname1} />
                    </div>
                ))
            ) : (
            <div className="col-12">
                <div className="row d-none d-lg-flex">
                <CardPH show={20} grid={4} />
                </div>
                <div className="row d-none d-lg-none d-md-flex">
                <CardPH show={20} grid={3} />
                </div>
            </div>
            
            )}
        </div>
        
        {pageCount > 1&&
        <div className="blog-pop d-flex justify-content-end">
            <Paginate
            previousLabel={t('back')}
            nextLabel={t('next')}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            forcePage={pageNumber}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
            />
        </div>
        }
        
    </div>
    </>
  )
}


export default MainRecommend