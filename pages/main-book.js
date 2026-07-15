import Head from 'next/head';
import React from 'react';
import Layout from '../components/layout';
import MainBook from '../components/main_page/MainBook';
import MobileMainBook from '../components/main_page/mobile/MobileMainBook';
import useMediaQuery from '../hooks/useMediaQuery';
import api from '../utils/api';
import { withTranslation } from "../utils/i18n";

const MainProducts = (props) =>{
  const {t, query,banner,cate,pageRec,recommend} = props;

  const isMobile = useMediaQuery(992);

  return (
    <Layout isBanner={true}>
      <Head>
        <link rel="canonical" href="https://www.chulabook.com/main-book" />
        <title>{'หนังสือภาษาไทยและหนังสือต่างประเทศ | ร้านหนังสือศูนย์หนังสือจุฬาฯ'}</title>

        <meta name="description" content={`สั่งซื้อหนังสือออนไลน์ หนังสือเรียน คู่มือเตรียมสอบ ตำราวิชาการ นวนิยาย วรรณกรรม สารคดี หนังสือภาษาไทย หนังสือต่างประเทศ ซื้อครบ 700 บาทจัดส่งฟรี`} />
        <meta name="keywords" content={`ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย , ร้านหนังสือ, ร้านขายหนังสือออนไลน์,หนังสือ, คู่มือสอบ,หนังสือเรียน,เตรียมสอบ,นิยาย,หนังสือทั่วไป,คอร์สเรียนออนไลน์,Online Course,E-Book, อีบุ๊ค, ของที่ระลึก,อุปกรณ์เครื่องเขียน,chulabook,ศูนย์หนังสือจุฬาฯ,ตำราวิชาการ`} />
        
        <meta property="og:type" content="website" /> 
        <meta property="og:title" content={`หนังสือภาษาไทยและหนังสือต่างประเทศ | ร้านหนังสือศูนย์หนังสือจุฬาฯ`} /> 
        <meta property="og:description" content={`สั่งซื้อหนังสือออนไลน์ หนังสือเรียน คู่มือเตรียมสอบ ตำราวิชาการ นวนิยาย วรรณกรรม สารคดี หนังสือภาษาไทย หนังสือต่างประเทศ ซื้อครบ 700 บาทจัดส่งฟรี`} /> 
        <meta property="og:image" content={`${api.frontend_url}/images/homepage.jpg`} /> 
        <meta property="og:url" content={`https://www.chulabook.com/main-book`} /> 
        <meta property="og:site_name" content="CHULABOOK" /> 

        <meta name="twitter:image" content={`${api.frontend_url}/images/homepage.jpg`} /> 
        <meta name="twitter:title" content={`หนังสือภาษาไทยและหนังสือต่างประเทศ | ร้านหนังสือศูนย์หนังสือจุฬาฯ`} /> 
        <meta name="twitter:description" content={`สั่งซื้อหนังสือออนไลน์ หนังสือเรียน คู่มือเตรียมสอบ ตำราวิชาการ นวนิยาย วรรณกรรม สารคดี หนังสือภาษาไทย หนังสือต่างประเทศ ซื้อครบ 700 บาทจัดส่งฟรี`} /> 
        <meta name="twitter:site" content="CHULABOOK" /> 
        <meta name="twitter:creator" content="CHULABOOK" /> 
      </Head>
      
      {
        !isMobile ? (
          <MainBook 
            t={t} query={query} 
            banner={banner} cate={cate} 
            pageRec={pageRec} recommend={recommend} 
          />
        ) : (
          <MobileMainBook 
            t={t} query={query} 
            banner={banner} cate={cate} 
            pageRec={pageRec} recommend={recommend} 
          />
        )
      }
      

    </Layout>
  )
}

MainProducts.getInitialProps = async ({query}) => {
  const [banner_res,cate_res,pageRec_res,rec_res] = await Promise.all([
    api.getBanner('product', 'cu'),
    api.getCate({type : 'book'}),
    api.getRecommend({type: 'rec_book', prod_limit : 4}),
    api.getRecommend({type: 'rec'})
  ])
  const banner = banner_res.data
  const cate = cate_res.data
  const pageRec = pageRec_res.data
  const recommend = rec_res.data
  return {query,banner,cate,pageRec,recommend}
}

export default withTranslation('product') (MainProducts)