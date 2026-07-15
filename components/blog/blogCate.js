import React, { useState, useEffect ,useContext} from "react";
import api from "../../utils/api";
import { Link, withTranslation } from "../../utils/i18n";
import Slick from "react-slick";
import Shimmer from "../Shimmer";
import UserContext from "../../contexts/UserContext";
function BlogCate({t}) {
  const {local, setLocal } = useContext(UserContext)
  const [cate, setCate] = useState();
  const fetchCate = () => {
    api
      .getBlogCategory()
      .then((res) => {
        const data = res.data;
        setCate(data);
        // console.log(data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  useEffect(() => {
    fetchCate();
  }, []);
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
          slidesToShow: 7,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
    ],
  };
  return (
    <div>
      <div className="row my-5">
        <div className="col-12">
          <div className="text-center">
  <h2>{t('cate')}</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-1"></div>
        <div className="col-10 blog-cate">
          {cate ? (
            <Slick {...settings}>
              {cate.map((val, index) => (
                <div key={Math.random()} className="cate">
                  <Link
                    href={`/blog/filter?cate=${val.id}&blog=`}
                  >
                    <a className="text-default">
                      <div className="btn-cate">
                        <img
                          src={
                            val.image ? val.image : "/icon/blog-icon-cate.svg"
                          }
                        />
                      </div>
                      <div className="text">{val['name_'+local] || val.name_th}</div>
                    </a>
                  </Link>
                </div>
              ))}
            </Slick>
          ) : (
            <Shimmer size={[1000, 16]} />
          )}
        </div>

        <div className="col-1"></div>
      </div>
    </div>
  );
}
export default withTranslation("blog_index")(BlogCate);