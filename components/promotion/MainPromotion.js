
import React, { useEffect, useState } from 'react';
import Paginate from 'react-paginate';
import Layout from '../../components/layout';
import { CardNews } from '../../components/widget/card_new';
import api from '../../utils/api';
import { Link, withTranslation } from "../../utils/i18n";
import Head from 'next/head';

const MainPromotion = (props) => {
  const {t, pro} = props;

  const [promotion, setPromotion] = useState(pro);


  const fetchPromotion = (params) => {
    params.page = params.page || 1;
    params.limit = params.limit || 12;
    params.cate_key = 'promotion';
    api.getNews(params).then(res =>{
      const data = res.data;
      // ;
      setPromotion(data);
      setPageCount(Math.ceil(data.count / 12));
    })
    .catch(err =>{
      console.log(err.response);
    })
  };


  useEffect(() => {
    // fetchPromotion({});
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#FFFFFF";
    }
  },[]);
   

  const [pageCount,setPageCount] = useState(Math.ceil(pro.count / 12) || 1)
  const [pageNumber, setPagenumber] = useState(0);

  const handlePageClick = data=>{
    let selected = data.selected;
    setPagenumber(selected);
    window.scrollTo(0, 0);
    fetchPromotion({page:selected+1});
  }
  
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href='/' as={'/'}>
                    <a>{t('home')}</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  <a>{t('promotion')}</a>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="text-center">
              <h1 className='seo-text'>{t('promotion')}</h1>
            </div>
          </div>
        </div>
        <div className="row mt-5 pb-4">
          {
            promotion ? promotion.rows.map((news) => <CardNews news={news} type="promotion" t={t} />) : ''
          }
        </div>
        <div className="row w-100 mx-0 px-0 pb-5 border-bottom">
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
        
      </div>
    </>
  )
}
export default MainPromotion