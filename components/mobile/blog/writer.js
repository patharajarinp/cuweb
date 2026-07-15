import React from "react";

export default function Writer({data}) {
  const img = (data)=>{
      
    const bm = data
        .filter((val) => val.mimetype == "profile" && val.status == 1)
        .map((val) => {
          return { id: val.id, picture: val.picture };
        });

  if(bm.length) return bm[0].picture
  else return '/mobile/icon/blog/blog-icon-user.svg'     
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
  var detail ='';
  if(data){
    if(data.descriptions) {
      detail = data.descriptions.replace(/<[^>]+>/g, '');
    }    
  }
  return (
    <div >
      <div className="blog-card writer">
        <div className="blog-card-writer-img mb-2">
          <div
            className="blog-card-writer-img-l"
            style={{ backgroundImage: `url("${data.blog_writer_banners.length!=0 ?img(data.blog_writer_banners):'/mobile/icon/blog/blog-icon-user.svg'}")`}}
          ></div>
        </div>

        <p className="blog-card-writer-name mb-2">{data.penname1}</p>
        <div className="blog-card-writer-row ">
          <div className="blog-card-writer-col">
            <img className="blog-card-writer-icon" src="/mobile/icon/blog/icon-edit.svg" />
          <p className="blog-card-writer-p mb-2">{formatNum(data.blog_writer_stat.group_count)}</p>
          </div>
          <div className="blog-card-writer-col">
            <img className="blog-card-writer-icon" src="/mobile/icon/blog/icon-eye.svg" />
          <p className="blog-card-writer-p mb-2">{formatNum(data.blog_writer_stat.viewed)}</p>
          </div>
          <div className="blog-card-writer-col">
            <img className="blog-card-writer-iconl" src="/mobile/icon/blog/icon-user1.svg" />
            <p className="blog-card-writer-p mb-2">{formatNum(data.blog_writer_stat.followed)}</p>
          </div>
        </div>
         <p className="blog-card-writer-detail text-center mb-0" dangerouslySetInnerHTML={{__html: detail}}>
        </p>
       {/* <p className="blog-card-writer-txt">อ่านเพิ่มเติม</p> */}
      </div>
    </div>
  );
}
