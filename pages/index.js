import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../components/layout';
import MainHome from '../components/home/MainHome';
import Navbar from '../components/mobile/layout/Navbar';
import useMediaQuery from '../hooks/useMediaQuery';
import api from '../utils/api';
import { withTranslation } from '../utils/i18n';
import MobileMainHome from '../components/mobile/home/MobileMainHome';
import { getCookie } from 'cookies-next';
import SeoCate from '../components/widget/seoCate';
import FacebookChat from '../components/widget/FacebookChat';

const Home = (props) => {

  const [productsCookie, setProductsCookie] = useState();


  const { t,banner,best_seller,new_book,news,alliances,recommend,ebook, course,pre,voucher, cateIndex } = props;


  const fetchProductsWithCookie = () => {
    var search = Cookies.get('search') ? JSON.parse(Cookies.get('search')) : [];
    var ints_category = Cookies.get('ints_category') ? JSON.parse(Cookies.get('ints_category')) : [];
    var interests = Cookies.get('interests') ? JSON.parse(Cookies.get('interests')) : [];
    api.getProductsWithCookie({ search, ints_category, interests, limit : 10 }).then(res => {
      const data = res.data;
      setProductsCookie(data);
    })
      .catch(err => {
        console.log(err.response);
      })
  }

  useEffect(() => {
    Cookies.get('AcceptCookie') && fetchProductsWithCookie();
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#FFFFFF";
    }
    // document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#FFFFFF";
  }, []);


  const isMobile = useMediaQuery(992);


  return (
    <Layout isBanner={true} active={1} show={true} isFooter cateData={cateIndex}>
      <Head>
        <link rel="canonical" href="https://www.chulabook.com" />
        <title>{'ร้านหนังสือศูนย์หนังสือจุฬาฯ | สั่งซื้อหนังสือออนไลน์ อีบุ๊ค ราคาพิเศษ'}</title>

        <meta name="description" content={`เว็บไซต์ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย สั่งซื้อหนังสือออนไลน์ อีบุ๊ค สินค้าไลฟ์สไตล์ ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี`} />
        <meta name="keywords" content={`ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย , ร้านหนังสือ, ร้านขายหนังสือออนไลน์,หนังสือ, คู่มือสอบ,หนังสือเรียน,เตรียมสอบ,นิยาย,หนังสือทั่วไป,คอร์สเรียนออนไลน์,Online Course,E-Book, อีบุ๊ค, ของที่ระลึก,อุปกรณ์เครื่องเขียน,chulabook,ศูนย์หนังสือจุฬาฯ,ตำราวิชาการ`} />
        
        <meta property="og:type" content="website" /> 
        <meta property="og:title" content={`ร้านหนังสือศูนย์หนังสือจุฬาฯ | สั่งซื้อหนังสือออนไลน์ อีบุ๊ค ราคาพิเศษ`} /> 
        <meta property="og:description" content={`เว็บไซต์ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย สั่งซื้อหนังสือออนไลน์ อีบุ๊ค สินค้าไลฟ์สไตล์ ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี`} /> 
        <meta property="og:image" content={`${api.frontend_url}/images/homepage.jpg`} /> 
        <meta property="og:url" content={`https://www.chulabook.com`} /> 
        <meta property="og:site_name" content="CHULABOOK" /> 

        <meta name="twitter:image" content={`${api.frontend_url}/images/homepage.jpg`} /> 
        <meta name="twitter:title" content={`ร้านหนังสือศูนย์หนังสือจุฬาฯ | สั่งซื้อหนังสือออนไลน์ อีบุ๊ค ราคาพิเศษ`} /> 
        <meta name="twitter:description" content={`เว็บไซต์ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย สั่งซื้อหนังสือออนไลน์ อีบุ๊ค สินค้าไลฟ์สไตล์ ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี`} /> 
        <meta name="twitter:site" content="CHULABOOK" /> 
        <meta name="twitter:creator" content="CHULABOOK" /> 
        <meta name="google-site-verification" content="dBDOYd14FFLmHNrRUPCDvPoN1zgAFmN9TLJ6ieEhDpU" />
      </Head>


      {
        !isMobile ? (
          <>
            <MainHome
              t={t}
              banner={banner}
              best_seller={best_seller}
              new_book={new_book}
              news={news}
              alliances={alliances}
              recommend={recommend}
              ebook={ebook} 
              course={course}
              pre={pre}
              voucher={voucher}
              productsCookie={productsCookie}
             />
          </>
        ) : (
          <>
            <Navbar cateData={cateIndex} />
            <MobileMainHome 
              t={t}
              banner={banner}
              best_seller={best_seller}
              new_book={new_book}
              news={news}
              alliances={alliances}
              recommend={recommend}
              ebook={ebook} 
              course={course}
              pre={pre}
              voucher={voucher}
              productsCookie={productsCookie}
            />
          </>
        )
      }

      {/* <SeoCate cateData={cateIndex} t={t} /> */}

      <FacebookChat />
    </Layout>
  )
}

Home.getInitialProps = async (ctx) => {
  const BASE = process.env.api_url || api.baseUrl;
  const { res } = ctx;
  const skipLanding = getCookie('skip_landing', ctx);

  let data = null;
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), 8000) : null;
    const response = await fetch(`${BASE}/cms/cover_page/1`, controller ? { signal: controller.signal } : {});
    if (timer) clearTimeout(timer);
    if (response.ok) data = await response.json();
  } catch (err) {
    if (err?.name !== 'AbortError') console.error('cover_page fetch failed:', err?.message || err);
  }

  if (
    res &&
    data &&
    data.status == 1 &&
    data.publish_date &&
    new Date(data.publish_date) < new Date() &&
    skipLanding != '1'
  ) {
    res.redirect("/landing");
    return {
      banner: [],
      best_seller: { rows: [] },
      new_book: { rows: [] },
      news: { rows: [] },
      alliances: [],
      recommend: [],
      ebook: { rows: [] },
      course: { rows: [] },
      pre: { rows: [] },
      voucher: { rows: [] },
      cateIndex: [],
      namespacesRequired: ['home','header','footer', 'mobile_home','mobile_header','mobile_footer', 'mobile_translations'],
    };
  }

  const results = await Promise.allSettled([
    api.getBanner('home', 'cu'),
    api.getRecProductByKey('best-seller', { limit: 10 }),
    api.getRecProductByKey('new_book', { limit: 10 }),
    api.getRecommend({ type: 'rec', prod_limit: 10 }),
    api.getRecProductByKey('ebook-best-seller', { limit: 10 }),
    api.getRecProductByKey('course-best-seller', { limit: 10 }),
    api.getNews({ cate_key: 'news', limit: 4 }),
    api.getProducts({ limit: 10, preorder: 1 }),
    api.getVoucher({ key: 'home' }),
    api.getAlliances(),
    api.getCate()
  ]);

  const pick = (i, fallback) =>
    results[i].status === 'fulfilled' ? (results[i].value?.data ?? fallback) : fallback;
  const asRows = (v) => (v && Array.isArray(v.rows) ? v : { rows: Array.isArray(v) ? v : [] });

  var banner = pick(0, []);
  var best_seller = asRows(pick(1, { rows: [] }));
  var new_book = asRows(pick(2, { rows: [] }));
  var recommend = pick(3, []);
  var ebook = asRows(pick(4, { rows: [] }));
  var course = asRows(pick(5, { rows: [] }));
  var news = asRows(pick(6, { rows: [] }));
  var pre = asRows(pick(7, { rows: [] }));
  var voucher = asRows(pick(8, { rows: [] }));
  var alliances = pick(9, []);
  var cateIndex = pick(10, []);

  return {
    banner,best_seller,new_book,news,alliances,
    recommend,ebook,course,pre,voucher,cateIndex,
    namespacesRequired: ['home','header','footer', 'mobile_home','mobile_header','mobile_footer', 'mobile_translations'],
  };
}


export default withTranslation('home','header','footer', 'mobile_home','mobile_header','mobile_footer', 'mobile_translations')(Home)