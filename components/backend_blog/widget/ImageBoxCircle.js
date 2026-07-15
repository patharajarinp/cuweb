import React, { useState, useContext } from 'react'
import classNames  from 'classnames';
  
const ImageBoxCircle = ({show, _name, _text, _id, _img, index, setIndex, idx, chkImg,onAction,onChange}) => {

  const [img, setImg1] = useState(_img || null);

  const handleChange = () => {
    // if(!event.target.files[0]) {
    //   return;
    // }
    // if(index){
    //   var tmp = index;
    //   // console.log(tmp);
    //   if(!tmp.includes(idx)){
    //     tmp.push(idx);
    //     setIndex(tmp);
    //   }
    // }
    if(onAction) onAction(true)
    if(onChange) onChange(true)
    // setImg1(URL.createObjectURL(event.target.files[0]));
    // setImg(URL.createObjectURL(event.target.files[0]),event.target.files[0])
  }


  return (
    <>
      {
        !img ? (
          <div className="box-img circle text-center" onClick={handleChange}>
            <label htmlFor={_id} className={classNames("img-box mb-0", chkImg && 'img-required')}>
              <img src="/icon/icon-add.svg" className="middle" />
            </label>
            <p className={classNames(chkImg && 'text-required')}>{_text} {_text == "ภาพปก" ? <span className="text-danger">*</span> : ''}</p>
            {/* <input id={_id} name={_name} type="file"  onChange={(e)=>{handleChange(e);}} accept="image/*" /> */}
          </div>
        ) : (
          <div className="box-img circle text-center" onClick={handleChange}>
            <label htmlFor={_id} className="img-box show mb-0">
              <img src={img} className="middle" />
              <div className="dropbox"></div>
              <div className="middle-absolute"><i className="fas fa-pen-square"></i></div>
            </label>
            <p>{_text} {_text == "ภาพปก" ? <span className="text-danger">*</span> : ''}</p>
            {/* <input id={_id} name={_name} type="file"  onChange={(e)=>{handleChange(e);}} accept="image/*" /> */}
          </div>
        )
      }
      
      
    </>
  )
}

export default ImageBoxCircle