import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import MainCateRec from '../components/main_page/MainCateRec';
import MobileMainCateRec from '../components/main_page/mobile/MobileMainCateRec';
import useMediaQuery from '../hooks/useMediaQuery';
import api from '../utils/api';
import { withTranslation } from "../utils/i18n";


const mainCatRecommend = (props) =>{
  const { t } = props;
  const [recommend, setRecommend] = useState();
  const fetchProducts = () => {
    api.getRecommend({type: 'rec', limit : 500}).then(res =>{
      const data = res.data;
      setRecommend(data);
    })
    .catch(err =>{
      console.log(err.response);
    })
  };
  useEffect(() => {
    fetchProducts();
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#FFFFFF";
    }
  },[]);

  const isMobile = useMediaQuery(992);

  return (
    <Layout title="หมวดหนังสือแนะนำ | ศูนย์หนังสือจุฬาฯ">
      {
        !isMobile ? (
          <MainCateRec t={t} recommend={recommend} />
        ) : (
          <MobileMainCateRec t={t} recommend={recommend} />
        )
      }
       
    </Layout>
  )
}
export default withTranslation('mobile_translations')(mainCatRecommend); 