import React, { useState ,useEffect } from "react";
import parse from "html-react-parser";
import SlideData from "../slideData";
// import LoginLayout from "../../layout/login_layout";
import { Modal } from "react-bootstrap";
import { Link, Router } from "../../../../utils/i18n";
import ProblemModal from "../modal/problemModal";

export default function StoryDetaildata({
  data,
  bData,
  blog_id,
  isPreview,
  data_id,
  like,
  onAction,
  user,
  viewe,
  path,
  t
}) {
  const [backBolg, setBackBolg] = useState();
  const [nextBolg, setNextBolg] = useState();
  const [classbtnlike, setclassbtnlike] = useState(
    "blog-detail-story-detail-card-btn"
  );
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => {
    setShowLogin(false);
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
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
    document.getElementById("story-detail").addEventListener("contextmenu", function(){
      console.log("Right Click");
      return false;
   });
    
 
  }, [bData,data]);
  // console.log('user', user)
  return (
    <div>
      <ProblemModal handleClose={handleClose} show={show} user={user} blog={data} group_id={blog_id} data_id={data_id} type={1} />
      <div className="blog-detail-story-detail-card-head pb-3">
        <h4 className="mt-3 mb-0">
          {t('episode')} {data.index} : {data.title}
        </h4>
      </div>
      <div className="bg-white">
        <div className="pl-xl-5 pr-xl-5 pt-2 pb-2">
          <div className="container text-right">
            <button type="button" className="blog-detail-story-detail-card-btn  mr-2" onClick={shortFont} ><i className="fas fa-search-minus"></i></button>
            <button type="button" className="blog-detail-story-detail-card-btn" onClick={expandFont} ><i className="fas fa-search-plus"></i></button>
          </div>
        </div>
      </div>
      <div className="blog-detail-story-detail-card-body" id="story-detail" onContextMenu={(e) => {e.preventDefault()}} >
        <div className="pl-xl-5 pr-xl-5 pt-4 pb-4">
          <div className="container">
            <div className="blog-detail-story-detail-card-body-l">
              <div className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred no-select">
                {parse(String(data.content))}
              </div>
            </div>
          </div>
          {!isPreview && (<>
           <hr />
              <div className="blog-detail-story-detail-icon">
              <div className="container px-1">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                      {backBolg?
                          <Link href={`/blog/[blogid]/[data_id]?blogid=${blog_id}&data_id=${backBolg}`} as={`/blog/${blog_id}/${backBolg}`}><a>
                          <button type="button" className="blog-detail-story-detail-card-btn ml-xl-4 border-0 align-items-center d-flex"  ><span><i className="fas fa-angle-left"></i></span></button> 
                          </a></Link>
                        :null}
                    </div>
                    <div className="d-flex align-items-center">
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
                              src="/mobile/icon/blog/icon-blog-like.svg"
                            />
                            <img
                              className="mr-2 blog-icon-like-y"
                              src="/mobile/icon/blog/icon-blog-like-y.svg"
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
                              Router.push(`/login?redirect=/blog/${blog_id}/${data_id}`)
                            }}
                          >
                            <img
                              className="mr-2 blog-icon-like"
                              src="/mobile/icon/blog/icon-blog-like.svg"
                            />
                            <img
                              className="mr-2 blog-icon-like-y"
                              src="/mobile/icon/blog/icon-blog-like-y.svg"
                            />
                            {like && like.data ? formatNum(like.data.liked) : 0} {t('like')}
                          </button>
                        )}
                      <img className="ml-3 pr-2" src="/mobile/icon/blog/blog-icon-eye-b.svg"/><span>{t('view')} : {formatNum(viewe)}</span> 
                      <img onClick={()=>{
                                if (user != undefined) {
                                  setShow(true)
                                }else{
                                  Router.push(`/login?redirect=/blog/${blog_id}/${data_id}`)
                                }
                              }}
                                className="mx-2 blog-head-detail-card-icon-h-alert"
                                src="/mobile/icon/blog/blog-icon-alert.svg"
                              />
                    </div>
                    <div>
                      {
                        nextBolg ?  <Link href={`/blog/[blogid]/[data_id]?blogid=${blog_id}&data_id=${nextBolg}`} as={`/blog/${blog_id}/${nextBolg}`}><a>
                        <button type="button" className="blog-detail-story-detail-card-btn pl-1 border-0 d-flex"  ><span><i className="fas fa-angle-right"></i></span></button>
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
      </div>
      <Modal
        className="modal-cart"
        centered
        show={showLogin}
        onHide={handleCloseLogin}
        size="xl"
      >
        <Modal.Header closeButton>
          <div>
            <Modal.Title className="d-flex"></Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <LoginLayout loginBy="modal" closeModal={handleCloseLogin} isModal={true}  />
        </Modal.Body>
      </Modal>*/}
    </div>
  );
}
