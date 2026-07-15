import React from 'react';
import api from '../utils/api';

const Products = (props) => {

  return (
    <>
    
    </>
  )
}

Products.getInitialProps = async ({ query, pathname, req, local, res }) => {
  const { main_category, sub_category, category, type  } = query;
  

  // return {main_category, sub_category, category, type}
  var path = type == 'book' ? 'books' : type == 'ebook' ? 'ebooks' : type == 'course' ? 'courses' : type == 'stationery' ? 'stationeries' : 'categories';
  try {
    if(type && main_category && sub_category && category) {
      const [mainRes,subRes,cateRes] = await Promise.all([
        api.getMainCateByID(main_category),
        api.getSubCateByID(main_category, sub_category),
        api.getCateByID(main_category, sub_category, category)
      ])
      const main = mainRes.data;
      const [sub] = subRes.data;
      const [cate] = cateRes.data;
      res.redirect(`/${path}/${main.url_name}/${sub.url_name}/${cate.url_name}`)
    }else if(type && main_category && sub_category){
      const [mainRes,subRes] = await Promise.all([
        api.getMainCateByID(main_category),
        api.getSubCateByID(main_category, sub_category),
      ])
      const main = mainRes.data;
      const [sub] = subRes.data;
      res.redirect(`/${path}/${main.url_name}/${sub.url_name}`)
    }else if(type && main_category){
      const [mainRes] = await Promise.all([
        api.getMainCateByID(main_category),
      ])
      const main = mainRes.data;
      res.redirect(`/${path}/${main.url_name}`)
    }else if(type){
      res.redirect(`/${path}`)
    }else{
      res.redirect(`/categories`)
    }
    
   
    return {main, sub, cate}
  }
  catch (err) {
    console.log(err)
    throw err;
  }

}
export default Products

