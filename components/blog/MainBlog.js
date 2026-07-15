import React, { useState, useEffect, useContext } from "react";

import Layout from "../../components/layout";
import {Button, Modal} from 'react-bootstrap';
import { withTranslation, Link, Router } from "../../utils/i18n";
import Popular from "../../components/blog/popular";
import WriterShow from "../../components/blog/writerShow";
import BlogCate from "../../components/blog/blogCate";
import UserContext from "../../contexts/UserContext";
import api from "../../utils/api";
import Banner from '../../components/banner';
import CardPH from "../../components/shimmer/Card";
import { useRouter } from "next/router";

const MainBlog = (props) => {
  const { t ,blogNew , blogLike ,writer,rec,banner} = props;
  const router = useRouter()
  const status = router.query.s
  const { user ,local } = useContext(UserContext);
  const [textblog, settextblog] = useState("")
  const [show, setshow] = useState(false)
  
  useEffect(() => {
    if (user && user.blog_writer&& user.blog_writer.status && user.blog_writer.status == 2) {
      setshow(true)
    }
  }, [user]);

  return (
    <>
      <div className="container">
        <div className="row">
          <Banner data={banner.banner_images} type={banner.type} />
        </div>
        <BlogCate t={t} />
        <div className="row d-flex justify-content-center mt-5 pt-3 pb-5">
          <div className="col-9 col-lg-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control placeholder border-right-none blog-form"
                // onKeyPress={handleKeyPress}
                value={textblog}
                onChange={(e) => settextblog(e.target.value)}
                placeholder={t('input_search')}

                onKeyUp={(e) => {
                  if (e.keyCode === 13 && e.target.value) {
                    Router.push({ pathname : '/blog/filter' ,query : {blog:e.target.value}})
                  }
                } }

              />
              <button
                className="btn btn-outline-primary br-left-none blog-from-btn"
                onClick={() => {
                Router.push(`/blog/filter?blog=${textblog}`)
                }}
                type="button"
              >
                {t('search')}
              </button>
            </div>
          </div>
       </div> <hr />
       {
         rec && rec.length != 0 && rec.map((val,index)=>
         <div key={index}>
          <Popular title={val['name_'+local]||val.name_th} p={val.key} data={val.blog_recommends} t={t}/>
          </div>
         )
       }
        
        {/* <hr />*/}
        <Popular title={t('blog_popula')} p="blog_pop" data={blogLike} t={t}/>
        {/* <hr /> */}
        <Popular title={t('blog_new')} p="blog_new" data={blogNew} t={t}/> 
      </div>
      <WriterShow data={writer} t={t} />
      <Modal className="modal-alert" centered show={show} onHide={()=>setshow(false)} size={'md'}>
        <Modal.Body>
          <form>
            <div className="row mt-4 justify-content-center">
              <div className="col-12">
                <div className="text-center">
                  <img src="/mobile/icon/Attention.svg" />
                </div>
              </div>
              <div className="col-12 my-4">
                <div className="text-center">
                  <h3>{t('unwriter_1')}</h3>
                  <h3 className="text-pink">{t('unwriter_2')}</h3>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>  
    </>
  )
}

export default MainBlog