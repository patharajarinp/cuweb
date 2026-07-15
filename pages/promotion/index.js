import Head from 'next/head';
import React from 'react';
import Layout from '../../components/layout';
import MobileMainPromotion from '../../components/mobile/promotion/MobileMainPromotion';
import MainPromotion from '../../components/promotion/MainPromotion';
import useMediaQuery from '../../hooks/useMediaQuery';
import api from '../../utils/api';
import { withTranslation } from "../../utils/i18n";


const limit = 12;

const Home = (props) => {
  const {t,promotion : pro} = props;
  
  const isMobile = useMediaQuery(992);

  return (
    <Layout title="โปรโมชั่นหนังสือลดราคาพิเศษและหนังสือ Pre-Order | ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย">
      <Head>
        <meta name="description" content={`หนังสือโปรโมชั่นลดราคาพิเศษและหนังสือ Pre-Order  จำหน่ายในราคาพิเศษกว่าร้านอื่นๆ สั่งซื้อผ่านเว็บไซต์ www.chulabook.com`} />
        <meta name="keywords" content={`Promotion,โปรโมชั่น,สินค้าลดราคา,สินค้าราคาพิเศษ,หนังสือลดราคา,ถูกที่สุด,หนังสือโปรโมชั่น,chulabook,ศูนย์หนังสือจุฬาฯ,cubook`} />
      </Head>

       
      {
        !isMobile ? (
          <MainPromotion t={t} pro={pro} />
        ) : (
          <MobileMainPromotion t={t} />
        )
      }

      
    </Layout>
  )
}

Home.getInitialProps = async  ({query}) => {
  const promotion_res = await api.getNews({page : 1,limit,cate_key :'promotion'})
  const promotion = promotion_res.data
  return {query,promotion}
}


export default withTranslation('news', 'mobile_list_promotion') (Home)