import React, { useState,useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import withAuth from '../../utils/withAuth'
import api from '../../utils/api';
import Sidenav from '../../components/user/sidenav'
import AuthService from '../../utils/AuthService'
import tools from '../../utils/tools'
import {withRouter,useRouter} from 'next/router';
import classNames  from 'classnames';
import Showorder from '../../components/order/Order'
import { Router , Link, withTranslation } from "../../utils/i18n";
import Submenu from '../../components/order/Submenu'
import Paginate from 'react-paginate';
import Loading from '../../components/loading'

const Order = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState();
  const [order, setOrder] = useState();
  const [check, setReview] = useState();
  const [sidenav,setSidenav] = useState(true);
  const [count, setCount] = useState();
  const {t} = props;

  const {status} = router.query;

  const  fetchUser = () => {
    api.getProfile().then(res =>{
        const data = res.data;
        setUser(data);
    })
    .catch(err =>{
      console.log(err.response);
    })
  };

  const  fetchOrder = (params) => {
    setLoading(true)
    const id = AuthService.getProfile().id;
    params.page = params.page || 1;
    params.limit = params.limit || 5;
    params.type = 'product';
    params.status = [5, 6, 7];
    api.getUserOrder(id, params).then(res =>{
        const data = res.data;
 
        setOrder(data);
        setPageCount(Math.ceil(data.count / 5));
        setLoading(false)
        return data.rows;
    })
    .then(data => {
        const order_id = data.map((val) => val.order_id)
        return api.getOrderReview({user_id:id,order_id})
    })
    .then(res =>{
        const review = res.data;
        setReview(review);
    })
    .catch(err =>{
      console.log(err.response);
    })
  };

  useEffect(() => {
    fetchUser();

    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
    
  },[]);

  useEffect(() => {
    fetchOrder({status});
  },[status]);

  const handleError = (error) => {
    console.log( error);
  }
  
  const getYoutube = (val) => {
    var namepath = val;
    if(namepath) {
      var [path,link] = namepath.split("watch?v=");
      if(link){
        return 'https://www.youtube.com/embed/'+link+'?autoplay=0&controls=0';
      }
    }
  }

  const checkReview = (val) => {
    if(!check) {
      return;
    }
    let found = false;
    check.rows.forEach(item => {
      if(item.order_id == val.order_id && item.product_id == val.id) {
        found = true;
      }
    });
    if(found){
      return (
        <Link href={'/user/read-review/[order_id]/[product_id]'} as={`/user/read-review/${val.order_id}/${val.id}`}>
          <a><button type="button" className="btn btn-outline-primary">{t("read_reviews")}</button></a>
        </Link>
      )
    }
    else{
      return (
        <Link href={'/user/reviews/[order_id]/[product_id]'} as={`/user/reviews/${val.order_id}/${val.id}`}>
          <a><button type="button" className="btn btn-primary">{t("reviews")}</button></a>
        </Link>
      )
    }
  }

  const [pageCount,setPageCount] = useState(1)
  const [pageNumber, setPagenumber] = useState(0);

  const handlePageClick = data=>{
    let selected = data.selected;
    setPagenumber(selected);
    window.scrollTo(0, 0);
    fetchOrder({page:selected+1});
  }

  return (
 
  <Layout title="User | Order" >
    {loading && <Loading />}
    <Sidenav user={user} menuToggle={sidenav} page="order_success" >
      {
        order ? (
          <div className="show-profile" id="show-profile">
            <div className="box-main-account">
              <div className="row w-100 mx-0 px-0">
                <div className="col-12 pl-0">
                  <div className="mt-2 mb-4">
                    <h6 className="text-black">{t("my_order")}</h6>
                  </div>
                </div>
              </div>

              {
                order.count > 0 ? (
                  <>
                    <div className="row w-100 mx-0 px-0">
                      <div className="col-12 px-0">
                        <div className="">
                          {
                            order ? order.rows.map((val, index) => (
                              <Showorder order={val} key={index} />
                            )) : ''
                          }
                        </div>
                      </div>
                    </div>
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
                  </>
                ) : (
                  <div className="col-12 row align-items-center">
                    <div className="col-4 "></div>
                    <div className="col-4 no-favorite text-center">
                      <img src="/images/not-cart.svg" alt="ศูนย์หนังสือจุฬาฯ" className="img-fluid" />
                      <h3 className="text-pink my-3">{t('there_are_no_order_success')}</h3>
                      <Link href='/'>
                        <button className="btn btn-primary my-3">{t('continue_shopping')}</button>
                      </Link>
                    </div>
                    <div className="col-4"></div>
                  </div>
                )
              }

            </div>
          </div>
        ) : ''
      }
    </Sidenav>
  </Layout>
)}

export default withTranslation(['Order'])(Order)