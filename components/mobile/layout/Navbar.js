import classnames from "classnames";
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import Autocomplete from '../../../components/mobile/widget/Autocomplete';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import AuthService from "../../../utils/AuthService";
import { Link, i18n, Router, withTranslation } from '../../../utils/i18n';
import CateFilter from "../product/CateFilter";
import CateFilterSeo from "../product/CateFilterSeo";

const Navbar = (props) => {
  const [visible, setVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [prevScrollpos, setPrevScrollpos] = useState(0)
  const [userInput, setuserInput] = useState(null)
  const { user, handleCart, fetchUser, local, setLocal } = useContext(UserContext)
  const [subscribe, setSubscribe] = useState(false);
  const { t, isSeller, cateData } = props;
  const [productEcode, setProductEcode] = useState(0);
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
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    document.addEventListener('scroll', () => {
      const isTopone = window.scrollY < 300;
      if (isTopone !== visible) {
        setVisible(isTopone);
      }
      setVisible(!isTopone);
    });
  }, [])


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
// เปิดแชท AI
  const handleOpenAiChat = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-mobile-ai-chat'));
    }
  }

  const [cateFilter, setCateFilter] = useState(false);

  useEffect(()=>{
      if(!user) return;
      let hasEcode = 0;
      user.cart.forEach(data => {
        if (data.type === 'ecode') hasEcode = 1;
      });
      setProductEcode(hasEcode);
    },[user])


  return (
    <div className="">
      <div className={classnames("navbar-first mobile-size", {
        "navbar-first-hidden": !visible
      })}>
        <a className="btn-hamburger col-nav  my-auto" onClick={handleToggleMenu} >
          <div></div>
          <div></div>
          <div></div>
        </a>
        <Link href='/'>
          <a className="col-nav d-flex justify-content-center align-items-center">
            <img className="img-fluid m-auto" src={'/mobile/image/icon/CUlogoMsize.svg'} alt="ศูนย์หนังสือจุฬาฯ" style={{filter:'grayscale(1)'}}/>
          </a>
        </Link>
        <div className="d-flex align-items-center">
          <a className="" onClick={local == 'th' ? () => changeLanguage('en') : () => changeLanguage('th')}>{local == 'th' ? <img src={'/icon/thailand.png'} className="icon-lang-th" alt="ศูนย์หนังสือจุฬาฯ" /> :  <img src={'/icon/united-kingdom.png'} className="" alt="ศูนย์หนังสือจุฬาฯ" />}</a>
          {
            user ? (
              <Link href={productEcode === 1 ? '/ecode/cart' : '/user/cart'}>
                <a className="col-nav my-auto img-cart ml-3">
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
      {/* // แสดงแถบค้นหาและปุ่ม AI เฉพาะเมื่อไม่ใช่ผู้ขาย */}
      {
        !isSeller ? (
          <div className={classnames("nav-search mobile-size", {
            "nav-search-up": !visible
            })}>
            <div className="d-flex container">
              <div className="w-100 my-auto">
                <Autocomplete
                />
              </div>
              <button
                type="button"
                className="my-auto ml-2 d-flex align-items-center justify-content-center"
                onClick={handleOpenAiChat}
                style={{ width: 35, height: 35, border: '1px solid #bdbdbd', borderRadius: 6, background: '#fff', fontSize: 11, fontWeight: 'bold' }}
              >
                AI
              </button>
              {
                user ? (
                  <Link href="/user/cart">
                    <a className={classnames("my-auto ml-2 img-cart", {
                      "d-none": !visible
                    })}>
                      <img src={'/mobile/image/icon/icon-cart.svg'} className="float-right" alt="ศูนย์หนังสือจุฬาฯ" />{showCount()}
                    </a>
                  </Link>
                ) : (
                    <Link href="/login">
                      <a className={classnames("my-auto ml-2", {
                        "d-none": !visible
                      })}>
                        <img src={'/mobile/image/icon/icon-cart.svg'} className="float-right" alt="ศูนย์หนังสือจุฬาฯ" />
                      </a>
                    </Link>
                  )
              }
    
            </div>
          </div>
        ) : ''
      }
      
      {/* <div className="navbar-main">
          <Link href='/'>
            <a className="col-nav-main">
              <img src={'/mobile/image/icon/icon-on-home.svg'} />
              <p className="text-btn m-0 p-12">{t("mobile_navbar:home_page")}</p>
            </a>
          </Link>
          <Link href="/categories">
            <a className="col-nav-main">
              <img src={'/mobile/image/icon/icon-sort.svg'} />
              <p className="text-btn m-0 p-12">{t("mobile_header:category")}</p>
            </a>
          </Link>

          {
            user ? (
              <>
                <Link href="/user/notification">
                  <a className="col-nav-main">
                    <img src={'/mobile/image/icon/icon-notification.svg'} />
                    <p className="text-btn m-0 p-12">{t("mobile_navbar:notifications")}</p>
                  </a>
                </Link>
                <Link href="/user/dashboard">
                  <a className="col-nav-main">
                    <img src={'/mobile/image/icon/icon-profile.svg'} />
                    <p className="text-btn m-0 p-12">{t("mobile_navbar:my_account")}</p>
                  </a>
                </Link>
              </>
            ) : (
                <>
                  <Link href="/login">
                    <a className="col-nav-main">
                      <img src={'/mobile/image/icon/icon-notification.svg'} />
                      <p className="text-btn m-0 p-12">{t("mobile_navbar:notifications")}</p>
                    </a>
                  </Link>
                  <Link href="/login">
                    <a className="col-nav-main">
                      <img src={'/mobile/image/icon/icon-profile.svg'} />
                      <p className="text-btn m-0 p-12">{t("mobile_navbar:my_account")}</p>
                    </a>
                  </Link>
                </>
              )
          }

        </div> */}
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
            <a className="" onClick={local == 'th' ? () => changeLanguage('en') : () => changeLanguage('th')}>{local == 'th' ? <img src={'/icon/thailand.png'} className="icon-lang-th" alt="ศูนย์หนังสือจุฬาฯ" /> :  <img src={'/icon/united-kingdom.png'} className="" alt="ศูนย์หนังสือจุฬาฯ" />}</a>
            {
              user ? (
                <Link href="/user/cart">
                  <a className="col-nav my-auto img-cart ml-3">
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

              {
                !user && (
                  <Link href={`/login`}>
                    <a className="btn-pink-login ">
                      <span className="text-white m-auto text-h4">{t("mobile_header:login")}</span>
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
                  <span className="text-black text-h4">{t("mobile_header:book")}</span>
                  <i className="fas fa-chevron-right text-pink"></i>
                </a>
              </Link>
              <Link href={`/main-ebook`}>
                <a className="hamburger-list">
                  <span className="text-black text-h4">{t("mobile_header:ebook")}</span>
                  <i className="fas fa-chevron-right text-pink"></i>
                </a>
              </Link>
              
              {/* {api.mode != "production" &&  */}
              <Link href={`/main-course-online`}>
                <a className="hamburger-list">
                  <span className="text-black text-h4">{t("mobile_header:online_course")}</span>
                  <i className="fas fa-chevron-right text-pink"></i>
                </a>
              </Link> 
              {/* } */}
              {/* <a className="hamburger-list">
                <span className="text-black text-h4">{t("mobile_header:online_course")}</span>
                <i className="fas fa-chevron-right text-pink"></i>
              </a> */}
              <Link href={`/main-stationeries`}>
                <a className="hamburger-list">
                  <span className="text-black text-h4">{t("mobile_header:stationary")}</span>
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
                  <span className="text-black text-h4">{t("mobile_header:promotion")}</span>
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
                <a className='d-flex'><span className="mr-2 text-h4">{local == 'th' ? t("mobile_navbar:thai") : t('mobile_header:eng')}</span><i className="fas fa-chevron-right text-pink my-auto"></i></a>
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
                <div className="d-flex my-0 pb-4"><span className='text-h5'>{t("mobile_header:about_us")}</span><i className="fas fa-chevron-right ml-2 text-white my-auto text-14"></i></div>
              </Link>
              <Link href="/privacy_policy/[subkey]?subkey=privacy_policy" as={`/privacy_policy/privacy_policy`}>
                <div className="d-flex  my-0 pb-4"><span className='text-h5'>{t("mobile_navbar:privacy_policy_menu")}</span><i className="fas fa-chevron-right ml-2 text-white my-auto text-14"></i></div>
              </Link>
              <button type="button" className="btn btn-outline-white mt-4 w-100" onClick={() => setSubscribe(true)}><i className="fas fa-paper-plane mr-2" ></i>{t('mobile_footer:subscribe')}</button>
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


export default withTranslation(['mobile_header', 'mobile_navbar','mobile_dashboard'])(Navbar);