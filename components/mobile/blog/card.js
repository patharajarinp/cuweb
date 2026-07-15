import React,{useEffect,useState} from "react";
import {Link, withTranslation} from "../../../utils/i18n";
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
  const banner = (val)=>{
    let tmp = val
    let img = tmp.filter((val)=>val.type == 1)
   if(img.length) return img[0].picture
    else  return '/mobile/icon/blog/blog-icon-chapter.svg'
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
    if (val.type == 0 && val.blog_data && val.blog_data.length ) {
      return `/blog/${val.id}/${val.blog_data[0].id}`
    }else{
      return `/blog/${val.id}`
    }
  }
  const img = (data)=>{
      
    const bm = data
        .filter((val) => val.type == 0 )
        .map((val) => {
          return { id: val.id, picture: val.picture };
        });
    if(bm.length) return bm[0].picture
    else return '/mobile/icon/blog-icon-chapter.svg'  
        // return bm[0].picture
  }
  return (
    <div id="blog-card" >
      {data?
      <Link href={checkLink(data)} as={checkLinkAs(data)}>
        <a>
          <div className="blog-card">
            <div className="blog-card-img-l">
              <div className="blog-card-img-m">
                <img className="blog-card-img-s" src={data.blog_group_banners.length!=0?img(data.blog_group_banners):'/mobile/icon/blog/blog-icon-chapter.svg'} />
              </div>
            </div>

            <div className="blog-card-detail">
              {/* <p className="blog-card-date">{formatDate(data.updatedAt)}</p> */}
              <p className="blog-card-title"> 
               {data.title}
              </p>
              <p className="blog-card-t">{t('writer')} : {penname}</p>
              <div className="blog-card-row">
                <img
                  src="/mobile/icon/blog/Group9242.svg"
                  className="blog-card-icon fav-none"
                />
                <p className="blog-card-like">{formatNum(data.blog_group_stat.liked)}</p>
             
                  <img
                    className="blog-card-icon eye"
                    src="/mobile/icon/blog/icon-eye.svg"
                  />
                  <p className="blog-card-p l">{formatNum(data.blog_group_stat.viewed)}</p>
                  
               
                
              </div>
              <div className="blog-card-row">
                
              <div className="blog-card-t2">
                  <div className={`blog-card-btn1 ${data.type == 0 ? 'blog-card-btn2':''}`}>
                    {data.type == 0 ?t('blog_card:type_one'):t('blog_card:eps')}
                    </div>
                </div>

                
              </div>
              
            </div>
          </div>
        </a>
      </Link>

      :""}
          </div>
  );
}
export default withTranslation('blog_card')(Card)