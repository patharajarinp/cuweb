import React, { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import classNames from 'classnames';
import { Router, Link, withTranslation } from '../../../utils/i18n'
import withAuth from '../../../utils/withAuth'
import api from '../../../utils/api';
import Sidenav from '../../../components/user/sidenav'
import AuthService from '../../../utils/AuthService'
import tools from '../../../utils/tools'
import ConfirmDialog from '../../../components/ConfirmDialog'
import UserContext from '../../../contexts/UserContext';

const MainFav = (props) => {
  const { t } = props;
  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const [ref_id, setRef_id] = useState();
  const { user, handleCart, fetchUser } = useContext(UserContext);
  const [order, setOrder] = useState();
  const [check, setReview] = useState();
  const [sidenav, setSidenav] = useState(true);
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


  const delFav = (product_id) => {
    setRef_id(product_id);
    setModalShow(true);
  }

  const onConfirm = (ref_id) => {
    var product_id = ref_id;
    const id = AuthService.getProfile().id;
    api.addOrdeleteFav(id, { product_id })
      .then(res => {
        const data = res.data;
        fetchFav();
        fetchUser();
      })
      .catch(err => {
        console.log(err.response);
      })
  }

  const handleError = (error) => {
    console.log(error);
  }

  const addcart = (event, id) => {
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
    api.addCart({ product_id: id, quantity: 1 })
      .then(res => {
        const data = res.data;
        ;
        fetchUser();
      })
      .catch(err => {
        if (err.response.data.code == 1211) {
          alert(t('out_of_stock'));
        }
        console.log(err.response);
      })
  }

  const getYoutube = (val) => {
    var namepath = val;
    if (namepath) {
      var [path, link] = namepath.split("watch?v=");
      if (link) {
        return 'https://www.youtube.com/embed/' + link + '?autoplay=0&controls=0';
      }
    }
  }

  useEffect(() => {
    if (document.getElementsByClassName('main-layout')[0]) {
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  }, []);

  const checkSellerDisabled = (product) => {
    var seller_disabled = (product && product.seller_id != 'cu' && (product.seller_approve_status != 1 || product.seller_suspend_status == 1)) ? true : false;
    return seller_disabled;
  }

  return (
    <>
      <Sidenav user={user} menuToggle={sidenav} page="favorite" >
        <div className="show-profile h-100" id="show-profile">
          <div className="box-main-account">
            <div className="row mx-0 px-0">
              <div className="col-12 pl-0">
                <div className="mt-2 mb-4">
                  <h6 className="text-black">{t('my_wishlist')}</h6>
                </div>
                {/* <div className="main">
                  <h4 className="">{t('my_wishlist')} </h4>
                </div> */}
              </div>
            </div>
            <div className="row mx-0 px-0">
              <div className="col-12 px-0">
                <div className="">
                  {
                    (fav && fav.length) ? fav.map((val, index) => (
                      <div className="order-products" key={val.id}>
                        <div className="p-3">
                          <div className="row products d-flex align-items-center justify-content-between">
                            <div className="col-2">
                              <div className="img-detail">
                                {
                                  (val.video_type == 0 || val.video_type == null) && (
                                    <img src={val.picture ? val.picture : '/images/book.png'} className="mh-100" />
                                  )
                                }
                                {
                                  (val.video_type == 1 || val.video_type == 2) && (
                                    <img src={'/images/video.svg'} className="mh-100 video" />
                                  )
                                }
                              </div>
                            </div>
                            <div className="col-7 border-left border-right">
                              <div className="pl-3 text-book-detail">
                                <p className="mb-0 font-weight-bold">{val.name}</p>
                                {
                                  val.type == 'ebook' || val.type == 'course' ? '' : (
                                    <p className="mb-0">{t('author')} : {val.author}</p>
                                  )
                                }
                                <div className="d-flex align-items-center">
                                  <div className={classNames("tag-cat ", { "tag-book": (val.type == 'book'), "tag-stationary": (val.type == 'non_book'), "tag-ebook": (val.type == 'ebook'), "tag-course": (val.type == 'course') })}>{(val.type == 'book') ? t('header:book_menu') : val.type == 'non_book' ? t('header:stationary') : val.type == 'ebook' ? t('header:e_book') : val.type == 'course' && t('header:course_online')}</div>
                                  {!!val.is_preorder && <div className={classNames("tag-cat px-3")} style={{ backgroundColor: '#DE5C6E' }}>Preorder</div>}
                                </div>
                                <p className="del-cart" onClick={() => { delFav(val.product_id) }}><i className="fas fa-trash"></i></p>
                              </div>
                              {/* <div className="products-border-left"></div> */}
                            </div>
                            <div className="col-3">
                              <div className="product-main-list">
                                <div className="show-price mt-4">
                                  {
                                    val.type == 'ebook' || val.type == 'course' ? '' : (
                                      <p className="book-amount border-bottom pt-3">{((val.stock) < 0) ? ` ${t('no_stock')} ` : `${t('stock')} : ` + val.stock + ` ${t('in_stock')}`} </p>
                                    )
                                  }
                                  <div className="d-flex justify-content-between align-items-center">
                                    <p className="book-price">{t('price')}</p>
                                    <p className="book-price-num-new">฿ {tools.currencyFormatDE(val.price)}</p>
                                  </div>
                                  <div className="btn-product-group text-center mt-4">
                                    {
                                      val.comming === 'Y' ? (
                                        <button className="btn btn-disabled w-100" disabled>{t('product_detail:comming')}</button>
                                      ) : val.preorder ? (
                                        <>
                                          {
                                            val.preorder_amount > 0 ? (
                                              <button className="btn btn-primary w-100" onClick={(event) => { addcart(event, val.product_id) }}>{t('add_to_cart')}</button>
                                            ) : (
                                              <button className="btn btn-disabled w-100" disabled>{t('out_of_stock')}</button>
                                            )
                                          }
                                        </>
                                      ) : (
                                        <>
                                          {
                                            (((val.stock > val.reserve_stock || val.type == 'ebook' || val.type == 'course') && val.enable == 1) && !checkSellerDisabled(val)) ? (
                                              <button className="btn btn-primary w-100" onClick={(event) => { addcart(event, val.product_id) }}>{t('add_to_cart')}</button>
                                            ) : (
                                              <button className="btn btn-disabled w-100" disabled>{checkSellerDisabled(val) ? t('add_to_cart') : t('out_of_stock')}</button>
                                            )
                                          }
                                        </>
                                      )
                                    }
                                    {/* {
                                      
                                      (val.stock > val.reserve_stock || val.type == 'ebook' || val.type == 'course') ?
                                        <button className="btn btn-primary w-100" onClick={(event) => { addcart(event, val.product_id) }}>{t('add_to_cart')}</button>
                                      : <button className="btn btn-disabled w-100" disabled>{t('out_of_stock')}</button>
                                    } */}
                                    <p className="pt-3 mb-0">
                                      <Link {...tools.getUrlProduct(val)}>
                                        <a>{t('read_more')}</a>
                                      </Link>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) : <>
                      <div className="col-12 row align-items-center">
                        <div className="col-4 "></div>
                        <div className="col-4 no-favorite text-center">
                          <img src="/images/not-cart.svg" alt="ศูนย์หนังสือจุฬาฯ" className="img-fluid" />
                          <h3 className="text-pink my-3">{t('there_are_no_favorites_yet')}</h3>
                          <Link href='/'>
                            <button className="btn btn-primary my-3">{t('continue_shopping')}</button>
                          </Link>
                        </div>
                        <div className="col-4"></div>
                      </div>
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <ConfirmDialog show={modalShow}
          text={`${t('do_you_confirm_to_delete')} ?`}
          onConfirm={onConfirm}
          size="md" onHide={handleModalClose}
          cancel_btn={true}
          ref_id={ref_id} />

      </Sidenav>
    </>
  )
}

export default MainFav