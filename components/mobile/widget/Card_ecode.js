import classnames from "classnames";
// import Link from 'next/link';
import Router from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import AuthService from '../../../utils/AuthService';
import { Link, withTranslation } from '../../../utils/i18n';
import tools from "../../../utils/tools";

const CardGrid = (props) => {
  const { user, handleCart, fetchUser, onSocket } = useContext(UserContext);
  const {t} = props;
  var { product, _class = " mr-2",freespace } = props
  const addcart = (event, id) => {
    event.persist();

    if (AuthService.isLoggin()) {
      if(!user) return;
       if(user.cart.length) {
         var check = user.cart.find((val) => val.product_id == id)
         if(check) {
           if(check.type === 'ebook') {
             alert('สินค้าที่ท่านเลือกเป็นรูปแบบ eBook สามารถสั่งซื้อได้เพียงครั้งเดียวเท่านั้น');
             return;
           }
           if(check.type === 'course') {
             alert('สินค้าที่ท่านเลือกเป็นรูปแบบ course สามารถสั่งซื้อได้เพียงครั้งเดียวเท่านั้น');
             return;
           }
         }
       }
      api.addCart({ product_id: id, quantity: 1, type: 1 })
        .then(res => {
          const data = res.data;
          ;
          fetchUser();
          //fetchUser();
          // history.back();
        })
        .catch(err => {
          if (err.response.data.code == 1211) {
            alert('{t("out_of_stock")}');
          }
          console.log(err.response);
        })
    } else {
      //setShowLogin(true);
      // alert('not login');
    }
  }
  
  const currencyFormatDE = (num) => {
    num = parseFloat(num);
    return (
      num
        .toFixed(2) // always two decimal digits
        .replace(',', '.') // replace decimal point character with ,
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    ) // use . as a separator
  }

  const [img, setImg] = useState('/mobile/image/product/book.png');
  const [youtube, setYoutube] = useState(0);

  useEffect(() => {
    if (product) {
      var namepath = product.picture;
      if (namepath) {
        var [path, link] = namepath.split("watch?v=");
        if (link) {
          setYoutube('https://www.youtube.com/embed/' + link);
        }
        setImg(product.picture ? product.picture : '/mobile/image/product/book.png');
      }
    }
  }, []);

  const isFavorite = () => {
    if (!user || !product) {
      return false;
    }

    if (user.favorites.length == 0) {
      return false;
    }

    var found = false;
    user.favorites.forEach(item => {
      if (item.product_id == product.id) {
        found = true;
      }
    });
    //console.log(found);

    return found;
  }

  const addFavorite = (e,product_id) => {
    e.preventDefault()
    if (AuthService.isLoggin()) {
      const id = AuthService.getProfile().id;
      api.addOrdeleteFav(id, { product_id })
        .then(res => {
          const data = res.data;
          fetchUser();
          ;
        })
        .catch(err => {
          console.log(err.response);
        })
    } else {
      const path = window.location.pathname
      Router.push(`/login?redirect=${path}`)
    }
  }

  const checkDate = (val) => {
    if(!val.preorder_start || !val.preorder_end) {
      return 0;
    }
    var start = new Date(val.preorder_start);
    var end = new Date(val.preorder_end);
    var now = new Date();
    if(now < start) {
      return 1;
    }else if(now > end) {
      return 2;
    }else if(!val.preorder_amount) {
      return 3;
    }else {
      return 4;
    }
  }

  const showText = (status) => {
    if(status == 0) {
    return <div className="text-stock">{t('soon')}</div>;
    }else if(status == 1) {
      return <div className="text-stock">{t('soon')}</div>;
    }else if(status == 2) {
      return <div className="text-stock">{t('close')}</div>;
    }else if(status == 3) {
      return <div className="text-stock">{t('out_stock')}</div>;
    }else{
      return;
    }
  }

  const product_name = encodeURIComponent(product && product.name.trim().replace(/\//g, '-'))
  // console.log(product);

  return (
    freespace ? <><div className={"card-book nonecard" + _class}></div> </> : 
    <Link {...tools.getUrlProduct(product)} >
      <a className={"card-book " + _class}>
        <div className="d-flex justify-content-between mb-2 align-items-center">
          <div className="d-flex align-items-center">
            <img alt="ศูนย์หนังสือจุฬาฯ" src={product ? (product.seller_id != 'cu' ? product.seller_picture : `/mobile/image/icon/icon-cu.svg`) : ''} className="icon-card-seller" /> 
            <p className="text-publisher m-0 ml-2">{product ? (product.seller_id != 'cu' ? product.shop_name : "CHULABOOK") : ''}</p>
          </div>
          <div className="d-flex">
            {
              product && (
                isFavorite() ? (
                  <img src={'/mobile/image/icon/icon-fav.svg'} alt="ศูนย์หนังสือจุฬาฯ" className="float-right img-fluid my-auto size-16" onClick={(e) => { addFavorite(e, product.id) }} />
                ) : (
                  <img src={'/mobile/image/icon/icon-unfav.svg'} alt="ศูนย์หนังสือจุฬาฯ" className="float-right img-fluid my-auto size-16" onClick={(e) => { addFavorite(e, product.id) }} />
                  )
              )
            }

            
          </div>
        </div>
        <div className={classnames("book-image-area mb-2 card-img-mobile", 
            product.preorder ? (checkDate(product) != 4 ? 'set-stock' : '') : (((product.stock && product.stock > product.reserve_stock) || product.type == "ebook" || product.type == 'course') ? '' : 'set-stock'))}>
          <div className={classnames("area-book",{"p-0": (product.picture && product.type == "non_book"  )})}>
            {
              (product.video_type == 0 || product.video_type == null) && (
                <>
                  {
                    product.preorder ? (
                      <>
                        <img className="shadow-book" src={product.picture ? product.picture : '/mobile/image/product/book.png'} alt={product.name} />
                        <img src='/mobile/image/pre_order.svg' className="img-stock" alt={product.name} />
                      </>
                    ) : (
                          product.type == "non_book" ? (
                            <img src={product.picture ? product.picture : '/mobile/image/product/book.png'} className="mh-100 mw-100" alt={product.name} />
                          ) : (
                            <>
                              <img className="shadow-book" src={product.picture ? product.picture : '/mobile/image/product/book.png'} alt={product.name} />
                              {
                                product.type == 'ebook' && (
                                  <img src='/mobile/image/ebook.svg' className="img-stock" alt={product.name} />
                                )
                              }
                              {
                                product.type == 'course' && (
                                  <img src='/mobile/image/course.svg' className="img-stock" alt={product.name} />
                                )
                              }
                            </>
                          )
                        )
                  }
                </>
              )
            }
            {
              product.video_type == 1 && (
                <>
                  <video controls className="w-100 video" >
                    <source src={product.picture ? product.picture : '/mobile/image/product/book.png'} type="video/mp4" />
                    <source src={product.picture ? product.picture : '/mobile/image/product/book.png'} type="video/ogg" />
                  </video>
                  {
                    product.preorder && (
                      <img src='/mobile/image/pre_order.svg' className="img-stock" alt="ศูนย์หนังสือจุฬาฯ" />
                    )
                  }
                </>
              )
            }
            {
              product.video_type == 2 && (
                <>
                  <iframe className="mh-100 w-100 video" src={youtube}
                    frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  >
                  </iframe>
                  {
                    product.preorder && (
                      <img src='/mobile/image/pre_order.svg' className="img-stock" alt="ศูนย์หนังสือจุฬาฯ" />
                    )
                  }
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
              <div className="badge-pro"><img src={`/mobile/icon/promotion.svg`} /></div>
            ) : null
          }
        </div>
        <h3 className="text-name-of-book h-40px text-h3">{product.name}</h3>
        <p className="text-author text-h6-p ">{(product.type == 'book' || product.type == 'ebook') ? (`${t("author")} : ${product.author}`) : ''}</p>
        <p className={classnames("text-pink font-weight-bold text-h5-p",{"text-ebook": (product.type == "ebook"),"text-stationery":(product.type == "non_book"),"text-course":(product.type == "course")})}>{product.price?  '฿ '+currencyFormatDE(product.price ) : 'Free'}</p>
        {
           product.cover_price > product.price ? (
            <p className="text-disable font-weight-bold mr-2 text-h5-p"><s><span>฿</span> {currencyFormatDE(product.cover_price)}</s></p>
           ) : (
            <p className="text-disable font-weight-bold mr-2 text-h5-p"><span>฿</span> {currencyFormatDE(product.cover_price)}</p>
           )
        }
        
      </a>
    </Link>
  );
}
export default withTranslation('mobile_card')(CardGrid)