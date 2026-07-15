import React, { useContext, useEffect, useRef, useState } from 'react';
import BreadcrumbMB from '../../mobile/BreadcrumbMB';
import Banner from '../../mobile/HomeBanner';
import Navbar from '../../mobile/layout/Navbar';
import CardGrid from '../../mobile/widget/Card';
import UserContext from '../../../contexts/UserContext';
import { Link } from '../../../utils/i18n';

const MobileMainCourse = (props) => {
  const {t, query,banner,cate,pageRec} = props;

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
      {banner && <Banner items={banner.banner_images}/>}
      <div className="bg-light-less-gray pt-3">
        <div className="container bg-white ">
          <h4 className="text-black text-center py-3">{t("header:category")}{t("header:online_course")}</h4>
          <div className="row  flex-nowrap area-slide pb-3">
              {
                cate ? cate.map((val, index) => (
                  <div className="cate col-slide" key={index}>
                    <Link href={`/courses/[main_category]?main_category=${val.url_name}`} as={`/courses/${val.url_name}`}>
                      <a className="text-default">
                        <div className="btn-cate">
                          <img src={val.image_ebook ? val.image_ebook : "/image/icon/mock-icon.svg"} />
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
                    <h4 className="text-black">{val.name_th}</h4>
                  </div>
                  <Link href={`/recommend/[key]?key=${val.key}`} as={`/recommend/${val.key}`}>
                    <a ><p className="text-course see-all-link">{t("translations:view_all")} </p></a>
                  </Link>
                </div>
                <div className="d-flex justify-content-start all-card-book">
                  {
                    val.products && val.products.map((product, index) => <CardGrid product={product} show={4} key={index} />)
                  }<CardGrid freespace={true}/>
                </div>
              </div>
            </div>
          ))
        }


        <div className="h-64px"></div>
      </div>
    </>
  )
}
export default MobileMainCourse