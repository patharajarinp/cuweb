import React, { useEffect, useContext, useState ,useRef} from "react";
import Layout from "../../../components/backend_blog/layout/Layout";
import Sidenav from "../../../components/backend_blog/layout/Sidenav";
import ButtonLoad from "../../../components/backend_blog/widget/ButtonLoad";
import api from "../../../utils/api";
import UserContext from "../../../contexts/UserContext";
import Loading from "../../../components/loading";
import ConfirmDialog from '../../../components/ConfirmDialog'
import Filter from 'bad-words';

import dynamic from "next/dynamic";
const Editor = dynamic(
  () => import("../../../components/backend_blog/Editor"),
  {
    ssr: false,
    loading: () => Loading,
  }
);

export default function Manage() {
  const { user ,fetchUser } = useContext(UserContext);
  const formEl = useRef(null);
  const [loading, setloading] = useState(false)
  const [vaid, setVaid] = useState(false)
  const [vaidPhone, setVaidPhone] = useState(false)
  const [nameLength, setnameLength] = useState(0);
  const [unSave, setUnSave] = useState(true);
  const [dataDetail, setdataDetail] = useState("")
  const [onClear, setOnClear] = useState(false)
  const [newImg, setNewImg] = useState()
  const [bad, setBad] = useState();
  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => {setModalShow(false);
    setloading(false)}

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

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#EEEEEE";
    }
      getBadword()
    //   if(!user) return;
    // if(user.blog_writer && user.blog_writer.descriptions) {
    //   setdataDetail(user.blog_writer.descriptions);
    // }
    // document.querySelector('#ck-editor__label_edcbe62650056b8229d9b788970e49093').at
  }, []);
 const updateWriter = async (event)=>{
    event.preventDefault();
    setVaidPhone(false)
      setVaid(false)
    setloading(true)
    var data = new FormData(formEl.current);
    if(data.get("penname1") != user.blog_writer.penname1) data.append("editPenname",1)
    if(data.get("phone") != user.blog_writer.phone_writer) data.append("editPhone",1)
    
    var text = data.get("descriptionsWriter") +' '+ data.get("penname1")
    var filter = new Filter({ regex: /\*|\.|$/gi });
    if(bad){
      var val_en = bad.detail_en;
      var word_en = val_en.split(",");
      var find = false;
      word_en.forEach(val => {
        if(text.search(val) !=  -1){
          // console.log('val', val)
          find = true
      
        }
        // filter.addWords(val);
      });

      var val_th = bad.detail_th;
      var word_th = val_th.split(",");
      var found = false;
      for(var i = 0; i < word_th.length; i++) {
        const v = word_th[i]
        if(text.search(v) !=  -1){
          // console.log('v', v)
          found = true
          break;
        }
      }
    }
    
    // var Ntext = filter.clean(text);
    // var find = Ntext.includes('*');
    
    if(find || found) {
      setModalShow(true)
    }else{
      await api.updatePennameWriter(user.blog_writer.id,data) 
      .then(async (res) => {
         fetchUser()
         alert("Update Success")
         setloading(false)
         setVaidPhone(false)
          setVaid(false)
       })
       .catch((err) => {
         setloading(false)
         console.log(err.response);
         if (err.response.data.code == 1001) {
           setVaid(true)
         }
         if (err.response.data.code == 1002) {
          setVaidPhone(true)
        }
       });
    }

     
 }

  
  const checkedUnsave =(data)=>{
    if (nameLength != 0 && data != "" ) {
        setUnSave(true)
    }else{
        setUnSave(false)
    }
  }
  // useEffect(() => {
  //   if(!user) return;
  //   if(user.blog_writer && user.blog_writer.descriptions) {
  //     setdataDetail(user.blog_writer.descriptions);
  //   }
  // }, [user]);
  // console.log(user);
  // console.log(dataDetail);
  return (
    <>

      <Layout title="Writer Manage" page_name="dashboard" isHome={true}>
        {/* {load && <Loading />} */}

        <Sidenav page="">
        <form onSubmit={updateWriter}  encType="multipart/form-data" ref={formEl} >

        
          <div className="blog-backen-manage">
              <div >
                  <div className="row">
                      <div className="col-12">
                        <h3 className="mb-0 mr-3">จัดการบัญชีของฉัน</h3>
                      </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-3 text-right">
                      <label>
                        ชื่อนามปากกา  <span className="text-pink">*</span>
                      </label>
                    </div>
                    <div className="col-9 blog-manage-data">
                      
                        <input
                          id="penname1"
                          name="penname1"
                          type="text"
                          className="form-control blog-form mb-2"
                          maxLength="100"
                          required
                          defaultValue={user ?user.blog_writer.penname1:''}
                          placeholder="กรอกชื่อนามปากกา"
                          onKeyPress={(e)=>{
                            if(!e.target.value){
                              if (e.key === " ") {
                                e.preventDefault();
                              }
                            }
                          }}

                        />
                        {vaid?<span className="text-pink ">มีชื่อนามปากกานี้ในระบบแล้ว</span>:null}
                        
                        
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-3 text-right">
                      <label>
                      เบอร์โทรศัพท์มือถือ  <span className="text-pink">*</span>
                      </label>
                    </div>
                    <div className="col-9 blog-manage-data">
                      
                        <input
                         type="tel"
                         className="form-control mb-2"
                         name="phone"
                         placeholder="โปรดป้อนหมายเลขโทรศัพท์ของคุณ"
                         pattern="[0-9.+-]*"
                         title="ตัวเลข 0-9 +-"
                         defaultValue={user && user.blog_writer.phone_writer ? user.blog_writer.phone_writer : (user && user.phone ? user.phone :'') }
                         required

                        />
                        {vaidPhone?<span className="text-pink ">มีหมายเลขโทรศัพท์นี้ในระบบแล้ว</span>:null}
                        
                        
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-3 text-right">
                      <label>
                        คำอธิบายนักเขียน <span className="text-pink">*</span>
                      </label>
                    </div>
                    <div className="col-9 blog-manage-data">
                      
                        {/* <textarea
                          id="descriptionsWriter"
                          name="descriptionsWriter"
                          className="form-control blog-form"
                          defaultValue=""
                          maxLength="500"
                          defaultValue={user ?user.blog_writer.descriptions:''}
                          rows={6}
                        /> */}
                        {
                          (user && user.blog_writer) && (
                            <Editor _placeholder="กรอกคำอธิบายนักเขียน" onAction={checkedUnsave} data={user.blog_writer.descriptions ? user.blog_writer.descriptions : null}  id="descriptionsWriter" name="descriptionsWriter" height="400px" required onClear={onClear}
                            newImg={newImg}
                            setNewImg={setNewImg} /> 
                          )
                        }
                  
                          
                     
                    </div>
                  </div>
                  <div className="row mt-3">
                      <div className="col-12 text-center">
                      <ButtonLoad
                        _type="submit"
                        loading={loading}
                        _class="blog-detail-story-detail-card-btn-n mr-3 blog-w-200px"
                        _name="บันทึก"
                        // disabled={!unSave}
                        // _click={(e) => onSubmit(e, "preview")}
                        />
                      </div>
                  </div>
              </div>
          </div>
        </form>
        <ConfirmDialog show={modalShow} 
        text="กรุณาใช้คำสุภาพ" 
        onConfirm={handleModalClose}
        size="md" onHide={handleModalClose}
        cancel_btn={false}/>
        </Sidenav>
      </Layout>
    </>
  );
}
