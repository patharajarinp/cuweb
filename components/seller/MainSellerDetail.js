import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Banner from '../../components/banner';
import ProductFilter from '../../components/product/ProductFilter';
import Logo from '../../components/seller/Logo';
import UserContext from '../../contexts/UserContext';
import api from '../../utils/api';
import MainFilter from '../filter/MainFilter';

const MainSellerDetail = (props) => {
  const { query, seller, t, setLoading, products } = props;
  const [productType, setProductType] = useState();
  const [img, setImg] = useState();

  const { local } = useContext(UserContext)
  const router = useRouter()
  const seller_name = router.query.seller_name

  var preview = null;
  if(router.query.preview) {
    preview = router.query.preview;
  }
  const pathname = `/seller/[seller_name]`;

  const fetchSeller = () => {
    if(!seller) return;
    // setLoading(true);
    var name = seller_name;
    api.getSellerBanner(name, {live : preview ? 0 : 1}).then(res =>{
      const data = res.data;
      setProductType(data.type);
      setImg(data.banner_images);
      // setLoading(false);
    })
    .catch(err =>{
      console.log(err.response);
      // setLoading(false);
    })
  }

  useEffect(() => {
    fetchSeller();
  },[]);

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);
 
	return (
		<>
      {
        seller ? (
          <>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <Logo seller={seller} preview={preview} />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <Banner data={img} type={productType} />
            </div>
          </div>
          <MainFilter 
            setLoading={setLoading} type={"categories"} breadcrumb={false} level={0} page_path={`categories`} 
            t={t} query={query} pathname={pathname} local={local} products={products} show_all={true}
            seller={seller}
            isSeller={seller ? true : false}
            shop_name={seller ? seller.shop_name : null}
            seller_page={true}
            
          />
          {/* <ProductFilter q={query} seller_id={seller && seller.id} pathname={pathname} t={t} local={local} setLoading={setLodding} isSeller={true} seller_preview={preview} /> */}
          </>
        ):
        (
          <div className="container">
            <div className="row my-5">
              <div className="col-12">
                <h3 className="text-center">ไม่พบร้านค้า</h3>
              </div>
            </div>
          </div>
        )
        }
      <div className="end-page"></div>
		</>
	)
}

export default MainSellerDetail