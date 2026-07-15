import React, { useEffect, useState,useContext } from 'react';
import { UncontrolledCarousel } from 'reactstrap';
import Navbar from '../../../components/mobile/layout/Navbar';
import CardPH from '../../../components/mobile/shimmer/Card';
import CardGrid from '../../../components/mobile/widget/Card';
import api from '../../../utils/api';
import { Link, withTranslation } from '../../../utils/i18n';
import UserContext from '../../../contexts/UserContext';
import classnames from "classnames";

const MobileMainMarketplace = (props) => {
  const {t} = props;
  const {local} = useContext(UserContext)
  const [img, setImg] = useState();
  const [productsBestSeller, setBestSeller] = useState();
  const [newProducts, setNewProducts] = useState();
  const [recommend, setRecommend] = useState([]);
  const [recGroup,setRecGroup] = useState([]);
  const [voucher , setVoucher] = useState();
  const [shop, setShop] = useState([]);

  const fetchPage = () => {
    var page = 'marketplace';
    var vendor = 'cu';
    api.getBanner(page, vendor).then(res => {
      const data = res.data;
      var items = [];
      data.banner_images.forEach((item,index) => {
        if (item.index != 5)
          return true;
        let temp = {
          src: item.image,
          key: 'banner' + item.id,
          altText: 'banner '+item.id,
          caption: '',
        }

        items.push(temp)
      });
      setImg(items)
    })
      .catch(err => {
        console.log(err.response);
      })
  }

  const fetchShop = () => {
    api.getShop().then(res => {
      const data = res.data;
      setShop(data);
    })
      .catch(err => {
        console.log(err.response);
      })
  };

  const fetchBestSeller = () => {
    var key = 'best-seller-mkp';
    api.getRecProductByKey(key,{ limit: 10 }).then(res => {
      const data = res.data;
      setBestSeller(data.rows);
    })
      .catch(err => {
        console.log(err.response);
      })
  };

  const fetchNewProducts = () => {
    var key = 'new_products_mkp';
    api.getRecProductByKey(key, { limit: 10 }).then(res => {
      const data = res.data;
      setNewProducts(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  };

  const fetchRecommend = () => {
    api.getRecommend({ type: 'rec_marketplace',prod_limit : 12 }).then(res => {
      const data = res.data;
      console.log('data',data)
      setRecommend(data);
      
    })
    .catch(err => {
      console.log(err)
      console.log(err.response);
    })
  };

  const fetchVoucher = ()=>{
    api.getVoucher({ key: 'marketplace' }).then(res => {
      setVoucher(res.data)
    })
    .catch(err => {
      console.log(err)
      console.log(err.response);
    })
  }

  const fetchRecommendGroup = () =>{
    api.getRecommend({ type: 'rec_mkp', prod_limit : 10 }).then(res => {
      setRecGroup(res.data)
    })
    .catch(err => {
      console.log(err)
      console.log(err.response);
    })
  }

  useEffect(() => {
    fetchShop();
    fetchPage();
    fetchBestSeller();
    fetchRecommend();
    fetchVoucher();
    fetchRecommendGroup();
    fetchNewProducts();
    document.body.style.backgroundColor = "#FFFFFF";
  }, []);

 
  return (
    <>
      <Navbar />
      <div className="padding-top-for-box"></div>
      {img && <UncontrolledCarousel items={img} captionText="Banner" />}
      {
        shop?.length > 0 && (
          <div className="alliance-area bg-light-less-gray">
            <div className="container py-3">
              <div className="d-flex justify-content-start all-card-book">
                {
                  shop ? shop.map((val, index) => (
                    <Link href={`/seller/[seller_name]?seller_name=${val.seller?.shop_name}`} as={`/seller/${val.seller?.shop_name}`} key={index}>
                      <a className="card-alliance seller mr-2">
                        <img className="img-fluid m-auto mh-100" src={val.seller?.picture} alt={val.alt_image || val.seller?.shop_name} />
                      </a>
                    </Link>
                  )) : ''
                }
                <div className="card-alliance nonecard"></div>
              </div>
            </div>
          </div>
        )
      }
      {
        productsBestSeller?.length > 0 && (
          <div className="all-card-book-none-text-left">
            <div className="container py-3">
              <div className="d-flex justify-content-between ">
                <div>
                  <h4 className="text-black">{t('best_seller_product')}</h4>
                </div>
                <Link href={`/recommend/[key]?key=best-seller-mkp`} as={`/recommend/best-seller-mkp`}>
                  <a ><p className="text-pink see-all-link">{t('translations:view_all')}</p></a>
                </Link>
              </div>
              <div className="d-flex justify-content-start all-card-book">
                {
                  productsBestSeller ? (productsBestSeller.length > 0 ? productsBestSeller.map((product, index) => <CardGrid product={product} key={index} />) : (<div>{t("data_not_found")}</div>)) : <CardPH show={4} />
                }<CardGrid freespace={true} />
              </div>
            </div>
          </div>
        )
      }
      
      {
        newProducts?.count > 0 && (
          <div className="all-card-book-none-text-left">
            <div className="container py-3">
              <div className="d-flex justify-content-between ">
                <div>
                  <h4 className="text-black">{t('new_product')}</h4>
                </div>
                <Link href={`/recommend/[key]?key=new_products_mkp`} as={`/recommend/new_products_mkp`}>
                  <a ><p className="text-pink see-all-link">{t('translations:view_all')}</p></a>
                </Link>
              </div>
              <div className="d-flex justify-content-start all-card-book">
                {
                  newProducts ? (newProducts.count > 0 ? newProducts.rows.map((product, index) => <CardGrid product={product} key={index} />) : (<div>{t("data_not_found")}</div>)) : <CardPH show={4} />
                }<CardGrid freespace={true} />
              </div>
            </div>
          </div>  
        )
      }
      


      {
        recGroup ? (recGroup.length > 0 ? (
          <>
            <div className="bg-light-less-gray pt-3">
              <div className="bg-white ">
                <div className="container ">
                  <div className="d-flex justify-content-between py-3 bg-white">
                    <div>
                      <h4 className="text-black m-0">{t('translations:recommended_mkp')}</h4>
                    </div>
                    <Link href="/main-category-recommend-mkp">
                      <a ><p className="text-pink see-all-link m-0 ">{t('translations:view_all')}</p></a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {
              recGroup.map((val, index) => (
                <div key={'seawrite' + index} className={classnames("all-card-book-has-headline", { "bg-seawrite": (val.key == "seawritebooks"), "bg-novel": (val.key == "50_literature_should_read") })}  /* style={{background: `url(${val.image_mobile})`, width:"100%" }} */>
                  <img className="h-100" src={val.image_mobile} alt="ศูนย์หนังสือจุฬาฯ" />
                  <div className="container py-3 all-card-book-has-headline-content">
                    <div className="d-flex justify-content-start all-card-book">
                      {/* <Link href={`/recommend/[key]?key=${val.key}`} as={`/recommend/${val.key}`}>
                        <a className="box-headline mr-2">
                        </a>
                      </Link> */}
                      {
                        val.products && val.products.map((product, index) => <CardGrid product={product} show={4} key={index} />)
                      }
                        <CardGrid freespace={true} />
                    </div>
                  </div>
                </div>
              ))
            }
          </>
        ) : '') :
          (
            <>
            </>
          )
      }

      {recommend.map(cat => (
        <div className="all-card-book-none-text-left" key={cat.key}>
        <div className="container py-3">
          <div className="d-flex justify-content-between ">
            <div>
              <h4 className="text-black">{cat['name_'+local]}</h4>
            </div>
            {cat.products.length > 10 && (
              <Link href={`/recommend/[key]?key=${cat.key}`} as={`/recommend/${cat.key}`} >
              <a ><p className="text-pink see-all-link">{t("translations:view_all")}</p></a>
            </Link>
            )}
            
          </div>
          <div className="d-flex justify-content-start all-card-book">
            {
              cat.products.map((product) => <CardGrid product={product} key={product.id} />) 
            }
          </div>
        </div>
      </div>
      )
      )}

      {
        voucher ? voucher.rows.map((val, index) => (
          <div className="promotion-area bg-light-less-gray mb-0 pb-0" key={index}>
            <img className="img-fluid invisible-landscape" src={val.image_mobile} alt="ศูนย์หนังสือจุฬาฯ" />
          </div>
        )) :

          ''
      }
      
      <div style={{height:'100px'}}></div>
  
    </>
  )
}
export default MobileMainMarketplace