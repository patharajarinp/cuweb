import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import BeatLoader from "react-spinners/BeatLoader";
import Showorder from '../../../../../components/mobile/widget/Order';
import api from '../../../../../utils/api';
import AuthService from '../../../../../utils/AuthService';
import { Link, withTranslation } from '../../../../../utils/i18n';

const MobileOrderCancel = (props) => {
  const { t } = props;
  const [order, setOrder] = useState();
  const limit = 6;
  const [loading , setLoading] = useState(true)
  const hasMore = !order ? true : (order.rows.length < order.count);  

  const  fetchOrder = (params) => {
    const id = AuthService.getProfile().id;
    // params.page = params.page || 1;
    // params.limit = params.limit || 5;
    params.type = 'product';
    params.status = 0;
    params.limit = limit;
    if(!loading) setLoading(true)
    api.getUserOrder(id, params).then(res =>{
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
      // console.log(data)
      setOrder(tmp);
      setLoading(false)
    })
    
    .catch(err =>{
      console.log(err.response);
    })
  };
  const loadFunc = (page)=>{

    fetchOrder({page});

  }

  useEffect(() => {
    fetchOrder({});
  },[]);




  const handleError = (error) => {
    console.log( error);
  }


  return ( 
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
            <h4 className="text-black">{t("mobile_translations:cancel_product")}</h4>
        </div>
        <Link href="/user/dashboard">
          <a className="btn-back cart-nav-back">
              <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
        </Link>
      </div>
      <div className="bg-light-less-gray mt-3 min-vh-100">
        <div className="h-64px"></div>
          <InfiniteScroll
          pageStart={1}
          loadMore={loadFunc}
          hasMore={!loading && hasMore}
          initialLoad={false}
          
          >
            {
            order ? order.rows.map((val, index) => (
              <Showorder order={val} key={val.order_id} />
            )) : null
            }
          </InfiniteScroll>
          <div className="text-center mt-3" key="loader"><BeatLoader color={"#EE5294"} loading={loading} /></div>
      </div>
    </>
  )
}

export default MobileOrderCancel