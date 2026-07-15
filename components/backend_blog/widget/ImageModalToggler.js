import React, { useState, useContext } from 'react'
import classNames  from 'classnames';
  
const ImageModalToggler = (props) => {
  const {onClick,_text,img, className} = props

  const {onDelete} = props
//   const [img, setImg] = useState(_img || null);

  


    if(img) {
        return (
            <div className={classNames("box-img text-center", className)} >
                <label  className="img-box show mb-0">
                <img src={img} className="middle" />
                <div className="dropbox" onClick={onClick}></div>
                <div className="close-icon" onClick={onDelete}>
                    <i className="fas fa-times-circle"></i>
                </div>
                
                <div className="middle-absolute" onClick={onClick} ><i className="fas fa-pen-square"></i></div>
                </label>
                <p>{_text}</p>
                <style jsx>{`
                .close-icon  {
                    
                    position:absolute;
                    top : -10px;
                    right : -10px;
                    
                }
                `}

                </style>
            </div>
        )
    }

  return (
    <>
        <div className="box-img text-center" onClick={onClick}>
            <label  className={classNames("img-box mb-0")}>
              <img src="/icon/icon-add.svg" className="middle" />
            </label>
            <p >{_text} </p>
            
        </div>
      
      
    </>
  )
}

export default ImageModalToggler