// import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Fade } from 'reactstrap';
import NavbarCustom from '../../../components/mobile/NavbarCustom';
import CardPH from '../../../components/mobile/shimmer/Card';
import CardGrid from '../../../components/mobile/widget/Card';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import {Link, withTranslation } from '../../../utils/i18n';
import tools from '../../../utils/tools';
import BreadcrumbMB from '../BreadcrumbMB';

const MobileDetail = (props) => {
  const { page, type, t, page_key, data : news, books : book } = props;
  // const [news, setNews] = useState();
  // const [book, setBook] = useState();

  const router = useRouter();
  const key = "news";
  const subkey = router.query.subkey;
  const id = subkey;
  const { formatDate } = tools;
  const { user } = useContext(UserContext);
  // const feachNews = () => {

  //   api.getOneNews(subkey).then(res => {
  //     const data = res.data;
  //     // ;
  //     setNews(data);

  //   })
  //     .catch(err => {
  //       console.log(err);
  //     })
  // }

  // const fetchNewsBook = () => {
  //   api.getNewsByID(id).then(res => {
  //     const data = res.data;
  //     setBook(data);

  //   })
  //     .catch(err => {
  //       console.log(err.response);
  //     })
  // };



  useEffect(() => {
    if (!subkey) {
      return false;
    }
    // feachNews();
    // fetchNewsBook();
  }, [subkey]);


  const settings = {
    className: "slider variable-width img-slick",
    variableWidth: true,
    dots: false,
    infinite: false,
    speed: 500,

  };
  const shareData = () => {
    if (!news) {
      return false;
    }
    return {
      title: news.title_th,
      text: `${t("title")} : ${news.title_th}`,
      url: `https://www.chulabook.com/news/${news.id}`,
    }
  }
  const handleShare = (e) => {
    try {
      // console.log(navigator);
      navigator.share(shareData())
    } catch (err) {
      console.log(err);
    }
  }
  const [dropdownInfo, setdropdownInfo] = useState(false);
  const toggledropdownInfo = () => setdropdownInfo(!dropdownInfo);
  return (

    <>
      
      <NavbarCustom isBurger isLang={false} right={<>
        <div className="d-flex justify-content-between align-items-center btn-right-nav">
          <a className="btn-share mr-1" onClick={(e) => handleShare(e)}>
            <img className="" src={'/mobile/image/icon/icon-share.svg'} />
          </a>
          <a className="btn-info-info " onClick={toggledropdownInfo}>

            <img className="" src={'/mobile/image/icon/icon-info.svg'} />
          </a>
        </div>
        <Fade in={dropdownInfo} className="dropdown-info ">
          <Link href='/'>
            <a className="text-default">
              <p className="text-black mb-1">{t("mobile_navbar:home_page")}</p>
            </a>
          </Link>
          {
            user && (
              <Link href="/user/favorite">
                <a className="text-default">
                  <p className="text-black mb-1">{t("mobile_dashboard:my_wishlist")}</p>
                </a>
              </Link>
            )
          }

          {/* <Link href="/categories">
            <a className="text-default">
              <p className="text-black mb-1">{t("mobile_header:category")}</p>
            </a>
          </Link> */}
          {
            user && (
              <Link href="/user/dashboard">
                <a className="text-default">
                  <p className="text-black mb-1">{t("mobile_navbar:my_account")}</p>
                </a>
              </Link>
            )
          }
        </Fade>
      </>}  />

      <div className="bg-light-less-gray min-vh-100">
        {/* <div className="h-64px"></div> */}
        <BreadcrumbMB 
          item={[
            {text: "หน้าหลัก",href:'/',as:'/'},
            {
              text: page_key == "news" ? "ข่าวประชาสัมพันธ์" : page_key == "activities" ? 'ภาพกิจกรรม' : page_key == "procurement"?'ประกาศจัดซื้อจัดจ้าง' :'โปรโมชั่น',
              href: page_key == "news" ? "/news-article" : page_key == "activities" ? '/events' : page_key == "procurement"? '/procure' :'/promotion',
              as: page_key == "news" ? "/news-article" : page_key == "activities" ? '/events' : page_key == "procurement"? '/procure' :'/promotion'
            },
            {text: news && news.title_th,active:true}
          ]}
        />
        <div className="container bg-white pb-4">
          <h1 className="text-black h20 pt-3 text-h2">{news && news.title_th}</h1>
          <p className="text-date-news "> {news ? formatDate(news.publish_date) : ''}</p>
          <p className="pt-3 mb-0 img-fix"> {
            news && <div className="show-editor" dangerouslySetInnerHTML={{ __html: news.detail_th }} />
          }</p>
          {
            ((news && news.news_docs) && news.news_docs.length > 0) ? (
              news.news_docs.map((val, index) => (

                <>
                  <div key={index}>
                    <hr className="use-line "></hr>
                    <h4 className="text-black">{val.title_th}</h4><a target="_blank" href={val.link}>
                      <div className="d-flex">
                        <img classNames="img-fluid mr-3 my-auto" src="/mobile/image/icon/icon-download.svg" />
                        <p className="text-pink ml-2 my-auto">{t("download")}</p>
                      </div>
                    </a>
                  </div>
                </>
              ))
            ) : ''
          }

        </div>
        {
          (news && (news.news_galleries && news.news_galleries.length > 0)) ? (
            <div className="all-card-book-none-text-lef ">
              <div className="container py-3">
                <div className="history-banner " style={{ background: "url('/mobile/image/user/Group 6140@2x.png')" }}></div>
                <div className="d-flex justify-content-between mt-3 ">
                  <div>
                    <h2 className="text-black text-h4">{t("gallery")}</h2>
                  </div>

                </div>
                
                    <div className="d-flex justify-content-start all-card-book">
                      {
                        news.news_galleries.map((val, index) => (
                          <div className="gall mr-2" key={index} style={{ background: `url(${val.image})`, backgroundPosition: "center", backgroundSize: "cover", height: "220px" }}>
                          </div>
                        ))
                      } <div className="gall"></div>
                    </div>
                
              </div>
            </div>
          ) : ''
        }

        {
          (book && book.count > 0) ? (
            <div className="all-card-book-none-text-lef bg-white mt-3 pb-5">
              <div className="container py-3">
                <div className="d-flex justify-content-between ">
                  <div>
                    <h2 className="text-black text-h4">{t("related_books")}</h2>
                  </div>
                  <Link href={`/${page_key}/products/[id]?id=${subkey}`} as={`/${page_key}/products/${subkey}`}>
                    <a ><p className="text-pink see-all-link m-0 ">{t('mobile_translations:view_all')}</p></a>
                  </Link>

                </div>
                <div className="d-flex justify-content-start all-card-book">
                  {
                    book ? (book.count > 0 ? book.rows.map((product, index) => <CardGrid product={product} key={index} />) : (<div>{t("data_not_found")}</div>)) : <CardPH show={4} />
                  }
                  <CardGrid freespace={true} />
                </div>
              </div>
            </div>
          ) : (
            <div className='mt-3 pb-5'></div>
          )
        }
        

      </div>


    </>



  )
}
MobileDetail.getInitialProps = ({ query }) => {
  return { query }; //has to be like an object
}
export default withTranslation('mobile_translations')(MobileDetail)