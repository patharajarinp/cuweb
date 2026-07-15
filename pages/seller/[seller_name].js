import fetch from 'isomorphic-unfetch';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '../../components/layout';
import MainSellerDetail from '../../components/seller/MainSellerDetail';
import MobileMainSellerDetail from '../../components/seller/mobile/MobileMainSellerDetail';
import useMediaQuery from '../../hooks/useMediaQuery';
import api from '../../utils/api';
import { withTranslation } from '../../utils/i18n';

const LIMIT = 24;

const Seller = (props) =>{
  const { query, seller, t, cates, products } = props;
  const [loading, setLodding] = useState(false);

  const router = useRouter()
  const seller_name = router.query.seller_name

  var preview = null;
  if(router.query.preview) {
    preview = router.query.preview;
  }

  const isMobile = useMediaQuery(992);

  console.log('products', products)
  
  return (
    <Layout title={seller_name} loading={loading} isBanner={true} isPreview={preview} show={true}>
      {
        !isMobile ? (
          <MainSellerDetail t={t} seller={seller} 
          cates={cates} products={products}
          query={query} setLoading={setLodding} />
        ) : (
          <MobileMainSellerDetail 
            t={t} seller={seller} query={query} setLoading={setLodding} 
            cates={cates} products={products}
          />
        )
      }
    </Layout>
  )
}


Seller.getInitialProps = async ({query}) => {
  
  var seller = null;
  var preview = null;
  // console.log('asdasd', query)
  var params = { ...query, limit: LIMIT, search : query.text, shop_name : query.seller_name };

  try{
    
    if(query.preview == 1) {
      preview = 1;
    }
    // console.log('seller_name',query.seller_name)
    const url = encodeURI(`${api.baseUrl}/seller/basic?name=${query.seller_name}${preview ? '' : '&active=1'}`)
    const res = await fetch(url)
    const data = await res.json()
    // console.log(data)
    // console.log('asdasd')
    seller = data
    if(seller){
      //Not found seller
      // console.log('Not found seller')
      
      // const {active_product ,active_shipping,picture} = seller;
      // //console.log(picture)
      // if(!active_product || !active_shipping || !picture){
      //   return {query, seller : null}
      // }
    }
    const [product_res,cate_res] = await Promise.all([
      api.getProducts(params),
      api.getCateByType()
    ])
    const products = product_res.data;
    const cates = cate_res.data
    return {query, seller,products, cates}
  }
  catch(err){
    console.log(err)
    throw err;
    
  }
  
  // return {query, seller}; //has to be like an object
}

export default  withTranslation(['product', 'filter'])(Seller)