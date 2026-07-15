import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import BeatLoader from "react-spinners/BeatLoader";
import NavbarOder from '../../../../components/mobile/NavOder';
import NoOrder from '../../../../components/mobile/NoOrder';
import Showorder from '../../../../components/mobile/widget/Order';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { withTranslation } from '../../../../utils/i18n';
import Paginate from 'react-paginate';

const MobileMainOrder = (props) => {
  const { t, setLoading } = props;
  const router = useRouter();

  const [order, setOrder] = useState();
  const {status} = router.query;


  const  fetchOrder = (params) => {
    setLoading(true)
    const id = AuthService.getProfile().id;
    params.page = params.page || 1;
    params.limit = params.limit || 5;
    params.type = 'product';
    params.status = status;
    
    api.getUserOrder(id, params).then(res =>{
      const data = res.data;
       
      setOrder(data);
      setPageCount(Math.ceil(data.count / 5));
      setLoading(false)
    })
    .catch(err =>{
      setLoading(false)
      console.log(err.response);
    })
  };


  useEffect(() => {
    fetchOrder({status});
  },[status]);

  const [pageCount,setPageCount] = useState(1)
  const [pageNumber, setPagenumber] = useState(0);

  const handlePageClick = data=>{
    let selected = data.selected;
    setPagenumber(selected);
    window.scrollTo(0, 0);
    fetchOrder({page:selected+1});
  }


  return ( 
    <>
      <NavbarOder activeSlideNav="tab1"  status={status} setOrder={setOrder} setPageCount={setPageCount} setPagenumber={setPagenumber}>
        {/* <InfiniteScroll
          pageStart={1}
          loadMore={loadFunc}
          hasMore={!loading && hasMore}
          initialLoad={false}
        >
          {
            order ? order.rows.map((val, index) => (
              <Showorder order={val} key={val.order_id} t={t} />
            )) : null
          }
        </InfiniteScroll> */}
          {
            (order && order.count > 0) ? order.rows.map((val, index) => (
              <Showorder order={val} key={val.order_id} t={t} />
            )) : <NoOrder/> 
          }
          {
            (order && order.count > 0) && (
              <div className="row w-100 mx-0 px-0">
                <div className="col-12 px-0">
                  <div className="float-right page-order">
                    <Paginate
                      previousLabel={t('translations:prev')}
                      nextLabel={t('translations:next')}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      pageCount={pageCount}
                      forcePage={pageNumber}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                    />
                  </div>
                </div>
              </div>
            )
          }
          
        {/* <div className="text-center mt-3" key="loader"><BeatLoader color={"#EE5294"} loading={loading} /></div> */}
      </NavbarOder>
    </>
  )
}

export default MobileMainOrder