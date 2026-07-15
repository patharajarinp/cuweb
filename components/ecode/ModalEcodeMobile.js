import { Modal } from 'react-bootstrap';
import classnames from "classnames";
import ProductSlick from '../../components/mobile/Product-slick';
import { useRouter } from 'next/router';
import api from '../../utils/api';
import Slick from "react-slick";
import { Button, Fade } from 'reactstrap';
import tools from '../../utils/tools';
import ReactPlayer from 'react-player';
import parse from "html-react-parser";
import AuthService from '../../utils/AuthService';
import UserContext from '../../contexts/UserContext';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { withTranslation } from "../../utils/i18n";
import classNames from 'classnames';

const ModalEcodeMobile = ({ show, datadetail, t, handleClose }) => {
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

  const [clickImg, setClickImg] = useState(false);
  const [fileType, setFileType] = useState('image');
  const [mimeType, setMimeType] = useState();
  const [bookimg, setBookimg] = useState();
  const [showLogin, setShowLogin] = useState(false);
  const { user, handleCart, fetchUser, local, setUser } = useContext(UserContext);
  const [product, setProduct] = useState();
  const [product_id, setProductID] = useState();
  const [img, setImg] = useState(`${api.frontend_url}/images/book.png`);
  const [thumbnail, setThumbnail] = useState(`${api.frontend_url}/images/book.png`);
  const [url, setURL] = useState();
  const [addToCart, setaddToCart] = useState(false);
  const [promotions, setPromotionStete] = useState(false);
  const [amount, setAmount] = useState(1);
  const [buyimmediately, setbuyimmediately] = useState(false);
  const [ToCart, setToCart] = useState();
  const router = useRouter()
  const handleImg = (pic, type, mimetype, thumbnail, url) => {


    setImg(pic);
    setFileType(type);
    setMimeType(mimetype);
    setURL(url);
    setThumbnail(thumbnail);
  }
  const fetchProductOne = () => {
    const data = datadetail;
    if (!data) return;
    setImg(data.picture ? data.picture : '/images/book.png');

  };
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
      handleClose();
    } else {
      setShowLogin(true);
    }
  }
  const oncloseAll = () => {

    setToCart(0);
    setaddToCart(false);
    setbuyimmediately(false);
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
  const handleMinus = () => {
    var tmp = amount;
    var sum = amount - 1;
    if (sum >= 1) {
      setAmount(sum);
    } else {
      setAmount(1);
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
  const closeModal = () => {
    this.setState({ show: false })
  }
  useEffect(() => {
    if (showLogin) {
      router.push('/ecode/login_ecode')
    }
  }, [showLogin])

  useEffect(() => {
    if (document.getElementsByClassName('main-layout')[0]) {
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
    if (datadetail) {

      fetchProductOne()
      if (amount != 1) setAmount(1);
    }
  }, [product, datadetail])
  useEffect(() => {
    if (datadetail) {
      setProduct(datadetail);
      setProductID(datadetail.id);
    }
    if (product) {
      setBookimg(product?.images);
    }
  }, [product, datadetail]);
  useEffect(() => {
    fetchPromotion();
  }, [product_id])

  const seller_disabled = (product && product?.seller_id != 'cu' && (product?.seller_approve_status != 1 || product.seller_suspend_status == 1)) ? true : false;

  return (
    <Modal className="modal-alert" show={show} onHide={handleClose} size="lg">
      <Modal.Body>
        <div >

          <div className="show-product-ecode" id="show_product">
            <div onClick={() => handleClose()}><i class="gg-close-o"></i></div>
            <ProductSlick product={product} bookimg={bookimg} checkDate={checkDate} showText={showText} t={t} />
          </div>

          <div className="col-xl-12 col-md-12">
            <div className="de-price pb-2">
              <h2 className={classNames("detail-price mb-0", { "text-pink": (product?.type == 'ecode') })}>  {product?.price ? '฿ ' + tools.currencyFormatDE(product?.price) : ''}</h2>
              {product && parseFloat(product.cover_price) ?
                (
                  <div className='f'>
                    <p className={classNames("detail-save mb-0 text-pink font-12 magin-right-40", { "text-ebook": (product.type == 'ebook'), "text-stationery": (product.type == 'non_book'), "text-course": (product.type == 'course') })}>{t('discount')} {product.price && parseInt(100 - ((product.price / product.cover_price) * 100))} %</p>
                    {
                      (product.cover_price > product.price) ? (
                        <p className="detail-discount mx-5 text-disable font-12">{tools.currencyFormatDE(product.cover_price)}</p>
                      ) : (
                        <p className="detail-discount new mx-5 text-disable font-12">{tools.currencyFormatDE(product.cover_price)}</p>
                      )
                    }


                  </div>
                )
                : ''

              }

            </div>
            <h3>{product?.name}</h3>
            <p className="detail-author-ecode">{(product?.type == 'ecode') ? (product.author ? `${t('author')} : ${product.author}` : '') : ''}</p>
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
                (
                  <div className="">
                    <div className="col-xl-6 col-md-5 pr-md-0">
                      <div className="detail-des">
                        <h2 className="pb-3 font-h5">{t('book_info')}</h2>
                        {
                          product?.seller_id != 'cu' ? '' : (
                            <p><i className="fas fa-chevron-right text-pink mr-3"></i>Barcode : {product ? product.barcode : ''}</p>
                          )
                        }

                        <p><i className="fas fa-chevron-right text-pink mr-3"></i>{t('book_category')} : {product ? product.category_name_th : ''}</p>
                      </div>
                    </div>
                    <div className="col-xl-6 col-md-7">
                      <div className="detail-des">
                        <h2 className="pb-3 font-h5">{t('book_details')} : {product ? product.name : ''}</h2>
                        <div className="show-editor ck ck-content"><p>{parse(String(local === 'en' ? (product?.detail_en || product?.detail_th) : (product?.detail_th || product?.detail_en)))}</p></div>
                      </div>
                    </div>
                    {

                      (((product?.stock > product?.reserve_stock) && product?.enable == 1) && !seller_disabled) || product?.is_preorder ? (
                        <div className="col-12">
                          {
                            product.price ?
                              <div className="mt-3">
                                <button type="button" defaultValue="1" className={classNames("btn w-100  mr-3 btn-primary", { " ": (product.type == 'ecode'), "btn-outline-stationery": (product.type == 'non_book'), "btn-outline-ebook": (product.type == 'ebook') })} onClick={(event) => { addcart(event, product.id) }}>{t('add_to_cart')}</button>
                              </div> :
                              <div className="mt-3">
                                <button type="button" disabled defaultValue="1" className={classNames("btn w-100  mr-3 btn-primary", { " ": (product.type == 'ecode'), "btn-outline-stationery": (product.type == 'non_book'), "btn-outline-ebook": (product.type == 'ebook') })} onClick={(event) => { addcart(event, product.id) }}>{t('add_to_cart')}</button>
                              </div>
                          }

                        </div>
                      )
                        :
                        (
                          <>
                            <button type="button" className="btn btn-mobile btn-disabled-outline-detail" disabled>{t('add_to_cart')}888</button>
                          </>
                        )
                    }
                  </div>
                )
              }

            </div>
            {buyimmediately &&
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
                            <h2 className={classnames("text-pink mb-0 text-h2", { "text-ebook": (product.type == "ebook"), "text-stationery": (product.type == "non_book"), "text-course": (product.type == "course") })}> {product.price ? '฿ ' + currencyFormatDE(product.price) : ''}</h2>
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
                            <input type="text" className="text-number" maxLength="5" value={amount} onChange={handleNumber} pattern="[0-9]*" name="quantity" />
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
            }
          </div>


        </div>

      </Modal.Body>
    </Modal>
  )
}

export default ModalEcodeMobile;