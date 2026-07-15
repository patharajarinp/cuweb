
import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';
import { Link, withTranslation, Router  } from "../../../utils/i18n";
import InfiniteScroll from 'react-infinite-scroller';
import BeatLoader from "react-spinners/BeatLoader";
import Navbar from '../../../components/mobile/layout/Navbar';
import BreadcrumbMB from '../BreadcrumbMB';

const MobileMainPromotion = (props) => {
  const {t} = props;
  const [promotion, setPromotion] = useState();
  const limit = 20;
  const [loading , setLoading] = useState(true)
  const hasMore = !promotion ? true : (promotion.rows.length < promotion.count);

  // const [book, setBook] = useState();
  const fetchPromotion = (page =1) => {
    api.getNews({cate_key : 'promotion',page,limit}).then(res =>{
      const data = res.data;
      let tmp;
      if(promotion){
        tmp = {...promotion};
        const {rows} = tmp;
        tmp.rows = [...rows,...data.rows];
      }
      else{
        tmp = data;
      }
      setLoading(false)
      setPromotion(tmp);
    })
    .catch(err =>{
      console.log(err.response);
    })
  };

  const loadFunc = (page)=>{
    //alert(page)
    // if(loading || !procurement || !hasMore) return;
    fetchPromotion(page)
  }
  useEffect(() => {
    fetchPromotion();
  },[]);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    var dataDate = [day, month, year].join('-');
    return dataDate;
  }
  
  return (
    <>
      {/* <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4>{t("mobile_header:promotion")}</h4>
        </div>
        <Link href='/' as={'/'}>
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
        </Link>
      </div> */}

      <Navbar isSeller={true} />

      <div className="bg-light-less-gray min-vh-100">
        {/* <div className="h-64px"></div> */}
        <BreadcrumbMB 
          item={[
            {text: "หน้าหลัก",href:'/',as:'/'},
            {text: t('mobile_header:promotion'),active:true}
          ]}
        />
        <div className="container py-3 bg-white">
          <div className="d-flex justify-content-center ">
            <div>
              <h1 className="text-black text-h4 mb-0">{t("mobile_header:promotion")}</h1>
            </div>
          </div>
        </div>

        <InfiniteScroll
          pageStart={1}
          loadMore={loadFunc}
          hasMore={!loading && hasMore}
          initialLoad={false}
          
          >
            <div className="container d-flex flex-wrap justify-content-between mt-3" >
            {
              promotion && promotion.rows.map((val, index) => (
                <Link  key={index} href={`/promotion/[subkey]?subkey=${val.id}`} as={`/promotion/${val.id}`}>
                  <div className="card-news my-2">
                    
                    <div className="card-promotion-pic" style={{ background: `url(${val.image})` }}>
                    </div>
                  
                    <div className="card-news-content">
                    <h5 className="text-title-news ">{val.title_th}</h5>
                    </div>
                  </div>
                </Link>
              ))
            }
            </div>
          </InfiniteScroll>
          <div className="text-center mt-3"><BeatLoader color={"#EE5294"} loading={loading} /></div>
          
        
        <div className="footer-space"></div>
    </div>
    </>
  )
}
export default MobileMainPromotion