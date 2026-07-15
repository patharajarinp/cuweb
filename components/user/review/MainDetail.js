import React, { useState,useEffect } from 'react'
import api from '../../../utils/api';
import Sidenav from '../../../components/user/sidenav'
import AuthService from '../../../utils/AuthService'
import tools from '../../../utils/tools'
import Router, { useRouter } from 'next/router'
import classNames  from 'classnames';
import Rating from 'react-rating';
import Filter from 'bad-words';
import ConfirmDialog from '../../../components/ConfirmDialog'
import { Link, withTranslation } from '../../../utils/i18n'
import Loadbutton from '../../../components/widget/Button'

const MainDetail = (props) => {
  const { t} = props;

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  const [loading, setLodding] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const [user, setUser] = useState();
  const [order, setOrder] = useState();
  const [product, setProduct] = useState();
  const [sum, setSum] = useState();
  const [amount, setAmount] = useState();
  const [star, setStar] = useState(5);
  const [img, setImg] = useState();
  const [bad, setBad] = useState();
  const [settings, setSetting] = useState();
  
  const router = useRouter();
  const order_id = router.query.order_id;
  const product_id = router.query.product_id

  console.log('order_id',order_id)

  const fetchSetting = () => {
    api.getSetting(1)
    .then(res=>{
      const data = res.data;
      setSetting(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  }
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

  const getBadword = () => {
    api.getBadword(1)
    .then(res=>{
      const data = res.data;
      ;
      setBad(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  }


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

  useEffect(() => {
    fetchUser();
    fetchDetail();
    fetchProduct();
    getBadword();
    fetchSetting();
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
    setLodding(true);
    var data = new FormData(event.target)
    event.preventDefault();
    const id = AuthService.getProfile().id;
    data.append('user_id',id);
    var text = data.get('review_text');
    var filter = new Filter({ regex: /\*|\.|$/gi });
    if(bad){
      var val_en = bad.detail_en;
      var word_en = val_en.split(",");
      word_en.forEach(val => {
        filter.addWords(val);
      });

      var val_th = bad.detail_th;
      var word_th = val_th.split(",");
      var found = false;
      for(var i = 0; i < word_th.length; i++) {
        const v = word_th[i]
        if(text.search(v) !=  -1){
          found = true
          break;
        }
      }
    }
    
    var Ntext = filter.clean(text);
    var find = Ntext.includes('*');
    if(find || found) {
      setModalShow(true)
    }else{
      if(settings) {
        if(settings.setting_review == 1) {
          data.append('status', 1);
        }else{
          data.append('status', 0);
        }
     
      }
      api.insertReview(data)
      .then(res=>{
        const data = res.data;
        Router.push('/user/review');
        setLodding(false);
      })
      .catch(err => {
        setLodding(false);
        console.log(err.response);
      })
    }
  }

  const onConfirm = ()=>{
    setModalShow(false);
  }

  return ( 
    <>
      <Sidenav user={user} page="review" >
        <div className="box-main-account">
          <div className="row mx-0 px-0">
            <div className="col-12 px-0">
              <div className="mt-2 mb-4">
                <h6 className="text-black">{t("write_review")}</h6>
              </div>
              {/* <div className="main">
                <div className="">
                  <div className="">
                    <h4 className="">เขียนรีวิว</h4>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className="row mx-0 px-0">
            <div className="col-12 px-0">
              <div className="border-detail">
                <div className="p-3 d-flex justify-content-between align-items-center header-detail">
                  <div>
                    <p className="font-weight-bold">{t("product_quality")}</p>
                    <p>สั่งซื้อวันที่ {order ? tools.formatDate(order.createdAt) : ''}</p>
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
                      
                    </div>
                    <div className="col-6">
                      <p className="font-weight-bold mb-0">{product ? (product.name ? product.name : '') : ''}</p>
                      <p>{product ? (product.author ? product.author : '') : ''}</p>
                      <div>
                        <Rating
                          emptySymbol="far fa-star font-star"
                          fullSymbol="fas fa-star font-star"
                          fractions={1}
                          initialRating={star}
                          onClick={(rate) => rating(rate)}
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
                            <textarea className="form-control" name="review_text" rows="5" required></textarea>
                          </div>
                          <div className="form-group d-none">
                            <label className="font-weight-bold">{t("upload")}</label>
                            <input type="file" name="image" id="image" onChange={handleChange} accept="image/png, image/jpeg, image/gif, image/jpg" />
                          </div>
                          <div className="form-group">
                            {
                              img ? (
                                <div className="position-relative">
                                  <div className="review-img-upload">
                                    <img src={img} className="img-middle" onClick={uploadImg} />
                                    <div className="manage-backdrop" onClick={uploadImg}></div>
                                    <div className="manage-img" onClick={uploadImg}>
                                      <i className="fas fa-pen-square"></i>
                                    </div>
                                    <a className="text-pink text-delete" onClick={deleteImg}>ลบ</a>
                                  </div>
                                  
                                  
                                </div>
                              ) : (
                                <div className="d-flex align-items-center">
                                  <div className="review-img" onClick={uploadImg}>
                                    <img src="/images/set-image.png" className="img-middle" />
                                  </div>
                                  <a className="font-weight-bold mb-0 pl-4" onClick={uploadImg}>{t("upload")}</a>
                                </div>
                              )
                            }
                            
                          </div>
                          
                        
                          <Loadbutton loading={loading} name={t('save')} type="submit" classNmae="w-auto" />
                            
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div> 
        <ConfirmDialog show={modalShow} 
        text="กรุณาใช้คำสุภาพ" 
        onConfirm={onConfirm}
        size="md" onHide={handleModalClose}
        cancel_btn={false}/>
        
      </Sidenav>
    </>
  )
}

export default MainDetail