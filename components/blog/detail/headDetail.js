import React, { useState, useEffect } from "react";
import LikeModal from "../modal/likeModal";
import ProblemModal from "../modal/problemModal";
import { Link } from "../../../utils/i18n";
import api from "../../../utils/api";

export default function HeadDetail({
  title,
  writer,
  tags,
  numdata,
  vote_count,
  votes_mb,
  onVotes,
  user,
  blog_id,
  onClickVotes,
  followeds,
  onFollow,
  t
}) {
  const [classnamebtn, setclassnamebtn] = useState("blog-head-detail-card-f");
  const [classnameebook, setclassnameebook] = useState(
    "blog-head-detail-card-btn-ebook"
  );
  const [txtbtn, settxtbtn] = useState("ติดตาม");
  const [txtbtnebook, settxtbtnebook] = useState("โหวดเรื่องนี้ให้เป็นอีบุ๊ค");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const postVotes = () => {
    api
      .postVotes({
        group_id: blog_id,
        member_id: user.id,
        stat: !votes_mb ? "votes" : "unvotes",
      })
      .then(async (res) => {
        onVotes();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const postFollowed = () => {
    api
      .postFollowed({ writer_id: writer.id, member_id: user.id })
      .then(async (res) => {
        onVotes();
        onFollow();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
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
  return (
    <div>
      <LikeModal handleClose={handleClose} show={show} />
      <ProblemModal handleClose={handleClose2} show={show2} />
      <div className="blog-head-detail-card">
        <div className="p-2">
          <div className="blog-grid-col-2-row2 mt-2 pb-2 pl-2 pr-2 align-items-center">
            <div className="blog-grid-item1 pb-xl-3">
            
              <h4>
                {t('title')} : {title}
                {<span style={{ color: "#E9C869" }}> ({numdata} {t('ep')})</span>}
              </h4>
            </div>
            <div className="blog-grid-item2 mt-2">
              <div className="blog-head-detail-card-l">
                <Link
                  href={`/blog/writer/[idwriter]?idwriter=${writer.id}`}
                  as={`/blog/writer/${writer.id}`}
                >
                  <a>
                    <div className="blog-head-detail-card-profile">
                      <div
                        className="blog-head-detail-card-profile-img mr-2"
                        style={{
                          backgroundImage: `url("${
                            !!writer.blog_writer_banners.length
                              ? img(writer.blog_writer_banners)
                              : "/icon/blog-icon-user.svg"
                          }")`,
                        }}
                      ></div>
                      <p className="blog-head-detail-card-profile-name mr-2">
                        {t('writer')} : {writer.penname1}
                      </p>
                    </div>
                  </a>
                </Link>
                {user && user.blog_writer && user.blog_writer.id != writer.id && (
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
                  </button>
                )}
                {user && !user.blog_writer && (
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
                  </button>
                )}
                {!user && (
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
                  </button>
                )}
              </div>
            </div>
            <div className="blog-grid-item3 blog-head-detail-card-btn-col">
            
              <button
                type="button"
                className={`blog-head-detail-card-btn-ebook ${
                  votes_mb ? "active" : " "
                }`}
                onClick={user != undefined ? postVotes : onClickVotes}
              >
                <img
                  className="mr-1 blog-icon-book"
                  style={{ marginBottom: "1px" }}
                  src="/icon/blog-icon-book-w.svg"
                />
                <img
                  className="mr-1 blog-icon-book-w"
                  style={{ marginBottom: "1px" }}
                  src="/icon/blog-icon-book-w.svg"
                />
                <img
                  className="mr-1 blog-icon-book-g"
                  style={{ marginBottom: "1px" }}
                  src="/icon/blog-icon-book-g.svg"
                />
                {`${
                  votes_mb
                    ? t('vote_t')
                    : t('vote')
                }`}
              </button>
            </div>
            <div className="blog-grid-item4 blog-head-detail-card-btn-col">
            
              <p className="m-0 mt-2">{t('voters')} : {formatNum(vote_count)}</p>
            </div>
            <div className="blog-grid-item5 ">
              <div className="d-flex m-0 mt-2 position-relative blog-tags-show-d justify-content-end">
                <div className="d-flex  blog-tags-show-d-2">
                  <p className=" m-0 p-1 pr-3 ">TAGS :</p>
                  {tags.map((val, index) => (
                    <div key={`tags${val.blog_tag.id}`}>
                      <Link
                        href={`/blog/filter?tags=${val.blog_tag.id}&blog=`}
                        as={`/blog/filter?tags=${val.blog_tag.id}&blog=`}
                      >
                        <a>
                          <p
                            key={`tags${val.blog_tag.id}`}
                            className="  text-center m-0 p-1 pr-3 pl-3 mr-2 blog-tags-show"
                          >
                            {val.blog_tag.tag_name}
                          </p>
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/*<div className="row pb-2 pl-2 pr-2">
            <div className="col-6">
              <div className="blog-head-detail-card-icon">
                <div
                  className="blog-head-detail-card-icon-h mr-2"
                  onClick={() => {
                    handleShow();
                  }}
                >
                  <img className="mr-2" src="/icon/Group9242.svg" />
                  <p className="blog-card-like">1,250</p>
                </div>
                <img className="mr-2" src="/icon/icon-eye.svg" />
                <p className="blog-card-p l mr-2">200K</p>
                <img className="mr-2" src="/icon/icon-message.svg" />
                <p className="blog-card-p mr-2">20K</p>
                <div
                  onClick={() => {
                    handleShow2();
                  }}
                  className="mr-2 blog-head-detail-card-icon-h-prop"
                >
                  <img
                    className="mr-2 blog-head-detail-card-icon-h-alert"
                    src="/icon/blog-icon-alert.svg"
                  />
                  <img
                    className="mr-2 blog-head-detail-card-icon-h-alert-b"
                    src="/icon/blog-icon-alert-b.svg"
                  />
                  <p className="blog-card-p mr-2 blog-head-detail-p-txt">
                    แจ้งปัญหา
                  </p>
                </div>
              </div>
            </div>*/}
          {/* <div className="col-6 text-right">
              <p className="m-0">TAGS :</p>
            </div> 
          </div>*/}
        </div>
      </div>
    </div>
  );
}
