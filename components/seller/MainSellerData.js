import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Banner from '../../components/banner';
import ProductFilter from '../../components/product/ProductFilter';
import Logo from '../../components/seller/Logo';
import UserContext from '../../contexts/UserContext';
import api from '../../utils/api';

const MainSellerData = (props) => {
  const { query, seller, t, setLodding } = props;
  const [productType, setProductType] = useState();
  const [img, setImg] = useState();

  const { local } = useContext(UserContext)
  const router = useRouter()
  const seller_name = seller.shop_name;

  var preview = null;
  if(router.query.preview) {
    preview = router.query.preview;
  }
  const pathname = `/seller/[seller_name]`;

  const fetchSeller = () => {
    if(!seller) return;
    // setLodding(true);
    var name = seller_name;
    api.getSellerBanner(name, {live : preview ? 0 : 1}).then(res =>{
      const data = res.data;
      setProductType(data.type);
      setImg(data.banner_images);
      // setLodding(false);
    })
    .catch(err =>{
      console.log(err.response);
      // setLodding(false);
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
        !!seller && (
          <>
            <div className="row">
              <div className="col-12">
                <Logo seller={seller} preview={preview} />
              </div>
            </div>
            <div className="row">
              <Banner data={img} type={productType} />
            </div>
          </>
        )
      }
      {/* <div className="end-page"></div> */}
		</>
	)
}

export default MainSellerData