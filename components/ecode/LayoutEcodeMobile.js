import classnames from "classnames";
import React, { useContext, useEffect, useState } from 'react';
import api from '../../utils/api';
import { Link, withTranslation } from "../../utils/i18n";
import UserContext from '../../contexts/UserContext';
import AuthService from '../../utils/AuthService';
import CateFilter from "../mobile/product/CateFilter";
import useMediaQuery from '../../hooks/useMediaQuery';

const LayoutEcodeMobile = (props) => {

  const [visible, setVisible] = useState(false)
  const { isBanner = false, isPreview = false, title, t, children,
    active, show, isFooter, isSeller, loading: page_load, cateData } = props;
  const { user, onSocket, setUser, local, setLocal } = useContext(UserContext)
  const [loading, setLoading] = useState(true);
  const [prevScrollpos, setPrevScrollpos] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [subscribe, setSubscribe] = useState(false);
  const IsMember = () => {
    return user && user.member && user.member.STATUS == "Y";
  }
  const handleInsert = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    api.insertSubcribe(data)
      .then(res => {
        const data = res.data;
        setSubscribe(false);

      })
      .catch(err => {
        console.log(err.response);
      })
    setSubscribe(false);
  }
  const logout = () => {
    AuthService.logout();
    // setUser(null);
    // Router.push('/');
    window.location.href = '/';
  }

  useEffect(() => {
    setPrevScrollpos(window.pageYOffset);
    setLoading(false);

    var path = window.location.pathname;

    if (!path) return;
    if (path === '/th' || path === '/en') {
      path = '/';
    }
    if (path) {
      path = path.replace(/\/th|\/en/g, '');
    }
    const regex = /user/;
    const regex_product = /product-details/;

    if (regex_product.test(path)) {
      const path1 = '/product-details/' + path.split('/product-details/')[1].split('-')[0];
      path = path1;
    }
    if (regex.test(path)) return;
    // console.log('path', path);
    api
      .sendPageStat(path)
      .then(() => { })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  const showCount = () => {
    if (!user || user.cart.length == 0)
      return ''
    return user.cart.length > 9 ? <span>9<span>+</span></span> : <span>{user.cart.length}</span>
  }

  const isMobile = useMediaQuery(992);

  useEffect(() => {
    const handlePrint = () => {
      const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
      linkTags.forEach((linkTag) => {
        linkTag.setAttribute('media', 'print');
      });
    };

    window.addEventListener('beforeprint', handlePrint);

    return () => {
      window.removeEventListener('beforeprint', handlePrint);
    };
  }, []);
  const [cateFilter, setCateFilter] = useState(false);

  console.log(!user);
  return (

    <div className="">
      <div className={classnames("navbar-first mobile-size", {
        "navbar-first-hidden": !visible
      })}>
        {!user
          ?
          <Link href={'/ecode/login_ecode'} as={`/ecode/login_ecode`}>
            <a className="text-default pl-3 d-flex"><img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/user_ecode.svg`} className="w-auto icon-header" /></a>
          </Link>
          : <a className="btn-hamburger col-nav  my-auto" onClick={handleToggleMenu} >
            <div></div>
            <div></div>
            <div></div>
          </a>
        }

        <Link href='/'>
          <a className="col-nav d-flex justify-content-center align-items-center">
            <img className="img-fluid m-auto" src={'/mobile/image/icon/CUlogoMsize.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
          </a>
        </Link>
        <div className="d-flex align-items-center">
          {
            user ? (
              <Link href="/ecode/cart">
                <a className="col-nav my-auto img-cart ml-3 icon-cart">
                  <img src={'/mobile/image/icon/icon-cart.svg'} className="float-right" alt="ศูนย์หนังสือจุฬาฯ" />{showCount()}
                </a>
              </Link>
            ) : (
              <Link href="/login">
                <a className="col-nav my-auto ml-3 icon-cart">
                  <img src={'/mobile/image/icon/icon-cart.svg'} className="float-right" alt="ศูนย์หนังสือจุฬาฯ" />
                </a>
              </Link>
            )
          }
        </div>
      </div>



      <div className={classnames("navbar_in_hamburger", {
        "show": !isMenuOpen
      })}>
        <div className="navbar-first-h ">
          <div className="btn-close-ham col-nav  my-auto" onClick={handleToggleMenu}>

          </div>
          <Link href='/'>
            <a className="col-nav d-flex justify-content-center">
              <img className="img-fluid m-auto" src={'/mobile/image/icon/CUlogoMsize.svg'} alt="ศูนย์หนังสือจุฬาฯ" />

            </a>
          </Link>
          <div className="d-flex align-items-center">
            {
              user ? (
                <Link href="/user/cart">
                  <a className="col-nav my-auto img-cart ml-3 icon-cart">
                    <img src={'/mobile/image/icon/icon-cart.svg'} className="float-right" alt="ศูนย์หนังสือจุฬาฯ" />{showCount()}
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a className="col-nav my-auto ml-3">
                    <img src={'/mobile/image/icon/icon-cart.svg'} className="float-right" alt="ศูนย์หนังสือจุฬาฯ" />
                  </a>
                </Link>
              )
            }
          </div>
        </div>
        <div className="ham-area">
          <div className="bg-white">
            <div className="h-64px"></div>
            <div className="container pt-3 pb-4">

              <Link href={'/ecode/order'}>
                <a className="text-default d-block pl-3">
                  <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-bag.svg`} /> {t('mobile_header:my_order')}
                </a>
              </Link>
              <a className="text-default d-block pl-3" onClick={logout}>
                <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-logout.svg`} /> {t('mobile_header:log_out')}
              </a>

            </div>
          </div>
        </div>

      </div>
      <form className={classnames("subscribe", { "active": subscribe })} onSubmit={handleInsert}>
        <div className="cart-nav nonesha ">
          <a className="btn-back cart-nav-back" onClick={() => setSubscribe(false)}>
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
          </a>
        </div>
        <div className="h-64px"></div>
        <div className="container mt-5">
          <img className="img-fluid" src="/mobile/image/banner/sub_scribe.svg" alt="ศูนย์หนังสือจุฬาฯ" />
          <span className="text-pink text-center mt-3 text-h2">{t('mobile_footer:subscribe')}</span>
          <div className="w-100 clearfix">
            <div className="info-creditcard-100 mt-3 mb-1">
              <input className="effect-16" id="email" name="email" type="email" placeholder="" required />
              <label>{t("mobile_translations:email")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
          </div>
          <p className="text-center mt-3">{t('mobile_footer:read_understood')} <Link href="/privacy_policy/condition"><a className="text-success"><u>{t('mobile_footer:modalprivacy_policy')}</u></a></Link></p>
        </div>
        <div className="success-manu">
          <a className="btn-success-menu" onClick={() => setSubscribe(false)}><span className="text-black m-auto text-h4">{t('mobile_footer:cancel')}</span></a>
          <button type="submit
          " className="btn-success-menu bg-pink nonebord"><span className="text-white m-auto text-h4">{t('mobile_footer:subscribe')}</span></button>

        </div>
      </form>
      {
        cateData ? (
          <CateFilterSeo t={t} cateFilter={cateFilter} setCateFilter={setCateFilter} cateData={cateData} />
        ) : (
          <CateFilter t={t} cateFilter={cateFilter} setCateFilter={setCateFilter} />
        )
      }

    </div>
  )
}




export default withTranslation()(LayoutEcodeMobile);