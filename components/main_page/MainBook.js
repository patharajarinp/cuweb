import React, { useContext, useEffect } from 'react';
import Slick from "react-slick";
import Banner from '../../components/banner';
import Shimmer from '../../components/Shimmer';
import CardPH from '../../components/shimmer/Card';
import { CardGrid } from '../../components/widget/card';
import UserContext from '../../contexts/UserContext';
import api from '../../utils/api';
import { Link } from "../../utils/i18n";

const MainBook = (props) => {
  const {t, query,banner,cate,pageRec,recommend} = props;

  const {text,field} = query;
  const {local, setLocal } = useContext(UserContext)


  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#FFFFFF";
    }
  },[]);
  
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
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

  return (
    <>
      <div className="container">
        <div className="row">
          <Banner data={banner.banner_images} type={banner.type} />
        </div>
        <div className="row my-5">
          <div className="col-12">
            <div className="text-center">
              <h1 className="seo-text">{t('book_category')}</h1>
              {/* <h2>{t('book_category')}</h2> */}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 main-book">
          <Slick {...settings}>
            {
              cate ? cate.map((val, index) => (
                <div className="cate">
                  <Link href={`/books/[main_category]?main_category=${val.url_name}`} as={`/books/${val.url_name}`}>
                    <a className="text-default">
                      <div className="btn-cate">
                        <img src={val.image ? val.image: `${api.frontend_url}/icon/mock-icon.svg`} />
                      </div>
                      <div className="text">
                        {val['name_'+local] || val.name_th}
                      </div>
                    </a>
                  </Link>
                </div>
              )) : ''
            }
          </Slick>
          </div>
        </div>
        <div className="d-none d-xl-block">
        {
          pageRec && pageRec.map((val, index) => (
           <>
          <div className="row pb-5 mt-5 ">
            <div className="col-4"></div>
            <div className="col-4">
              <div className="text-center">
                <h2 className="text-pink">
                  {val['name_'+local] || val.name_th}
                </h2>
              </div>
            </div>
            <div className="col-4">
              {
                (val.products && val.products.length >= 4) && (
                  <div className="float-right">
                    <Link href={`/recommend/[key]?key=${val.key}`} as={`/recommend/${val.key}`}>
                      <a>
                        <button className="btn btn-outline-primary">{t('view_all')}</button>
                      </a>
                    </Link>
                  </div>
                )
              }
            </div>
            {
                val.products && val.products.slice(0, 4).map((product) => <CardGrid product={product} classes={"pb-5"} show={4}/>)
            }
          </div>
          <hr></hr>
         </>
          ))
        }
       
      </div>
      
      <div className="d-block d-xl-none">
        {
          pageRec && pageRec.map((val, index) => (
            <>
          <div className="row mt-5">
            <div className="col-4 mb-3"></div>
            <div className="col-4 mb-3">
              <div className="text-center">
                <h2 className="text-pink">
                  {val['name_'+local] || val.name_th}
                </h2>
              </div>
            </div>
            <div className="col-4 mb-3">
              {
                (val.products && val.products.length >= 4) && (
                  <div className="float-right">
                    <Link href={`/recommend/[key]?key=${val.key}`} as={`/recommend/${val.key}`}>
                      <a>
                        <button className="btn btn-outline-primary">{t('view_all')}</button>
                      </a>
                    </Link>
                  </div>
                )
              }
            </div> 
            {
                val.products && val.products.slice(0, 3).map((product) => <CardGrid product={product} classes={"pb-5"} show={3} new_padding={true}/>)
            }
          </div>
           <hr></hr>
           </>
          ))
        }
      </div>
        {
          recommend ? (recommend.length > 0 ? (  
            <>
              <div className="row mt-5">
                <div className="col-4"></div>
                <div className="col-4">
                  <div className="text-center">
                    <h2 className="text-pink">{t('recommended_books')}</h2>
                  </div>
                </div>
                <div className="col-4">
                  <div className="float-right">
                    <Link href="/main-category-recommend">
                    <button className="btn btn-outline-primary">{t('view_all')}</button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="d-none d-xl-block">
              {
                recommend.map((val, index) => (
                <div className="row mt-5">
                  <div className="col-3">
                    <Link href={`/recommend/${val.key}`}>
                      <a><img src={val.image} className="mw-100" /></a>
                    </Link>
                  </div>
                  {
                      val.products && val.products.map((product) => <CardGrid product={product} classes={"pb-5"} show={4}/>)
                  }
                </div>
                ))
              }
             </div>
             <div className="d-block d-xl-none">
             {
                recommend.map((val, index) => (
                <div className="row mt-5">
                  <div className="col-4">
                    <Link href={`/recommend/${val.key}`}>
                      <a><img src={val.image} className="mw-100" /></a>
                    </Link>
                  </div>
                  {
                      val.products && val.products.slice(0, 2).map((product) => <CardGrid product={product} classes={"pb-5"} show={3}/>)
                  }
                </div>
                ))
              }
          </div>
            </>
          ) : 'ไม่มีข้อมูล') : 
          (
            <>
              <div className="row mt-5">
                <div className="col-4"></div>
                <div className="col-4">
                  <div className="text-center">
                    <Shimmer size={[300,30]}/>
                  </div>
                </div>
                <div className="col-4"></div>
              </div>
              <div className="row mt-5"><CardPH show={4} grid={4}/></div>
            </>
          )

        }
      </div>
      <div className="end-page"></div>
    </>
  )
}
export default MainBook