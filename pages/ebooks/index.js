import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import MainFilter from '../../components/filter/MainFilter';
import MobileMainFilter from '../../components/filter/mobile/MobileMainFilter';
import Layout from '../../components/layout';
import Loading from '../../components/loading';
import MobileSelerData from '../../components/seller/mobile/MobileSelerData';
import CateMetaTag from '../../components/widget/CateMetaTag';
import UserContext from '../../contexts/UserContext';
import useMediaQuery from '../../hooks/useMediaQuery';
import api from '../../utils/api';
import { withTranslation, i18n } from "../../utils/i18n";
import SeoCate from '../../components/widget/seoCate';

const LIMIT = 24;

const MainProducts = (props) =>{
  const {t, query,products, cates, currentLanguage,seller, cateIndex} = props;

  const [loading, setLoading] = useState(false)
  const { local } = useContext(UserContext)
  const router = useRouter()
  const pathname = router.pathname;
  const [s_category, setCategory] = useState(null);

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F8F9FA";
    }
  },[]);

  useEffect(() => {
    if(!cates) return;
    let book = cates.filter(val=>val.type =='book')
    let stationery = cates.filter(val=>val.type =='stationery')
    let course = cates.filter(val=>val.type =='course')
    // console.log(course_online)
    setCategory({book,ebook:book,stationery, course, cate : cates});
  },[cates]);

  const isMobile = useMediaQuery(992);

  return (
    <Layout cateData={cateIndex}>
      {loading && <Loading />}
      <CateMetaTag 
        currentLanguage={currentLanguage}
        t={t} type={"ebook"} 
      />
      {
        !isMobile ? (
          <MainFilter 
            t={t} query={query} pathname={pathname} local={local} products={products} type={"ebook"} s_category={s_category}
            setLoading={setLoading} breadcrumb={false} level={0} page_path={`ebooks`} 
            show_all={false}
            currentLanguage={currentLanguage}
            seller={seller}
            isSeller={seller ? true : false}
            shop_name={seller ? seller.shop_name : null}
          />
        ) : (
          <>
            {seller && <MobileSelerData seller={seller} />}
            <MobileMainFilter 
              cates={cates}
              t={t} query={query} pathname={pathname} products={products} type={"ebook"} s_category={s_category}
              setLoading={setLoading} breadcrumb={false} level={0} page_path={`ebooks`} 
              currentLanguage={currentLanguage}
              isSeller={seller ? true : false}
              shop_name={seller ? seller.shop_name : null}
              cateData={cateIndex}
            />
          </>
        )
      }
      {/* <SeoCate cateData={cateIndex} t={t} /> */}


      
    </Layout>
  )
}

MainProducts.getInitialProps = async ({query, req}) => {
  const {shop_name} = query;
  const currentLanguage = req ? req.language : i18n.language

  try {
    var params = { ...query, limit: LIMIT, type : 'ebook', search : query.text };


    const [product_res,cate_res,care_data] = await Promise.all([
      api.getProducts(params),
      api.getCateByType(),
      api.getCate()
    ])
    const products = product_res.data;
    const cates = cate_res.data
    const cateIndex = care_data.data

    var seller = null;
    var preview = null;

    if(shop_name){
      if(query.preview == 1) {
        preview = 1;
      }
      const url = encodeURI(`${api.baseUrl}/seller/basic?name=${shop_name}${preview ? '' : '&active=1'}`)
      const res = await fetch(url)
      const data = await res.json()
      seller = data
    }

    return {query,products,cates,currentLanguage,seller,cateIndex}
  }
  catch (err) {
    console.log(err)
    throw err;
  }
  
}

export default withTranslation(['header', 'product', 'filter', 'mobile_header', 'mobile_products', 'mobile_filter']) (MainProducts)