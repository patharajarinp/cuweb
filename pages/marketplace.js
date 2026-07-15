import Head from 'next/head';
import React from 'react';
import Layout from '../components/layout';
import MainMarketplace from '../components/maketplace/MainMarketplace';
import MobileMainMarketplace from '../components/maketplace/mobile/MobileMainMarketplace';
import useMediaQuery from '../hooks/useMediaQuery';
import api from '../utils/api';
import { withTranslation } from '../utils/i18n';

const Marketplace = (props) => {
  const { t,banner, pageRec ,rec_group,best_seller,new_products,voucher,shop} = props;
 
  const isMobile = useMediaQuery(992);

  return (
    <Layout 
      title={`ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย  | สั่งซื้อหนังสือออนไลน์ อี-บุ๊ค(Ebook) คอร์สเรียนออนไลน์ และไลฟ์สไตล์ ในราคาพิเศษ`} 
      isBanner={true} show>
      <Head>
        <meta name="description" content={`จำหน่ายหนังสือ คู่มือสอบ หนังสือเรียนและหนังสือทั่วไป ในราคาพิเศษกว่าร้านอื่นๆ สั่งซื้อผ่านเว็บไซต์ www.chulabook.com  Facebook:cubook line:@chulabook หรือสั่งซื้อผ่าน Call Center โทร.0-2255-4433 ซื้อครบ 700 บาทจัดส่งฟรีทั่วประเทศ`} />
        <meta name="keywords" content={`ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย , ร้านหนังสือ, ร้านขายหนังสือออนไลน์,หนังสือ, คู่มือสอบ,หนังสือเรียน,เตรียมสอบ,นิยาย,หนังสือทั่วไป,คอร์สเรียนออนไลน์,Online Course,E-Book, อีบุ๊ค, ของที่ระลึก,อุปกรณ์เครื่องเขียน,chulabook,ศูนย์หนังสือจุฬาฯ,ตำราวิชาการ`} />
        
        <meta property="og:type" content="website" /> 
        <meta property="og:title" content={`ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย`} /> 
        <meta property="og:description" content={`จำหน่ายหนังสือ คู่มือสอบ หนังสือเรียนและหนังสือทั่วไป ในราคาพิเศษกว่าร้านอื่นๆ สั่งซื้อผ่านเว็บไซต์ www.chulabook.com  Facebook:cubook line:@chulabook หรือสั่งซื้อผ่าน Call Center โทร.0-2255-4433 ซื้อครบ 700 บาทจัดส่งฟรีทั่วประเทศ`} /> 
        <meta property="og:image" content={`${api.frontend_url}/images/homepage.jpg`} /> 
        <meta property="og:url" content={`https://www.chulabook.com`} /> 
        <meta property="og:site_name" content="CHULABOOK" /> 

        <meta name="twitter:image" content={`${api.frontend_url}/images/homepage.jpg`} /> 
        <meta name="twitter:title" content={`ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย`} /> 
        <meta name="twitter:description" content={`จำหน่ายหนังสือ คู่มือสอบ หนังสือเรียนและหนังสือทั่วไป ในราคาพิเศษกว่าร้านอื่นๆ สั่งซื้อผ่านเว็บไซต์ www.chulabook.com  Facebook:cubook line:@chulabook หรือสั่งซื้อผ่าน Call Center โทร.0-2255-4433 ซื้อครบ 700 บาทจัดส่งฟรีทั่วประเทศ`} /> 
        <meta name="twitter:site" content="CHULABOOK" /> 
        <meta name="twitter:creator" content="CHULABOOK" /> 
      </Head>
      
      {
        !isMobile ? (
          <MainMarketplace 
            t={t}
            banner={banner} pageRec={pageRec} rec_group={rec_group}
            best_seller={best_seller} new_products={new_products} voucher={voucher}
            shop={shop}
          />
        ) : (
          <MobileMainMarketplace 
            t={t}
            banner={banner} pageRec={pageRec} rec_group={rec_group}
            best_seller={best_seller} new_products={new_products} voucher={voucher}
            shop={shop}
          />
        )
      }
      

    </Layout>
  )
}



Marketplace.getInitialProps = async ({req}) => {
  
  const [banner_res,pageRec_res,best_seller_res,new_products_res,recGroup_res,voucher_res,shop_res] = await Promise.all([
    api.getBanner('marketplace', 'cu'),
    api.getRecommend({type: 'rec_marketplace', prod_limit : 4}),
    api.getRecProductByKey('best-seller-mkp', { limit: 10 }),
    api.getRecProductByKey('new_products_mkp', { limit: 10 }),
    api.getRecommend({ type: 'rec_mkp', prod_limit : 10 }),
    api.getVoucher({ key: 'marketplace' }),
    api.getShop()
  ])
  var banner = banner_res.data;
  var pageRec = pageRec_res.data;
  var rec_group = recGroup_res.data
  var best_seller = best_seller_res.data
  var new_products = new_products_res.data
  var voucher = voucher_res.data
  var shop = shop_res.data

  return { 
    banner,pageRec,rec_group,best_seller,new_products,voucher,shop,
    namespacesRequired: ['home','header','footer', 'order_detail'],
  }; //has to be like an object
}


export default withTranslation('home')(Marketplace)