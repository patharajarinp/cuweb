import React, { useEffect, useState } from 'react';
import Banner from '../../../components/mobile/HomeBanner';
import CardPH from '../../../components/mobile/shimmer/Card';
import CardGrid from '../../../components/mobile/widget/Card';
import CardNews from '../../../components/mobile/widget/card_new';
// import Link from 'next/link';
import classnames from "classnames";
import { Link, withTranslation } from '../../../utils/i18n';
import parse from "html-react-parser";

const MobileMainHome = (props) =>{
  const { t,banner,best_seller,new_book,news,alliances,recommend,ebook, course,pre,voucher,productsCookie } = props;

  return (
    <>
      <div className="padding-top-for-box"></div>
      {banner && <Banner items={banner.banner_images}/>}
      <div className="container pt-3 text-center">
        <h1 className="text-h1">ร้านหนังสือศูนย์หนังสือจุฬา</h1>
      </div>
      <div className="all-card-book-none-text-left">
        <div className="container py-3">
          <div className="d-flex justify-content-between ">
            <div>
              <h2 className="text-black text-h2">{t('mobile_translations:bestseller')}</h2>
            </div>
            <Link href={`/best-seller`}>
              <a ><p className="text-pink see-all-link">{t('mobile_translations:view_all')}</p></a>
            </Link>
          </div>
          <div className="d-flex justify-content-start all-card-book">
            {
              best_seller ? (best_seller.count > 0 ? best_seller?.rows.map((product, index) => <CardGrid product={product} key={index} />) : (<div>{t("mobile_home:data_not_found")}</div>)) : <CardPH show={4} />
            }
          </div>
        </div>
      </div>

    
      <div className="all-card-book-none-text-left">
        <div className="container py-3">
          <div className="d-flex justify-content-between ">
            <div>
              <h2 className="text-black text-h2">{t('mobile_home:new_book')}</h2>
            </div>
            <Link href={`/new_book`}>
              <a ><p className="text-pink see-all-link">{t('mobile_translations:view_all')}</p></a>
            </Link>
          </div>
          <div className="d-flex justify-content-start all-card-book">
            {
              new_book ? (new_book.count > 0 ? new_book.rows.map((product, index) => <CardGrid product={product} key={index} />) : (<div>{t("mobile_home:data_not_found")}</div>)) : <CardPH show={4} />
            }
          </div>
        </div>
      </div>
      {
        recommend ? (recommend.length > 0 ? (
          <>
            <div className="bg-light-less-gray pt-3">
              <div className="bg-white ">
                <div className="container ">
                  <div className="d-flex justify-content-between py-3 bg-white">
                    <div>
                      <h2 className="text-black m-0 text-h2">{t('mobile_translations:recommended_books')}</h2>
                    </div>
                    <Link href="/main-category-recommend">
                      <a ><p className="text-pink see-all-link m-0 ">{t('mobile_translations:view_all')}</p></a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {
              recommend.map((val, index) => (
                <div key={'seawrite' + index} className={classnames("all-card-book-has-headline", { "bg-seawrite": (val.key == "seawritebooks"), "bg-novel": (val.key == "50_literature_should_read") })}  /* style={{background: `url(${val.image_mobile})`, width:"100%" }} */>
                  <img className="h-100" src={val.image_mobile} alt="ศูนย์หนังสือจุฬาฯ" />
                  <div className='text-reccommend'>
                    <h3>{val.name_th}</h3>
                    <p>{(val.detail_th || val.detail_en) ? parse(String(val.detail_th || val.detail_en)) : ''}</p>
                    <Link href={`/recommend/[key]?key=${val.key}`} as={`/recommend/${val.key}`}>
                        <a>
                          {t('mobile_translations:view_all')}
                        </a>
                    </Link>
                  </div>
                  <div className="container py-3 all-card-book-has-headline-content">
                    <div className="d-flex justify-content-start all-card-book">
                      {/* <Link href={`/recommend/[key]?key=${val.key}`} as={`/recommend/${val.key}`}>
                        <a className="box-headline mr-2">
                        </a>
                      </Link> */}
                      
                      {
                        val.products && val.products.map((product, index) => <CardGrid product={product} show={4} key={index} />)
                      }
                    </div>
                  </div>
                </div>
              ))
            }
          </>
        ) : '') :
          (
            <>
            </>
          )
      }

      <div className="all-card-book-none-text-left position-relative">
        <div className="position-absolute bg-green bg-box"></div>
        <div className="container py-3">
          <div className="d-flex justify-content-between ebook">
            <div>
              <h2 className="text-black text-h2">{t('mobile_home:ebook_best')}</h2>
            </div>
            <Link href={`/recommend/[key]?key=ebook-best-seller`} as={`/recommend/ebook-best-seller`}>
              <a className=""><p className="text-pink see-all-link">{t('mobile_translations:view_all')}</p></a>
            </Link>
          </div>
          <div className="d-flex justify-content-start all-card-book">
            {
              ebook ? (ebook.count > 0 ? ebook.rows.map((product, index) => <CardGrid product={product} key={index} />) : (<div>{t("mobile_home:data_not_found")}</div>)) : <CardPH show={4} />
            }
          </div>
        </div>
      </div>

      {
        (course && course.rows.length > 0) ? (
          <>
            <div className="all-card-book-none-text-left position-relative">
              <div className="position-absolute bg-course bg-box"></div>
              <div className="container py-3">
                <div className="d-flex justify-content-between course">
                  <div>
                    <h2 className="text-black text-h2">{t('mobile_home:course_best')}</h2>
                  </div>
                  <Link href={`/recommend/[key]?key=course-best-seller`} as={`/recommend/course-best-seller`}>
                    <a className=""><p className="text-pink see-all-link">{t('mobile_translations:view_all')}</p></a>
                  </Link>
                </div>
                <div className="d-flex justify-content-start all-card-book">
                  {
                    course ? (course.count > 0 ? course.rows.map((product, index) => <CardGrid product={product} key={index} />) : (<div>{t("mobile_home:data_not_found")}</div>)) : <CardPH show={4} />
                  }
                </div>
              </div>
            </div>
          </>
        ) : null
      }
      

      {
        voucher ? voucher.rows.map((val, index) => (
          <div className="promotion-area bg-light-less-gray mb-0 pb-0" key={index}>
            <img className="img-fluid invisible-landscape" src={val.image_mobile} alt="ศูนย์หนังสือจุฬาฯ" />
          </div>
        )) :

          ''
      }

      {
        productsCookie &&
        (
          productsCookie.length > 0 ?
            <>
              <div className="all-card-book-none-text-left">
                <div className="container py-3">
                  <div className="d-flex justify-content-between ">
                    <div>
                      <h2 className="text-black text-h2">{t('mobile_translations:recommend_for_you')}</h2>
                    </div>

                  </div>
                  <div className="d-flex justify-content-start all-card-book">
                    {
                      productsCookie.map((product, index) => <CardGrid product={product} show={4} key={index} />)
                    }
                  </div>
                </div>
              </div>
            </> : ''
        )
      }
      <div className="maxim-area bg-light-less-gray">
        <div className="maxim-card">
          <div className="maxim-card-list row">
            <div className="col-4">
              <img className="img-fluid" src={'/mobile/image/icon/icon-security.svg'} alt="การชำระเงิน" />
            </div>
            <div className="col-8">
              <p className="text-black">{t('mobile_home:safe_when_paying_online')}
                {t('mobile_home:peace_mind_no_fees')}</p>
            </div>
          </div>
          <hr className="maxim-card-line row" />
          <div className="maxim-card-list row">
            <div className="col-4">
              <img className="img-fluid" src={'/mobile/image/icon/icon-shop.svg'} alt="การสั่งซื้อสินค้า" />
            </div>
            <div className="col-8">
              <p className="text-black">{t('mobile_home:convenient_products')}
                {t('mobile_home:get_many_branches_from')}</p>
            </div>
          </div>
          <hr className="maxim-card-line row" />
          <div className="maxim-card-list row">
            <div className="col-4">
              <img className="img-fluid" src={'/mobile/image/icon/icon-car.svg'} alt="การจัดส่งสินค้า" />
            </div>
            <div className="col-8">
              <p className="text-black">{t('mobile_home:free_delivery_nationwide')} {t('mobile_home:buy_now_no_minimum')}</p>
            </div>
          </div>
          <hr className="maxim-card-line row" />
          <div className="maxim-card-list row">
            <div className="col-4">
              <img className="img-fluid" src={'/mobile/image/icon/icon-like.svg'} alt="คุณภาพสินค้า" />
            </div>
            <div className="col-8">
              <p className="text-black">{t("mobile_home:be_assured")} {t('mobile_home:over_years')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="all-card-news ">
        <div className="container py-3">
          <div className="d-flex justify-content-between ">
            <div>
              <h2 className="text-black text-h2">{t('mobile_translations:news_activities')}</h2>
            </div>
            <Link href={`/news`}>
              <a ><p className="text-pink see-all-link">{t('mobile_translations:view_all')}</p></a>
            </Link>
          </div>
          <div className="d-flex justify-content-start all-card-book">
            {
              news ? news?.rows.map((news, index) => <CardNews news={news} type="news" key={index} />) : ''
            }
          </div>
        </div>
      </div>
      <div className="alliance-area bg-light-less-gray">
        <div className="container py-3">
          <h2 className="text-black mb-3 text-h2">{t("mobile_home:partnerships")}</h2>
          <div className="d-flex justify-content-start all-card-book">
            {
              alliances ? alliances.map((val, index) => (
                <a className="card-alliance mr-2" key={index} href={val.link}>
                  <img className="img-fluid m-auto mh-100" src={val.image} alt={val.alt_image || val.name} />
                </a>
              )) : ''
            }
            <div className="card-alliance nonecard"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileMainHome;