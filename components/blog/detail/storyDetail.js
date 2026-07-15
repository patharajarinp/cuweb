import React, { useState ,useEffect} from "react";
import parse from "html-react-parser";
import SlideData from "../slideData";
import LoginLayout from "../../layout/login_layout";
import { Modal } from "react-bootstrap";
import {
  FacebookShareButton,
  LineShareButton,
  TwitterShareButton,
} from "react-share";
import ProblemModal from "../modal/problemModal";
import { Link } from "../../../utils/i18n";
import Blogid from "../../../pages/blog/[blogid]";
import api from "../../../utils/api";
export default function StoryDetail({
  data,
  bData,
  blog_id,
  isPreview,
  data_id,
  like,
  onAction,
  user,
  viewe,
  path,t
}) {
  const [backBolg, setBackBolg] = useState();
  const [nextBolg, setNextBolg] = useState();
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => {
    setShowLogin(false);
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
  const expandFont = ()=>{
    const content = document.querySelector(".ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline.ck-blurred");
    let arH = [
      {name:'P',value:16},
      {name:'H1',value:40},
      {name:'H2',value:30},
      {name:'H3',value:24},
      {name:'H4',value:18},
      {name:'H5',value:16},
    ]
    for (let index1 = 0; index1 < arH.length; index1++) {
      for (let index = 0; index <  content.getElementsByTagName(arH[index1].name).length; index++) {
        var ps = content.getElementsByTagName(arH[index1].name)[index].getElementsByTagName("SPAN");
        if (ps.length) {
          for (let indexPS = 0; indexPS < ps.length; indexPS++) {
            // console.log('ps', ps[indexPS].style.fontSize)

            content.getElementsByTagName(arH[index1].name)[index].getElementsByTagName("SPAN")[indexPS].style.fontSize  = ps[indexPS].style.fontSize  ? ( ps[indexPS].style.fontSize !== "100px" ? (Number(ps[indexPS].style.fontSize.slice(0, ps[indexPS].style.fontSize.length - 2)) + 2)+"px": ps[indexPS].style.fontSize): (arH[index1].value + 2)+"px";
          }
        }
          var pp = content.getElementsByTagName(arH[index1].name)[index].style.fontSize
          content.getElementsByTagName(arH[index1].name)[index].style.fontSize = pp ? (pp!=='100px'? (Number(pp.slice(0, pp.length - 2)) + 2)+"px":pp) : (arH[index1].value + 2)+"px";
        
        
      } 
    }
  }
  const shortFont = ()=>{
    const content = document.querySelector(".ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline.ck-blurred");
    let arH = [
      {name:'P',value:16},
      {name:'H1',value:40},
      {name:'H2',value:30},
      {name:'H3',value:24},
      {name:'H4',value:18},
      {name:'H5',value:16},
    ]
    for (let index1 = 0; index1 < arH.length; index1++) {
      for (let index = 0; index <  content.getElementsByTagName(arH[index1].name).length; index++) {
        var ps = content.getElementsByTagName(arH[index1].name)[index].getElementsByTagName("SPAN");
     
        if (ps.length) {
          for (let indexPS = 0; indexPS < ps.length; indexPS++) {
            // console.log('ps', ps[indexPS].style.fontSize)
            content.getElementsByTagName(arH[index1].name)[index].getElementsByTagName("SPAN")[indexPS].style.fontSize  = ps[indexPS].style.fontSize ? (ps[indexPS].style.fontSize !=='2px'? (Number(ps[indexPS].style.fontSize.slice(0, ps[indexPS].style.fontSize.length - 2)) - 2)+"px":ps[indexPS].style.fontSize ): (arH[index1].value - 2)+"px";
          }
        }
          var pp = content.getElementsByTagName(arH[index1].name)[index].style.fontSize
        content.getElementsByTagName(arH[index1].name)[index].style.fontSize = pp ? (pp !== '2px'? (Number(pp.slice(0, pp.length - 2)) - 2)+"px" :pp): (arH[index1].value - 2)+"px";
       
        
      } 
    }
  }
  useEffect(() => {
    if(!bData&&!data) return 

    let tmp = data.index;
    let b ,n;
    console.log('tmp', tmp,data.length)

    if (tmp != 1) {
        b = bData.filter(val=>val.index == tmp-1)
        if (b&& b.length) {
          setBackBolg(b[0].id)
        }
    }else{
      setBackBolg(null)
    }

    if (bData && tmp != bData.length) {
       n = bData.filter(val=>val.index == tmp+1)
       
      if (n&& n.length) {
      setNextBolg(n[0].id)
      }
    }else{
      setNextBolg(null)
    }
   
    
 
  }, [bData,data]);
  return (
    <div>
       < ProblemModal handleClose={handleClose} show={show} user={user} blog={data} group_id={blog_id} data_id={data_id} type={1} />
      <div className="blog-detail-story-detail-card-head pb-3">
        <h4 className="mt-3 mb-0">
          {t('episode')} {data.index} : {data.title}
        </h4>
      </div>
      {!isPreview ? 
      <div className="bg-white">
        <div className="pl-xl-5 pr-xl-5 pt-2 pb-2">
          <div className="container text-right">
            <button type="button" className="blog-detail-story-detail-card-btn  mr-2" onClick={shortFont} ><i className="fas fa-search-minus"></i></button>
            <button type="button" className="blog-detail-story-detail-card-btn" onClick={expandFont} ><i className="fas fa-search-plus"></i></button>
          </div>
        </div>
      </div>
      :null}
      <div className="blog-detail-story-detail-card-body">
        <div className="pl-xl-5 pr-xl-5 pt-4 pb-4">
          <div className="container">
            <div className="blog-detail-story-detail-card-body-l">
              <div className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred no-select"  onContextMenu={(e) => {e.preventDefault()}} >
                {parse(String(data.content))}
              </div>
            </div>
          </div>
          {!isPreview && (<>
           <hr />
              <div className="blog-detail-story-detail-icon">
                <div className="container">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="pl-xl-5 ">
                      {backBolg?
                        <Link href={`/blog/[blogid]/[data_id]?blogid=${blog_id}&data_id=${backBolg}`} as={`/blog/${blog_id}/${backBolg}`}><a>
                        <button type="button" className="blog-detail-story-detail-card-btn ml-xl-4 border-0 align-items-center d-flex"  ><span className="font-20 mr-2"><i className="fas fa-angle-left"></i></span>ตอนก่อนหน้า</button> 
                        </a></Link>
                      :null}
                    </div>
                    <div className="d-flex">
                        {user != undefined ? (
                        <button
                          className={`blog-detail-story-detail-card-btn${
                            like && like.checkMember ? " active" : ""
                          }`}
                          type="button"
                          onClick={() => {
                            onAction();
                          }}
                        >
                          <img
                            className="mr-2 blog-icon-like"
                            src="/icon/icon-blog-like.svg"
                          />
                          <img
                            className="mr-2 blog-icon-like-y"
                            src="/icon/icon-blog-like-y.svg"
                          />
                          {like && like.data ? formatNum(like.data.liked) : 0} {t('like')}
                        </button>
                      ) : (
                        <button
                          className={`blog-detail-story-detail-card-btn${
                            like && like.checkMember ? " active" : ""
                          }`}
                          type="button"
                          onClick={() => {
                            setShowLogin(true);
                          }}
                        >
                          <img
                            className="mr-2 blog-icon-like"
                            src="/icon/icon-blog-like.svg"
                          />
                          <img
                            className="mr-2 blog-icon-like-y"
                            src="/icon/icon-blog-like-y.svg"
                          />
                          {like && like.data ? formatNum(like.data.liked) : 0} {t('like')}
                        </button>
                      )}
                    <img className="ml-3 pr-2" src="/icon/blog-icon-eye-b.svg"/><span>{t('view')} : {formatNum(viewe)}</span> 
                    
                    <p className="m-0 ml-3 mr-2">{t('share')} :</p> 
                      <div className="mr-2">
                              <FacebookShareButton url={api.frontend_url+path}>
                                  <img src="/icon/d-facebook.svg" />
                                </FacebookShareButton>
                      </div><div className="mr-2">
                                <TwitterShareButton url={api.frontend_url+path}>
                                  <img src="/icon/d-twitter.svg" />
                                </TwitterShareButton>
                      </div><div className="mr-2">
                                <LineShareButton url={api.frontend_url+path}>
                                  <img src="/icon/d-line.svg"/>
                                </LineShareButton></div>
                        <div
                            className="ml-2 mr-2 blog-head-detail-card-icon-h-prop"
                            onClick={()=>{
                              if (user != undefined) {
                              handleShow();
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
                            
                          </div>
                          
                      
                    </div>
                    <div className="pr-xl-5 ">
                      {
                        nextBolg ?  <Link href={`/blog/[blogid]/[data_id]?blogid=${blog_id}&data_id=${nextBolg}`} as={`/blog/${blog_id}/${nextBolg}`}><a>
                        <button type="button" className="blog-detail-story-detail-card-btn mr-xl-4 border-0 d-flex"  >ตอนถัดไป<span className="font-20 ml-2"><i className="fas fa-angle-right"></i></span></button>
                                  </a></Link>

                        :null
                      }
                    </div>
                  </div>
                </div>
              </div>
         </> )}

          {!isPreview && bData && bData.length > 1 && (
            <>
              <hr />
              <SlideData data={bData} blog_id={blog_id} data_id={data_id} t={t} />
            </>
          )}
        </div>
      </div>
      {/* <div className="row mt-3 pb-4">
        <div className="col-6">
          
        </div>
         <div className="col-6 text-right item-content">
          <button className="blog-detail-story-detail-card-btn-b" type="button">
            {"<"} กลับหน้าแรก
          </button>
          <button className="blog-detail-story-detail-card-btn-n" type="button">
            ตอนถัดไป {">"}
          </button>
        </div> 
      </div>*/}
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
          <LoginLayout loginBy="modal" closeModal={handleCloseLogin} isModal={true}  />
        </Modal.Body>
      </Modal>
    </div>
  );
}
