import React, { useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import classnames from "classnames";
import { alertFont } from "../AlertFont";
import api from "../../../../utils/api";

export default function ProblemModal({
  show,
  handleClose,
  user,
  blog,
  group_id,
  data_id,
  commentId,
  type
}) {
  const [issueType, setissueType] = useState(1);
  const formEl2 = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const onissue = async (e) => {
    e.preventDefault();

    var data = new FormData(formEl2.current);
    data.append("member_id", user.id);
    data.append("writer_id", blog.blog_group.writer_id);
    data.append("group_id", group_id);
    data.append("data_id", data_id);
    if (commentId) data.append("comment_id", commentId);
    data.append("issue_type", issueType);
    data.append("report_type", type);
    // member_id,writer_id,group_id,data_id,comment_id,issue_type
    await api
      .postIssue(data)
      .then(async (res) => {
        // console.log("res.data", res.data);
        alertFont("แจ้งปัญหาเรียบร้อยแล้ว");
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  return (
    <div>
      {/* <div id="blogAlert1"></div> */}
     
      <div className={`blog-problem-card  fade ${show?'show':''} `}>
        <div className="container">
          <a className="btn-close" onClick={handleClose}></a>
          <h3 className="text-center text-black mb-4">บอกปัญหาที่พบ</h3>
         
        </div>
        <hr/>
        <form onSubmit={onissue} encType="multipart/form-data" ref={formEl2}>
        <div className="container">
        <label className="mb-3">
        ความคิดเห็นนี้มีปัญหาอะไร<span className="text-pink">*</span>
        </label>
        <div className="mb-5">
          <div className="d-flex  blog-border " onClick={toggle} >
              <p className="mb-2 ">
              {issueType == 1 && "มีปัญหาไม่สามารถอ่านได้"}
                    {issueType == 2 && "มีเนื้อหาไม่เหมาะสม"}
                    {issueType == 3 && "มีปัญหาเรื่องการละเมิดลิขสิทธิ์"}
                    {issueType == 4 && "อื่นๆ"}
                </p>
              <i className="fas fa-sort-down text-pink ml-2 mb-auto text-right blog-dropdown-pro-icon"></i>
          </div>
          
          <div className={classnames("blog-dropdown-pro dropdown-fill", { "d-none": !dropdownOpen })}>
              
              <a
                className={`dropdown-item ${
                  issueType == 1 ? " active" : ""
                }`}
                onClick={() => {
                  setissueType(1);
                  toggle()

                }}
              >
                มีปัญหาไม่สามารถอ่านได้
              </a>
              <a
                className={`dropdown-item ${
                  issueType == 2 ? " active" : ""
                }`}
                onClick={() => {
                  setissueType(2);
                  toggle()
                }}
              >
                มีเนื้อหาไม่เหมาะสม
              </a>
              <a
                className={`dropdown-item ${
                  issueType == 3 ? " active" : ""
                }`}
                onClick={() => {
                  setissueType(3);
                  toggle()
                }}
              >
                มีปัญหาเรื่องการละเมิดลิขสิทธิ์
              </a>
              <a
                className={`dropdown-item ${
                  issueType == 4 ? " active" : ""
                }`}
                onClick={() => {
                  setissueType(4);
                  toggle()
                }}
              >
                อื่นๆ
              </a>
          </div>
         </div> 
          <div className="w-100 pb-5 clearfix">
            <div className="info-creditcard-100 mt-3 mb-1">
              <input
                className="effect-16"
                id="reason"
                name="reason"
                type="text"
                placeholder=""
                required
              />
              <label>
                รายละเอียด<span>*</span>
              </label>
              <span className="focus-border"></span>
            </div>
          </div>
          <div className="d-flex pb-5">
            <div className=" w-50 mr-1 clearfix">
              <div className="info-creditcard-100 mt-3 mb-1">
                <input
                  className="effect-16"
                  id="name"
                  name="name"
                  type="text"
                  placeholder=""
                  required
                />
                <label>
                ชื่อ<span>*</span>
                </label>
                <span className="focus-border"></span>
              </div>
              
            </div>
            <div className=" w-50 ml-1 clearfix">
              <div className="info-creditcard-100 mt-3 mb-1">
                <input
                  className="effect-16"
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder=""
                  required
                />
                <label>
                เบอร์โทรของคุณ<span>*</span>
                </label>
                <span className="focus-border"></span>
              </div>
              
            </div>
          </div>
          <div className="w-100 pb-5 clearfix">
            <div className="info-creditcard-100 mt-3 mb-1">
              <input
                className="effect-16"
                id="email"
                name="email"
                type="text"
                placeholder=""
                required
              />
              <label>
              อีเมล<span>*</span>
              </label>
              <span className="focus-border"></span>
            </div>
          </div>
        </div>
       
        <div className="blog-proplem">
          <a className="blog-proplem-w" onClick={handleClose}><h4>ยกเลิก</h4></a><button className="blog-proplem-w blog-proplem-y" type="submit" ><h4>ส่งรายงานปัญหา</h4></button>
        </div>
        </form>
      </div>

      {/* <Modal centered show={show} onHide={handleClose} size={"lg"}>
        <form onSubmit={onissue} encType="multipart/form-data" ref={formEl2}>
          <div className="blog-problem-modal p-3">
            <div className="row">
              <div className="col-6">
                <h3>บอกปัญหาที่พบ</h3>
                <label>
                  ความคิดเห็นนี้มีปัญหาอะไร
                  <span className="text-pink">*</span>
                </label>
                <div className="styleSelect">
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn dropdown-toggle btn-fill"
                      data-toggle="dropdown"
                    >
                      {issueType == 1 && "มีปัญหาไม่สามารถอ่านได้"}
                      {issueType == 2 && "มีเนื้อหาไม่เหมาะสม"}
                      {issueType == 3 && "มีปัญหาเรื่องการละเมิดลิขสิทธิ์"}
                      {issueType == 4 && "อื่นๆ"}
                    </button>
                    <div className="dropdown-menu">
                      <a
                        className={`dropdown-item ${
                          issueType == 1 ? " active" : ""
                        }`}
                        onClick={() => {
                          setissueType(1);
                          toggle()
                        }}
                      >
                        มีปัญหาไม่สามารถอ่านได้
                      </a>
                      <a
                        className={`dropdown-item ${
                          issueType == 2 ? " active" : ""
                        }`}
                        onClick={() => {
                          setissueType(2);
                        }}
                      >
                        มีเนื้อหาไม่เหมาะสม
                      </a>
                      <a
                        className={`dropdown-item ${
                          issueType == 3 ? " active" : ""
                        }`}
                        onClick={() => {
                          setissueType(3);
                        }}
                      >
                        มีปัญหาเรื่องการละเมิดลิขสิทธิ์
                      </a>
                      <a
                        className={`dropdown-item ${
                          issueType == 4 ? " active" : ""
                        }`}
                        onClick={() => {
                          setissueType(4);
                        }}
                      >
                        อื่นๆ
                      </a>
                    </div>
                  </div>
                </div>
                {/* <input
      type="text"
      id="login"
      className="form-control"
      name="username"
      placeholder="asdasd"
      title="sdfdsf"
      required
    /> 
              </div>
              <div className="col-6"></div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <label>
                  รายละเอียด
                  <span className="text-pink">*</span>
                </label>
                <textarea
                  name="reason"
                  className="form-control"
                  placeholder="กรอกลายระเอียดและปัญหา"
                  rows="4"
                  required
                />
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-6">
                <label>
                  ชื่อ
                  <span className="text-pink">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="กรอกชื่อและนามสกุล"
                  // title="sdfdsf"
                  required
                />
              </div>
              <div className="col-6">
                <label>
                  อีเมล
                  <span className="text-pink">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  placeholder="กรอกอีเมล"
                  // title="sdfdsf"
                  required
                />
              </div>
              <div className="col-6 mt-3">
                <label>
                  เบอร์โทรของคุณ สำหรับสอบถามเพิ่มเติม
                  <span className="text-pink">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  placeholder="กรอกเบอร์โทรของคุณ"
                  // title="sdfdsf"
                  required
                />
              </div>
            </div>
            <div className="row mt-64px">
              <div className="col-12 d-flex justify-content-end">
                <button
                  className="btn btn-outline-primary mr-4"
                  type="button"
                  onClick={handleClose}
                >
                  ยกเลิก
                </button>
                <button className="btn btn-primary" type="submit">
                  ส่งรายงานปัญหา
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal> */}
    </div>
  );
}
