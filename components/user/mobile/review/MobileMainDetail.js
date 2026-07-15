import Filter from 'bad-words';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Rating from 'react-rating';
import { BeatLoader } from "react-spinners";
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { withTranslation, Link, Router } from '../../../../utils/i18n';

const MobileMainDetail = (props) => {
  const { t } = props;
  const [image, setImage] = useState({ preview: '', raw: '' })
  const [order, setOrder] = useState();
  const [product, setProduct] = useState();
  const [sum, setSum] = useState();
  const [amount, setAmount] = useState();
  const [star, setStar] = useState(5);
  const [img, setImg] = useState();
  const [bad, setBad] = useState();
  const [settings, setSetting] = useState();
  const [loading, setLoading] = useState(false)


  const router = useRouter();
  const order_id = router.query.order_id;
  const product_id = router.query.product_id

  const handleChangeimage = (e) => {
    setImage({
      preview: URL.createObjectURL(e.target.files[0]),
      raw: e.target.files[0]
    })
  }
  const [image2, setImage2] = useState({ preview2: '', raw2: '' })

  const handleChangeimage2 = (e) => {
    setImage2({
      preview2: URL.createObjectURL(e.target.files[0]),
      raw2: e.target.files[0]
    })
  }
  const [image3, setImage3] = useState({ preview3: '', raw3: '' })

  const handleChangeimage3 = (e) => {
    setImage3({
      preview3: URL.createObjectURL(e.target.files[0]),
      raw3: e.target.files[0]
    })
  }
  const [image4, setImage4] = useState({ preview4: '', raw4: '' })

  const handleChangeimage4 = (e) => {
    setImage4({
      preview4: URL.createObjectURL(e.target.files[0]),
      raw4: e.target.files[0]
    })
  }
  const [image5, setImage5] = useState({ preview5: '', raw5: '' })

  const handleChangeimage5 = (e) => {
    setImage5({
      preview5: URL.createObjectURL(e.target.files[0]),
      raw5: e.target.files[0]
    })
  }
  const [image6, setImage6] = useState({ preview6: '', raw6: '' })

  const handleChangeimage6 = (e) => {
    setImage6({
      preview6: URL.createObjectURL(e.target.files[0]),
      raw6: e.target.files[0]
    })
  }
  const [image7, setImage7] = useState({ preview7: '', raw7: '' })

  const handleChangeimage7 = (e) => {
    setImage7({
      preview7: URL.createObjectURL(e.target.files[0]),
      raw7: e.target.files[0]
    })
  }
  const [image8, setImage8] = useState({ preview8: '', raw8: '' })

  const handleChangeimage8 = (e) => {
    setImage8({
      preview8: URL.createObjectURL(e.target.files[0]),
      raw8: e.target.files[0]
    })
  }
  const handleUpload = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('image', image.raw)
    const config = { headers: { 'content-type': 'multipart/form-data' } }

    try {
      await axios.post('http://localhost:3000/upload', { image: image.raw }, config)
    } catch (error) {
      console.log(error.response)
    }
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


  const fetchSetting = () => {
    api.getSetting(1)
    .then(res=>{
      const data = res.data;
      ;
      setSetting(data);
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
    fetchDetail();
    fetchProduct();
    getBadword();
    fetchSetting();
  },[]);

  const handleSave = (event) => {
    setLoading(true)
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
      alert(t("polite_words"));
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
        setLoading(false)
        const data = res.data;
        Router.push('/user/review');
      })
      .catch(err => {
        setLoading(false)
        console.log(err.response);
      })
    }
  }
  const rating = (rate) => {
    setStar(rate);
  }

  return ( 
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
            <h4 className="text-black">{t("write_review")}</h4>
        </div>
        <Link href="/user/review">
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
        </Link>
      </div>
    <form onSubmit={handleSave} id="saveReview" encType="multipart/form-data">
      <div className="bg-light-less-gray min-vh-100">
        <div className="h-64px"></div>
        <div className="container bg-white pb-2 mt-3 ">
            <div className=" row order-border">
                <div className="order-publisher">
                    <div className="d-flex">
                        <h4 className="my-auto text-black">{t("product_quality")}</h4>
                    </div>
                </div>
            </div>
            <div className="product-in-cart border-0 pb-2">
                <div className="product-in-cart-pic-area">
                    <div className="product-in-cart-pic ">
                        <img className="img-fluid" src={product ? (product.picture ? product.picture : '/image/book.png') : ''} />
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
                        />
                        </div>
                    
                </div>
                <div className="w-100 clearfix">
                    <div className="info-creditcard-100 mt-4 mb-3">
                        <input className="effect-16 " name="review_text" type="text" placeholder="" required />
                        <label>{t("leave_comment")}</label>
                        <span className="focus-border"></span>
                    </div>
                </div>
                <div className="d-flex justify-content-between py-3">
                    <div align="left" style={{ height: "72px", width: "72px" }}>
                        <label htmlFor="upload-button">
                            {
                                image.preview ? <div className="img-preview-return"><img src={image.preview} alt="preview" className="img-preview-on" /></div> : (
                                    <>
                                        <div className="input-image-return">
                                            <i className="fas fa-plus fa-stack-1x fa-inverse text-grey my-3"><h5 className="text-center">{t("photo")}</h5></i>
                                        </div>

                                    </>
                                )
                            }
                        </label>
                        <input type="file" name="image" id="upload-button" style={{ display: 'none' }} onChange={handleChangeimage} />
                        <br />
                    </div>
                </div>
            
            
        </div>
        <div className="footer-space"></div>
      </div >
      <button type="submit" className="btn-primary btn-pink-submit text-white on-footer" disabled={loading}><h4 className="m-auto">{loading ? <BeatLoader size={10} color={"#FFF"} loading={loading} /> : t("save")}</h4></button>
    </form>
    </>
  )
}

export default MobileMainDetail