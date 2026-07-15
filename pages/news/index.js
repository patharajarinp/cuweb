import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import { CardNews } from '../../components/widget/card_new';
import api from '../../utils/api';
import { Link, withTranslation } from "../../utils/i18n";
import Head from 'next/head';
import MainNews from '../../components/news/MainNews';
import useMediaQuery from '../../hooks/useMediaQuery';
import MobileMainNews from '../../components/mobile/news/MobileMainNews';

const Home = (props) => {
  const {t,news,activities,procurement} = props;

  const isMobile = useMediaQuery(992);

  return (
    <Layout title="ข่าวสารและกิจกรรมต่างๆ | ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย">
      <Head>
        <meta name="description" content={`ข่าวสารและกิจกรรม ที่ศูนย์หนังสือจุฬาฯได้ไปจัดกิจกรรมกันมาทั้งโรงเรียน มหาวิทยาลัยและสถานที่ต่างๆ`} />
        <meta name="keywords" content={`ข่าวจุฬาฯ,กิจกรรม,ข่าวสาร,ข่าวสารและกิจกรรม,ศูนย์หนังสือจุฬา,chulabook,cubook,ความรู้,ข่าวเตรียมสอบ`} />
      </Head>

      
      {
        !isMobile ? (
          <MainNews t={t} news={news} activities={activities} procurement={procurement} />
        ) : (
          <MobileMainNews t={t} news={news} activities={activities} procurement={procurement} />
        )
      }
      
      
    </Layout>
  )
}

Home.getInitialProps = async  ({query}) => {
  const [news_res,act_res,pro_res] = await Promise.all([
    api.getNews({ cate_key: 'news', limit: 4 }),
    api.getNews({ cate_key: 'activity', limit: 4 }),
    api.getNews({ cate_key: 'procurement', limit: 4 })
  ])

  const news = news_res.data
  const activities = act_res.data
  const procurement = pro_res.data
  return {query,news,activities,procurement}
}


export default withTranslation('news') (Home)