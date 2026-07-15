// import fetch from 'isomorphic-unfetch';
import React from 'react';
import api from '../../utils/api';
import { withTranslation } from "../../utils/i18n";

const ProductDetail = (props) => {
  const { t } = props;


  return (
    <>
  
 
    </>
  )
}

ProductDetail.getInitialProps = async ({query,asPath,req,res}) => {
  const url = query.product_id.split('-');
  const product_id = encodeURIComponent(url[0])
  query.product_id = product_id;
  var product = null;
  
  try {
    const res_product = await api.getProductOne(product_id,{withRecommend : 0});
    product = res_product.data;
    if(product && product.main_url_name) {
      res.redirect(`/${product.main_url_name}/${product.id}`)
    }else{
      res.redirect(`/404`)
    }
  }catch (e) {
    res.redirect(`/404`)
  }
  
}


export default  withTranslation(['product_detail'])(ProductDetail)