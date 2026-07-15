import React from "react";
import { Dropdown } from "react-bootstrap";
import { Link, withTranslation } from "../../../../utils/i18n";
import BtnDownloadPdf from '../detail/btnDownloadPdf'
function StoryDetail({ data1, blog_id, onFillterBy, orderb ,title,writer,t }) {
    const formatDate = (date) => {
        var d = new Date(date),
          month = "" + (d.getMonth() + 1),
          day = "" + d.getDate(),
          year = d.getFullYear();
    
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        var dataDate = [day, month, year + 543].join("-");
        return dataDate;
      };
      function formatNum (labelValue) {

        // Nine Zeroes for Billions
        return Math.abs(Number(labelValue)) >= 1.0e+9
      
        ? (Math.abs(Number(labelValue)) / 1.0e+9).toString().slice(0, 4) + "B"
        // Six Zeroes for Millions 
        : Math.abs(Number(labelValue)) >= 1.0e+6
      
        ? (Math.abs(Number(labelValue)) / 1.0e+6).toString().slice(0, 4) + "M"
        // Three Zeroes for Thousands
        : Math.abs(Number(labelValue)) >= 1.0e+3
      
        ? (Math.abs(Number(labelValue)) / 1.0e+3).toString().slice(0, 4) + "K"
      
        : Math.abs(Number(labelValue));
      
      }
  return (
    <div>
      <div className="blog-story-head p-3 d-flex">
        <p className="m-0 font-weight-600">{t('table_contents')}</p>{" "}
        <div className="blog-story-data-ep">{data1&&data1.length} {t('ep')}</div>
        <Dropdown className="blog-btn-dropdown blog-dropdown">
          <Dropdown.Toggle className="btn dropdown-toggle btn-fill blog-btn-dropdown">
            {orderb == "ASC" ? t('sort_asc') : t('sort_desc')}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <a
              className={`dropdown-item ${orderb == "ASC" ? " active" : ""}`}
              onClick={() => {
                onFillterBy("ASC");
              }}
            >
              {t('sort_asc')}
            </a>
            <a
              className={`dropdown-item ${orderb == "DESC" ? " active" : ""}`}
              onClick={() => {
                onFillterBy("DESC");
              }}
            >
              {t('sort_desc')}
            </a>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {data1 &&
        data1.length != 0 &&
        data1.map((val, index) => (
            <div key={val.id} className="d-flex align-items-center position-relative blog-border-bottom">
            <Link
            href={`/blog/[blogid]/[data_id]?data_id=${val.id}&blogid=${blog_id}`}
            as={`/blog/${blog_id}/${val.id}`}
          >
            <a>
              <div className="p-3 pb-1 blog-story-item">
                <p className="font-weight-600 mb-2">{val.index}.{val.title}</p>
                <div className="blog-data-grid">
                  <div className="d-flex align-items-center blog-data-col-1">
                    <img className="mr-2" src="/mobile/icon/blog/blog-icon-clock-g.svg" />
                    <p className="mb-0 mr-2">{formatDate(val.updatedAt)}</p>
                    <img className="mr-2" src="/mobile/icon/blog/blog-icon-eye-g-2.svg" />
                    <p className="mb-0 mr-2">{formatNum(val.blog_data_stat.viewed)}</p>
                    <img className="mr-2" src="/mobile/icon/blog/blog-icon-message-g.svg" />
                    <p className="mb-0 mr-2">{formatNum(val.blog_data_stat.comments)}</p>
                  </div>
                </div>
              </div>
            </a>
          </Link>
          <div className="blog-btn-download-pdf-div">
          <BtnDownloadPdf status={val.pdf_status} data={val} title={title} writer={writer} />
            
          </div>
        </div>))}
    </div>
  );
}
export default withTranslation('blog_data_table')(StoryDetail)