import Head from 'next/head';
import React from 'react';
import Layout from '../components/layout';
import MainCourse from '../components/main_page/MainCourse';
import MobileMainCourse from '../components/main_page/mobile/MobileMainCourse';
import useMediaQuery from '../hooks/useMediaQuery';
import api from '../utils/api';
import { withTranslation } from "../utils/i18n";


const MainProducts = (props) => {
  const { t, query, banner, cate, pageRec } = props;

  const isMobile = useMediaQuery(992);
  return (
    <Layout title={`คอร์สออนไลน์ | ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย`} isBanner={true}>
      <Head>
        <meta name="description" content={`แหล่งรวมหนังสือ E-Book วิชาการที่ใหญ่ที่สุดในประเทศ สามารถสั่งซื้อได้แล้ววันนี้บน www.chulabook.comและApplication: CU-eBook Store ทั้งในระบบ Andriod และ IOS`} />
        <meta name="keywords" content={`e-book,ebook,อีบุ๊ค,หนังสือออนไลน์,CU e-Book store, ดาวน์โหลด ebook,สั่งซื้อ ebook, ebook free,อีบุ๊ค ฟรี,chulabook,ศูนย์หนังสือจุฬาฯ,cubook`} />
      </Head>

      {
        !isMobile ? (
          <MainCourse
            t={t} query={query}
            banner={banner} cate={cate}
            pageRec={pageRec}
          />
        ) : (
          <MobileMainCourse
            t={t} query={query}
            banner={banner} cate={cate}
            pageRec={pageRec}
          />
        )
      }
    </Layout>
  )
}

MainProducts.getInitialProps = async ({ query }) => {
  const [banner_res, cate_res, pageRec_res] = await Promise.all([
    api.getBanner('course_online', 'cu'),
    api.getCate({ type: 'course' }),
    api.getRecommend({ type: 'rec_course_online', prod_limit: 4 })
  ])
  const banner = banner_res.data
  const cate = cate_res.data
  const pageRec = pageRec_res.data
  return { query, banner, cate, pageRec }
}

export default withTranslation('product')(MainProducts)