import { Modal } from 'react-bootstrap';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import api from '../../utils/api';
import Slick from "react-slick";
import tools from '../../utils/tools';
import ReactPlayer from 'react-player';
import parse from "html-react-parser";
import AuthService from '../../utils/AuthService';
import UserContext from '../../contexts/UserContext';
import React, { useCallback, useContext, useEffect, useState } from 'react';

const ModalEcode = ({ show, datadetail, t, handleClose }) => {
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
  const [promotions, setPromotionStete] = useState(false);
  const [amount, setAmount] = useState(1);
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

          node.style.cssText = "--top:" + offset_top + "px; --left:" + offset_left + "px; transition: all .6s ease; width:30px; height:30px; background-color:#EE5294; border-radius:50%; display: block; position:absolute; z-index:100001; " + top + " " + left;
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

  const seller_disabled = (product && product?.seller_id != 'cu' && (product?.seller_approve_status != 1 || product.seller_suspend_status == 1)) ? true : false;

  console.log(product?.preorder_amount, ' product?.preorder_amount')
  return (
    <Modal className="modal-alert" show={show} onHide={handleClose} size="lg">
      <Modal.Body>
        <div className="row">

          <div className="col-xl-6 col-md-6">
            {
              product && (

                <div className={classNames(fileType != 'image' ? 'video-bg' : '', "detail-img book-shadow text-center", product.preorder ? (checkDate(product) != 4 ? 'set-stock' : '') : (((product.stock && product.stock > product.reserve_stock) || product.type == 'ecode') ? '' : 'set-stock'))}>
                  {
                    !clickImg ? (
                      <>
                        {
                          (fileType == 'image') ? (
                            <>
                              {
                                (product && !product.is_preorder) &&
                                <div className="c-img h-100 center-img">
                                  <img src={img} className="img-fluid" alt={product.name} />
                                </div>
                              }
                            </>
                          ) : (
                            <ReactPlayer width={'100%'} height={'100%'} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} url={url} />
                            // <video controls className="w-100" key={img} >
                            //   <source src={img} type={mimeType} alt={product.name} />
                            // </video>
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
                            <ReactPlayer width={'100%'} height={'100%'} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} url={url} />
                            // <video controls className="w-100" key={img} >
                            //   <source src={img} type={mimeType} alt={product.name} />
                            // </video>
                          )
                        }
                      </>
                    )
                  }


                  {
                    (product && product.is_preorder) ? (
                      <>
                        {
                          (fileType == 'image') ? (
                            <div className="c-img h-100 center-img">
                              <img src={img} className="img-fluid" alt={product.name} />
                            </div>
                          ) : (
                            <ReactPlayer width={'100%'} height={'100%'} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} url={product?.urlyoutube} />
                            // <video controls className="w-100" key={img} >
                            //   <source src={img} type={mimeType} alt={product.name} />
                            // </video>
                          )
                        }
                        <img src={`${api.frontend_url}/icon/pre_order2.svg`} className="img-stock" alt="pro-order" />
                      </>
                    ) : (
                      ''
                    )

                  }

                  {
                    product.comming === 'Y' ? (
                      <div className="text-stock">{t('comming')}</div>
                    ) : product.is_preorder ? (
                      <>
                      </>
                    ) : (
                      <>
                        {
                          ((product.stock && product.stock > product.reserve_stock) || product.type == "ecode") ?
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

                          <div className={classNames("sub-slide center-img", (val.image == img ? 'active' : ''))} onClick={() => { handleImg(val.image ? val.image : '/images/book.png', val.type, val.mimetype, val.thumbnail, val.urlyoutube) }}>
                            {
                              (val.type == 'image') ? (
                                <img src={val.image ? val.image : `${api.frontend_url}/images/book.png`} className="img-fluid" alt={product && product.name} />
                              ) : (
                                <img src={val.thumbnail ? val.thumbnail : `${api.frontend_url}/images/book.png`} className="img-fluid" alt={product && product.name} />
                                // <ReactPlayer width={'100%'} height={'100%'} style={{position:'absolute',top:0,bottom:0,left:0,right:0}} url={val.thumbnail} />
                                // <ReactPlayer controls="" className="middle">
                                //   <source src={val.image} type={val.mimetype} />
                                // </ReactPlayer>
                              )
                            }

                          </div>
                        </div>
                      )) : ''
                    }

                  </Slick>
                </div>
              )
            }

          </div>
          <div className="col-xl-6 col-md-6">
            <h3>{product?.name}</h3>
            <p className="detail-author">{(product?.type == 'ecode') ? (product.author ? `${t('author')} : ${product.author}` : '') : ''}</p>
            {product?.type == 'ecode' ?
              (
                <p className="mt-4 font-weight-bold">{t('ecode')}</p>
              )
              : product?.type == 'course' ?
                (
                  <>
                    <p className="mt-4 font-weight-bold mb-0">{t('course_online')}</p>
                    <p className="font-weight-bold">
                      {t('other_package')}&nbsp;
                      <a className="text-course text-underline" target="_blank" href={`${api.course_url}/courses/${product.course_id}`}>{t('click')}</a>
                    </p>
                  </>
                ) : product?.type == 'book' ? (
                  <p className="mt-4 font-weight-bold">{product ? (product.cover_code == 1 ? t('softcover') : t('hardcover')) : ''}</p>
                ) : <p className="mt-4 font-weight-bold"></p>
            }
            <div className="de-price pb-2">
              <p className={classNames("detail-price mb-0", { "text-book": (product?.type == 'ecode') })}>  {product?.price ? '฿ ' + tools.currencyFormatDE(product?.price) : 'Free'}</p>
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

                    <p className={classNames("detail-save mb-0", { "text-ebook": (product.type == 'ebook'), "text-stationery": (product.type == 'non_book'), "text-course": (product.type == 'course') })}>{t('discount')} {product.price && parseInt(100 - ((product.price / product.cover_price) * 100))} %</p>
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
                (((product?.stock > product?.reserve_stock) && product?.enable == 1) && !seller_disabled || product?.is_preorder == 1) ? (
                  <>
                    <div className="cart-q new-btn-cart">
                      <div className="input-group">
                        <label className="mt-2 mr-4">{t('quantity')} </label>
                        <input type="button" defaultValue="-" data-id={product.id} data-field="quantity" disabled={amount == 1} onClick={handleMinus} />
                        <input type="text" pattern="[0-9]*" step="1" max="" name="quantity" data-field="quantity" value={amount} data-id={product.id} className="input quantity-field" onChange={handleNumber} min="0" />
                        <input type="button" defaultValue="+" data-id={product.id} data-field="quantity" disabled={amount >= (product?.is_preorder ? 1000 : product.stock - product.reserve_stock)} onClick={handlePlus} />
                        {
                          product?.is_preorder != 1 ?
                            <label className="mt-2 ml-4">{t('have_all_products')} {(product.stock - product.reserve_stock) >= 0 ? (product.stock - product.reserve_stock) : 0} {t('piece')}</label>
                            : ''
                        }

                      </div>
                    </div>
                    <div className="mt-3">
                      <button type="button" defaultValue="1" className={classNames("btn  mr-3 btn-primary", { " ": (product.type == 'ecode'), "btn-outline-stationery": (product.type == 'non_book'), "btn-outline-ebook": (product.type == 'ebook') })} onClick={(event) => { addcart(event, product.id) }}>{t('add_to_cart')}</button>
                    </div>
                  </>
                )
                  :
                  (
                    <>
                      <button type="button" className="btn btn-disabled-outline-detail" disabled>{t('add_to_cart')}</button>
                    </>
                  )
              }

            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-10 col-md-12 px-0">
            <div className="bg-white br-8">
              {
                (
                  <div className="row py-lg-0 py-2">
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
                        {/* {product.detail_th} */}
                        <div className="show-editor ck ck-content"><p>{parse(String(local === 'en' ? (product?.detail_en || product?.detail_th) : (product?.detail_th || product?.detail_en)))}</p></div>
                        {/* <div className="show-editor ck ck-content"><p className="" dangerouslySetInnerHTML={{ __html: (product.detail_th || product.detail_en) }} /></div> */}

                      </div>
                    </div>
                  </div>
                )
              }

            </div>
          </div>

        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ModalEcode;