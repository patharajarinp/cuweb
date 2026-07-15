// import myData from '../../../public/json/raw_database.json';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Rating from 'react-rating';
import Sidenav from '../../../components/user/sidenav';
import api from '../../../utils/api';
import AuthService from '../../../utils/AuthService';
import { withTranslation } from '../../../utils/i18n';
import tools from '../../../utils/tools';

const ReadReview = (props) => {
  const { t} = props;

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  const [user, setUser] = useState();
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
  },[]);


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
      <Sidenav user={user} page="review" >
        <div className="box-main-account">
          <div className="row mx-0 px-0">
            <div className="mt-2 mb-4">
              <h6 className="text-black">อ่านรีวิว</h6>
            </div>
            {/* <div className="col-12 px-0">
              <div className="main">
                <div className="">
                  <div className="">
                    <h4 className="">อ่านรีวิว</h4>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
          <div className="row mx-0 px-0">
            <div className="col-12 px-0">
              <div className="border-detail">
                <div className="p-3 d-flex justify-content-between align-items-center header-detail">
                  <div>
                    <p className="font-weight-bold">{t("product_quality")}</p>
                    <p>{t('order_date')} {order ? tools.formatDate(order.createdAt) : ''}</p>
                  </div>
                </div>
                <div className="border-bottom"></div>
                <div className="p-3">
                  <div className="row justify-content-start">
                    <div className="col-2">
                      {
                        product && (
                          <div className="img-detail">
                          {
                            (product.video_type == 0 || product.video_type == null) && (
                              <img src={product.picture ? product.picture : '/images/book.png'} className="mh-100" />
                            )
                          }
                          {
                            (product.video_type == 1 || product.video_type == 2) && (
                              <img src={'/images/video.svg'} className="mh-100 video" />
                            )
                          }
                          {/* <img src={product ? (product.picture ? product.picture : '/images/book.png') : ''} className="mh-100" /> */}
                        </div>
                        )
                      }
                      {/* <div className="img-detail">
                        <img src={product ? (product.picture ? product.picture : '/images/book.png') : ''} className="mh-100" />
                      </div> */}
                    </div>
                    <div className="col-6">
                      <p className="font-weight-bold mb-0">{product ? (product.name ? product.name : '') : ''}</p>
                      <p>{product ? (product.author ? product.author : '') : ''}</p>
                      <div>
                        <Rating
                          emptySymbol="far fa-star font-star"
                          fullSymbol="fas fa-star font-star"
                          fractions={1}
                          initialRating={reviews ? reviews.rating : ''}
                          readonly="true"
                        />
                      </div>
                      <div className="mt-4">
                        <form onSubmit={handleSave} encType="multipart/form-data">
                          <div className="form-group">
                            <input type="hidden" name="order_id" value={order_id} />
                          </div>
                          <div className="form-group">
                            <input type="hidden" name="product_id" value={product_id} />
                          </div>
                          <div className="form-group">
                            <input type="hidden" name="rating" value={star} />
                          </div>
                          <div className="form-group">
                            <label className="font-weight-bold">{t("leave_comment")}</label>
                            <p>{reviews ? reviews.review_text : ''}</p>
                          </div>
                          <div className="form-group">
                            {
                              reviews ? (
                                reviews.image ? (
                                  <div className="position-relative">
                                    <div className="review-img-upload">
                                      <img src={reviews.image} className="img-middle" />
                                    </div>
                                  </div>
                                ) :''
                              ) : ''
                            }
                            
                          </div>
                          {/* <button type="submit" className="btn btn-primary mt-4">บันทึก</button> */}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div> 
      </Sidenav>
    </>
  )
}

export default ReadReview