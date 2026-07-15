import React, { useState } from "react";

export default function Modal() {
  const [show, setshow] = useState({ display: "none" });
  return (
    <>
   
      <div 
        className="blog-modal"
        style={show}
       
      >
     
        
        <div className="blog-modal-l">
          <div className="blog-modal-header">
            <p className="blog-modal-header-l">รายชื่อผู้ติดตาม</p>
            <p className="blog-modal-header-r">123 คน</p>
          </div>
          <div className="blog-modal-body">
            <div className="blog-modal-item">
              <div
                className="blog-modal-item-img"
                style={{ backgroundImage: 'url("/images/user-test1.jpg")' }}
              ></div>
              <div className="blog-modal-item-name">ExonBlade</div>
            </div>
            <div className="blog-modal-item">
              <div
                className="blog-modal-item-img"
                style={{ backgroundImage: 'url("/images/user-test1.jpg")' }}
              ></div>
              <div className="blog-modal-item-name">ExonBlade</div>
            </div>
            <div className="blog-modal-item">
              <div
                className="blog-modal-item-img"
                style={{ backgroundImage: 'url("/images/user-test1.jpg")' }}
              ></div>
              <div className="blog-modal-item-name">ExonBlade</div>
            </div>
            <div className="blog-modal-item">
              <div
                className="blog-modal-item-img"
                style={{ backgroundImage: 'url("/images/user-test1.jpg")' }}
              ></div>
              <div className="blog-modal-item-name">ExonBlade</div>
            </div>
            <div className="blog-modal-item">
              <div
                className="blog-modal-item-img"
                style={{ backgroundImage: 'url("/images/user-test1.jpg")' }}
              ></div>
              <div className="blog-modal-item-name">ExonBlade</div>
            </div>
          </div>
          <div className="blog-modal-footer">
            <button
              className="blog-modal-btn"
              type="button"
              onClick={() => {
                setshow({ display: "none" });
              }}
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
  
      </div>
   
      <div>
        <p
          onClick={() => {
            setshow({ display: "block" });
          }}
          style={{ cursor: "pointer" }}
        >
          ผู้ติดตาม 123
        </p>
      </div>
      
    </>
  );
}
