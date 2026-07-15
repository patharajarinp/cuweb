import React, { useEffect, useState, useContext } from "react";
import Layout from "../../../components/layout";
import { Link, Router, withTranslation } from "../../../utils/i18n";
import Paginate from "react-paginate";
import api from "../../../utils/api";
import { useRouter } from "next/router";
import UserContext from "../../../contexts/UserContext";
import Card from "../../../components/blog/card";
import Loading from "../../../components/loading";


const MainFilter = (props) => {
  const { t, query } = props;
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
  const fetchFillter = (params) => {
    api
      .getBlogGroupFillter({ ...params })
      .then((res) => {
        const data = res.data;
        setblog(data);
        setPageCount(Math.ceil(data.count / LIMIT));
        // console.log(data);
        setload(false);
      })
      .catch((err) => {
        setload(false);
        console.log(err.response);
      });
  };
  useEffect(() => {
    setload(true);
    window.scrollTo(0, 0);
    getCate();
    
    fetchFillter(query);
    settext(query.blog ? query.blog : "");
   
    query.page && setPagenumber(Number(query.page)-1); 
  }, [query]);
  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName("main-layout")[0].style.backgroundColor = "#F8F9FA";
    }
  },[]);
  const getFillter = (params) => {
    api
      .getFillter({...params})
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
  const handlePageClick = (data) => {
    let selected = data.selected;
    // setPagenumber(selected);
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

  return (
    <>
      {load ? (
        <Loading />
                ) : (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href='/' as={'/'}>
                      <a>{t('home')}</a>
                    </Link>
                  </li>
                  <li className={"breadcrumb-item "} aria-current="page">
                    <Link href="/blog" as={`/blog`}>
                      <a>{t('blog')}</a>
                    </Link>
                  </li>
                  <li className={"breadcrumb-item "} aria-current="page">
                    <Link href="/blog/filter" as={`/blog/filter`}>
                      <a>{t('search')}</a>
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {query.blog ? query.blog : ""}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-12 d-flex align-items-center">
              <img src="/icon/blog-book.svg" align="middle" />
              <div>
                <div className="input-group ml-2 ">
                  <input
                    type="text"
                    className="form-control placeholder border-right-none blog-form"
                    // onKeyPress={handleKeyPress}
                    value={text}
                    onChange={(e) => settext(e.target.value)}
                    placeholder={t('input_search')}
                    onKeyUp={(e) => {
                      if (e.keyCode === 13 && e.target.value) {
                        Router.push({ pathname : '/blog/filter' ,query : {...query,blog:e.target.value}})
                      }
                    } }
                  />
                  {/* <div className="input-group"> */}
                  <button
                    className="btn btn-outline-primary br-left-none blog-from-btn"
                    onClick={() => {
                      handleRoute({ blog: text });
                    }}
                    type="button"
                  >
                    {t('search')}
                  </button>
                  {/* </div> */}
                </div>
              </div>
            </div>
            <div className="col-6 d-none d-lg-block">
              <div className="text-right blod-lg-d-none">
                <label>{t('filter_by')} :</label>
                <div className="styleSelect input-month ml-2">
                  <div className="blog-table-contents btn-group w-100">
                    <button
                      type="button"
                      className="btn dropdown-toggle btn-fill"
                      data-toggle="dropdown"
                    >
                      {query.orderby == "viewed" && t('filter_viewed')}
                      {query.orderby == "liked" && t('filter_liked')}
                      {query.orderby == "DESC" && t('filter_desc')}
                      {query.orderby == "ASC" && t('filter_asc')}
                      {!query.orderby && t('filter_by')}
                    </button>
                    <div className="dropdown-menu">
                      <a
                        className={`dropdown-item ${
                          query.orderby == "viewed" ? "active" : ""
                        }`}
                        onClick={() => {
                          handleRoute({ orderby: "viewed" });
                        }}
                      >
                        {t('filter_viewed')}
                      </a>
                      <a
                        className={`dropdown-item ${
                          query.orderby == "liked" ? "active" : ""
                        }`}
                        onClick={() => {
                          handleRoute({ orderby: "liked" });
                        }}
                      >
                        {t('filter_liked')}
                      </a>
                      <a
                        className={`dropdown-item ${
                          query.orderby == "DESC" ? "active" : ""
                        }`}
                        onClick={() => {
                          handleRoute({ orderby: "DESC" });
                        }}
                      >
                        {t('filter_desc')}
                      </a>
                      <a
                        className={`dropdown-item ${
                          query.orderby == "ASC" ? "active" : ""
                        }`}
                        onClick={() => {
                          handleRoute({ orderby: "ASC" });
                        }}
                      >
                        {t('filter_asc')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 mt-3">
              <div>
                <h3 className="font-weight-normal">{blog? blog.count :''} {t('product_found')} {query.blog&&query.blog!= ''?`"${query.blog}"`: ``}</h3>
              </div>
            </div>
          </div>
          <div className="row mt-3 d-none blod-lg-d-flex">
            <div className="col-4">
              <button type="button" className={`blog-detail-story-detail-card-btn-n ${classdisfil == 'blod-lg-filter-on'?`blog-detail-story-detail-card-btn-h text-white`:``}`} onClick={handleFilterClick} >
                      <img src={classdisfil == 'blod-lg-filter-on'?`/icon/blog-filter-icon-w.svg`:`/icon/blog-filter-icon.svg`} />{classdisfil == 'blod-lg-filter-on'?'ซ้อนตัวกรอง':'ตัวกรอง'}</button>
            </div>
              <div className="col-8">

            <div className="text-right">
            <label>{t('filter_by')} :</label>
                <div className="styleSelect input-month ml-2">
                  <div className="blog-table-contents btn-group w-100">
                    <button
                      type="button"
                      className="btn dropdown-toggle btn-fill"
                      data-toggle="dropdown"
                    >
                      {query.orderby == "viewed" && t('filter_viewed')}
                      {query.orderby == "liked" && t('filter_liked')}
                      {query.orderby == "DESC" && t('filter_desc')}
                      {query.orderby == "ASC" && t('filter_asc')}
                      {!query.orderby && t('filter_by')}
                    </button>
                    <div className="dropdown-menu">
                      <a
                        className={`dropdown-item ${
                          query.orderby == "viewed" ? "active" : ""
                        }`}
                        onClick={() => {
                          handleRoute({ orderby: "viewed" });
                        }}
                      >
                        {t('filter_viewed')}
                      </a>
                      <a
                        className={`dropdown-item ${
                          query.orderby == "liked" ? "active" : ""
                        }`}
                        onClick={() => {
                          handleRoute({ orderby: "liked" });
                        }}
                      >
                        {t('filter_liked')}
                      </a>
                      <a
                        className={`dropdown-item ${
                          query.orderby == "DESC" ? "active" : ""
                        }`}
                        onClick={() => {
                          handleRoute({ orderby: "DESC" });
                        }}
                      >
                        {t('filter_desc')}
                      </a>
                      <a
                        className={`dropdown-item ${
                          query.orderby == "ASC" ? "active" : ""
                        }`}
                        onClick={() => {
                          handleRoute({ orderby: "ASC" });
                        }}
                      >
                        {t('filter_asc')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          <div className="row mt-3">
            <div className={`col-product-filter ${classdis} `}>
              <div className={`bg-white ${classdisfil} `}>
                <div >
                  <div>
                    <h3 className="px-4 py-3">{t('filter')}</h3>
                  </div>
                  <div className="filter d-none">
                    <div className="d-flex justify-content-between position-relative">
                      <h3 className="px-xl-4 px-2 py-3 m-0">{t('filter')}</h3>
                    </div>
                  </div>
                  <p className="py-2 px-4 bg-gray text-white">
                    {t('writer_type')}
                  </p>
                  <a onClick={() => handleRoute({ type: 0 })}>
                    <p
                      className={`py-1 px-4 ${
                        query.type == 0 ? "blog-text-active" : ""
                      }`}
                    >
                      {t('type_one')}
                    </p>
                  </a>
                  <a onClick={() => handleRoute({ type: 1 })}>
                    <p
                      className={`py-1 px-4 ${
                        query.type == 1 ? "blog-text-active" : ""
                      }`}
                    >
                      {t('eps')} 
                    </p>
                  </a>
                  <div className="row px-4 mx-0"></div>
                  <p className="py-2 px-4 bg-gray text-white">
                    {t('cate')}
                  </p>
                  {cate
                    ? cate.map((val, index) => (
                        <a
                          key={Math.random()}
                          onClick={() => handleRoute({ cate: val.id })}
                        >
                          {" "}
                          <p
                            className={`py-1 px-4 ${
                              query.cate == val.id ? "blog-text-active" : ""
                            }`}
                          >
                            {val['name_'+local] || val.name_th}
                          </p>
                        </a>
                      ))
                    : null}
                  <p className="py-1 px-4"></p>
                </div>
              </div>
            </div>
            <div className={`col-xl-9 col-lg-${classitemcol} col-md-${classitemcolmd}`}>
              <div className="row">
                {blog&&blog.rows&&blog.rows.length != 0 ?
                  blog.rows.map((val, index) => (
                    <div key={Math.random()} className={`col-xl-4 col-lg-${classitemlg} col-${classitem}`}>
                      <Card data={val} penname={val.blog_writer.penname1} />
                    </div>
                  )):<div className="col-12"><h3 className="text-center">{t('no_blog')}</h3></div>}
              </div>

              {/* Blog */}
            </div>
          </div>
          {pageCount > 1 && (
            <div className="blog-pop d-flex justify-content-end">
              <Paginate
                previousLabel={"ก่อนหน้า"}
                nextLabel={"ถัดไป"}
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
          )}

          <div className="end-page"></div>
        </div>

      )}
      
    </>
  )
}


export default MainFilter