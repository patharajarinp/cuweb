import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Rating from 'react-rating';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { withTranslation, Link } from '../../../../utils/i18n';

const MobileReadReview = (props) => {
  const { t } = props;
  

  const [order, setOrder] = useState();
  const [product, setProduct] = useState();
  const [review_id, setReviewID] = useState();
  const [reviews, setReview] = useState();
  const [sum, setSum] = useState();
  const [amount, setAmount] = useState();
  const [star, setStar] = useState(5);
  const [img, setImg] = useState();
  
  const router = useRouter();
  const order_id = router.query.order_id;
  const product_id = router.query.product_id

  const fetchUser = () => {
    api.getProfile().then(res =>{
        const data = res.data;
        setUser(data);
    })
    .catch(err =>{
      console.log(err.response);
    })
  };

  const fetchProduct = () => {
    api.getProductOne(product_id).then(res =>{
        const data = res.data;
        setProduct(data);
    })
    .catch(err =>{
      console.log(err.response);
    })
  };


  const  fetchDetail = () => {
    api.getOrderDetail(order_id).then(res =>{
        const data = res.data;
        setOrder(data);
        var sum = 0;
        var num = 0;
        data.products.map((val, index) => {
          sum += val.quantity * val.price;
          num += val.quantity;
        })
        setSum(sum);
        setAmount(num);
    })
    .catch(err =>{
      console.log(err.response);
    })
  };

  const fetchReviewID = () => {
    const id = AuthService.getProfile().id;
    api.getOrderReview({user_id:id,order_id,product_id})
    .then(res =>{
      const data = res.data;
      setReviewID(data.rows[0].id);
      // ;
    })
    .catch(err =>{
      console.log(err.response);
    })
  }

 
  useEffect(() => {
    fetchReview();
  },[review_id]);

  const fetchReview = () => {
    if(!review_id) {
      return;
    }
    // const id = AuthService.getProfile().id;
    api.getOrderReviewOne(review_id)
    .then(res =>{
      const data = res.data;
      setReview(data);
      //;
    })
    .catch(err =>{
      console.log(err.response);
    })
  }

  useEffect(() => {
    fetchUser();
    fetchDetail();
    fetchProduct();
    fetchReviewID();
    // fetchReview();
    document.body.style.backgroundColor = "#F2F2F2";
  },[]);

  const Datemonth = ['{t("january")}', '{t("february")}', '{t("march")}', '{t("april")}', 
  '{t("may")}', '{t("june")}', '{t("july")}', '{t("august")}', '{t("september")}', '{t("october")}', '{t("november")}', '{t("december")}'];

  const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hours = '' +d.getHours(),
        minutes = '' +d.getMinutes(),
        second = '' +d.getSeconds();
        
    Datemonth.map((val, index) => {
      // console.log(val);
      if((month - 1) == index){
        month = val;
      }
    })
    if (day.length < 2) 
        day = '0' + day;
    if (hours.length < 2) 
        hours = '0' + hours;
    if (minutes.length < 2) 
        minutes = '0' + minutes;
    if (second.length < 2) 
        second = '0' + second;
  
    var dataDate = [day, month, (year + 543)].join(' ');
    var dataTime = [hours, minutes, second].join(':');
    return dataDate + ' ' + dataTime;
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

  const rating = (rate) => {
    setStar(rate);
  }

  const uploadImg = () => {
    var img = document.getElementById("image");
    img.click();
    // console.log(img.click());
  }

  const handleChange = (event) => {
    if(event.target.files[0]){
      setImg(URL.createObjectURL(event.target.files[0]));
    }
  }
  const deleteImg = () => {
    var img = document.getElementById("image").value = '';
    setImg('');
  }

  const handleSave = () => {
    // const data = new FormData(event.target)
    // event.preventDefault();
    // const id = AuthService.getProfile().id;
    // api.insertReview(id, data)
    // .then(res=>{
    //   const data = res.data;
    //   Router.push('/user/review');
    //   //;
    //   //alert('สำเร็จ');
    // })
    // .catch(err => {
    //   console.log(err.response);
    // })
  }

  //console.log(order);
  return ( 
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
            <h4 className="text-black">{t("mobile_review:my_review")}</h4>
        </div>
        <Link href="/user/review">
            <a className="btn-back cart-nav-back">
                <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
            </a>
        </Link>
        {/* <Link href="/user/review/write-review">
            <h3 className="btn-right-nav">แก้ไข</h3>
        </Link> */}
    </div>

    <div className="bg-light-less-gray min-vh-100">
        <div className="h-64px">

        </div>
        <div className="container bg-white pb-2 mt-3 ">
            <div className=" row order-border">
                <div className="order-publisher">
                    <div className="d-flex">
                        <h4 className="my-auto text-black">{t("mobile_review:product_quality")}</h4>
                    </div>
                </div>
            </div>
            <div className="product-in-cart border-0 pb-2">
                <div className="product-in-cart-pic-area">
                    <div className="product-in-cart-pic ">
                        <img className="img-fluid" src={product ? (product.picture ? product.picture : '/mobile/image/book.png') : ''} />
                    </div>
                </div>
                <div className="product-in-cart-content">
                    <h4 className="text-black two-line mb-0">{product ? (product.name ? product.name : '') : ''}</h4>
                    <p>{product ? (product.author ? product.author : '') : ''}</p>
                </div>
            </div>
            
                <div className="form-group">
                  <input type="hidden" name="order_id" value={order_id} />
                </div>
                <div className="form-group">
                  <input type="hidden" name="product_id" value={product_id} />
                </div>
                <div className="form-group">
                  <input type="hidden" name="rating" value={star} />
                </div>
                <div className="w-100 clearfix">
                    
                        <div className="rate ">
                        <Rating
                            emptySymbol="far fa-star font-star"
                            fullSymbol="fas fa-star font-star"
                            fractions={1}
                            initialRating={star}
                            onClick={(rate) => rating(rate)}
                            readonly="true"
                        />
                            {/* <input type="radio" id="star5_01" name="rating" value="5" />
                            <label htmlFor="star5_01" title="text"></label>
                            <input type="radio" id="star4_01" name="rating" value="4" />
                            <label htmlFor="star4_01" title="text"></label>
                            <input type="radio" id="star3_01" name="rating" value="3" />
                            <label htmlFor="star3_01" title="text"></label>
                            <input type="radio" id="star2_01" name="rating" value="2" />
                            <label htmlFor="star2_01" title="text"></label>
                            <input type="radio" id="star1_01" name="rating" value="1" />
                            <label htmlFor="star1_01" title="text"></label> */}
                        </div>
                    
                </div>
                <div className="w-100 clearfix">
                  <div className="form-group">
                    <label className="font-weight-bold">{t("mobile_review:leave_comment")}</label>
                    <p>{reviews ? reviews.review_text : ''}</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between py-3">
                    <div align="left" style={{ height: "72px", width: "72px" }}>
                    {
                      reviews ? (
                        reviews.image ? (
                          <div className="img-preview-return">
                            <img src={reviews.image} alt="preview" className="img-preview-on" />
                          </div>
                        ) :''
                      ) : ''
                    }
                        {/* <label htmlFor="upload-button">
                            {
                                image.preview ? <div className="img-preview-return"><img src={image.preview} alt="preview" className="img-fluid my-auto " /></div> : (
                                    <>
                                        <div className="input-image-return">
                                            <i className="fas fa-plus fa-stack-1x fa-inverse text-grey my-3"><h5 className="text-center">{t("photo")}</h5></i>
                                        </div>

                                    </>
                                )
                            }
                        </label>
                        <input type="file" name="image" id="upload-button" style={{ display: 'none' }} onChange={handleChangeimage} /> */}
                        <br />
                    </div>
                    {/* <div align="left" style={{ height: "72px", width: "72px" }}>
                        <label htmlFor="upload-button2">
                            {
                                image2.preview2 ? <div className="img-preview-return"><img src={image2.preview2} width="72" height="72" alt="preview" className="img-fluid my-auto" /></div> : (
                                    <>
                                        <div className="input-image-return">
                                            <i className="fas fa-plus fa-stack-1x fa-inverse text-grey my-3"><h5 className="text-center">{t("photo")}</h5></i>
                                        </div>

                                    </>
                                )
                            }
                        </label>
                        <input type="file" id="upload-button2" style={{ display: 'none' }} onChange={handleChangeimage2} />
                        <br />
                    </div>
                    <div align="left" style={{ height: "72px", width: "72px" }}>
                        <label htmlFor="upload-button3">
                            {
                                image3.preview3 ? <div className="img-preview-return"><img src={image3.preview3} width="72" height="72" alt="preview" className="img-fluid my-auto" /></div> : (
                                    <>
                                        <div className="input-image-return">
                                            <i className="fas fa-plus fa-stack-1x fa-inverse text-grey my-3"><h5 className="text-center">{t("photo")}</h5></i>
                                        </div>

                                    </>
                                )
                            }
                        </label>
                        <input type="file" id="upload-button3" style={{ display: 'none' }} onChange={handleChangeimage3} />
                        <br />
                    </div>
                    <div align="left" style={{ height: "72px", width: "72px" }}>
                        <label htmlFor="upload-button4">
                            {
                                image4.preview4 ? <div className="img-preview-return"><img src={image4.preview4} width="72" height="72" alt="preview" className="img-fluid my-auto" /></div> : (
                                    <>
                                        <div className="input-image-return">
                                            <i className="fas fa-plus fa-stack-1x fa-inverse text-grey my-3"><h5 className="text-center">{t("photo")}</h5></i>
                                        </div>

                                    </>
                                )
                            }
                        </label>
                        <input type="file" id="upload-button4" style={{ display: 'none' }} onChange={handleChangeimage4} />
                        <br />
                    </div> */}
                </div>
            
            
        </div>
        <div className="footer-space"></div>
    </div >
    </>
  )
}

export default MobileReadReview