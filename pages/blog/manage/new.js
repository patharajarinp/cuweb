import React, { useEffect, useState, useRef, useContext } from "react";
import Layout from "../../../components/backend_blog/layout/Layout";
import ManageData from "../../../components/backend_blog/ManageData";
import ManageImage from "../../../components/backend_blog/ManageImage";
import ManageEP from "../../../components/backend_blog/ManageEP";
import api from "../../../utils/api";
// import Editor from "../../../components/backend_blog/Editor"
import ButtonLoad from "../../../components/backend_blog/widget/ButtonLoad";
import dynamic from "next/dynamic";
import DivLoad from "../../../components/backend_blog/widget/DivLoad";
import tools from "../../../utils/tools";
import {Router} from "../../../utils/i18n";
import UserContext from "../../../contexts/UserContext";
const Loading = (
  <div className="position-relative">
    <DivLoad loading={true} />
  </div>
);
const Editor = dynamic(
  () => import("../../../components/backend_blog/Editor"),
  {
    ssr: false,
    loading: () => Loading,
  }
);
const manage = () => {
  const { user } = useContext(UserContext);
  const [bannerDesk, setBannerdesk] = useState([]);
  const [bannerM, setBannerM] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unSave, setUnSave] = useState(true);
  const [tags, settags] = useState([]);
  const [cate, setcate] = useState();
  const [cateId, setcateId] = useState(0);
  const formEl = useRef(null);
  const [typeId, settypeId] = useState(0);
  const [type, settype] = useState("");
  const [status, setstatus] = useState("");
  const [name, setname] = useState("");

  useEffect(() => {
    if (localStorage.getItem("blogCeate")) {
      settype(JSON.parse(localStorage.getItem("blogCeate")).typeName);
      settypeId(JSON.parse(localStorage.getItem("blogCeate")).typeId);
      // setcateId(Number(JSON.parse(localStorage.getItem("blogCeate")).cateId));
      setcate(JSON.parse(localStorage.getItem("blogCeate")).cate);
     
      setstatus(JSON.parse(localStorage.getItem("blogCeate")).status);
    } else {
      Router.push("/blog/create");
    }
    setUnSave(false)
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#EEEEEE";
    }
  }, []);

  const ceateBlog = async (data1) => {
    api
      .ceateBlog(data1)
      .then(async (res) => {
        localStorage.removeItem("blogCeate");
        setLoading(false);
        Router.push(`/blog/manage/[blog_id]?blog_id=${res.data}`,`/blog/manage/${res.data}`);
        window.open(`/blog/${res.data}?preview=1`);
        
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const onSubmit = async (event, type) => {
    event.preventDefault();

    var data = new FormData(formEl.current);

    //  data.append("data", JSON.stringify(event.target))
    if (type == "publish") data.append("save_publish", 1);
    if (data.get("name_blog") == "" || data.get("name_blog") == " ") return alert("กรุณากรอก ชื่อเรื่อง !!")
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
    tags.forEach((val, index) => {
      data.append("tags", val);
    });

    data.append("typeId", typeId);
    cate.forEach((val, index)=>{
       data.append("cate", val.id);
    })
   

    if (user.blog_writer.penname1) {
      data.append("writerPenName", 1);
    }
    data.append("writerId", user.blog_writer.id);

    setLoading(true);
    await ceateBlog(data);
  };
  return (
    <div>
      <Layout
        title="Blog Create"
        page_name={"create"}
        // page_name2={"episode"}
        // isSubmenu={true}
        isHome={false}
      >
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
          <div className="blog-backend-blog-manage  d-flex justify-content-center pb-5">
            <div className="blog-backend-blog-manage-card">
              <ManageData
                type={type}
                cate={cate ?cate:null}
                name={name}
                setname={(data) => {
                  setname(data);
                }}
                onAction={setUnSave}
                tags1={(tags) => {
                  settags(tags);
                  // console.log("tags", tags);
                }}
                cateSelect={(data)=>setcate(data)}
              />
            </div>
          </div>
          <div className="blog-backend-blog-manage  d-flex justify-content-center pb-5">
            <div className="blog-backend-blog-manage-card">
              <ManageImage
                bannerDesk={bannerDesk}
                setBannerdesk={setBannerdesk}
                bannerM={bannerM}
                setBannerM={setBannerM}
                deleted={deleted}
                setDeleted={setDeleted}
              
              />
            </div>
          </div>

          <div className="blog-backend-blog-manage  d-flex justify-content-center pb-5">
            <ButtonLoad
              _type="button"
              loading={loading}
              _class="blog-detail-story-detail-card-btn-n"
              _name="บันทึกและพรีวิว"
              disabled={!unSave}
              _click={(e) => onSubmit(e, "preview")}
            />
            {/* <button
             className="blog-detail-story-detail-card-btn-n"
              type="button"
              onClick={(e) => {
                onSubmit(e, "preview");
              }}
            >
              บันทึกและพรีวิว
            </button> */}
          </div>
        </form>
      </Layout>
    </div>
  );
};
export default manage;
