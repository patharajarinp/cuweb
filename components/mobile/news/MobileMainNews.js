import { Link, withTranslation } from "../../../utils/i18n";
import CardNews from '../../../components/mobile/widget/card_new';
import BreadcrumbMB from "../BreadcrumbMB";
import Navbar from '../../../components/mobile/layout/Navbar';

const MobileMainNews = (props) => {
  const {t,news,activities,procurement} = props;

  return (
    <>
      {/* <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h1 className="text-h4">{t("header:news_and_activities")}</h1>
        </div>
        <Link href='/'>
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
       </Link> 
      </div> */}
      <Navbar isSeller={true} />
      {/* <div className="padding-top-for-box"></div> */}
      <div className="bg-light-less-gray min-vh-100">
        {/* <div className="h-64px"></div> */}
        <BreadcrumbMB 
          item={[
            {text: "หน้าหลัก",href:'/',as:'/'},
            {text: t('news'),active:true}
          ]}
        />
        <div className="container py-3 bg-white">
          <div className="d-flex justify-content-center ">
            <div>
              <h1 className="text-black text-h4 mb-0">{t("news")}</h1>
            </div>
          </div>
        </div>
        <div className="all-card-news ">
          <div className="container py-3 bg-white">
            <div className="d-flex justify-content-between ">
              <div>
                <h4 className="text-black">{t("news_activity")}</h4>
              </div>
              <Link href="/news-article">
              <a ><p className="text-pink see-all-link">{t("view_all")}</p></a>
              </Link>
            </div>
            <div className="d-flex justify-content-start all-card-book">
              {
                news ? news.rows.slice(0,3).map((news, index) => <CardNews news={news} type="news" key={index} />) : ''
              }
              <CardNews type="freespace" />
            </div>
          </div>
        </div>
        <div className="all-card-news mt-3 ">
          <div className="container py-3 bg-white">
            <div className="d-flex justify-content-between ">
              <div>
                <h4 className="text-black">{t("activity")}</h4>
              </div>
              <Link href="/events">
              <a ><p className="text-pink see-all-link">{t("view_all")}</p></a>
              </Link>
            </div>
            <div className="d-flex justify-content-start all-card-book">
              {
                activities ? activities.rows.slice(0,3).map((activities, index) => <CardNews news={activities} type='activity' key={index} />) : ''
              } 
                <CardNews type="freespace" />
            </div>
          </div>
        </div>
        <div className="all-card-news mt-3 ">
          <div className="container py-3 bg-white">
            <div className="d-flex justify-content-between ">
              <div>
                <h4 className="text-black">{t("procurement")}</h4>
              </div>
              <Link href="/procure">
              <a ><p className="text-pink see-all-link">{t("view_all")}</p></a>
              </Link>
            </div>
            <div className="d-flex justify-content-start all-card-book">
              {
                procurement ? procurement.rows.slice(0,3).map((procurement, index) => <CardNews news={procurement} type='procurement' key={index} />) : ''
              } 
                <CardNews type="freespace" />
            </div>
          </div>
        </div>
        <div className="footer-space"></div>
      </div>
    </>
  )
}
export default MobileMainNews