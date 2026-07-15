import React, { useState,useEffect,useContext,useRef } from 'react'
import Router from 'next/router'
import {Modal} from 'react-bootstrap';
import Button from './Button'


const ModalImage = ({show, onHide, size,onSubmit,modalProps,setModalProps,sizeUpload}) => {
  const {id,type ,idx,img,link,file} = modalProps
  const [preview, setPreview] = useState("/images/no-picture.png");
  // const [data,setData] = useState({file:null,link:'',type : type,idx});



  useEffect(()=>{
    const img_src = img || "/images/no-picture.png"
    setPreview(img_src)
    // setData({...data,...modalProps,img:img_src})
  },[modalProps])

  const handleChange = (event) => {
    if(!event.target.files[0]) {
      return;
    }
    let file = event.target.files[0];
    let tmp =  {...modalProps};
    tmp.file = file;
    tmp.img = URL.createObjectURL(file);
    setModalProps(tmp);
    // console.log('file',file)
    // setPreview(URL.createObjectURL(file));
  }
  const handleTextChange = (event)=>{
    let name = event.target.name;
    // alert(name)
    let val = event.target.value;
    let tmp =  {...modalProps,[name] : val};
    // tmp[name] = val;
    setModalProps(tmp)
  }

  const submit = ()=>{
    if(!file && !id ) return alert('No file select')
    if(onSubmit) onSubmit(modalProps);
    // setPreview("/images/no-picture.png")
    onHide()
  }

//  console.log(data);

  return (
    <Modal className="modal-alert" centered show={show} onHide={onHide} size={size}>
      <Modal.Body>
        <div className="py-5">

          <div className="row justify-content-center">
            <div className="col-6">
              <div className="form-group">
                <label>รูปภาพ {sizeUpload}</label>
                <div className="default-picture">
                  <div>
                    <img src={preview ? preview: ''} className="mw-100 w-auto" />
                  </div>
                  <label className="mt-3">ไฟล์</label>
                  <input type="file" name="image" className="form-control" onChange={handleChange} accept="image/*" />
                </div>
              </div>
            </div>
          </div>

          {/* <div className="row justify-content-center">
            <div className="col-6">
              <div className="form-group">
                <label>ลิงค์</label>
                <input type="text" name="link" value={link} className="form-control" onChange={handleTextChange} />
              </div>
            </div>
          </div> */}

          <div className="row justify-content-center mt-4">
            <div className="text-center">
              <Button _type="button" _class="btn-outline-primary" _name="ยกเลิก" _click={onHide} />
              <Button _type="button" _class="btn-primary ml-3" _name="ตกลง" _click={submit} />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>  
  )
}

export default ModalImage