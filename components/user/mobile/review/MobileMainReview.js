import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../../../contexts/UserContext';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { withTranslation, Link } from '../../../../utils/i18n';
import InfiniteScroll from 'react-infinite-scroller';
import BeatLoader from "react-spinners/BeatLoader";

const MobileMainReview = (props) => {
  const {t, loading, setLoading} = props;
  const {user,handleCart, fetchUser} = useContext(UserContext)
    const [order, setOrder] = useState();
    const [check, setReview] = useState();
    const [show, setshow] = useState(true);
    const limit = 10;

    const hasMore = !order ? true : (order.rows.length < order.count);

    const clickshow = () => setshow(!show)
    const  fetchOrder = (page = 1) => {
      const id = AuthService.getProfile().id;
      setLoading(true)
      var status = 5;
      api.getPackage({status, type: 'product',page,limit}).then(res =>{
          const data = res.data;
          let tmp;
          if(order){
            tmp = {...order};
            const {rows} = tmp;
            tmp.rows = [...rows,...data.rows];
          }
          else{
            tmp = data;
          }
          setOrder(tmp);

          return data.rows;
      })
      .then(data => {
          const order_id = data.map((val) => val.order_id)
          return api.getOrderReview({user_id:id,order_id,no_limit : 1})
      })
      .then(res =>{
          const data = res.data;

          let tmp;
          if(check){
            tmp = {...check};
            const {rows} = tmp;
            tmp.rows = [...rows,...data.rows];
          }
          else{
            tmp = data;
          }

          setReview(tmp);
          setLoading(false)
      
      })
      .catch(err =>{
        setLoading(false)
        console.log(err);
        console.log(err.response);
      })
    };
    useEffect(() => {
      fetchOrder();
    },[]);

    const Datemonth = [t("january"), t("february"), t("march"), t("april"), 
  t("may"), t("june"), t("july"), t("august"), t("september"), t("october"), t("november"), t("december")];

  const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hours = '' +d.getHours(),
        minutes = '' +d.getMinutes(),
        second = '' +d.getSeconds();
        
    Datemonth.map((val, index) => {
      // console.log(val);
      if((month - 1) == index){
        month = val;
      }
    })
    if (day.length < 2) 
        day = '0' + day;
    if (hours.length < 2) 
        hours = '0' + hours;
    if (minutes.length < 2) 
        minutes = '0' + minutes;
    if (second.length < 2) 
        second = '0' + second;
   
    var dataDate = [day, month, (year + 543)].join(' ');
    var dataTime = [hours, minutes, second].join(':');
    return dataDate + ' ' + dataTime;
  }

  const currencyFormatDE = (num) => {
    num = parseFloat(num);
    return (
      num
        .toFixed(2) // always two decimal digits
        .replace(',', '.') // replace decimal point character with ,
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    ) // use . as a separator
  }

  const checkReview = (val,order_id) => {
 
    //return <div>aaaa</div>
    if(!check) {
      return;
    }
    // for(let i = 0 ; i < check)
    let found = false;
    let review_item;
   
    check?.forEach(item => {
   
      if(item.order_id == order_id && item.product_id == val.product_id) {
        review_item = item;
        found = true;
      }
    });

    console.log('found', found);
    console.log('review_item.status', review_item);

    if(found){
  
      if(review_item.status == 2) {
        return (
          <Link href={`/user/read-review/[order_id]/[product_id]?order_id=${order_id}&product_id=${val.product_id}`} as={`/user/read-review/${order_id}/${val.product_id}`}>
            <a><button type="button" className="btn btn-outline-primary">{t('read_reviews')}</button></a>
          </Link>
        )
      }else if(review_item.status == 0) {
        return (
          <Link href={`/user/read-review/[order_id]/[product_id]?order_id=${order_id}&product_id=${val.product_id}`} as={`/user/read-review/${order_id}/${val.product_id}`}>
            <a><button type="button" className="btn btn-disabled">{t('not_approved')}</button></a>
          </Link>
        )
      }else{
        return (
          <Link href={`/user/read-review/[order_id]/[product_id]?order_id=${order_id}&product_id=${val.product_id}`} as={`/user/read-review/${order_id}/${val.product_id}`}>
            <a><button type="button" className="btn btn-disabled">{t('pending_approval')}</button></a>
          </Link>
        )
      }
     
    }
    else{
      return (
        <Link href={`/user/reviews/[order_id]/[product_id]?order_id=${order_id}&product_id=${val.product_id}`} as={`/user/reviews/${order_id}/${val.product_id}`}>
          <a><button type="button" className="btn btn-primary">{t('reviews')}</button></a>
        </Link>
      )
    }
  }



  const loadFunc = (page)=>{
    fetchOrder(page)
  }

  return ( 
    <>
      <div className="review-nav">
        <div className="text-center m-auto">
            <h3 className="mb-0 text-black">{t("mobile_review:my_review")}</h3>
        </div>
        <Link href="/user/dashboard">
        <a className="btn-back review-back">
            <img className="img-fluid my-auto" src={'/mobile/image/icon/icon-back.svg'} />
        </a>
        </Link>
      </div>
      
      <div className="bg-light-less-gray min-vh-100">
        <div className="h-64px"></div>


      <InfiniteScroll
        pageStart={1}
        loadMore={loadFunc}
        hasMore={!loading && hasMore}
        initialLoad={false}>
        {
          order ? order.rows.map((val, index) => (
            <div className="container bg-white mt-2 mb-3" key={val.pkg_id}>
              <div className="d-flex justify-content-between align-items-center border-bottom py-2">
                  <h4 className="text-black">{t('mobile_review:order')} #{val.order_id}</h4>
                  <p className="text-date-news text-right"> {formatDate(val.createdAt)}</p>
              </div>
              {
              val.package_details.map((val2, index2) => (
                <div className="product-in-cart" key={index2}>
                  <div className="product-in-cart-pic-area">
                      <div className="product-in-cart-pic ">
                          <img className="img-fluid" src={val2.product.picture ? val2.product.picture : '/mobile/image/book.png'}  />
                      </div>
                  </div>
                  <div className="product-in-cart-content w-100">
                      <h4 className="text-black two-line">{val2.product.name}</h4>
                      <div className="d-flex justify-content-end">
                        <div className="">
                          {checkReview(val2,val.order_id)}
                        </div>
                      </div>
                  </div>
                </div>
                ))
              }
            </div>
          )) : ''
        }
      </InfiniteScroll>
      <div className="text-center mt-3" key="loader"><BeatLoader color={"#EE5294"} loading={loading} /></div>
      </div>
    </>
  )
}

export default MobileMainReview