import classNames from 'classnames';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import Paginate from 'react-paginate';
import MainFilter from '../../components/product/MainFilter';
import Search from '../../components/product/Search';
import SelectFilter from '../../components/product/SelectFilter';
import SortBy from '../../components/product/SortBy';
import Shimmer from '../../components/Shimmer';
import CardPH from '../../components/shimmer/Card';
import { CardGrid } from '../../components/widget/card';
import { CardL } from '../../components/widget/card_lanscape';
import api from '../../utils/api';
import { Link, Router } from "../../utils/i18n";
import tools from '../../utils/tools';

const limit = 24;

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



const ProductFilter = ({ q, t, pathname, setLoading, local, isSeller, seller_id, seller_preview}) => {
  const [view, setView] = useState(1);
  var query = {...q}
  const { text, field, orderby, op, type,page=1,
     main_category, lang, sub_category, category,only_seller,
      minprice, maxprice,reload ,seller_name,have_stock} = query;
  // delete query.seller_name;
  const [products, setProducts] = useState(null);
  const [s_category, setCategory] = useState(null);
  // console.log('pathname',pathname)
  const fetchProducts = () => {
    window.scrollTo(0, 0)


   
    var param = {
      search: text,
      field: field,
      orderby,
      op,
      type : type =='stationery' ? 'non_book' : type,
      main_category,
      lang,
      sub_category,
      category,
      minprice,
      maxprice,
      limit,
      page,
      seller_id,
      have_stock,
      only_seller,
      preview : seller_preview
    }
    setLoading(true)
    api.getProducts(param).then(res => {
      const data = res.data;
      setProducts(data);
      setPageCount(Math.ceil(data.count / limit));
      setLoading(false)
    })
      .catch(err => {
        console.log(err.response);
      })

    if (!Cookies.get('AcceptCookie'))
      return;

    var temp = Cookies.get('search') ? [...JSON.parse(Cookies.get('search'))] : [];
    if (text && temp.findIndex((t) => find(t, text)) == -1)
      temp.push(text)

    if (temp && Array.isArray(temp) && temp.length > 3) {
      temp.splice(0, 1)
    }
    Cookies.set('search', JSON.stringify(temp));
  };

  const [pageCount,setPageCount] = useState(1)
  const [pageNumber, setPagenumber] = useState(0);

  const handlePageClick = data=>{
    let selected = data.selected;
    //setPagenumber(selected);
    var as;
    let new_query = {...query}
    delete new_query.seller_name
    if(seller_name){
      let query_str = serialize(new_query)
      as = `/seller/${seller_name}?`+query_str
    }
    Router.push({
      pathname,
      query: {
        ...query,
        page: selected+1
      }
    }
    ,as)
  }


  const handleRoute = (obj={})=>{
    var as;
    let new_query = {...query,...obj}
    delete new_query.seller_name
    // console.log('obj',obj)
    
    if(obj.page != query.page) delete new_query.page
    // console.log('new_query',new_query)
    for (var key of Object.keys(new_query)) {
      if ((!new_query[key] || new_query[key] == "") && new_query[key] !== 0) {
        delete new_query[key];
      }
    }


    if(seller_name){
      let query_str = serialize(new_query)
      as = `/seller/${seller_name}?`+query_str
    }
    // console.log('query_str',as)

    Router.push({
      pathname,
      query: {
        ...new_query,
        // ...obj
      }
    }
    ,as)

  }

  const fetchCetagory = () => {
    var param = {
      type
    }

   
    api.getCateByType().then(res => {
      const data = res.data;
      let book = data.filter(val=>val.type =='book')
      let stationery = data.filter(val=>val.type =='stationery')
      let course = data.filter(val=>val.type =='course')
      // console.log(course_online)
      setCategory({book,ebook:book,stationery, course, cate : data});
    })
      .catch(err => {
        console.log(err.response);
      })
  };

  

  useEffect(() => {
    // alert('aa')
    
    fetchCetagory()
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F8F9FA";
    }
    // document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F8F9FA";
  }, []);

  useEffect(() => {
    //alert('aa')
    fetchProducts()
  }, [type, text, field, orderby, page,op, main_category, lang, sub_category, category, minprice, maxprice,reload, seller_preview,have_stock, only_seller]);


  useEffect(()=>{
    if(!orderby || !op){
      if(textSort != 'filter:sort')
        setTextsort('filter:sort')
    }

    let new_text = orderby+'-'+op
    setTextsort(getTextSort(new_text))

  },[orderby,op])
  const handleView = (index) => {
    setView(index);
  }

  const handleRedirect = (type, data) => {
    setProducts(null)
    var as;
    let new_query = {...query,type: data}
    delete new_query.seller_name
    if(seller_name){
      let query_str = serialize(new_query)
      as = `/seller/${seller_name}?`+query_str
    }
    
    // alert(pathname)
    Router.push({
      pathname,
      query: {
        ...query,
        type: data
      }
    },
    as
    );
  };

  const [textSort, setTextsort] = useState('filter:sort');

  const handleChangeSort = (val) => {
    let split = val.split('-')
    setProducts(null)
    var as;
    let new_query = {...query,orderby: split[0],op: split[1]}
    delete new_query.seller_name
    if(seller_name){
      let query_str = serialize(new_query)
      as = `/seller/${seller_name}?`+query_str
    }
    Router.push({
      pathname,
      query: {
        ...query,
        orderby: split[0],
        op: split[1]
      }
    },as);
    setTextsort(getTextSort(val))
  }

  const getTextSort = (str)=>{
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
      return'filter:sort'
    }
  }

  const handleChangeFilter = (event) => {
    setProducts(null)
    let value = event.target.value
    let name = event.target.name
    let temp = []
    if (query[name] && Array.isArray(query[name]) && event.target.type != 'radio') {
      temp.push(...query[name])
    } else if (query[name] && event.target.type != 'radio') {
      temp.push(query[name])
    }

    let index = temp.findIndex((t) => find(event.target.value, t))

    if (index != -1)
      temp.splice(index, 1)
    if (event.target.checked)
      temp.push(event.target.value)

    if (temp.length == 0)
      delete query[name]
    else
      query[name] = temp

    var as;
    let new_query = {...query}
    delete new_query.seller_name
    if(seller_name){
      let query_str = serialize(new_query)
      as = `/seller/${seller_name}?`+query_str
    }
    Router.push({
      pathname,
      query: {
        ...query
      }
    },as);
  }

  const handleFilter = (name, value, checked) => {
    // setProducts(null)
    // alert('asdasd')
   
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
    let new_query = {...query}
    delete new_query.seller_name
    if(seller_name){
      let query_str = serialize(new_query)
      as = `/seller/${seller_name}?`+query_str
    }

    Router.push({
      pathname,
      query: {
        ...query
      }
    },as);
  }

  const reset = () => {
    setProducts(null)
    let query = text ? { text } : {}
    if(only_seller) query.only_seller = only_seller

    if(seller_name) query.seller_name = seller_name
    var as;
    let new_query = {...query}
    delete new_query.seller_name
    if(seller_name){
      let query_str = serialize(new_query)
      as = `/seller/${seller_name}?`+query_str
    }

    
    Router.push({
      pathname,
      query
    },
    as
    );
  }

  const resetAll = () => {
    setProducts(null)
    let query = text ? { text } : {}

    if(seller_name) query.seller_name = seller_name
    var as;
    let new_query = {...query}
    delete new_query.seller_name
    if(seller_name){
      let query_str = serialize(new_query)
      as = `/seller/${seller_name}?`+query_str
    }
    Router.push({
      pathname,
      query
    },
    as
    );
  }


  const GenerateInnerFilter = (props) => {
    var { item, _key } = props;
    return (
      <li key={`${_key}-${item.id}`} className="px-4">
        <div className="form-group">
          <div className="custom-control custom-checkbox">
            <input type="checkbox" defaultChecked={query[_key] && Array.isArray(query[_key]) ? query[_key].indexOf(item.id.toString()) != -1 : query[_key] == item.id.toString()} className="custom-control-input" id={`cetagory-${_key}-${item.id}`} name={_key} value={item.id} onChange={handleChangeFilter} />
            <label className="custom-control-label" htmlFor={`cetagory-${_key}-${item.id}`}>
              <p>{local == 'th' ? item.name_th : item.name_en}</p>
            </label>
          </div>
        </div>
      </li>
    )
  }

  const GenerateFilter = (props) => {
    var { list, _key, color = 'bg-light-gray' } = props;
    // console.log(_key == "main_category" && !main_category)
    var show = _key == "main_category" && !main_category ? "show" : ""
    return (
      <div key={`${_key}`} >
        <a href={`#${_key}`} data-toggle="collapse" aria-expanded="false" className={classNames("dropdown-toggle ", { "collapsed": !show })}><p className={'mb-0 py-2 px-xl-4 px-2 ' + color}>{t(_key)} {t("filter:"+type)}<img className={classNames("arrow-down", { white: color != 'bg-light-gray' })} src={"/images/arrow-down.svg"} /></p></a>
        <ul className={"collapse list-unstyled pt-3 " + show} id={_key}>
          {
            list && list.map((item) => <GenerateInnerFilter item={item} _key={_key} />)
          }
        </ul>
      </div>
    )
  }

  const GenerateFilter2Level = (props) => {
    const { item, list_sub, title, default_key, sub_key, color = 'bg-light-gray' } = props
    var active = query[default_key] && Array.isArray(query[default_key]) ? query[default_key].indexOf(item.id.toString()) != -1 : query[default_key] == item.id.toString()
    const actionClick = (e) => {
      handleFilter(default_key, item.id, e.target.checked)
    }
    return (
      <div>
        <div className={"form-group px-xl-4 px-3 mb-1px " + color}>
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" id={`cetagory-${default_key}-${item.id}`} value={item.id} name={default_key} onChange={handleChangeFilter} defaultChecked={active} />
            <label className="custom-control-label" htmlFor={`cetagory-${default_key}-${item.id}`}>
              <p>{local == 'th' ? item.name_th : item.name_en}</p>
            </label>
            <a href={`#${default_key}-${item.id}`} data-toggle="collapse" aria-expanded="false" className={classNames("dropdown-toggle arrow-down", { 'collapsed': !active })}>
              <img className="" src={color == 'bg-light-gray' ? "/images/arrowgray.svg" : "/images/arrow-down.svg"} />
            </a>
          </div>
        </div>
        {/*<a href={`#${default_key}`} data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><p className={ 'mb-0 py-1 px-4 ' + color }>{title}</p></a>*/}
        <ul className={classNames("collapse list-unstyled px-4", { 'show': active })} id={`${default_key}-${item.id}`}>
          {
            list_sub && list_sub.map((item) => <GenerateInnerFilter item={item} _key={sub_key} />)
          }
        </ul>
      </div>
    )
  }

  const FilterGenerate = (props) => {
    let { index, color = 'bg-light-gray' } = props;
    // if(s_category[0].type != type) return null;
    let temp = s_category[type][s_category[type].findIndex((a) => find(a.id, index))],
      list_sub = temp?.subs,
      key = 'sub_category',
      sub_key = 'category';
    return (
      <>
        <a href={`#main-${key}-${index}`} key={`#main-${key}-${index}`} className={classNames("dropdown-toggle")} data-toggle="collapse" aria-expanded="false"><p className={'mb-0 py-2 px-2 px-xl-4 ' + color}>{local == 'th' ? temp.name_th : temp.name_en}<img className="arrow-down" src={"/images/arrow-down.svg"} /></p></a>
        
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

  function useWindowSize() {
    const isClient = typeof window === 'object';

    function getSize() {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
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

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
  }

  const FilerShow = (props) => {
    const { _key, list, main_list, sub_list ,name} = props;
   
    //if(s_category[0].type != type) return null;
    // console.log('s_category[type]',s_category)
    var temp = [];
    if (sub_list && main_list) {
      var s_temp = [];
      main_list.forEach((item) => {
        temp.push(...s_category[type].find((c) => find(c.id, item)).subs)
      })
      temp.forEach((item) => {
        s_temp.push(...temp.find((c) => find(c.id, item.id)).items)
      })
      temp = [];
      temp.push(...s_temp);
    } else if (main_list) {
      main_list.forEach((item) => {
        temp.push(...s_category[type].find((c) => find(c.id, item)).subs)
      })
    } else {
      temp.push(...s_category[type])
    }
    return (
      list && list.map((item) => temp.find((ta) => find(item, ta.id)) && <p key={'result_' + _key + '-' + item} className="px-4 d-flex tags"><i onClick={() => handleFilter(_key, item, false)} className="fa fa-times mr-2 box"></i><span>{name} : {temp.find((ta) => find(item, ta.id))['name_' + local]}</span></p>)
    )
  }

  const size = useWindowSize();
  const [BtnFilter, setBtnFilter] = useState(false);
  const toglefilter = () => setBtnFilter(!BtnFilter);
  const [open, setOpen] = useState(false);

  const [thisPage, setPage] = useState(1);
  const handlePage = (page) => {
    if (page > 0 || Math.ceil(products.count / limit)) {
  
      setPage(page)
      fetchProducts(page);
    }
  }

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

  var cate_content = tools.dataCategory(s_category?.cate, main_category, sub_category, category);


  return (
    <>
      <div className="container">
        {
          !isSeller && (
            <div className="row">
              <div className="col-12">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href='/' as={'/'}>
                        <a>{t('filter:main')}</a>
                      </Link>
                      
                    </li>
                    <li className={classNames("breadcrumb-item ", { 'active': !text })} aria-current="page">
                      <Link href="/categories" as={`/categories`}>
                        <a>{t('filter:search')}</a>
                      </Link>
                    </li>
                    {
                      text ? <li className="breadcrumb-item active" aria-current="page">{text}</li> : ''
                    }
                  </ol>
                </nav>
              </div>
            </div>
          )
        }
        
        <div className={classNames('row', isSeller ? 'mt-5' : 'mt-3')}>
          <div className="col-lg-6 col-md-12 d-flex align-items-center">
            <Search text={text} setProducts={setProducts} t={t} pathname={pathname} query={query} handleRoute={handleRoute} />
          </div>
          <div className="col-6 d-none d-lg-block">
            <SortBy t={t} textSort={textSort} handleChangeSort={handleChangeSort} view={view} handleView={handleView} />
          </div>
          <div className="col-12 mt-3">
            {
              products ?
                <div>
                  <h3 className="font-weight-normal text-transform-none">
                    {
                      text ? (
                        <>{`${products.count ? formatNumber(products.count) : '0'} ${t("filter:filter_result")} "${text}"`}</>
                      ) : (
                        <>{`${products.count ? formatNumber(products.count) : '0'} ${t("filter:filter_result")}`}</>
                      )
                    }
                    
                  </h3>
                </div> : <Shimmer size={[500, 16]} />
            }
          </div>
        </div>
      </div>

      <div className="container mt-lg-5 mt-md-3">
        <div>
          <SortBy t={t} textSort={textSort} handleChangeSort={handleChangeSort} view={view} handleView={handleView} size={'md'} toglefilter={toglefilter} />
        </div>

        <div className="d-block d-lg-none">
          <div className="mb-3">
            {
              (type || only_seller )&&
              <>
                <SelectFilter t={t} setOpen={setOpen} open={open} type={type} reset={reset} 
                main_category={main_category} sub_category={sub_category} s_category={s_category}
                category={category} FilerShow={FilerShow} size="md" only_seller={only_seller} resetAll={resetAll} />
              </>
            }
          </div>

        </div>
        <div className="row ">
          <div className="col-product-filter" >
            {
              (type || only_seller) && 
              <div className={classNames("bg-light-gray mb-4 border-rounder d-none d-lg-block ")}>
                <SelectFilter t={t} setOpen={setOpen} open={open} type={type} reset={reset} 
                main_category={main_category} sub_category={sub_category} s_category={s_category}
                category={category} FilerShow={FilerShow} only_seller={only_seller} resetAll={resetAll} />
              </div>
            }
            
            <div className="bg-white border-rounder">
              <MainFilter t={t} lang={lang} handleChangeFilter={handleChangeFilter}  handleRoute={handleRoute}
              query={query} setProducts={setProducts} pathname={pathname}
              have_stock={have_stock}
              BtnFilter={BtnFilter} toglefilter={toglefilter} type={type} 
              handleRedirect={handleRedirect} GenerateFilter={GenerateFilter} FilterGenerate={FilterGenerate}
              main_category={main_category} sub_category={sub_category} s_category={s_category} category={category}
              isSeller={isSeller} />
            </div>
          </div>
          <div className="col-xl-9 col-lg-8 col-md-12">
            <div className={classNames("row", view == 1 ? '' : 'd-none')}>
              {
                products ? (products.count > 0 ? (size.width < 1200 ? (size.width < 992 ? (products.rows.map((product) => <CardGrid product={product} key={product.id} seller_preview={seller_preview} classes={"py-2"} show={3} />)) : (products.rows.map((product) => <CardGrid product={product} seller_preview={seller_preview} show={2} new_padding={true} key={product.id} />))) : (products.rows.map((product) => <CardGrid product={product} seller_preview={seller_preview} key={product.id} show={3} new_padding={true} />))) : '') : (size.width < 1200 ? (size.width < 992 ? (<CardPH show={9} grid={3} />) : (<CardPH show={9} grid={2} new_padding={true} />)) : (<CardPH show={9} grid={3} new_padding={true} />))
              }
            </div>
            <div className={classNames("row", view == 2 ? '' : 'd-none')}>
              {
                products ? (products.count > 0 ? products.rows.map((product) => <CardL product={product} seller_preview={seller_preview}  key={product.id}/>) : '') : <CardPH show={9} grid={3} />
              }
            </div>
            {
              !!(products && products.count )&&
              <div className="row w-100 mx-0 px-0">
                <div className="col-12 px-0">
                  <div className="float-right page-order">
                    <Paginate
                      previousLabel={t('translations:prev')}
                      nextLabel={t('translations:next')}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      pageCount={pageCount}
                      forcePage={page-1}
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
        {
          cate_content?.length > 0 && (
            <>
              {
                cate_content?.map((val, index) => (
                  <div className="row" key={index}>
                    {
                      (val.description_th != '' || val.description_en != '') && (
                        <div className="col-12">
                          <div dangerouslySetInnerHTML={{ __html: val['description_'+local] }} />
                        </div>
                      )
                    }
                  </div>
                ))
              }
            </>
          )
        }
        
      </div>
    </>
  )
}

export default ProductFilter

