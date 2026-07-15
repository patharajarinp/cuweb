import React, { useEffect, useState, useRef, useContext } from "react";
import Layout from "../../../../../components/backend_blog/layout/Layout";
import dynamic from "next/dynamic";
import DivLoad from "../../../../../components/backend_blog/widget/DivLoad";
import ManageImage from "../../../../../components/backend_blog/ManageImage";
import api from "../../../../../utils/api";
import UserContext from "../../../../../contexts/UserContext";
import ButtonLoad from "../../../../../components/backend_blog/widget/ButtonLoad";
import {Router} from '../../../../../utils/i18n'
import { useRouter } from "next/router";
const Loading = (
  <div className="position-relative">
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
  const [dates, setdates] = useState();
  const [onClear, setOnClear] = useState(false)
  const [newImg, setNewImg] = useState()
  const data_id = router.query.data_id;
  const fetchData = async () => {
    api
      .getDataOne(data_id)
      .then(async (res) => {
        setUnSave(false);
        const data = res.data;
        if (data == null) {
          Router.push('/blog/writer/manage')
        }
        setnameLength(data.title.length);
        setdates(data);
        
        setBannerdesk([{ id: data.blog_data_banner.id, img: data.blog_data_banner.picture }]);
       
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#EEEEEE";
    }

    fetchData();
  }, []);
  useEffect(() => {
    if (dates && user) {
      if(dates.blog_group.writer_id !== Number( user.blog_writer.id)){
        Router.push('/blog/writer/manage')
      }
    }
  }, [dates,user]);
  useEffect(() => {
    const handleRouteChange = (url) => {
      if ( unSave && !window.confirm('You really want to leave?' )) {
        Router.events.emit('routeChangeError');
        // Router.replace(Router, Router.asPath, { swallow: true });
      
        throw 'Abort route change. Please ignore this error.';
        
      }else{
         setOnClear(true)
      }
     
      //return true;
    }

    window.onbeforeunload = unSave && (() => unSave) ;

    
    Router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      window.onbeforeunload = null;
      Router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [unSave])

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
    deleted.forEach(val=>{
      if(val.id) data.append('deleted_banner',val.id)
    })
    
    data.append('edited_banner',JSON.stringify(edited))
    data.append("groupsId", blog_id);
    data.append("data_id", dates.id);
    data.append("writerId", user.blog_writer.id);


    setLoading(true);
   setUnSave(false) 
   await api
      .updateData(data)
      .then(async (res) => {
        setLoading(false);
        setNewImg(null)
        setOnClear(false)
         alert("Update success")

         Router.push(`/blog/manage/[blog_id]?blog_id=${blog_id}`,`/blog/manage/${blog_id}`);
        if (type == "preview")window.open(`/blog/${blog_id}/${dates.id}?preview=1`);
         fetchData()
          setBannerdesk([])
          setBannerM([])
          setDeleted([])
         
        // Router.push(`/blog/manage/${blog_id}/EP/${dates.id}`);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response);
      });
  };
  return (
    <div>
      <Layout
        title={dates ? dates.title : ""}
        page_name={dates ? dates.blog_group.title : ""}
        page_link={blog_id}
        page_name2={dates ? dates.title : ""}
        page_link2={data_id}
        isSubmenu={true}
        isHome={false}
      >
        <form
          //   onSubmit={onSubmit}
          onKeyDown={(event) => {
            if (event.keyCode == 13) {
              event.preventDefault();
              return false;
            }
          }}
          encType="multipart/form-data"
          ref={formEl}
        >
          {dates  ? (
            <>
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
                      <p>{dates.blog_group.title}</p>
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
                          defaultValue={dates.title}
                          onChange={(e) => {
                            const data = e.target.value;
                            setUnSave(true);
                            if (data == "") {
                              setUnSave(false);
                            }
                            setnameLength(data.length);
                          }}
                          required
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            {" "}
                            {nameLength}/120
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
                      <Editor
                        data={dates.content}
                        name="detail_th"
                        height="900px"
                        required
                        onAction={setUnSave}
                        onClear={onClear}
                        newImg={newImg}
                        setNewImg={setNewImg}
                      />
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
                      <select
                        name="pdf"
                        className="form-control w-50"
                        defaultValue={dates.pdf_status}
                        onChange={()=>{setUnSave(true)}}
                      >
                        <option value={1}>เปิด</option>
                        <option value={0}>ปิด</option>
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
            </>
          ) : (
            ""
          )}

          <div className="blog-backend-blog-manage  d-flex justify-content-center pb-5">
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
      </Layout>
    </div>
  );
}
