// import {useState,useEffect} from 'react'
// import Link from 'next/link'
import Layout from '../../../components/layout';
import ProductRelatedNews from '../../../components/mobile/ProductRelatedNews';
import { useRouter } from 'next/router'


const NewsProductPage = (props)=>{
  const router = useRouter()
  const {id :news_id} = router.query

  return (
    <Layout>
      <div className="bg-light-less-gray min-vh-100 ">
        <div className="h-64px"></div>
        <ProductRelatedNews news_id={news_id} page_key="promotion" />
        <div className="footer-space"></div>
      </div>
    </Layout>
  )
}

export default NewsProductPage