import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import Banner from '../../../components/mobile/carousel';
import Navbar from '../../../components/mobile/layout/Navbar';
import HeaderSeller from '../../../components/mobile/seller/HeaderSeller';

const MobileSelerData = (props) => {
  const { query, seller} = props;
  const [productType, setProductType] = useState();
  const [img, setImg] = useState();

  const router = useRouter()
  const seller_name = seller.shop_name;

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


	return (
		<>
			<Navbar  isSeller={true} />
      <div className="h-64px"></div>
      {
        !!seller && (
          <>
            <HeaderSeller seller={seller} />

            {img ? <Banner items={img} type={productType} seller_banner={true} /> : ''}
          </>
        )
      }
		</>
	)
}

export default MobileSelerData