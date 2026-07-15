import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import api from '../utils/api';
import { Router } from '../utils/i18n';
import { setCookie, getCookie } from 'cookies-next';
import useMediaQuery from '../hooks/useMediaQuery';

const cover_page = ({ data }) => {

  const handleRedirect = (e, lng) => {
    e.preventDefault();
    setCookie('skip_landing', 1, { maxAge: 60 * 60 * 24 });
    // Router.push(`/${lng}`);
    window.location = `/${lng}`;
    // console.log('redirect')
    // alert('redirect')
  }

  const isMobile = useMediaQuery(992);


  return (
    <>
      <Head>
        <title>{'ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย  | สั่งซื้อหนังสือออนไลน์ อี-บุ๊ค(Ebook) คอร์สเรียนออนไลน์ และไลฟ์สไตล์ ในราคาพิเศษ'}</title>

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
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="stylesheet" href={`${api.frontend_url}/css/font.css`} />
        <link rel="stylesheet" href={`${api.frontend_url}/css/main.css`} />
        <link rel="stylesheet" href={`${api.frontend_url}/css/style.css`} />
        <link rel="stylesheet" href={`${api.frontend_url}/css/bootstrap.css`} />

      </Head>

      {
        !isMobile ? (
          <>
            {/* <div className="cover-page-area" style={{backgroundImage: `url(${data.image})`}}>
            <div className="cover-page-btn">
              <button type='button' className="btn btn-primary mr-3 btn-cover" onClick={(e) => handleRedirect(e, '')}>เข้าสู่เว็บไซต์</button>
              <button type='button' className="btn btn-primary btn-cover" onClick={(e) => handleRedirect(e, 'en')}>Enter Website</button>
            </div>
          </div> */}
            <div className='desktop-landing'>
              <img src={data.image} className='' />
            </div>
            <div className="mt-4 d-flex justify-content-center">
              <button type='button' className="btn btn-primary mr-3 btn-cover" onClick={(e) => handleRedirect(e, '')}>เข้าสู่เว็บไซต์</button>
              <button type='button' className="btn btn-primary btn-cover" onClick={(e) => handleRedirect(e, 'en')}>Enter Website</button>
            </div>
          </>
        ) : (
          <div>
            <img src={data.image} className='w-100' />
            <div className="mt-4 d-flex justify-content-center">
              <button type='button' className="btn btn-primary mr-3 btn-cover" onClick={(e) => handleRedirect(e, '')}>เข้าสู่เว็บไซต์</button>
              <button type='button' className="btn btn-primary btn-cover" onClick={(e) => handleRedirect(e, 'en')}>Enter Website</button>
            </div>
          </div>
        )
      }


    </>
  )
}

cover_page.getInitialProps = async function (ctx) {
  const BASE = process.env.NEXT_PUBLIC_API_URL || process.env.api_url || process.env.API_URL || api.baseUrl;
  let data = { status: 0 };
  try {
    const response = await fetch(`${BASE}/cms/cover_page/1`);
    data = await response.json();
  } catch (err) {
    console.error('Failed to fetch cover page:', err && err.message ? err.message : err);
  }
  const { req, res, query } = ctx;
  const skipLanding = getCookie('skip_landing', ctx);
  console.log(skipLanding, 'skipLanding')
  if ((data.status == 0 || new Date(data.publish_date) > new Date()) || (skipLanding !== undefined && skipLanding == '1')) {
    res.redirect("/")
  }

  // console.log('data', data)
  // console.log('date', new Date(data.publish_date) > new Date())
  // console.log('skipLanding', skipLanding)


  return {
    data,
    namespacesRequired: [],
  };
};

export default cover_page