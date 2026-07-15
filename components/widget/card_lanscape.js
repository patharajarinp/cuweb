import classNames from 'classnames';
import React, { memo, useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import LoginLayout from '../../components/layout/login_layout';
import UserContext from '../../contexts/UserContext';
import api from '../../utils/api';
import AuthService from '../../utils/AuthService';
import { Link, withTranslation } from '../../utils/i18n';
import tools from '../../utils/tools';
import { HeartLottie } from '../icon/lottie';



const _CardL = memo(props => {
  const { product, show = 3, t, seller_preview = 0 } = props;
  const { user, handleCart, fetchUser, setUser } = useContext(UserContext);

  const [reviewsavg, setReviewAVG] = useState();
  const [avg, setAVG] = useState(0);

  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const addcart = (event, id) => {
    event.preventDefault();
    event.persist();
    if (AuthService.isLoggin()) {
      if (!user) return;
      if (user.cart.length) {
        var check = user.cart.find((val) => val.product_id == id)
        if (check) {
          if (check.type === 'ebook') {
            alert('สินค้าที่ท่านเลือกเป็นรูปแบบ eBook สามารถสั่งซื้อได้เพียงครั้งเดียวเท่านั้น');
            return;
          }
          if (check.type === 'course') {
            alert('สินค้าที่ท่านเลือกเป็นรูปแบบ course สามารถสั่งซื้อได้เพียงครั้งเดียวเท่านั้น');
            return;
          }
        }
      }
      if (event.target.tagName == "BUTTON")
        event.target.classList.toggle('active')
      else
        event.target.parentElement.classList.toggle('active')
      api.addCart({ product_id: id, quantity: 1, type: 1 })
        .then(res => {
          const data = res.data;
          // ;
          fetchUser();
          setTimeout(() => {
            if (event.target.tagName == "BUTTON")
              event.target.classList.toggle('active')
            else
              event.target.parentElement.classList.toggle('active')
          }, 2000)
          //fetchUser();
          // history.back();
        })
        .catch(err => {
          if (err.response.data.code == 1211) {
            alert('สินค้าไม่เพียงพอ');
          }
          console.log(err.response);
        })
    } else {
      setShowLogin(true);
      // alert('not login');
    }
  }




  const [img, setImg] = useState(`${api.frontend_url}/images/book.png`);
  const [youtube, setYoutube] = useState(0);

  useEffect(() => {
    if (product) {
      var namepath = product.picture;
      if (namepath) {
        var [path, link] = namepath.split("watch?v=");
        if (link) {
          setYoutube('https://www.youtube.com/embed/' + link);
        }
        setImg(product.picture ? product.picture : `${api.frontend_url}/images/book.png`);
      }
    }
  }, []);
  function useWindowSize() {
    const isClient = typeof window === 'object';

    function getSize() {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
      };
    }

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
      if (!isClient) {
        return false;
      }

      function handleResize() {
        setWindowSize(getSize());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return windowSize;
  }


  const [animate, setAnimate] = useState(false)
  const addFavorite = (e, product_id) => {
    e.preventDefault();
    if (AuthService.isLoggin()) {
      if (!isFavorite()) setAnimate(true)
      const id = AuthService.getProfile().id;
      api.addOrdeleteFav(id, { product_id })
        .then(res => {
          const data = res.data;
          let tmp = user;
          if (data.added) {
            tmp.favorites.push({ product_id })
          } else {
            tmp.favorites.splice(tmp.favorites.findIndex((fav) => fav.product_id == product_id), 1);
          }

          setTimeout(function () { setAnimate(false) }, 800)


          setTimeout(function () { setUser(tmp) }, data.added ? 800 : 0)

        })
        .catch(err => {
          console.log(err.response);
        })
    } else {
      setShowLogin(true);
    }
  }

  const isFavorite = () => {
    if (!user || !product) {
      return false;
    }
    var product_id = product.id;

    if (user.favorites.length == 0) {
      return false;
    }

    var found = false;

    user.favorites.forEach(item => {
      if (item.product_id == product_id) {
        found = true;
      }
    });
    // console.log(found);

    return found;
  }
  const isBoughtEbook = (ebook_id) => {
    if (!user || !ebook_id) return false;
    const { ebooks } = user;
    if (!ebooks) return false;
    const { books } = ebooks;

    let bool = books.includes(ebook_id.toString())

    return bool;
  }

  const renderButton = (product) => {

    if (!product) return;
    const isEbook = product.type == 'ebook';
    const isPreOrder = !!product.preorder

    if (product.comming === 'Y') {
      return <button className="btn btn-disabled w-100" disabled>{t('comming')}</button>
    }
    if (seller_preview) {
      return <button className="btn btn-disabled w-100 cursor-unset" disabled>{t('soon')}</button>
    }
    if (isEbook) {
      const isBought = isBoughtEbook(product.ebook_id);

      return <button onClick={(event) => { addcart(event, product.id) }} disabled={isBought} className={classNames("btn  w-100 cart-animate", { "btn-disabled": (isBought), "btn-ebook": (isEbook) })}><span className="main">{isBought ? t('bought') : t('add_to_cart')}</span><span className="sub">{t('added')}</span><img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/cartrun.svg`} width="20" /></button>
    } else if (product.type == 'course') {

      return <button onClick={(event) => { addcart(event, product.id) }} className={classNames("btn  w-100 cart-animate", { "btn-course": (product.type == 'course') })}><span className="main">{t('add_to_cart')}</span><span className="sub">{t('added')}</span><img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/cartrun.svg`} width="20" /></button>
    } else if (isPreOrder) {
      var status = checkDate(product);
      if (status == 0) {
        return <button className="btn btn-disabled w-100" disabled>{t('soon')}</button>
      } else if (status == 1) {
        return <button className="btn btn-disabled w-100" disabled>{t('soon')}</button>
      } else if (status == 2) {
        return <button className="btn btn-disabled w-100" disabled>{t('close')}</button>
      } else if (status == 3) {
        return <button className="btn btn-disabled w-100" disabled>{t('out_stock')}</button>
      } else {
        return <button onClick={(event) => { addcart(event, product.id) }} className={classNames("btn btn-small w-100 cart-animate", { " btn-primary": (product.type == 'book'), "btn-stationery": (product.type == 'non_book') })}><span className="main">{t('add_to_cart')}</span><span className="sub">{t('added')}</span><img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/cartrun.svg`} width="20" /></button>
      }
    } else {
      if (product.stock && ((product.stock > product.reserve_stock) && product.enable == 1)) {
        return <button onClick={(event) => { addcart(event, product.id) }} className={classNames("btn btn-small w-100 cart-animate", { " btn-primary": (product.type == 'book'), "btn-stationery": (product.type == 'non_book') })}><span className="main">{t('add_to_cart')}</span><span className="sub">{t('added')}</span><img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/cartrun.svg`} width="20" /></button>
      }
      else {
        return <button className="btn btn-disabled w-100" disabled>{t('out_stock')}</button>
      }

    }

  }

  const checkDate = (val) => {
    if (!val.preorder_start || !val.preorder_end) {
      return 0;
    }
    var start = new Date(val.preorder_start);
    var end = new Date(val.preorder_end);
    var now = new Date();
    if (now < start) {
      return 1;
    } else if (now > end) {
      return 2;
    } else if (!val.preorder_amount) {
      return 3;
    } else {
      return 4;
    }
  }

  const showText = (status) => {
    if (status == 0) {
      return <div className="text-stock">{t('soon')}</div>;
    } else if (status == 1) {
      return <div className="text-stock">{t('soon')}</div>;
    } else if (status == 2) {
      return <div className="text-stock">{t('close')}</div>;
    } else if (status == 3) {
      return <div className="text-stock">{t('out_stock')}</div>;
    } else {
      return;
    }
  }

  const product_name = encodeURIComponent(product && product.name.trim().replace(/\//g, '-'))
  // console.log(product);

  const size = useWindowSize();
  return (
    <>
      <div className="col-12 mb-4" >
        {
          product && (
            <div className="product-main-list">
              <div className="product-card">
                <div className="row mx-0">

                  <div className="col-3 px-0  ">
                    {
                      seller_preview ? (
                        <div className={classNames("show-book cursor-unset ",
                          product.preorder ? (checkDate(product) != 4 ? 'set-stock' : '') : (((product.stock && product.stock > product.reserve_stock) || product.type == 'ebook' || product.type == 'course') ? '' : 'set-stock'))}>
                          <div className={classNames("area-book", { "p-0": (product.picture && product.type == 'non_book') })}>

                            {
                              (product.preorder) ? (
                                <>
                                  <img alt={product.name ? product.name : product.name} data-src={product.picture ? product.picture : `${api.frontend_url}/images/book.png`} align="middle" className="mh-100  no-img lazyload mw-100per" />
                                  <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/pre_order.svg`} className="img-stock lazyload" />
                                </>
                              ) : (
                                product.type == 'non_book' ? (
                                  <img alt={product.name ? product.name : product.name} src={product.picture ? product.picture : `${api.frontend_url}/images/book.png`} align="middle" className="mh-100 mw-100 lazyload " />
                                ) : (
                                  <>
                                    <img alt={product.name ? product.name : product.name} data-src={product.picture ? product.picture : `${api.frontend_url}/images/book.png`} align="middle" className="mh-100 mw-100 no-img lazyload mw-100per" />
                                    {
                                      product.type == 'ebook' && (
                                        <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/ebook.svg`} className="img-stock lazyload" />
                                      )
                                    }
                                  </>
                                )
                              )
                            }


                            {
                              product.comming === 'Y' ? (
                                <div className="text-stock">{t('comming')}</div>
                              ) : product.preorder ? (
                                <>
                                  {
                                    (checkDate(product) != 4) ? showText(checkDate(product)) : ''
                                  }
                                </>
                              ) : (
                                <>
                                  {
                                    ((product.stock && product.stock > product.reserve_stock) || product.type == "ebook" || product.type == 'course') ?
                                      '' : <div className="text-stock">{t('out_stock')}</div>
                                  }
                                </>
                              )
                            }
                          </div>
                          {
                            (product.promotion_active || product.promotion_product_active) ? (
                              <div className="badge-pro"><img src={`${api.frontend_url}/icon/promotion.svg`} /></div>
                            ) : null
                          }
                        </div>
                      ) : (
                        <Link {...tools.getUrlProduct(product)}>
                          <a>
                            <div className={classNames("show-book cursor-pointer",
                              product.preorder ? (checkDate(product) != 4 ? 'set-stock' : '') : (((product.stock && product.stock > product.reserve_stock) || !product.item_code || product.type == 'course') ? '' : 'set-stock'))}>
                              <div className={classNames("area-book", { "p-0": (product.picture && (product.type == 'non_book' || product.type == 'course')) })}>
                                {
                                  (product.preorder) ? (
                                    <>
                                      <img alt={product.name ? product.name : product.name} data-src={product.picture ? product.picture : `${api.frontend_url}/images/book.png`} align="middle" className="mh-100  no-img lazyload mw-100per" />
                                      <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/pre_order.svg`} className="img-stock lazyload" />
                                    </>
                                  ) : product.type == 'non_book' ? (
                                    <img alt={product.name ? product.name : product.name} src={product.picture ? product.picture : `${api.frontend_url}/images/book.png`} align="middle" className="mh-100 mw-100 lazyload " />
                                  ) : product.type == 'course' ? (
                                    <>
                                      <img alt={product.name ? product.name : product.name} src={product.picture ? product.picture : `${api.frontend_url}/images/book.png`} align="middle" className="mh-100 mw-100 lazyload " />
                                      <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/coursesmall.svg`} className="img-stock lazyload" />
                                    </>
                                  ) : (
                                    <>
                                      <img alt={product.name ? product.name : product.name} data-src={product.picture ? product.picture : `${api.frontend_url}/images/book.png`} align="middle" className="mh-100 mw-100 no-img lazyload mw-100per" />
                                      {
                                        product.type == 'ebook' && (
                                          <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/ebook.svg`} className="img-stock lazyload" />
                                        )
                                      }
                                      {/* {
                                              product.type == 'course' && (
                                                <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/coursesmall.svg`} className="img-stock lazyload" />
                                              )
                                            } */}
                                    </>
                                  )

                                }


                                {
                                  product.comming === 'Y' ? (
                                    <div className="text-stock">{t('comming')}</div>
                                  ) : product.preorder ? (
                                    <>
                                      {
                                        (checkDate(product) != 4) ? showText(checkDate(product)) : ''
                                      }
                                    </>
                                  ) : (
                                    <>
                                      {
                                        ((product.stock && product.stock > product.reserve_stock) || product.type == "ebook" || product.type == 'course') ?
                                          '' : <div className="text-stock">{t('out_stock')}</div>
                                      }
                                    </>
                                  )

                                }
                              </div>
                              {
                                (product.promotion_active || product.promotion_product_active) ? (
                                  <div className="badge-pro"><img src={`${api.frontend_url}/icon/promotion.svg`} /></div>
                                ) : null
                              }
                            </div>
                          </a>
                        </Link>
                      )
                    }

                  </div>
                  <div className="col-6 px-0 border-right">
                    <div className="show-detail">
                      <div className="d-flex justify-content-between">
                        <p className="main-shop">
                          <img alt="ศูนย์หนังสือจุฬาฯ" src={product ? (product.seller_id != 'cu' ? (seller_preview ? (product.seller_picture_preview ? product.seller_picture_preview : `${api.frontend_url}/images/no-picture.png`) : product.seller_picture) : `${api.frontend_url}/icon/cu-cook.svg`) : ''} align="middle" className="icon-card mr-2" />
                          <span>{product ? (product.seller_id != 'cu' ? product.shop_name : "CHULABOOK") : ''}</span>
                        </p>
                        {
                          seller_preview ? (
                            <p>
                              <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/fav-none.svg`} className={classNames(" lazyload cursor-unset ", { "ml-5": size.width > 992 })} />
                            </p>
                          ) : (
                            <>
                              {
                                product && (
                                  <p>
                                    {
                                      isFavorite() ? (
                                        <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/fav-active.svg`} className={classNames(" lazyload cursor-pointer", { "ml-5": size.width > 992 })} onClick={(e) => { addFavorite(e, product.id) }} />
                                      ) : (
                                        <>
                                          {
                                            animate ? <HeartLottie style={{ marginRight: "12px", marginTop: "-12px", position: "absolute", right: "0", width: '50px', height: '50px' }} /> :
                                              <img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/fav-none.svg`} className={classNames(" lazyload cursor-pointer", { "ml-5": size.width > 992 })} onClick={(e) => { addFavorite(e, product.id) }} />
                                          }
                                        </>
                                      )
                                    }
                                  </p>
                                )
                              }
                            </>
                          )
                        }

                      </div>
                      {
                        seller_preview ? (
                          <h3 className="book-name  cursor-unset ">{product.name ? product.name : product.name}</h3>
                        ) : (
                          <Link {...tools.getUrlProduct(product)}>
                            <a className="text-black"><h3 className="book-name  cursor-pointer">{product.name ? product.name : product.name}</h3></a>
                          </Link>
                        )
                      }

                      <p className="book-author">{(product.type == 'book' || product.type == 'ebook') ? (product.author ? `${t('author')} :  ${product.author}` : product.author) : ''}</p>
                    </div>
                  </div>

                  <div className="col-3 pr-0">
                    <div className="show-price mt-4">
                      <p className="book-amount border-bottom pt-3">{t("InStock")} : {product.stock ? product.stock : product.stock} {t("hasproduct")}</p>
                      <div className="mt-4">
                        <p className="book-price">{t('price')}</p>
                        <p className={classNames("book-price-num", { "text-pink": (product.type == 'book'), "text-ebook": (product.type == 'ebook'), "text-stationery": (product.type == 'non_book'), "text-course": (product.type == 'course') })}>฿ {tools.currencyFormatDE(product.price ? product.price : product.price)}</p>
                      </div>
                      <div className="btn-product-group text-center mt-4">
                        {renderButton(product)}
                        <p className="pt-3 mb-0 ">
                          {
                            seller_preview ? (
                              <a className="text-black cursor-unset">{t("read_more")}</a>
                            ) : (
                              <Link {...tools.getUrlProduct(product)}>
                                <a className="text-black">{t("read_more")}</a>
                              </Link>
                            )
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>

      <Modal className="modal-cart" centered show={showLogin} onHide={handleCloseLogin} size="xl">
        <Modal.Header closeButton>
          <div>
            <Modal.Title className="d-flex">{t("login")}</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <LoginLayout loginBy="modal" closeModal={handleCloseLogin} isModal={true} />
        </Modal.Body>
      </Modal>
    </>
  )
})
const CardL = withTranslation(['card'])(_CardL)
export { CardL };
