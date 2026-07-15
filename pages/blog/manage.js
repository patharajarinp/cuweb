import React, { useEffect, useState, useRef, useContext } from "react";
import Layout from "../../components/backend_blog/layout/Layout";
import ManageData from "../../components/backend_blog/ManageData";
import ManageImage from "../../components/backend_blog/ManageImage";
import ManageEP from "../../components/backend_blog/ManageEP";
import api from "../../utils/api";
// import Editor from "../../components/backend_blog/Editor"

import dynamic from "next/dynamic";
import DivLoad from "../../components/backend_blog/widget/DivLoad";
import tools from "../../utils/tools";
import {Router} from "../../utils/i18n";
import UserContext from "../../contexts/UserContext";
const Loading = (
  <div className="position-relative">
    <DivLoad loading={true} />
  </div>
);
const Editor = dynamic(() => import("../../components/backend_blog/Editor"), {
  ssr: false,
  loading: () => Loading,
});
const manage = () => {
  const { user } = useContext(UserContext);
  const [bannerDesk, setBannerdesk] = useState([]);
  const [bannerM, setBannerM] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unSave, setUnSave] = useState(true);
  const [tags, settags] = useState([]);
  const [cateId, setcateId] = useState(0);
  const formEl = useRef(null);
  const [typeId, settypeId] = useState(0);
  const [status, setstatus] = useState("");
  useEffect(() => {
    settypeId(JSON.parse(localStorage.getItem("blogCeate")).typeId);
    setcateId(Number(JSON.parse(localStorage.getItem("blogCeate")).cateId));
    setstatus(JSON.parse(localStorage.getItem("blogCeate")).status);
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#EEEEEE";
    }
    
  }, []);

  const ceateBlog = async (data1) => {
    api
      .ceateBlog(data1)
      .then(async (res) => {
        window.open(`/blog/${res.data}?preview=1`);
        Router.push(`/manage/${res.data}`);
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
    data.append("cateId", cateId);
    if (user.blog_writer.penname1) {
      data.append("writerPenName", 1);
    }
    data.append("writerId", user.blog_writer.id);
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
                tags1={(tags) => {
                  settags(tags);
                  // console.log("tags", tags);
                }}
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
                onAction={setUnSave}
              />
            </div>
          </div>
          {status == ""
            ? typeId == 1 && (
                <div className="blog-backend-blog-manage  d-flex justify-content-center pb-5">
                  <div className="blog-backend-blog-manage-card">
                    <ManageEP />
                  </div>
                </div>
              )
            : ""}
          {typeId == 0 && (
            <div className="blog-backend-blog-manage  d-flex justify-content-center pb-5">
              <div className="blog-backend-blog-manage-card">
                <div className="row mt-4">
                  <div className="col-2 text-right">
                    <h4>เนื้อเรื่อง</h4>
                  </div>
                  <div className="col-10">
                    <Editor name="detail_th" height="400px" required />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="blog-backend-blog-manage  d-flex justify-content-center pb-5">
            <button
              type="button"
              onClick={(e) => {
                onSubmit(e, "preview");
              }}
            >
              บันทึกและพรีวิว
            </button>
            {typeId == 0 && (
              <button
                onClick={(e) => {
                  onSubmit(e, "publish");
                }}
                type="button"
              >
                บันทึกและเผยแพร่
              </button>
            )}
          </div>
        </form>
      </Layout>
    </div>
  );
};
export default manage;
