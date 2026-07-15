import React from 'react';
import { Link } from "../../utils/i18n";

const MainCateRec = (props) => {
  const {t, recommend} = props;

  return (
    <>
      <div className="container">
        {
          recommend ? (recommend.length > 0 ? (  
            <>
              <div className="row  justify-content-center">
                <h2 className="text-center mt-5 mb-5 text-black">หมวดสินค้าแนะนำมาเก็ตเพลส</h2>
              </div>
                <div className=" row">

              {
                recommend.map((val, index) => (
                  <div className=" column-rec">
                    <Link href={`/recommend/[key]?key=${val.key}`} as={`/recommend/${val.key}`}>
                      <a><img src={val.image} className="img-fluid w-100" /></a>
                    </Link>
                  </div>
                 
                ))
              }
              
                </div>
            </>
          ) : 'ไม่มีข้อมูล') :''

        }
      </div>
    </>
  )
}
export default MainCateRec