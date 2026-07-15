import classNames from 'classnames';
// import fetch from 'isomorphic-unfetch';
import Cookies from 'js-cookie';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Modal, ProgressBar } from 'react-bootstrap';
import Rating from 'react-rating';
import {
  FacebookShareButton,
  LineShareButton,
  TwitterShareButton
} from "react-share";
import Slick from "react-slick";
import Layout from '../../components/layout';
import LoginLayout from '../../components/layout/login_layout';
import ProductDetailPH from '../../components/shimmer/ProductDetail';
import { CardGrid } from '../../components/widget/card';
import UserContext from '../../contexts/UserContext';
import myData from '../../public/json/raw_database.json';
import api from '../../utils/api';
import AuthService from '../../utils/AuthService';
import { Link, Router, withTranslation } from "../../utils/i18n";
import tools from '../../utils/tools';
import ModalPromotion from '../../components/product/ModalPromotion';
import ProductAlsoBuy from '../../components/product/ProductAlsoBuy';
import RelatedProduct from '../../components/product/RelatedProduct';
import { PlayIcon } from '../../components/icon/svg';
import DOMPurify from 'dompurify';
import parse from "html-react-parser";
import ReactPlayer from 'react-player'
const MainDetail = (props) => {
  const { t } = props;
  const [product, setProduct] = useState(props.product);
  const [img, setImg] = useState(`${api.frontend_url}/images/book.png`);
  const { user, handleCart, fetchUser, local, setUser } = useContext(UserContext);
  const [review, setReview] = useState();
  const [reviewscore, setReviewscore] = useState();
  const [reviewsavg, setReviewAVG] = useState();
  const [avg, setAVG] = useState(0);
  const [bookimg, setBookimg] = useState();
  const [allProducts, setAllProducts] = useState(0);
  const [localAddress, setLocalAddress] = useState(0);
  const [stateID, setStateID] = useState(0);
  const [amount, setAmount] = useState(1);
  //Address
  const [show, setShow] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };
  const [province, setProvince] = useState();
  const [amphoe, setAmphoe] = useState();
  const [district, setDistrict] = useState();
  const [zipcode, setZipcode] = useState();
  const [also, setAlso] = useState();
  const [promotions, setPromotionStete] = useState(false);

  console.log(product, 'productdddd')
  const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };

  const getOptionAddress = (obj, index = 'กรุงเทพมหานคร') => {
    var prov = groupBy(obj, 'province');
    var amp = groupBy(prov[index], 'amphoe')
    var district = groupBy(amp[Object.keys(amp)[0]], 'district')
    setProvince(prov)
    setAmphoe(amp)
    setDistrict(district)
    setZipcode(groupBy(district[Object.keys(district)[0]], 'zipcode'))
  }

  const onChangeProv = (e) => {
    getOptionAddress(myData, e.target.options[e.target.selectedIndex].text)
  }

  const getOptionAmphoe = (index = 0) => {
    var district = groupBy(amphoe[index], 'district')
    setDistrict(district)
    setZipcode(groupBy(district[Object.keys(district)[0]], 'zipcode'))
  }

  const onChangeAmphoe = (e) => {
    getOptionAmphoe(e.target.options[e.target.selectedIndex].text)
  }
  const getOptionDistrict = (index = 0) => {
    setZipcode(groupBy(district[index], 'zipcode'))
  }

  const onChangeDistrict = (e) => {
    getOptionDistrict(e.target.options[e.target.selectedIndex].text)
  }

  const changetoOffice = () => {
    $('.office').removeClass('d-none');
    $('.office').addClass('d-flex');
    $('.office-required').prop('required', true)
  }
  const changetoHome = () => {
    $('.office').removeClass('d-flex');
    $('.office').addClass('d-none');
    $('.office-required').removeAttr('required')
  }

  const [youtube, setYoutube] = useState(0);
  const [clickImg, setClickImg] = useState(false);

  const handleSave = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const id = AuthService.getProfile().id;
    const jsonData = tools.toJson(data);
    // console.log(jsonData);
    api.insertAddress(id, jsonData)
      .then(res => {
        const data = res.data;
        setLocalAddress(data.id);
        fetchUser();
        setShow(false);
      })
      .catch(err => {
        console.log(err.response);
      })
  }

  const handleLink = (link) => {
    Router.push(link);
  }

  const router = useRouter()
  const product_id = router.query.product_id


  const fetchProductOne = () => {
    const data = props.product;
    if (!data) return;
    setProduct(data);
    setImg(data.picture ? data.picture : '/images/book.png');
    var namepath = data.picture;
    if (!namepath) {
      return;
    }
    var [path, link] = namepath.split("watch?v=");
    if (link) {
      setYoutube('https://www.youtube.com/embed/' + link);
    }


    if (!Cookies.get('AcceptCookie'))
      return;

    var temp = Cookies.get('interests') ? [...JSON.parse(Cookies.get('interests'))] : [];

    if (data.id && temp.findIndex((t) => t == parseInt(data.id)) == -1)
      temp.push(parseInt(data.id))

    if (temp && Array.isArray(temp) && temp.length > 10) {
      temp.splice(0, 1)
    }
    Cookies.set('interests', JSON.stringify(temp));

    var temp = Cookies.get('ints_category') ? [...JSON.parse(Cookies.get('ints_category'))] : [];
    if (data.cate_id && temp.findIndex((t) => t == parseInt(data.cate_id)) == -1)
      temp.push(parseInt(data.cate_id))

    if (temp && Array.isArray(temp) && temp.length > 3) {
      temp.splice(0, 1)
    }

    Cookies.set('ints_category', JSON.stringify(temp));
    // console.log(Cookies.get('ints_category'), 'ints_category')
    // console.log(Cookies.get('interests'), 'interests')
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


  useEffect(() => {
    if (!review) {
      return;
    }
    if (review.rating.length > 0) {
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

  useEffect(() => {
    setBookimg(props.product_img);
  }, [product_id, props.product_img]);
  useEffect(() => {
    setReview(props.product_review);
  }, [product_id, props.product_review]);
  useEffect(() => {
    setAlso(props.product_also);
  }, [product_id, props.product_also]);

  useEffect(() => {
    if (document.getElementsByClassName('main-layout')[0]) {
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
    fetchProductOne()
    fetchProducts({});
    getOptionAddress(myData);
    setisTop(true);
    if (amount != 1) setAmount(1);
  }, [product_id, props.product]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      }
    ]
  };

  const [fileType, setFileType] = useState('image');
  const [mimeType, setMimeType] = useState();
  const handleImg = (pic, type, mimetype) => {
    // console.log('pic',pic);
    // console.log('type',type);
    // console.log('mimetype',mimetype);
    setImg(pic);
    setFileType(type);
    setMimeType(mimetype);
    setClickImg(true)
  }

  const addcart = (event, id) => {

    event.persist();
    if (AuthService.isLoggin()) {

      // console.log(user);
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
      api.addCart({ product_id: id, quantity: amount, type: 1 })
        .then(res => {
          var node = document.createElement('span');

          let top = "top:" + event.pageY + 'px;'
          let left = "left:" + event.pageX + 'px;'

          var cart = document.getElementsByClassName('icon-cart');

          var bodyRect = document.body.getBoundingClientRect(),
            elemRect = cart[0].getBoundingClientRect(),
            offset_top = elemRect.top - bodyRect.top,
            offset_left = elemRect.left - bodyRect.left;

          node.style.cssText = "--top:" + offset_top + "px; --left:" + offset_left + "px; transition: all .6s ease; width:30px; height:30px; background-color:#EE5294; border-radius:50%; display: block; position:absolute; z-index:100; " + top + " " + left;
          document.body.appendChild(node)
          setTimeout(function () {
            node.classList.add('animate')
            setTimeout(function () {
              document.body.removeChild(node)
            }, 800);
          }, 100);

          const data = res.data;
          fetchUser();
        })
        .catch(err => {
          if (err.response.data.code == 1211) {
            alert(t('out_of_stock'));
          }
          console.log(err.response);
        })
    } else {
      setShowLogin(true);
    }
  }

  const addFavorite = (product_id) => {
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
      setShowLogin(true);
    }
  }

  const showReview = () => {
    var elmnt = document.getElementById("scroll-review");
    elmnt.scrollIntoView({ behavior: 'smooth' });
  }

  const isFavorite = () => {
    if (!user || !product) {
      return false;
    }

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

  useEffect(() => {
    if (stateID) {
      // console.log(user);
      if (!user) return;
      if (user.cart.length) {
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
          var shipping_type = 2;
          var cart_id = [data.id];
          var pass = { address_id, shipping_type, cart_id, cart }
          localStorage.setItem('pass', JSON.stringify(pass));
          Router.push('/user/summary');
        })
        .catch(err => {
          if (err.response.data.code == 1211) {
            alert(t('out_of_stock'));
          }
          console.log(err.response);
        })
    }
  }, [localAddress]);


  //console.log('amount',amount)

  const buynow = (id) => {
    if (AuthService.isLoggin()) {
      // console.log(user);
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

      setStateID(id);
      if (user.addresses.length > 0) {
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
      setShowLogin(true);
    }
  }

  const handlePlus = (e) => {
    e.preventDefault();

    var fieldName = $(e.target).data('field');
    var parent = $(e.target).closest('div');
    var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);
    var id = $(e.target).data('id');

    if (!isNaN(currentVal)) {
      parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
      parent.find('input[name=old]').val(currentVal + 1);
      var amount = currentVal + 1;
      setAmount(amount);
    } else {
      parent.find('input[name=' + fieldName + ']').val(1);
    }
  }

  const handleMinus = (e) => {
    e.preventDefault();
    var fieldName = $(e.target).data('field');
    var parent = $(e.target).closest('div');
    var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);
    var id = $(e.target).data('id');

    if (!isNaN(currentVal) && currentVal > 1) {
      parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
      parent.find('input[name=old]').val(currentVal - 1);
      var amount = currentVal - 1;
      setAmount(amount);
    } else {
      parent.find('input[name=' + fieldName + ']').val(1);
    }
  }

  const handleNumber = (e) => {
    e.preventDefault();
    var fieldName = $(e.target).data('field');
    var parent = $(e.target).closest('div');
    var oldVal = parseInt(parent.find('input[name=old]').val(), 10);
    var currentVal = parseInt(parent.find('input[name=quantity]').val(), 10);
    var id = $(e.target).data('id');

    if (!isNaN(currentVal) && currentVal >= 1) {

      var amount = currentVal;
      setAmount(amount);
    } else {

      parent.find('input[name=' + fieldName + ']').val(1);
    }
  }
  const isBoughtEbook = (ebook_id) => {
    if (!user || !ebook_id) return false;
    const { ebooks } = user;
    if (!ebooks) return false;
    const { books } = ebooks;

    let bool = books.includes(ebook_id.toString())

    return bool;
  }
  const [isTop, setisTop] = useState(true);

  const handleScrollChange = useCallback(() => {
    const isTopone = window.scrollY < 600;

    if (isTopone && !isTop) {
      setisTop(true);
    }
    else if (!isTopone && isTop) {
      setisTop(false);
    }

  }, [isTop]);


  useEffect(() => {
    document.addEventListener('scroll', handleScrollChange);
    return function cleanup() {
      document.removeEventListener("scroll", handleScrollChange);
    }
  }, [handleScrollChange])




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


  const seller_link = (name) => {
    return name.replace(/\s/g, '-');
  }

  var detail = '';
  if (product && product.detail_th) {
    detail = product.detail_th.replace(/<[^>]+>/g, '').substring(0, 180);
  }

  const settingscard = {
    dots: false,
    slidesToShow: 4,
    infinite: false,
    touchMove: true,
    arrows: true,
    slidesToScroll: 2
    /* className: "slider variable-width",
    variableWidth: true */
  };
  const settingscardmin = {
    className: "slider variable-width img-slick",
    dots: false,
    slidesToShow: 3,
    infinite: false,
    touchMove: true,
    arrows: true,
    slidesToScroll: 3
    /* className: "slider variable-width",
    variableWidth: true */
  };

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

  const urlData = tools.getUrlProduct(product);

  const seller_disabled = (product && product.seller_id != 'cu' && (product.seller_approve_status != 1 || product.seller_suspend_status == 1)) ? true : false;

  const urlSample = `https://www.elibrarycub.com/Sample_ebook/S_${product.barcode.replace(/^0+|^.*?0+/, "")}.pdf`

  console.log(product)
  console.log(local)

  return (
    <>
      {
        product ? (
          <>
            {
              !product ?
                <ProductDetailPH /> :
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                          <li className="breadcrumb-item">
                            <Link href='/' as={'/'}>
                              <a>{t('home')}</a>
                            </Link>
                          </li>
                          <li className="breadcrumb-item">
                            <a>{product ? (local === 'th' ? product.category_main_th : product.category_main_en) : ''}</a>
                          </li>
                          <li className="breadcrumb-item active">
                            <a>{product ? product.name : ''}</a>
                          </li>
                        </ol>
                      </nav>
                    </div>
                  </div>
                  <div className="row mx-0 justify-content-xl-center">
                    <div className="col-lg-10 col-md-12 px-0">
                      <div className="row">
                        <div className="col-xl-5 col-md-5">
                          {
                            product && (
                              <div className={classNames(fileType != 'image' ? 'video-bg' : '', "detail-img book-shadow text-center", product.preorder ? (checkDate(product) != 4 ? 'set-stock' : '') : (((product.stock && product.stock > product.reserve_stock) || product.type == 'ebook' || product.type == 'course' || product.type == 'course_ecode') ? '' : 'set-stock'))}>
                                {
                                  !clickImg ? (
                                    <>
                                      {
                                        (fileType == 'image') ? (
                                          <>
                                            {
                                              (product && !product.preorder) &&
                                              <div className="c-img h-100 center-img">
                                                <img src={img} className="img-fluid" alt={product.name} />
                                              </div>
                                            }
                                          </>
                                        ) : (
                                          <>
                                            <ReactPlayer url={img} />
                                          </>
                                        )
                                      }
                                    </>
                                  ) : (
                                    <>
                                      {
                                        (fileType == 'image') ? (
                                          <div className="c-img h-100 center-img">
                                            <img src={img} className="img-fluid" alt={product.name} />
                                          </div>
                                        ) : (
                                          <>
                                            <ReactPlayer url={img} />
                                          </>
                                        )
                                      }
                                    </>
                                  )
                                }


                                {
                                  (product && product.preorder) ? (
                                    <>
                                      {
                                        (fileType == 'image') ? (
                                          <div className="c-img h-100 center-img">
                                            <img src={img} className="img-fluid" alt={product.name} />
                                          </div>
                                        ) : (
                                          <video controls className="w-100" key={img} >
                                            <source src={img} type={mimeType} alt={product.name} />
                                          </video>
                                        )
                                      }
                                      <img src={`${api.frontend_url}/icon/pre_order2.svg`} className="img-stock" alt="pro-order" />
                                    </>
                                  ) : (
                                    product.type == 'ebook' ?
                                      <img src={`${api.frontend_url}/icon/ebook2.svg`} className="img-stock" alt="only ebook" />
                                      : product.type == 'course' ?
                                        <img src={`${api.frontend_url}/icon/coursebig.svg`} className="img-stock" alt="only course" />
                                        : product.type == 'course_ecode' ?
                                          <img src={`${api.frontend_url}/icon/badge-course-ecode-big.svg`} className="img-stock w-course-ecode" alt="only course_ecode" />
                                          : ''
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
                                        ((product.stock && product.stock > product.reserve_stock) || product.type == "ebook" || product.type == 'course' || product.type == 'course_ecode' && product.stock != 0) ?
                                          '' : <div className="text-stock">{t('out_stock')}</div>
                                      }
                                    </>
                                  )

                                }

                              </div>
                            )
                          }

                          {
                            product && (
                              <div className="margin-slick mt-3">
                                <Slick {...settings}>
                                  <div className="detail-slide">
                                    <div className={classNames("sub-slide center-img", product ? (product.picture == img ? 'active' : '') : '')} onClick={() => { handleImg(product.picture ? product.picture : '/images/book.png', 'image', '') }}>


                                      <img src={product.picture ? product.picture : `${api.frontend_url}/images/book.png`} className="img-fluid" alt={product.name} />

                                    </div>
                                  </div>
                                  {
                                    bookimg ? bookimg.map((val, index) => (
                                      <div className="detail-slide" key={val.id}>
                                        {
                                          (val.type == 'image') ? (
                                            <div className={classNames("sub-slide center-img", (val.image == img ? 'active' : ''))} onClick={() => { handleImg(val.image ? val.image : '/images/book.png', val.type, val.mimetype) }}>
                                              <img src={val.image ? val.image : `${api.frontend_url}/images/book.png`} className="img-fluid" alt={product && product.name} />
                                            </div>
                                          ) : (

                                            <div className={classNames("sub-slide center-img", (val.urlyoutube == img ? 'active' : ''))} onClick={() => { handleImg(val.urlyoutube ? val.urlyoutube : '/images/book.png', val.type, val.mimetype) }}>
                                              <div className='box-play-video'>
                                                <PlayIcon />
                                                <img src={val.thumbnail ? val.thumbnail : `${api.frontend_url}/images/book.png`} className="img-fluid" alt={product && product.thumbnail} />
                                              </div>

                                            </div>
                                          )
                                        }


                                      </div>
                                    )) : ''
                                  }

                                </Slick>
                              </div>
                            )
                          }

                        </div>
                        <div className="col-xl-1 col-lg-1 d-md-none d-lg-block"></div>
                        <div className="col-lg-6 col-md-7">
                          <div className="detail-name">
                            <h1 className="seo-text">{product && product.name}</h1>
                            <p className="detail-author">{(product.type == 'book' || product.type == 'ebook') ? (product.author ? `${t('author')} : ${product.author}` : '') : ''}</p>
                            <div className="detail-vote">
                              <div className="d-flex align-items-center">
                                <Rating
                                  emptySymbol="far fa-star font-star"
                                  fullSymbol="fas fa-star font-star"
                                  fractions={10}
                                  initialRating={avg ? avg : '0'}
                                  readonly="true"
                                />
                                <a className="ml-2 text-review" onClick={showReview}>{t('read_reviews')}</a>
                                {
                                  isFavorite() ? (
                                    <div>
                                      <img src={`${api.frontend_url}/icon/fav-active.svg`} className="ml-5" onClick={() => { addFavorite(product ? product.id : '') }} alt="fav" />
                                      <a className="ml-2 text-review" onClick={() => { addFavorite(product ? product.id : '') }}>{t('remove_from_favorites')}</a>
                                    </div>
                                  ) : (
                                    <div>
                                      <img src={`${api.frontend_url}/icon/fav-none.svg`} className="ml-5" onClick={() => { addFavorite(product ? product.id : '') }} alt="un-fav" />
                                      <a className="ml-2 text-review" onClick={() => { addFavorite(product ? product.id : '') }}>{t('add_to_favorites')}</a>
                                    </div>
                                  )
                                }
                              </div>

                            </div>
                            {product.type == 'ebook' ?
                              (
                                <p className="mt-4 font-weight-bold">{t('e_book')}</p>
                              )
                              : product.type == 'course' ?
                                (
                                  <>
                                    <p className="mt-4 font-weight-bold mb-0">{t('course_online')}</p>
                                    <p className="font-weight-bold">
                                      {t('other_package')}&nbsp;
                                      <a className="text-course text-underline" target="_blank" href={`${api.course_url}/courses/${product.course_id}`}>{t('click')}</a>
                                    </p>
                                  </>
                                ) : product.type == 'book' ? (
                                  <p className="mt-4 font-weight-bold">{product ? (product.cover_code == 1 ? t('softcover') : t('hardcover')) : ''}</p>
                                ) : <p className="mt-4 font-weight-bold"></p>
                            }
                            <div className="de-price pb-2">
                              <p className={classNames("detail-price mb-0", { "text-ebook": (product.type == 'ebook'), "text-stationery": (product.type == 'non_book'), "text-course": (product.type == 'course'), "text-course-ecode": (product.type == 'course_ecode') })}>  {product.price ? '฿ ' + tools.currencyFormatDE(product.price) : 'Free'}</p>
                              {product && parseFloat(product.cover_price) ?
                                (
                                  <>
                                    {
                                      (product.cover_price > product.price) ? (
                                        <p className="detail-discount mx-5">{tools.currencyFormatDE(product.cover_price)}</p>
                                      ) : (
                                        <p className="detail-discount new mx-5">{tools.currencyFormatDE(product.cover_price)}</p>
                                      )
                                    }

                                    <p className={classNames("detail-save mb-0", { "text-ebook": (product.type == 'ebook'), "text-stationery": (product.type == 'non_book'), "text-course": (product.type == 'course'), "text-course-ecode": (product.type == 'course_ecode') })}>{t('discount')} {product.price && parseInt(100 - ((product.price / product.cover_price) * 100))} %</p>
                                  </>
                                )
                                : ''

                              }




                            </div>

                            {
                              (promotions && promotions.length > 0) ? (
                                <div>
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



                            <div className="mt-3 pb-3">


                              {
                                product.type == 'ebook' ? (
                                  <div className="mt-3">
                                    {isBoughtEbook(product.ebook_id) ?
                                      (
                                        <button type="button" className="btn btn-disabled-detail mr-3" disabled>{t('bought')}</button>
                                      )
                                      : product.enable == 0 ? (
                                        <>
                                          <button type="button" className="btn btn-disabled-detail btn-ebook mr-3" disabled>{t('buynow')}</button>
                                          <button type="button" className="btn btn-disabled-outline-detail " disabled>{t('add_to_cart')}</button>
                                        </>
                                      ) :
                                        (
                                          <>
                                            <a href={urlSample} className={classNames("btn mr-3 ", { "btn-ebook": (product.type === "ebook") })} target="_blank">ทดลองอ่าน</a>
                                            <button type="button" className={classNames("btn  mr-3", { "btn-ebook": (product.type == 'ebook') })} onClick={() => { buynow(product.id) }}>{t('buynow')}</button>
                                            <button type="button" defaultValue="1" className={classNames("btn text-black", { "btn-outline-ebook": (product.type == 'ebook') })} onClick={(event) => { addcart(event, product.id) }}>{t('add_to_cart')}</button>
                                          </>
                                        )
                                    }

                                  </div>
                                )
                                  : product.type == 'course' ? (
                                    <div className="mt-3">
                                      {
                                        <>
                                          <button type="button" className={classNames("btn  mr-3", { "btn-course": (product.type == 'course') })} onClick={() => { buynow(product.id) }}>{t('buynow')}</button>
                                          <button type="button" defaultValue="1" className={classNames("btn text-black", { "btn-outline-course": (product.type == 'course') })} onClick={(event) => { addcart(event, product.id) }}>{t('add_to_cart')}</button>
                                        </>

                                      }
                                    </div>
                                  ) : product.type == 'course_ecode' ? (
                                    <div className="mt-3">
                                      {
                                        <>
                                          {product.stock > 0 ?
                                            <>
                                              <button type="button" className={classNames("btn  mr-3", { "btn-course-ecode": (product.type == 'course_ecode') })} onClick={() => { buynow(product.id) }}>{t('buynow')}</button>
                                              <button type="button" defaultValue="1" className={classNames("btn text-black", { "btn-outline-course-ecode": (product.type == 'course_ecode') })} onClick={(event) => { addcart(event, product.id) }}>{t('add_to_cart')}</button>
                                            </> :
                                            <>
                                              <button type="button" disabled className={classNames("btn  mr-3", { "btn-course-ecode": (product.type == 'course_ecode') })} >{t('buynow')}</button>
                                              <button type="button" defaultValue="1" disabled className={classNames("btn text-black", { "btn-outline-course-ecode": (product.type == 'course_ecode') })}>{t('add_to_cart')}</button>
                                            </>
                                          }
                                        </>
                                      }
                                    </div>
                                  ) :
                                    (
                                      <>
                                        {
                                          product.comming === 'Y' ? (
                                            <>
                                              <button type="button" className="btn btn-disabled-detail mr-3" disabled>{t('buynow')}</button>
                                              <button type="button" className="btn btn-disabled-outline-detail" disabled>{t('add_to_cart')}</button>
                                            </>
                                          ) : product.preorder ? (
                                            <>
                                              {
                                                product.preorder_amount > 0 ? (
                                                  <>
                                                    {
                                                      checkDate(product) == 4 ? (
                                                        <>
                                                          <div className="cart-q new-btn-cart">
                                                            <div className="input-group">
                                                              <label className="mt-2 mr-4">{t('quantity')} </label>
                                                              <input type="button" defaultValue="-" data-id={product.id} data-field="quantity" disabled={amount == 1} onClick={handleMinus} />
                                                              <input type="text" pattern="[0-9]*" step="1" max="" name="quantity" data-field="quantity" value={amount} data-id={product.id} className="input quantity-field" onChange={handleNumber} min="0" />
                                                              <input type="button" defaultValue="+" data-id={product.id} data-field="quantity" disabled={amount >= (product.preorder_amount)} onClick={handlePlus} />
                                                              <label className="mt-2 ml-4">{t('have_all_products')} {product.preorder_amount} {t('piece')}</label>
                                                            </div>
                                                          </div>
                                                          <div className="mt-3">
                                                            <button type="button" className={classNames("btn  mr-3", { "btn-primary": (product.type == 'book'), "btn-stationery": (product.type == 'non_book'), "btn-ebook": (product.type == 'ebook') })} onClick={() => { buynow(product.id) }}>{t('buynow')}</button>
                                                            <button type="button" defaultValue="1" className={classNames("btn text-black", { " btn-outline-primary": (product.type == 'book'), "btn-outline-stationery": (product.type == 'non_book'), "btn-outline-ebook": (product.type == 'ebook') })} onClick={(event) => { addcart(event, product.id) }}>{t('add_to_cart')}</button>
                                                          </div>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <button type="button" className="btn btn-disabled-detail mr-3" disabled>{t('buynow')}</button>
                                                          <button type="button" className="btn btn-disabled-outline-detail" disabled>{t('add_to_cart')}</button>
                                                        </>
                                                      )
                                                    }

                                                  </>
                                                )
                                                  :
                                                  (
                                                    <>
                                                      <button type="button" className="btn btn-disabled-detail mr-3" disabled>{t('buynow')}</button>
                                                      <button type="button" className="btn btn-disabled-outline-detail" disabled>{t('add_to_cart')}</button>
                                                    </>
                                                  )
                                              }
                                            </>
                                          ) : (
                                            <>
                                              {
                                                (((product.stock > product.reserve_stock) && product.enable == 1) && !seller_disabled) ? (
                                                  <>
                                                    <div className="cart-q new-btn-cart">
                                                      <div className="input-group">
                                                        <label className="mt-2 mr-4">{t('quantity')} </label>
                                                        <input type="button" defaultValue="-" data-id={product.id} data-field="quantity" disabled={amount == 1} onClick={handleMinus} />
                                                        <input type="text" pattern="[0-9]*" step="1" max="" name="quantity" data-field="quantity" value={amount} data-id={product.id} className="input quantity-field" onChange={handleNumber} min="0" />
                                                        <input type="button" defaultValue="+" data-id={product.id} data-field="quantity" disabled={amount >= (product.stock - product.reserve_stock)} onClick={handlePlus} />
                                                        <label className="mt-2 ml-4">{t('have_all_products')} {(product.stock - product.reserve_stock) >= 0 ? (product.stock - product.reserve_stock) : 0} {t('piece')}</label>
                                                      </div>
                                                    </div>
                                                    <div className="mt-3">
                                                      <button type="button" className={classNames("btn  mr-3", { "btn-primary": (product.type == 'book'), "btn-stationery": (product.type == 'non_book'), "btn-ebook": (product.type == 'ebook') })} onClick={() => { buynow(product.id) }}>{t('buynow')}</button>
                                                      <button type="button" defaultValue="1" className={classNames("btn text-black", { " btn-outline-primary": (product.type == 'book'), "btn-outline-stationery": (product.type == 'non_book'), "btn-outline-ebook": (product.type == 'ebook') })} onClick={(event) => { addcart(event, product.id) }}>{t('add_to_cart')}</button>
                                                    </div>
                                                  </>
                                                )
                                                  :
                                                  (
                                                    <>
                                                      <button type="button" className="btn btn-disabled-detail mr-3" disabled>{t('buynow')}</button>
                                                      <button type="button" className="btn btn-disabled-outline-detail" disabled>{t('add_to_cart')}</button>
                                                    </>
                                                  )
                                              }
                                            </>
                                          )

                                        }
                                      </>
                                    )
                              }

                            </div>
                            {
                              product && (
                                <p className="pt-4">
                                  <font className="font-weight-bold pr-2">TAGS : </font>
                                  <Link {...tools.getUrlCategory(product, 1)} >
                                    <a className="mr-2"><button className="tag">{product.category_main_th}</button></a>
                                  </Link>
                                  <Link {...tools.getUrlCategory(product, 2)}>
                                    <a className="mr-2"><button className="tag">{product.category_sub_th}</button></a>
                                  </Link>
                                  {
                                    product.cate_id && (
                                      <Link {...tools.getUrlCategory(product, 3)}>
                                        <a className="mr-2"><button className="tag">{product.category_name_th}</button></a>
                                      </Link>
                                    )
                                  }
                                </p>
                              )
                            }

                            <div className="detail-social d-flex align-items-center">
                              <p className="font-weight-bold mr-3">สามารถสอบถามเพิ่มเติมหรือสั่งไซส์/สี ได้ที่นี่</p>
                              <a href="https://lin.ee/6IqgNJw" target="_blank"><img src={`${api.frontend_url}/icon/d-line.svg`} alt="line" /></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {
                    product && product.seller_id != 'cu' ? (
                      <div className="row justify-content-lg-center mx-0">
                        <div className="col-xl-10 col-md-12 px-0">
                          <div className="detail-vender mt-4">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <div className="d-flex align-items-center">
                                  <img src={product.seller_picture ? product.seller_picture : `${api.frontend_url}/icon/cu-icon.svg`} alt="icon seller" />
                                  <div className="ml-4">
                                    <p>{t('store_name')}</p>
                                    <p className="vender-name">{product.shop_name}</p>
                                  </div>
                                </div>
                                <div className="text-left seller_rate">
                                  <h2 className='font-h4'>คะแนนร้านค้า</h2>
                                  <Rating
                                    emptySymbol="far fa-star font-star"
                                    fullSymbol="fas fa-star font-star"
                                    fractions={10}
                                    initialRating={product.seller_rate}
                                    readonly="true"
                                  />
                                  <p className="mb-0 mt-1">{!product.seller_total_review ? 'ยังไม่มีคะแนนรีวิว' : `คะแนนที่ได้ ${product.seller_rate} เต็ม 5`}</p>
                                </div>
                              </div>
                              <div>
                                {
                                  product.shop_name ? (
                                    <Link href={`/seller/[seller_name]?seller_name=${seller_link(product.shop_name)}`} as={`/seller/${seller_link(product.shop_name)}`}>
                                      <a><button className="btn btn-outline-primary">{t('view_store')}</button></a>
                                    </Link>
                                  ) : (
                                    <Link href={'/'}>
                                      <a><button className="btn btn-outline-primary">{t('view_store')}</button></a>
                                    </Link>
                                  )
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : ''
                  }

                  {
                    product.item_code != 30000 ? (
                      <div className="row justify-content-lg-center mx-0 mt-4">
                        <div className="col-xl-10 col-md-12 px-0">
                          <div className="bg-white br-8">
                            {
                              product.type == "course" ? (
                                product.course_id != "" ? (
                                  <div class="row py-lg-0 py-2">
                                    <div class="col-12">
                                      <div className="detail-des">
                                        <h2 className="pb-3 font-h4">{`ข้อมูลคอร์สออนไลน์`}</h2>
                                      </div>
                                    </div>
                                    <div class="col-12">
                                      <div class="iframe-content">
                                        <iframe src={`${api.course_url}/iframe/courses/${product.course_id}`} class="codex-iframe"></iframe>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="row py-lg-0 py-2">
                                    <div className="col-xl-4 col-md-5 pr-md-0">
                                      <div className="detail-des">
                                        <h2 className="pb-3 font-h5">{t('book_info')}</h2>
                                        {
                                          product.seller_id != 'cu' ? '' : (
                                            <p><i className="fas fa-chevron-right text-pink mr-3"></i>Barcode : {product ? product.barcode : ''}</p>
                                          )
                                        }
                                        {
                                          product.type == 'book' ? (
                                            <>
                                              {
                                                product.seller_id != 'cu' ? '' : (
                                                  <p><i className="fas fa-chevron-right text-pink mr-3"></i>ISBN : {product ? product.isbn : ''}</p>
                                                )
                                              }
                                              <p><i className="fas fa-chevron-right text-pink mr-3"></i>{t('year_of_print')} : {product ? product.edition : ''} / {product ? product.pub_year : ''}</p>
                                              <p><i className="fas fa-chevron-right text-pink mr-3"></i>{t('size')} ( w x h ) : {product ? product.width : ''} x {product ? product.length : ''} mm.</p>
                                              <p><i className="fas fa-chevron-right text-pink mr-3"></i>{t('number_of_pages')} : {product ? product.pages : ''} {t('pages')}</p>
                                            </>
                                          ) : ''
                                        }
                                        
                                        
                                        <p><i className="fas fa-chevron-right text-pink mr-3"></i>{t('book_category')} : {product ? product.category_name_th : ''}</p>
                                      </div>
                                    </div>
                                    <div className="col-xl-8 col-md-7">
                                      <div className="detail-des">
                                        <h2 className="pb-3 font-h5">{t('book_details')} : {product ? product.name : ''}</h2>
                                        {/* {product.detail_th} */}
                                        <div className="show-editor ck ck-content"><p>{parse(String(local === 'en' ? (product.detail_en || product.detail_th) : (product.detail_th || product.detail_en)))}</p></div>
                                        {/* {
                                          product && <div className="show-editor ck ck-content"><p className="" dangerouslySetInnerHTML={{ __html: (product.detail_th || product.detail_en) }} /></div>
                                        } */}
                                      </div>
                                    </div>
                                  </div>
                                )
                              ) : (
                                <div className="row py-lg-0 py-2">
                                  <div className="col-xl-4 col-md-5 pr-md-0">
                                    <div className="detail-des">
                                      <h2 className="pb-3 font-h5">{t('book_info')}</h2>
                                      {
                                        product.seller_id != 'cu' ? '' : (
                                          <p><i className="fas fa-chevron-right text-pink mr-3"></i>Barcode : {product ? product.barcode : ''}</p>
                                        )
                                      }
                                      {
                                        product.type == 'book' ? (
                                          <>
                                            {
                                              product.seller_id != 'cu' ? '' : (
                                                <p><i className="fas fa-chevron-right text-pink mr-3"></i>ISBN : {product ? product.isbn : ''}</p>
                                              )
                                            }
                                            <p><i className="fas fa-chevron-right text-pink mr-3"></i>{t('year_of_print')} : {product ? product.edition : ''} / {product ? product.pub_year : ''}</p>
                                            <p><i className="fas fa-chevron-right text-pink mr-3"></i>{t('size')} ( w x h ) : {product ? product.width : ''} x {product ? product.length : ''} mm.</p>
                                            <p><i className="fas fa-chevron-right text-pink mr-3"></i>{t('number_of_pages')} : {product ? product.pages : ''} {t('pages')}</p>
                                          </>
                                        ) : ''
                                      }
                                       {
                                          product.type == 'ebook' && product.isbn != 0 ? (
                                            <>
                                              {
                                                product.seller_id != 'cu' ? '' : (
                                                  <p><i className="fas fa-chevron-right text-pink mr-3"></i>ISBN : {product ? product.isbn : ''}</p>
                                                )
                                              }
                                            </>
                                          ) : ''
                                        }
                                      <p><i className="fas fa-chevron-right text-pink mr-3"></i>{t('book_category')} : {product ? product.category_name_th : ''}</p>
                                    </div>
                                  </div>
                                  <div className="col-xl-8 col-md-7">
                                    <div className="detail-des">
                                      <h2 className="pb-3 font-h5">{t('book_details')} : {product ? product.name : ''}</h2>
                                      {/* {product.detail_th} */}
                                      <div className="show-editor ck ck-content"><p>{parse(String(local === 'en' ? (product.detail_en || product.detail_th) : (product.detail_th || product.detail_en)))}</p></div>
                                      {/* <div className="show-editor ck ck-content"><p className="" dangerouslySetInnerHTML={{ __html: (product.detail_th || product.detail_en) }} /></div> */}

                                    </div>
                                  </div>
                                </div>
                              )
                            }

                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row justify-content-lg-center mx-0 mt-4">
                        <div className="col-xl-10 col-md-12 px-0">
                          <div className="bg-white br-8">
                            <div className="row py-lg-0 py-2">
                              <div className="col-xl-12 col-md-12">
                                <div className="detail-des">
                                  <h2 className="pb-3 font-h5">{t('book_details')} : {product ? product.name : ''}</h2>
                                  {
                                    !!product.barcode && (
                                      <p><i className="fas fa-chevron-right text-pink mr-3"></i>Barcode : {product ? product.barcode : ''}</p>
                                    )
                                  }
                                  {
                                    product && <div className="show-editor ck ck-content"><p className="" dangerouslySetInnerHTML={{ __html: local === 'en' ? (product.detail_en || product.detail_th) : product.detail_th }} /></div>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }


                </div>

            }
            <div className="bg-white my-5 pb-5">

              {/* {
              !!product && !!product.sub_id && (
                <RelatedProduct 
                  t={t} product_id={product_id} 
                  author={product.author} sub_id={product.sub_id}  
                  settingscard={settingscard} settingscardmin={settingscardmin}  
                  data={props.product_related}
                />
              )}  */}

              {
                (props.product_related && props.product_related.length > 0) && (
                  <RelatedProduct
                    t={t} product_id={product_id}
                    author={product.author} sub_id={product.sub_id}
                    settingscard={settingscard} settingscardmin={settingscardmin}
                    data={props.product_related}
                  />
                )
              }

              {
                (props.product_also && props.product_also.length > 0) && (
                  <ProductAlsoBuy
                    t={t} product_id={product_id}
                    settingscard={settingscard} settingscardmin={settingscardmin}
                    data={props.product_also}
                  />
                )
              }




            </div>

            <div className="container mt-4" id="scroll-review">
              <div className="row justify-content-lg-center mx-0 ">
                <div className="col-xl-10 col-md-12 px-0">
                  <div className="bg-white br-8">
                    <div className="row">
                      <div className="col-xl-3 col-md-5">
                        <div className="detail-des">
                          <h2 className="pb-3 font-h5">{t('review_score_from_buyers')}</h2>
                          <div className="total-rate">
                            <font className="score">{avg ? avg : '0'} </font>
                            <font> {t('full')} 5 {t('star')}</font>
                          </div>
                          <div className="main-rate mt-2">
                            <Rating
                              emptySymbol="far fa-star font-star"
                              fullSymbol="fas fa-star font-star"
                              fractions={10}
                              initialRating={avg ? avg : '0'}
                              readonly="true"
                            />
                          </div>
                          <div className="main-score mt-2">
                            {review ? review.count : '0'} {t('people')}
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-8 col-md-7">
                        <div className="detail-des detail-star">
                          <div className="show-star d-flex align-items-center">
                            <Rating
                              emptySymbol="far fa-star font-star"
                              fullSymbol="fas fa-star font-star"
                              fractions={1}
                              initialRating="5"
                              readonly="true"
                            />
                            <ProgressBar now={reviewsavg ? reviewsavg.a5 : '0'} className="ml-3 w-25" />
                            <div className="sub-score ml-3">
                              {reviewscore ? reviewscore.r5 : '0'}
                            </div>
                          </div>
                          <div className="show-star d-flex align-items-center">
                            <Rating
                              emptySymbol="far fa-star font-star"
                              fullSymbol="fas fa-star font-star"
                              fractions={1}
                              initialRating="4"
                              readonly="true"
                            />
                            <ProgressBar now={reviewsavg ? reviewsavg.a4 : '0'} className="ml-3 w-25" />
                            <div className="sub-score ml-3">
                              {reviewscore ? reviewscore.r4 : '0'}
                            </div>
                          </div>
                          <div className="show-star d-flex align-items-center">
                            <Rating
                              emptySymbol="far fa-star font-star"
                              fullSymbol="fas fa-star font-star"
                              fractions={1}
                              initialRating="3"
                              readonly="true"
                            />
                            <ProgressBar now={reviewsavg ? reviewsavg.a3 : '0'} className="ml-3 w-25" />
                            <div className="sub-score ml-3">
                              {reviewscore ? reviewscore.r3 : '0'}
                            </div>
                          </div>
                          <div className="show-star d-flex align-items-center">
                            <Rating
                              emptySymbol="far fa-star font-star"
                              fullSymbol="fas fa-star font-star"
                              fractions={1}
                              initialRating="2"
                              readonly="true"
                            />
                            <ProgressBar now={reviewsavg ? reviewsavg.a2 : '0'} className="ml-3 w-25" />
                            <div className="sub-score ml-3">
                              {reviewscore ? reviewscore.r2 : '0'}
                            </div>
                          </div>
                          <div className="show-star d-flex align-items-center">
                            <Rating
                              emptySymbol="far fa-star font-star"
                              fullSymbol="fas fa-star font-star"
                              fractions={1}
                              initialRating="1"
                              readonly="true"
                            />
                            <ProgressBar now={reviewsavg ? reviewsavg.a1 : '0'} className="ml-3 w-25" />
                            <div className="sub-score ml-3">
                              {reviewscore ? reviewscore.r1 : '0'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="container mt-4">
              {
                review ? review.rows.map((val, index) => (
                  <div className="row justify-content-lg-center mx-0 " key={val.id}>
                    <div className="col-xl-10 col-12 px-0">
                      <div className="show-review">
                        <div className="box-profile px-0">
                          <div className="img">
                            <img src={val.user.picture ? val.user.picture : `${api.frontend_url}/images/no-picture.png`} alt="user profile" />
                          </div>
                          <div className="name">
                            <div className="mt-3">
                              <p className="mb-0 font-weight-bold">{val.user.firstname}</p>
                              <div className="rate-user">
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
                        </div>
                        <div className="show-review-text">
                          <p>
                            {val.review_text}
                          </p>
                          {
                            val.image && (
                              <div className="position-relative">
                                <div className="review-img-upload">
                                  <img src={val.image} className="img-middle" alt="review image" />
                                </div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )) : ''
              }
            </div>


            <Modal className="modal-cart" show={show} onHide={handleClose} size="lg">
              <Modal.Header closeButton>
                <div>
                  <Modal.Title className="d-flex">{t('shipping_address')}</Modal.Title>
                </div>
              </Modal.Header>
              <Modal.Body>

                <div>
                  <div className="box-main-account">
                    <div className="edit-profile" id="edit-profile">
                      <form id="profile-form" onSubmit={handleSave}>
                        <div className="row mx-0 px-0">
                          <div className="col-12 px-0">
                            <div>
                              <p>{t('select_delivery')}</p>
                              <div className="radio-toolbar">
                                <input type="radio" id="radioHome" name="at" value="home" defaultChecked onClick={changetoHome} />
                                <label htmlFor="radioHome" className="ml-0">{t('athome')}</label>

                                <input type="radio" id="radioWork" name="at" value="work" onClick={changetoOffice} />
                                <label htmlFor="radioWork">{t('office')}</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-6 col-12 d-flex">
                            <div className="w-100">
                              <div>
                                <p>{t('name')}</p>
                              </div>
                              <div className="form-group">
                                <input type="text" className="form-control" name="firstname" placeholder={t('name_surname')} required />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-12 d-flex">
                            <div className="w-100">
                              <div>
                                <p>{t('surname')}</p>
                              </div>
                              <div className="form-group">
                                <input type="text" className="form-control" name="lastname" placeholder={t('surname')} required />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-12 d-none office">
                            <div className="w-100">
                              <div>
                                <p>{t('company_name')}</p>
                              </div>
                              <div className="form-group">
                                <input type="text" className="form-control office-required" name="company_name" maxLength="" placeholder={t('company_name')} />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-12 d-flex">
                            <div className="w-100">
                              <div>
                                <p>{t('phone_number')}</p>
                              </div>
                              <div className="form-group">
                                <input type="text" className="form-control" name="phone" maxLength="10" placeholder={t('please_phone_number')} />
                              </div>
                            </div>
                          </div>
                          {/* </div>
                      <div className="row mx-0 px-0 mt-2"> */}
                          <div className="col-lg-6 col-12 d-flex">
                            <div className="w-100">
                              <div>
                                <p>{t('address')}</p>
                              </div>
                              <div className="form-group">
                                <input type="text" className="form-control" name="address" placeholder={t('please_address')} required />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-12 d-flex">
                            <div className="w-100">
                              <div>
                                <p>{t('province')}</p>
                              </div>
                              <div className="form-group styleSelect">
                                <div className="d-block position-relative">
                                  <select className="form-control" name="province_code" onChange={onChangeProv}>
                                    {
                                      province ? Object.keys(province).map((prov, index) => (
                                        <option value={province[prov][0].province_code} key={prov}>{prov}</option>
                                      )) : ''
                                    }
                                  </select>
                                  <img src={`${api.frontend_url}/icon/icon-arrow-down.svg`} className="select-icon" alt="arrow down" />
                                </div>
                              </div>
                              {/* <div className="form-group">
                              <input type="text" className="form-control" name="province" placeholder={t('please_province')} />
                            </div> */}
                            </div>
                          </div>
                          <div className="col-lg-6 col-12 d-flex">
                            <div className="w-100">
                              <div>
                                <p>{t('district')}</p>
                              </div>
                              <div className="form-group styleSelect">
                                <div className="d-block position-relative">
                                  <select className="form-control" name="ampher" onChange={onChangeAmphoe}>
                                    {
                                      amphoe ? Object.keys(amphoe).map((amp, index) => (
                                        <option value={amp} key={amp}>{amp}</option>
                                      )) : ''
                                    }
                                  </select>
                                  <img src={`${api.frontend_url}/icon/icon-arrow-down.svg`} className="select-icon" alt="arrow down" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-12 d-flex">
                            <div className="w-100">
                              <div>
                                <p>{t('sub_district')}</p>
                              </div>
                              <div className="form-group styleSelect">
                                <div className="d-block position-relative">
                                  <select className="form-control" name="district" id="" onChange={onChangeDistrict}>
                                    {
                                      district ? Object.keys(district).map((dis, index) => (
                                        <option value={dis} key={dis}>{dis}</option>
                                      )) : ''
                                    }
                                  </select>
                                  <img src={`${api.frontend_url}/icon/icon-arrow-down.svg`} className="select-icon" alt="arrow down" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* </div>
                      <div className="row mx-0 px-0 mt-2"> */}
                          <div className="col-lg-6 col-12 d-flex">
                            <div className="w-100">
                              <div>
                                <p>{t('postcode')}</p>
                              </div>
                              <div className="form-group styleSelect">
                                <div className="d-block position-relative">
                                  <select className="form-control" name="post">
                                    {
                                      zipcode ? Object.keys(zipcode).map((zip) => (
                                        <option value={zip} key={zip}>{zip}</option>
                                      )) : ''
                                    }
                                  </select>
                                  <img src={`${api.frontend_url}/icon/icon-arrow-down.svg`} className="select-icon" alt="arrow down" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-12 d-flex">
                            <div className="w-100">
                              <div>
                                <p>{t('tax_id')}</p>
                              </div>
                              <div className="form-group">
                                <input type="text" className="form-control" name="tax_id" minLength="13" maxLength="13" pattern="[0-9]+" placeholder={t('please_tax')} />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-12 d-none office">
                            <div className="w-100">
                              <div>
                                <p>{t('branch_code')}</p>
                              </div>
                              <div className="form-group">
                                <input type="text" className="form-control" name="branch_code" maxLength="" placeholder={t('branch_code')} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <input type="hidden" name="type" defaultValue="normal" />
                        <div className="row mx-0 px-0 mt-5">
                          <div className="col-12 px-0">
                            <div className="float-right">
                              <button className="btn btn-outline-primary mr-3" type="button" onClick={handleClose}>{t('cancel')}</button>
                              <button className="btn btn-primary" type="submit">{t('save')}</button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>


            <Modal className="modal-cart" centered show={showLogin} onHide={handleCloseLogin} size="xl">
              <Modal.Header closeButton>
                <div>
                  <Modal.Title className="d-flex">{t('login')}</Modal.Title>
                </div>
              </Modal.Header>
              <Modal.Body>
                <LoginLayout loginBy="modal" closeModal={handleCloseLogin} isModal={true} />
              </Modal.Body>
            </Modal>

            <ModalPromotion t={t} promotion={promotion} showModal={showModal} handleCloseMadal={handleCloseMadal}
              setCopySuccess={setCopySuccess} copySuccess={copySuccess} shop_name={product.shop_name} />
            <div className={!isTop ? "navbar-product show" : "navbar-product "}>

              <div className="container align-items-center h-100 navbar-product-1200">
                <div className="col-6 d-flex align-items-center justify-content-start">
                  <div className="mr-3 d-flex align-items-center">
                    {
                      isFavorite() ? (
                        <div>
                          <img src={`${api.frontend_url}/icon/fav-active.svg`} className="ml-5 cursor-pointer" onClick={() => { addFavorite(product ? product.id : '') }} alt="fav" />

                        </div>
                      ) : (
                        <div>
                          <img src={`${api.frontend_url}/icon/fav-none.svg`} className="ml-5 cursor-pointer" onClick={() => { addFavorite(product ? product.id : '') }} alt="un fav" />
                        </div>
                      )
                    }
                  </div>
                  <div className="d-flex w-100 align-items-center">
                    <div className="">
                      {/* เป็นส่วน แสดงรูปภาพสินค้า */}
                      {
                        product && (
                          <div className={classNames("img-nav-product mr-3", product ? (product.picture == img ? 'active' : '') : '')} onClick={() => { handleImg(product.picture == null ? product.picture : '/images/book.png', 'image', '') }}>

                            <img className="mh-100 mw-100" src={product.picture ? product.picture : `${api.frontend_url}/images/book.png`} alt={product.name} />


                          </div>
                        )
                      }
                    </div>
                    <div className="">
                      <h2 className="text-black  font-h5">{product && product.name}</h2>
                      <p className="text-color-author mb-0">{(product.type == 'book' || product.type == 'ebook') ? (`${t('author')} : ${product ? product.author : ''}`) : ''}</p>
                    </div>
                  </div>

                </div>
                <div className="col-6 d-flex align-items-center justify-content-end">
                  <div className="mr-3">
                    {product.type == 'ebook' ?
                      (
                        <p className="text-black">{t('e_book')}</p>
                      ) : product.type == 'course' ?
                        (
                          <p className="text-black">{t('header:course_online')}</p>
                        )
                        :
                        (
                          <p className="text-black">{product ? (product.cover_code == 1 ? t('softcover') : t('hardcover')) : ''}</p>
                        )
                    }

                    <p className={classNames("nav-product-price mb-0", { "text-ebook": (product.type == 'ebook'), "text-stationery": (product.type == 'non_book'), "text-course": (product.type == 'course') })}>{product.price ? '฿ ' + tools.currencyFormatDE(product.price) : 'Free'}</p>
                  </div>

                  <div className="mr-3">
                    {parseInt(product.cover_price) ?
                      (
                        <>
                          <p className="mb-0">{t('normal_price')}</p>
                          <div> <p className="nav-product-discount mb-0">฿ {tools.currencyFormatDE(product ? product.cover_price : '')}</p></div>

                          <span className={classNames("text-pink font-h5", { "text-ebook": (product.type == 'ebook'), "text-stationery": (product.type == 'non_book'), "text-course": (product.type == 'course') })}>{t('discount')} {product && parseInt(100 - ((product.price / product.cover_price) * 100))}%</span>
                        </>
                      )
                      : ''

                    }

                  </div>
                  <div>
                    {
                      product.type == 'ebook' ? (
                        isBoughtEbook(product.ebook_id) ? (
                          <button type="button" className="btn btn-disabled-detail mr-3" disabled>{t('bought')}</button>
                        )
                          : product.enable == 0 ? (
                            <>
                              <button type="button" className="btn-small btn-disabled-detail  mr-3" disabled>{t('buynow')}</button>
                              <button type="button" className="btn-small btn-disabled-outline-detail " disabled>{t('add_to_cart')}</button>
                            </>
                          ) :
                            (
                              <>
                                <button type="button" className={classNames("btn-small  mr-3", { "btn-ebook": (product.type == 'ebook') })} onClick={() => { buynow(product.id) }}>{t('buynow')}</button>
                                <button type="button" defaultValue="1" className={classNames("btn-small text-black", { "btn-outline-ebook": (product.type == 'ebook') })} onClick={(event) => { addcart(event, product.id) }}>{t('add_to_cart')}</button>
                              </>
                            )
                      ) : product.type == 'course' ? (

                        <>
                          <button type="button" className={classNames("btn-small  mr-3", { "btn-course": (product.type == 'course') })} onClick={() => { buynow(product.id) }}>{t('buynow')}</button>
                          <button type="button" defaultValue="1" className={classNames("btn-small text-black", { "btn-outline-course": (product.type == 'course') })} onClick={(event) => { addcart(event, product.id) }}>{t('add_to_cart')}</button>
                        </>

                      )
                        :
                        (
                          ((product.stock > product.reserve_stock && product.enable == 1) && !seller_disabled) ? (
                            <>
                              <button type="button" className={classNames("btn-small  mr-3", { "btn-primary": (product.type == 'book'), "btn-stationery": (product.type == 'non_book'), "btn-ebook": (product.type == 'ebook') })} onClick={() => { buynow(product.id) }}>{t('buynow')}</button>
                              <button type="button" defaultValue="1" className={classNames("btn-small text-black", { " btn-outline-primary": (product.type == 'book'), "btn-outline-stationery": (product.type == 'non_book'), "btn-outline-ebook": (product.type == 'ebook') })} onClick={(event) => { addcart(event, product.id) }}>{t('add_to_cart')}</button>
                            </>
                          ) : (
                            <>
                              <button type="button" className="btn btn-disabled-detail mr-3" disabled>{t('buynow')}</button>
                              <button type="button" className="btn btn-disabled-outline-detail" disabled>{t('add_to_cart')}</button>
                            </>
                          )
                        )
                    }

                  </div>


                </div>
              </div>
              <div className="container align-items-center h-100 navbar-product-lower1200">
                <div className="col-7 d-flex align-items-center justify-content-start">
                  <div className="mr-3 d-flex align-items-center">
                    {
                      isFavorite() ? (
                        <div>
                          <img src={`${api.frontend_url}/icon/fav-active.svg`} className="cursor-pointer" onClick={() => { addFavorite(product ? product.id : '') }} alt="fav" />

                        </div>
                      ) : (
                        <div>
                          <img src={`${api.frontend_url}/icon/fav-none.svg`} className="cursor-pointer" onClick={() => { addFavorite(product ? product.id : '') }} alt="un fav" />
                        </div>
                      )
                    }
                  </div>
                  {
                    product && (
                      <div className="d-flex w-100 align-items-center">
                        <div className="">
                          <div className={classNames("img-nav-product mr-3", product ? (product.picture == img ? 'active' : '') : '')} onClick={() => { handleImg(product.picture == null ? product.picture : '/images/book.png', 'image', '') }}>

                            <img className="mh-100" src={product.picture ? product.picture : `${api.frontend_url}/images/book.png`} alt={product.name} />




                          </div>
                        </div>
                        <div className="">
                          <h2 className="text-black font-weight-bold p-12 line-h-16px font-h5">{product && product.name}</h2>
                          <p className={classNames("text-pink p-14 font-weight-bold mb-0", { "text-ebook": (product.type == 'ebook'), "text-stationery": (product.type == 'non_book') })}>฿ {tools.currencyFormatDE(product ? product.price : '')}</p>
                        </div>
                      </div>
                    )
                  }

                </div>
                <div className="col-5 d-flex align-items-center justify-content-end">

                  <div>
                    {product ? (product.stock > product.reserve_stock ? (
                      product.enable != 0 ? (
                        <>
                          <button type="button" className={classNames("btn-small  mr-3", { "btn-primary": (product.type == 'book'), "btn-stationery": (product.type == 'non_book'), "btn-ebook": (product.type == 'ebook') })} onClick={() => { buynow(product.id) }}>{t('buynow')}</button>
                          <button type="button" defaultValue="1" className={classNames("btn-small text-black", { " btn-outline-primary": (product.type == 'book'), "btn-outline-stationery": (product.type == 'non_book'), "btn-outline-ebook": (product.type == 'ebook') })} onClick={(event) => { addcart(event, product.id) }}>{t('add_to_cart')}</button>
                        </>
                      ) : (<>
                        <button type="button" className="btn-small btn-disabled-detail mr-3" disabled>{t('buynow')}</button>
                        <button type="button" className="btn-small btn-disabled-outline-detail" disabled>{t('add_to_cart')}</button>
                      </>)

                    ) : (
                      <>
                        <button type="button" className="btn-small btn-disabled-detail mr-3" disabled>{t('buynow')}</button>
                        <button type="button" className="btn-small btn-disabled-outline-detail" disabled>{t('add_to_cart')}</button>
                      </>
                    )) : ''
                    }
                  </div>


                </div>
              </div>
            </div>
            <div className="end-page"></div>
          </>
        ) : (
          <>
            <div className="container my-5">
              <div className="row justify-content-center">
                <div className="col-8 ">
                  <div className="bg-white p-5 text-center border-radius-8px">
                    <img className="img-fluid" src={`${api.frontend_url}/images/not-cart.svg`} alt="ศูนย์หนังสือจุฬาฯ" />
                    <h3 className="text-pink py-3">{t('no_product')}</h3>
                    <Link href='/'>
                      <button className="btn btn-primary mt-3">{t("static_nav:shoping-now")}</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="end-page"></div>
          </>
        )
      }
    </>
  )
}

export default MainDetail