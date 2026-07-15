import React from "react";
import Slick from "react-slick";
import { Link } from "../../../utils/i18n";
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
      <div className="all-card-book-none-text-left bg-white my-3">
        <div className="container py-3">
          <div className="d-flex justify-content-start all-card-book">
            {data.map(
              (val) =>
              data_id != val.id && (
                  <div key={Math.random()} className="blog-data-s-show mr-2 ">
                    <Link
                      href={`/blog/[blogid]/[data_id]?data_id=${val.id}&blogid=${blog_id}`}
                      as={`/blog/${blog_id}/${val.id}`}
                    >
                      <a>
                        <div className="text-center blog-slide-data">
                          <div className="blog-pages-detail-img-l-tableData">
                            <div className="blog-pages-detail-img-m">
                              <img
                                className="blog-pages-detail-img-s"
                                src={
                                  val.blog_data_banner
                                    ? val.blog_data_banner.picture
                                    : "/icon/blog/blog-icon-chapter.svg"
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
            <div className="card-book nonecard mr-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
