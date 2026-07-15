import React, { useContext, useEffect, useState } from 'react'
import classnames from "classnames";
// import Link from 'next/link';
import UserContext from '../../contexts/UserContext';
import { i18n, Router, Link, withTranslation } from '../../utils/i18n';
import api from '../../utils/api';
import CateFilter from './product/CateFilter';

const NavbarCustom = ({ t, isSeller,left,right,center,isBack = true,isBurger,isCart = true , _class,  isLang = false}) => {
  const { user, handleCart, fetchUser, local, setLocal } = useContext(UserContext)
  const [visible, setVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(true)


  const handleToggleMenu = () => {
      setIsMenuOpen(!isMenuOpen)
  }
  const showCount = () => {
      if (!user || user.cart.length == 0)
          return ''
      return user.cart.length > 9 ? <span>9<span>+</span></span> : <span>{user.cart.length}</span>
  }
  const changeLanguage = (lang) => {
      setLocal(lang)
      if (i18n.language != lang) {
        i18n.changeLanguage(lang)
      }
    }
  const back = () => {
      Router.back();
  }

  const [subscribe, setSubscribe] = useState(false);
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

  const [cateFilter, setCateFilter] = useState(false);

  return (
    <div>
        <div className={classnames("navbar-first mobile-size ", {
            "navbar-first-hidden": !visible
        },_class)}>
            <div className="col-nav d-flex justify-content-start">
                {
                    left ? left :
                    (   isBurger ?
                        <a className="btn-hamburger  my-auto" onClick={handleToggleMenu} >
                            <div></div>
                            <div></div>
                            <div></div>
                        </a>    
                    :   (
                            isBack && 
                            <a className="btn-back row " style={{flex:"none"}} onClick={() => back()}>
                                <img className="img-fluid ml-2" src={'/mobile/image/icon/icon-back.svg'} alt={"icon-back"} />
                            </a> 
                        )
                    )
                }
                

                {/* <a className="btn-back row " style={{flex:"none"}} onClick={() => back()}>
                    <img className="img-fluid ml-2" src={'/mobile/image/icon/icon-back.svg'} alt={"icon-back"} />
                </a> */}
            </div>
            <div className="col-nav d-flex justify-content-center align-items-center">
                {
                    center ? center :

                    <Link href='/'>
                        <a className="d-flex justify-content-center align-items-center">
                            <img className="img-fluid m-auto" src={'/mobile/image/icon/CUlogoMsize.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
                        </a>
                    </Link>       
                }
                
            </div>
            <div className="col-nav d-flex justify-content-end">
              <div className='d-flex align-items-center'>
                {
                  isLang && (
                    <a className="" onClick={local == 'th' ? () => changeLanguage('en') : () => changeLanguage('th')}>{local == 'th' ? <img src={'/icon/thailand.png'} className="icon-lang-th" alt="ศูนย์หนังสือจุฬาฯ" /> :  <img src={'/icon/united-kingdom.png'} className="" alt="ศูนย์หนังสือจุฬาฯ" />}</a>
                  )
                }
                {
                  right ? right :
                    (isCart && <>
                        {
                            user ? (
                                <Link href="/user/cart">
                                <a className="my-auto img-cart ml-3">
                                    <img src={'/mobile/image/icon/icon-cart.svg'} className="float-right" alt="ศูนย์หนังสือจุฬาฯ" />{showCount()}
                                </a>
                                </Link>
                            ) : (
                                <Link href="/login">
                                    <a className="my-auto ml-3">
                                    <img src={'/mobile/image/icon/icon-cart.svg'} className="float-right" alt="ศูนย์หนังสือจุฬาฯ" />
                                    </a>
                                </Link>
                                )
                        } 
                        </>          
                    )
                }
              </div>
            </div>
        </div>
        {
            isBurger && 
        
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
          <div className="col-nav d-flex justify-content-end">
            <div className='d-flex align-items-center'>
              {
                isLang && (
                  <a className="" onClick={local == 'th' ? () => changeLanguage('en') : () => changeLanguage('th')}>{local == 'th' ? <img src={'/icon/thailand.png'} className="icon-lang-th" alt="ศูนย์หนังสือจุฬาฯ" /> :  <img src={'/icon/united-kingdom.png'} className="" alt="ศูนย์หนังสือจุฬาฯ" />}</a>
                )
              }
              {
                right ? right :
                (isCart && <>
                    {
                        user ? (
                            <Link href="/user/cart">
                            <a className="my-auto img-cart ml-3">
                                <img src={'/mobile/image/icon/icon-cart.svg'} className="float-right" alt="ศูนย์หนังสือจุฬาฯ" />{showCount()}
                            </a>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <a className="my-auto ml-3">
                                <img src={'/mobile/image/icon/icon-cart.svg'} className="float-right" alt="ศูนย์หนังสือจุฬาฯ" />
                                </a>
                            </Link>
                            )
                    } 
                    </>          
                )
              }  
            </div>
          </div>
            
                 
        </div>
        <div className="ham-area">
          <div className="bg-white">
            <div className="h-64px"></div>
            <div className="container pt-3 pb-4">

              {
                !user && (
                  <Link href={`/login`}>
                    <a className="btn-pink-login ">
                      <span className="text-white m-auto text-h4">{t("login")}</span>
                    </a>
                  </Link>
                )
              }

              <a className="hamburger-list" onClick={() => setCateFilter(true)}>
                <span className="text-black text-h4">{t('header:category')}</span>
                <i className="fas fa-chevron-right text-pink"></i>
              </a>
              <Link href={`/main-book`}>
                <a className="hamburger-list">
                  <span className="text-black text-h4">{t("book")}</span>
                  <i className="fas fa-chevron-right text-pink"></i>
                </a>
              </Link>
              <Link href={`/main-ebook`}>
                <a className="hamburger-list">
                  <span className="text-black text-h4">{t("ebook")}</span>
                  <i className="fas fa-chevron-right text-pink"></i>
                </a>
              </Link>
              
              {/* {api.mode != "production" &&  */}
              <Link href={`/main-course-online`}>
                <a className="hamburger-list">
                  <span className="text-black text-h4">{t("online_course")}</span>
                  <i className="fas fa-chevron-right text-pink"></i>
                </a>
              </Link> 
               {/* } */}
              {/* <a className="hamburger-list">
                <span className="text-black text-h4">{t("online_course")}</span>
                <i className="fas fa-chevron-right text-pink"></i>
              </a> */}
              <Link href={`/main-stationeries`}>
                <a className="hamburger-list">
                  <span className="text-black text-h4">{t("stationary")}</span>
                  <i className="fas fa-chevron-right text-pink"></i>
                </a>
              </Link>
              <Link href={`/marketplace`}>
                <a className="hamburger-list">
                  <span className="text-black text-h4">{t("mobile_navbar:marketplace")}</span>
                  <i className="fas fa-chevron-right text-pink"></i>
                </a>
              </Link>
              <Link href={`/blog`}>
                <a className="hamburger-list">
                  <span className="text-black text-h4">{t("mobile_navbar:blog")}</span>
                  <i className="fas fa-chevron-right text-pink"></i>
                </a>
              </Link>
              <Link href={`/promotion`}>
                <a className="hamburger-list">
                  <span className="text-black text-h4">{t("promotion")}</span>
                  <i className="fas fa-chevron-right text-pink"></i>
                </a>
              </Link>
              <Link href={`/news`}>
                <a className="hamburger-list">
                  <span className="text-black text-h4">{t("mobile_navbar:news_activities")}</span>
                  <i className="fas fa-chevron-right text-pink"></i>
                </a>
              </Link>
              <Link href={`/book-article`}>
                <a className="hamburger-list">
                  <span className="text-black text-h4">{t("mobile_navbar:book_article")}</span>
                  <i className="fas fa-chevron-right text-pink"></i>
                </a>
              </Link>
              {/* {user?
                <Link href={`/blog/writer/register`}>
                <a className="hamburger-list"><span className="text-black text-h4">{t("mobile_dashboard:want_to_write")}</span><i className="fas fa-chevron-right text-pink my-auto"></i></a>
                </Link>
               
               :
               <Link href={`/login`}>
                  <a className="hamburger-list"><span className="text-black text-h4">{t("mobile_dashboard:want_to_write")}</span><i className="fas fa-chevron-right text-pink my-auto"></i></a>
                 </Link>
               }
               <Link href={`/seller/register`}>
                <a className="hamburger-list"><span className="text-black text-h4">{t("mobile_dashboard:want_to_sell")}</span><i className="fas fa-chevron-right text-pink my-auto"></i></a>
                </Link> */}

              {/* <div className="hamburger-list" onClick={local == 'th' ? () => changeLanguage('en') : () => changeLanguage('th')}>
                <a><span className="text-black text-h4">{t("change_language")}</span></a>
                <a className='d-flex'><span className="mr-2 text-h4">{local == 'th' ? t("navbar:thai") : t('eng')}</span><i className="fas fa-chevron-right text-pink my-auto"></i></a>
              </div> */}

            </div>
          </div>
          <div className="footer-nav">
            <div className="container">
              <div className="d-flex mt-2 mb-4 pt-2">
                <a className="footer-nav-icon" href='https://www.facebook.com/cubook' target="_blank">
                  <img className="img-fluid" src={'/mobile/image/icon/icon-facebook.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
                </a>
                <a className="footer-nav-icon" href='https://twitter.com/Chulabook' target="_blank">
                  <img className="img-fluid" src={'/mobile/image/icon/icon-twitter.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
                </a>
                <a className="footer-nav-icon" href='https://www.instagram.com/chulabook/?hl=th' target="_blank">
                  <img className="img-fluid" src={'/mobile/image/icon/icon-ig.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
                </a>
                <a className="footer-nav-icon" href='https://www.youtube.com/user/ChulabookCU' target="_blank">
                  <img className="img-fluid" src={'/mobile/image/icon/icon-youtube.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
                </a>
              </div>
              <Link href="/contact">
                <div className="d-flex my-0 py-4"><span className='text-h5'>{t("mobile_translations:contact_us")}</span><i className="fas fa-chevron-right ml-2 text-white my-auto text-14"></i></div>
              </Link>
              <Link href={`/about/[subkey]?subkey=history`} as={`/about/history`}>
                <div className="d-flex my-0 pb-4"><span className='text-h5'>{t("about_us")}</span><i className="fas fa-chevron-right ml-2 text-white my-auto text-14"></i></div>
              </Link>
              <Link href="/privacy_policy/[subkey]?subkey=privacy_policy" as={`/privacy_policy/privacy_policy`}>
                <div className="d-flex  my-0 pb-4"><span className='text-h5'>{t("mobile_navbar:privacy_policy_menu")}</span><i className="fas fa-chevron-right ml-2 text-white my-auto text-14"></i></div>
              </Link>
              <button type="button" className="btn btn-outline-white mt-4 w-100" onClick={() => setSubscribe(true)}><i className="fas fa-paper-plane mr-2" ></i>{t('mobile_footer:subscribe')}</button>
            </div>
          </div>
        </div>

      </div>
    }
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
    <CateFilter t={t} cateFilter={cateFilter} setCateFilter={setCateFilter} />

    </div>
  )
}

export default withTranslation(['mobile_header', 'mobile_navbar','mobile_dashboard'])(NavbarCustom)