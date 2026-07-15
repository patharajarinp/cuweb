import React, { useEffect, useState } from "react";
import { Link, Router } from "../../../utils/i18n";
import Banner from '../../../components/mobile/carousel';
import Navbar from '../../../components/mobile/layout/Navbar';
import CardShowIndex from "./cardShowIndex";
import api from "../../../utils/api";
import WriterShow from "./writerShow";

const MobileMainBlog = (props) => {
  const { t ,blogNew , blogLike ,writer,rec,banner} = props;
  const [cate, setCate] = useState();
  const [blogHot, setblogHot] = useState([]);
  const [textblog, settextblog] = useState("")
  const [img, setImg] = useState();

 
  const fetchCate = () => {
    api.getBlogCategory()
    .then((res) => {
      const data = res.data;
      setCate(data);
      // console.log(data);
    })
    .catch((err) => {
      console.log(err.response);
    });
  };
  const fetchPage = () => {
    var page = 'blog';
    var vendor = 'cu';
    api.getBanner(page, vendor).then(res => {
        const data = res.data;
        var items = [];
        data.banner_images.forEach((item) => {
            if (item.index != 5)
                return true;
            let temp = {
                src: item.image,
                key: 'banner' + Math.random(),
                href:item.link
            }

            items.push(temp)
        });
        setImg(items)
    })
    .catch(err => {
        console.log(err.response);
    })
}

  useEffect(() => {
    fetchCate();
    fetchPage()
  }, []);

  const handleOpenAiChat = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-mobile-ai-chat'));
    }
  };

  return (
    <>
      <Navbar />
      <div className="padding-top-for-box"></div>
      {img && <Banner items={img} />}
      <div className="bg-light-less-gray pt-3">
        <div className="container bg-white ">
          <h4 className="text-black text-center py-3">{t('cate')}</h4>
          <div className="row  flex-nowrap area-slide pb-3">
            {cate
              ? cate.map((val, index) => (
                  <div className="cate col-slide" key={index}>
                    <Link
                      href={`/blog/filter?cate=${val.id}&blog=`}
                    >
                      <a className="text-default">
                        <div className="btn-cate">
                          <img
                            src={
                              val.image
                                ? val.image
                                : "/mobile/icon/blog/blog-icon-cate.svg"
                            }
                          />
                        </div>
                        <div className="text">{val.name_th}</div>
                      </a>
                    </Link>
                  </div>
                ))
              : ""}
          </div>
        </div>
        <div style={{backgroundColor:'#FBF4E1'}}>
        <div className="container py-3">
          <div className="w-100">
            <div>
                <div className="d-flex align-items-center">
                  <div className={"box-search blog-input w-100"}>
                    <div className="icon-search">
                    <img src={'/mobile/image/icon/icon-search.svg'} />
                    </div>
                    <input type="text"
                      value={textblog}
                      placeholder={t('input_search')}
                      onChange={(e) => settextblog(e.target.value)}
                      onKeyDown={(e)=>{
                      if (e.keyCode === 13) {
                        Router.push(`/blog/filter?blog=${textblog}`)
                      }
                    }}
                    className="autocomplete-input"  />
                  </div>
                  <button
                    type="button"
                    className="ml-2 d-flex align-items-center justify-content-center"
                    onClick={handleOpenAiChat}
                    style={{ width: 34, height: 34, border: '1px solid #bdbdbd', borderRadius: 8, background: '#fff' }}
                  >
                    <span style={{fontSize: 12, fontWeight: 'bold'}}>AI</span>
                  </button>
                </div>
            </div>
          </div>
        </div>
        </div>
        {
        rec && !!rec.length && rec.map((val,index)=>
        <div key={index}>
        <CardShowIndex title={val.name_th} p={val.key} data={val.blog_recommends} t={t} />
        </div>
        )
      }
          <CardShowIndex title={t('blog_popula')} p="blog-pop" data={blogLike} t={t} />

        {/* <CardShowIndex title="บทความใหม่มาแรง" data={blogHot} />*/}

        <CardShowIndex title={t('blog_new')} p="blog-new" data={blogNew} t={t} /> 

        <WriterShow data={writer} t={t} />

        <div className="h-64px"></div>
      </div>
    </>
  )
}

export default MobileMainBlog