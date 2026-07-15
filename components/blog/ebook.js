import React from "react";
import { CardGrid } from "../../components/widget/card";
export default function Ebook({data,t}) {
  return (
    <div>
      <div className="blog-show-product">
        <div className="container">
          <div className="">
            <h3 className="pt-5 mb-6 text-center">{t('ebook')}</h3>
            <div className="d-none d-xl-block">
              <div className="row">
                {data.map((val, index) => (
                  <CardGrid product={val.product} key={val.product.id} classes={"pb-5  mb-6"} show={4} />
                ))}
              </div>
             
            </div>
            <div className="d-block d-xl-none">
              <div className="row ">
                {data.map((val, index) => (
                  <CardGrid product={val.product} key={val.product.id} classes={"pb-5  mb-6"}  show={3} />
                ))}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
