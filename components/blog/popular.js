import React from "react";
import Card from "./card";
import { Link } from "../../utils/i18n";
import CardPH from "../shimmer/Card";
import Slick from "react-slick";
export default function Popular({ title, data ,p,t}) {
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
    <div>
      <div className="row mt-5">
        <div className="col-3"></div>
        <div className="col-6 blog-popular">
          <h2 className="blog-popular-h">{title}</h2>
        </div>
        <div className="col-3 blog-popular-col-btn">
          <Link
            href={`/blog/recommend/[id]?id=${p}`}
            as={`/blog/recommend/${p}`}
          >
            <a>
              <button className="blog-popular-btn w-125px" type="button">
                {t('view_all')}
              </button>
            </a>
          </Link>
        </div>
      </div>
      <div className="row mt-5 d-none d-lg-flex">
        {data ? (data.length != 0 ? (
          <div className="col-12 blog-w-sw blog-h-min">
            <Slick {...settings} >

            {data.map((val) => (
              <div key={Math.random()} className="pl-2 pr-2">
                <Card data={val.blog_group || val} penname={val.blog_group && val.blog_group.blog_writer.penname1||val.blog_writer.penname1} />
              </div>
            ))}
            </Slick>
          </div>
        ) : (
          null
          
        )):<CardPH show={4} grid={4} new_padding={true}/>}
       
      </div>
      <div className="row mt-5 d-none d-lg-none d-md-flex">
        {data ?( data.length != 0 ? (
          <div className="col-12 blog-w-sw blog-h-min-l">
            <Slick {...settings} >

            {data.map((val) => (
              <div key={Math.random()} className="pl-2 pr-2">
                <Card data={val.blog_group || val} penname={val.blog_group && val.blog_group.blog_writer.penname1||val.blog_writer.penname1} />
              </div>
            ))}
            </Slick>
          </div>
        ) : (
          null
          
        )):<CardPH show={3} grid={3} new_padding={true}/>}
       
      </div>
    </div>
  );
}
