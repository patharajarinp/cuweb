import React, { memo ,useContext} from 'react'
import classNames  from 'classnames';
// import Link from 'next/link';
import tools from '../../utils/tools';
// import UserContext from '../../contexts/UserContext';
import { Link, withTranslation } from '../../utils/i18n';

// import { Link} from '../../utils/i18n'
// import AuthService from '../../utils/AuthService';
// import UserContext from '../../contexts/UserContext';
// import LoginLayout from '../../components/layout/login_layout'
// import { ProgressBar, Button, Modal } from 'react-bootstrap';
// import Cookies from 'js-cookie'
  const _CardNews = memo(props => {
  const {news,type ,show = 4, t,i18n} = props;
  
  // const {local } = useContext(UserContext)

  // console.log(i18n.language)
  var detail ='';
  if(news ){
    // var tmp = document.createElement("DIV");
    // tmp.innerHTML = news.detail_th;
    // detail=  tmp.textContent || tmp.innerText || "";
    detail = news.detail_th.replace(/<[^>]+>/g, '');
  }
  return (
    <>
      {
        type == 'news' && 
        <Link href={`/news/[subkey]?subkey=${news.id}`} as={`/news/${news.id}`}>
          <div  className={"cursor-pointer mb-4 col-" + (12 / show )} key={news.id && news.id} data={news.length}>
            <div className="card-news">
              <img src={news && news.image} className="img-news" alt={news && news.title_th} />
              <div className="card-date">
                <p className="text-default mb-0 font-14">{news && tools.formatDate(news.publish_date, true, false, true,true,i18n.language)}</p>
              </div>
              <div className="news-header">
                <h3>{news && news.title_th}</h3>
                { 
                  detail ? <div className="show-editor-main" ><h3 dangerouslySetInnerHTML={{ __html: detail }} /></div> : <div className="show-editor-main"></div>
                }
              </div>
              <div className="group-btn-news pt-3">
                
                <a className="text-pink">{t('read_more')}</a>
                
              </div>
            </div>
          </div>
        </Link>
      }
      {
        type == 'activity' &&  
        <Link href={`/activities/[subkey]?subkey=${news.id}`} as={`/activities/${news.id}`}>
          <div className="cursor-pointer mb-4 col-xl-3 col-md-4 my-3" key={news.id && news.id}>
            <div className="card-news">
              <img src={news && news.image} className="img-news" alt={news && news.title_th} />
              <div className="card-date">
                <p className="text-default mb-0 font-14">{news && tools.formatDate(news.publish_date, true, false, true,true,i18n.language)}</p>
              </div>
              <div className="news-header">
                <h3>{news && news.title_th}</h3>
                { 
                  detail ? <div className="show-editor-main" ><h3 dangerouslySetInnerHTML={{ __html: detail }} /></div> :  <div className="show-editor-main"></div>
                }
              </div>
              <div className="group-btn-news pt-3">
              
                  <a className="text-pink">{t('read_more')}</a>
                
              </div>
            </div>
          </div>
        </Link>
      }

      {
        type == 'procurement' && 
          <Link href={`/procurement/[subkey]?subkey=${news.id}`} as={`/procurement/${news.id}`}>
          <div className="cursor-pointer mb-4 col-xl-4 col-md-4 my-3" key={news.id && news.id}>
            <div className="card-download">
              <p className="text-default mb-2 font-14">{news && tools.formatDate(news.publish_date, true, false, true)}</p>
              <div className="download-header">
                <h3>{news && news.title_th}</h3>
                { 
                  detail ? <div className="show-editor-main paragrahp" ><h3 dangerouslySetInnerHTML={{ __html: detail }} /></div> : <div className="show-editor-main paragrahp"></div>
                }
              </div>
              <div className="group-btn-news pt-3">
                
                  <a className="text-pink">{t('read_more')}</a>
              
              </div>
            </div>
          </div> 
        </Link>
      }
      {
        type == 'promotion' && 
        <Link href={`/promotion/[subkey]?subkey=${news.id}`} as={`/promotion/${news.id}`}>
          <div className="cursor-pointer mb-4 col-xl-3 col-md-4 my-3"  key={news.id && news.id}>
            <div className="card-promotion">
              <img src={news && news.image} className="img-news" alt={news && news.title_th} />
              {/* <div className="card-date">
                <p className="text-default mb-0 font-14">{news && tools.formatDate(news.publish_date, true, false, true)}</p>
              </div> */}
              <div className="news-header">
                <h3>{news && news.title_th}</h3>
              </div>
              <div className="group-btn-news">
                
                  <a className="text-pink">{t('read_more')}</a>
              </div>
            </div>
          </div>
        </Link>
      }

      {
          type == 'bookarticle' && 
        <Link href={`/book-article/[subkey]?subkey=${news.id}`} as={`/book-article/${news.id}`}>
          <div  className={"cursor-pointer mb-4 col-" + (12 / show )} key={news.id && news.id} data={news.length}>
            <div className="card-news">
              <img src={news && news.image} className="img-news" alt={news && news.title_th} />
              <div className="card-date">
                <p className="text-default mb-0 font-14">{news && tools.formatDate(news.publish_date, true, false, true,true,i18n.language)}</p>
              </div>
              <div className="news-header">
                <h3>{news && news.title_th}</h3>
                { 
                  detail ? <div className="show-editor-main" ><h3 dangerouslySetInnerHTML={{ __html: detail }} /></div> : <div className="show-editor-main"></div>
                }
              </div>
              <div className="group-btn-news pt-3">
                
                <a className="text-pink">{t('read_more')}</a>
                
              </div>
            </div>
          </div>
        </Link>
      }
    </>
  )
})

const CardNews = withTranslation()(_CardNews);
export {
  CardNews
}
