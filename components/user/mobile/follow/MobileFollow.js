import React, { useEffect, useState } from 'react';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { withTranslation, Link } from '../../../../utils/i18n';

const MobileFollow = (props) => {
  const { t } = props;

  const [fav, setFav] = useState();
  const fetchFollow = () => {
    const id = AuthService.getProfile().id;
    api.getFollowFont(id).then(res => {
      const data = res.data;
      setFav(data);
      ;
    })
      .catch(err => {
        console.log(err.response);
      })
  };
  useEffect(() => {
    fetchFollow();
   
  }, []);
  const profile = (val)=>{
    var de =  val.blog_writer_banners.filter((val1) => val1.mimetype == "profile" && val1.status == 1).map((val1) => {
      return val1.picture 
    });
    return de[0]||"/mobile/icon/blog-icon-user.svg";
  }

  return ( 
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4>{t("title_follow")}</h4>
        </div>
        <Link href="/user/dashboard">
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
        </Link>
      </div>
                 
          
      <div className="bg-light-less-gray min-vh-100">
        <div className="h-64px"></div>
        <div className="container mt-3">
          <div className="d-flex justify-content-between flex-wrap p-2">
            {fav ?
                fav.map((val)=> ( 
                <div className="col-12 px-0 py-2">
                  <Link href={`/blog/writer/[idwriter]?idwriter=${val.id}`} as={`/blog/writer/${val.id}`} >
                  <a>
                    <div className="d-flex align-items-center">
                      
                      <div className="blog-modal-item-img" style={{backgroundImage: `url("${profile(val)}")`}} />

                      <h3 className="m-0 text-black">{val.penname1}</h3> 
                    </div> 
                  </a>         
                  </Link>
                </div>
              ))
            :null}     
          </div>
        </div>
        <div className="footer-space"></div>
      </div>
    </>
  )
}

export default MobileFollow