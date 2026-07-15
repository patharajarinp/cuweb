import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import api from "../../../../utils/api";
export default function LikeModal({
  show,
  handleClose,
  followed,
  follow,
  user,
  onClickVotes,onFollow
}) {
  // const profile = (val) => {
  //   if (val.blog_writer && val.blog_writer.blog_writer_banners.length != 0) {
  //     return val.blog_writer.blog_writer_banners[0].picture;
  //   }
  //   if (val.blog_writer && val.blog_writer.blog_writer_banners.length == 0) {
  //     return "/mobile/icon/blog/blog-icon-user.svg";
  //   }
  //   if (!val.blog_writer && val.user.picture) {
  //     return val.user.picture;
  //   }
  //   if (!val.blog_writer && val.user.picture) {
  //     return "";
  //   }
  // };
  const profile = (val) => {
    if (val.blog_writer && val.blog_writer.status == 1  && val.blog_writer.blog_writer_banners.length != 0 ) {

     var de =  val.blog_writer.blog_writer_banners.filter((val1) => val1.mimetype == "profile" && val1.status == 1).map((val1) => {
            return val1.picture 
          });
          
      return de[0]||"/mobile/icon/blog-icon-user.svg";
      // return val.blog_writer.blog_writer_banners[0].picture;
    }
    if (val.blog_writer && val.blog_writer.status != 1 ){
      return "/mobile/image/user/no-picture.png";
    }
    if (val.blog_writer && val.blog_writer.status == 1  &&  val.blog_writer.blog_writer_banners.length == 0) {
      return "/mobile/icon/blog-icon-user.svg";
    }
    if (!val.blog_writer && val.user && val.user.picture) {
      return val.user.picture;
    }
    if (!val.blog_writer && val.user && !val.user.picture) {
      return "/mobile/image/user/no-picture.png";
    }
    if (!val.blog_writer && !val.user) {
      return "/mobile/image/user/no-picture.png";
    }
  };
  const postFollowed=(id)=>{
    api.postFollowed({writer_id:id,member_id:user.id})
    .then(async (res) => {

      onFollow()
    })
    .catch((err) => {
      console.log(err.response);
    });
  }
  const clbtn =(val)=>{
    let b = val.blog_writer.blog_writer_followeds.filter(vall=>vall.member_id == user.id&&vall.status==1)
    if (b.length) {
      return true
    } else {
      return false
    }
  }
  const btnFollow = (val) => {
    if (val.blog_writer) {
      if (
        user &&
        user.blog_writer &&
        val.blog_writer.id != user.blog_writer.id
      ) {
        return (
          <button
            type="button"
            className={`blog-head-detail-card-f ${user&&clbtn(val)?'active':''}`}
            onClick={()=>{if(user != undefined){postFollowed(val.blog_writer.id)}else{onClickVotes()} }}
          >
            <img
              className="mr-1 icon-blog-norti"
              style={{ marginBottom: "1px" }}
              src="/mobile/icon/blog/icon-blog-norti.svg"
            />
            <img
              className="mr-1 icon-blog-norti-w"
              style={{ marginBottom: "1px" }}
              src="/mobile/icon/blog/icon-blog-norti.svg"
            />
            {user&&clbtn(val)?'ติดตามแล้ว':'ติดตาม'}
          </button>
        );
      }
      if(user&&!user.blog_writer) {
        return (
          <button
            type="button"
            className={`blog-head-detail-card-f ${user&&clbtn(val)?'active':''}`}
            onClick={()=>{if(user != undefined){postFollowed(val.blog_writer.id)}else{onClickVotes()} }}
          >
            <img
              className="mr-1 icon-blog-norti"
              style={{ marginBottom: "1px" }}
              src="/mobile/icon/blog/icon-blog-norti.svg"
            />
            <img
              className="mr-1 icon-blog-norti-w"
              style={{ marginBottom: "1px" }}
              src="/mobile/icon/blog/icon-blog-norti.svg"
            />
            {user&&clbtn(val)?'ติดตามแล้ว':'ติดตาม'}
          </button>
        );
      }if (!user){
        return (
          <button
            type="button"
            className={`blog-head-detail-card-f ${user&&clbtn(val)?'active':''}`}
            onClick={()=>{if(user != undefined){postFollowed(val.blog_writer.id)}else{onClickVotes()} }}
          >
            <img
              className="mr-1 icon-blog-norti"
              style={{ marginBottom: "1px" }}
              src="/mobile/icon/blog/icon-blog-norti.svg"
            />
            <img
              className="mr-1 icon-blog-norti-w"
              style={{ marginBottom: "1px" }}
              src="/mobile/icon/blog/icon-blog-norti.svg"
            />
            {user&&clbtn(val)?'ติดตามแล้ว':'ติดตาม'}
          </button>
        );
      }
    }
  };
  return (
    <div className="blog-modal-like1">
      <Modal centered show={show} onHide={handleClose} size={"md"}>
        <div className="blog-modal-l">
          <div className="blog-modal-header">
            <p className="blog-modal-header-l">รายชื่อผู้ติดตาม</p>
            <p className="blog-modal-header-r">{followed} คน</p>
          </div>
          <div className="blog-modal-body">
            {follow &&
              follow.length != 0 &&
              follow.map((val, index) => (
                <div key={Math.random()} className="blog-modal-item">
                  <div className="w-50">
                    <div
                      className="blog-modal-item-img"
                      style={{
                        backgroundImage: `url("${profile(val)}")`,
                      }}
                    ></div>
                  </div>

                  <div className="blog-modal-item-name w-100">
                  {val.blog_writer && val.blog_writer.status == 1 &&val.blog_writer.penname1}
                    {!val.blog_writer || val.blog_writer.status != 1 && val.user.firstname}{" "}
                    {!val.blog_writer || val.blog_writer.status != 1 && val.user.lastname}
                    {!val.blog_writer&& val.user&& val.user.firstname}{" "}
                    {!val.blog_writer&& val.user&& val.user.lastname}
                  </div>
                  <div className="w-100 text-right">{val.blog_writer &&val.blog_writer.status == 1 && btnFollow(val)}</div>
                </div>
              ))}
          </div>
          <div className="blog-modal-footer">
            <button
              className="blog-modal-btn"
              type="button"
              onClick={handleClose}
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
