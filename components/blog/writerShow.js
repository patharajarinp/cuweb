import React from "react";
import Writer from "./writer";
import Slick from "react-slick";
import CardPH from "../shimmer/Card";
import { Link } from "../../utils/i18n";
export default function WriterShow({ data ,t}) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
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
    <div className="blog-writer-show-pop">
      <div className="container">
        <div className="blog-writer-show-txt">
          <h2 className="blog-writer-show-txt-h">{t('writer_pop')}</h2>
        </div>
        <div className="row">
          {data?(data.length != 0 ? (
            <div className="col-12 blog-w-sw blog-h-min-l">
              <Slick {...settings}>
                {data.map((val) => (
                 <div key={Math.random()} >
                   <Link href={`/blog/writer/[idwriter]?idwriter=${val.id}`} as={`/blog/writer/${val.id}`}>
                   <a>
                      <Writer data={val} />
                   </a>
                   </Link>
                  
                   </div> 
                ))}
              </Slick>
            </div>
          ) : (
            null
          )):<CardPH show={4} grid={4} />}
        </div>
      </div>
    </div>
  );
}
