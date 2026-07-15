import React from 'react';
import { Link, Router } from "../../../utils/i18n";

const MobileMainCateRec = (props) => {
  const {t, recommend} = props;

  const back = () => {
    Router.back();
  }

  return (
    <>
     <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4>{t("translations:recommended_mkp")}</h4>
        </div>
        <a className="btn-back cart-nav-back" onClick={() => back()}>
          <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
        </a>
      </div>

      <div className="bg-light-less-gray min-vh-100">
        <div className="h-64px"></div>
        <div className="all-card-news ">
          <div className="container">


            <div className=" d-flex flex-wrap justify-content-start mt-3 mx-less10px">
              {
                recommend && (recommend.length > 0) ? (
                  <>

                    {
                      recommend.map((val, index) => (
                        <div className="card-recommend d-flex justify-content-center w-100" key={index}>
                          <Link href={`/recommend/[key]?key=${val.key}`} as={`/recommend/${val.key}`}>
                            <a className="w-100"><img src={val.image} className="img-fluid " /></a>
                          </Link>
                        </div>

                      ))
                    }


                  </>
                ) : null

              }
            </div>
          </div>
        </div>

        <div className="footer-space"></div>
      </div>
    </>
  )
}
export default MobileMainCateRec