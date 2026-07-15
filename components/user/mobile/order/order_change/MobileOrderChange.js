import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import BeatLoader from "react-spinners/BeatLoader";
import NoOrder from '../../../../../components/mobile/NoOrder';
import Showorder from '../../../../../components/mobile/widget/Order';
import Changelist from '../../../../../components/mobile/change/chenge-list'
import api from '../../../../../utils/api';
import AuthService from '../../../../../utils/AuthService';
import { withTranslation, Link } from '../../../../../utils/i18n';

const MobileOrderChange = (props) => {
  const { t } = props;
  const [order, setOrder] = useState();
  const limit = 6;
  const [loading, setLoading] = useState(true)
  const hasMore = !order ? true : (order.rows.length < order.count);
  useEffect(() => {
      fecthChange({})
  }, [])

  const  fecthChange = (params) => {
    setLoading(true)
    const id = AuthService.getProfile().id;
    params.page = params.page || 1;
    params.user_id = id;
    params.limit = params.limit || limit;
    params.type = 2;
    api.getPackageReturn(params).then(res =>{
      const data = res.data;
      let tmp;
      if (order) {
        tmp = { ...order };
        const { rows } = tmp;
        tmp.rows = [...rows, ...data.rows];
      }
      else {
        tmp = data;
      }
      // console.log(data)
      setOrder(tmp);
    //   console.log(data);
    //   setPageCount(Math.ceil(data.count / 5));
      setLoading(false);
    })
    .catch(err =>{
      setLoading(false);
      console.log(err.response);
    })
  }
  const loadFunc = (page) => {
    fecthChange({ page });
  }

  return ( 
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
            <h4 className="text-black">
                {t("change_product")}
            </h4>
        </div>
        <Link href="/user/dashboard">
            <a className="btn-back cart-nav-back">
                <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
            </a>
        </Link>
      </div>

      <div className="bg-light-less-gray min-vh-100">
          <div className="h-64px">

          </div>
          <InfiniteScroll
              pageStart={1}
              loadMore={loadFunc}
              hasMore={!loading && hasMore}
              initialLoad={false}

          >
            {
              order ? order.rows.map((val, index) => (
                  // <Showorder order={val} key={val.order_id} type="return" />
                <Changelist t={t} order={val} key={val.order_id} />
              )) : null
            }
          </InfiniteScroll>
          {
            !!order && !order.count && <NoOrder />
          }
          <div className="text-center mt-3" key="loader"><BeatLoader color={"#EE5294"} loading={loading} /></div>

          <div className="footer-space"></div>
      </div >
    </>
  )
}

export default MobileOrderChange