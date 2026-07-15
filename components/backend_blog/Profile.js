import React, { useState,useEffect, useContext } from 'react'

import ImageBoxCircle from './widget/ImageBoxCircle'

import ModalProfile from './widget/ModalProfile'
const Profile = (props) => {
  const {img,onAction,setImg,show, setShow} = props;
  // const [index, setIndex] = useState([]);
 

  return (
    <>
     <h3>จัดการโปรไพล์</h3>
      <div className="row mt-4 mb-3">
        <div className="col-3">
          <div className=" text-right ml-4">
            <h4>เลือกรูปโปรไฟล์นักเขียน </h4>
          </div>
        </div>
        <div className="col-9">
          <ImageBoxCircle  _img={img ? img.img:null} idx={1} _text="โปรไฟล์" _name="picture" _id="image_profile"  onChange={()=>setShow(true)} />
        </div>
      </div>
      <ModalProfile onAction={onAction} show={show} onHide={()=>setShow(false)} size={''} size="xl" onSubmit={(file,url)=>{setImg(url,file)}} _img={img ? img.img:null} />
    </>
  )
}

export default Profile