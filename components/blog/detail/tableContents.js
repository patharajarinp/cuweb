import React from "react";
import { Link, withTranslation } from "../../../utils/i18n";
import { Carousel } from "react-bootstrap";
import BtnDownloadPdf from './btnDownloadPdf'
import tools from "../../../utils/tools";

const DataBanner = ({ blog_data_banners }) => {
  return (
    <>
      {blog_data_banners ? (
        <div className="blog-pages-detail-img-l-tableData">
          <div className="blog-pages-detail-img-m">
            <img className="blog-pages-detail-img-s" src={blog_data_banners.picture} />
          </div>
        </div>
      ) : (
        <div className="blog-pages-detail-img-l-tableData">
          <div className="blog-pages-detail-img-m">
            <img
              className="blog-pages-detail-img-s"
              src={"/icon/blog-icon-chapter.svg"}
            />
          </div>
        </div>
      )}
    </>
  );
};

function TableContents({
  head,
  data1,
  blogid,
  onDelete,
  page,
  blog_id,
  orderb,
  onFillterBy,
  t,title
  ,writer,updatePdf
}) {

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
  const chechstatus = (val) => {
    if (val.statusIn == 0) {
      return (
        <div className="blog-list-status-data-not pt-1 pb-1 pr-2 pl-2">
          ไม่เผยแพร่
        </div>
      );
    }
    if (val.statusIn == 1) {
      return (
        <div className="blog-list-status-data-pub pt-1 pb-1 pr-2 pl-2">
          เผยแพร่
        </div>
      );
    }
    if (val.statusIn == 2) {
      return (
        <div className="blog-list-status-data-up pt-1 pb-1 pr-2 pl-2">
          รออัพเดท
        </div>
      );
    }
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
      
      <div className="blog-table-contents">
        {head&&data1 ? (
          <div className="blog-table-contents-head">
            <div className="row">
              <div className="col-6">
                <div className="blog-table-contents-head-l">
                  <h4 className="m-0 mr-3">{t('table_contents')}</h4>
                  <div className="blog-table-contents-head-btn">
                    <span>{data1.length} {t('ep')}</span>
                  </div>
                </div>
              </div>
              <div className="col-6 align-self-center">
                <div className="pr-3">
                  <div className="text-right">
                    <label>{t('sort_by')} :</label>
                    <div className="d-inline-block ml-2">
                      <div className="btn-group w-100">
                        <button
                          type="button"
                          className="btn dropdown-toggle btn-fill"
                          data-toggle="dropdown"
                        >
                         {orderb == "ASC"?t('sort_asc'):t('sort_desc')} 
                        </button>
                        <div className="dropdown-menu">
                          <a className={`dropdown-item ${orderb == "ASC"?" active":""}`} onClick={()=>{onFillterBy("ASC")}} >{t('sort_asc')}</a>
                          <a className={`dropdown-item ${orderb == "DESC"?" active":""}`}  onClick={()=>{onFillterBy("DESC")}}>{t('sort_desc')}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div>
          <table className="blog-table-contents-table">
            <tbody>
              {page ? (
                <tr className="blog-table-contents-table-head">
                  <th className="text-center"></th>
                  <th>#</th>
                  <th>{t('ep_title')}</th>
                  <th  className="text-center ">
                    <img title="แก้ไข" alt="แก้ไข"   src="/icon/blog-icon-clock-w.svg" />
                    
                  </th>
                  <th  className="text-center">
                    <img title="ยอดวิว" alt="ยอดวิว"   src="/icon/blog-icon-eye-w.svg" />
                  </th>
                  <th className="text-center">
                    <img title="คอมเม้นท์" alt="คอมเม้นท์"  src="/icon/blog-icon-messege-w.svg" />
                  </th>
                  <th className="text-center">
                    <img title="ถูกใจ" alt="ถูกใจ" src="/icon/blog-icon-be.svg" />
                  </th>
                  <th className="text-center blod-md-d-none"></th>
                  <th className="text-center">
                    <img title="PDF" alt="PDF" src="/icon/blog-icon-be-pdf.svg" />
                  </th>
                </tr>
              ) : (
                <tr className="blog-table-contents-table-head">
                  <th>#</th>
                  <th>ชื่อตอน</th>
                  <th className="text-center ">
                    {/* <div className="blog-tooltip"> */}
                    <img title="แก้ไข" alt="แก้ไข"  src="/icon/blog-icon-clock-w.svg" />
                    {/* <span class="tooltiptext">แก้ไข</span> */}
                    {/* </div> */}
                  </th>
                  <th className="text-center">
                    <img title="ยอดวิว" alt="ยอดวิว"  src="/icon/blog-icon-eye-w.svg" />
                  </th>
                  <th className="text-center">
                    <img title="คอมเม้นท์" alt="คอมเม้นท์"  src="/icon/blog-icon-messege-w.svg" />
                  </th>
                  <th className="text-center">
                    <img  title="ถูกใจ" alt="ถูกใจ"  src="/icon/blog-icon-be.svg" />
                  </th>

                  <th className="text-center">
                    <img title="PDF" alt="PDF"  src="/icon/blog-icon-be-pdf.svg" />
                  </th>

                  <th className="text-center">สถานะ</th>
                  <th className="text-center">แก้ไข</th>
                  <th className="text-center"></th>
                </tr>
              )}
              {!page &&
                data1 &&
                data1.length != 0 &&
                data1.map((val, index) => (
                  <tr
                    key={val.item.id}
                    className="blog-table-contents-table-tr"
                  >
                    <td>{val.item.index}</td>
                    <td className="blog-table-contents-table-tr-name">
                      {val.item.title}
                    </td>
                    <td className="text-center">
                      {formatDate(val.item.updatedAt)}
                    </td>
                <td className="text-center">{val.stat?formatNum(val.stat.viewed):0}</td>
                    <td className="text-center">{val.stat?formatNum(val.stat.comments):0}</td>
                    <td className="text-center">{val.stat?formatNum(val.stat.liked):0}</td>

                    <td className="text-center" style={{width:'120px'}}>
                      {/* <img src="/icon/blog-icon-be2.svg" /> */}
                      {/* <div className="blog-table-contents-table-btn-not-download">
                           
                          </div> */}
                      {/* {val.item.pdf_status == 1 ? "เปิด" : "ปิด"} */}
                      <div className="blog-select-pdf">
                      <label className="switch">
                        <input type="checkbox" defaultChecked={val.item.pdf_status==1?true:false} onClick={()=>{if (val.item.pdf_status == 1) {
                            updatePdf(0,val.item.id)
                          } else {
                            updatePdf(1,val.item.id)
                          }}} />
                        <span className="slider round"></span>
                      </label>

                      {/* <select
                        name="pdf"
                        className={`form-control ${val.item.pdf_status==1?'blog-select-pdf-g':'blog-select-pdf-d'}`}
                        defaultValue={val.item.pdf_status}
                        onChange={()=>{
                          if (val.item.pdf_status == 1) {
                            updatePdf(0,val.item.id)
                          } else {
                            updatePdf(1,val.item.id)
                          }
                          
                        }}
                      >
                        <option value={1}  >เปิด</option>
                        <option value={0} >ปิด</option>
                      </select> */}
                      </div>
                    </td>

                    <td className="text-center">
                      {chechstatus(val)}
                      {/* รออัพเดท */}
                    </td>
                    <td className="text-center">
                      <Link href={`/blog/manage/[blog_id]/EP/[data_id]?data_id=${val.item.id}&blog_id=${blogid}`} as={`/blog/manage/${blogid}/EP/${val.item.id}`}>
                        <a>
                          <button
                            type="button"
                            className="blog-backen-manage-edit"
                          >
                            <img src="/icon/blog-be-icon-edit.svg" />
                          </button>
                        </a>
                      </Link>
                    </td>
                    <td className="text-center">
                      <div
                        className="blog-backen-manage-data-delete"
                        onClick={() => {
                          onDelete(val.item.index, val.item.id);
                        }}
                      >
                        <img src="/icon/blog-icon-be-delete.svg" width="30px" />
                      </div>
                    </td>
                  </tr>
                ))}
              {page &&
                data1 &&
                data1.length != 0 &&
                data1.map((val, index) => (
                  <tr key={val.id} className="blog-table-contents-table-tr">
                   
                    <td className="blog-table-contents-table-td-page">
                    <Link
                        href={`/blog/[blogid]/[data_id]?data_id=${val.id}&blogid=${blog_id}`}
                        as={`/blog/${blog_id}/${val.id}`}
                      >
                        <a>
                          <DataBanner blog_data_banners={val.blog_data_banner} />
                          </a>
                          </Link>
                      
                    </td>
                    <td>{val.index}</td>
                    <td className="blog-table-contents-table-tr-name">
                      <Link
                        href={`/blog/[blogid]/[data_id]?data_id=${val.id}&blogid=${blog_id}`}
                        as={`/blog/${blog_id}/${val.id}`}
                      >
                        <a className="text-black">
                          {val.title}
                        </a>
                      </Link>
                    </td>
                    <td className="text-center blog-table-contents-table-tr-date">{tools.formatDate(val.updatedAt, true, false, true)}</td>
                <td className="text-center">{formatNum(val.blog_data_stat.viewed)}</td>
                    <td className="text-center">{formatNum(val.blog_data_stat.comments)}</td>
                    <td className="text-center">{formatNum(val.blog_data_stat.liked)}</td>
                    <td className="text-center blod-md-d-none">
                      <Link
                        href={`/blog/[blogid]/[data_id]?data_id=${val.id}&blogid=${blog_id}`}
                        as={`/blog/${blog_id}/${val.id}`}
                      >
                        <a>
                          <div className="blog-btn-read">{t('read')}</div>
                        </a>
                      </Link>
                    </td>
                    <td className="text-center">
                      <BtnDownloadPdf status={val.pdf_status} data={val} title={title} writer={writer} />
                      
                    </td>
                  </tr>
                ))}
              {!page&&data1&&!data1.length && (
                <tr>
                  <td colSpan="10">
                    <div className="row mt-4">
                      <div className="col-12 ">
                        <h4 className="text-center">ไม่มีข้อมูล</h4>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {page&&data1&&!data1.length && (
                <tr>
                  <td colSpan="10">
                    <div className="row mt-4">
                      <div className="col-12 ">
                        <h4 className="text-center">ไม่มีข้อมูล</h4>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default withTranslation("blog_data_table")(TableContents);