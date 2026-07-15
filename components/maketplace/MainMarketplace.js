import React, { useContext, useEffect } from 'react';
import Slick from "react-slick";
import Banner from '../../components/banner';
import Shimmer from '../../components/Shimmer';
import CardPH from '../../components/shimmer/Card';
import { CardGrid } from '../../components/widget/card';
import UserContext from '../../contexts/UserContext';
import { Link } from '../../utils/i18n';

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
  /* className: "slider variable-width",
  variableWidth: true */
};
const settingscardmin = {
  className: "slider variable-width img-slick",
  dots: false,
  slidesToShow: 3,
  infinite: false,
  touchMove: true,
  arrows: true
  /* className: "slider variable-width",
  variableWidth: true */
};
const settingscardmini = {
  className: "slider variable-width img-slick",
  dots: false,
  slidesToShow: 2,
  infinite: false,
  touchMove: true,
  arrows: true
  /* className: "slider variable-width",
  variableWidth: true */
};

const MainMarketplace = (props) => {
  const { t,banner, pageRec ,rec_group,best_seller,new_products,voucher,shop} = props;
  const {local, setLocal } = useContext(UserContext)

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#FFFFFF";
    }
  }, []);

 
  return (
    <>
      <div className="container">
        <div className="row">
          <Banner data={banner.banner_images} type={banner.type} />
        </div>

        {
          shop?.length > 0 && (
            <div className="row my-3">
              <div className="col-4"></div>
              <div className="col-4">
                <div className="text-center">
                  <h1 className="seo-text text-pink">{t('order_detail:vender')}</h1>
                </div>
              </div>
              <div className="col-12 alliance">
                <Slick {...settings}>
                  {
                    shop ? shop.map((val, index) => (
                      <div className="cate seller" key={index}>
                        <Link href={`/seller/[seller_name]?seller_name=${val.seller?.shop_name}`} as={`/seller/${val.seller?.shop_name}`}>
                          <div className="btn-set">
                            <img src={val.seller?.picture} alt={val.alt_image || val.seller?.shop_name} />
                          </div>
                        </Link>
                      </div>
                    )) : ''
                  }
                </Slick>
              </div>
            </div>
          )
        }
        

        {
          best_seller?.rows?.length > 0 && (
            <>
              <div className="row mt-5 mb-2">
                <div className="col-4"></div>
                <div className="col-4">
                  <div className="text-center">
                    <h1 className="seo-text text-pink">{t('best_seller_product')}</h1>
                  </div>
                </div>
                <div className="col-4">
                  <div className="float-right">
                    <Link href={`/recommend/[key]?key=best-seller-mkp`} as={`/recommend/best-seller-mkp`}>
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

                      best_seller ? (best_seller.rows.length > 0 ? best_seller.rows.map((product, index) => <CardGrid product={product} key={index} new_padding={true} show={4} />) : '') : ''
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

                      best_seller ? (best_seller.rows.length > 0 ? best_seller.rows.map((product, index) => <CardGrid product={product} key={index} show={3} />) : '') : ''
                      }
                    </Slick> </div> : <CardPH show={3} grid={3} />

                  }
                </div>
              </div>
            </>
          )
        }
        

        {/* News products */}
        {
          new_products?.count > 0 && (
            <>
              <div className="row mt-5 mb-2">
                <div className="col-4"></div>
                <div className="col-4">
                  <div className="text-center">
                    <h2 className="text-pink">{t('new_product')}</h2>
                  </div>
                </div>
                <div className="col-4">
                  <div className="float-right">
                    <Link href={`/recommend/[key]?key=new_products_mkp`} as={`/recommend/new_products_mkp`}>
                      <button className="btn btn-outline-primary">{t('translations:view_all')}</button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="d-none d-xl-block">
                <div className="row  pb-4rem border-bottom">
                  {
                    new_products ? <div className="col-12 "><Slick {...settingscard} className="slickcard">
                      {

                        new_products ? (new_products.count > 0 ? new_products.rows.map((val, index) => <CardGrid product={val} key={index} new_padding={true} show={4} />) : '') : ''
                      }
                    </Slick> </div> : <CardPH show={4} grid={4} new_padding={true} />
                  }
                  {/*  {
                    newbook ? ( newbook.count > 0 ? newbook.rows.map((val,index) => <CardGrid product={val} key={index}  new_padding={true} show={4}/>) : '') : <CardPH show={4} grid={4}  new_padding={true}/>
                  } */}
                </div>
              </div>
              <div className="d-xl-none">
                <div className="row border-bottom">
                  {
                    new_products ? <div className="col-12 "><Slick {...settingscardmin} className="slickcardmin">
                      {

                        new_products ? (new_products.count > 0 ? new_products.rows.map((val, index) => <CardGrid product={val} key={index} new_padding={true} show={3} />) : '') : ''
                      }
                    </Slick> </div> : <CardPH show={3} grid={3} new_padding={true} />
                  }
                  {/* {
                    newbook ? ( newbook.count > 0 ? newbook.rows.slice(0, 3).map((val,index) => <CardGrid product={val} key={index} show={3}/>) : '') : <CardPH show={3} grid={3}/>
                  } */}
                </div>
              </div>
            </>
          )
        }
        

        {
          rec_group ? (rec_group.length > 0 ? (
            <>
              <div className="row mt-5">
                <div className="col-4"></div>
                <div className="col-4">
                  <div className="text-center">
                    <h2 className="text-pink">{t('translations:recommended_mkp')}</h2>
                  </div>
                </div>
                <div className="col-4">
                  <div className="float-right">
                    <Link href="/main-category-recommend-mkp">
                      <button className="btn btn-outline-primary">{t('translations:view_all')}</button>
                    </Link>
                  </div>
                </div>
              </div>
              {
                rec_group.map((val, index) => (
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
                              val.products && val.products.map((product, index2) => <CardGrid product={product} key={index2} show={3} classes={'cl-m-break'} />)
                            }
                          </Slick> </div> : <CardPH show={3} grid={3} new_padding={true} />
                      }
                      {/*  {
                        val.products && val.products.map((product, index2) => <CardGrid product={product} key={index2} show={4} />)
                      } */}
                    </div>
                  </div>

                ))
              }

              {
                rec_group.map((val, index) => (
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
                            val.products && val.products.map((product, index2) => <CardGrid product={product} key={index2} show={3} classes={'cl-m-break'} />)
                          }
                        </Slick> </div> : <CardPH show={3} grid={3} new_padding={true} />
                      }
                      {/* {
                        val.products && val.products.slice(0, 2).map((size.width > 1200 && size.width < 1367) ? ((product, index2) => <CardGrid product={product} key={index2} show={3} new_padding={true} />) : ((product) => <CardGrid product={product} key={product.id} show={3} />))
                      } */}
                    </div>
                  </div>

                ))
              }
            </>
          ) : '') :
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

        <div className="d-none d-xl-block">
        {
          pageRec && pageRec.map((val, index) => (
          <div className="row pb-5 mt-5">
            <div className="col-4"></div>
            <div className="col-4">
              <div className="text-center">
                <h2 className="text-stationery">
                  {val['name_'+local] || val.name_th}
                </h2>
              </div>
            </div>
            <div className="col-4">
              {
                (val.products && val.products.length == 4) && (
                  <div className="float-right">
                    <Link href={`/recommend/${val.key}`}>
                      <a>
                        <button className="btn btn-outline-stationery ">{t('translations:view_all')}</button>
                      </a>
                    </Link>
                  </div>
                )
              }
            </div>
            {
                val.products && val.products.map((product) => <CardGrid product={product}  show={4}/>)
            }
          </div>
          ))
        }
        </div>
        <div className="d-block d-xl-none">
          {
            pageRec && pageRec.map((val, index) => (
            <div className="row mt-5">
              <div className="col-4 mb-3"></div>
              <div className="col-4 mb-3">
                <div className="text-center">
                  <h2 className="text-stationery">
                    {val['name_'+local] || val.name_th}
                  </h2>
                </div>
              </div>
              <div className="col-4 mb-3">
                {
                  (val.products && val.products.length == 4) && (
                    <div className="float-right">
                      <Link href={`/recommend/${val.key}`}>
                        <a>
                          <button className="btn btn-outline-stationery ">{t('view_all')}</button>
                        </a>
                      </Link>
                    </div>
                  )
                }
              </div> 
              {
                  val.products && val.products.slice(0,4).map((product) => <CardGrid product={product}  show={4}/>)
              }
            </div>
            ))
          }
        </div>

        {
          voucher ? voucher.rows.map((val, index) => (
            <div className="row mt-32" key={index}>
              <div className="col-12">
                <img src={val.image} className="w-100" alt="ศูนย์หนังสือจุฬาฯ" />
              </div>
            </div>
          )) : null
        }
      </div>
      <div className="end-page"></div>
    </>
  )
}
export default MainMarketplace