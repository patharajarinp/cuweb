import React, { useEffect, useState, useContext } from "react";
import Layout from "../../components/backend_blog/layout/Layout";
import {Link,Router} from "../../utils/i18n";
import api from "../../utils/api";


export default function create() {
  const [cate, setcate] = useState([]);

  const [cateSelect, setcateSelect] = useState([]);
  const [type, settype] = useState({});
  const getCate = () => {
    api
      .getBlogCategory()
      .then((res) => {
        setcate(res.data);
        let data = res.data;
        setcateSelect([{  id: data[0].id, name: data[0].name_th }]);
        settype({ id: 1, name: "เรื่องยาว (มีหลายตอน)" });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  useEffect(() => {
    getCate();
    document.getElementsByClassName("main-layout")[0].style.backgroundColor =
      "#EEEEEE";
  }, []);
  const onSubmit = (e) => {
    let data = {
      typeId: type.id,
      typeName: type.name,
      cate: cateSelect,
      status:'New'
    };
    localStorage.setItem("blogCeate", JSON.stringify(data));
    Router.push("/blog/manage/new");
  };
  const handelCate = (val)=>{

    let tmp = [...cateSelect]
    let check = tmp.findIndex((vall)=> {return vall.id == val.id})
    // console.log(check)
    if(check == -1) {
      tmp.push({
        id: val.id,
        name: val.name_th,
      })
      // console.log(tmp)
      setcateSelect(tmp);
    }else{
      tmp.splice(check, 1);
      setcateSelect(tmp);
    }
    
  }
  const checkCate = (val)=>{
    let tmp = [...cateSelect]
    
    let inc =   tmp.findIndex((vall)=>{return vall.id == val.id})
    // console.log('inc', inc)
    if (inc == -1) {
      return false
    } else {
      return true
    }

  }
  return (
    <div>
      <Layout
        title="Blog Create"
        page_name={"create"}
        // page_name2={"episode"}
        // isSubmenu={true}
        isHome={false}
      >
        <div className="blog-create d-flex justify-content-center">
          <div className="blog-create-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(e);
              }}
            >
              <h3>เลือกรูปแบบการเขียน</h3>
              <div className="row mt-4">
                <div className="col-12 d-flex">
                  <h4 className="mr-4">เลือกประเภท</h4>
                  <div className="d-flex">
                    <label className="containerCh">
                      เรื่องยาว (มีหลายตอน)
                      <input
                        type="radio"
                        defaultChecked="checked"
                        name="radio"
                        onChange={() => {
                          settype({ id: 1, name: "เรื่องยาว (มีหลายตอน)" });
                        }}
                      />
                      <span className="checkmark" />
                    </label>
                    <label className="containerCh">
                      เรื่องสั้น (ตอนเดียวจบ)
                      <input
                        type="radio"
                        name="radio"
                        onChange={() => {
                          settype({ id: 0, name: "เรื่องสั้น (ตอนเดียวจบ)" });
                        }}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row mt-4">
                <div className="col-12 d-flex">
                  <div>
                    <h4 className="mr-3 text">เลือกหมวดหมู่</h4>
                  </div>
                  {cate && (
                    <div>
                      {cate.map((cat, index) => (
                        <button
                          key={Math.random()}
                          className={`blog-create-btn ${
                            checkCate(cat) ? " active":""
                          }`}
                          type="button"
                          onClick={() => {
                            handelCate(cat)
                          }}
                        >
                          {cat.name_th} 
                          {/* <div className="blog-create-btn-ch"></div> */}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-12">
                  <div className="d-flex justify-content-end align-items-center">
                    <Link href="/blog/writer/manage">
                      <a>
                        <button
                          className="blog-detail-story-detail-card-btn-b"
                          type="button"
                        >
                          ยกเลิก
                        </button>
                      </a>
                    </Link>
                    <button
                      className="blog-detail-story-detail-card-btn-n"
                      type="submit"
                    >
                      ต่อไป
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </div>
  );
}
