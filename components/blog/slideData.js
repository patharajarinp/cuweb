import React from "react";
import Slick from "react-slick";
import { Link } from "../../utils/i18n";
export default function SlideData({ data, blog_id, data_id,t }) {
  // console.log("data", data);
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
    ],
  };
  return (
    <div>
      <div className="container mt-4 blog-slide-data-div ">
        <div className="row pr-xl-5 pl-xl-5 pb-3">
          <div className="col-12 pr-5 pl-5">
            <Slick {...settings}>
              {data.map(
                (val) =>
                  data_id != val.id && (
                    <div key={Math.random()}>
                      <Link
                        href={`/blog/[blogid]/[data_id]?data_id=${val.id}&blogid=${blog_id}`}
                        as={`/blog/${blog_id}/${val.id}`}
                      >
                        <a>
                          <div className="text-center pr-3 blog-slide-data">
                            <div className="blog-pages-detail-img-l-tableData">
                              <div className="blog-pages-detail-img-m">
                                <img
                                  className="blog-pages-detail-img-s"
                                  src={
                                    val.blog_data_banner
                                      ? val.blog_data_banner.picture
                                      : "/icon/blog-icon-chapter.svg"
                                  }
                                />
                              </div>
                            </div>
                            <p className="m-0 mt-2">
                              {t('ep')} {val.index} : {val.title}
                            </p>
                          </div>
                        </a>
                      </Link>
                    </div>
                  )
              )}
            </Slick>
          </div>
        </div>
      </div>
    </div>
  );
}
