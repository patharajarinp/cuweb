
import { useEffect } from 'react';
import { CardNews } from '../../components/widget/card_new';
import { Link, withTranslation } from "../../utils/i18n";

const MainNews = (props) => {
  const {t,news,activities,procurement} = props;
  
  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#FFFFFF";
    }
  },[]);

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
                  <a>{t('news')}</a>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className='col-12 text-center'>
            <h1 className='seo-text'>{t('news')}</h1>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-4"></div>
          <div className="col-4">
            <div className="text-center">
              <h2>{t('news_activity')}</h2>
            </div>
          </div>
          <div className="col-4">
            <div className="float-right">
              <Link href="/news-article">
              <button className="btn btn-outline-primary">{t('view_all')}</button>
              </Link>
              </div>
          </div>
        </div>
        <div className="d-none d-xl-block">
          <div className="row mt-5 pb-5 border-bottom">
            {
              news ? news.rows.map((news) => <CardNews news={news} type="news" t={t} />) : ''
            }
          </div>
        </div>
        <div className="d-block d-xl-none">
          <div className="row mt-5 pb-5 border-bottom">
            {
              news ? news.rows.map((news) => <CardNews news={news} type="news" show={3} t={t} />) : ''
            }
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-4"></div>
          <div className="col-4">
            <div className="text-center">
              <h2>{t('activity')}</h2>
            </div>
          </div>
          <div className="col-4">
            <div className="float-right">
              <Link href="/events">
              <button className="btn btn-outline-primary">{t('view_all')}</button>
              </Link>
              </div>
          </div>
        </div>
        <div className="row mt-5 pb-5 border-bottom">
          {
            activities ? activities.rows.map((news) => <CardNews news={news} type="activity" t={t} />) : ''
          }
        </div>
        <div className="row mt-5">
          <div className="col-4"></div>
          <div className="col-4">
          <div className="text-center">
              <h2>{t('procurement')}</h2>
            </div>
          </div>
          <div className="col-4">
          <div className="float-right">
            <Link href="/procure">
              <button className="btn btn-outline-primary">{t('view_all')}</button>
            </Link>
            </div>
          </div>
        </div>
        <div className="row mt-5 pb-5 border-bottom">
          {
            procurement ? procurement.rows.map((news) => <CardNews news={news} type="procurement" t={t} />) : ''
          }
        </div>
      </div>
    </>
  )
}
export default MainNews