import React,{useState,useEffect,useContext} from 'react'
import Layout from '../../../../components/layout'
import { Link, Router, withTranslation } from '../../../../utils/i18n'
import Autocomplete from '../../../../components/mobile/Autocomplete'
import classnames from "classnames";
import Card from '../../../../components/mobile/blog/card';
import api from '../../../../utils/api';
import { useRouter } from 'next/router';
import UserContext from '../../../../contexts/UserContext';
import InfiniteScroll from 'react-infinite-scroller';
import BeatLoader from "react-spinners/BeatLoader";

const MobileMainFilter = (props) => {
  const { t, query } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const [showfil, setshowfil] = useState(false);
  const togglefill = () => setshowfil(!showfil);
  const [fill, setfill] = useState(null);
  const [cate, setcate] = useState([]);
  const router = useRouter();
  const pathname = router.pathname;
  const { local } = useContext(UserContext);
  const [text, settext] = useState("");
  const [blog, setblog] = useState();
  const [pageCount, setPageCount] = useState(1);
  const [pageNumber, setPagenumber] = useState(0);
  const [amount, setamount] = useState(0);
  const [load, setload] = useState(false);
  const LIMIT = 20;
  const [classitemlg, setclassitemlg] = useState(3)
  const [classitem, setclassitem] = useState(4)
  const [classitemcol, setclassitemcol] = useState(12)
  const [classdis, setclassdis] = useState("blod-lg-d-none")
  const [classdisfil, setclassdisfil] = useState("blod-lg-filter")
  const [classitemcolmd, setclassitemcolmd] = useState(12)
  //   const {page,type,cate,blog,orderby } = query;
  const [loading, setLoading] = useState(true)
  const hasMore = !blog ? true : (blog.rows.length < blog.count);
  const fetchFillter = (params) => {
    
    api
      .getBlogGroupFillter({ ...params })
      .then((res) => {
        const data = res.data;
        // let tmp;
        // if (blog) {
        //     tmp = { ...blog };
        //     const { rows } = tmp;
        //     tmp.rows = [...rows, ...data.rows];
        // }
        // else {
        //     tmp = data;
        // }
        setblog(data);
        // setPageCount(Math.ceil(data.count / LIMIT));
        // console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response);
      });
  };
  useEffect(() => {
  
    window.scrollTo(0, 0);
    getCate();
    getFillter();
    fetchFillter(query);
    settext(query.blog ? query.blog : "");
    
  }, [query]);
  const getFillter = () => {
    api
      .getFillter()
      .then(async (res) => {
        setfill(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const getCate = () => {
    api
      .getBlogCategory()
      .then(async (res) => {
        setcate(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const handleRoute = (obj = {}) => {
    Router.push({
      pathname,
      query: {
        ...query,
        ...obj,
      },
    });
  };
  const handleOpenAiChat = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-mobile-ai-chat'));
    }
  };
  const handlePageClick = (data) => {
    let selected = data.selected;
    setPagenumber(selected);
    window.scrollTo(0, 0);
    Router.push({
      pathname,
      query: {
        ...query,
        page: selected + 1,
      },
    });
  };
  const checkcate = (val) => {
    let b = fill.cate.findIndex((vall) => vall.id == val.id);
    // console.log("b", b);
    return formatNum(fill.cate[b].count);
    // if (b.length == 0) return 0;
  };
  const handleFilterClick= ()=>{
    if (classitemlg == 3) {
      setclassitemlg(4)
    } else {
      
      setTimeout(()=>{
        setclassitemlg(3)
      },500)
    }
    if (classitem == 4) {
      setclassitem(6)
    } else {
      setTimeout(()=>{
        setclassitem(4)
      },500)
      
    }
    if (classitemcol == 12) {
      setclassitemcol(9)
    } else {
      setTimeout(()=>{
        setclassitemcol(12)
      },500)
      
    }
    if (classdis == "blod-lg-d-none") {
      setclassdis("blod-d-flex")
    }else{
      setTimeout(()=>{
        setclassdis("blod-lg-d-none")
      },500)
      
    }
    if (classitemcolmd == 12) {
      setclassitemcolmd(8)
    }else{
      setTimeout(()=>{
        setclassitemcolmd(12)
      },500)
    
    }
    if (classdisfil == "blod-lg-filter") {
      setclassdisfil("blod-lg-filter-on")
    }else{
      setclassdisfil("blod-lg-filter")
    }
  }
  function formatNum (labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toString().slice(0, 4) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? (Math.abs(Number(labelValue)) / 1.0e+6).toString().slice(0, 4) + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? (Math.abs(Number(labelValue)) / 1.0e+3).toString().slice(0, 4) + "K"

    : Math.abs(Number(labelValue));

  }
  const loadFunc = (page) => {
    if (!loading) setLoading(true)
    
    api
      .getBlogGroupFillter({...query,page })
      .then((res) => {
        const data = res.data;
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
        // setPageCount(Math.ceil(data.count / LIMIT));
        // console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response);
      });

  }

  return (
    <>
      <div className={ "order-border order-nav h-64px"}>
        <div className="d-flex container">
            <Link href="/blog">
                <a className="btn-back cart-nav-back"  >
                    <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
                </a>
            </Link>
            <div className="ml-4 w-100">
            <div>
                <div className="d-flex align-items-center">
                    <div className={"box-search w-100"}>
                        <div className="icon-search">
                        <img src={'/mobile/image/icon/icon-search.svg'} />
                        </div>
                        <input type="text"
                          value={text}
                          onChange={(e) => settext(e.target.value)}
                          placeholder={t('input_search')}
                          onKeyDown={(e)=>{
                          if (e.keyCode === 13) {
                            handleRoute({ blog: text });
                          }
                        }}
                        className="autocomplete-input"  />
                    </div>
                    <button
                      type="button"
                      className="ml-2 d-flex align-items-center justify-content-center"
                      onClick={handleOpenAiChat}
                      style={{ width: 34, height: 34, border: '1px solid #bdbdbd', borderRadius: 8, background: '#fff' }}
                    >
                      <span style={{fontSize: 12, fontWeight: 'bold'}}>AI</span>
                    </button>
                </div>
            </div>
                {/* suggestions={[
                        "โรคไข้หวัดใหญ่",
                        "โรคผิวหนัง",
                        "โรคโปลิโอ",
                        "โรคพิษสุนัขบ้า"
                    ]} */}
            </div>
            
        </div>
    </div>
    <div className="bg-light-less-gray min-vh-100 ">
      <div className="h-64px"></div>

      <div className=" bg-white d-flex justify-content-between py-3 order-border px-20px">
          <div className="d-flex my-auto" onClick={toggle} >
              <p className="my-auto blog-text-yellow"> 
              {query.orderby == "viewed" && t('mobile_blog_filter:filter_viewed')}
              {query.orderby == "liked" && t('mobile_blog_filter:filter_liked')}
              {query.orderby == "DESC" && t('mobile_blog_filter:filter_desc')}
              {query.orderby == "ASC" && t('mobile_blog_filter:filter_asc')}
              {!query.orderby && t('mobile_blog_filter:filter_by')}</p>
              <i className="fas fa-sort-down blog-text-yellow ml-2 mb-auto"></i>
          </div>
          <div className="d-flex my-auto" onClick={togglefill}>
              <i className="fas fa-filter my-auto mr-2 my-auto blog-text-grey"></i>
              <p className="my-auto blog-text-grey">{t('mobile_blog_filter:filter')}</p>
          </div>
      </div>
      <div className={classnames("dropdown-fill", { "d-none": !dropdownOpen })}>
          <div className="d-flex justify-content-between my-auto dropdown-fill-list" onClick={() => {handleRoute({ orderby: "viewed" });}} >
              <p className={query.orderby == "viewed" ?"my-auto blog-text-yellow" :"my-auto text-black"} >{t('mobile_blog_filter:filter_viewed')}</p>
              <img className={query.orderby == "viewed" ?"img-fluid":'d-none' } src="/icon/blog/icon-check-fill.svg" />
          </div>
          <div className="d-flex justify-content-between my-auto dropdown-fill-list" onClick={() => {handleRoute({ orderby: "liked" });}} >
              <p className={query.orderby == "liked" ?"my-auto blog-text-yellow" :"my-auto text-black"} >{t("mobile_blog_filter:filter_liked")}</p>
              <img className={query.orderby == "liked" ?"img-fluid":'d-none' } src="/icon/blog/icon-check-fill.svg" />
          </div>
          <div className="d-flex justify-content-between my-auto dropdown-fill-list" onClick={() => {handleRoute({ orderby: "DESC" });}} >
              <p className={query.orderby == "DESC" ?"my-auto blog-text-yellow" :"my-auto text-black"} >{t('mobile_blog_filter:filter_desc')}</p>
              <img className={query.orderby == "DESC" ?"img-fluid":'d-none' } src="/icon/blog/icon-check-fill.svg" />
          </div>
          <div className="d-flex justify-content-between my-auto dropdown-fill-list" onClick={() => {handleRoute({ orderby: "ASC" });}} >
              <p className={query.orderby == "ASC" ?"my-auto blog-text-yellow" :"my-auto text-black"} >{t('mobile_blog_filter:filter_asc')}</p>
              <img className={query.orderby == "ASC" ?"img-fluid":'d-none' } src="/icon/blog/icon-check-fill.svg" />
          </div>
      </div>
      <h3 className="font-weight-normal ml-4 mt-3">{t('mobile_blog_filter:product_found')} {query.blog&&query.blog!= ''?`"${query.blog}"`: ``}</h3>
      <InfiniteScroll
          pageStart={1}
          loadMore={loadFunc}
          hasMore={!loading && hasMore}
          initialLoad={false}

      >

      <div className="all-card-news ">
        
        <div className="container d-flex flex-wrap justify-content-between ">
          
          {blog&&blog.rows.length != 0 ?
              blog.rows.map((val, index) => (
                <div key={Math.random()} className="blog-card-show my-2">
                  <Card data={val} penname={val.blog_writer.penname1} />
                </div>
              )):<div className=" w-100 my-3"><h3 className="text-center">{t('mobile_blog_filter:no_blog')}</h3></div>}
        </div>
      </div>

      </InfiniteScroll>
      <div className="text-center mt-3" key="loader"><BeatLoader color={"#e9c869"} loading={loading} /></div>
      <div className="footer-space"></div>
    </div>
    <div className={classnames("filter-select-bg", { "show": showfil })}></div>
    <div className={classnames("filter-select", { "show": showfil })}>

        <div onClick={togglefill} style={{ position: "absolute", top: 0, left: 0, transition: 'unset', zIndex: 0 }} className={classnames("filter-select", { "show": showfil })}>
        </div>
        <div style={{ zIndex: 2 }} className="filter-select-list blog-md-filter">
            <div>
                <div className="filter-select-collapse-main">
                    <h4 className="my-auto">{t('mobile_blog_filter:writer_type')}</h4>
                </div>
                <div className="d-flex justify-content-between flex-wrap p-2">
                    <div className={query.type == 0 ?"categories-btn active " :'categories-btn'} onClick={() => handleRoute({ type: 0 })} >
                        <p className="text-black m-auto p-12">{t('mobile_blog_filter:type_one')} </p>
                    </div>
                    <div className={ query.type == 1 ?"categories-btn active ":"categories-btn" } onClick={() => handleRoute({ type: 1 })}>
                        <p className="text-black m-auto p-12"> {t('mobile_blog_filter:eps')} </p>
                    </div>
                </div>
                <div className="filter-select-collapse-main">
                    <h4 className="my-auto">{t('mobile_blog_filter:cate')}</h4>
                </div>
                <div className="d-flex justify-content-between flex-wrap p-2">
                    {cate
                      ? cate.map((val, index) => (
                        <div  key={Math.random()} className={query.cate == val.id ? "categories-btn active ":'categories-btn' } onClick={() => handleRoute({ cate: val.id })}>
                          <p className="text-black m-auto p-12">{val.name_th} </p>
                        </div>
                        ))
                      : null}
                </div>
            </div>
            <div className="h-56px"></div>
        </div>
        <div className="success-manu-fill">
            <a className="btn-success-menu" onClick={() => {Router.push('/blog/filter'); togglefill();}} ><h4 className=" blog-text-yellow m-auto" >{t('mobile_blog_filter:reset')}</h4></a>
            <a className="btn-success-menu blog-bg-yellow" onClick={() => {togglefill();}}><h4 className="text-white m-auto">{t('mobile_blog_filter:submit')}</h4></a>
        </div>
    </div>
      
    </>
  )
}


export default MobileMainFilter