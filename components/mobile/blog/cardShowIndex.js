import React from "react";
import { Link } from "../../../utils/i18n";
import Card from "./card";
export default function CardShowIndex({ title, data,p ,t}) {
  return (
    <div>
      <div className="all-card-book-none-text-left bg-white mb-3">
        <div className="container py-3">
          <div className="d-flex justify-content-between ">
            <div>
              <h4 className="text-black">{title}</h4>
            </div>
            <Link href={`/blog/recommend/[id]?id=${p}`} as={`/blog/recommend/${p}`}>
              <a>
                <p className="blog-text-yellow see-all-link">{t('view_all')} </p>
              </a>
            </Link>
          </div>
          <div className="d-flex justify-content-start all-card-book">
            {data.map((val) => (
              <div key={Math.random()} className="blog-card-show mr-2">
               
                <Card data={val.blog_group || val} penname={val.blog_group && val.blog_group.blog_writer.penname1||val.blog_writer.penname1} />
              </div>
            ))}
            <div className="card-book nonecard mr-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
