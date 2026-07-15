import React, { useEffect, useState, useContext, useRef } from "react";
import Layout from "../../../components/backend_blog/layout/Layout";
import Sidenav from "../../../components/backend_blog/layout/Sidenav";
import ManageImage from "../../../components/backend_blog/ManageImage";
import Profile from "../../../components/backend_blog/Profile";
import UserContext from "../../../contexts/UserContext";
import ButtonLoad from "../../../components/backend_blog/widget/ButtonLoad";
import Router, { useRouter } from "next/router";
import api from "../../../utils/api";
export default function profile() {
  const { user } = useContext(UserContext);
  const [show, setShow] = useState(false)
  const [bannerDesk, setBannerdesk] = useState([]);
  const [bannerM, setBannerM] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unSave, setUnSave] = useState(false);
  const [writerBanners, setwriterBanners] = useState([]);
  const [imgprofile, setimgprofile] = useState()
  const formEl = useRef(null);
  const updateBanner = async (data,type) => {
    api
      .updateWriterBanner(data)
      .then(async (res) => {
          setLoading(false)
          alert("Update success")
          if (type == "preview")window.open(`/blog/writer/${user.blog_writer.id}?preview=1`);
          
          fetchImage()
      })
      .catch((err) => {
        setLoading(false)
        console.log(err.response);
      });
  };
  const fetchImage = async () => {
    api
      .getBannerwriter(user.blog_writer.id)
      .then(async (res) => {

       const data = res.data
        setwriterBanners(data);
        const bd = data
          .filter((val) => val.mimetype == "desktop")
          .map((val) => {
            return { id: val.id, img: val.picture };
          });
        const bm = data
          .filter((val) => val.mimetype == "mobile")
          .map((val) => {
            return { id: val.id, img: val.picture };
          });
        if (bd.length) setBannerdesk(bd);
        if (bm.length) setBannerM(bm);
        const bp = data
        .filter((val) => val.mimetype == "profile")
        .map((val) => {
          return { id: val.id, img: val.picture };
        });
      if (bp.length) setimgprofile(bp[0]);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#EEEEEE";
    }
  }, []);
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (unSave && !window.confirm("You really want to leave?")) {
        Router.events.emit("routeChangeError");
        // Router.replace(Router, Router.asPath, { swallow: true });
        throw "Abort route change. Please ignore this error.";
      }
      //return true;
    };

    window.onbeforeunload = unSave && (() => unSave);

    Router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      window.onbeforeunload = null;
      Router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [unSave]);

  useEffect(() => {
    if (user) {
      if (user.blog_writer) fetchImage();
    }
    // console.log('user', user)
    // fetchBlog();
  }, [user]);
  //   console.log('user', user)
  const onSubmit = async (event, type) => {
    event.preventDefault();

    var data = new FormData(formEl.current);
    data.append("writer_id", user.blog_writer.id);
    if (type == "publish") data.append("save_publish", 1);
    let edited = [];
    let dsk_ord = [],
      mb_ord = [];

    // var orders ={desktop:[],mobile:[]}
    bannerDesk.forEach((val, index) => {
      let add_index = 0;
      if (val.edited) {
        dsk_ord.push({ id: val.id, order: index + 1 });
        const name = "edited-dsk-" + val.id;
        let obj = { id: val.id, name, link: val.link, type: "desktop" };
        edited.push(obj);
        data.append(name, val.file);
        // data.append('link_desktop',val.link)
      } else if (val.file) {
        dsk_ord.push({ order: index + 1, index: add_index });
        add_index += 1;
        data.append("banner_desktop", val.file);
        data.append("link_desktop", val.link);
      } else {
        dsk_ord.push({ id: val.id, order: index + 1 });
      }
    });
    bannerM.forEach((val, index) => {
      let add_index = 0;

      if (val.edited) {
        mb_ord.push({ id: val.id, order: index + 1 });
        const name = "edited-mb-" + val.id;
        let obj = { id: val.id, name, link: val.link, type: "mobile" };
        edited.push(obj);
        if (val.file) data.append(name, val.file);
        // data.append('link_desktop',val.link)
      } else if (val.file) {
        mb_ord.push({ order: index + 1, index: add_index });
        add_index += 1;
        data.append("banner_mobile", val.file);
        data.append("link_mobile", val.link);
      } else {
        mb_ord.push({ id: val.id, order: index + 1 });
      }
    });

      data.append("picture", imgprofile.files);

    
    data.append('edited_banner',JSON.stringify(edited))
    deleted.forEach(val=>{
        if(val.id) data.append('deleted_banner',val.id)
      })
  
    setUnSave(false)
    setLoading(true)
    await updateBanner(data,type);
  };
  return (
    <div>
      <Layout title="Writer profile" page_name="dashboard" isHome={true}>
        <Sidenav page="product">
          <form
            onSubmit={onSubmit}
            onKeyDown={(event) => {
              if (event.keyCode == 13) {
                event.preventDefault();
                return false;
              }
            }}
            encType="multipart/form-data"
            ref={formEl}
          >
            <div className="blog-backend-blog-manage-card w-100 mb-4">
              <div key={Math.random()}>
          
                <Profile img={imgprofile } onAction={(val)=>setUnSave(val)} setImg={((val,file)=>{setimgprofile({id:1,img:val,files:file})})} show={show} setShow={setShow} />
                {/* imgprofile.length?imgprofile[0].img:null */}
                </div>
            </div>
            <div className="blog-backend-blog-manage-card w-100">
              <ManageImage
                bannerDesk={bannerDesk}
                setBannerdesk={setBannerdesk}
                bannerM={bannerM}
                setBannerM={setBannerM}
                deleted={deleted}
                setDeleted={setDeleted}
                onAction={setUnSave}
              />
            </div>
            <div className="blog-backend-blog-manage  d-flex justify-content-center mt-5">
              <ButtonLoad
                _type="button"
                loading={loading}
                _class="blog-detail-story-detail-card-btn-n mr-3 blog-w-200px"
                _name="บันทึกและพรีวิว"
                // disabled={!unSave}
                _click={(e) => onSubmit(e, "preview")}
              />
              <ButtonLoad
                _type="button"
                loading={loading}
                _class="blog-detail-story-detail-card-btn-n blog-w-200px"
                _name="บันทึกและเผยแพร่"
                /*disabled={!unSave}*/ _click={(e) => onSubmit(e, "publish")}
              />
            </div>
          </form>
        </Sidenav>
      </Layout>
    </div>
  );
}
