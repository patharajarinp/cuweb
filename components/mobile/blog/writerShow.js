import React from "react";
import { Link } from "../../../utils/i18n";
import Writer from "./writer";
export default function WriterShow({ data,t }) {
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
       
          <h4 className="text-black text-center py-3">{t('mobile_blog_index:writer_pop')}</h4>
        </div>
        
          {data.length != 0 ? (
            <div className="d-flex justify-content-start all-card-book">
              


                {data.map((val) => (
                 <div key={Math.random()} className="blog-card-show mr-2">
                   <Link href={`/blog/writer/[idwriter]?idwriter=${val.id}`} as={`/blog/writer/${val.id}`}>
                   <a>
                      <Writer data={val} />
                   </a>
                   </Link>
                  
                   </div> 
                ))}
              
            </div>
          ) : (
           <></>
          )}
        
        {/* <div className="row">
          <div className="col-md-3 col-6">
            <Writer />
          </div>
        </div> */}
      </div>
    </div>
  );
}
