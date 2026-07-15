import React, { useState,useEffect } from "react";
import api from '../../../utils/api'
import LikeModal from "../modal/likeModal";
export default function HeadWriter({t,profile,penname,writer,followeds,onClickVotes,user,onFollow}) {
  const [classnamebtn, setclassnamebtn] = useState("blog-head-detail-card-f");

  const [txtbtn, settxtbtn] = useState("ติดตาม");
  const [follow, setfollow] = useState([])

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    getfollow()
  }, [])
  const postFollowed = ()=>{
    api.postFollowed({writer_id:writer.id,member_id:user.id})
    .then(async (res) => {

      onFollow()
      getfollow()
    })
    .catch((err) => {
      console.log(err.response);
    });
  }
  const getfollow = ()=>{
    api.getFollowedAll( writer.id)
    .then(async (res) => {
      setfollow(res.data)
     
    })
    .catch((err) => {
      console.log(err.response);
    });
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
  return (
    <>
     
     <LikeModal onFollow={getfollow} onClickVotes={onClickVotes} user={user} follow={follow} handleClose={handleClose} show={show} followed={writer?writer.blog_writer_stat.followed:0} /> 
    <div className="blog-head-writer-pages">
    <div className="row">
      <div  id="blog-head-writer-pages" className="col-12 blog-head-writer-pages-profile-div">
         
          <div
            className="blog-head-detail-card-profile-img"
            
          ><div className="blog-image-cropper">
            <img width="100%" height="100%" src={profile.length!=0 ?profile[0].img:'/icon/blog-icon-user.svg'} className="blog-rounded" />
          </div>

          </div>
          
        

          <div className="blog-head-writer-pages-card">
             <div className="blog-head-writer-pages-name">
          
             {user&& user.blog_writer&&user.blog_writer.id != writer.id&&
                 <button
                  type="button"
                  className={`blog-head-detail-card-f ${
                    followeds ? " active" : ""
                  }`}
                  onClick={user != undefined ? postFollowed : onClickVotes}
                >
                  <img
                    className="mr-1 icon-blog-norti"
                    style={{ marginBottom: "1px" }}
                    src="/icon/icon-blog-norti.svg"
                  />
                  <img
                    className="mr-1 icon-blog-norti-w"
                    style={{ marginBottom: "1px" }}
                    src="/icon/icon-blog-norti.svg"
                  />
                  {`${followeds ? t('following') : t('follow')}`}
                </button>}
                {user&& !user.blog_writer&&
                 <button
                  type="button"
                  className={`blog-head-detail-card-f ${
                    followeds ? " active" : ""
                  }`}
                  onClick={user != undefined ? postFollowed : onClickVotes}
                >
                  <img
                    className="mr-1 icon-blog-norti"
                    style={{ marginBottom: "1px" }}
                    src="/icon/icon-blog-norti.svg"
                  />
                  <img
                    className="mr-1 icon-blog-norti-w"
                    style={{ marginBottom: "1px" }}
                    src="/icon/icon-blog-norti.svg"
                  />
                  {`${followeds ? t('following') : t('follow')}`}
                </button>}
                {!user&&
                 <button
                  type="button"
                  className={`blog-head-detail-card-f ${
                    followeds ? " active" : ""
                  }`}
                  onClick={user != undefined ? postFollowed : onClickVotes}
                >
                  <img
                    className="mr-1 icon-blog-norti"
                    style={{ marginBottom: "1px" }}
                    src="/icon/icon-blog-norti.svg"
                  />
                  <img
                    className="mr-1 icon-blog-norti-w"
                    style={{ marginBottom: "1px" }}
                    src="/icon/icon-blog-norti.svg"
                  />
                  {`${followeds ? t('following') : t('follow')}`}
                </button>}
          
             </div>
             <div className="blog-head-writer-pages-folow mt-2">
                 <span className="blog-head-writer-pages-folow-color" onClick={handleShow}>
                   {t('follower')} {writer?formatNum(writer.blog_writer_stat.followed):0}
                 </span>
             </div>
         </div>
      
      </div>
      
    </div>
      <div className="row mt-2 pb-3 pr-3 pl-3">
        <div className="col-12 text-center"><h2 className="mr-2">{penname?penname:''}</h2></div>
        <div className="col-12 text-center">
          <div className="blog-head-writer-pages-detail">
            <div className="blog-head-writer-pages-detail-l">
              <img title="บทความ" alt="บทความ"  className="mr-3" src="/icon/blog-icon-edit.svg"/>
              <p className="m-0 mr-5 blog-head-writer-pages-detail-txt">{t('writings')} {writer?formatNum(writer.blog_writer_stat.group_count):0} {t('sj')}</p>
              <img title="ยอดวิว" alt="ยอดวิว"  className="mr-3" src="/icon/blog-icon-eye-g.svg"/>
              <p className="m-0 mr-5 blog-head-writer-pages-detail-txt">{t('view')} {writer?formatNum(writer.blog_writer_stat.viewed):0}</p>
              <img title="ถูกใจ" alt="ถูกใจ"  className="mr-3" src="/icon/blog-icon-like-g.svg"/>
              <p className="m-0 blog-head-writer-pages-detail-txt">{t('like')} {writer?formatNum(writer.blog_writer_stat.liked):0}</p>
            </div>
          </div>
        </div>
        <div className="col-12 pb-3 pt-4">
          <div className="show-editor ck ck-content" dangerouslySetInnerHTML={{ __html: (writer.descriptions ? writer.descriptions : null) }} />
        </div>
        
      </div>
    </div>
  </>);
}
