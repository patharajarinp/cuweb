import React,{useState,useEffect} from "react";
import Slick from "react-slick";
import api from "../../../utils/api";
export default function SlideFolow({ writer,t }) {
  // console.log('writer', writer)
  const [follow, setfollow] = useState()
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 12,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
    ],
  };
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
  useEffect(() => {
    getfollow()
  }, [writer])
  const getfollow = ()=>{
    api.getFollowedAll(writer? writer.id:0)
    .then(async (res) => {
      setfollow(res.data)
     
    })
    .catch((err) => {
      console.log(err.response);
    });
  }
  const profile = (val) => {
    if (val.blog_writer && val.blog_writer.status == 1  && val.blog_writer.blog_writer_banners.length != 0 ) {

     var de =  val.blog_writer.blog_writer_banners.filter((val1) => val1.mimetype == "profile" && val1.status == 1).map((val1) => {
            return val1.picture 
          });
          
      return de[0]||"/icon/blog-icon-user.svg";
      // return val.blog_writer.blog_writer_banners[0].picture;
    }
    if (val.blog_writer && val.blog_writer.status != 1 ){
      return "/images/no-picture.png";
    }
    if (val.blog_writer && val.blog_writer.status == 1  &&  val.blog_writer.blog_writer_banners.length == 0) {
      return "/icon/blog-icon-user.svg";
    }
    if (!val.blog_writer &&val.user&& val.user.picture) {
      return val.user.picture;
    }
    if (!val.blog_writer && val.user && !val.user.picture) {
      return "/images/no-picture.png";
    }
    if (!val.blog_writer && !val.user) {
      return "/images/no-picture.png";
    }
  };
  return (<>
   {follow  && follow.length > 0 && <div className="text-center blog-slide-folow">
      <div className="container">
        <div className="row">
          <div className="col-12">
            
            <h3 className="mb-4">{t('follower')} {writer
                  ? formatNum(writer.blog_writer_stat.followed):0}</h3>
            <div className="mr-5 ml-5">
              <Slick {...settings}>
                {follow
                  ? follow.map((val) => val.status==1&&(
                      <div key={Math.random()} className="blog-slide-folow-img-l">
                        <div
                          className="blog-slide-folow-img"
                          style={{
                            backgroundImage: `url("${profile(val)}")`,
                          }}
                        ></div>
                      </div>
                    ))
                  : ""}
              </Slick>
            </div>
          </div>
        </div>
      </div>
    </div>}
  </>);
}
