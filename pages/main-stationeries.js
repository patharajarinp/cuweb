import React, { useContext, useEffect, useState } from 'react';
import Slick from "react-slick";
import Banner from '../components/banner';
import Layout from '../components/layout';
import { CardGrid } from '../components/widget/card';
import UserContext from '../contexts/UserContext';
import api from '../utils/api';
import { Link, withTranslation } from "../utils/i18n";
import Head from 'next/head';
import MainStationeries from '../components/main_page/MainStationeries';
import useMediaQuery from '../hooks/useMediaQuery';
import MobileMainStationeries from '../components/main_page/mobile/MobileMainStationeries';


const MainProducts = (props) =>{
  const {t, query,banner,cate,pageRec} = props;

  const isMobile = useMediaQuery(992);

  return (
    <Layout title={`อุปกรณ์เครื่องเขียน ของที่ระลึก และไลฟ์สไตล์ | ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย`} isBanner={true}>
      <Head>
        <meta name="description" content={`จำหน่ายอุปกรณ์ เครื่องเขียน เครื่องคิดเลขวิทยาศาสตร์และของที่ระลึกในราคาพิเศษ สามารถสั่งซื้อได้แล้วที่ www.chulabook.com`} />
        <meta name="keywords" content={`เครื่องเขียน,ปากกา,ดินสอ,ยางลบ,อุปกรณ์ประกอบการเรียน,สินค้าที่ระลึก,สินค้าจุฬาฯ,กระเป๋าจุฬาฯ,chulabook,ศูนย์หนังสือจุฬาฯ,cubook`} />
      </Head>
      
      {
        !isMobile ? (
          <MainStationeries
            t={t} query={query} 
            banner={banner} cate={cate} 
            pageRec={pageRec}
          />
        ) : (
          <MobileMainStationeries 
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
    api.getBanner('stationery', 'cu'),
    api.getCate({type : 'stationery'}),
    api.getRecommend({type: 'rec_stationery', prod_limit : 4, limit : 500})
  ])
  const banner = banner_res.data
  const cate = cate_res.data
  const pageRec = pageRec_res.data
  return {query,banner,cate,pageRec}
}

export default withTranslation('product') (MainProducts)