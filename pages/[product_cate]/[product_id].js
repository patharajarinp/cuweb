// import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import React from 'react';
import Layout from '../../components/layout';
import MainDetail from '../../components/product_detail/MainDetail';
import MobileDetail from '../../components/product_detail/mobile/MobileDetail';
import useMediaQuery from '../../hooks/useMediaQuery';
import Navbar from '../../components/mobile/layout/Navbar';
import api from '../../utils/api';
import { withTranslation } from "../../utils/i18n";
import tools from '../../utils/tools';

const ProductDetail = (props) => {
  const { t, product, product_img, product_review, product_related, product_also, query, path } = props;

  const isMobile = useMediaQuery(992);
  const urlData = tools.getUrlProduct(product);

  return (
    <>
      <Layout>
        {
          !!product && (
            <Head>
              <link rel="stylesheet" href={'/css/content-styles.css'} />
              <link rel="stylesheet" href={'/css/style_prodetail_only.css'} />
              <title>{`${product.name} | ศูนย์หนังสือจุฬาฯ`}</title>
              <link rel="canonical" href={`https://www.chulabook.com${urlData.as}`} />
              <meta name="description" content={`สั่งซื้อ ${product.category_main_th} ${product.name} ราคาพิเศษ ที่ร้านหนังสือศูนย์หนังสือจุฬาฯ`} />
              <meta name="keywords" content={`ร้านหนังสือ, ร้านหนังสือออนไลน์, ${product.name}, ${product.author}, ${product.category_main_th}, ${product.category_sub_th}, ${product.category_name_th}, ${product.isbn ? product.isbn : ''}, ศูนย์หนังสือจุฬาฯ, CHULABOOK`} />
              <meta property="og:type" content="website" />
              <meta property="og:title" content={`${product.name} | ศูนย์หนังสือจุฬาฯ`} />
              <meta property="og:description" content={`สั่งซื้อ ${product.category_main_th} ${product.name} ราคาพิเศษ ที่ร้านหนังสือศูนย์หนังสือจุฬาฯ`} />
              <meta property="og:image" content={product.picture ? product.picture : `${api.frontend_url}/images/book.png`} />
              <meta property="og:url" content={`https://www.chulabook.com${urlData.as}`} />
              <meta property="og:site_name" content="CHULABOOK" />

              <meta name="twitter:image" content={product.picture ? product.picture : `${api.frontend_url}/images/book.png`} />
              <meta name="twitter:title" content={`${product.name} | ศูนย์หนังสือจุฬาฯ`} />
              <meta name="twitter:description" content={`สั่งซื้อ ${product.category_main_th} ${product.name} ราคาพิเศษ ที่ร้านหนังสือศูนย์หนังสือจุฬาฯ`} />
              <meta name="twitter:site" content="CHULABOOK" />
              <meta name="twitter:creator" content="CHULABOOK" />
              {/* <link rel="canonical" href={`https://www.chulabook.com${urlData.as}`} /> */}
            </Head>
          )
        }

        {
          !isMobile ? (
            <MainDetail
              t={t}
              product={product} product_img={product_img} product_review={product_review} product_related={product_related}
              product_also={product_also} query={query} path={path}
            />
          ) : (
            <>
              <MobileDetail
                t={t}
                product={product} product_img={product_img} product_review={product_review} product_related={product_related}
                product_also={product_also} query={query} path={path}
              />
            </>
          )
        }


      </Layout>

    </>
  )
}

ProductDetail.getInitialProps = async ({ query, asPath, req, res }) => {
  const url = query.product_id.split('-');
  const product_id = encodeURIComponent(url[0])

  query.product_id = product_id;
  const cate_name = query.product_cate;
  var product = null;
  var product_img = null;
  var product_review = null;
  var product_also = null;
  var product_related = null;
  try {
    var res_product_related = null;
    const res_product = await api.getProductOne(product_id, { withRecommend: 0 });
    const res_product_img = await api.getProductImg(product_id);
    const res_review = await api.getProductReview(product_id, { limit: 5, status: 2 });
    const res_product_also = await api.getAlsoProduct(product_id, { limit: 12 });
    product = res_product.data;
    product_img = res_product_img.data;
    product_review = res_review.data;
    product_also = res_product_also.data;
    if (product) {
      res_product_related = await api.getRelatedProduct({ limit: 12, author: product.author, sub_id: product.sub_id, product_id });
      product_related = res_product_related.data;
    }
  } catch (e) {

  }
  // const response = await fetch(`${BASE}/products/${query.product_id}`);
  // const data = await response.json();
  // if(product && (product.main_url_name != cate_name)) {
  //   res.redirect(`/${product.main_url_name ? product.main_url_name : 'other'}/${product.id}`)
  // }

  return { product, product_img, product_review, product_related, product_also, query, path: asPath }; //has to be like an object
}


export default withTranslation(['product_detail', 'mobile_product_detail', 'mobile_translations'])(ProductDetail)