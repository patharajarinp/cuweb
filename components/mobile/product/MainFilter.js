import Slider from '@material-ui/core/Slider';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import classnames from "classnames";
import Cookies from 'js-cookie';
// import Router from "next/router";
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import BeatLoader from "react-spinners/BeatLoader";
// import Layout from '../../components/layout';
import Paginate from 'react-paginate';
import CardGrid from '../../../components/mobile/widget/Card';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import tools from '../../../utils/tools';
import BreadcrumbMB from '../BreadcrumbMB';
import Filter from './Filter';
import { Link, Router, withTranslation } from "../../../utils/i18n";
import SEODetail from '../../filter/SEODetail';
import CateFilter from './CateFilter';

const useStyles = makeStyles(theme => ({
  root: {
    width: 200 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
  <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
  </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

const iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const marks = [
  {
    value: 0,
  },
  {
    value: 20,
  },
  {
    value: 37,
  },
  {
    value: 100,
  },
];

const AirbnbSlider = withStyles({
  root: {
    color: '#EE5294',
    height: 3,
    padding: '13px 0',
  },
  thumb: {
    height: 24,
    width: 24,
    borderRadius: '25%'
    ,
    backgroundColor: '#fff',
    border: '2px solid #EE5294',
    marginTop: -12,
    marginLeft: -13,
    boxShadow: '#ebebeb 0px 2px 2px',
    '&:focus,&:hover,&$active': {
        boxShadow: '#ccc 0px 2px 3px 1px',
    },
    '& .bar': {
      // display: inline-block !important;
      height: 9,
      width: 1,
      backgroundColor: '#EE5294',
      marginLeft: 1,
      marginRight: 1,
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 3,
  },
  rail: {
    color: '#d8d8d8',
    opacity: 1,
    height: 3,
  },
})(Slider);

function AirbnbThumbComponent(props) {
    return (<span {...props}> </span>);
}

function serialize(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      if(Array.isArray(obj[p])){
        obj[p].forEach(val => {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(val));
        })
      } 
      else{
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
  return str.join("&");
}

const MainFilter = (props) => {
  const { query, pathname, t, invisible, setinvisible, user, seller_id, isSeller,shop_name, 
    s_category, products, level, level1_id, level2_id, level3_id, page_path, type,main, currentLanguage, cateData} = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedthis, setselectedthis] = useState("l01");
  const [formselectedthis, setformselectedthis] = useState(t('header:sort_year_desc'));
  const [mainShow, setMainShow] = useState(false);
  const toggleMainShow = () => setMainShow(!mainShow)
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const classes = useStyles();
  const [showfil, setshowfil] = useState(false);
  const togglefill = () => setshowfil(!showfil);
  const [prevScrollpos, setprevScrollpos] = useState("");
  const [visible, setvisible] = useState(false);
  
  const [value, setValue] = React.useState([0, 10000]);
  const [btnmore, setBtnmore] = useState(false)
  const { text, field, orderby, op,lang, main_category, sub_category, category, minprice, maxprice,seller_name,have_stock,page } = query;
  const limit = 20;
  //const [page , setLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [cateTemp, setCateTemp] = useState({})
  const hasMore = !products ? true : (products.rows.length < products.count);
  const { local } = useContext(UserContext)
  const [pageCount,setPageCount] = useState(1)
 
  useEffect(() => {
    setformselectedthis(t('header:sort_year_desc'))
  }, [])
 

  const setCategories = (_type) => {
    if(type != 'categories') 
      reset()
    else
      handleRedirect('type', _type)
  }

  const reset = () => {

    // let query = text ? { text } : {}

    // if(shop_name) query.shop_name = shop_name
    var as;
    let new_query = {...query, text : text ? { text } : {}}
    // delete new_query.shop_name
    // console.log('query', new_query);
    // alert(new_query.shop_name);
    if(new_query.shop_name){
      let query_str = serialize(new_query)
      as = `/seller/${query.shop_name}`
      Router.push(`/seller/[seller_name]?seller_name=${query.shop_name}`, as);
    }else{
      Router.push('/categories');
    }
  }

  const handleRedirect = (_type, data) => {
    console.log('_type', _type);
    console.log('data', data);
    console.log('level', level);
    var as;
    let new_query = {...query, [_type] :data, shop_name : query.shop_name || shop_name}
    let prep_query = {...new_query}
    delete new_query.seller_name
    delete new_query.main_category
    delete new_query.sub_category
    delete new_query.category
    delete new_query.lng
    delete new_query.subpath
    delete new_query.type

    if(!new_query.shop_name) delete new_query.shop_name

    var query_str = tools.serializeURL(new_query)

    if(seller_name){
      as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
    }
    
   
    var route;
    
    if(_type != 'type' && _type != 'main_category' && _type != 'sub_category' && _type != 'category') {
      if(level == 0) {
        route = `/${page_path}`
        as = `/${page_path}${query_str ? `?${query_str}` : ''}`
      }
      if(level == 1) {
        route = `/${page_path}/[main_category]`
        as = `/${page_path}/${level1_id}${query_str ? `?${query_str}` : ''}`
      }
      if(level == 2) {
        route = `/${page_path}/[main_category]/[sub_category]`
        as = `/${page_path}/${level1_id}/${level2_id}${query_str ? `?${query_str}` : ''}`
      }
      if(level == 3) {
        route = `/${page_path}/[main_category]/[sub_category]/[category]`
        as = `/${page_path}/${level1_id}/${level2_id}/${level3_id}${query_str ? `?${query_str}` : ''}`
      }
      Router.push({
        pathname : route,
        query: {
          ...prep_query
        }
      },as);
    }else{
      if(_type === 'type') {
        let path = data == 'book' ? 'books' : data == 'ebook' ? 'ebooks' : data == 'course' ? 'courses' : 'stationeries'
        route = `/${path}`
        as = `/${path}${query_str ? `?${query_str}` : ''}`
  
      }
      
      if(_type == 'main_category') {
        let isChecked = !!s_category[type].find((tmp) => tmp.url_name == main_category);
        if(!isChecked) {
          prep_query.main_category = data
          route = `/${page_path}/[main_category]`
          as = `/${page_path}/${data}${query_str ? `?${query_str}` : ''}`
        }else{
          delete prep_query.main_category;
          delete prep_query.sub_category;
          delete prep_query.category;
          route = `/${page_path}`
          as = `/${page_path}${query_str ? `?${query_str}` : ''}`
        }
      };
      if(_type == 'sub_category') {
        let isChecked = !!s_category[type]?.find((tmp) => tmp.url_name == main_category)?.subs?.find((tmp) => tmp.url_name == sub_category);
        if(!isChecked) {
          prep_query.sub_category = data
          route = `/${page_path}/[main_category]/[sub_category]`
          as = `/${page_path}/${level1_id}/${data}${query_str ? `?${query_str}` : ''}`
        }else{
          delete prep_query.sub_category;
          delete prep_query.category;
          route = `/${page_path}/[main_category]`
          as = `/${page_path}/${level1_id}${query_str ? `?${query_str}` : ''}`
        }
      };
      if(_type == 'category') {
        let isChecked = !!s_category[type]?.find((tmp) => tmp.url_name == main_category)?.subs?.find((tmp) => tmp.url_name == sub_category)?.items.find((tmp) => tmp.url_name == category);
        if(!isChecked) {
          prep_query.category = data
          route = `/${page_path}/[main_category]/[sub_category]/[category]`
          as = `/${page_path}/${level1_id}/${level2_id}/${data}${query_str ? `?${query_str}` : ''}`
        }else{
          delete prep_query.category;
          route = `/${page_path}/[main_category]/[sub_category]`
          as = `/${page_path}/${level1_id}/${level2_id}${query_str ? `?${query_str}` : ''}`
        }
      }
  
      Router.push({
        pathname : route,
        query: {
          ...prep_query
        }
      },as);
    }
    

    
    
  };

  const handleRedirectWithCategory = (data1, data2) => {
    // alert([data1,data2].join('-'))
    // data1 = data1.toString()
    // data2 = data2.toString()
    // let check1 = Array.isArray(sub_category) ? sub_category.indexOf(data1) != -1 : sub_category == data1;
    // let check2 = Array.isArray(category) ? category.indexOf(data2) != -1 : category == data2;


    // let tmp1 = []
    // if (Array.isArray(query["sub_category"])) {
    //   tmp1.push(...query["sub_category"])
    // } else if (query["sub_category"]) {
    //   tmp1.push(query["sub_category"])
    // }

    // let tmp2 = []
    // if (Array.isArray(query["category"])) {
    //   tmp2.push(...query["category"])
    // } else if (query["category"]) {
    //   tmp2.push(query["category"])
    // }

    

    // if (check1 && check2) {
    //   let main_list = s_category[s_category.findIndex((c) => main_category == c.id)]
    //   let sub_list = main_list.subs[main_list.subs.findIndex((c) => data1 == c.id)]
    //   if (sub_list.items.findIndex((t) => {
    //     return t.id != data2 ? tmp2.indexOf(t.id.toString()) != -1 : false
    //   }) == -1) {
    //     let index = tmp1.findIndex((t) => data1 == t)
    //     if (index != -1)
    //       tmp1.splice(index, 1)
    //   }

    //   let index = tmp2.findIndex((t) => data2 == t)
    //   if (index != -1)
    //     tmp2.splice(index, 1)
    // } else {
    //   let index = tmp1.findIndex((t) => data1 == t)
    //   if (index != -1)
    //     tmp1.splice(index, 1)

    //   tmp1.push(data1)
    //   tmp2.push(data2)
    // }

    // if (tmp1.length == 0)
    //   delete query["sub_category"]
    // else
    //   query["sub_category"] = tmp1

    // if (tmp2.length == 0)
    //   delete query["category"]
    // else
    //   query["category"] = tmp2

    // var as;
    // let new_query = {...query}

    // console.log('new_query',new_query)
    

    // delete new_query.seller_name
    // if(seller_name){
    //   let query_str = serialize(new_query)
    //   as = `/seller/${seller_name}?`+query_str
    // }

    // console.log('data1', data1);
    // console.log('data2', data2);
    // Router.push({
    //   pathname,
    //   query: {
    //     ...query
    //   }
    // }, as);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });

  const handleInput = (event) => {
    let val = 0;
    if (parseInt(event.target.value) === NaN)
      val = 0
    else
      val = parseInt(event.target.value)

    if (event.target.name == 'start')
      if (val > value[1])
        setValue([value[1], value[1]])
      else
        setValue([val, value[1]])
    else
      if (val < value[0]) {
        setValue([value[0], value[0]]);
      } else {
        setValue([value[0], val])
      }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const filterByPrice = () => {
    query['maxprice'] = value[1]
    query['minprice'] = value[0]
    var as;
    let new_query = {...query, shop_name : query.shop_name || shop_name}
    let prep_query = {...new_query}
    delete new_query.seller_name
    delete new_query.main_category
    delete new_query.sub_category
    delete new_query.category
    delete new_query.lng
    delete new_query.subpath
    delete new_query.type

    if(!new_query.shop_name) delete new_query.shop_name

    var query_str = tools.serializeURL(new_query)

    if(seller_name){
      as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
    }

    var route;
    if(level == 0) {
      route = `/${page_path}`
      as = `/${page_path}${query_str ? `?${query_str}` : ''}`
    }
    if(level == 1) {
      route = `/${page_path}/[main_category]`
      as = `/${page_path}/${level1_id}${query_str ? `?${query_str}` : ''}`
    }
    if(level == 2) {
      route = `/${page_path}/[main_category]/[sub_category]`
      as = `/${page_path}/${level1_id}/${level2_id}${query_str ? `?${query_str}` : ''}`
    }
    if(level == 3) {
      route = `/${page_path}/[main_category]/[sub_category]/[category]`
      as = `/${page_path}/${level1_id}/${level2_id}/${level3_id}${query_str ? `?${query_str}` : ''}`
    }
    
    Router.push({
      pathname : route,
      query: {
        ...prep_query
      }
    },as)
  }

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = prevScrollpos > 50;
    setprevScrollpos(currentScrollPos);
    setinvisible(!visible);
    if (currentScrollPos === 0) {
        setinvisible(true);
    }
  };

  const handleChangeSort = (val, name, select) => {
    let split = val.split('-')
    var as;
    let new_query = {...query,orderby: split[0],op: split[1], shop_name : query.shop_name || shop_name}
    let prep_query = {...new_query}
    delete new_query.seller_name
    delete new_query.main_category
    delete new_query.sub_category
    delete new_query.category
    delete new_query.lng
    delete new_query.subpath
    delete new_query.type

    if(!new_query.shop_name) delete new_query.shop_name

    var query_str = tools.serializeURL(new_query)

    if(seller_name){
      as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
    }

    var route;
    if(level == 0) {
      route = `/${page_path}`
      as = `/${page_path}${query_str ? `?${query_str}` : ''}`
    }
    if(level == 1) {
      route = `/${page_path}/[main_category]`
      as = `/${page_path}/${level1_id}${query_str ? `?${query_str}` : ''}`
    }
    if(level == 2) {
      route = `/${page_path}/[main_category]/[sub_category]`
      as = `/${page_path}/${level1_id}/${level2_id}${query_str ? `?${query_str}` : ''}`
    }
    if(level == 3) {
      route = `/${page_path}/[main_category]/[sub_category]/[category]`
      as = `/${page_path}/${level1_id}/${level2_id}/${level3_id}${query_str ? `?${query_str}` : ''}`
    }
    
    Router.push({
      pathname : route,
      query: {
        ...prep_query
      }
    },as)
    setselectedthis(select);
    setformselectedthis(name);
    toggle();
  }

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }
  // console.log('local', s_category)

  useEffect(() => {
    if(!products && !!!products?.count) return
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, [products]);
  
  useEffect(() => {
    if(!products) return;
    setPageCount(products.count / limit);
  }, [products])

  const handlePageClick = data=>{
    let selected = data.selected;
    //setPagenumber(selected);
    var as;
    let new_query = {...query,page: selected+1, shop_name : query.shop_name || shop_name}
    let prep_query = {...new_query}
    delete new_query.seller_name
    delete new_query.main_category
    delete new_query.sub_category
    delete new_query.category
    delete new_query.lng
    delete new_query.subpath
    delete new_query.type

    if(!new_query.shop_name) delete new_query.shop_name

    var query_str = tools.serializeURL(new_query)

    if(seller_name){
      as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
    }

    var route;
    if(level == 0) {
      route = `/${page_path}`
      as = `/${page_path}${query_str ? `?${query_str}` : ''}`
    }
    if(level == 1) {
      route = `/${page_path}/[main_category]`
      as = `/${page_path}/${level1_id}${query_str ? `?${query_str}` : ''}`
    }
    if(level == 2) {
      route = `/${page_path}/[main_category]/[sub_category]`
      as = `/${page_path}/${level1_id}/${level2_id}${query_str ? `?${query_str}` : ''}`
    }
    if(level == 3) {
      route = `/${page_path}/[main_category]/[sub_category]/[category]`
      as = `/${page_path}/${level1_id}/${level2_id}/${level3_id}${query_str ? `?${query_str}` : ''}`
    }
    
    Router.push({
      pathname : route,
      query: {
        ...prep_query
      }
    },as)
    
  }

  const showBreadcrumb = () => {
    const tmp = [];
    tmp.push({text: t('header:home'),href:'/',as:'/'})
    tmp.push({text: type == 'categories' ? t('header:category') : type == 'book' ? t('book')  : type == 'ebook' ? t('ebook') : type == 'course' ? t('filter:course_online') : t('filter:stationery'),href:`/${page_path}`,as:`/${page_path}`, active : (!main_category && !sub_category && !category)})
    if(main_category) tmp.push({text: s_category[type]?.find((tmp) => tmp.url_name == main_category)?.name_th,href:`/${page_path}/[main_category]?main_category=${main_category}`,as:`/${page_path}/${main_category}`, active : (main_category && !sub_category && !category)})
    if(sub_category) tmp.push({text: s_category[type]?.find((tmp) => tmp.url_name == main_category)?.subs?.find((tmp) => tmp.url_name == sub_category)?.name_th,href:`/${page_path}/[main_category]/[sub_category]?main_category=${main_category}&sub_category=${sub_category}`,as:`/${page_path}/${main_category}/${sub_category}`, active : (main_category && sub_category && !category)} )
    if(category) tmp.push({text: s_category[type]?.find((tmp) => tmp.url_name == main_category)?.subs?.find((tmp) => tmp.url_name == sub_category)?.items?.find((tmp) => tmp.url_name == category)?.name_th,href:`/${page_path}/[main_category]/[sub_category]/[category]?main_category=${main_category}&sub_category=${sub_category}&category=${category}`,as:`/${page_path}/${main_category}/${sub_category}/${category}`, active : (main_category && sub_category && category)})
    return tmp;
    
  }
 
  const [heightDes, setHeightDes] = useState(0);
  const [detail_more, setDetailMore] = useState(false);

  useEffect(() => {
    var contentElement = document.getElementById("text-editor-content");
    if(contentElement) {
      var currentContentHeight = contentElement.offsetHeight; 
      setHeightDes(currentContentHeight)
    }
  })

  const [cateFilter, setCateFilter] = useState(false);

  useEffect(() => {
    setCateFilter(false);
  }, [main_category, sub_category, category])

  // const pageType = type == 'book' ? t('book')  : type == 'ebook' ? t('ebook') : type == 'course' ? t('filter:course_online') : t('filter:stationery')
  const pageType = type == 'categories' ? t('header:category') : type == 'book' ? t('book')  : type == 'ebook' ? t('ebook') : type == 'course' ? t('filter:course_online') : t('filter:stationery')

  function capitalizeFirstLetter(string) {
    return string.replace(/^./, string[0].toUpperCase());
  }
  function removeDuplicatePrefix(text, prefix) {
    const duplicatePrefix = prefix + prefix;
    while (text.startsWith(duplicatePrefix)) {
      text = text.replace(duplicatePrefix, prefix);
    }
    return text;
  }

  const pageTitle = main ? (currentLanguage == 'th' ? pageType+main.name_th : ((capitalizeFirstLetter(pageType))+' '+main.name_en)) : pageType;


  return (

    <>
      {/* {
        loading && <Loading />
      } */}
      
      <div className="bg-light-less-gray min-vh-100">
        {!isSeller ? <div className="h-64px"></div>: ''}
        
        {
          !isSeller && (
            <>
              {/* {showBreadcrumb()} */}
              <div className="bg-white">
                <BreadcrumbMB
                  className="mt-0 py-2 "
                  item={showBreadcrumb()}
                />
              </div>
              <div className='text-center mt-2'>
                <h1 className="text-h1">
                  {
                    main ? (
                      removeDuplicatePrefix(pageTitle, pageType)
                    ) : (
                      <>
                        {type == 'categories' ? t('header:category') : type == 'book' ? t('book')  : type == 'ebook' ? t('ebook') : type == 'course' ? t('filter:course_online') : t('filter:stationery')}
                      </>
                      
                    )
                  }  
                </h1> 
              </div>
              </>
          )
        }
        <div className=" bg-white d-flex justify-content-between py-3 order-border px-20px">
          <div className="d-flex my-auto" onClick={toggle} >
            <p className="my-auto text-pink">{formselectedthis}</p>
            <i className="fas fa-sort-down text-pink ml-2 mb-auto"></i>
          </div>
          <div className="d-flex my-auto">
            <div className="d-flex my-auto" onClick={() => setCateFilter(true)}>
              {/* <i className="fas fa-filter my-auto text-pink mr-2 my-auto"></i> */}
              <p className="my-auto text-pink">{t('header:category')}</p>
            </div>
            <div className="d-flex my-auto ml-3" onClick={togglefill}>
              <i className="fas fa-filter my-auto text-pink mr-2 my-auto"></i>
              <p className="my-auto text-pink">{t("mobile_filter:title")}</p>
            </div>
          </div>
        </div>
        <div className={classnames("dropdown-fill", { "d-none": !dropdownOpen })}>
          <div className="d-flex justify-content-between my-auto dropdown-fill-list" onClick={() => { handleChangeSort('pub_year-desc', `${t('filter:sort_year_desc')}`, "l01") }} >
            <p className={selectedthis === "l01" ? "my-auto text-pink" : "my-auto text-black"} >{t("filter:sort_year_desc")}</p>
            <img className={selectedthis === "l01" ? "img-fluid" : "d-none"} src="/mobile/image/icon/icon-check-fill.svg" />
          </div>
          <div className="d-flex justify-content-between my-auto dropdown-fill-list" onClick={() => { handleChangeSort('total_sales-desc', `${t('mobile_filter:total_sales')}`, "l06") }} >
            <p className={selectedthis === "l06" ? "my-auto text-pink" : "my-auto text-black"} >{t("mobile_filter:total_sales")}</p>
            <img className={selectedthis === "l06" ? "img-fluid" : "d-none"} src="/mobile/image/icon/icon-check-fill.svg" />
          </div>
          <div className="d-flex justify-content-between my-auto dropdown-fill-list" onClick={() => { handleChangeSort('price-asc', `${t('mobile_filter:sort_price_asc')}`, "l02") }}>
            <p className={selectedthis === "l02" ? "my-auto text-pink" : "my-auto text-black"}>{t("mobile_filter:sort_price_asc")}</p>
            <img className={selectedthis === "l02" ? "img-fluid" : "d-none"} src="/mobile/image/icon/icon-check-fill.svg" />
          </div>
          <div className="d-flex justify-content-between my-auto dropdown-fill-list" onClick={() => { handleChangeSort('price-desc', `${t('mobile_filter:sort_price_desc')}`, "l03") }}>
            <p className={selectedthis === "l03" ? "my-auto text-pink" : "my-auto text-black"}>{t("mobile_filter:sort_price_desc")}</p>
            <img className={selectedthis === "l03" ? "img-fluid" : "d-none"} src="/mobile/image/icon/icon-check-fill.svg" />
          </div>
          <div className="d-flex justify-content-between my-auto dropdown-fill-list" onClick={() => { handleChangeSort('name-asc', `${t('mobile_filter:sort_name_asc')}`, "l04") }}>
            <p className={selectedthis === "l04" ? "my-auto text-pink" : "my-auto text-black"}>{t("mobile_filter:sort_name_asc")}</p>
            <img className={selectedthis === "l04" ? "img-fluid" : "d-none"} src="/mobile/image/icon/icon-check-fill.svg" />
          </div>
          <div className="d-flex justify-content-between my-auto dropdown-fill-list" onClick={() => { handleChangeSort('name-desc', `${t('mobile_filter:sort_name_desc')}`, "l05") }}>
            <p className={selectedthis === "l05" ? "my-auto text-pink" : "my-auto text-black"}>{t("mobile_filter:sort_name_desc")}</p>
            <img className={selectedthis === "l05" ? "img-fluid" : "d-none"} src="/mobile/image/icon/icon-check-fill.svg" />
          </div>
        </div>
        <div className="px-20px d-flex align-items-center h-40px">
          {
            products ? text ? <>{products.count ? formatNumber(products.count) : '0'} {t("mobile_filter:filter_result")} "{text}"</> : <>{products.count ? formatNumber(products.count) : '0'} {t("mobile_filter:filter_result")}</> : null
          }
        </div>
        {/* <InfiniteScroll
            pageStart={1}
            loadMore={loadFunc}
            hasMore={!loading && hasMore}
            initialLoad={false} 
        > */}
          <div className="container d-flex flex-wrap justify-content-between ">
            {
              products && products.rows.map((product, index) => <CardGrid _class={"px-2 my-2"} key={index} product={product} />)
            }
          </div>
          {/* <div className="text-center mt-3"><BeatLoader color={"#EE5294"} loading={loading} /></div> */}
        {/* </InfiniteScroll> */}
        
        {
          !!(products && products.count )&&
          <div className="container ">
            <div className="row w-100 mx-0 px-0">
              <div className="col-12 px-0">
                <div className="float-right page-order">
                  <Paginate
                    previousLabel={t('translations:prev')}
                    nextLabel={t('translations:next')}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    forcePage={Number(query.page || 1) - 1}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                  />
                </div>
              </div>
            </div>
          </div>
        }

<       div className="container ">
          <div className="row w-100 mx-0 px-0">
            <SEODetail 
              main={main}
              t={t} 
              currentLanguage={currentLanguage}
              heightDes={heightDes}
              setDetailMore={setDetailMore}
              detail_more={detail_more}
            />
          </div>
        </div>
        {/* {
          cate_content?.length > 0 && (
            <>
            <div className="container ">
                {
                  cate_content?.map((val, index) => (
                    <div className="row w-100 mx-0 px-0" key={index}>
                    {
                      (val.description_th != '' || val.description_en != '') && (
                        <div className="col-12 px-0">
                          <div dangerouslySetInnerHTML={{ __html: val['description_'+local] }} />
                        </div>
                      )
                    }
                    </div>
                  ))
                }
              </div>
            </>
          )
        } */}

        <div className="footer-space"></div>
      </div>

      <CateFilter t={t} cateFilter={cateFilter} setCateFilter={setCateFilter} cateData={cateData} />

      <div className={classnames("filter-select-bg", { "show": showfil })}></div>
      <div className={classnames("filter-select", { "show": showfil })}>
        <div onClick={togglefill} style={{ position: "absolute", top: 0, left: 0, transition: 'unset', zIndex: 0 }} className={classnames("filter-select", { "show": showfil })}>
        </div>
        <div style={{ zIndex: 2 }} className="filter-select-list">
          {/* <div>
            <div className="filter-select-collapse-main">
              <h4 className="my-auto">{t("mobile_filter:product_type")}</h4>
            </div>
            <div className="d-flex justify-content-between flex-wrap p-2">
              <div className={type == 'categories' ? "categories-btn" : type === "book" ? "categories-btn active " : "d-none"} onClick={() => setCategories("book")}>
                <p className="text-black m-auto p-12">{t("mobile_filter:book")}</p>
              </div>
              {
                !isSeller ? (
                  <>
                    <div className={type == 'categories' ? "categories-btn" : type === "ebook" ? "categories-btn active " : "d-none"} onClick={() => setCategories("ebook")}>
                      <p className="text-black m-auto p-12">{t("mobile_filter:ebook")}</p>
                    </div>
                    <div className={type == 'categories' ? "categories-btn" : type === "course" ? "categories-btn active " : "d-none"} onClick={() => setCategories("course")}>
                      <p className="text-black m-auto p-12">{t("mobile_filter:course")}</p>
                    </div>
                  </>
                ) : ''
              }
              <div className={type == 'categories' ? "categories-btn" : type === "stationery" ? "categories-btn active " : "d-none"} onClick={() => setCategories("stationery")}>
                <p className="text-black m-auto p-12">{t("translations:stationary")}</p>
              </div>
              
            </div>
          </div>
          
          {
            (type != 'categories' && s_category) &&
              <Filter
                title={`${t('mobile_products:main_category')} ${type === "book"? t("mobile_filter:book") : type === "ebook" ? t("mobile_filter:ebook"): type === "course" ? t("mobile_filter:course"): type === "stationery" ? t("mobile_translations:stationary"): t("mobile_filter:course")}`}
                _key={'main_category'}
                t={t}
                handleRedirect={handleRedirect}
                target={s_category[type].filter((tmp) => tmp.url_name == main_category) || []}
                list={s_category[type]?.map((tmp) => { tmp.target = 0; return tmp })}
                show={main_category ? true : false} 
                color={type === "book"? "#EE5294" : type === "ebook" ? "#21A371":type === "course" ? "#155FCF": type === "stationery" ? "#DE6B5C": "#EE5294" }/>
          }
          {
            (type != 'categories' && s_category && main_category) &&
              <Filter
                title={`${s_category[type]?.find((tmp) => tmp.url_name == main_category)?.name_th}`}
                _key={'sub_category'}
                t={t}
                handleRedirect={handleRedirect}
                target={s_category[type]?.find((tmp) => tmp.url_name == main_category)?.subs.filter((val) => val.url_name == sub_category) || []}
                list={s_category[type]?.find((tmp) => tmp.url_name == main_category)?.subs?.map((tmp) => { tmp.target = 0; return tmp })}
                show={sub_category ? true : false} 
                color={type === "book"? "#EE5294" : type === "ebook" ? "#21A371":type === "course" ? "#155FCF": type === "stationery" ? "#DE6B5C": "#EE5294" }/>
          }
          {
            (type != 'categories' && s_category && main_category && sub_category) &&
              <Filter
                title={`${s_category[type]?.find((tmp) => tmp.url_name == main_category)?.subs?.find((val) => val.url_name == sub_category)?.name_th}`}
                _key={'category'}
                t={t}
                handleRedirect={handleRedirect}
                target={s_category[type]?.find((tmp) => tmp.url_name == main_category)?.subs.find((val) => val.url_name == sub_category).items.filter((i) => i.url_name == category) || []}
                list={s_category[type]?.find((tmp) => tmp.url_name == main_category)?.subs?.find((val) => val.url_name == sub_category)?.items.map((tmp) => { tmp.target = 0; return tmp })}
                show={category ? true : false} 
                color={type === "book"? "#EE5294" : type === "ebook" ? "#21A371":type === "course" ? "#155FCF": type === "stationery" ? "#DE6B5C": "#EE5294" }/>
          } */}
         
          {
            type == 'book' || type =='ebook' ?(
              <div>
                <div className="filter-select-collapse-main">
                  <h4 className="my-auto">{t("mobile_filter:book_lang")}</h4>
                </div>
                <div className="d-flex justify-content-between flex-wrap p-2">
                  <div className={!lang ? "categories-btn" : lang === "th" ? "categories-btn active " : "categories-btn"} onClick={() => handleRedirect("lang","th")}>
                    <p className="text-black m-auto p-12">{t("mobile_filter:book_lang_th")}</p>
                  </div>
                  <div className={!lang ? "categories-btn" : lang === "en" ? "categories-btn active " : "categories-btn"} onClick={() => handleRedirect("lang","en")}>
                    <p className="text-black m-auto p-12">{t("mobile_filter:book_lang_en")}</p>
                  </div>
                </div>
              </div>
            ) : null
          }  
          <div>
            <div className="filter-select-collapse-main">
              <h4 className="my-auto">{t("mobile_filter:product_stock")}</h4>
            </div>
            <div className="d-flex justify-content-between flex-wrap p-2">
              <div className={ !have_stock || have_stock == 0 ? "categories-btn active " : "categories-btn" } onClick={() => handleRedirect("have_stock","0")}>
                <p className="text-black m-auto p-12">{t("mobile_filter:all")}</p>
              </div>
              <div className={have_stock == 1 ? "categories-btn active ": "categories-btn" } onClick={() => handleRedirect("have_stock","1")}>
                <p className="text-black m-auto p-12">{t("mobile_filter:ready_to_sell")}</p>
              </div>
            </div>
          </div>
          <div className="filter-select-collapse-main">
            <h4 className="my-auto">{t("mobile_filter:price")}</h4>
          </div>
          <div className="p-4">
            <div className="d-flex justify-content-between">
              <div className="box-gray ">
                <input type="number" name="start" min="0" placeholder="0" value={value[0]} onChange={handleInput} />
              </div>
              -
              <div className="box-gray ">
                <input type="number" name="end" max="10000" placeholder="400" value={value[1]} onChange={handleInput} />
              </div>
            </div>
            <div className={classes.root}>
              <Typography gutterBottom></Typography>
              <AirbnbSlider
                ThumbComponent={AirbnbThumbComponent}
                onChangeCommitted={handleChange}
                max={10000}
                getAriaLabel={index => (index === 0 ? 'Minimum price' : 'Maximum price')}
                value={value}
              />
            </div>
          </div>
          <div className="h-56px"></div>
        </div>
        <div className="success-manu-fill">
          <a className="btn-success-menu" onClick={() => { reset(); togglefill(); }} ><h4 className="text-pink m-auto" >{t("mobile_filter:reset")}</h4></a>
          <a className="btn-success-menu bg-pink" onClick={() => { filterByPrice(); togglefill(); }}><h4 className="text-white m-auto">{t("mobile_filter:finish")}</h4></a>
        </div>
      </div>

    </>
  );
}

export default MainFilter; 