import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import MainFilter from '../../../../../components/filter/MainFilter';
import MobileMainFilter from '../../../../../components/filter/mobile/MobileMainFilter';
import Layout from '../../../../../components/layout';
import Loading from '../../../../../components/loading';
import MobileSelerData from '../../../../../components/seller/mobile/MobileSelerData';
import CateMetaTag from '../../../../../components/widget/CateMetaTag';
import UserContext from '../../../../../contexts/UserContext';
import useMediaQuery from '../../../../../hooks/useMediaQuery';
import api from '../../../../../utils/api';
import { withTranslation, i18n } from "../../../../../utils/i18n";
import SeoCate from '../../../../../components/widget/seoCate';

const LIMIT = 24;

const MainProducts = (props) => {
  const { t, query, products, cates, main_category, sub_category, category, main, currentLanguage, seller, mainData, subData, cateData, cateIndex } = props;

  const [loading, setLoading] = useState(false)
  const { local } = useContext(UserContext)
  const router = useRouter()
  // const pathname = router.pathname;
  const [s_category, setCategory] = useState(null);

  useEffect(() => {
    if (document.getElementsByClassName('main-layout')[0]) {
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F8F9FA";
    }
  }, []);

  useEffect(() => {
    if (!cates) return;
    let book = cates.filter(val => val.type == 'book')
    let stationery = cates.filter(val => val.type == 'stationery')
    let course = cates.filter(val => val.type == 'course')
    // console.log(course_online)
    setCategory({ book, ebook: book, stationery, course, cate: cates });
  }, [cates]);

  const pathname = `/courses/${main_category}/${sub_category}/${category}`

  const isMobile = useMediaQuery(992);

  return (
    <Layout cateData={cateIndex}>
      {loading && <Loading />}
      <CateMetaTag
        currentLanguage={currentLanguage}
        t={t} type={"course"}
        selected={main}
        mainData={mainData}
        subData={subData}
        cateData={cateData}
      />
      {
        !isMobile ? (
          <MainFilter
            t={t} query={query} pathname={pathname} local={local} products={products} type={"course"} s_category={s_category}
            setLoading={setLoading} breadcrumb={false} level={3} page_path={`courses`}
            level1_id={main_category} level2_id={sub_category} level3_id={category}
            main={main}
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
              t={t} query={query} pathname={pathname} products={products} type={"course"} s_category={s_category}
              setLoading={setLoading} breadcrumb={false} level={3} page_path={`courses`}
              level1_id={main_category} level2_id={sub_category} level3_id={category}
              main={main}
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

MainProducts.getInitialProps = async ({ query, req }) => {
  const { main_category, sub_category, category, shop_name } = query
  const currentLanguage = req ? req.language : i18n.language

  try {
    const [mainRes, subRes, cateRes] = await Promise.all([
      api.getCateByURL(main_category),
      api.getSubCateByURL(sub_category),
      api.getCateItemByURL(category)
    ])
    const main = mainRes.data;
    const sub = subRes.data;
    const cate = cateRes.data;
    var params = { ...query, limit: LIMIT, type: ['course', 'course_ecode'], search: query.text };
    params.main_category = main.id;
    params.sub_category = sub.id;
    params.category = cate.id;




    // console.log(params)

    const [product_res, cate_res, care_data] = await Promise.all([
      api.getProducts(params),
      api.getCateByType({ main_category, sub_category, category }),
      api.getCate(),
    ])

    const products = product_res.data;
    const cates = cate_res.data
    const cateIndex = care_data.data

    var seller = null;
    var preview = null;

    if (shop_name) {
      if (query.preview == 1) {
        preview = 1;
      }
      const url = encodeURI(`${api.baseUrl}/seller/basic?name=${shop_name}${preview ? '' : '&active=1'}`)
      const res = await fetch(url)
      const data = await res.json()
      seller = data
    }

    return {
      query, products, cates, cateIndex, main_category: main.url_name, sub_category: sub.url_name, category: cate.url_name, main: cate, currentLanguage, seller,
      mainData: main, subData: sub, cateData: cate
    }
  }
  catch (err) {
    console.log(err)
    throw err;
  }

}

export default withTranslation(['header', 'product', 'filter', 'mobile_header', 'mobile_products', 'mobile_filter'])(MainProducts)