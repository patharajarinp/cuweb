import classnames from "classnames";
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Rating from 'react-rating';
import { Button, Fade } from 'reactstrap';
import Add_address from '../../../components/mobile/chose-address';
import NavbarProductDetail from '../../../components/mobile/NavbarProductDetail';
import ProductSlick from '../../../components/mobile/Product-slick';
import Allreview from '../../../components/mobile/reviews';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import AuthService from '../../../utils/AuthService';
import { i18n, withTranslation, Link, Router } from '../../../utils/i18n';
import tools from '../../../utils/tools';
import Head from 'next/head'
import Cookies from 'js-cookie';
import ModalPromotion from '../../../components/mobile/product/ModalPromotion';
import ProductAlsoBuy from '../../../components/mobile/product/ProductAlsoBuy'
import RelatedProduct from '../../../components/mobile/product/RelatedProduct'
import BreadcrumbMB from "../../../components/mobile/BreadcrumbMB";
import NavbarCustom from "../../../components/mobile/NavbarCustom";
import Navbar from '../../../components/mobile/layout/Navbar';
const MobileDetail = (props) => {
  const { t } = props;

  const [show, setShow] = useState(false);
  const toggle = () => { setShow(!show) };
  const [show2, setShow2] = useState(false);
  const toggle2 = () => { setShow2(!show2) };
  const [dropdownInfo, setdropdownInfo] = useState(false);
  const [addToCart, setaddToCart] = useState(false);
  const [buyimmediately, setbuyimmediately] = useState(false);
  const [selected, setSelectedAddress] = useState(0);
  const toggledropdownInfo = () => setdropdownInfo(!dropdownInfo);
  // const toggleaddToCart = () => {

  // };
  const togglebuyimmediately = () => setbuyimmediately(!buyimmediately);

  const oncloseAll = () => {

    setToCart(0);
    setaddToCart(false);
    setbuyimmediately(false);
  }

  const [product, setProduct] = useState(props.product);
  const [img, setImg] = useState('/images/book.png');
  const { user, handleCart, fetchUser, onSocket, local, setLocal } = useContext(UserContext);
  const [review, setReview] = useState();
  const [reviewAll, setReviewAll] = useState();
  const [reviewscore, setReviewscore] = useState();
  const [reviewsavg, setReviewAVG] = useState();
  const [avg, setAVG] = useState(0);
  const [bookimg, setBookimg] = useState();
  const [allProducts, setAllProducts] = useState(0);
  const [localAddress, setLocalAddress] = useState(0);
  const [stateID, setStateID] = useState(0);
  const [amount, setAmount] = useState(1);
  const [news, setNews] = useState();
  const [ToCart, setToCart] = useState();

  const urlData = tools.getUrlProduct(product);


  const router = useRouter()
  const product_id = router.query.product_id;
  const fetchProductOne = () => {
    // api.getProductOne(product_id)
    //   .then(res => {
    //     const data = res.data;
    const data = props.product;
    if (!data) return;
    setProduct(data);
    var namepath = data.picture;
    if (!namepath) {
      return;
    }
    var [path, link] = namepath.split("watch?v=");
    if (link) {
      setYoutube('https://www.youtube.com/embed/' + link);
    }
    // ;
    setImg(data.picture ? data.picture : '/mobile/images/book.png');
    if (!Cookies.get('AcceptCookie'))
      return;

    var temp = Cookies.get('interests') ? [...JSON.parse(Cookies.get('interests'))] : [];

    if (data.id && temp.findIndex((t) => t == parseInt(data.id)) == -1)
      temp.push(parseInt(data.id))

    if (temp && Array.isArray(temp) && temp?.length > 10) {
      temp.splice(0, 1)
    }
    Cookies.set('interests', JSON.stringify(temp));

    var temp = Cookies.get('ints_category') ? [...JSON.parse(Cookies.get('ints_category'))] : [];
    if (data.cate_id && temp.findIndex((t) => t == parseInt(data.cate_id)) == -1)
      temp.push(parseInt(data.cate_id))

    if (temp && Array.isArray(temp) && temp?.length > 3) {
      temp.splice(0, 1)
    }

    Cookies.set('ints_category', JSON.stringify(temp));


    // })
    // .catch(err => {
    //   console.log(err.response);
    // })
  };
  const fetchImg = () => {
    api.getProductImg(product_id).then(res => {
      const data = res.data;
      setBookimg(data);
      // ;
    })
      .catch(err => {
        console.log(err.response);
      })
  };

  const fetchProducts = (params) => {
    params.limit = params.limit || 4;
    api.getProducts(params).then(res => {
      const data = res.data;
      setAllProducts(data);

    })
      .catch(err => {
        console.log(err.response);
      })
  };

  const getReview = () => {
    var limit = 2;
    api.getProductReview(product_id, { limit, status: 2 }).then(res => {
      const data = res.data;
      setReview(data);
      // ;
    })
      .catch(err => {
        console.log(err.response);
      })
  }
  const getReviewAll = () => {
    api.getProductReview(product_id, { status: 2 }).then(res => {
      const data = res.data;
      setReviewAll(data);
      // ;
    })
      .catch(err => {
        console.log(err.response);
      })
  }
  useEffect(() => {
    if (!review) {
      return;
    }
    if (review?.rating?.length > 0) {
      var rate = { r1: 0, r2: 0, r3: 0, r4: 0, r5: 0 };
      var rateavg = { a1: 0, a2: 0, a3: 0, a4: 0, a5: 0 };
      var sum = 0;
      review.rating.forEach(val => {
        if (val.rating == 5) {
          rate.r5 = val.total;
          rateavg.a5 = (val.total / review.count) * 100;
        }
        if (val.rating == 4) {
          rate.r4 = val.total;
          rateavg.a4 = (val.total / review.count) * 100;
        }
        if (val.rating == 3) {
          rate.r3 = val.total;
          rateavg.a3 = (val.total / review.count) * 100;
        }
        if (val.rating == 2) {
          rate.r2 = val.total;
          rateavg.a2 = (val.total / review.count) * 100;
        }
        if (val.rating == 1) {
          rate.r1 = val.total;
          rateavg.a1 = (val.total / review.count) * 100;
        }
        sum += val.rating * val.total;
      });
      sum = sum / review.count;
      var show = sum.toFixed(1);
      if (sum == '5.0') {
        show = '5';
      }
      setReviewscore(rate);
      setReviewAVG(rateavg);
      setAVG(show);
    }

  }, [review]);

  const fetchNews = () => {
    api.getNews({ cate_key: 'news', limit: 4 }).then(res => {
      const data = res.data;
      // ;
      setNews(data);
    })
      .catch(err => {
        console.log(err.response);
      })
  };
  const [also, setAlso] = useState();
  const fetchAlsoProduct = () => {
    api.getAlsoProduct(product_id, { limit: 12 }).then(res => {
      const data = res.data;
      setAlso(data);
    })
      .catch(err => {
        console.log(err.response);
      })
  }

  useEffect(() => {
    document.body.style.backgroundColor = "#F2F2F2";
    fetchProductOne()
    fetchImg();
    fetchProducts({});
    getReview();
    getReviewAll();
    fetchNews();
    fetchAlsoProduct();
    if (amount != 1) setAmount(1);
    // getOptionAddress(myData);
  }, [product_id, props.product]);

  const addcart = (event, id) => {
    event.persist();

    if (!amount) return;

    if (AuthService.isLoggin()) {
      if (!user) return;
      if (user?.cart?.length) {
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
      if (addToCart == false) {
        api.addCart({ product_id: id, quantity: amount, type: 1 })
          .then(res => {

            const data = res.data;
            fetchUser();
          })
          .catch(err => {
            // if (err.response.data.code == 1211) {
            //   alert('{t("out_of_stock")}');
            // }
            console.log(err);
          })
        setaddToCart(true)
      } else {
        setaddToCart(false)
      }
    } else {
      const path = window.location.pathname
      Router.push(`/login?redirect=${path}`)
    }
  }

  const addFavorite = (e, product_id) => {
    e.preventDefault()
    if (AuthService.isLoggin()) {
      const id = AuthService.getProfile().id;
      api.addOrdeleteFav(id, { product_id })
        .then(res => {
          const data = res.data;
          fetchUser();
          // ;
        })
        .catch(err => {
          console.log(err.response);
        })
    } else {
      const path = window.location.pathname
      Router.push(`/login?redirect=${path}`)
    }
  }

  const isFavorite = () => {
    if (!user || !product) {
      return false;
    }

    if (user?.favorites?.length == 0) {
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

  const currencyFormatDE = (num) => {
    if (!isNaN(num) && num > 1) {
      num = parseFloat(num);
      return (
        num
          .toFixed(2) // always two decimal digits
          .replace(',', '.') // replace decimal point character with ,
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      ) // use . as a separator
    }
  }

  /*   const formatDate = (date) => {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
  
      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;
      var dataDate = [day, month, year].join('-');
      return dataDate;
    } */

  const handleNumber = (e) => {
    var val = e.target.value;
    if (val === '') {
      setAmount(val);
    }
    else if (val >= 1 && val <= product.stock - product.reserve_stock) {
      setAmount(val);
    }
    // else {
    //   setAmount(1);
    // }
    // console.log(val);
  }

  const handleMinus = () => {
    var tmp = amount;
    var sum = amount - 1;
    if (sum >= 1) {
      setAmount(sum);
    } else {
      setAmount(1);
    }
  }

  const handlePlus = () => {
    if (!product) {
      return;
    }
    var tmp = amount;
    var sum = amount + 1;
    if (sum <= product.stock - product.reserve_stock) {
      setAmount(sum);
    } else {
      setAmount(1);
    }
  }

  useEffect(() => {
    if (stateID) {
      if (!user) return;
      if (user?.cart?.length) {
        var check = user.cart.find((val) => val.product_id == product_id)
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
      api.addCart({ product_id: stateID, quantity: amount, type: 0 })
        .then(res => {
          const data = res.data;
          let cart = { ...product, ...data, type: product.type };
          var address_id = localAddress;
          var shipping_type = 1;
          var cart_id = [data.id];
          var pass = { address_id, shipping_type, cart_id, cart }
          localStorage.setItem('pass', JSON.stringify(pass));
          Router.push('/user/summary');
        })
        .catch(err => {
          if (err.response.data.code == 1211) {
            alert(t("mobile_product_detail:out_of_stock"));
          }
          // console.log(err.response);
        })
    }
  }, [localAddress]);

  const buynow = (event, id) => {
    if (AuthService.isLoggin()) {
      if (!user) {
        return;
      }
      setStateID(id);
      if (user?.addresses?.length > 0) {
        var getarea;
        user.addresses.forEach(item => {
          if (item.default == 1) {
            getarea = item.province_code;
            setLocalAddress(item.id);
          }
        });
      } else {
        setShow(true);
      }
    } else {
      const path = window.location.pathname
      Router.push(`/login?redirect=${path}`)
    }
  }

  const shareData = () => {
    if (!product) {
      return false;
    }
    return {
      title: product.name,
      text: `${t("mobile_product_detail:name_book")} : ${product.name}, ${t("mobile_product_detail:author")} : ${product.author}`,
      url: `https://www.chulabook.com${urlData.as}`,
    }
  }

  const handleShare = (e) => {
    try {
      // console.log(navigator);
      navigator.share(shareData())
    } catch (err) {
      console.log(err);
    }
  }

  const showCount = () => {
    if (!user || user?.cart?.length == 0)
      return ''
    return user?.cart?.length > 9 ? <span>9<span>+</span></span> : <span>{user?.cart?.length}</span>
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
      return <div className="text-stock">{t('mobile_product_detail:soon')}</div>;
    } else if (status == 1) {
      return <div className="text-stock">{t('mobile_product_detail:soon')}</div>;
    } else if (status == 2) {
      return <div className="text-stock">{t('mobile_product_detail:close')}</div>;
    } else if (status == 3) {
      return <div className="text-stock">{t('mobile_product_detail:out_stock')}</div>;
    } else {
      return;
    }
  }

  const seller_link = (name) => {
    return name.replace(/\s/g, '-');
  }

  var detail = '';
  if (product && product.detail_th) {
    detail = product.detail_th.replace(/<[^>]+>/g, '').substring(0, 180);
  }

  const [promotion, setPromotion] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const handlePromotion = (val) => {
    setPromotion(val);
    setShowModal(true);
  }

  const handleCloseMadal = () => {
    setPromotion(false);
    setShowModal(false);
    setCopySuccess('');
  }

  const back = () => {
    Router.back();
  }

  const [promotions, setPromotionStete] = useState(false);

  const fetchPromotion = () => {
    api.getPromotionByProduct({ product_id })
      .then(res => {
        const data = res.data;
        setPromotionStete(data);
      })
      .catch(err => {
        console.log(err);
        console.log(err.response);
      })
  }

  useEffect(() => {
    fetchPromotion();
  }, [product_id])

  const seller_disabled = (product && product.seller_id != 'cu' && (product.seller_approve_status != 1 || product.seller_suspend_status == 1)) ? true : false;
  const changeLanguage = (lang) => {
    setLocal(lang)
    if (i18n.language != lang) {
      i18n.changeLanguage(lang)
    }
  }

  const urlSample = `https://www.elibrarycub.com/Sample_ebook/S_${product.barcode.replace(/^0+|^.*?0+/, "")}.pdf`

  return (
    <>
      {
        !!product && (
          <>
            <NavbarCustom isBurger right={<>
              <div className="d-flex justify-content-between align-items-center ">
                <a className="btn-share mr-1" onClick={(e) => handleShare(e)}>
                  <img className="" src={'/mobile/image/icon/icon-share.svg'} alt={product.name} />
                </a>
                <a className="" onClick={local == 'th' ? () => changeLanguage('en') : () => changeLanguage('th')}>{local == 'th' ? <img src={'/icon/thailand.png'} className="icon-lang-th" alt="ศูนย์หนังสือจุฬาฯ" /> : <img src={'/icon/united-kingdom.png'} className="" alt="ศูนย์หนังสือจุฬาฯ" />}</a>

                {
                  user ? (
                    <Link href="/user/cart">
                      <a className="btn-cart img-cart">
                        <img className="" src={'/mobile/image/icon/icon-cart.svg'} alt={product.name} />{showCount()}
                      </a>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <a className="btn-cart">
                        <img className="" src={'/mobile/image/icon/icon-cart.svg'} alt={product.name} />
                      </a>
                    </Link>
                  )
                }
              </div>

            </>} isLang={false}
            />
            <Navbar />
            {
              product && (
                <>



                  <BreadcrumbMB
                    item={[
                      { text: t('home'), href: '/', as: '/' },
                      { text: local === 'th' ? product.category_main_th : product.category_main_en },
                      { text: product.name, active: true }
                    ]}
                  />

                  <NavbarProductDetail />
                  <div className="show-product" id="show_product">
                    <ProductSlick product={product} bookimg={bookimg} checkDate={checkDate} showText={showText} t={t} />
                  </div>
                  <div className="product-content-detail container py-3">
                    <div className="d-flex justify-content-between">
                      <div className="product-price-area">
                        <p className={classnames("product-price detail-h2", { "text-ebook": (product.type == "ebook"), "text-stationery": (product.type == "non_book"), "text-course": (product.type == "course") })}> {product.price ? '฿ ' + currencyFormatDE(product.price) : 'Free'}</p>
                        {
                          product.type != "ebook" ? (
                            <div className="d-flex">
                              {
                                product.cover_price > product.price ? (
                                  <p className="text-disable mr-2 detail-h4"><s><span>฿</span> {currencyFormatDE(product.cover_price)}</s></p>
                                ) : (
                                  <p className="text-disable mr-2 detail-h4"><span>฿</span> {currencyFormatDE(product.cover_price)}</p>
                                )
                              }
                              <p className="detail-h4">-{parseInt(100 - ((product.price / product.cover_price) * 100))}%</p>
                            </div>
                          ) : ''
                        }

                      </div>

                      {
                        user && (
                          <div className="product-like text-center">
                            {
                              isFavorite() ? (
                                <a className="" onClick={(e) => { addFavorite(e, product ? product.id : '') }}>
                                  <img src={'/mobile/image/icon/icon-fav.svg'} className=" img-fluid m-auto" alt="ศูนย์หนังสือจุฬาฯ" />
                                  <p className="text-center p-12">{t("mobile_translations:already_liked")}</p>
                                </a>
                              ) : (
                                <a className="" onClick={(e) => { addFavorite(e, product ? product.id : '') }}>
                                  <img src={'/mobile/image/icon/icon-unfav.svg'} className=" img-fluid m-auto" alt="ศูนย์หนังสือจุฬาฯ" />
                                  <p className="text-center p-12">{t("mobile_translations:like")}</p>
                                </a>
                              )
                            }

                          </div>
                        )
                      }
                      {
                        !user && (
                          <div className="product-like text-center">
                            <a className="" onClick={(e) => { addFavorite(e, product ? product.id : '') }}>
                              <img src={'/mobile/image/icon/icon-unfav.svg'} className=" img-fluid m-auto" alt="ศูนย์หนังสือจุฬาฯ" />
                              <p className="text-center p-12">{t("mobile_translations:like")}</p>
                            </a>
                          </div>
                        )
                      }


                    </div>
                    {
                      (promotions && promotions?.length > 0) ? (
                        <div className="mb-2">
                          <p className="mb-1">
                            <span className="p-medium text-default mr-2">คูปองที่ใช้ได้</span>
                            <span className="font-12 text-danger">(กรอกโค้ดในขั้นตอนการจ่ายเงินเพื่อรับส่วนลดเพิ่มเติม)</span>
                          </p>
                          <div>
                            {
                              promotions.map((val, index) => (
                                <div className="coupon cu-pointer mb-2" key={index}>
                                  <span id="tagTooltip_Super_Best_Deal_01" onClick={() => handlePromotion(val)}>{val.promotion_name}</span>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      ) : null
                    }
                    <h1 className="mb-1 detail-h2">{product.name ? product.name : product.name}</h1>
                    <p className="text-color-author font-weight-normal mb-0">{(product.type == 'book' || product.type == 'ebook') ? (product.author ? `${t("mobile_product_detail:author")} :  ${product.author}` : product.author) : ''}</p>
                    <div className="d-flex">
                      <p className="p-12 text-black">{avg ? avg : '0'} / 5</p>
                      <div className="star-rank ml-1 magin-top-4">
                        <Rating
                          emptySymbol="far fa-star font-star"
                          fullSymbol="fas fa-star font-star"
                          fractions={10}
                          initialRating={avg ? avg : '0'}
                          readonly="true"
                        />
                      </div>
                      {
                        product.stock - product.reserve_stock > 0 ? (
                          <>
                            <p className="p-12 mx-2 text-disable">|</p>
                            <p className="p-12 text-black">{t("mobile_product_detail:have_all_products")} {product.stock - product.reserve_stock} {t("mobile_product_detail:piece")}</p>
                          </>
                        ) : null
                      }
                    </div>
                    <hr className="mt-0 product-content-line"></hr>
                    <div className="d-flex flex-wrap">
                      <p className="mb-0 mr-1 tag">TAGS :</p>
                      <Link {...tools.getUrlCategory(product, 1)} >
                        <a><Button className="tag-type mb-2">{product.category_main_th}</Button></a>
                      </Link>
                      <Link {...tools.getUrlCategory(product, 2)} >
                        <a><Button className="tag-type mb-2 ">{product.category_sub_th}</Button></a>
                      </Link>
                      {
                        product.cate_id && (
                          <Link {...tools.getUrlCategory(product, 3)} >
                            <a><Button className="tag-type mb-2">{product.category_name_th}</Button></a>
                          </Link>
                        )
                      }
                    </div>

                  </div>
                  <div className="detail-social d-flex justify-content-center  text-align-center" >
                    <p className="font-weight-bold mr-3" >สามารถสอบถามเพิ่มเติมสินค้าหรือสั่งไซส์/สี ได้ที่นี่</p>
                    <a href="https://lin.ee/6IqgNJw" target="_blank"><img src={`${api.frontend_url}/icon/d-line.svg`} alt="line" /></a>
                  </div>
                  <div className="product-background-area">
                    {
                      product.type == "course" ? (
                        product.course_id != "" ? (
                          <div className="bg-white container py-3" id="detail_product">
                            <h2 className="mb-1 text-h2">{`ข้อมูลคอร์สออนไลน์`}</h2>
                            <div class="iframe-content">
                              <iframe src={`${api.course_url}/iframe/courses/${product.course_id}`} class="codex-iframe"></iframe>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white container py-3" id="detail_product">
                            <h2 className="mb-1 text-h2">{t("mobile_product_detail:book_info")}</h2>
                            {
                              product.seller_id != 'cu' ? '' : (
                                <p className="product-info-list">Barcode : {product.barcode}</p>
                              )
                            }

                            {
                              product.type == 'book' ? (
                                <>
                                  {
                                    product.seller_id != 'cu' ? '' : (
                                      <p className="product-info-list">ISBN : {product.isbn}</p>
                                    )
                                  }
                                  <p className="product-info-list">{t("mobile_product_detail:year_of_print")} : {product.edition} / {product.pub_year}</p>
                                  <p className="product-info-list">{t("mobile_product_detail:size")} ( w x h ) : {product.width} x {product?.length} mm.</p>
                                  <p className="product-info-list">{t("mobile_product_detail:number_of_pages")} : {product.pages} {t("mobile_product_detail:page")}</p>
                                  <p className="product-info-list">{t("mobile_product_detail:book_category")} : {product.category_name_th}</p>
                                </>
                              ) : ''
                            }


                            <hr className="mt-0 product-content-line"></hr>
                            <h2 className="mb-1 text-h2">{t("mobile_product_detail:book_details")} :</h2>
                            <span className="text-h2 font-size-16px">{product.name}</span>
                            {
                              product && <div className="show-editor ck ck-content"><p className="" dangerouslySetInnerHTML={{ __html: ((!product.detail_th || product.detail_th == 'undefined') ? '' : product.detail_th) }} /></div>
                            }
                          </div>
                        )
                      ) : (
                        <div className="bg-white container py-3" id="detail_product">
                          <h2 className="mb-1 text-h2">{t("mobile_product_detail:book_info")}</h2>
                          {
                            product.seller_id != 'cu' ? '' : (
                              <p className="product-info-list">Barcode test: {product.barcode} </p>
                            )
                          }

                          {
                            product.type == 'book' ? (
                              <>
                                {
                                  product.seller_id != 'cu' ? '' : (
                                    <p className="product-info-list">ISBN : {product.isbn}</p>
                                  )
                                }
                                <p className="product-info-list">{t("mobile_product_detail:year_of_print")} : {product.edition} / {product.pub_year}</p>
                                <p className="product-info-list">{t("mobile_product_detail:size")} ( w x h ) : {product.width} x {product?.length} mm.</p>
                                <p className="product-info-list">{t("mobile_product_detail:number_of_pages")} : {product.pages} {t("mobile_product_detail:page")}</p>
                                <p className="product-info-list">{t("mobile_product_detail:book_category")} : {product.category_name_th}</p>
                              </>
                            ) : ''
                          }

                          {
                            product.type === 'ebook' ? (

                              <>
                                {
                                  product.seller_id != 'cu' ? '' : (
                                    <p className="product-info-list">ISBN : {product.isbn}</p>
                                  )
                                }
                              </>
                            ) : ''
                          }



                          <hr className="mt-0 product-content-line"></hr>
                          <h2 className="mb-1 text-h2">{t("mobile_product_detail:book_details")} :</h2>
                          <span className="text-h2 font-size-16px">{product.name}</span>
                          {
                            product && <div className="show-editor ck ck-content"> <p dangerouslySetInnerHTML={{ __html: ((!product.detail_th || product.detail_th == 'undefined') ? '' : product.detail_th) }} /> </div>
                          }
                        </div>
                      )
                    }

                    {
                      product.type = 'ebook' ? (
                        <div className={classnames("d-flex justify-content-center mt-3 btn-ebook", { "btn-ebook": (product.type === "ebook") })} style={{ maxWidth: "240px" }}>
                          <a href={urlSample} target="_blank">ทดลองอ่าน</a>
                        </div>
                      ) : (<></>)
                    }

                  </div>

                  {
                    product.seller_id != 'cu' && (
                      <div className="product-background-area ">
                        <div className="container bg-white  py-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <img src={product.seller_picture ? product.seller_picture : `/icon/cu-icon.svg`} alt="icon seller" className="icon-seller" />
                              <p className="p-medium mb-0 ml-4">{product.shop_name}</p>
                            </div>
                            <div>
                              {
                                product.shop_name ? (
                                  <Link href={`/seller/[seller_name]?seller_name=${seller_link(product.shop_name)}`} as={`/seller/${seller_link(product.shop_name)}`}>
                                    <a><button className="btn btn-outline-primary-seller">{t('mobile_product_detail:view_shop')}</button></a>
                                  </Link>
                                ) : (
                                  <Link href={'/'}>
                                    <a><button className="btn btn-outline-primary-seller">{t('mobile_product_detail:view_shop')}</button></a>
                                  </Link>
                                )
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </>
              )
            }

            <div className="product-background-area ">
              <div className="container bg-white  py-3" id="review_product">
                <a className="d-flex justify-content-between">
                  <div className="mb-3">
                    <h2 className="text-h2 font-size-16px">{t("mobile_translations:review_score")} ({review ? review.count : '0'})</h2>
                    <div className="d-flex">
                      <span className="my-auto mt-auto text-black mr-1 text-h2">{avg ? avg : '0'}</span>
                      <p className=" my-auto mr-1">/ 5</p>
                      <div className="star-rank-review my-auto ml-1">
                        <Rating
                          emptySymbol="far fa-star font-star"
                          fullSymbol="fas fa-star font-star"
                          fractions={10}
                          initialRating={avg ? avg : '0'}
                          readonly="true"
                        />
                      </div>
                    </div>
                  </div>
                  <i className="fas fa-chevron-right arrow-right" onClick={toggle2}></i>
                </a>
                {
                  review ? review.rows.map((val, index) => (
                    <React.Fragment key={val.id}>
                      <hr className="mt-0 product-content-line" key={val.id}></hr>
                      <div className="review-list">
                        <div className="review-list-info">
                          <div className="review-list-user">
                            <img src={val.user.picture ? val.user.picture : "/mobile/image/icon/icon-user.svg"} className="img-circle img-fluid  mr-2" alt="ศูนย์หนังสือจุฬาฯ" />
                            <div className="my-auto">
                              <p className="text-truncate mb-0">{val.user.firstname}</p>
                              <div className="star-rank">
                                <Rating
                                  emptySymbol="far fa-star font-star"
                                  fullSymbol="fas fa-star font-star"
                                  fractions={1}
                                  initialRating={val.rating}
                                  readonly="true"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="review-date">
                            <p>{tools.formatDate(val.createdAt)}</p>
                          </div>
                        </div>
                        <div className="review-content my-3">
                          <p className="m-0">{val.review_text}</p>
                          {
                            val.image && (
                              <div className="position-relative">
                                <div className="review-img-upload">
                                  <img src={val.image} className="img-middle" alt="ศูนย์หนังสือจุฬาฯ" />
                                </div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </React.Fragment>
                  )) : ''
                }
              </div>
            </div>

            {/* {
              !!product && !!product.sub_id && (
                <RelatedProduct t={t} product_id={product_id} author={product.author} sub_id={product.sub_id}   />
            )} 

            <ProductAlsoBuy t={t} product_id={product_id} /> */}

            {
              (props.product_related && props.product_related.length > 0) && (
                <RelatedProduct
                  t={t} product_id={product_id}
                  author={product.author} sub_id={product.sub_id}
                  data={props.product_related}
                />
              )
            }


            {
              (props.product_also && props.product_also.length > 0) && (
                <ProductAlsoBuy
                  t={t} product_id={product_id}
                  data={props.product_also}
                />
              )
            }


            <div className="footer-space"></div>


            <div className="product-nav-main">
              <Fade in={addToCart} className="add-cart-alert">
                <div className="container d-flex justify-content-center">
                  <span className="my-auto text-h2 font-size-16px text-center text-white">{t("mobile_product_detail:added_to_cart")}</span>
                </div>

              </Fade>
              <Fade in={buyimmediately} className="buyimmediately ">
                {
                  product && (
                    <>
                      <div className="container">
                        <a className="btn-close" onClick={oncloseAll}></a>
                        <h3 className="text-center text-black mb-4">{t("mobile_product_detail:product_options")}</h3>
                        <div className="product_add_to_buy mb-3">
                          <div className="book-image-area-for-buy col-3">
                            <img className="img-fluid m-auto shadow-book" src={product.picture ? product.picture : '/mobile/image/product/book.png'} alt="ศูนย์หนังสือจุฬาฯ" />
                          </div>
                          <div className="col-9">
                            <h2 className="text-black text-h2 mb-0">{product.name}</h2>
                            <h2 className="text-author text-h2">{(product.type == 'book' || product.type == 'ebook') ? (product.author ? `${t("mobile_product_detail:author")} :  ${product.author}` : product.author) : ''}</h2>
                            <h2 className={classnames("text-pink mb-0 text-h2", { "text-ebook": (product.type == "ebook"), "text-stationery": (product.type == "non_book"), "text-course": (product.type == "course") })}> {product.price ? '฿ ' + currencyFormatDE(product.price) : 'Free'}</h2>
                            {
                              product.type != "ebook" ? (
                                <div className="d-flex">
                                  <h5 className="text-disable mr-2"><s> ฿ {currencyFormatDE(product.cover_price)}</s></h5>
                                  <h5 className="">-{parseInt(100 - ((product.price / product.cover_price) * 100))}%</h5>
                                </div>
                              ) : ''
                            }

                          </div>
                        </div>

                      </div>
                      <div className="add-on-product  container">
                        <h4 className="my-auto">{t("mobile_product_detail:quantity")}</h4>
                        <div className="my-auto d-flex">
                          <div className="input-group new-btn-cart">
                            <input type="button" className="btn-minus" onClick={handleMinus} defaultValue="-" disabled={amount == 1} />
                            <input type="text" className="text-number" maxLength="5" value={amount} onChange={handleNumber} pattern="[0-9]*" disabled={product.type == "ebook" || product.type == 'course'} name="quantity" />
                            <input type="button" className="btn-plus" onClick={handlePlus} defaultValue="+" disabled={amount >= (product.stock - product.reserve_stock)} />
                          </div>
                        </div>
                      </div>
                      {
                        ToCart == 1 && (
                          <a onClick={(event) => { addcart(event, product.id), setbuyimmediately(!buyimmediately), setaddToCart(true) }}>
                            <div className={classnames("btn-pink-submit", { "ebook": (product.type == "ebook"), "stationery": (product.type == "non_book") })}>
                              <h2 className="text-white m-auto text-h2">{t("mobile_translations:confirm")}</h2>
                            </div>
                          </a>
                        )
                      }
                      {
                        ToCart == 2 && (
                          <a onClick={(event) => { buynow(event, product.id), setbuyimmediately(!buyimmediately), setaddToCart(false) }}>
                            <div className={classnames("btn-pink-submit", { "ebook": (product.type == "ebook"), "stationery": (product.type == "non_book") })}>
                              <h2 className="text-white m-auto text-h2">{t("mobile_translations:confirm")}</h2>
                            </div>
                          </a>
                        )
                      }
                    </>
                  )
                }
              </Fade>

              {
                (
                  product.comming === 'Y' ? (
                    <>
                      <div className={classnames("btn-add-cart product-nav-main-btn product-book disable")} >
                        <h4> {t("mobile_product_detail:add_to_cart")}</h4>
                      </div>
                      <div className={classnames("btn-buy product-nav-main-btn product-book disable")} >
                        <h4 className="text-white">{t("mobile_product_detail:buynow")}</h4>
                      </div>
                    </>
                  ) : product && product.preorder) ? (
                  <>
                    {
                      product.preorder_amount > 0 ? (
                        <>
                          {
                            checkDate(product) == 4 ? (
                              <>
                                <a className={classnames("btn-add-cart product-nav-main-btn product-book", { "ebook": (product.type == "ebook"), "stationery": (product.type == "non_book"), "course": (product.type == "course") })} onClick={(event) => { setbuyimmediately(!buyimmediately), setToCart(1) }}>
                                  <h4> {t("mobile_product_detail:add_to_cart")}</h4>
                                </a>
                                <a className={classnames("btn-buy product-nav-main-btn product-book", { "ebook": (product.type == "ebook"), "stationery": (product.type == "non_book"), "course": (product.type == "course") })} onClick={(event) => { setbuyimmediately(!buyimmediately), setToCart(2) }}>
                                  <h4 className="text-white">{t("mobile_product_detail:buynow")}</h4>
                                </a>
                              </>
                            ) : (
                              <>
                                <div className={classnames("btn-add-cart product-nav-main-btn product-book disable")} >
                                  <h4> {t("mobile_product_detail:add_to_cart")}</h4>
                                </div>
                                <div className={classnames("btn-buy product-nav-main-btn product-book disable")} >
                                  <h4 className="text-white">{t("mobile_product_detail:buynow")}</h4>
                                </div>
                              </>
                            )
                          }

                        </>
                      )
                        :
                        (
                          <>
                            <div className={classnames("btn-add-cart product-nav-main-btn product-book disable")} >
                              <h4> {t("mobile_product_detail:add_to_cart")}</h4>
                            </div>
                            <div className={classnames("btn-buy product-nav-main-btn product-book disable")} >
                              <h4 className="text-white">{t("mobile_product_detail:buynow")}</h4>
                            </div>
                          </>
                        )
                    }
                  </>
                ) : (
                  <>
                    {
                      ((product && product.enable == 1 && (((product.stock && product.stock > product.reserve_stock)) || product.type == "ebook" || product.type == 'course')) && !seller_disabled) ? (
                        <>
                          <a className={classnames("btn-add-cart product-nav-main-btn product-book", { "ebook": (product.type == "ebook"), "stationery": (product.type == "non_book"), "course": (product.type == "course") })} onClick={(event) => { setbuyimmediately(!buyimmediately), setToCart(1) }}>
                            <span className="text-h4"> {t("mobile_product_detail:add_to_cart")}</span>
                          </a>
                          <a className={classnames("btn-buy product-nav-main-btn product-book", { "ebook": (product.type == "ebook"), "stationery": (product.type == "non_book"), "course": (product.type == "course") })} onClick={(event) => { setbuyimmediately(!buyimmediately), setToCart(2) }}>
                            <span className="text-white text-h4">{t("mobile_product_detail:buynow")}</span>
                          </a>
                        </>
                      ) : (
                        <>
                          <div className={classnames("btn-add-cart product-nav-main-btn product-book disable")} >
                            <span className="text-h4"> {t("mobile_product_detail:add_to_cart")}</span>
                          </div>
                          <div className={classnames("btn-buy product-nav-main-btn product-book disable")} >
                            <span className="text-white text-h4">{t("mobile_product_detail:buynow")}</span>
                          </div>
                        </>
                      )
                    }
                  </>
                )
              }


            </div>
            <ModalPromotion t={t} promotion={promotion} showModal={showModal} handleCloseMadal={handleCloseMadal}
              setCopySuccess={setCopySuccess} copySuccess={copySuccess} shop_name={product.shop_name} />
            <Allreview show2={show2} review={reviewAll} toggle2={toggle2} avg={avg} formatDate={tools.formatDate} product={product} t={t} />
            {
              user && (
                <Add_address show={show} user={user} toggle={toggle} selected={selected} setSelectedAddress={setSelectedAddress} />
              )
            }

          </>
        )
      }
    </>
  )
}

export default MobileDetail