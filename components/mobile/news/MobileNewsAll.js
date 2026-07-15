import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import BeatLoader from "react-spinners/BeatLoader";
import CardNews from '../../../components/mobile/widget/card_new';
import api from '../../../utils/api';
import { Link, withTranslation } from "../../../utils/i18n";

const MobileNewsAll = (props) => {
  const [news, setNews] = useState();

  const limit = 20;

  const [loading , setLoading] = useState(true)
  const {t} = props;
  const hasMore = !news ? true : (news.rows.length < news.count);
  const fetchNews = (page=1) => {
    if(!loading) setLoading(true)
 
    api.getNews({ cate_key: 'news', limit,page }).then(res => {
      const data = res.data;
    
      let tmp;
      if(news){
        tmp = {...news};
        const {rows} = tmp;
        tmp.rows = [...rows,...data.rows];
      }
      else{
        tmp = data;
      }
      
      setLoading(false)
      setNews(tmp);
    })
    .catch(err => {
      setLoading(false)
      console.log(err.response);
    })
  };

  const loadFunc = (page)=>{
    if(loading || !news || !hasMore) return;
    fetchNews(page)
  }

  useEffect(() => {
    fetchNews();
  },[]);

  
  return (
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h3 className="mb-0 text-black">{t("news_activity")}</h3>
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
            <div className="container d-flex flex-wrap justify-content-between mt-3" key="news-container">
              {
                news && news.rows.map((news) => <CardNews news={news} key={news.id} type="newsAll" />)
              }
            </div>
          </InfiniteScroll>
        </div>
        <div className="text-center mt-3" key="loader"><BeatLoader color={"#EE5294"} loading={loading} /></div>
        
        <div className="footer-space"></div>
      </div>
    </>
  )
}
export default MobileNewsAll