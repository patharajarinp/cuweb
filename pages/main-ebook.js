import Head from 'next/head';
import React from 'react';
import Layout from '../components/layout';
import MainEbook from '../components/main_page/MainEbook';
import MobileMainEbook from '../components/main_page/mobile/MobileMainEbook';
import useMediaQuery from '../hooks/useMediaQuery';
import api from '../utils/api';
import { withTranslation } from "../utils/i18n";


const MainProducts = (props) =>{
  const {t, query,banner,cate,pageRec} = props;

  const isMobile = useMediaQuery(992);

  return (
    <Layout title={`อีบุ๊ค (E-Book) หนังสืออิเล็กทรอกนิกส์ คู่มือสอบ หนังสิอเรียน ตำราเรียน แพทย์ พยาบาล และอื่นๆ อีกมากมาย | ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย`} isBanner={true}>
      <Head>
        <meta name="description" content={`แหล่งรวมหนังสือ E-Book วิชาการที่ใหญ่ที่สุดในประเทศ สามารถสั่งซื้อได้แล้ววันนี้บน www.chulabook.comและApplication: CU-eBook Store ทั้งในระบบ Andriod และ IOS`} />
        <meta name="keywords" content={`e-book,ebook,อีบุ๊ค,หนังสือออนไลน์,CU e-Book store, ดาวน์โหลด ebook,สั่งซื้อ ebook, ebook free,อีบุ๊ค ฟรี,chulabook,ศูนย์หนังสือจุฬาฯ,cubook`} />
      </Head>

      {
        !isMobile ? (
          <MainEbook 
            t={t} query={query} 
            banner={banner} cate={cate} 
            pageRec={pageRec}
          />
        ) : (
          <MobileMainEbook 
            t={t} query={query} 
            banner={banner} cate={cate} 
            pageRec={pageRec}
          />
        )
      }
      
    </Layout>
  )
}

MainProducts.getInitialProps = async ({query}) => {
  const [banner_res,cate_res,pageRec_res] = await Promise.all([
    api.getBanner('ebook', 'cu'),
    api.getCate({type : 'ebook'}),
    api.getRecommend({type: 'rec_ebook', prod_limit : 4})
  ])
  const banner = banner_res.data
  const cate = cate_res.data
  const pageRec = pageRec_res.data
  return {query,banner,cate,pageRec}
}

export default withTranslation('product') (MainProducts)