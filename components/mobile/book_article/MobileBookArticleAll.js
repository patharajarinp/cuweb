import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import BeatLoader from "react-spinners/BeatLoader";
import CardNews from '../../../components/mobile/widget/card_new';
import api from '../../../utils/api';
import { Link, withTranslation } from "../../../utils/i18n";

const MobileBookArticleAll = (props) => {
  const [bookArticles, setBookArticles] = useState();

  const limit = 20;

  const [loading , setLoading] = useState(true)
  const {t} = props;
  const hasMore = !bookArticles ? true : (bookArticles.rows.length < bookArticles.count);
  const fetchBookArticles = (page=1) => {
    if(!loading) setLoading(true)
 
    api.getNews({ cate_key: 'bookarticle', limit,page }).then(res => {
      const data = res.data;
    
      let tmp;
      if(bookArticles){
        tmp = {...bookArticles};
        const {rows} = tmp;
        tmp.rows = [...rows,...data.rows];
      }
      else{
        tmp = data;
      }
      
      setLoading(false)
      setBookArticles(tmp);
    })
    .catch(err => {
      setLoading(false)
      console.log(err.response);
    })
  };

  const loadFunc = (page)=>{
    if(loading || !bookArticles || !hasMore) return;
    fetchBookArticles(page)
  }

  useEffect(() => {
    fetchBookArticles();
  },[]);

  
  return (
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h3 className="mb-0 text-black">{t("article")}</h3>
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
                bookArticles && bookArticles.rows.map((news) => <CardNews news={news} key={news.id} type="bookArticleAll" />)
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
export default MobileBookArticleAll