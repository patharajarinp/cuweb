import React, { useEffect, useState } from 'react';
import CardPH from '../../../../components/mobile/shimmer/Card';
import CardGrid from '../../../../components/mobile/widget/Card';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { withTranslation, Link } from '../../../../utils/i18n';

const MobileFav = (props) => {
  const { t } = props;
  const [fav, setFav] = useState();
  const fetchFav = () => {
    const id = AuthService.getProfile().id;
    api.getFavorite(id).then(res => {
      const data = res.data;
      setFav(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  };
  useEffect(() => {
    fetchFav();
  }, []);
  
  return ( 
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4>{t("my_wishlist")}</h4>
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
            {
              fav ? (fav.length > 0 ? fav.map((val) => <CardGrid product={val} _class="my-2" />) : '') : <CardPH show={4} />
            }
          </div>
        </div>
        <div className="footer-space"></div>
      </div>
    </>
  )
}

export default MobileFav
