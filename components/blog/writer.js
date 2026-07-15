import React,{useState} from "react";

export default function Writer({data}) {
  const [wimg, setwimg] = useState()
  const img = (data)=>{
      
      const bm = data
          .filter((val) => val.mimetype == "profile" && val.status == 1)
          .map((val) => {
            return { id: val.id, picture: val.picture };
          });

    if(bm.length) return bm[0].picture
    else return '/icon/blog-icon-user.svg'     
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
        <div className="blog-card-writer-img">
          <div
            className="blog-card-writer-img-l"
            style={{ backgroundImage: `url("${data.blog_writer_banners.length!=0 ?img(data.blog_writer_banners):'/icon/blog-icon-user.svg'}")`}}
          ></div>
        </div>

        <p className="blog-card-writer-name">{data.penname1}</p>
        <div className="blog-card-writer-row">
          <div className="blog-card-writer-col">
            <img title="บทความ" alt="บทความ" className="blog-card-writer-icon" src="/icon/icon-edit.svg" />
          <p className="blog-card-writer-p">{formatNum(data.blog_writer_stat.group_count)}</p>
          </div>
          <div className="blog-card-writer-col">
            <img title="ยอดวิว" alt="ยอดวิว" className="blog-card-writer-icon" src="/icon/icon-eye.svg" />
          <p className="blog-card-writer-p">{formatNum(data.blog_writer_stat.viewed)}</p>
          </div>
          <div className="blog-card-writer-col">
            <img title="ติดตาม" alt="ติดตาม"  className="blog-card-writer-iconl" src="/icon/icon-user1.svg" />
            <p className="blog-card-writer-p">{formatNum(data.blog_writer_stat.followed)}</p>
          </div>
        </div>
        <p className="blog-card-writer-detail mb-0 mb-lg-3" dangerouslySetInnerHTML={{__html: detail}} >
          
        </p>
        <p className="blog-card-writer-txt d-none d-lg-flex">อ่านเพิ่มเติม</p>
      </div>
    </div>
  );
}
