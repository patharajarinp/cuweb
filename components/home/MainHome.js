import React, { useState, useEffect, useContext, useRef } from 'react'
import Router from 'next/router'
import { Button, Modal } from 'react-bootstrap';
import { Link, withTranslation } from '../../utils/i18n';
import Slick from "react-slick";
import Banner from '../../components/banner';
import Shimmer from '../../components/Shimmer';
import CardPH from '../../components/shimmer/Card';
import { CardGrid } from '../../components/widget/card';
import { CardNews } from '../../components/widget/card_new';
import api from '../../utils/api';

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: false,
        dots: false
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: false,
        dots: false
      }
    }
  ]
};
const settingscard = {
  dots: false,
  slidesToShow: 4,
  infinite: false,
  touchMove: true,
  arrows: true
};
const settingscardmin = {
  className: "slider variable-width img-slick",
  dots: false,
  slidesToShow: 3,
  infinite: false,
  touchMove: true,
  arrows: true
};
const settingscardmini = {
  className: "slider variable-width img-slick",
  dots: false,
  slidesToShow: 2,
  infinite: false,
  touchMove: true,
  arrows: true
};


const MainHome = (props) => {
  const { t, banner, best_seller, new_book, news, alliances, recommend, ebook, course, pre, voucher, productsCookie } = props;
  const bestSellerRows = Array.isArray(best_seller && best_seller.rows) ? best_seller.rows : [];
  const newBookRows = Array.isArray(new_book && new_book.rows) ? new_book.rows : [];
  const recommendList = Array.isArray(recommend) ? recommend : [];
  const ebookRows = Array.isArray(ebook && ebook.rows) ? ebook.rows : [];
  const courseRows = Array.isArray(course && course.rows) ? course.rows : [];
  const voucherRows = Array.isArray(voucher && voucher.rows) ? voucher.rows : [];
  const productsCookieRows = Array.isArray(productsCookie) ? productsCookie : [];
  const newsRows = Array.isArray(news && news.rows) ? news.rows : [];
  const alliancesRows = Array.isArray(alliances) ? alliances : [];


  return (
    <>
      <div className="container">
        <div className="row">
          <Banner data={banner.banner_images} type={banner.type} />
        </div>
        <h1 className="seo-text text-pink text-center pt-3">{'ร้านหนังสือศูนย์หนังสือจุฬาฯ'}</h1>

        <div className="row mt-5 mb-2">
          <div className="col-4"></div>
          <div className="col-4">
            <div className="text-center">
              <h2 className="seo-text text-pink">{t('translations:bestseller')}</h2>
            </div>
          </div>
          <div className="col-4">
            <div className="float-right">
              <Link href={`/best-seller`}>
                <button className="btn btn-outline-primary">{t('translations:view_all')}</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="d-none d-xl-block">
          <div className="row  border-bottom">
            {
              best_seller ? <div className="col-12 "><Slick {...settingscard} className="slickcard">
                {

                  bestSellerRows.length > 0 ? bestSellerRows.map((product, index) => <CardGrid product={product} key={index} new_padding={true} show={4} />) : ''
                }
              </Slick> </div> : <CardPH show={4} grid={4} new_padding={true} classes={'p-2'} />
            }

          </div>
        </div>
        <div className="d-xl-none">
          <div className="row border-bottom">

            {
              best_seller ? <div className="col-12 "><Slick {...settingscardmin} className="slickcardmin">
                {

                  bestSellerRows.length > 0 ? bestSellerRows.map((product, index) => <CardGrid product={product} key={index} show={3} />) : ''
                }
              </Slick> </div> : <CardPH show={3} grid={3} />

            }
          </div>
        </div>



        <div className="row mt-5 mb-2">
          <div className="col-4"></div>
          <div className="col-4">
            <div className="text-center">
              <h2 className="text-pink">{t('new_book')}</h2>
            </div>
          </div>
          <div className="col-4">
            <div className="float-right">
              <Link href={`/new_book`}>
                <button className="btn btn-outline-primary">{t('translations:view_all')}</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="d-none d-xl-block">
          <div className="row  pb-4rem border-bottom">
            {
              new_book ? <div className="col-12 "><Slick {...settingscard} className="slickcard">
                {

                  newBookRows.length > 0 ? newBookRows.map((val, index) => <CardGrid product={val} key={index} new_padding={true} show={4} />) : ''
                }
              </Slick> </div> : <CardPH show={4} grid={4} new_padding={true} />
            }
          </div>
        </div>
        <div className="d-xl-none">
          <div className="row border-bottom">
            {
              new_book ? <div className="col-12 "><Slick {...settingscardmin} className="slickcardmin">
                {

                  newBookRows.length > 0 ? newBookRows.map((val, index) => <CardGrid product={val} key={index} new_padding={true} show={3} />) : ''
                }
              </Slick> </div> : <CardPH show={3} grid={3} new_padding={true} />
            }
          </div>
        </div>

        {
          productsCookieRows.length > 0 &&
          (
            productsCookieRows.length > 0 ?
              <>
                <div className="row mt-5">
                  <div className="col-4"></div>
                  <div className="col-4">
                    <div className="text-center">
                      <h2 className="text-pink">{t('translations:recommend_for_you')}</h2>
                    </div>
                  </div>
                  <div className="col-4"></div>
                </div>
                <div className="d-none d-xl-block">
                  <div className="row">
                    {
                      productsCookieRows.length > 0 ?
                        <div className="col-12 ">
                          <Slick {...settingscard} className="slickcard">
                            {

                              productsCookieRows.length > 0 ? productsCookieRows.map((val, index) => <CardGrid product={val} key={index} new_padding={true} show={4} />) : ''
                            }
                          </Slick>
                        </div> : <CardPH show={4} grid={4} new_padding={true} />
                    }
                  </div>
                </div>

              </> : ''
          )
        }
        


        {
          recommendList.length > 0 ? (
            <>
              <div className="row mt-5">
                <div className="col-4"></div>
                <div className="col-4">
                  <div className="text-center">
                    <h2 className="text-pink">{t('translations:recommended_books')}</h2>
                  </div>
                </div>
                <div className="col-4">
                  <div className="float-right">
                    <Link href="/main-category-recommend">
                      <button className="btn btn-outline-primary">{t('translations:view_all')}</button>
                    </Link>
                  </div>
                </div>
              </div>
              {
                recommendList.map((val, index) => (
                  <div className="d-none d-xl-block" key={index}>
                    <div className="row mt-5">
                      <div className="col-3">
                        <Link href={`/recommend/[key]?key=${val.key}`} as={`/recommend/${val.key}`}>
                          <a><img src={val.image} className="mw-100" alt={val.name_th} /></a>
                        </Link>
                      </div>
                      {
                        val.products ? <div className="col-9 px-0 slide-con-detail home">
                          <Slick {...settingscardmin} className="slickcardmin recom">
                            {
                              Array.isArray(val.products) && val.products.map((product, index2) => <CardGrid product={product} key={index2} show={3} classes={'cl-m-break'} />)
                            }
                          </Slick> </div> : <CardPH show={3} grid={3} new_padding={true} />
                      }
                    </div>
                  </div>

                ))
              }

              {
                recommendList.map((val, index) => (
                  <div className="d-xl-none" key={val.key}>
                    <div className="row mt-5">
                      <div className="col-4">
                        <Link href={`/recommend/[key]?key=${val.key}`} as={`/recommend/${val.key}`}>
                          <a><img src={val.image} className="mw-100" alt={val.name_th} /></a>
                        </Link>
                      </div>
                      {
                        val.products ? <div className="col-8 px-0 slide-con-detail home">
                          <Slick {...settingscardmini} className="slickcardmini">
                            {
                              Array.isArray(val.products) && val.products.map((product, index2) => <CardGrid product={product} key={index2} show={3} classes={'cl-m-break'} />)
                            }
                          </Slick> </div> : <CardPH show={3} grid={3} new_padding={true} />
                      }
                    </div>
                  </div>

                ))
              }
            </>
          ) : t('translations:no_data')
            (
              <>
                <div className="row mt-5">
                  <div className="col-4"></div>
                  <div className="col-4">
                    <div className="text-center">
                      <Shimmer size={[300, 30]} />
                    </div>
                  </div>
                  <div className="col-4"></div>
                </div>
                <div className="row mt-5"><CardPH show={4} grid={4} /></div>
              </>
            )

        }
      </div>
      <div className="container-fuild position-relative mt-5 mb-2 bg-green">
        <div className="position-absolute bg-box"></div>
        <div className="container">
          <div className="row pt-5 mb-2" >
            <div className="col-4"></div>
            <div className="col-4">
              <div className="text-center">
                <h2 className="text-pink">{t('translations:bestsellerebook')}</h2>
              </div>
            </div>
            <div className="col-4">
              <div className="float-right">
                <Link href={`/recommend/[key]?key=ebook-best-seller`} as={`/recommend/ebook-best-seller`}>
                  <button className="btn btn-outline-primary">{t('translations:view_all')}</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="d-none d-xl-block">
          <div className="row">
            {
              ebook ? <div className="col-12 "><Slick {...settingscard} className="slickcard">
                {

                  ebookRows.length > 0 ? ebookRows.map((product, index) => <CardGrid product={product} key={index} new_padding={true} show={4} />) : ''
                }
              </Slick> </div> : <CardPH show={4} grid={4} new_padding={true} />
            }

          </div>
        </div>
        <div className="d-xl-none">
          <div className="row pb-4rem">
            {
              ebook ? <div className="col-12 "><Slick {...settingscardmin} className="slickcardmin">
                {

                  ebookRows.length > 0 ? ebookRows.map((product, index) => <CardGrid product={product} key={index} new_padding={true} show={3} />) : ''
                }
              </Slick> </div> : <CardPH show={3} grid={3} new_padding={true} />
            }

          </div>
        </div>
      </div>

      {
        courseRows.length > 0 ? (
          <>
            <div className="container-fuild position-relative mb-2 bg-course">
              <div className="position-absolute bg-box"></div>
              <div className="container">
                <div className="row pt-5 mb-2" >
                  <div className="col-4"></div>
                  <div className="col-4">
                    <div className="text-center">
                      <h2 className="text-pink">{t('translations:bestsellercourse')}</h2>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="float-right">
                      <Link href={`/recommend/[key]?key=course-best-seller`} as={`/recommend/course-best-seller`}>
                        <button className="btn btn-outline-primary">{t('translations:view_all')}</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="d-none d-xl-block">
                <div className="row  border-bottom">
                  {
                    course ? <div className="col-12 "><Slick {...settingscard} className="slickcard">
                      {

                        courseRows.length > 0 ? courseRows.map((product, index) => <CardGrid product={product} key={index} new_padding={true} show={4} />) : ''
                      }
                    </Slick> </div> : <CardPH show={4} grid={4} new_padding={true} />
                  }
                </div>
              </div>
              <div className="d-xl-none">
                <div className="row pb-4rem border-bottom">
                  {
                    course ? <div className="col-12 "><Slick {...settingscardmin} className="slickcardmin">
                      {
                        courseRows.length > 0 ? courseRows.map((product, index) => <CardGrid product={product} key={index} new_padding={true} show={3} />) : ''
                      }
                    </Slick> </div> : <CardPH show={3} grid={3} new_padding={true} />
                  }
                </div>
              </div>
            </div>
          </>
        ) : null
      }



      <div className="container">
        {
          voucherRows.map((val, index) => (
            <div className="row mt-32" key={index}>
              <div className="col-12">
                <img src={val.image} className="w-100" alt="ศูนย์หนังสือจุฬาฯ" />
              </div>
            </div>
          ))
        }
        

        <div className="row mt-5">
          <div className="col-xl-3 col-6 pr-0">
            <div className="d-flex align-items-center set-shipping1 px-2">
              <img src={`${api.frontend_url}/icon/shipping.svg`} className="pl-xl-3" alt="การจัดส่งสินค้า" />
              <p className=" pl-3">
                {t('free_delivery_nationwide')}<br />
                {t('buy_now_no_minimum')}
              </p>
            </div>
          </div>
          <div className="col-xl-3 col-6 pl-md-0 px-xl-0">
            <div className="d-flex align-items-center set-shipping2 px-2">
              <img src={`${api.frontend_url}/icon/card.svg`} className="pl-xl-3" alt="การชำระเงิน" />
              <p className=" pl-3 ">
                {t('safe_when_paying_online')}
                {t('peace_mind_no_fees')}
              </p>
            </div>
          </div>
          <div className="col-xl-3 col-6 px-xl-0 pr-md-0">
            <div className="d-flex  align-items-center set-shipping3 px-2">
              <img src={`${api.frontend_url}/icon/shop.svg`} className="pl-xl-3" alt="คุณภาพสินค้า" />
              <p className=" pl-3">
                {t('convenient_products')}
                {t('get_many_branches_from')}
              </p>
            </div>
          </div>
          <div className="col-xl-3 col-6 pl-0">
            <div className="d-flex  align-items-center set-shipping4 px-2">
              <img src={`${api.frontend_url}/icon/like.svg`} className="pl-xl-3" alt="การสั่งซื้อสินค้า" />
              <p className=" pl-3">
                {t('be_assured')}
                {t('over_years')}
              </p>
            </div>
          </div>
        </div>


        <div className="row mt-5">
          <div className="col-4"></div>
          <div className="col-4">
            <div className="text-center">
              <h2 className="">{t('translations:news_activities')}</h2>
            </div>
          </div>
          <div className="col-4">
            <div className="float-right">
              <Link href={`/news`}>
                <a><button className="btn btn-outline-primary">{t('translations:view_all')}</button></a>
              </Link>
            </div>
          </div>
        </div>
        <div className="d-none d-xl-block">
          <div className="row mt-5 pb-5">
            {
              newsRows.map((news, index) => <CardNews news={news} key={index} type="news" show={4} t={t} />)
            }
          </div>
        </div>
        <div className=" d-block d-xl-none">
          <div className="row mt-5 pb-5">
            {
              newsRows.slice(0, 3).map((news, index) => <CardNews news={news} key={index} type="news" show={3} t={t} />)
            }
          </div>
        </div>
      </div>
      <div className="bg-gray-new">
        <div className="container">
          <div className="row pt-5 pb-4">
            <div className="col-12">
              <div className="text-center">
                <h2 className="">{t('partnerships')}</h2>
              </div>
            </div>
          </div>
          <div className="row pb-5">
            <div className="col-12 alliance">
              <Slick {...settings}>
                {
                  alliancesRows.map((val, index) => (
                    <div className="cate" key={index}>
                      <a target="_blank" href={val.link}>
                        <div className="btn-set">
                          <img src={val.image} alt={val.alt_image || val.name} />
                        </div>
                      </a>
                    </div>
                  ))
                }
              </Slick>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainHome