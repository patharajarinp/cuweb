import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import BeatLoader from "react-spinners/BeatLoader";
import CardNews from '../widget/card_new';
import api from '../../../utils/api';
import { Link, withTranslation } from "../../../utils/i18n";

const MobilePrecureAll = (props) => {
  const [procurement, setProcurement] = useState();
  const limit = 20;

  const [loading , setLoading] = useState(true)
  const hasMore = !procurement ? true : (procurement.rows.length < procurement.count);
  const {t} = props;


  const fetchProcurement = (page=1) => {
    if(!loading) setLoading(true)
    api.getNews({ cate_key: 'procurement', limit,page }).then(res => {
      const data = res.data;
      //console.log(data);
      let tmp;
      if(procurement){
        tmp = {...procurement};
        const {rows} = tmp;
        tmp.rows = [...rows,...data.rows];
      }
      else{
        tmp = data;
      }
      setLoading(false)
      setProcurement(tmp);
    })
    .catch(err => {
      setLoading(false)
      console.log(err.response);
    })
  };
  const loadFunc = (page)=>{
    //alert(page)
    // if(loading || !procurement || !hasMore) return;
    fetchProcurement(page)
  }


  useEffect(() => {

    fetchProcurement();
  },[]);

  
  return (
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h3 className="mb-0 text-black">{t("procurement")}</h3>
        </div>
       
          <Link href="/news">
            <a className="btn-back cart-nav-back">
              <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
            </a>
          </Link>
      </div>

      <div className="bg-light-less-gray min-vh-100">
        <div className="h-64px"></div>
        <div className="all-card-news ">
          

          <InfiniteScroll
          pageStart={1}
          loadMore={loadFunc}
          hasMore={!loading && hasMore}
          initialLoad={false}
          
          >
            <div className="container d-flex flex-wrap justify-content-between mt-3" >
            {
              procurement && procurement.rows.map((news) => <CardNews news={news} key={news.id} type="procurementAll" />)
            }
            </div>
          </InfiniteScroll>
          <div className="text-center mt-3"><BeatLoader color={"#EE5294"} loading={loading} /></div>
        </div>
        
        <div className="footer-space"></div>
      </div>
    </>
  )
}
export default MobilePrecureAll