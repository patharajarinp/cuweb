import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Lightbox } from "react-modal-image";
import Paginate from 'react-paginate';
import Slick from "react-slick";
import Loading from '../loading';
import { CardGrid } from '../widget/card';
import api from '../../utils/api';
import { Link, withTranslation } from "../../utils/i18n";
import tools from '../../utils/tools';
import Head from 'next/head';
import {
  FacebookShareButton,
  LineShareButton,
  TwitterShareButton
} from "react-share";
const News = (props) => {
  const { page_key, type, t, data : news,  books : book, query } = props;
  const [loading, setLoading] = useState(false)
  // const [news, setNews] = useState();
  // const [book, setBook] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [img, setImg] = useState(0);

  const router = useRouter();
  const key = router.query.key
  const subkey = router.query.subkey
  const id = subkey;

  // const feachNews = () => {
  //   // setLoading(true)
  //   api.getOneNews(subkey).then(res => {
  //     const data = res.data;
  //     // ;
  //     setNews(data);
  //     setLoading(false)
  //   })
  //     .catch(err => {
  //       setLoading(false)
  //       console.log(err);
  //     })
  // }

  // const fetchNewsBook = (params) => {
  //   setLoading(true)
  //   params.page = params.page || 1;
  //   params.limit = params.limit || 16;
  //   api.getNewsByID(id, params).then(res => {
  //     const data = res.data;
  //     setBook(data);
  //     console.log(data);
  //     setPageCount(Math.ceil(data.count / 16));
  //     setLoading(false)
  //   })
  //     .catch(err => {
  //       setLoading(false)
  //       console.log(err.response);
  //     })
  // };
  // const fetchPromoBook = (params) => {
  //   setLoading(true)
  //   params.page = params.page || 1;
  //   params.limit = params.limit || 16;
  //   api.getProductPromotion(id, params).then(res => {
  //     const data = res.data;
  //     setBook(data);
  //     setPageCount(Math.ceil(data.count / 16));
  //     setLoading(false)
  //   })
  //     .catch(err => {
  //       setLoading(false)
  //       console.log(err.response);
  //     })
  // };



  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F8F9FA";
    }

    setPageCount(Math.ceil(book.count / 16));
    // feachNews();
    // alert(key)
    // if (page_key == 'promotion') {
    //   fetchPromoBook({});
    // }
    // else {
    //   fetchNewsBook({});
    // }

  }, [subkey, book]);
  const settings = {
    className: "slider variable-width img-slick",
    variableWidth: true,
    dots: false,
    infinite: false,
    speed: 500,

  };


  function useWindowSize() {
    const isClient = typeof window === 'object';

    function getSize() {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
      };
    }

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
      if (!isClient) {
        return false;
      }

      function handleResize() {
        setWindowSize(getSize());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return windowSize;
  }
  const size = useWindowSize();

  const closeLightbox = (val) => {
    setImg(val);
    setIsOpen(true);
  };

  const [pageCount, setPageCount] = useState(1)
  const [pageNumber, setPagenumber] = useState(0);

  const handlePageClick = data => {
   
    let selected = data.selected;
    let prep_query = {...query,page: selected+1}
    delete prep_query.subkey

    var query_str = tools.serializeURL(prep_query)

    setPagenumber(selected);
    document.getElementById('show-scroll').scrollIntoView({ behavior: "smooth" });

    var route = `/${page_key}/[subkey]`
    var as = `/${page_key}/${id}${query_str ? `?${query_str}` : ''}`

    router.push({
      pathname : route,
      query : prep_query
    }, as )
    // if (page_key == 'promotion') {
    //   fetchPromoBook({ page: selected + 1 });
    // }
    // else {
    //   fetchNewsBook({ page: selected + 1 });
    // }
  }
  var detail = '';
  if (news && news.detail_th) {
    detail = news.detail_th.replace(/<[^>]+>/g, '').substring(0, 180);
  }

  // console.log('news', news);
  // console.log('book', book);
  return (
    <>
      {loading && <Loading />}
      <Head>
        {
          !!news && (
            <>
              <title>{news.title_th ? news.title_th : 'News Details'}</title>
              <meta name="description" content={detail ? detail : news.title_th} />
              <meta name="keywords" content={`ร้านหนังสือ, ร้านหนังสือออนไลน์, ${news.title_th}, ข่าวสาร, ข่าวสารและกิจกรรม, โปรโมชั่น ศูนย์หนังสือจุฬาฯ, CHULABOOK`} />
              <meta property="og:type" content="website" />
              <meta property="og:title" content={news.title_th ? news.title_th : 'News Details'} />
              <meta property="og:description" content={detail ? detail : (news.title_th ? news.title_th : 'News Details')} />
              <meta property="og:image" content={news.image ? news.image : `${api.frontend_url}/images/book.png`} />
              <meta property="og:url" content={`https://www.chulabook.com/${key}/${subkey}`} />
              <meta property="og:site_name" content="CHULABOOK" />

              <meta name="twitter:image" content={news.image ? news.image : `${api.frontend_url}/images/book.png`} />
              <meta name="twitter:title" content={news.title_th} />
              <meta name="twitter:description" content={detail ? detail : news.title_th} />
              <meta name="twitter:site" content="CHULABOOK" />
              <meta name="twitter:creator" content="CHULABOOK" />

            </>
          )
        }
      </Head>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href='/' as={'/'}>
                    <a>หน้าหลัก</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  {page_key == "news" && <Link href="/news-article" as={`/news-article`}><a>ข่าวประชาสัมพันธ์</a></Link>}
                  {page_key == "activities" && <Link href="/events" as={`/events`}><a>ภาพกิจกรรม</a></Link>}
                  {page_key == "procurement" && <Link href="/procure" as={`/procure`}><a>ประกาศจัดซื้อจัดจ้าง</a></Link>}
                  {page_key == "promotion" && <Link href="/promotion" as={`/promotion`}><a>โปรโมชั่น</a></Link>}
                </li>
                <li className="breadcrumb-item active">
                  {news && news.title_th}
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row mt-5 justify-content-center">
          <div className="col-10">
            <h1 className='seo-text'>{news && news.title_th}</h1>
          </div>
          {
            page_key != "promotion" ? (
              <div className="col-10 d-flex align-items-center justify-content-between">
                <p className="p-medium pt-3 pb-4 text-success">วันที่ {news ? tools.formatDate(news.publish_date, true, false) : ''}</p>
                <div className="detail-social d-flex align-items-center">
                  <p className="font-weight-bold mr-3">Share in social media : </p>
                  <FacebookShareButton url={`https://www.chulabook.com/${page_key}/${subkey}`}>
                    <img src={`${api.frontend_url}/icon/d-facebook.svg`} alt="facebook" />
                  </FacebookShareButton>
                  <TwitterShareButton url={`https://www.chulabook.com/${page_key}/${subkey}`}>
                    <img src={`${api.frontend_url}/icon/d-twitter.svg`} alt="twitter" />
                  </TwitterShareButton>
                  <LineShareButton url={`https://www.chulabook.com/${page_key}/${subkey}`}>
                    <img src={`${api.frontend_url}/icon/d-line.svg`} alt="line" />
                  </LineShareButton>
                </div>
              </div>
            ) : (<div className="col-10 d-flex align-items-center justify-content-end">
                  <div className="detail-social d-flex align-items-center">
                    <p className="font-weight-bold mr-3">Share in social media : </p>
                    <FacebookShareButton url={`https://www.chulabook.com/${page_key}/${subkey}`}>
                      <img src={`${api.frontend_url}/icon/d-facebook.svg`} alt="facebook" />
                    </FacebookShareButton>
                    <TwitterShareButton url={`https://www.chulabook.com/${page_key}/${subkey}`}>
                      <img src={`${api.frontend_url}/icon/d-twitter.svg`} alt="twitter" />
                    </TwitterShareButton>
                    <LineShareButton url={`https://www.chulabook.com/${page_key}/${subkey}`}>
                      <img src={`${api.frontend_url}/icon/d-line.svg`} alt="line" />
                    </LineShareButton>
                  </div>
                </div>)
          }
          <div className="col-10">
            {
              news && <div className="show-editor" dangerouslySetInnerHTML={{ __html: news.detail_th }} />
            }
          </div>
        </div>

        {
          ((news && news.news_docs) && news.news_docs.length > 0) ? (
            news.news_docs.map((val, index) => (
              <div className="row mt-4 justify-content-center" key={index}>
               
                <div className="col-10">
                  <div className="doc-detail d-flex justify-content-between">
                    <p className="p-medium">{val.title_th}</p>
                    <p className="p-medium text-pink"><a target="_blank" href={val.link}><img className="mr-2" src={`${api.frontend_url}/icon/download.svg`} />ดาวน์โหลด</a></p>
                  </div>
                </div>
              </div>
            ))
          ) : ''
        }
        {

        }
        {
          (news && (news.news_galleries && news.news_galleries.length > 0)) ? (
            <>
             <div className="bg-white">
                <div className="container">
                  <div className="row mt-5 pt-5">
                    <div className="col-12">
                      <div className="text-center">
                        <h2>{t("mobile_translations:gallery")}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 slide-con-detail">
                <Slick {...settings}>
                  {
                    news.news_galleries.map((val, index) => (
                      <div className="box-item-gar " style={{ width: "548px", height: "321px" }} >
                        <div className="bg-img">
                          <img src={`${val.image}`} onClick={() => closeLightbox(val.image)} style={{ cursor: 'pointer' }} />
                        </div>
                        {/* <div  style={{background: `url(${val.image})`, width:"100%" ,backgroundPosition: "center" ,height: "100%",backgroundSize: "cover"}}>
                    </div> */}
                      </div>
                    ))
                  }
                </Slick>
              </div>
            </> 
          ) : ''
        }
      </div>

      {
        page_key == "promotion" ? (
          <>
            {
              (book && book.count) ? (
                <div className="bg-white" id="show-scroll">
                  <div className="container">
                    <div className="row mt-5 pt-5">
                      <div className="col-12">
                        <div className="text-center">
                          <h2>{page_key == 'promotion' ? 'สินค้าร่วมรายการ' : 'หนังสือที่เกี่ยวข้อง'}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-5">

                      {
                        book ? book.rows.map((product) => <CardGrid product={product} classes="mb-5" show={4} />) : ''
                      }


                    </div>
                    <div className="row w-100 mt-5">
                      <div className="col-12 px-0">
                        <div className="float-right page-order">
                          <Paginate
                            previousLabel={t('translations:prev')}
                            nextLabel={t('translations:next')}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={pageCount}
                            forcePage={pageNumber}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="end-page"></div>
                </div>
              ) : <div className="end-page"></div>
            }
          </>
        ) : (
            <>
              {
                (book && book.count) ? (
                  <div className="bg-white" id="show-scroll">
                    <div className="container">
                      <div className="row mt-5 pt-5">
                        <div className="col-12">
                          <div className="text-center">
                            <h2>{page_key == 'promotion' ? 'สินค้าร่วมรายการ' : 'หนังสือที่เกี่ยวข้อง'}</h2>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-5">

                        {
                          book ? book.rows.map((product) => <CardGrid product={product} classes="mb-5" show={4} />) : ''
                        }


                      </div>
                      <div className="row w-100 mt-5">
                        <div className="col-12 px-0">
                          <div className="float-right page-order">
                            <Paginate
                              previousLabel={t('translations:prev')}
                              nextLabel={t('translations:next')}
                              breakLabel={'...'}
                              breakClassName={'break-me'}
                              pageCount={pageCount}
                              forcePage={pageNumber}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={5}
                              onPageChange={handlePageClick}
                              containerClassName={'pagination'}
                              subContainerClassName={'pages pagination'}
                              activeClassName={'active'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="end-page"></div>
                  </div>
                ) : <div className="end-page"></div>
              }
            </>
          )
      }


      {
        isOpen && (
          <Lightbox
            medium={img}
            large={img}
            // alt="Hello World!"
            onClose={() => setIsOpen(false)}
          />
        )
      }
    </>
  )
}
News.getInitialProps = ({ query }) => {
  return { query }; //has to be like an object
}
export default withTranslation(['Order'])(News)