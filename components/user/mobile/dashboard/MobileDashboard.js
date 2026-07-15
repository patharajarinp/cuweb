import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../../../contexts/UserContext';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { i18n, Link, Router, withTranslation } from '../../../../utils/i18n';

const MobileDashboard = (props) => {
  const { t } = props;
  const { user, handleCart, fetchUser, local, setLocal } = useContext(UserContext)
  const [count, setCount] = useState();
  const [isLoaded,setLoaded] = useState(false)
  const {member} = user || {}
  const logout = () => {
    AuthService.logout();
    window.location.href = '/';
  }

  const changeLanguage = (lang) => {
    setLocal(lang)
    if (i18n.language != lang) {
      i18n.changeLanguage(lang)
    }
  }

  const fecthCount = () => {
    const id = AuthService.getProfile().id;
    api.countOrder(id).then((res) => {
      const data = res.data;
      setCount(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  useEffect(() => {
    fecthCount();
  }, []);

  useEffect(() =>{
    if(!AuthService.isLoggin()) Router.push('/')
    else 
      setLoaded(true)
  },[user])

 
  return ( 
    <>
      <div className="bg-dashboard">
        <div className=" container">
          <div className="info-user-img">
            {user ? <img src={user.picture ? user.picture : '/mobile/image/user/no-picture.png'} className="img-circle-dashboard img-fluid mx-auto" /> : ''}
          </div>
          <h4 className="text-black text-center">{user ? user.firstname : ''} {user ? user.lastname : ''}</h4>
          <div className="d-flex justify-content-center">
            <Link href="/user/favorite">
              <div className="text-center w-25">
                <h3 className="text-black ">
                  {
                    (user && (user.favorites.length && user.favorites.length != 0)) ? (
                      user.favorites.length
                    ) : '0'
                  }
                </h3>
                <p className="p-12">{t("mobile_dashboard:my_wishlist")}</p>
              </div>
            </Link>
            <div>
                <img className="img-fluid mx-3" src="/mobile/image/icon/line.svg" />
            </div>
            <Link href="/user/review">
              <div className="text-center w-25">
                <h3 className="text-black ">
                  {
                    user ? (
                      user.reviews.count
                    ) : '0'
                  }
                </h3>
                <p className="p-12">{t("mobile_dashboard:my_reviews")}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-light-less-gray">
        <div className="container position-relative pb-4">
          <div className="dashboard-menu-arae">
            <div className="d-flex justify-content-between ">
              <div>
                <h4 className="text-black">{t("mobile_dashboard:my_order")}</h4>
              </div>
              <Link href="/user/order">
                <a ><p className="text-pink see-all-link">{t("mobile_translations:view_all")} </p></a>
              </Link>
            </div>
            <hr className="use-line row mt-0 "></hr>
            <div className="d-flex flex-wrap mx-less4px">
              <Link href="/user/order?status=1">
                <a className="col-dashboard">
                  <div className="d-flex mb-2 img-cart">
                    <img className="img-fluid m-auto" src="/mobile/image/icon/icon-payment.svg" />
                    {count && count.status1 ? <span>{count.status1}</span> : null }
                    
                  </div>
                  <p className="text-black p-12 text-center mb-0">{t("mobile_dashboard:waiting_payment")}</p>
                </a>
              </Link>
              <Link href="/user/order?status=2&status=3">
                <a className="col-dashboard">
                  <div className="d-flex mb-2 img-cart">
                    <img className="img-fluid m-auto" src="/mobile/image/icon/icon-preshipping.svg" />
                    {count &&  count.status2 + count.status3 ? <span>{count.status2 + count.status3}</span> :null} 
                  </div>
                  <p className="text-black p-12 text-center mb-0">{t("mobile_dashboard:to_ship")}</p>
                </a>
              </Link>
              <Link href="/user/order?status=4">
                <a className="col-dashboard ">
                  <div className="d-flex mb-2 img-cart">
                    <img className="img-fluid m-auto" src="/mobile/image/icon/icon-shipping.svg" />
                    {count && count.status4 ? <span>{count.status4}</span> : null }
                  </div>
                  <p className="text-black p-12 text-center mb-0">{t("mobile_dashboard:to_receive")}</p>
                </a>
              </Link>
              <Link href="/user/order?status=5">
                <a className="col-dashboard">
                  <div className="d-flex mb-2 img-cart">
                    <img className="img-fluid m-auto" src="/mobile/image/icon/icon-order.svg" />
                    {count && count.status5 ? <span>{count.status5}</span>  : null}
                  </div>
                  <p className="text-black p-12 text-center mb-0">{t("mobile_dashboard:successful_purchase")}</p>
                </a>
              </Link>
              <Link href="/user/review">
              <a className="col-dashboard">
                  <div className="d-flex mb-2">
                    <img className="img-fluid m-auto" src="/mobile/image/icon/icon-review.svg" />
                  </div>
                  <p className="text-black p-12 text-center mb-0">{t("mobile_dashboard:to_review")}</p>
                </a>
              </Link>
              <Link href="/user/order_change">
                <a className="col-dashboard">
                  <div className="d-flex mb-2">
                    <img className="img-fluid m-auto" src="/mobile/icon/icon-change.svg" />
                  </div>
                  <p className="text-black p-12 text-center mb-0">{t("mobile_dashboard:change_product")}</p>
                </a>
              </Link>
              <Link href="/user/order_return">
                <a className="col-dashboard">
                  <div className="d-flex mb-2">
                    <img className="img-fluid m-auto" src="/mobile/icon/icon-return.svg" />
                  </div>
                  <p className="text-black p-12 text-center mb-0">{t("mobile_dashboard:return_products")}</p>
                </a>
              </Link>
              <Link href="/user/order_cancel">
                <a className="col-dashboard">
                  <div className="d-flex mb-2">
                    <img className="img-fluid m-auto" src="/mobile/icon/icon-cancel.svg" />
                  </div>
                  <p className="text-black p-12 text-center mb-0">{t("mobile_dashboard:cancel_product")}</p>
                </a>
              </Link>
              </div>
            </div>
          </div>

          <div className="container bg-white mt-3">
            <Link href="/user/profile">
              <a className="dashboard-list-link">
                <div className="d-flex my-auto">
                  <img className="img-fluid my-auto mr-2" src="/mobile/image/icon/icon-userlink.svg" />
                  <p className="text-black my-auto">{t("mobile_dashboard:account_information")}</p>
                </div>
                <i className="fas fa-chevron-right text-pink my-auto"></i>
              </a>
            </Link>
            <Link href="/user/address">
              <a className="dashboard-list-link">
                <div className="d-flex my-auto">
                  <img className="img-fluid my-auto mr-2" src="/mobile/image/icon/icon-addresslink.svg" />
                  <p className="text-black my-auto">{t("mobile_dashboard:address_book")}</p>
                </div>
                <i className="fas fa-chevron-right text-pink my-auto"></i>
              </a>
            </Link>
            <Link href={member ? "/user/member" : "/premium-member"}>
              <a className="dashboard-list-link">
                <div className="d-flex my-auto">
                  <img className="img-fluid my-auto mr-2" src="/mobile/image/icon/icon-premiumlink.svg" />
                  <p className="text-black my-auto">{t("mobile_dashboard:premium_members")}</p>
                </div>
                <div className="d-flex my-auto">
                  <p className="text-black my-auto mr-2">{user && user.member ? (user.member.POINT ? user.member.POINT : 0) : ''}</p>
                  <i className="fas fa-chevron-right text-pink my-auto"></i>
                </div>
              </a>
            </Link>
            <Link href={"/user/follow"}>
              <a className="dashboard-list-link">
                <div className="d-flex my-auto">
                  <img className="img-fluid my-auto mr-2" src="/mobile/image/icon/icon-follow.svg" />
                  <p className="text-black my-auto">{t("mobile_dashboard:follow")}</p>
                </div>
              </a>
            </Link>
          </div>
          <div className="container bg-white mt-3">
            <a className="dashboard-list-link" onClick={local == 'th' ? () => changeLanguage('en') : () => changeLanguage('th')}>
              <div className="d-flex my-auto">
                <img className="img-fluid my-auto mr-2" src="/mobile/image/icon/icon-language.svg" />
                <p className="text-black my-auto">{t("mobile_dashboard:change_language")}</p>
              </div>
              <div className="d-flex my-auto">
                <p className="text-black my-auto mr-2">{local == 'th' ? t("mobile_dashboard:thai") : t('mobile_dashboard:eng')}</p>
                <i className="fas fa-chevron-right text-pink my-auto"></i>
              </div>
            </a>
            <Link href="/help">
              <a className="dashboard-list-link">
                <div className="d-flex my-auto">
                  <img className="img-fluid my-auto mr-2" src="/mobile/image/icon/icon-helplink.svg" />
                  <p className="text-black my-auto">{t("mobile_dashboard:help")}</p>
                </div>
                <i className="fas fa-chevron-right text-pink my-auto"></i>
              </a>
            </Link>
          </div>
          <div className="container bg-white mt-3">
            <a className="dashboard-list-link" onClick={logout}>
              <p className="text-black my-auto mr-2">{t("mobile_dashboard:log_out")}</p>
            </a>
          </div>
          <div className="footer-space"></div>
      </div>
    </>
  )
}

export default MobileDashboard