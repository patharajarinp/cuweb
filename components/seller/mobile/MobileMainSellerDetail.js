import React, { useState,useEffect,useContext } from 'react'
// import Layout from '../../../components/layout';
import api from '../../../utils/api'
import { useRouter } from 'next/router'
import UserContext from '../../../contexts/UserContext'
// import { Link, Router, withTranslation } from '../../../utils/i18n'
// import fetch from 'isomorphic-unfetch'
import Navbar from '../../../components/mobile/layout/Navbar';
import Banner from '../../../components/mobile/carousel';
// import MainFilter from '../../../components/product/MainFilter';
import HeaderSeller from '../../../components/mobile/seller/HeaderSeller'
import MobileMainFilter from '../../filter/mobile/MobileMainFilter';

const MobileMainSellerDetail = (props) => {
  const { query, seller, t, setLoading, cates, products } = props;
  const [productType, setProductType] = useState();
  const [img, setImg] = useState();
  const { user, handleCart, fetchUser } = useContext(UserContext)
  const [invisible, setinvisible] = useState(true);
  const [s_category, setCategory] = useState(null);

  const router = useRouter()
  const seller_name = router.query.seller_name
  // console.log(router.query);
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

  React.useEffect(() => {
    fetchSeller();
  },[]);

  useEffect(() => {
    if(!cates) return;
    let book = cates.filter(val=>val.type =='book')
    let stationery = cates.filter(val=>val.type =='stationery')
    let course = cates.filter(val=>val.type =='course')
    // console.log(course_online)
    setCategory({book,ebook:book,stationery, course, cate : cates});
  },[cates]);
 
	return (
		<>
			<Navbar  isSeller={true} />
      <div className="h-64px"></div>
      {
        seller ? (
          <>
            <HeaderSeller seller={seller} />

            {img ? <Banner items={img} type={productType} seller_banner={true} /> : ''}
            <MobileMainFilter 
              cates={cates}
              t={t} query={query} pathname={pathname} products={products} type={"categories"} s_category={s_category}
              setLoading={setLoading} breadcrumb={false} level={0} page_path={`categories`} isSeller={true}
              shop_name={seller_name}
            />
            {/* <MainFilter query={query} pathname={pathname} t={t}
            setinvisible={setinvisible} invisible={invisible} user={user} 
            seller_id={seller && seller.id} isSeller={true} /> */}
          </>
        ):
        (
          <div className="product-background-area ">
            <div className="container bg-white  py-3">
              <div className="row my-5">
                <div className="col-12">
                  <h3 className="text-center">ไม่พบร้านค้า</h3>
                </div>
              </div>
            </div>
          </div>
        )
      }
		</>
	)
}

export default MobileMainSellerDetail