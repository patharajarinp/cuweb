import React, { useEffect, useContext, useState } from "react";
import Layout from "../../../components/backend_blog/layout/Layout";
import UserContext from "../../../contexts/UserContext";
import tools from "../../../utils/tools";
import api from "../../../utils/api";
import {Router, Link} from "../../../utils/i18n";
import ConfirmDialog from '../../../components/ConfirmDialog'
import Filter from 'bad-words';
import Loading from "../../../components/loading";
export default function Register() {
  const { user ,setUser} = useContext(UserContext);
  const [vaid, setVaid] = useState(false)
  const [bad, setBad] = useState();
  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false)
  const [vaidPhone, setVaidPhone] = useState(false)
  const [load, setLoad] = useState(false)
  const getBadword = () => {
    api.getBadword(1)
    .then(res=>{
      const data = res.data;
      ;
      setBad(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  const postWriter = (data) => {
    // console.log(data.penname);
    setLoad(true)
    setVaid(false)
        setVaidPhone(false)
    api
      .postWriter({
        member_id: user.id,
        penname1: data.penname,
        phone:data.phone
      })
      .then((res) => {
        // console.log("res", res.data);
        let tmp = {...user}
        tmp.blog_writer = res.data;
        setUser(tmp)
        
        setLoad(false)
        setVaid(false)
        setVaidPhone(false)
        // Router.push("/blog/writer/manage");
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data.code == 1001) {
          setVaid(true)
        }
        if (err.response.data.code == 1002) {
          setVaidPhone(true)
        }
        setLoad(false)
      });
  };
  const register = async (event) => {
    const data = tools.toJson(new FormData(event.target));

    var text = data.penname
    var filter = new Filter({ regex: /\*|\.|$/gi });
    if(bad){
      var val_en = bad.detail_en;
      var word_en = val_en.split(",");
      word_en.forEach(val => {
        filter.addWords(val);
      });

      var val_th = bad.detail_th;
      var word_th = val_th.split(",");
      var found = false;
      for(var i = 0; i < word_th.length; i++) {
        const v = word_th[i]
        if(text.search(v) !=  -1){
          found = true
          break;
        }
      }
    }
    
    var Ntext = filter.clean(text);
    var find = Ntext.includes('*');
    // console.log('find', find)
    if(find || found) {
      setModalShow(true)
    }else{
      await postWriter(data);
    }

   
    // console.log("data", data);
  };
  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#EEEEEE";
    }
      getBadword()
  }, []);
  useEffect(() => {
    if (user) {
      if (user.blog_writer) {
        Router.push("/blog/writer/manage");
      } 
    }
  }, [user]);
  return (
    <Layout title="Writer register" page_name="dashboard" isHome={true} blogRegis={true}>
      {load&&<Loading/>}
      <div className="blog-writer-register">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h3 className="text-center mt-4">สมัครเป็นนักเขียน</h3>
              <div className="row r1 pb-lg-4 mt-4">
                <div className="col-12">
                  <form
                    id="form-register"
                    onSubmit={(e) => {
                      e.preventDefault();
                      register(e);
                    }}
                  >
                    <div className="blog-writer-register-col">
                      <label>
                        นามปากกา
                        <span className="text-pink">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="penname"
                        placeholder="กรุณาเพิ่มนามปากกาของคุณ..."
                        title="กรุณาเพิ่มนามปากกาของคุณ..."
                        maxLength="100"
                        required
                        onKeyPress={(e)=>{
                          if(!e.target.value){
                            if (e.key === " ") {
                              e.preventDefault();
                            }
                          }
                        }}
                      />
                      {vaid?<p className="mb-0 text-pink ">มีชื่อนามปากกานี้ในระบบแล้ว</p>:null}
                      <label className="mt-3">
                        เบอร์โทรศัพท์มือถือ
                        <span className="text-pink"> *</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control mb-2"
                        name="phone"
                        placeholder="โปรดป้อนหมายเลขโทรศัพท์ของคุณ"
                        pattern="[0-9.+-]*"
                        title="ตัวเลข 0-9 +-"
                        defaultValue={user && user.phone ? user.phone : '' }
                        required
                      />
                      {vaidPhone?<p className="mb-0 text-pink ">มีหมายเลขโทรศัพท์นี้ในระบบแล้ว</p>:null}
                      <div className="input-group w-100 mt-4">
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="cetagory-category-158"
                            name="check"
                            required
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="cetagory-category-158"
                          >
                            <p>
                              ฉันได้อ่านและเข้าใจข้อตกลงของ ศูนย์หนังสือจุฬาฯ
                              <a className="text-success" onClick={()=>{window.open("/privacy_policy/condition_writer")}}><u>ข้อตกลงและเงื่อนไข</u></a>
                              {/* <span ></span> */}
                            </p>
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="blog-detail-story-detail-card-btn-n mt-4 w-100"
                        >
                          สมัครบัญชีนักเขียน
                        </button>
                        {/* <input
                        type="checkbox"
                        className="form-check-input"
                        defaultValue
                      />
                      <label>
                        ฉันได้อ่านและเข้าใจข้อตกลงของ ศูนย์หนังสือจุฬาฯ
                        ข้อตกลงและเงื่อนไข
                      </label> */}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog show={modalShow} 
        text="กรุณาใช้คำสุภาพ" 
        onConfirm={handleModalClose}
        size="md" onHide={handleModalClose}
        cancel_btn={false}/>
    </Layout>
  );
}
