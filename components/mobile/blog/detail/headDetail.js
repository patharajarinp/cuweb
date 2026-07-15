import React, { useState, useEffect } from "react";
// import LikeModal from "../modal/likeModal";
import ProblemModal from "../modal/problemModal";
import api from "../../../../utils/api";
import { Link } from "../../../../utils/i18n";

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
  return (
    <div>
      <ProblemModal handleClose={handleClose2} show={show2} />
      <div className="blog-head-detail-card">
        <div className="p-3">
          <h4 className="font-24">
            {t('title')} : {title}
            {<span style={{ color: "#E9C869" }}> ({numdata} ตอน)</span>}
          </h4>
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
                          : "/mobile/icon/blog/blog-icon-user.svg"
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
                  src="/mobile/icon/blog/icon-blog-norti.svg"
                />
                <img
                  className="mr-1 icon-blog-norti-w"
                  style={{ marginBottom: "1px" }}
                  src="/mobile/icon/blog/icon-blog-norti.svg"
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
                  src="/mobile/icon/blog/icon-blog-norti.svg"
                />
                <img
                  className="mr-1 icon-blog-norti-w"
                  style={{ marginBottom: "1px" }}
                  src="/mobile/icon/blog/icon-blog-norti.svg"
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
                  src="/mobile/icon/blog/icon-blog-norti.svg"
                />
                <img
                  className="mr-1 icon-blog-norti-w"
                  style={{ marginBottom: "1px" }}
                  src="/mobile/icon/blog/icon-blog-norti.svg"
                />
                {`${followeds ? t('following') : t('follow')}`}
              </button>
            )}
          </div>

          <hr style={{ width: "95%" }} />
          <div className=" m-0 mt-2 mb-3">
            <div className="d-flex blog-tags-show-d-2">
              <p className=" m-0 p-1 pr-3 font-16 ">TAGS :</p>
              {tags.map((val, index) => (
                <div key={`tags${val.blog_tag.id}`}>
                  <Link
                    href={`/blog/filter?tags=${val.blog_tag.id}`}
                    as={`/blog/filter?tags=${val.blog_tag.id}`}
                  >
                    <a>
                      <p
                        key={`tags${val.blog_tag.id}`}
                        className="  text-center m-0 p-0 pr-3 pl-3 my-1 mr-2 blog-tags-show"
                      >
                        {val.blog_tag.tag_name}
                      </p>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>

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
              src="/mobile/icon/blog/blog-icon-book-w.svg"
            />
            <img
              className="mr-1 blog-icon-book-w"
              style={{ marginBottom: "1px" }}
              src="/mobile/icon/blog/blog-icon-book-w.svg"
            />
            <img
              className="mr-1 blog-icon-book-g"
              style={{ marginBottom: "1px" }}
              src="/mobile/icon/blog/blog-icon-book-g.svg"
            />
            {`${
              votes_mb
                ? t('vote_t')
                : t('vote')
            }`}
          </button>
          <p className="m-0 mt-3 text-center">{t('voters')} : {formatNum(vote_count)}</p>
        </div>
      </div>
    </div>
  );
}
