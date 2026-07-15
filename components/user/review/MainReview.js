import React, { useEffect, useState } from 'react'
import Paginate from 'react-paginate'
import Loading from '../../../components/loading'
import Sidenav from '../../../components/user/sidenav'
import api from '../../../utils/api'
import AuthService from '../../../utils/AuthService'
import { Link, withTranslation } from '../../../utils/i18n'
import tools from '../../../utils/tools'
import classNames  from 'classnames';

const MainReview = (props) => {
  const { t, loading, setLoading } = props;

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  const [user, setUser] = useState();
  const [order, setOrder] = useState();
  const [check, setReview] = useState();
  const [sidenav,setSidenav] = useState(true);

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
    params.status = 5;
    params.page = params.page || 1;
    params.limit = params.limit || 5;
    params.type = "product";
    api.getPackage( params).then(res =>{
        const data = res.data;
        setOrder(data);
        setPageCount(Math.ceil(data.count / 5));
        setLoading(false)
        return data.rows;
    })
    .then(data => {
        const order_id = data.map((val) => val.order_id)
        return api.getOrderReview({user_id:id,order_id,no_limit : 1})
    })
    .then(res =>{
        const review = res.data;
        // console.log('review',res.data)
        setReview(review);
      
    })
    .catch(err =>{
      setLoading(false)
      console.log(err);
      console.log(err.response);
    })
  };
  useEffect(() => {
    fetchUser();
    fetchOrder({});
  },[]);



  const handleError = (error) => {
    console.log( error);
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
      // console.log(item.order_id +' == '+ order_id +' && '+ item.product_id +' == '+ val.product_id);
      if(item.order_id == order_id && item.product_id == val.product_id) {
        review_item = item;
        found = true;
      }
    });

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



  const getYoutube = (val) => {
    var namepath = val;
    if(namepath) {
      var [path,link] = namepath.split("watch?v=");
      if(link){
        return 'https://www.youtube.com/embed/'+link+'?autoplay=0&controls=0';
      }
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
  const convertName = (name)=>{
    return encodeURIComponent(name.replace(/\//g, '-'))
  }

  return ( 
    <>
      <Sidenav user={user} page="review" >
        <div className="show-profile" id="show-profile">
          <div className="box-main-account">
            <div className="row mx-0 px-0">
              <div className="col-12 pl-0">
                <div className="mt-2 mb-4">
                  <h6 className="text-black">{t('my_review')}</h6>
                </div>
              </div>
            </div>
            {
              (order && order.count) ?  (
                <>
                <div className="row mx-0 px-0">
                  <div className="col-12 px-0">
                    <div className="">
                      {
                        order ? order.rows.map((val, index) => (
                          <div className="order-products" key={val.pkg_id}>
                            <div className="p-3">
                              <div className="order-date">{t('order')} 
                              <Link href={`/user/order-detail/[order_id]?order_id=${val.order_id}`} as={`/user/order-detail/${val.order_id}`}>
                                <a> #{val.order_id}</a>
                              </Link>
                              </div>
                              <div className="order-date">{t('order_date')} {tools.formatDate(val.createdAt)}</div>
                            </div>
                            <div className="border-bottom"></div>
                            <div className="p-3">
                              {
                                val.package_details.map((val2, index2) => (
                                  <div className="products d-flex align-items-center justify-content-between" key={val2.id}>
                                    <div className="img-detail">
                                    {
                                      (val2.product.video_type == 0 || val2.product.video_type == null) && (
                                        <img src={val2.product.picture ? val2.product.picture : '/images/book.png'} className="mh-100" />
                                      )
                                    }
                                    {
                                      (val2.product.video_type == 1 || val2.product.video_type == 2) && (
                                        <img src={'/images/video.svg'} className="mh-100 video" />
                                      )
                                    }
                                    </div>
                                    <div className="pl-3 text-book-detail">
                                      <p className="mb-0 font-weight-bold">
                                        <Link  {...tools.getUrlProduct(val2.product)}>
                                        <a className="text-default">{val2.product.name}</a>
                                        </Link>
                                      </p>
                                      {
                                        val2.product.type == 'ebook' || val2.product.type == 'course' ? '' : (
                                          <p className="mb-0">{t('author')} : {val2.product.author}</p>
                                        )
                                      }
                                      <div className="d-flex align-items-center">
                                        <div className={classNames("tag-cat ",{"tag-book":(val2.product.type == 'book') ,"tag-stationary":(val2.product.type == 'non_book'),"tag-ebook": (val2.product.type == 'ebook'),"tag-course": (val2.product.type == 'course')})}>{(val2.product.type == 'book') ? t('header:book_menu')  :  val2.product.type == 'non_book' ? t('header:stationary') : val2.product.type == 'ebook' ? t('header:e_book') :val2.product.type == 'course' && t('header:course_online')}</div>
                                        {!!val2.product.is_preorder && <div className={classNames("tag-cat px-3")} style={{backgroundColor : '#DE5C6E'}}>Preorder</div> } 
                                      </div>
                                    </div>
                                    <div className="products-border-left"></div>
                                    <div className="">
                                      
                                      {checkReview(val2,val.order_id)}
                                    </div>
                                  </div>
                                ))
                              }
                              </div>
                          </div>
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
                    <h3 className="text-pink my-3">{t('there_are_no_review')}</h3>
                    <Link href='/'>
                      <button className="btn btn-primary my-3">{t('favorite:continue_shopping')}</button>
                    </Link>
                  </div>
                  <div className="col-4"></div>
                </div>
              )
            }
          </div>
        </div>
      </Sidenav>
    </>
  )
}

export default MainReview