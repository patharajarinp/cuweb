import React, { useState, useRef, useEffect } from "react";
import ProblemModal from "../modal/problemModal";
import api from "../../../utils/api";
import tools from "../../../utils/tools";
import { useRouter } from "next/router";
import LoginLayout from "../../layout/login_layout";
import { Modal } from "react-bootstrap";
import ConfirmDialog from '../../../components/ConfirmDialog'
import ButtonLoad from "../../../components/backend_blog/widget/ButtonLoad";
import Filter from 'bad-words';
import {DebounceInput} from 'react-debounce-input';
// {id:1,check:0},{id:2,check:1}
import emoji from 'emoji.json'

export default function Comment({
  data1,
  group_id,
  data_id,
  member_id,
  onAction,
  onMore,
  limit,
  all,
  user,
  blog,t,
  fetchComment
}) {
  const router = useRouter();

  const data_id1 = Number(router.query.data_id);
  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [comment, setcomment] = useState("");
  const [commentRe, setcommentRe] = useState("");
  const [chReply, setchReply] = useState([]);
  const [chEdit, setchEdit] = useState([]);
  const [chEmoEdit, setchEmoEdit] = useState([]);
  const [chEmoEditReply, setchEmoEditReply] = useState([]);
  const [chEmoReply, setchEmoReply] = useState([]);
  const [data, setdata] = useState();
  const formEl = useRef(null);
  const formEl1 = useRef(null);
  const [showLogin, setShowLogin] = useState(false);
  const [commentId, setcommentId] = useState('')
  const [issue_type, setissue_type] = useState(0)
  const [addNew, setaddNew] = useState(0)
  const [bad, setBad] = useState();
  const [loading, setLoading] = useState(false)
  const [clickEmoji, setclickEmoji] = useState(false)
  const [emojiItem, setemojiItem] = useState()
  const handleCloseLogin = () => {
    setShowLogin(false);
  };
  const formEl2 = useRef(null);
  // console.log('data', data)
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
  const toFrom = (formData) => {
    var object = "";
    formData.forEach((value, key) => {
      object = value;
    });
    return object;
  };
  const postComment = async (e, type, id) => {
    e.preventDefault();

    if (user != undefined) {
      const dataa = toFrom(new FormData(e.target));
      var data = new FormData();
      data.append("member_id", member_id);
      data.append("data_id", data_id);
      data.append("group_id", group_id);
      data.append("comment", dataa);
      // var data1 = new FormData(formEl1.current);
      // data1.append("member_id", member_id);
      // data1.append("data_id", data_id);
      // data1.append("group_id", group_id);

      if (type == "reply") {
        data.append("reply_id", id);
      } else if (type == "edit") {
        data.append("id", id);
      }

      var text = dataa
      var filter = new Filter({ regex: /\*|\.|$/gi });
      if(bad){
        var val_en = bad.detail_en;
        var word_en = val_en.split(",");
        word_en.forEach(val => {
          filter.addWords(val);
        });
  
        var val_th = bad.detail_th;
        var word_th = val_th.split(",");
        var found = false;
        for(var i = 0; i < word_th.length; i++) {
          const v = word_th[i]
          if(text.search(v) !=  -1){
            found = true
            break;
          }
        }
      }
      
      var Ntext = filter.clean(text);
      var find = Ntext.includes('*');
      // console.log('find', find)
      if(find || found) {
        setModalShow(true)
      }else{
        await onPostComment(data, type ,id);
      }
      
    } else {
      setShowLogin(true);
    }
  };
  const onPostComment = async (data, type, id) => {
    setLoading(true)
    api
      .postComments(data)
      .then(async (res) => {
     
        setaddNew(res.data.id)
        onAction();
        document.getElementById("form-comment").reset();
        if (type == "reply")
          document.getElementById(`form-comment-reply-${id}`).reset();
        if (type == "edit") {
          setchEdit([]);
        }
        setTimeout(() => {
          setaddNew(0)
        }, 2000);
        setLoading(false)
      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false)
      });
  };
  const onConfirm = ()=>{
    setModalShow(false);
  }

  useEffect(() => {
    setdata(data1 ? data1 : []);
    getBadword()
    // .map((val) => {
    //   return { id: val.id, img: val.picture };
    // });
    // console.log('object', bm[0])
    // console.log('blog', blog ,data)
    setemojiItem( emoji
      .filter((val,index) => val.group == 'Smileys & Emotion' && val.codes !== "1F978" && val.codes !== '2639' && val.codes !== "1F972" && val.name !== "smiling face" && val.codes !== '2620'  )
      .map((val,index) => ({ title:val.name , character:val.char })))

  }, [data1]);
  // console.log('emojiItem', emojiItem)
  const getBadword = () => {
    api.getBadword(1)
    .then(res=>{
      const data = res.data;
      ;
      setBad(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  useEffect(() => {
    setchReply([]);
    setchEdit([]);
  }, [data_id1]);
  const chreply = (vall) => {
    // console.log("chReply", chReply);
    if (chReply.length != 0) {
      const bm = chReply
        .filter((val) => val.id == vall.id && val.check == 1)
        .map((val) => {
          return "sde";
        });
      // console.log("object", bm);
      return bm;
    }
  };

  const onClickChek = (val) => {
    let tmp = [...chReply];
    let l;

    for (let index = 0; index < tmp.length; index++) {
      // if (!tmp[index]) {
      //   tmp.push({id:val.id,check:1})
      //   console.log(tmp[index])
      // }else
      if (tmp[index].id == val.id) {
        l = index;
      }
    }
    if (l == undefined) {
      tmp.push({ id: val.id, check: 1 });
    } else if (tmp[l].check == 1) {
      // console.log('1')
      tmp[l].check = 0;
    } else if (tmp[l].check == 0) {
      // console.log('0')
      tmp[l].check = 1;
    }
    // tmp[index].check = 0
    // && tmp[index].check == 1
    // console.log(tmp, l)
    setchReply(tmp);
    setaddNew(0)
  };
  const chedit = (vall) => {
    // console.log("chReply", chReply);
    if (chEdit.length != 0) {
      const bm = chEdit
        .filter((val) => val.id == vall.id && val.check == 1)
        .map((val) => {
          return "sde";
        });
      // console.log("object", bm);
      return bm;
    }
  };

  const onClickChekEdit = (val) => {
    let tmp = [...chEdit];
    let l;

    for (let index = 0; index < tmp.length; index++) {
      // if (!tmp[index]) {
      //   tmp.push({id:val.id,check:1})
      //   console.log(tmp[index])
      // }else
      if (tmp[index].id == val.id) {
        l = index;
      }
    }
    if (l == undefined) {
      tmp.push({ id: val.id, check: 1 });
    } else if (tmp[l].check == 1) {
      // console.log('1')
      tmp[l].check = 0;
    } else if (tmp[l].check == 0) {
      // console.log('0')
      tmp[l].check = 1;
    }
    // tmp[index].check = 0
    // && tmp[index].check == 1
    // console.log(tmp, l)
    // setdata(data1)
    onAction()
    setchEdit(tmp);
  };
  // console.log('data1', data1)
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
    if (!val.blog_writer && val.user.picture) {
      return val.user.picture;
    }
    if (!val.blog_writer && val.user && !val.user.picture) {
      return "/images/no-picture.png";
    }
    if (!val.blog_writer && !val.user.picture) {
      return "/images/no-picture.png";
    }
  };
  const chEmoEditFu = (data)=>{
    let tmp = [...chEmoEdit]
    let tmp2 = tmp.findIndex(val=>val.id==data)
    if(tmp2 !== -1){
      tmp[tmp2].ch = !tmp[tmp2].ch
    }else{
      tmp.push({id:data,ch:true})
    }
    setchEmoEdit(tmp)
  }
  const chEmoEditFuShow = (data)=>{
    if(!chEmoEdit.length) return false
    let tmp = [...chEmoEdit]
    let tmp2 = tmp.findIndex(val=>val.id==data)
    if(tmp2 !== -1){
      return tmp[tmp2].ch 
    }else{
      return false
    }

  }
  const chEmoEditReplyFu = (data)=>{
    let tmp = [...chEmoEditReply]
    let tmp2 = tmp.findIndex(val=>val.id==data)
    if(tmp2 !== -1){
      tmp[tmp2].ch = !tmp[tmp2].ch
    }else{
      tmp.push({id:data,ch:true})
    }
    setchEmoEditReply(tmp)
  }
  const chEmoEditReplyFuShow = (data)=>{
    if(!chEmoEditReply.length) return false
    let tmp = [...chEmoEditReply]
    let tmp2 = tmp.findIndex(val=>val.id==data)
    if(tmp2 !== -1){
      return tmp[tmp2].ch 
    }else{
      return false
    }

  }
  const chEmoReplyFu = (data)=>{
    let tmp = [...chEmoReply]
    let tmp2 = tmp.findIndex(val=>val.id==data)
    if(tmp2 !== -1){
      tmp[tmp2].ch = !tmp[tmp2].ch
    }else{
      tmp.push({id:data,ch:true})
    }
    setchEmoReply(tmp)
  }
  const chEmoReplyFuShow = (data)=>{
    if(!chEmoReply.length) return false
    let tmp = [...chEmoReply]
    let tmp2 = tmp.findIndex(val=>val.id==data)
    if(tmp2 !== -1){
      return tmp[tmp2].ch 
    }else{
      return false
    }

  }
  return (
    <div className="blog-comment-component mt-64px">
     
         <ProblemModal handleClose={handleClose} show={show} user={user} blog={blog} group_id={group_id} data_id={data_id} commentId={commentId} type={2} />
      
     
      <div className="blog-comment-component-head">
        
        <h4 className="pt-3 pb-3 m-0 blog-comment-component-head-txt">
          {t('write_comment')}
        </h4>
      </div>
      <form
        id="form-comment"
        onSubmit={(e) => postComment(e)}
        encType="multipart/form-data"
        ref={formEl}
      >
        <textarea 
          name="comment"
          id="comment"
          placeholder={t('write_comment')+" ..."}
          
          required
        />
        
        <div className="d-flex justify-content-end align-items-center">
          {/* <button className="blog-detail-story-detail-card-btn-n" type="submit">
            
          </button> */}
          <div>
            <div className="blog-comment-emoji-btn mr-2" onClick={()=>setclickEmoji(!clickEmoji)}>
              <i className="far fa-smile" style={{fontSize:'20px'}}></i>
            </div>
            <div className={`blog-comment-emoji-card ${clickEmoji ? 'd-flex':'d-none'}`}>
              {emojiItem&&emojiItem.map((val)=>
                <div key={Math.random()} className="blog-comment-emoji-item" onClick={()=>{document.getElementById('comment').value += val.character;setclickEmoji(!clickEmoji)}}>{val.character}</div>
              )}
            </div>
          </div>
        
          <ButtonLoad
              _type="submit"
              loading={loading}
              _class="blog-detail-story-detail-card-btn-n blog-w-200px"
              _name={t('send_comment')}
              // disabled={!unSave}
             
            />
        </div>
      </form>

      {data && data.count > 0 && (
        <>
          <div className="blog-comment-component-head mt-3">
            <h4 className="pt-3 pb-3 m-0 blog-comment-component-head-txt">
              {t('comment')}
            </h4>
          </div>
          {data.rows.map(
            (val, index) =>
              (
                <div  key={index}  >
                  <div
                    className={
                      chreply(val) && chreply(val).length != 0
                        ? "blog-comment-component-item-b active"
                        : "blog-comment-component-item-b"
                    }
                    // className={`blog-comment-component-item-b`}
                  >
                  
                    <div className={`blog-comment-component-item blog-comme  ${addNew == val.id ? "blog-new" : ""}`}>
                      <div className="row mt-3 pb-3 pl-3 pr-3">
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            {val.user.id == blog.blog_group.blog_writer.member_id ?<>
                            <div
                              className="blog-comment-component-item-img mr-2"
                              style={{
                                backgroundImage: `url("${profile(blog.blog_group)}")`,
                              }}
                            ></div>
                            <div>
                              <p className="m-0">
                                {t('comments')} {val.index}
                              </p>
                              <p className="m-0">{`${blog.blog_group.blog_writer.penname1}`}</p>
                            </div>
                          </>:<>
                          <div
                              className="blog-comment-component-item-img mr-2"
                              style={{
                                backgroundImage: `url("${val.user.picture||'/images/no-picture.png'}")`,
                              }}
                            ></div>
                            <div>
                              <p className="m-0">
                                {t('comments')} {val.index}
                              </p>
                              <p className="m-0">{`${val.user.firstname}  ${val.user.lastname}`}</p>
                            </div>
                          </>}
                            

                          </div>
                        </div>
                        <div className="col-6 text-right">
                          <p className="m-0 blog-comment-component-item-txt-g">
                            {tools.formatDate(val.createdAt, true, true, true)}
                          </p>
                        </div>
                      </div>
                      <div className="row pl-3 pr-3">
                        <div className="col-12">
                          <p
                            className={`m-0 blog-comment-component-item-txt-g ${
                              chedit(val) && chedit(val).length != 0
                                ? "d-none"
                                : "d-block"
                            }`}
                          >
                            {val.comment}
                            {user != undefined &&
                            user.id == val.user.id ? (
                              <>
                                <img
                                  className="blog-comment-btn-edit ml-2"
                                  onClick={() => {
                                    onClickChekEdit(val);
                                  }}
                                  src="/icon/blog-be-icon-edit.svg"
                                />
                              </>
                            ) : null}
                          </p>

                          <form
                            id={`form-comment-edit-${val.id}`}
                            className={
                              chedit(val) && chedit(val).length != 0
                                ? "d-block"
                                : "d-none"
                            }
                            onSubmit={(e) =>
                              postComment(e, "edit", val.id)
                            }
                            encType="multipart/form-data"
                            ref={formEl}
                          >
                            <DebounceInput 
                              element="textarea"
                              debounceTimeout={500}
                              style={{
                                border: "2px #eeeeee solid",
                                borderRadius: "8px",
                              }}
                              onChange={(e)=>{
                                let tmp = {...data}
                                tmp.rows[index].comment = e.target.value
                                setdata(tmp)
                              }}
                              placeholder="เขียนความคิดเห็น..."
                              id={`commentEdit${val.id}`}
                              name={`commentEdit${val.id}`}
                              value={val.comment}
                              required
                            />
                            <div className="d-flex justify-content-end align-items-center">
                            <div>
                              <div className="blog-comment-emoji-btn mr-2" onClick={()=>chEmoEditFu(val.id)}>
                                <i class="far fa-smile" style={{fontSize:'20px'}}></i>
                              </div>
                              <div className={`blog-comment-emoji-card ${chEmoEditFuShow(val.id) ? 'd-flex':'d-none'}`}>
                                {emojiItem&&emojiItem.map((vall)=>
                                  <div key={Math.random()} className="blog-comment-emoji-item" onClick={()=>{let tmp = {...data}
                                  tmp.rows[index].comment += vall.character;
                                  setdata(tmp)}}>{vall.character}</div>
                                )}
                              </div>
                            </div>
                              <button
                                className="blog-detail-story-detail-card-btn-b mr-3"
                               type="button"
                                onClick={() => {
                                  onClickChekEdit(val);
                                }}
                              >
                                {t('cancel')}
                              </button>
                              <button
                                className="blog-detail-story-detail-card-btn-n"
                                type="submit"
                              >
                                {t('submit')}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="row mt-4 pl-3 pr-3 pb-3 ">
                        <div className="col-6">
                          <div
                            className="blog-reply-btn"
                            onClick={() => {
                              onClickChek(val);
                            }}
                          >
                            <img
                              className="mr-2"
                              src="/icon/blog-icon-reply.svg"
                            />

                            <span>
                              {val.comments.length != 0
                                ? `${val.comments.length} ${t('reply_s')}`
                                : t('reply')}
                            </span>
                          </div>
                        </div>
                        <div className="col-6 text-right">
                          <div className="d-flex justify-content-end">
                            {user && user.id != val.user.id &&    
                              <div
                                className="mr-2 blog-head-detail-card-icon-h-prop"
                                onClick={()=>{
                                  if (user != undefined) {
                                  handleShow();setcommentId(val.id)
                                  }else{
                                    setShowLogin(true)
                                  }
                                }}
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
                                  {t('report_problem')}
                                </p>
                              </div>
                            }
                            {!user &&
                             <div
                             className="mr-2 blog-head-detail-card-icon-h-prop"
                             onClick={()=>{
                               if (user != undefined) {
                               handleShow();setcommentId(val.id)
                               }else{
                                 setShowLogin(true)
                               }
                             }}
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
                               {t('report_problem')}
                             </p>
                           </div>
                              }
                          </div>
                        </div>
                      </div>
                    </div>
                  
                  
                    <div className="row blog-comment-component-item-repry mt-2">
                      <div className="col-1 d-flex align-items-start justify-content-end mt-3">
                        <img src="/icon/icon_reply.svg"/>
                      </div>
                      <div className="col-11">
                        {val.comments.length > 0 &&
                          val.comments.map((vall,index2) => (
                            <div
                              key={Math.random()}
                              className="blog-comment-component-item"
                            >
                              <div className="row mt-3 pb-3 pl-3 pr-3">
                                <div className="col-6">
                                  <div className="d-flex align-items-center">

                                  {vall.user.id == blog.blog_group.blog_writer.member_id ?<>
                                   
                                    <div
                                      className="blog-comment-component-item-img mr-2"
                                      style={{
                                        backgroundImage: `url("${profile(blog.blog_group)}")`,
                                      }}
                                    ></div>
                                    <div>
                                      <p className="m-0">
                                        {t('reply_comment')} {val.index}
                                      </p>
                                      <p className="m-0">{`${blog.blog_group.blog_writer.penname1}`}</p>
                                    </div>
                                  </>:<>
                                    <div
                                      className="blog-comment-component-item-img mr-2"
                                      style={{
                                        backgroundImage: `url("${vall.user.picture||'/images/no-picture.png'}")`,
                                      }}
                                    ></div>
                                    <div>
                                      <p className="m-0">
                                        {t('reply_comment')} {val.index}
                                      </p>
                                      <p className="m-0">{`${vall.user.firstname}  ${vall.user.lastname}`}</p>
                                    </div>
                                  </>}
                                    



                                  </div>
                                </div>
                                <div className="col-6 text-right">
                                  <p className="m-0 blog-comment-component-item-txt-g">
                                    {tools.formatDate(vall.createdAt, true, true, true)}
                                  </p>
                                </div>
                              </div>
                              <div className="row pl-3 pr-3">
                                <div className="col-12">
                                  <p
                                    className={`m-0 blog-comment-component-item-txt-g ${
                                      chedit(vall) && chedit(vall).length != 0
                                        ? "d-none"
                                        : "d-block"
                                    }`}
                                  >
                                    {vall.comment}
                                    {user != undefined &&
                                    user.id == vall.user.id ? (
                                      <>
                                        <img
                                          className="blog-comment-btn-edit ml-2"
                                          onClick={() => {
                                            onClickChekEdit(vall);
                                          }}
                                          src="/icon/blog-be-icon-edit.svg"
                                        />
                                      </>
                                    ) : null}
                                  </p>

                                  <form
                                   id={`form-comment-edit-reply-${val.id}`}
                                   name={`form-comment-edit-reply-${val.id}`}
                                    className={
                                      chedit(vall) && chedit(vall).length != 0
                                        ? "d-block"
                                        : "d-none"
                                    }
                                    onSubmit={(e) =>
                                      postComment(e, "edit", vall.id)
                                    }
                                    encType="multipart/form-data"
                                    ref={formEl}
                                  >
                                    <DebounceInput 
                                      element="textarea"
                                      debounceTimeout={500}
                                      style={{
                                        border: "2px #eeeeee solid",
                                        borderRadius: "8px",
                                      }}
                                      placeholder="เขียนความคิดเห็น..."
                                      id={`commentEditReply${vall.id}`}
                                      name={`commentEditReply${vall.id}`}
                                      onChange={(e)=>{
                                        let tmp = {...data}
                                        tmp.rows[index].comments[index2].comment = e.target.value
                                        setdata(tmp)
                                      }}
                                      value={vall.comment}
                                      required
                                    />
                                    <div className="d-flex justify-content-end align-items-center">
                                      <div>
                                        <div className="blog-comment-emoji-btn mr-2" onClick={()=>chEmoEditReplyFu(vall.id)}>
                                          <i class="far fa-smile" style={{fontSize:'20px'}}></i>
                                        </div>
                                        <div className={`blog-comment-emoji-card ${chEmoEditReplyFuShow(vall.id) ? 'd-flex':'d-none'}`}>
                                          {emojiItem&&emojiItem.map((vall2)=>
                                            <div key={Math.random()} className="blog-comment-emoji-item" onClick={()=>{
                                              let tmp = {...data}
                                              tmp.rows[index].comments[index2].comment += vall2.character;
                                              setdata(tmp)
                                            }}>{vall2.character}</div>
                                          )}
                                        </div>
                                      </div>
                                      <button
                                        className="blog-detail-story-detail-card-btn-b mr-3"
                                        type="button"
                                        onClick={() => {
                                          onClickChekEdit(vall);
                                        }}
                                      >
                                        {t('cancel')}
                                      </button>
                                      <button
                                        className="blog-detail-story-detail-card-btn-n"
                                        type="submit"
                                      >
                                        {t('submit')}
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                              <div className="row mt-2 pl-3 pr-3 pb-3 ">
                                <div className="col-6"></div>
                                <div className="col-6 text-right">
                                  <div className="d-flex justify-content-end">
                                  {user && user.id != vall.user.id &&  
                                    <div
                                      className="mr-2 blog-head-detail-card-icon-h-prop"
                                      onClick={()=>{
                                        if (user != undefined) {
                                          handleShow();setcommentId(vall.id)
                                          }else{
                                            setShowLogin(true)
                                          }
                                        }}
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
                                      {t('report_problem')}
                                      </p>
                                    </div>
                                  }
                                  {!user && 
                                      <div
                                      className="mr-2 blog-head-detail-card-icon-h-prop"
                                      onClick={()=>{
                                        if (user != undefined) {
                                          handleShow();setcommentId(vall.id)
                                          }else{
                                            setShowLogin(true)
                                          }
                                        }}
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
                                      {t('report_problem')}
                                      </p>
                                    </div>
                                  }
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        <form
                          id={`form-comment-reply-${val.id}`}
                          onSubmit={(e) => postComment(e, "reply", val.id)}
                          encType="multipart/form-data"
                          ref={formEl1}
                        >
                          <textarea
                            name={`commentReply${val.id}`}
                            id={`commentReply${val.id}`}
                            required
                            placeholder={t('write_comment')+" ..."}
                            rows={1}
                          />
                          <div className="d-flex justify-content-end align-items-center">
                            <div>
                              <div className="blog-comment-emoji-btn mr-2" onClick={()=>chEmoReplyFu(val.id)}>
                                <i class="far fa-smile" style={{fontSize:'20px'}}></i>
                              </div>
                              <div className={`blog-comment-emoji-card ${chEmoReplyFuShow(val.id) ? 'd-flex':'d-none'}`}>
                                {emojiItem&&emojiItem.map((vall2)=>
                                  <div key={Math.random()} className="blog-comment-emoji-item" onClick={()=>{document.getElementById(`commentReply${val.id}`).value += vall2.character;}}>{vall2.character}</div>
                                )}
                              </div>
                            </div>
                            {/* <button
                              className="blog-detail-story-detail-card-btn-n mb-3"
                              type="submit"
                            >
                              {t('send_comment')}
                            </button> */}
                            <ButtonLoad
                              _type="submit"
                              loading={loading}
                              _class="blog-detail-story-detail-card-btn-n blog-w-200px mb-3"
                              _name={t('send_comment')}
                              // disabled={!unSave}
                            
                            />
                          </div>
                        </form>
                      </div>
                    </div>
              
                  </div>
                </div>
              )
          )}
          {limit < all ? (
            <div className="row">
              <div className="col-12 text-center">
                <button
                  className="blog-detail-story-detail-card-btn-b mt-3"
                  type="button"
                  onClick={() => {{
                    fetchComment(limit + 2);
                    limit += 2;
                  };setaddNew(0)}}
                >
                  {t('more_comments')}
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      )}
      <Modal
        className="modal-cart"
        centered
        show={showLogin}
        onHide={handleCloseLogin}
        size="xl"
      >
        <Modal.Header closeButton>
          <div>
            <Modal.Title className="d-flex">ลงชื่อเข้าใช้งานระบบ</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <LoginLayout loginBy="modal" closeModal={handleCloseLogin} isModal={true} />
        </Modal.Body>
      </Modal>
      <ConfirmDialog show={modalShow} 
      text="กรุณาใช้คำสุภาพ" 
      onConfirm={onConfirm}
      size="md" onHide={handleModalClose}
      cancel_btn={false}/>
    </div>
  );
}
