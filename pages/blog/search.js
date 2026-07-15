import React, { useState, useEffect, useContext } from "react";
import Layout from "../../components/layout";
import AuthService from "../../utils/AuthService";
import Head from "next/head";
import api from "../../utils/api";
import tools from "../../utils/tools";
import Slider from "@material-ui/core/Slider";
import classNames from "classnames";
import { CardGrid } from "../../components/widget/card";
import { CardL } from "../../components/widget/card_lanscape";
import UserContext from "../../contexts/UserContext";
import { withTranslation, Link, Router, Trans } from "../../utils/i18n";
import Cookies from "js-cookie";
import Shimmer from "../../components/Shimmer";
import CardPH from "../../components/shimmer/Card";
import Collapse from "react-bootstrap/Collapse";
import { useRouter } from "next/router";
import Loading from "../../components/loading";
import Card from "../../components/blog/card";

// import Router from 'next/router'
const limit = 24;

const Search = ({ text, setProducts }) => {
  
  return (
    <>
      <img src="/icon/blog-book.svg" align="middle" />
      <div>
        <div className="input-group ml-2 ">
          <input
            type="text"
            className="form-control border-right-none"
            // onKeyPress={handleKeyPress}
            // value={search_text}
            // onChange={(e) => setSearch_text(e.target.value)}
            placeholder=""
          />
          {/* <div className="input-group"> */}
          <button
            className="btn btn-outline-primary br-left-none "
            // onClick={go}
            type="button"
          >
            ค้นหา
          </button>
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

const FilterByPrice = () => {
  return (
    <>
      <p className={"py-2 px-4 bg-gray text-white"}>หมวดหมู่บทความ</p>
      <div className="row px-4 mx-0">
        
        
      
      </div>
    </>
  );
};

const Products = ({ query, t }) => {
  const { local } = useContext(UserContext);
  const [view, setView] = useState(1);
  const [products, setProducts] = useState(null);
  const [s_category, setCategory] = useState(null);
  const {
    text,
    field,
    orderby,
    op,
    type,
    main_category,
    lang,
    sub_category,
    category,
    minprice,
    maxprice,
  } = query;
  const router = useRouter();
  const pathname = router.pathname;
  const [loading, setLoading] = useState(false);
  const fetchProducts = (page = 0) => {
    var param = {
      search: text,
      field: field,
      orderby,
      op,
      type,
      main_category,
      lang,
      sub_category,
      minprice,
      maxprice,
      limit,
      page,
    };
    setLoading(true);
    api
      .getProducts(param)
      .then((res) => {
        const data = res.data;
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
      });

    if (!Cookies.get("AcceptCookie")) return;

    var temp = Cookies.get("search")
      ? [...JSON.parse(Cookies.get("search"))]
      : [];
    if (text && temp.findIndex((t) => find(t, text)) == -1) temp.push(text);

    if (temp && Array.isArray(temp) && temp.length > 3) {
      temp.splice(0, 1);
    }
    Cookies.set("search", JSON.stringify(temp));
  };

  const fetchCetagory = () => {
    var param = {
      type,
    };

    api
      .getCateByType(param)
      .then((res) => {
        const data = res.data;
        setCategory(data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    // alert('aa')
    fetchCetagory();
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F8F9FA";
    }
    
  }, []);

  useEffect(() => {
    //alert('aa')
    fetchProducts();
  }, [
    type,
    text,
    field,
    orderby,
    op,
    main_category,
    lang,
    sub_category,
    category,
    minprice,
    maxprice,
  ]);

  

  

  const [textSort, setTextsort] = useState(t("filter:sort"));

  const handleChangeSort = (val) => {
    let split = val.split("-");
    setProducts(null);
    Router.push({
      pathname,
      query: {
        ...query,
        orderby: split[0],
        op: split[1],
      },
    });
    if (val == "pub_year-asc") {
      setTextsort(t("filter:sort_year_asc"));
    } else if (val == "pub_year-desc") {
      setTextsort(t("filter:sort_year_desc"));
    } else if (val == "price-asc") {
      setTextsort(t("filter:sort_price_asc"));
    } else if (val == "price-desc") {
      setTextsort(t("filter:sort_price_desc"));
    } else if (val == "name-asc") {
      setTextsort(t("filter:sort_name_asc"));
    } else if (val == "name-desc") {
      setTextsort(t("filter:sort_name_desc"));
    }
  };

 
  
  
  
 
  

  

  const find = (value, value2) => {
    return value == value2;
  };

  function useWindowSize() {
    const isClient = typeof window === "object";

    function getSize() {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined,
      };
    }

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
      if (!isClient) {
        return false;
      }

      function handleResize() {
        setWindowSize(getSize());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
  }

 

  const size = useWindowSize();
  const [BtnFilter, setBtnFilter] = useState(false);
  const toglefilter = () => setBtnFilter(!BtnFilter);
  const [open, setOpen] = useState(false);

  const [thisPage, setPage] = useState(1);
  const handlePage = (page) => {
    if (page > 0 || Math.ceil(products.count / limit)) {
      // console.log(page);
      setPage(page);
      fetchProducts(page);
    }
  };

  const setPagination = (val) => {
    var pagin = products.count / limit;
    var num = Math.ceil(pagin);
    var page_item = [];
    val = parseInt(val);

    let start = val > 5 ? val - 5 : 0;
    let end = 1;
    if (num >= 10) {
      end = val >= 5 ? Math.min(val + 4, num) : val + (9 - val);
    } else {
      end = num - 1;
    }
    for (var i = start; i <= end; i++) {
      page_item.push(
        <li className="page-item">
          <a
            className={classNames(
              "page-link",
              thisPage !== null ? (thisPage == i + 1 ? "active" : "") : ""
            )}
            data-page={i + 1}
            onClick={(event) => {
              var target = event.target.getAttribute("data-page");
              handlePage(target);
            }}
          >
            {i + 1}
          </a>
        </li>
      );
    }
    return page_item;
  };

  return (
    <>
      <Layout title="Products">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href='/' as={'/'}>
                      <a>หน้าหลัก</a>
                    </Link>
                  </li>
                  <li
                    className={classNames("breadcrumb-item ", {
                      active: !text,
                    })}
                    aria-current="page"
                  >
                    <Link href="/categories" as={`/categories`}>
                      <a>ค้นหา</a>
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    ค้นหา
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-6 col-md-12 d-flex align-items-center">
              <Search text="dcd" />
            </div>
            <div className="col-6 d-none d-lg-block">
              <div className="text-right">
                <label>{t("filter:sort")} :</label>
                <div className="styleSelect input-month ml-2">
                  <div className="btn-group w-100">
                    <button
                      type="button"
                      className="btn dropdown-toggle btn-fill"
                      data-toggle="dropdown"
                    >
                      {textSort}
                    </button>
                    <div className="dropdown-menu">
                      <a
                        onClick={() => handleChangeSort("pub_year-desc")}
                        className="dropdown-item"
                      >
                        {t("filter:sort_year_desc")}
                      </a>
                      <a
                        onClick={() => handleChangeSort("price-asc")}
                        className="dropdown-item"
                      >
                        {t("filter:sort_price_asc")}
                      </a>
                      <a
                        onClick={() => handleChangeSort("price-desc")}
                        className="dropdown-item"
                      >
                        {t("filter:sort_price_desc")}
                      </a>
                      <a
                        onClick={() => handleChangeSort("name-asc")}
                        className="dropdown-item"
                      >
                        {t("filter:sort_name_asc")}
                      </a>
                      <a
                        onClick={() => handleChangeSort("name-desc")}
                        className="dropdown-item"
                      >
                        {t("filter:sort_name_desc")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 mt-3">
              
                <div>
                  <h3 className="font-weight-normal">
                    {
                      <Trans
                        i18nKey={"filter:filter_result"}
                        // values={{
                        //   count: products.count,
                        //   text: text,
                        // }}
                      />
                    }
                  </h3>
                </div>
              
            </div>
          </div>
        </div>

        <div className="container mt-lg-5 mt-md-3">
                    <div className="row ">
            <div className="col-product-filter">
              
              <div className="bg-white border-rounder">
                
                <div
                  className={
                    BtnFilter
                      ? "custom-filter custom-fill show"
                      : "custom-filter custom-fill "
                  }
                >
                  <div className={classNames({ "d-none": type })}>
                    <h3 className="px-4 py-3">{t("filter:title")}</h3>
                  </div>
                  <div className={classNames("filter", { "d-none": !type })}>
                    <div className="d-flex justify-content-between position-relative">
                      <h3 className="px-xl-4 px-2 py-3 m-0">
                        {t("filter:title")}
                      </h3>
                   
                    </div>

                    
                   
                  </div>
                  <FilterByPrice
                  
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-8 col-md-12">
              <div className="row">
                <div className="col-4">
                  <Card />
                </div>
                <div className="col-4">
                  <Card />
                </div>

                <div className="col-4">
                  <Card />
                </div>
                <div className="col-4">
                  <Card />
                </div>
                <div className="col-4">
                  <Card />
                </div>
              </div>

              
            </div>
          </div>
        </div>
        <div className="end-page"></div>
      </Layout>
      <Head>
        <link rel="stylesheet" href={`${api.frontend_url}/css/style_only.css`} />
      </Head>
    </>
  );
};

Products.getInitialProps = ({ query, pathname }) => {
  return { query, pathname };
};
export default withTranslation(["products", "filter"])(Products);
