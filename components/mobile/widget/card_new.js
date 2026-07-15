// import Link from 'next/link';
import React from 'react';
import { Link, withTranslation } from '../../../utils/i18n';

const CardGrid = (props) => {
  const { news, type } = props;
  const {t,freespace} = props;
  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    var dataDate = [day, month, year].join('-');
    return dataDate;
  }
  var detail ;
  if(!news) return null
  if(news){
    detail = news.detail_th.replace(/<[^>]+>/g, '');
  }
  return (
    <> 
    {
      type == 'freespace'&&
      <><div className={"card-news nonecard"}></div> </>  
    }
      {
        type == 'news' && 
        <Link href={`/news/[subkey]?&subkey=${news.id}`} as={`/news/${news.id}`}>
          <div className="card-news mr-2" key={news.id && news.id}>
            <div className="card-news-pic" style={{ background: `url('${news && news.image}')` }}>
            </div>
            <div className="card-news-content">
              <h5 className="text-title-news mb-0">{news && news.title_th}</h5>

              {
                news && <p className="text-content-news mobile-editor" dangerouslySetInnerHTML={{ __html: detail }} />
              }

              <p className="text-date-news"> {news && formatDate(news.createdAt)}</p>
            </div>
          </div>
        </Link>
      }
      {
        type == 'newsAll' && 
        <Link href={`/news/[subkey]?subkey=${news.id}`} as={`/news/${news.id}`}>
          <div className="card-news my-2" key={news.id && news.id}>
            <div className="card-news-pic" style={{ background: `url('${news && news.image}')` }}>
            </div>
            <div className="card-news-content">
              <h5 className="text-title-news mb-0">{news && news.title_th}</h5>

              {
                news && <p className="text-content-news mobile-editor" dangerouslySetInnerHTML={{ __html: detail }} />
              }

              <p className="text-date-news"> {news && formatDate(news.createdAt)}</p>
            </div>
          </div>
        </Link>
      }
      {
        type == 'activity' && 
        <Link href={`/activities/[subkey]?subkey=${news.id}`} as={`/activities/${news.id}`}>
          <div className="card-news mr-2" key={news.id && news.id}>
            <div className="card-news-pic" style={{ background: `url('${news && news.image}')` }}>
            </div>
            <div className="card-news-content">
              <h5 className="text-title-news mb-0">{news && news.title_th}</h5>

              {
                news && <p className="text-content-news mobile-editor" dangerouslySetInnerHTML={{ __html: detail }} />
              }

              <p className="text-date-news"> {news && formatDate(news.createdAt)}</p>
            </div>
          </div>
        </Link>
      }
      {
        type == 'activityAll' &&  
        <Link href={`/activities/[subkey]?subkey=${news.id}`} as={`/activities/${news.id}`}>
          <div className="card-news my-2" key={news.id && news.id}>
            <div className="card-news-pic" style={{ background: `url('${news && news.image}')` }}>
            </div>
            <div className="card-news-content">
              <h5 className="text-title-news mb-0">{news && news.title_th}</h5>

              {
                news && <p className="text-content-news mobile-editor" dangerouslySetInnerHTML={{ __html: detail }} />
              }

              <p className="text-date-news"> {news && formatDate(news.createdAt)}</p>
            </div>
          </div>
        </Link>
      }
      {
        type == 'procurement' && 
        <Link href={`/procurement/[subkey]?subkey=${news.id}`} as={`/procurement/${news.id}`}>
          <div className="card-news mr-2" key={news.id && news.id}>
            <div className="card-procure-content bord-top">
              <h5 className="text-title-news mb-0">{news && news.title_th}</h5>
              {
                news && <p className="text-content-news mobile-editor" dangerouslySetInnerHTML={{ __html: detail }} />
              }
              <p className="text-date-news"> {news && formatDate(news.createdAt)}</p>
            </div>
          </div>
        </Link>
      }
      {
        type == 'procurementAll' && 
        <Link href={`/procurement/[subkey]?subkey=${news.id}`} as={`/procurement/${news.id}`}>
          <div className="card-news my-2" key={news.id && news.id}>
            <div className="card-procure-content bord-top">
              <h5 className="text-title-news mb-0">{news && news.title_th}</h5>
              {
                news && <p className="text-content-news mobile-editor" dangerouslySetInnerHTML={{ __html: detail }} />
              }
              <p className="text-date-news"> {news && formatDate(news.createdAt)}</p>
            </div>
          </div>
        </Link>
      }
      {
        type == 'bookarticle' && 
        <Link href={`/book-article/[subkey]?subkey=${news.id}`} as={`/book-article/${news.id}`}>
          <div className="card-news mr-2" key={news.id && news.id}>
            <div className="card-news-pic" style={{ background: `url('${news && news.image}')` }}>
            </div>
            <div className="card-news-content">
              <h5 className="text-title-news mb-0">{news && news.title_th}</h5>

              {
                news && <p className="text-content-news mobile-editor" dangerouslySetInnerHTML={{ __html: detail }} />
              }

              <p className="text-date-news"> {news && formatDate(news.createdAt)}</p>
            </div>
          </div>
        </Link>
      }
      {
        type == 'bookArticleAll' && 
        <Link href={`/book-article/[subkey]?subkey=${news.id}`} as={`/book-article/${news.id}`}>
          <div className="card-news my-2" key={news.id && news.id}>
            <div className="card-news-pic" style={{ background: `url('${news && news.image}')` }}>
            </div>
            <div className="card-news-content">
              <h5 className="text-title-news mb-0">{news && news.title_th}</h5>

              {
                news && <p className="text-content-news mobile-editor" dangerouslySetInnerHTML={{ __html: detail }} />
              }

              <p className="text-date-news"> {news && formatDate(news.createdAt)}</p>
            </div>
          </div>
        </Link>
      }
    </>
  )
}

export default withTranslation('mobile_home')(CardGrid)