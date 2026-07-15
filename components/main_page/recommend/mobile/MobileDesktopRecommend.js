import React, { useContext, useEffect, useState } from 'react';
import Banner from '../../../../components/mobile/carousel';
import CardGrid from '../../../../components/mobile/widget/Card';
import api from '../../../../utils/api';
import { withTranslation, Router } from '../../../../utils/i18n';
import BeatLoader from "react-spinners/BeatLoader";
import InfiniteScroll from 'react-infinite-scroller';
import Head from 'next/head';
import UserContext from '../../../../contexts/UserContext';

const MobileDesktopRecommend = (props) => {
  const {t, query, loading, setLoading} = props;

  const [img, setImg] = useState();
  const [book, setBook] = useState();
  const [recommend, setRecommend] = useState();
  const {local, setLocal } = useContext(UserContext)

  const limit = 20;
  const hasMore = !book ? true : (book.rows.length < book.count);


  const key = query.key;

  const fetchPage = () => {
    var page = key;
    var vendor = 'cu';
    api.getBanner(page, vendor).then(res => {
      const data = res.data;
      if(!data){
        return Router.push('/')
      }
      // console.log('data',data)
      var items = [];
      data.banner_images.forEach((item) => {
        if (item.index != 5)
          return true;
        let temp = {
          src: item.image,
          key: 'banner' + item.id,
          href: item.link,
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

  const fetchBook = (page=1) => {
    setLoading(true)
    api.getRecProductByKey(key,{page,limit}).then(res => {
      const data = res.data;
      let tmp;
      if(book){
        tmp = {...book};
        const {rows} = tmp;
        tmp.rows = [...rows,...data.rows];
      }
      else{
        tmp = data;
      }
      setBook(tmp);
      setLoading(false)
    })
      .catch(err => {
        setLoading(false)
        console.log(err.response);
      })
  };
  const loadFunc = (page)=>{
    fetchBook(page)
  }

 
  const fetchRecommend = () => {
    api.getRecByKey(key).then(res => {
      const data = res.data;
      setRecommend(data);
    
    })
    .catch(err => {
      console.log(err.response);
    })
  };


  useEffect(() => {
    fetchRecommend();
    fetchPage();
    fetchBook();
    document.body.style.backgroundColor = "#FFFFFF";
  }, []);

  const back = () => {
    Router.back();
  }

  return (
    <>
      <Head>
        <title>{`${recommend ? (recommend['name_'+local] || recommend.name_th) : 'สินค้าแนะนำ'} | ศูนย์หนังสือจุฬาฯ`}</title>
      </Head>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4>{recommend && recommend.name_th}</h4>
        </div>
        <a className="btn-back cart-nav-back" onClick={() => back()}>
          <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
        </a>
      </div>
      <div className="bg-light-less-gray min-vh-100 ">
        <div className="h-64px"></div>
        {img && <Banner items={img} />}
        
        <InfiniteScroll
          pageStart={1}
          loadMore={loadFunc}
          hasMore={!loading && hasMore}
          initialLoad={false}>
            <div className="all-card-news ">
                <div className="container d-flex flex-wrap justify-content-between ">
                  {
                  book && book.rows.map((product, index) => (
                    <CardGrid product={product} show={4} _class={"my-2"} key={index} />
                  ))
                  }
                </div>
            </div>
          </InfiniteScroll>
          <div className="text-center mt-3"><BeatLoader color={"#EE5294"} loading={loading} /></div>

        <div className="h-64px"></div>
      </div>
    </>
  )
}
export default MobileDesktopRecommend