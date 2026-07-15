import React, { useContext, useEffect, useRef, useState } from 'react';
import BreadcrumbMB from '../../../components/mobile/BreadcrumbMB';
import Banner from '../../../components/mobile/HomeBanner';
import Navbar from '../../../components/mobile/layout/Navbar';
import CardGrid from '../../../components/mobile/widget/Card';
import UserContext from '../../../contexts/UserContext';
import { Link } from '../../../utils/i18n';
import parse from "html-react-parser";

const MobileMainBook = (props) => {
  const {t, query,banner,cate,pageRec,recommend} = props;

  const [productsBestSeller, setBestSeller] = useState();
  const { local } = useContext(UserContext)

  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef();
  const slider2 = useRef();

  useEffect(() => {
      setState({
          nav1: slider1.current,
          nav2: slider2.current
      });
      document.body.style.backgroundColor = "#FFFFFF";
  }, []);
  const { nav1, nav2 } = state;
  const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 4,

  };
    

  return (
    <>
      <Navbar />
      <div className="padding-top-for-box"></div>
      
      <BreadcrumbMB
        className="padding-top-breadcrumb"
        item={[
          {text: "หน้าหลัก",href:'/',as:'/'},
          {text: "หนังสือ",active:true},
          // {text: product.name,active:true}
        ]}
      />
      <div className="margin-bottom-breadcrumb"></div>
      {banner && <Banner items={banner.banner_images}/>}
      {/* {img && <Banner items={img} />} */}
      <div className="bg-light-less-gray pt-3">

        <div className="container bg-white ">
          <h1 className="text-black text-center py-3 text-h1">{t("header:category")}{t("translations:book")}</h1>
          <div className="row  flex-nowrap area-slide pb-3">
            {
              cate ? cate.map((val, index) => (
                <div className="cate col-slide" key={index}>
                  <Link href={`/books/[main_category]?main_category=${val.url_name}`} as={`/books/${val.url_name}`}>
                    <a className="text-default">
                      <div className="btn-cate">
                        <img src={val.image ? val.image : "/image/icon/mock-icon.svg"} />
                      </div>
                      <div className="text">
                        {val.name_th}
                      </div>
                    </a>
                  </Link>
                </div>
              )) : ''
            }
          </div>
        </div>

        {
          pageRec && pageRec.map((val, index) => (
          <div className="all-card-book-none-text-left bg-white my-3" key={index}>
            <div className="container py-3">
              <div className="d-flex justify-content-between ">
                <div>
                  <h2 className="text-black text-h2">{local == 'th' ? val.name_th : val.name_en}</h2>
                </div>
                <Link href={`/recommend/[key]?key=${val.key}`} as={`/recommend/${val.key}`}>
                  <a ><p className="text-pink see-all-link">{t("translations:view_all")} </p></a>
                </Link>
              </div>
              <div className="d-flex justify-content-start all-card-book">
                {
                  val.products && val.products.map((product, index) => <CardGrid product={product} show={4} key={index} />)
                }
                <CardGrid freespace={true}/>
              </div>
            </div>
          </div>
          ))
        }

        {
          recommend ? (recommend.length > 0 ? (
          <>
            <div className="bg-light-less-gray pt-3">
              <div className="bg-white ">
                <div className="container ">
                  <div className="d-flex justify-content-between py-3 bg-white">
                    <div>
                      <h2 className="text-black m-0 text-h2">{t('translations:recommended_books')}</h2>
                    </div>
                    <Link href="/main-category-recommend">
                        <a ><p className="text-pink see-all-link m-0 ">{t('translations:view_all')}</p></a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {
              recommend.map((val, index) => (
                <div key={'seawrite' + index} className="all-card-book-has-headline bg-seawrite ">
                  <img className="h-100" src={val.image_mobile} />
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
                      <CardGrid freespace={true}/>
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



        <div className="h-64px"></div>
      </div>
    </>
  )
}
export default MobileMainBook