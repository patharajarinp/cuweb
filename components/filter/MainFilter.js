import CateFilter from "./CateFilter";
import Breadcrumb from "./Breadcrumb";
import SearchBox from "./SearchBox";
import filter from "../../utils/filter"
import classNames from 'classnames';
import SelectFilter from "./SelectFilter";
import { useEffect, useState } from "react";
import { CardGrid } from "../widget/card";
import { CardL } from "../widget/card_lanscape";
import Paginate from 'react-paginate';
import { Link, Router } from "../../utils/i18n";
import GenerateInnerFilter from "./group/GenerateInnerFilter";
// import Router from "next/router";
import tools from "../../utils/tools";
import BreadcrumbNew from "./BreadcrumbNew";
import TextH1 from "./TextH1";
import SEODetail from "./SEODetail";
import Head from 'next/head'
import api from "../../utils/api";
import MainSellerData from "../seller/MainSellerData";
import CardPH from "../shimmer/Card";

function serialize(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      if (Array.isArray(obj[p])) {
        obj[p].forEach(val => {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(val));
        })
      }
      else {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
  return str.join("&");
}

const MainFilter = (props) => {
  const { t, products, seller, isSeller, shop_name, seller_page = false, query, local, currentLanguage, pathname, setLoading, type, seller_id,
    s_category, seller_preview, level, page_path, level1_id, level2_id, level3_id, show_all, main } = props;

  const { text, field, orderby, op, page = 1, limit = 25,
    main_category, lang, sub_category, category, only_seller,
    minprice, maxprice, reload, seller_name, have_stock } = query;

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(1);
  const [pageCount, setPageCount] = useState(1)
  const size = filter.useWindowSize();
  const [textSort, setTextsort] = useState('filter:sort');

  /*useEffect(() => {
    if (!orderby || !op) {
      if (textSort != 'filter:sort')
        setTextsort('filter:sort')
    }
    let new_text = orderby + '-' + op
    setTextsort(getTextSort(new_text))
  }, [orderby, op])*/

  useEffect(() => {
    if (type === 'ebook') {
      if (!orderby || !op) {
        if (textSort != 'filter:sort_year_desc')
          setTextsort('filter:sort_year_desc');
  
        if (!query.orderby && !query.op) {
          handleChangeSort('pub_year-desc');
        }
      } else {
        let new_text = orderby + '-' + op;
        setTextsort(getTextSort(new_text));
      }
    }
  }, [orderby, op, type]);



  const handleChangeSort = (val) => {
    let split = val.split('-')
    // setProducts(null)
    var as;
    let new_query = { ...query, orderby: split[0], op: split[1], shop_name: query.shop_name || shop_name }
    let prep_query = { ...new_query }
    delete new_query.seller_name
    delete new_query.main_category
    delete new_query.sub_category
    delete new_query.category
    delete new_query.lng
    delete new_query.subpath
    delete new_query.type

    if (!new_query.shop_name) delete new_query.shop_name


    var query_str = tools.serializeURL(new_query)

    if (seller_name) {
      as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
    }

    var route;
    if (level == 0) {
      route = `/${page_path}`
      as = `/${page_path}${query_str ? `?${query_str}` : ''}`
    }
    if (level == 1) {
      route = `/${page_path}/[main_category]`
      as = `/${page_path}/${level1_id}${query_str ? `?${query_str}` : ''}`
    }
    if (level == 2) {
      route = `/${page_path}/[main_category]/[sub_category]`
      as = `/${page_path}/${level1_id}/${level2_id}${query_str ? `?${query_str}` : ''}`
    }
    if (level == 3) {
      route = `/${page_path}/[main_category]/[sub_category]/[category]`
      as = `/${page_path}/${level1_id}/${level2_id}/${level3_id}${query_str ? `?${query_str}` : ''}`
    }

    Router.push({
      pathname: route,
      query: {
        ...prep_query
      }
    }, as);
    setTextsort(getTextSort(val))
  }

  const getTextSort = (str) => {
    if (str == 'pub_year-asc') {
      return 'filter:sort_year_asc'
      //setTextsort();
    } else if (str == 'pub_year-desc') {
      return 'filter:sort_year_desc';
    } else if (str == 'price-asc') {
      return 'filter:sort_price_asc';
    } else if (str == 'price-desc') {
      return 'filter:sort_price_desc';
    } else if (str == 'name-asc') {
      return 'filter:sort_name_asc';
    } else if (str == 'name-desc') {
      return 'filter:sort_name_desc';
    }
    else if (str == 'total_sales-desc') {
      return 'filter:total_sales';
    }
    else {
      return 'filter:sort'
    }
  }

  const handleRoute = (obj = {}) => {
    var as;
    let new_query = { ...query, ...obj, shop_name: query.shop_name || shop_name }
    let prep_query = { ...new_query }
    delete new_query.seller_name
    if (obj.page != query.page) delete new_query.page
    for (var key of Object.keys(new_query)) {
      if ((!new_query[key] || new_query[key] == "") && new_query[key] !== 0) {
        delete new_query[key];
      }
    }

    delete new_query.main_category
    delete new_query.sub_category
    delete new_query.category
    delete new_query.lng
    delete new_query.subpath
    delete new_query.type

    if (!new_query.shop_name) delete new_query.shop_name


    var query_str = tools.serializeURL(new_query)

    if (seller_name) {
      as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
    }

    var route;
    if (level == 0) {
      route = `/${page_path}`
      as = `/${page_path}${query_str ? `?${query_str}` : ''}`
    }
    if (level == 1) {
      route = `/${page_path}/[main_category]`
      as = `/${page_path}/${level1_id}${query_str ? `?${query_str}` : ''}`
    }
    if (level == 2) {
      route = `/${page_path}/[main_category]/[sub_category]`
      as = `/${page_path}/${level1_id}/${level2_id}${query_str ? `?${query_str}` : ''}`
    }
    if (level == 3) {
      route = `/${page_path}/[main_category]/[sub_category]/[category]`
      as = `/${page_path}/${level1_id}/${level2_id}/${level3_id}${query_str ? `?${query_str}` : ''}`
    }


    Router.push({
      pathname: route,
      query: {
        ...prep_query,
      }
    }, as)
  }

  const handleChangeFilter = (event) => {
    // setProducts(null)
    let value = event.target.value
    let name = event.target.name
    let temp = []
    var as;
    let prep_query = { ...query }
    if (name != 'main_category' && name != 'sub_category' && name != 'category') {
      if (query[name] && Array.isArray(query[name]) && event.target.type != 'radio') {
        temp.push(...query[name])
      } else if (query[name] && event.target.type != 'radio') {
        temp.push(query[name])
      }

      prep_query[name] = value

      let index = temp.findIndex((t) => find(event.target.value, t))

      if (index != -1)
        temp.splice(index, 1)
      if (event.target.checked)
        temp.push(event.target.value)

      if (temp.length == 0)
        delete query[name]
      else
        query[name] = temp

      let new_query = { ...query, shop_name: query.shop_name || shop_name }

      delete new_query.seller_name
      delete new_query.main_category
      delete new_query.sub_category
      delete new_query.category
      delete new_query.lng
      delete new_query.subpath
      delete new_query.type

      if (!new_query.shop_name) delete new_query.shop_name

      var query_str = tools.serializeURL(new_query)


      if (seller_name) {
        as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
      }

      var route;
      if (level == 0) {
        route = `/${page_path}`
        as = `/${page_path}${query_str ? `?${query_str}` : ''}`
      }
      if (level == 1) {
        route = `/${page_path}/[main_category]`
        as = `/${page_path}/${level1_id}${query_str ? `?${query_str}` : ''}`
      }
      if (level == 2) {
        route = `/${page_path}/[main_category]/[sub_category]`
        as = `/${page_path}/${level1_id}/${level2_id}${query_str ? `?${query_str}` : ''}`
      }
      if (level == 3) {
        route = `/${page_path}/[main_category]/[sub_category]/[category]`
        as = `/${page_path}/${level1_id}/${level2_id}/${level3_id}${query_str ? `?${query_str}` : ''}`
      }

      Router.push({
        pathname: route,
        query: {
          ...prep_query
        }
      }, as);
    } else {
      let new_query = { ...query, shop_name: query.shop_name || shop_name }
      delete new_query.seller_name
      delete new_query.main_category
      delete new_query.sub_category
      delete new_query.category
      delete new_query.lng
      delete new_query.subpath
      delete new_query.type

      if (!new_query.shop_name) delete new_query.shop_name

      var query_str = tools.serializeURL(new_query)

      // alert(query_str)
      if (seller_name) {
        as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
      }
      var route;
      if (name == 'main_category') {

        prep_query.main_category = value
        route = `/${page_path}/[main_category]`
        as = `/${page_path}/${value}${query_str ? `?${query_str}` : ''}`
      };
      if (name == 'sub_category') {


        if (event.target.checked) {
          prep_query.sub_category = value
          route = `/${page_path}/[main_category]/[sub_category]`
          as = `/${page_path}/${level1_id}/${value}${query_str ? `?${query_str}` : ''}`
        } else {
          delete prep_query.sub_category
          route = `/${page_path}/[main_category]`
          as = `/${page_path}/${level1_id}${query_str ? `?${query_str}` : ''}`
        }
      };
      if (name == 'category') {
        prep_query.category = value
        route = `/${page_path}/[main_category]/[sub_category]/[category]`
        as = `/${page_path}/${level1_id}/${level2_id}/${value}${query_str ? `?${query_str}` : ''}`
      }

      Router.push({
        pathname: route,
        query: {
          ...prep_query
        }
      }, as);

    }


  }

  const handleFilter = (name, value, checked) => {
    let temp = []
    if (query[name] && Array.isArray(query[name])) {
      temp.push(...query[name])
    } else if (query[name]) {
      temp.push(query[name])
    }

    let index = temp.findIndex((t) => find(value, t))
    if (index != -1)
      temp.splice(index, 1)
    if (checked)
      temp.push(value)

    if (temp.length == 0)
      delete query[name]
    else
      query[name] = temp

    var as;
    let new_query = { ...query, shop_name: query.shop_name || shop_name }
    let prep_query = { ...new_query }


    delete new_query.seller_name
    delete new_query.main_category
    delete new_query.sub_category
    delete new_query.category
    delete new_query.lng
    delete new_query.subpath
    delete new_query.type

    if (!new_query.shop_name) delete new_query.shop_name

    var query_str = tools.serializeURL(new_query)

    if (seller_name) {
      as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
    }

    // console.log('name', name);

    var route;
    if (name == 'main_category') {
      route = `/${page_path}`
      as = `/${page_path}${query_str ? `?${query_str}` : ''}`
    }
    if (name == 'sub_category') {
      route = `/${page_path}/[main_category]`
      as = `/${page_path}/${level1_id}${query_str ? `?${query_str}` : ''}`
    }
    if (name == 'category') {
      route = `/${page_path}/[main_category]/[sub_category]`
      as = `/${page_path}/${level1_id}/${level2_id}${query_str ? `?${query_str}` : ''}`
    }
    // if(level == 3) {
    //   route = `/${page_path}/[main_category]/[sub_category]/[category]`
    //   as = `/${page_path}/${level1_id}/${level2_id}/${level3_id}${query_str ? `?${query_str}` : ''}`
    // }
    Router.push({
      pathname: route,
      query: {
        ...prep_query
      }
    }, as);
  }

  const setProducts = () => { }

  useEffect(() => {
    setPageCount(Math.ceil(products?.count / limit));
  }, [products])

  const handlePageClick = data => {
    let selected = data.selected;
    //setPagenumber(selected);
    var as;
    let new_query = { ...query, page: selected + 1, shop_name: query.shop_name || shop_name }
    let prep_query = { ...new_query }
    delete new_query.seller_name
    delete new_query.main_category
    delete new_query.sub_category
    delete new_query.category
    delete new_query.lng
    delete new_query.subpath
    delete new_query.type

    if (!new_query.shop_name) delete new_query.shop_name

    var query_str = tools.serializeURL(new_query)

    if (seller_name) {
      as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
    }

    var route;
    if (level == 0) {
      route = `/${page_path}`
      as = `/${page_path}${query_str ? `?${query_str}` : ''}`
    }
    if (level == 1) {
      route = `/${page_path}/[main_category]`
      as = `/${page_path}/${level1_id}${query_str ? `?${query_str}` : ''}`
    }
    if (level == 2) {
      route = `/${page_path}/[main_category]/[sub_category]`
      as = `/${page_path}/${level1_id}/${level2_id}${query_str ? `?${query_str}` : ''}`
    }
    if (level == 3) {
      route = `/${page_path}/[main_category]/[sub_category]/[category]`
      as = `/${page_path}/${level1_id}/${level2_id}/${level3_id}${query_str ? `?${query_str}` : ''}`
    }

    Router.push({
      pathname: route,
      query: {
        ...prep_query
      }
    }, as)
    window.scrollTo(0, 0);
  }
  const reset = () => {
    // setProducts(null)
    let query = text ? { text } : {}
    if (only_seller) query.only_seller = only_seller

    if (seller_name) query.seller_name = seller_name
    var as;
    let new_query = { ...query, shop_name: query.shop_name || shop_name }

    delete new_query.seller_name
    delete new_query.main_category
    delete new_query.sub_category
    delete new_query.category
    delete new_query.lng
    delete new_query.subpath
    delete new_query.type

    if (!new_query.shop_name) delete new_query.shop_name


    var query_str = tools.serializeURL(new_query)

    if (seller_name) {
      as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
    }

    var route;
    if (level == 0) {
      route = `/${page_path}`
      as = `/${page_path}${query_str ? `?${query_str}` : ''}`
    }
    if (level == 1) {
      route = `/${page_path}/[main_category]`
      as = `/${page_path}/${level1_id}${query_str ? `?${query_str}` : ''}`
    }
    if (level == 2) {
      route = `/${page_path}/[main_category]/[sub_category]`
      as = `/${page_path}/${level1_id}/${level2_id}${query_str ? `?${query_str}` : ''}`
    }
    if (level == 3) {
      route = `/${page_path}/[main_category]/[sub_category]/[category]`
      as = `/${page_path}/${level1_id}/${level2_id}/${level3_id}${query_str ? `?${query_str}` : ''}`
    }
    Router.push({
      pathname: route,
      query: {
        ...new_query
      }
    }, as);
  }
  const resetAll = () => {
    // let query = text ? { text } : {}

    // if(shop_name) query.shop_name = shop_name
    var as;
    let new_query = { ...query, text: text ? { text } : {} }
    // delete new_query.shop_name
    // console.log('query', new_query);
    // alert(new_query.shop_name);
    if (new_query.shop_name) {
      let query_str = serialize(new_query)
      as = `/seller/${query.shop_name}`
      Router.push(`/seller/[seller_name]?seller_name=${query.shop_name}`, as);
    } else {
      Router.push('/categories');
    }
  }


  const GenerateFilter = (props) => {
    var { list, _key, color = 'bg-light-gray' } = props;
    // console.log(_key == "main_category" && !main_category)
    var show = _key == "main_category" && !main_category ? "show" : ""
    return (
      <div className="new-cate-filter" key={`${_key}`} >
        <a href={`#${_key}`} data-toggle="collapse" aria-expanded="false" className={classNames("dropdown-toggle ", { "collapsed": !show })}><p className={'mb-0 py-2 px-xl-4 px-2 ' + color}>{t(_key)} {t("filter:" + type)}<img className={classNames("arrow-down", { white: color != 'bg-light-gray' })} src={"/images/arrow-down.svg"} /></p></a>
        <ul className={"collapse list-unstyled pt-3 " + show} id={_key}>
          {
            list && list.map((item) => <GenerateInnerFilter item={item} _key={_key} local={local} query={query} handleChangeFilter={handleChangeFilter} />)
          }
        </ul>
      </div>
    )
  }

  const GenerateFilter2Level = (props) => {
    // return null
    const { item, list_sub, title, default_key, sub_key, color = 'bg-light-gray' } = props
    var active = query[default_key] && Array.isArray(query[default_key]) ? query[default_key].indexOf(item.url_name.toString()) != -1 : query[default_key] == item.url_name.toString()
    const actionClick = (e) => {
      handleFilter(default_key, item.id, e.target.checked)
    }

    return (
      <div className="new-cate-filter">
        <div className={"form-group px-xl-4 px-3 mb-1px " + color}>
          <div className="custom-control custom-checkbox">

            <input type="checkbox" className="custom-control-input" id={`cetagory-${default_key}-${item.id}`} value={item.url_name} name={default_key} onChange={handleChangeFilter} defaultChecked={active} />
            <label className="custom-control-label" htmlFor={`cetagory-${default_key}-${item.id}`}>
              <p>{local == 'th' ? item.name_th : item.name_en}</p>
            </label>
            <a href={`#${default_key}-${item.id}`} data-toggle="collapse" aria-expanded="false" className={classNames("dropdown-toggle arrow-down", { 'collapsed': !active })}>
              <img className="" src={color == 'bg-light-gray' ? "/images/arrowgray.svg" : "/images/arrow-down.svg"} />
            </a>
          </div>
        </div>
        <ul className={classNames("collapse list-unstyled px-4", { 'show': active })} id={`${default_key}-${item.id}`}>
          {
            list_sub && list_sub.map((item) => <GenerateInnerFilter item={item} _key={sub_key} local={local} query={query} handleChangeFilter={handleChangeFilter} />)
          }
        </ul>
      </div>
    )
  }

  const FilterGenerate = (props) => {
    let { index, color = 'bg-light-gray' } = props;
    // if(s_category[0].type != type) return null;
    let temp = s_category[type][s_category[type].findIndex((a) => find(a.url_name, index))],
      list_sub = temp?.subs,
      key = 'sub_category',
      sub_key = 'category';
    return (
      <>
        <a href={`#main-${key}-${index}`} key={`#main-${key}-${index}`} className={classNames("dropdown-toggle")} data-toggle="collapse" aria-expanded="false"><p className={'mb-0 py-2 px-2 px-xl-4 ' + color}><span>{local == 'th' ? temp.name_th : temp.name_en}</span><img className="arrow-down" src={"/images/arrow-down.svg"} /></p></a>

        <ul className="collapse list-unstyled show" id={`main-${key}-${index}`}>
          {
            list_sub.map((item, index) => {
              return (
                <li key={item.id}>
                  <GenerateFilter2Level item={item} list_sub={item.items} default_key={key} sub_key={sub_key} />
                </li>
              )
            })
          }
        </ul>
      </>
    )
  }

  const find = (value, value2) => {
    return value == value2
  }
  const [BtnFilter, setBtnFilter] = useState(false);
  const toglefilter = () => setBtnFilter(!BtnFilter);

  const handleView = (index) => {
    setView(index);
  }

  const handleRedirect = (type, data) => {
    // setProducts(null)
    // alert('sss')
    var as;
    let new_query = { ...query, type: data, shop_name: query.shop_name || shop_name }
    let prep_query = { ...new_query }

    delete new_query.seller_name
    delete new_query.main_category
    delete new_query.sub_category
    delete new_query.category
    delete new_query.lng
    delete new_query.subpath
    delete new_query.type

    if (!new_query.shop_name) delete new_query.shop_name

    var query_str = tools.serializeURL(new_query)

    if (seller_name) {
      as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
    }
    let typeUrl = 'books'

    switch (data) {
      case 'book':
        typeUrl = 'books'
        break;
      case 'ebook':
        typeUrl = 'ebooks'
        break;
      case 'course':
        typeUrl = 'courses'
        break;
      case 'stationery':
        typeUrl = 'stationeries'
        break;
      default:
        break;
    }

    var route;
    route = `/${typeUrl}`
    as = `/${typeUrl}${query_str ? `?${query_str}` : ''}`
    Router.push({
      pathname: route,
      query: {
        ...prep_query
      }
    }, as);
  };

  const handleBreadcrumClick = (value, name) => {
    console.log('name', name)
    let temp = []
    var as;
    let new_query = { ...query, shop_name: query.shop_name || shop_name }
    let prep_query = { ...new_query }

    delete new_query.seller_name
    delete new_query.main_category
    delete new_query.sub_category
    delete new_query.category
    delete new_query.reload
    delete new_query.lng
    delete new_query.subpath
    delete new_query.type

    if (!new_query.shop_name) delete new_query.shop_name

    var query_str = tools.serializeURL(new_query)

    if (seller_name) {
      as = `/seller/${seller_name}${query_str ? `?${query_str}` : ''}`
    }
    var route;
    if (name == 'main_category') {
      delete prep_query.sub_category
      delete prep_query.category
      route = `/${page_path}/[main_category]`
      as = `/${page_path}/${value}${query_str ? `?${query_str}` : ''}`
    };
    if (name == 'sub_category') {
      delete prep_query.category
      route = `/${page_path}/[main_category]/[sub_category]`
      as = `/${page_path}/${level1_id}/${value}${query_str ? `?${query_str}` : ''}`
    };
    if (name == 'category') {
      route = `/${page_path}/[main_category]/[sub_category]/[category]`
      as = `/${page_path}/${level1_id}/${level2_id}/${value}${query_str ? `?${query_str}` : ''}`
    }

    Router.push({
      pathname: route,
      query: {
        ...prep_query
      }
    }, as);
  }

  const [detail_more, setDetailMore] = useState(false);

  const CateShow = (props) => {
    const { _key, list, main_list, sub_list, name, show_type } = props;
    var temp = [];
    if (sub_list && main_list) {
      var s_temp = [];
      main_list.forEach((item) => {
        temp.push(...s_category[type].find((c) => find(c.url_name, item)).subs)
      })
      temp.forEach((item) => {
        s_temp.push(...temp.find((c) => find(c.url_name, item.url_name)).items)
      })
      temp = [];
      temp.push(...s_temp);
    } else if (main_list) {
      main_list.forEach((item) => {
        temp.push(...s_category[type].find((c) => find(c.url_name, item)).subs)
      })
    } else {
      temp.push(...s_category[type])
    }

    return (
      <>
        {
          show_type == "filter" && (
            <>
              {
                list && list.map((item) => temp.find((ta) => find(item, ta.url_name)) &&
                  <p key={'result_' + _key + '-' + item} className="px-4 d-flex tags">
                    <i onClick={() => handleFilter(_key, item, false)} className="fa fa-times mr-2 box"></i><span>{name} : {temp.find((ta) => find(item, ta.url_name))['name_' + local]}</span>
                  </p>
                )
              }
            </>
          )
        }
        {
          show_type == "breadcrumb" && (
            <>
              {
                list && list.map((item) => temp.find((ta) => find(item, ta.url_name)) &&
                  <li className={classNames("breadcrumb-item ")} aria-current="page" key={'bc_' + _key + '-' + item}>
                    <a onClick={() => handleBreadcrumClick(temp.find((ta) => find(item, ta.url_name))?.url_name, name)}>
                      {temp.find((ta) => find(item, ta.url_name))['name_' + local]}
                    </a>
                  </li>
                )
              }
            </>
          )
        }
        {
          show_type == "text_h1" && (
            <>
              {
                list && list.map((item) => temp.find((ta) => find(item, ta.url_name)) &&
                  <h1 key={'title_' + _key + '-' + item}>
                    {temp.find((ta) => find(item, ta.url_name))['name_' + local]}
                  </h1>
                )
              }
            </>
          )
        }
        {
          show_type == "seo_detail" && (
            <>
              {
                list && list.map((item) => temp.find((ta) => find(item, ta.url_name)) && (
                  <div key={'detail' + _key + '-' + item}>
                    {
                      !!temp.find((ta) => find(item, ta.url_name))['description_' + local] && (
                        <div className="detail-des mt-3">
                          <h2 className="pb-3 font-h5">{temp.find((ta) => find(item, ta.url_name))['name_' + local]}</h2>
                          <div className={`show-editor ck ck-content show-detail-category ${detail_more ? 'showall' : ''}`}>
                            <p id="text-editor-content" dangerouslySetInnerHTML={{ __html: temp.find((ta) => find(item, ta.url_name))['description_' + local] }} />
                          </div>
                          {
                            heightDes > 180 && (
                              <span className="show-detail-category-readmore" onClick={() => setDetailMore(!detail_more)}>{!detail_more ? t('header:readmore') : t('header:hide_message')}</span>
                            )
                          }
                        </div>
                      )
                    }
                  </div>
                )

                )
              }
            </>
          )
        }
      </>
    )
  }

  const [heightDes, setHeightDes] = useState(0);

  useEffect(() => {
    var contentElement = document.getElementById("text-editor-content");
    if (contentElement) {
      var currentContentHeight = contentElement.offsetHeight;
      setHeightDes(currentContentHeight)
    }
  })

  return (
    <>
      {/* <Head>
        <title>{`${main ? main.name_th : (type == 'categories' ? t('header:category') : type == 'book' ? t('book')  : type == 'ebook' ? t('ebook') : type == 'course' ? t('filter:course_online') : t('filter:stationery'))} | สั่งซื้อหนังสือออนไลน์ อีบุ๊ค ราคาพิเศษ`}</title>

        <meta name="description" content={`เว็บไซต์ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย สั่งซื้อหนังสือออนไลน์ อีบุ๊ค สินค้าไลฟ์สไตล์ ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี`} />
        <meta name="keywords" content={`ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย , ร้านหนังสือ, ร้านขายหนังสือออนไลน์,หนังสือ, คู่มือสอบ,หนังสือเรียน,เตรียมสอบ,นิยาย,หนังสือทั่วไป,คอร์สเรียนออนไลน์,Online Course,E-Book, อีบุ๊ค, ของที่ระลึก,อุปกรณ์เครื่องเขียน,chulabook,ศูนย์หนังสือจุฬาฯ,ตำราวิชาการ`} />
        
        <meta property="og:type" content="website" /> 
        <meta property="og:title" content={`${main ? main.name_th : (type == 'categories' ? t('header:category') : type == 'book' ? t('book')  : type == 'ebook' ? t('ebook') : type == 'course' ? t('filter:course_online') : t('filter:stationery'))} | สั่งซื้อหนังสือออนไลน์ อีบุ๊ค ราคาพิเศษ`} /> 
        <meta property="og:description" content={`เว็บไซต์ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย สั่งซื้อหนังสือออนไลน์ อีบุ๊ค สินค้าไลฟ์สไตล์ ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี`} /> 
        <meta property="og:image" content={`${api.frontend_url}/images/homepage.jpg`} /> 
        <meta property="og:site_name" content="CHULABOOK" /> 

        <meta name="twitter:image" content={`${api.frontend_url}/images/homepage.jpg`} /> 
        <meta name="twitter:title" content={`${main ? main.name_th : (type == 'categories' ? t('header:category') : type == 'book' ? t('book')  : type == 'ebook' ? t('ebook') : type == 'course' ? t('filter:course_online') : t('filter:stationery'))} | สั่งซื้อหนังสือออนไลน์ อีบุ๊ค ราคาพิเศษ`} /> 
        <meta name="twitter:description" content={`เว็บไซต์ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย สั่งซื้อหนังสือออนไลน์ อีบุ๊ค สินค้าไลฟ์สไตล์ ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี`} /> 
        <meta name="twitter:site" content="CHULABOOK" /> 
        <meta name="twitter:creator" content="CHULABOOK" /> 
        <meta name="google-site-verification" content="dBDOYd14FFLmHNrRUPCDvPoN1zgAFmN9TLJ6ieEhDpU" />
      </Head> */}
      <div className="container">
        {
          !seller && (
            <BreadcrumbNew
              t={t} query={query}
              local={local}
              type={type}
              page_path={page_path}
              main_category={main_category}
              sub_category={sub_category}
              s_category={s_category}
              category={category}
              CateShow={CateShow}
            />
          )
        }
        {(seller && !seller_page) && <MainSellerData seller={seller} />}
        {
          (!seller && !seller_page) && (
            <TextH1
              main={main}
              t={t} query={query}
              local={local}
              type={type}
              page_path={page_path}
              main_category={main_category}
              sub_category={sub_category}
              s_category={s_category}
              category={category}
              CateShow={CateShow}
              currentLanguage={currentLanguage}
            />
          )
        }

        <SearchBox
          t={t} query={query} text={text} products={products} pathname={pathname} handleRoute={handleRoute}
          handleView={handleView} view={view} textSort={textSort} handleChangeSort={handleChangeSort}
          getTextSort={getTextSort} setTextsort={setTextsort}
        />
      </div>
      <div className="container mt-lg-5 mt-md-3 new-filter-style">

        <div className="row ">
          <div className="col-product-filter" >
            {
              (type || only_seller) &&
              <div className={classNames("bg-light-gray mb-4 border-rounder d-none d-lg-block ")}>
                <SelectFilter t={t} setOpen={setOpen} open={open} type={type} reset={reset}
                  main_category={main_category} sub_category={sub_category} s_category={s_category}
                  category={category} CateShow={CateShow} only_seller={only_seller} resetAll={resetAll}
                  show_all={show_all}
                />
              </div>
            }
            <div className="bg-white border-rounder">
              <CateFilter t={t} lang={lang} handleChangeFilter={handleChangeFilter} handleRoute={handleRoute}
                query={query} setProducts={setProducts} pathname={pathname}
                have_stock={have_stock}
                BtnFilter={BtnFilter} toglefilter={toglefilter} type={type} show_all={show_all}
                handleRedirect={handleRedirect} GenerateFilter={GenerateFilter} FilterGenerate={FilterGenerate}
                main_category={main_category} sub_category={sub_category} s_category={s_category} category={category}
                isSeller={isSeller} />
            </div>
          </div>
          <div className="col-xl-9 col-lg-8 col-md-12">
            <div className={classNames("row", view == 1 ? '' : 'd-none')}>
              {
                products ? (products?.count > 0 ? (size.width < 1200 ? (size.width < 992 ? (products.rows.map((product) => <CardGrid product={product} key={product.id} seller_preview={seller_preview} classes={"py-2"} show={3} />)) : (products.rows.map((product) => <CardGrid product={product} seller_preview={seller_preview} show={2} new_padding={true} key={product.id} />))) : (products.rows.map((product) => <CardGrid product={product} seller_preview={seller_preview} key={product.id} show={3} new_padding={true} />))) : '') : (size.width < 1200 ? (size.width < 992 ? (<CardPH show={9} grid={3} />) : (<CardPH show={9} grid={2} new_padding={true} />)) : (<CardPH show={9} grid={3} new_padding={true} />))
              }
            </div>
            <div className={classNames("row", view == 2 ? '' : 'd-none')}>
              {
                products ? (products?.count > 0 ? products.rows.map((product) => <CardL product={product} seller_preview={seller_preview} key={product.id} />) : '') : <CardPH show={9} grid={3} />
              }
            </div>
            {
              !!(products && products?.count) &&
              <div className="row w-100 mx-0 px-0">
                <div className="col-12 px-0">
                  <div className="float-right page-order">
                    <Paginate
                      previousLabel={t('translations:prev')}
                      nextLabel={t('translations:next')}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      pageCount={pageCount}
                      forcePage={page - 1}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                    />
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <SEODetail
          main={main}
          t={t} query={query}
          local={local}
          currentLanguage={currentLanguage}
          type={type}
          page_path={page_path}
          main_category={main_category}
          sub_category={sub_category}
          s_category={s_category}
          category={category}
          CateShow={CateShow}
          heightDes={heightDes}
          setDetailMore={setDetailMore}
          detail_more={detail_more}
        />
        <div className="end-page"></div>
      </div>
    </>
  )
}

export default MainFilter