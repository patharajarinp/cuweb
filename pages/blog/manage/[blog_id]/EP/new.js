import React, { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from "next/router";
import {Router} from '../../../../../utils/i18n'
import Layout from "../../../../../components/backend_blog/layout/Layout";
import dynamic from "next/dynamic";
import DivLoad from "../../../../../components/backend_blog/widget/DivLoad";
import ManageImage from "../../../../../components/backend_blog/ManageImage";
import ButtonLoad from "../../../../../components/backend_blog/widget/ButtonLoad";
import api from "../../../../../utils/api";
import UserContext from "../../../../../contexts/UserContext";
import { set } from "js-cookie";
const Loading = (
  <div className="position-relative h-500px">
    <DivLoad loading={true} />
  </div>
);
const Editor = dynamic(
  () => import("../../../../../components/backend_blog/Editor"),
  {
    ssr: false,
    loading: () => Loading,
  }
);
export default function New() {
  const { user } = useContext(UserContext);
  const formEl = useRef(null);
  const router = useRouter();
  const blog_id = router.query.blog_id;
  const [blog, setblog] = useState([]);
  const [nameLength, setnameLength] = useState(0);
  const [bannerDesk, setBannerdesk] = useState([]);
  const [bannerM, setBannerM] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unSave, setUnSave] = useState(true);
  const [dataDetail, setdataDetail] = useState("")
  const [onClear, setOnClear] = useState(false)
  const [newImg, setNewImg] = useState()
  useEffect(() => {
    setblog(JSON.parse(localStorage.getItem("EPcreate")));
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#EEEEEE";
    }
    setUnSave(false);
  }, []);
  const onSubmit = async (event, type) => {
    event.preventDefault();

    var data = new FormData(formEl.current);

    if (type == "publish") data.append("save_publish", 1);
    if (data.get("nameData") == "" || data.get("nameData") == " ") return alert("กรุณากรอก ชื่อตอน !!")
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
    data.append("groupsId", blog_id);
    data.append("writerId", user.blog_writer.id);
    setLoading(true);
   await api
      .ceateData(data)
      .then(async (res) => {
        setLoading(false);
        Router.push(`/blog/manage/[blog_id]?blog_id=${blog_id}`,`/blog/manage/${blog_id}`);
        if (type == "preview")window.open(`/blog/${blog_id}/${res.data}?preview=1`);
          
        
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response);
      });
  };
  const checkedUnsave =(data)=>{
    if (nameLength != 0 && data != "" ) {
        setUnSave(true)
    }else{
         setUnSave(false)
    }
  }
  return (
    <div>
      <Layout
        title="Blog Create"
        page_name={blog ? blog.blog_name : ""}
        page_link={blog_id}
        page_name2={"episode"}
        isSubmenu={true}
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
              <div className="row">
                <div className="col-12">
                  <h3>ข้อมูลทั่วไป</h3>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-3 text-right">
                  <h4>ชื่อเรื่อง</h4>
                </div>
                <div className="col-9">
                  <p>{blog ? blog.blog_name : ""}</p>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-3 text-right">
                  <label>
                    ชื่อตอน
                    <span className="text-pink">*</span>
                  </label>
                </div>
                <div className="col-9 blog-manage-data">
                  <div className="input-group">
                    <input
                      id="nameData"
                      name="nameData"
                      type="text"
                      className="blog-manage-data-name form-control"
                      maxLength="120"
                      onChange={(e) => {
                        const data = e.target.value;
                        checkedUnsave()
                        if(data=="")setUnSave(false)
                        setnameLength(data.length);
                      }}
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        {" "}
                        {nameLength} / 120
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-3 text-right">
                  <label>
                    รายละเอียด
                    <span className="text-pink">*</span>
                  </label>
                </div>
                <div className="col-9">
                  <Editor onAction={checkedUnsave} data={dataDetail} name="detail_th" height="900px" required onClear={onClear}
                        newImg={newImg}
                        setNewImg={setNewImg} />
                </div>
              </div>
              {/* <div className="row mt-4">
              <div className="col-3 text-right">
                <label>
                  สถานะ
                  <span className="text-pink">*</span>
                </label>
              </div>
              <div className="col-9">
                <select name="status" className="form-control w-50">
                  <option value="0">แสดง</option>
                  <option value="1">ไม่แสดง</option>
                </select>
              </div>
            </div> */}

              <div className="row mt-4">
                <div className="col-3 text-right">
                  <label>
                    สามารถให้ดาวน์โหลด PDF
                    <span className="text-pink">*</span>
                  </label>
                </div>
                <div className="col-9">
                  <select name="pdf" className="form-control w-50">
                    <option value={1}>เปิด</option>
                    <option value={0} selected>ปิด</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="blog-backend-blog-manage  d-flex justify-content-center pb-5">
            <div className="blog-backend-blog-manage-card">
              <ManageImage
                max={1}
                editData
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
          <div className="blog-backend-blog-manage  d-flex justify-content-center pb-5">
            <ButtonLoad
              _type="button"
              loading={loading}
              _class="blog-detail-story-detail-card-btn-n mr-3"
              _name="บันทึกและพรีวิว"
              disabled={!unSave}
              _click={(e) => onSubmit(e, "preview")}
            />
            <ButtonLoad
              _type="button"
              loading={loading}
              _class="blog-detail-story-detail-card-btn-n"
              _name="บันทึกและเผยแพร่"
              disabled={!unSave}
              /*disabled={!unSave}*/ _click={(e) => onSubmit(e, "publish")}
            />
          </div>
        </form>
      </Layout>
    </div>
  );
}
