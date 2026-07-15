import React, { useEffect, useState } from 'react';
import Paginate from 'react-paginate';
import Layout from '../../components/layout';
import { CardNews } from '../../components/widget/card_new';
import useMediaQuery from '../../hooks/useMediaQuery';
import api from '../../utils/api';
import { Link, withTranslation } from "../../utils/i18n";


const EventAll = (props) => {
  const {t} = props;
  const [activities, setActivities] = useState();


  const fetchActivities = (params) => {
    params.page = params.page || 1;
    params.limit = params.limit || 12;
    params.cate_key = 'activity';
    api.getNews(params).then(res =>{
      const data = res.data;
      setActivities(data);
      setPageCount(Math.ceil(data.count / 12));
    })
      .catch(err => {
        console.log(err.response);
      })
  };

  useEffect(() => {
    fetchActivities({});
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#FFFFFF";
    }
  }, []);

  const [pageCount,setPageCount] = useState(1)
  const [pageNumber, setPagenumber] = useState(0);

  const handlePageClick = data=>{
    let selected = data.selected;
    setPagenumber(selected);
    window.scrollTo(0, 0);
    fetchActivities({page:selected+1});
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
                  <a>{t('activity')}</a>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="text-center">
              <h2>{t('activity')}</h2>
            </div>
          </div>
        </div>
        <div className="d-none d-xl-block">
          <div className="row mt-5 pb-4">
          {
            activities ? activities.rows.map((news) => <CardNews news={news} type="activity" t={t} />) : ''
          }
          </div>
        </div>
        <div className="d-block d-xl-none">
          <div className="row mt-5 pb-4">
          {
            activities ? activities.rows.map((news) => <CardNews news={news} type="activity" show={3} t={t} />) : ''
          }
          </div>
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
export default EventAll