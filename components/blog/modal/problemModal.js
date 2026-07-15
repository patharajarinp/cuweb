import React,{useState,useRef} from "react";
import { Modal } from "react-bootstrap";
import api from "../../../utils/api";
import { alertFont } from "../AlertFont";
import { withTranslation } from "../../../utils/i18n";

function ProblemModal({ show, handleClose ,user, blog,group_id, data_id, commentId,type,t }) {
  const [issueType, setissueType] = useState(1)
  const formEl2 = useRef(null);

  const onissue = async(e)=>{
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
   await api.postIssue(data)
    .then(async (res) => {
      // console.log("res.data", res.data);
      alertFont("แจ้งปัญหาเรียบร้อยแล้ว")
      handleClose()
    })
    .catch((err) => {
      console.log(err.response);
    });
   
    
  }
  return (
    <div>
      
      <Modal centered show={show} onHide={handleClose} size={"lg"}>
      <form   onSubmit={onissue} encType="multipart/form-data"
          ref={formEl2}>
        <div className="blog-problem-modal p-3">
          <div className="row">
            <div className="col-8">
              <h3>{t('known_issues')}</h3>
              <label>
                {t('w_problem')}
                <span className="text-pink">*</span>
              </label>
              <div className="styleSelect">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn dropdown-toggle btn-fill"
                    data-toggle="dropdown"
                  >
                    {issueType == 1 && t('issue_type_1')}
                    {issueType == 2 && t('issue_type_2')}
                    {issueType == 3 && t('issue_type_3')}
                    {issueType == 4 && t('issue_type_4')}
                  </button>
                  <div className="dropdown-menu">
                    <a className={`dropdown-item ${issueType == 1 ? ' active': ''}`} onClick={()=>{setissueType(1); }}>{t('issue_type_1')}</a>
                    <a className={`dropdown-item ${issueType == 2 ? ' active': ''}`} onClick={()=>{setissueType(2); }}>{t('issue_type_2')}</a>
                    <a className={`dropdown-item ${issueType == 3 ? ' active': ''}`} onClick={()=>{setissueType(3); }}>
                      {t('issue_type_3')}
                    </a>
                    <a className={`dropdown-item ${issueType == 4 ? ' active': ''}`} onClick={()=>{setissueType(4); }}>{t('issue_type_4')}</a>
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
    /> */}
            </div>
            <div className="col-4"></div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <label>
                {t('details')}
                <span className="text-pink">*</span>
              </label>
              <textarea
                name="reason"
                className="form-control"
                placeholder={t('e_detail')}
                rows="4"
                required
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-6">
              <label>
                {t('name')}
                <span className="text-pink">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder={t('e_name')}
                // title="sdfdsf"
                required
              />
            </div>
            <div className="col-6">
              <label>
              {t('email')}
                <span className="text-pink">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="email"
                placeholder={t('e_email')}
                // title="sdfdsf"
                required
              />
            </div>
            <div className="col-6 mt-3">
              <label>
              {t('tel')}
                <span className="text-pink">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="phone"
                placeholder={t('e_phone')}
                // title="sdfdsf"
                required
              />
            </div>
          </div>
          <div className="row mt-64px">
            <div className="col-12 d-flex justify-content-end">
              <button className="btn btn-outline-primary mr-4" type="button" onClick={handleClose} >
              {t('cancel')}
              </button>
              <button className="btn btn-primary" type="submit">
              {t('sent')}
              </button>
            </div>
          </div>
        </div>
     </form> </Modal>
    </div>
  );
}
export default withTranslation("blog_modal")(ProblemModal);