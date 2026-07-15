
import { useEffect } from 'react';
import { CardNews } from '../../components/widget/card_new';
import { Link, withTranslation } from "../../utils/i18n";

const MainArticle = (props) => {
  const {t,news,activities,procurement,articles} = props;
  
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
                  <a>{t('article')}</a>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className='col-12 text-center'>
            <h1 className='seo-text'>{t('article')}</h1>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-4"></div>
          <div className="col-4">
            <div className="text-center">
              <h2>{t('article')}</h2>
            </div>
          </div>
          <div className="col-4">
            <div className="float-right">
              <Link href="/all-book-article">
              <button className="btn btn-outline-primary">{t('view_all')}</button>
              </Link>
              </div>
          </div>
        </div>
        <div className="d-none d-xl-block">
          <div className="row mt-5 pb-5 border-bottom">
            {
              articles ? articles.rows.map((news) => <CardNews news={news} type="bookarticle" t={t} />) : ''
            }
          </div>
        </div>



      </div>
    </>
  )
}
export default MainArticle