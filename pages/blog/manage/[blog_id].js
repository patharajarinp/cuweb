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
import  { useRouter } from "next/router";
import {Router} from '../../../utils/i18n'
import UserContext from "../../../contexts/UserContext";
import ModalConfirmDialog from "../../../components/backend_blog/widget/ModalConfirmDialog";
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
  const [unSave, setUnSave] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [tags, settags] = useState([]);
const [deleteTags, setdeleteTags] = useState([])
  const formEl = useRef(null);
  const [cateId, setcateId] = useState(0);
  const [cate, setcate] = useState();
  const [typeId, settypeId] = useState(0);
  const [type, settype] = useState("");
  const [status, setstatus] = useState("");
  const [name, setname] = useState("");
  const [namePage, setnamePage] = useState("");
  const [blogId, setblogId] = useState(0);
  const [blog, setblog] = useState();
  const [datas, setdatas] = useState([]);
  const [Index, setIndex] = useState(0)
  const router = useRouter();
  const [updateIndex, setupdateIndex] = useState([])
  const [cateSelect, setCateSelect] = useState()
  const blog_id = router.query.blog_id;

  const fetchBlog = async () => {
    api
      .getBlogOne(blog_id)
      .then(async (res) => {
        const data = res.data;
        if (data == null) {
          Router.push('/blog/writer/manage')
        }
        let blogT = [];
        data.blog_group_tags.forEach((val, index) => {
          blogT.push(val.blog_tag.tag_name);
        });

        settags(blogT);
        setblog(data);
        // console.log('data', data)
        let tmp = []
        data.blog_group_categories.forEach((val,index)=>{
          tmp.push({name:val.blog_category.name_th,id:val.blog_category.id})
        })
        setcate(tmp)
        setnamePage(data.title);
        setname(data.title);
        if (data.type == 0) {
          settype("เรื่องสั้น (ตอนเดียวจบ)");
        } else {
          settype("เรื่องยาว (มีหลายตอน)");
        }

        const bd = data.blog_group_banners
          .filter((val) => val.type == 0)
          .map((val) => {
            return { id: val.id, img: val.picture };
          });
        const bm = data.blog_group_banners
          .filter((val) => val.type == 1)
          .map((val) => {
            return { id: val.id, img: val.picture };
          });
        if (bd.length) setBannerdesk(bd);
        if (bm.length) setBannerM(bm);
        //  const getdata = await api.getData(blog_id)
        //  setdatas(getdata.data)
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchData = async () => {
    api
      .getData(blog_id)
      .then(async (res) => {
        let data = res.data;
        // console.log('object', data)
        setdatas(data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#EEEEEE";
    }
   
    fetchBlog();
    fetchData();
  }, []);
  useEffect(() => {
    if (blog && user) {
      if(blog.writer_id !== Number( user.blog_writer.id)){
        Router.push('/blog/writer/manage')
      }
    }
  }, [blog,user]);
  useEffect(() => {
    const handleRouteChange = (url) => {
      if ( unSave && !window.confirm('You really want to leave?' )) {
        Router.events.emit('routeChangeError');
        // Router.replace(Router, Router.asPath, { swallow: true });
        throw 'Abort route change. Please ignore this error.';
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
  const updateBlog = async (data1) => {
    api
      .updateBlog(data1)
      .then(async (res) => {
        setLoading(false)
        // console.log('res.data', res.data)
        router.push(`/blog/manage/[blog_id]?blog_id=${blog_id}`,`/blog/manage/${blog_id}`)
        alert("Update success")
       await fetchBlog();
        // window.open(`/blog/${res.data}?preview=1`);
        // Router.push(`/manage/${res.data}`);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const onSubmit = async (event, type) => {
    event.preventDefault();

    var data = new FormData(formEl.current);
    //  data.append("data", JSON.stringify(event.target))

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

    deleted.forEach(val=>{
      if(val.id) data.append('deleted_banner',val.id)
    })
    data.append('edited_banner',JSON.stringify(edited))
    data.append('orders',JSON.stringify({desktop:dsk_ord,mobile : mb_ord}))
    data.append("typeId", typeId);
    data.append("cateId", cateId);
    data.append("blogId", blog_id);

    deleteTags.forEach((val2, index) => {
      data.append("deleteTags", val2);
    });
    if(cateSelect){
      cateSelect.forEach(val=>{
         data.append("cateEdit", val.id);
      })
    }

    if (user.blog_writer.penname1) {
      data.append("writerPenName", 1);
    }
    data.append("writerId", user.blog_writer.id);
    if (updateIndex.length!=0) {
      data.append("dataIndex", JSON.stringify(updateIndex));
    }
    setUnSave(false)
    setLoading(true)

    await updateBlog(data);
  };
  const ondeleteData = ()=>{
    api.deleteData({group_id:blog_id,index:Index}).then(async (res) => {
      fetchData()
    })
    .catch((err) => {
      console.log(err.response);
    });
  }
  const upddatePdfData = (pdf,id)=>{
    api.upddatePdfData({pdf,id}).then(async (res) => {
      alert("Update success")
      fetchData()
    })
    .catch((err) => {
      console.log(err.response);
    });
  }
  const setdataindex =(value)=>{
    setupdateIndex(value)
  }
  // console.log("object", deleted, bannerDesk, bannerM);
  return (
    <div>
      <Layout
        title={namePage}
        page_name={namePage}
        // page_name2={"episode"}
        // isSubmenu={true}
        page_link={blog_id}
        isHome={false}
      >
        <form
          // onSubmit={onSubmit}
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
              {blog ? (
                <ManageData
                  type={type}
                  cate={cate ? cate:null}
                  tag={tags}
                  typeid={blog.type}
                  name={name}
                  onAction={setUnSave}
                  setname={(data) => {
                    setname(data);
                  }}
                  tags1={(tags) => {
                    settags(tags);
                    // console.log("tags", tags);
                  }}
                  onDeleteTags={(val_t)=> {
                    var tmp = [...deleteTags]
                    tmp.push(val_t)
                    setdeleteTags(tmp)
                  }}
                  cateSelect={(data)=>{setCateSelect(data)}}
                />
              ) : (
                <></>
              )}
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

          <div className="blog-backend-blog-manage  d-flex justify-content-center pb-5">
            <div className="blog-backend-blog-manage-card">
              <ManageEP data1={datas} blog_id={blog_id} blog_name={namePage}  onAction={setUnSave} setdataindex={setdataindex} type={blog&&blog.type} onDelete={(index,id)=>{setIndex(index)
              setModalShow(true) 
              }} updatePdf={(val,id)=>{upddatePdfData(val,id)}} />
            </div>
          </div>

          {/* {blog.length != 0
            ? blog.type == 0 && (
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
              )
            : ""} */}

          <div className="blog-backend-blog-manage  d-flex justify-content-center pb-5">
            <ButtonLoad
              _type="button"
              loading={loading}
              _class="blog-detail-story-detail-card-btn-n mr-5 blog-w-200px"
              _name="บันทึก"
              disabled={!unSave}
            
              _click={(e) => onSubmit(e, "preview")}
            />
           
          </div>
        </form>
        <ModalConfirmDialog
            show={modalShow}
            text="ยืนยันการลบตอนนี้ หรือไม่?"
            size="md"
            cancel_btn={true}
            onConfirm={() => ondeleteData()}
            onHide={() => setModalShow(false)}
          />
      </Layout>
    </div>
  );
};
export default manage;
