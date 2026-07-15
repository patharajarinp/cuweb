import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { CardGrid } from "../../widget/card";
import { Link } from "../../../utils/i18n";
export default function ShowProduct({blog_id,t}) {
  const [pageRec, setPageRecommend] = useState();
  const fetchPageRecommend = () => {
    api.blogProductGet(blog_id,4).then(res =>{
        const data = res.data;
        // 
        let tmp = []
        data.rows.forEach((val,index) => {
          tmp.push(val.product)
          
        });
        // console.log('data', tmp)
        setPageRecommend(tmp);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  useEffect(() => {
    fetchPageRecommend();
  }, []);
  return (
    <div>
      {pageRec&&!!pageRec.length&&
      <div className="blog-show-product pt-4">
        <div className="">
          
          <div >
            
            <div className="row mt-5">
              <div className="col-3"></div>
              <div className="col-6 blog-popular">
              <h3 className="text-center">{t('related_products')}</h3>
              </div>
              <div className="col-3 blog-popular-col-btn">
                <Link
                  href={`/blog/[blogid]/related?blogid=${blog_id}`}
                  as={`/blog/${blog_id}/related`}
                >
                  <a>
                    <button className="blog-popular-btn w-125px" type="button">
                      {t('view_all')}
                    </button>
                  </a>
                </Link>
              </div>
            </div>
            <div className="d-none d-xl-block">
            <div className="row mt-3">
            
              {pageRec.map((val, index) => (
                          <CardGrid product={val} key={val.id} classes={"pb-5  mb-6"} show={4} />
                ))} 
                  </div>
                  </div>
                <div className="d-block d-xl-none">
                <div className="row ">
                
              {pageRec.map((val, index) => (
                          <CardGrid product={val} key={val.id} classes={"pb-5  mb-6"} show={3} />
                ))} 
               </div>
               </div>
              </div>
          </div>
        </div>
      }
      
      </div>
   
  );
}
