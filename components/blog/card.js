import React,{useEffect,useState} from "react";
import {Link, withTranslation} from "../../utils/i18n";
import tools from "../../utils/tools";
function Card({penname,data,t}) {
  
  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      hour = "" + d.getHours(),
      minute = "" + d.getMinutes();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hour.length < 2) hour = "0" + hour;
    if (minute.length < 2) minute = "0" + minute;
    var dataDate = [day, month, year + 543].join("-");
    var dataTime = [hour, minute].join(":");
    var Tdate = dataDate + " " + dataTime;
    return Tdate;
  };
  const img = (data)=>{
      
    const bm = data
        .filter((val) => val.type == 0 )
        .map((val) => {
          return { id: val.id, picture: val.picture };
        });
    if(bm.length) return bm[0].picture
    else return '/icon/blog-icon-chapter.svg'  
        // return bm[0].picture
  }
  function formatNum (labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toString().slice(0, 4) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? (Math.abs(Number(labelValue)) / 1.0e+6).toString().slice(0, 4) + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? (Math.abs(Number(labelValue)) / 1.0e+3).toString().slice(0, 4) + "K"

    : Math.abs(Number(labelValue));

  }
  const checkLink = (val)=>{
    if (val.type == 0 && val.blog_data.length ) {
        return `/blog/[blogid]/[data_id]?blogid=${val.id}&data_id=${val.blog_data[0].id}`
    }else{
      return `/blog/[blogid]?blogid=${val.id}`
    }
  }
  const checkLinkAs = (val)=>{
    if (val.type == 0 && val.blog_data.length ) {
      return `/blog/${val.id}/${val.blog_data[0].id}`
    }else{
      return `/blog/${val.id}`
    }
  }
  return (
    <div id="blog-card" >
      {data?
      <Link href={checkLink(data)} as={checkLinkAs(data)}>
        <a>
          <div className="blog-card">
            <div className="blog-card-img-l">
              <div className="blog-card-img-m">
                <img className="blog-card-img-s" src={data.blog_group_banners.length!=0?img(data.blog_group_banners):'/icon/blog-icon-chapter.svg'} />
              </div>
            </div>

            <div className="blog-card-detail">
              <p className="blog-card-date">{tools.formatDate(data.updatedAt, true, false, true)}</p>
              <h3 className="blog-card-title"> 
               {data.title}
              </h3>
              <p className="blog-card-t">{t('writer')} : {penname}</p>
              <div className="blog-card-row">
                <img
                  title="ถูกใจ"
                  alt="ถูกใจ"
                  src="/icon/Group9242.svg"
                  className="blog-card-icon fav-none"
                />
                <p className="blog-card-like">{formatNum(data.blog_group_stat.liked)}</p>
                <div className="blog-card-t2">
                  <div className={`blog-card-btn1 ${data.type == 0 ? 'blog-card-btn2':''}`}>
                    {data.type == 0 ?t('type_one'):t('eps')}
                    </div>
                </div>
              </div>
              <div className="blog-card-row">
                <p className="blog-card-txt">{t('read_more')}</p>
                <div className="blog-card-ico">
                  <img
                  title="ยอดวิว"
                  alt="ยอดวิว"
                    className="blog-card-icon eye"
                    src="/icon/icon-eye.svg"
                  />
                  <p className="blog-card-p l">{formatNum(data.blog_group_stat.viewed)}</p>
                  <img
                  title="คอมเม้นท์"
                  alt="คอมเม้นท์"
                    className="blog-card-icon message"
                    src="/icon/icon-message.svg"
                  />
                  <p className="blog-card-p">{formatNum(data.blog_group_stat.comments)}</p>
                </div>

                {/* <p>75</p>
            <p>130</p> */}
              </div>
              {/* <p></p> */}
            </div>
          </div>
        </a>
      </Link>

      :""}
          </div>
  );
}
export default withTranslation("blog_card")(Card);