import Head from 'next/head';
import { useRouter } from "next/router";
import React, { useContext, useState } from 'react';
import Autocomplete from '../../../components/mobile/Autocomplete';
import MainFilter from '../../../components/mobile/product/MainFilter';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import { Link } from '../../../utils/i18n';
import tools from '../../../utils/tools';

const MobileMainFilter = (props) =>{
  const {t, query, cates : cate, pathname, isSeller = false, setLoading, shop_name, type, s_category, products, level, level1_id, level2_id, level3_id, page_path,
    main, currentLanguage, cateData} = props;
  const { user, local } = useContext(UserContext)
  const [invisible, setinvisible] = useState(true);

  const showCount = () => {
    if (!user || user.cart.length == 0)
      return ''
    return user.cart.length > 9 ? <span>9<span>+</span></span> : <span>{user.cart.length}</span>
  }
  // var cate_content = tools.dataCategory(cate, query.main_category, query.sub_category, query.category);
  // var text_title = ''
  // var text_name = ''

  // if(query && query.text) {
  //   text_title = `${query.text} | ร้านหนังสือศูนย์หนังสือจุฬาฯ`;
  //   text_name = query.text;
  // }else if (cate_content && cate_content.length > 0) {
  //   text_title = `${cate_content[0]['name_'+local] || 'ค้นหาหนังสือ'} | ร้านหนังสือศูนย์หนังสือจุฬาฯ`;
  //   text_name = cate_content[0]['name_'+local];
  // }else{
  //   text_title = `ค้นหาหนังสือ | ร้านหนังสือศูนย์หนังสือจุฬาฯ`;
  //   text_name = '';
  // }

  return (
    <>
      {/* <Head>
        <title>{'ร้านหนังสือศูนย์หนังสือจุฬาฯ | สั่งซื้อหนังสือออนไลน์ อีบุ๊ค ราคาพิเศษ'}</title>

        <meta name="description" content={`เว็บไซต์ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย สั่งซื้อหนังสือออนไลน์ อีบุ๊ค สินค้าไลฟ์สไตล์ ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี`} />
        <meta name="keywords" content={`ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย , ร้านหนังสือ, ร้านขายหนังสือออนไลน์,หนังสือ, คู่มือสอบ,หนังสือเรียน,เตรียมสอบ,นิยาย,หนังสือทั่วไป,คอร์สเรียนออนไลน์,Online Course,E-Book, อีบุ๊ค, ของที่ระลึก,อุปกรณ์เครื่องเขียน,chulabook,ศูนย์หนังสือจุฬาฯ,ตำราวิชาการ`} />

        <meta property="og:type" content="website" /> 
        <meta property="og:title" content={`ร้านหนังสือศูนย์หนังสือจุฬาฯ | สั่งซื้อหนังสือออนไลน์ อีบุ๊ค ราคาพิเศษ`} /> 
        <meta property="og:description" content={`เว็บไซต์ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย สั่งซื้อหนังสือออนไลน์ อีบุ๊ค สินค้าไลฟ์สไตล์ ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี`} /> 
        <meta property="og:image" content={`${api.frontend_url}/images/homepage.jpg`} /> 
        <meta property="og:site_name" content="CHULABOOK" /> 

        <meta name="twitter:image" content={`${api.frontend_url}/images/homepage.jpg`} /> 
        <meta name="twitter:title" content={`ร้านหนังสือศูนย์หนังสือจุฬาฯ | สั่งซื้อหนังสือออนไลน์ อีบุ๊ค ราคาพิเศษ`} /> 
        <meta name="twitter:description" content={`เว็บไซต์ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย สั่งซื้อหนังสือออนไลน์ อีบุ๊ค สินค้าไลฟ์สไตล์ ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี`} /> 
        <meta name="twitter:site" content="CHULABOOK" /> 
        <meta name="twitter:creator" content="CHULABOOK" /> 
        <meta name="google-site-verification" content="dBDOYd14FFLmHNrRUPCDvPoN1zgAFmN9TLJ6ieEhDpU" />
      </Head> */}
      <div className={invisible ? "order-nav h-64px" : "order-border order-nav h-64px"}>
        <div className="d-flex container">
          <Link href='/'>
            <a className="btn-back cart-nav-back"  >
              <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
            </a>
          </Link>
          <div className="ml-4 w-100">
            <Autocomplete />
          </div>
          {
            user ? (
              <Link href="/user/cart">
                <a className="my-auto ml-2 img-cart">
                  <img src={'/mobile/image/icon/icon-cart.svg'} className="float-right" />{showCount()}
                </a>
              </Link>
            ) : (
              <Link href="/login">
                <a className="my-auto ml-2">
                    <img src={'/mobile/image/icon/icon-cart.svg'} className="float-right" />
                </a>
              </Link>
            )
          }
        </div>
      </div>

      <MainFilter 
        shop_name={shop_name}
        query={query} pathname={pathname} t={t} s_category={s_category}
        products={products} page_path={page_path} type={type} isSeller={isSeller}
        setinvisible={setinvisible} invisible={invisible} user={user} level={level} 
        level1_id={level1_id} level2_id={level2_id} level3_id={level3_id}
        main={main} currentLanguage={currentLanguage}
        cateData={cateData}
      />
    </>
  )
}

export default MobileMainFilter