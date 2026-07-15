import React, { useEffect, useContext, useState } from "react";
import Layout from "../../../components/backend_blog/layout/Layout";
import Sidenav from "../../../components/backend_blog/layout/Sidenav";
import { Link } from "../../../utils/i18n";
import Paginate from "react-paginate";
import api from "../../../utils/api";
import UserContext from "../../../contexts/UserContext";
import ModalConfirmDialog from "../../../components/backend_blog/widget/ModalConfirmDialog";
import ModalConfirmDialog2 from "../../../components/backend_blog/widget/ModalConfirmDialog2";
import ModalDate from "../../../components/backend_blog/widget/ModalDate";
import Loading from "../../../components/loading";
export default function Manage() {
  const { user } = useContext(UserContext);
  const [blog, setblog] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [modalShow3, setModalShow3] = useState(false);
  const [modalShow4, setModalShow4] = useState(false);
  const [selectId, setselectId] = useState("");
  const [types, settype] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [checkId, setcheckId] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageNumber, setPagenumber] = useState(0);
  const [amount, setamount] = useState(0);
  const [type1, settype1] = useState("all");
  const [querys, setquerys] = useState("all");
  const [cate, setcate] = useState([]);
  const [selectCate, setselectCate] = useState("เลือกหมวดหมู่");
  const [selectCateId, setselectCateId] = useState(0);
  const [searchs, setsearchs] = useState("");
  const [load, setload] = useState(false);
  const [filter, setfilter] = useState(null);
  const LIMIT = 10;
  const fetchCate = async () => {
    api
      .getBlogCategory()
      .then(async (res) => {
        setcate(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const fetchBlog = async (params) => {
    params.query = params.query || querys;
    params.page = params.page || 1;

    params.cate = params.cate || params.cate==0 ? params.cate : selectCateId ;
    params.search = params.search || "";
    params.orderby = params.orderby || JSON.stringify(filter);

    setload(true);
    api
      .getBlog(user.blog_writer.id, { ...params })
      .then(async (res) => {
        const data = res.data;
        // console.log('object', data)
        setamount(data.count);
        setPageCount(Math.ceil(data.count / LIMIT));

        setblog(data.rows);
        setload(false);
        //  console.log("res.data", data[0].row);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const handlePageClick = (data) => {
    let selected = data.selected;
    setPagenumber(selected);
    window.scrollTo(0, 0);
    fetchBlog({ page: selected + 1 });
  };
  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      hour = "" + d.getHours(),
      minute = "" + d.getMinutes();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hour.length < 2) hour = "0" + hour;
    if (minute.length < 2) minute = "0" + minute;
    var dataDate = [day, month, year + 543].join("-");
    var dataTime = [hour, minute].join(":");
    var Tdate = dataDate + " " + dataTime;
    return Tdate;
  };
  useEffect(() => {
    fetchCate();
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#EEEEEE";
    }
  }, []);

  useEffect(() => {
    setload(true);
    if (user) {
      if (user.blog_writer) fetchBlog({});
    }
    // console.log('user', user)
    // fetchBlog();
  }, [user]);

  const isCheck = (index) => {
    // let index = findIndex(id)

    return !!blog[index].checked;
  };
  const updateStatusBlog = async () => {
    let id = selectId;
    let type = types;
    let check = checkId;
    let data;
    data = { id, type, check, writer_id: user.blog_writer.id };
    if (types == "publishTime") {
      data = {
        id,
        type,
        publish_timer: startDate,
        writer_id: user.blog_writer.id,
      };
    }
    //  console.log(data);
    // console.log('object', data)
    api
      .updateStatusBlog(data)
      .then(async (res) => {
        await fetchBlog({});
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const showstartDate = (e) => {
    var today = e._i;
    var data = e._d;
    // var da = setD(data);
    console.log("data", data);
    setStartDate(data);
  };
  const validStartDate = (current) => {
    //var getStart = startDate;
    let today = new Date();
    today.setDate(today.getDate() - 1)
    return current >= today;
  };

  const handleSelectChange = async (e, index) => {
    let checked = e.target.checked;
    let tmp = [...blog];
    tmp[index].checked = checked;
    setblog(tmp);
    let data = [...checkId];
    if (checked) {
      data.push({ id: tmp[index].id, index });
    } else {
      let in1 = data.filter((val) => val.id == tmp[index].id);
      
     let in2 =data.indexOf(in1[0])
    //  console.log(in2);
      data.splice(in2, 1);
    }

    setcheckId(data);
    // alert(checked)
  };
  const isCheckAll = () => {
    if (!blog) return false;

    for (let i = 0; i < blog.length; i++) {
      if (!blog[i].checked) return false;
    }
    return true;
  };
  const handleCheckAll = (e) => {
    let checked = e.target.checked;
    let tmp = [...blog];
    let data = [];
    tmp.forEach((val) => {
      val.checked = checked;
      data.push({ id: val.id });
    });
    setcheckId(data);
    if (checked) {
      setblog(tmp);
    } else {
      setcheckId([]);
    }
  };
  const checkStatus = (val) => {
    if (val.publish_status == 0 && val.publish_timer == null) {
      return (
        <div className="d-flex align-items-center ">
          <div className="btn-group mr-2 w-100">
            <button
              type="button"
              className="btn dropdown-toggle btn-fill blog-list-status-not "
              data-toggle="dropdown"
            >
              ไม่เผยแพร่
            </button>
            <div className="dropdown-menu">
              <a
                className="dropdown-item"
                onClick={() => {
                  setModalShow(true);
                  setselectId(val.id);
                  settype("publish");
                  setcheckId([]); 
                }}
              >
                เผยแพร่
              </a>
            </div>
          </div>
          <div
            className="blog-list-clock"
            onClick={() => {
              setModalShow2(true);
              settype("publishTime");
              setselectId(val.id);
              setcheckId([]);
            }}
          >
            <img title="ตั้งเวลา" alt="ตั้งเวลา" src="/icon/blog-icon-be-clock.svg" />
          </div>
        </div>
      );
    }
    if (val.publish_status == 1) {
      return (
        <div className="d-flex align-items-center">
          <div className="btn-group mr-2  w-100">
            <button
              type="button"
              className="btn dropdown-toggle btn-fill blog-list-status-P"
              data-toggle="dropdown"
            >
              เผยแพร่
            </button>
            <div className="dropdown-menu">
              <a
                className="dropdown-item"
                onClick={() => {
                  setModalShow(true);
                  setselectId(val.id);
                  settype("notPublish");
                  setcheckId([]);
                }}
              >
                ไม่เผยแพร่
              </a>
            </div>
          </div>
        </div>
      );
    }
    if (val.publish_status == 0 && val.publish_timer != null) {
      return (
        <div className="text-center">
          <div className="btn-group mr-2 mb-2  w-100">
            <button
              type="button"
              className="btn dropdown-toggle btn-fill blog-list-status-time"
              data-toggle="dropdown"
            >
              {formatDate(val.publish_timer)}
            </button>
            <div className="dropdown-menu">
              <a
                className="dropdown-item"
                onClick={() => {
                  setModalShow(true);
                  setselectId(val.id);
                  settype("notPublish");
                  setcheckId([]);
                }}
              >
                ไม่เผยแพร่
              </a>
              <a
                className="dropdown-item"
                onClick={() => {
                  setModalShow(true);
                  setselectId(val.id);
                  settype("publish");
                  setcheckId([]);
                }}
              >
                เผยแพร่
              </a>
            </div>
          </div>
          <a
            onClick={() => {
              setModalShow2(true);
              settype("publishTime");
              setselectId(val.id);
              setcheckId([]);
            }}
          >
            แก้ไขการตั้งเวลา
          </a>
        </div>
      );
    }
  };
  const handleFilter = (name) => {
    let tmp = { ...filter };
    if (name == "title") {
      tmp.name = name;
    }
    if (name == "cate") {
      tmp.name = name;
    }
    if (name == "viewed") {
      tmp.name = name;
    }
    if (name == "comment") {
      tmp.name = name;
    }
    if (name == "liked") {
      tmp.name = name;
    }

    if (tmp.value == "ASC") {
      tmp.value = "DESC";
    } else {
      tmp.value = "ASC";
    }
    fetchBlog({ orderby: JSON.stringify(tmp) });
    setfilter(tmp);
  };
  const status_writer = (val)=>{
    if (val == 0) {
      return <div className=" pt-1 pb-1 pr-3 pl-3">สถานะนักเขียน : <span className="text-light-grey">รอการอนุมัติ</span></div>
    }
    if (val == 1) {
      return <div className=" pt-1 pb-1 pr-3 pl-3">สถานะนักเขียน : <span className=" text-green">เปิดใช้งาน</span></div>
    }
    if (val == 2) {
      return <div className=" pt-1 pb-1 pr-3 pl-3">สถานะนักเขียน : <span className="text-danger">ถูกระงับ</span></div>
    }
  }
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
    <>
      {/* <button
           type="button"
          className="blog-detail-story-detail-card-btn-n pl-2 pr-2"
         >
          20-03-20 12:00
        </button> */}
        {load && <Loading />}
      <Layout title="Writer Manage" page_name="dashboard" isHome={true}>
        

        <Sidenav page="manage">
          <div className="blog-backen-manage">
            <div className="d-flex justify-content-between">
              <h3 className="mb-0 mr-3">จัดการงานเขียน</h3>
              {user&&user.blog_writer&&status_writer(user.blog_writer.status)}
              
            </div>
            

            <div className=" btn-group mt-3">
              <button
                type="button"
                className={`btn ${type1 == "all" ? " active" : ""}`}
                onClick={() => {
                  fetchBlog({ query: "all" });
                  settype1("all");
                  setquerys("all");
                  setsearchs("");
                }}
              >
                งานเขียนของฉัน
              </button>
              <button
                type="button"
                className={`btn ${type1 == "published" ? " active" : ""}`}
                onClick={() => {
                  fetchBlog({ query: "published" });
                  settype1("published");
                  setquerys("published");
                  setsearchs("");
                }}
              >
                เผยแพร่
              </button>
              <button
                type="button"
                className={`btn ${type1 == "published_time" ? " active" : ""}`}
                onClick={() => {
                  fetchBlog({ query: "published_time" });
                  settype1("published_time");
                  setquerys("published_time");
                  setsearchs("");
                }}
              >
                ตั้งเวลาล่วงหน้า
              </button>
            </div>
            <div className="row mt-3">
              <div className="col-4">
                <div className="input-group blog-backen-manage-search">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ค้นหางานเขียน"
                    value={searchs}
                    onChange={ (e) => {
                      var text = e.target.value;
                      setsearchs(text);
                    }}
                    onKeyDown={async(e)=>{
                      if (e.keyCode === 13) {
                        var text = e.target.value;
                        if (text == "") {
                          await fetchBlog({ search: "" });
                          // console.log("object", text);
                        }
                        setsearchs(text);
  
                        await fetchBlog({ search: text });
                      }
                    }}
                  />
                  <div className="input-group-append">
                    <button className="btn" type="submit">
                      <img src="/icon/blog-be-search.svg" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-8">
                <div className="d-flex justify-content-end align-items-center">
                  <label className="mr-2 mb-0">หมวดหมู่ : </label>

                  <div className="styleSelect blog-m-w">
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn dropdown-toggle btn-fill"
                        data-toggle="dropdown"
                      >
                        {selectCate}
                      </button>
                      <div className="dropdown-menu">
                        <a
                          className="dropdown-item "
                          onClick={() => {
                           setselectCateId(0) 
                           fetchBlog({ cate: 0 });
                            setselectCate("ทั้งหมด");
                            
                            setsearchs("");
                          }}
                        >
                          ทั้งหมด
                        </a>
                        {cate.length != 0 &&
                          cate.map((val, index) => (
                            <a
                              key={Math.random()}
                              className={`dropdown-item ${
                                selectCate == val.name_th && " active"
                              }`}
                              onClick={() => {
                                fetchBlog({ cate: val.id });
                                setselectCate(val.name_th);
                                setselectCateId(val.id)
                                setsearchs("");
                              }}
                            >
                              {val.name_th}
                            </a>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <h3 className="mb-0">{amount} งานเขียน</h3>
              </div>
              <div className="col-6">
                <div className="d-flex justify-content-end">
                  <Link href="/blog/create">
                    <a>
                      <button
                        className="blog-detail-story-detail-card-btn-n"
                        type="button"
                      >
                        + เพิ่มงานเขียน
                      </button>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="overflow-auto">
            <table className="seller-table table mt-3">
              <thead>
                <tr>
                  <th>
                    <div>
                      <div className="custom-control custom-checkbox w-0">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="ch-all"
                          value="1"
                          onChange={handleCheckAll}
                          checked={isCheckAll()}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="ch-all"
                        ></label>
                      </div>
                    </div>
                  </th>
                  <th>
                    <a
                      onClick={() => {
                        handleFilter("title");
                      }}
                    >
                      ชื่องานเขียน{" "}
                      {filter &&
                        filter.name == "title" &&
                        filter.value == "DESC" && (
                          <img src="/icon/blog-filter-list-up.svg" />
                        )}
                      {filter &&
                        filter.name == "title" &&
                        filter.value == "ASC" && (
                          <img src="/icon/blog-filter-list-dn.svg" />
                        )}
                      {filter && filter.name != "title" && (
                        <img src="/icon/blog-filter-list.svg" />
                      )}
                      {!filter && <img src="/icon/blog-filter-list.svg" />}
                    </a>
                  </th>
                  {/* <th className="text-center" style={{ width: "13%" }}>
                    <a
                      onClick={() => {
                        handleFilter("cate");
                      }}
                    >
                      หมวดหมู่{" "}
                      {filter &&
                        filter.name == "cate" &&
                        filter.value == "DESC" && (
                          <img src="/icon/blog-filter-list-up.svg" />
                        )}
                      {filter &&
                        filter.name == "cate" &&
                        filter.value == "ASC" && (
                          <img src="/icon/blog-filter-list-dn.svg" />
                        )}
                      {filter && filter.name != "cate" && (
                        <img src="/icon/blog-filter-list.svg" />
                      )}
                      {!filter && <img src="/icon/blog-filter-list.svg" />}
                    </a>
                  </th> */}
                  <th className="text-center" style={{ width: "10%" }}>
                    <a
                    className="d-flex justify-content-center"
                      onClick={() => {
                        handleFilter("viewed");
                      }}
                      title="ยอดวิว"
                    >
                      <img className="mr-2" src="/icon/blog-be-icon-eye.svg" />{" "}
                      {filter &&
                        filter.name == "viewed" &&
                        filter.value == "DESC" && (
                          <img src="/icon/blog-filter-list-up.svg" />
                        )}
                      {filter &&
                        filter.name == "viewed" &&
                        filter.value == "ASC" && (
                          <img src="/icon/blog-filter-list-dn.svg" />
                        )}
                      {filter && filter.name != "viewed" && (
                        <img src="/icon/blog-filter-list.svg" />
                      )}
                      {!filter && <img src="/icon/blog-filter-list.svg" />}
                    </a>
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    <a
                     className="d-flex justify-content-center"
                      onClick={() => {
                        handleFilter("comment");
                      }}
                      title="คอมเม้นท์"
                    >
                      <img className="mr-2" src="/icon/blog-be-icon-message.svg" />{" "}
                      {filter &&
                        filter.name == "comment" &&
                        filter.value == "DESC" && (
                          <img src="/icon/blog-filter-list-up.svg" />
                        )}
                      {filter &&
                        filter.name == "comment" &&
                        filter.value == "ASC" && (
                          <img src="/icon/blog-filter-list-dn.svg" />
                        )}
                      {filter && filter.name != "comment" && (
                        <img src="/icon/blog-filter-list.svg" />
                      )}
                      {!filter && <img src="/icon/blog-filter-list.svg" />}
                    </a>
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    <a
                     className="d-flex justify-content-center"
                      onClick={() => {
                        handleFilter("liked");
                      }}
                      title="ถูกใจ"
                    >
                      {" "}
                      <img className="mr-2" src="/icon/blog-be-icon-like.svg" />{" "}
                      {filter &&
                        filter.name == "liked" &&
                        filter.value == "DESC" && (
                          <img src="/icon/blog-filter-list-up.svg" />
                        )}
                      {filter &&
                        filter.name == "liked" &&
                        filter.value == "ASC" && (
                          <img src="/icon/blog-filter-list-dn.svg" />
                        )}
                      {filter && filter.name != "liked" && (
                        <img src="/icon/blog-filter-list.svg" />
                      )}
                      {!filter && <img src="/icon/blog-filter-list.svg" />}
                    </a>
                  </th>
                  <th className="text-center">แก้ไข</th>

                  <th className="text-center">สถานะบทความ</th>
                  <th className="text-center" style={{ width: "20%" }}>สถานะการอนุมัติ</th>
                </tr>
              </thead>
              <tbody>
                {blog.length != 0 &&
                  blog.map((val, index) => (
                    <tr key={val.id}>
                      <td>
                        <div>
                          <div className="custom-control custom-checkbox w-0">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              checked={isCheck(index)}
                              id={`ch-${val.id}`}
                              onChange={(e) => handleSelectChange(e, index)}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={`ch-${val.id}`}
                            ></label>
                          </div>
                        </div>
                      </td>
                      <td style={{ width: "45%" }}>
                        <div className="d-flex align-items-center">
                          <div className="box-book">
                            {val.blog_group_banners.length != 0 ? (
                              <img src={val.blog_group_banners[0].picture} />
                            ) : (
                              <img src="/icon/blog-icon-chapter.svg" />
                            )}
                          </div>
                          <div className="ml-4 w-100">
                            <p className="text-dark p-medium">{val.title}</p>
                          </div>
                        </div>
                      </td>
                      {/* <td>
                        <p className="text-dark p-medium text-center">
                          {val.blog_category.name_th}
                        </p>
                      </td> */}
                      <td>
                        <p className="text-dark p-medium text-center">
                          {formatNum(val.blog_group_stat.viewed)}
                        </p>
                      </td>
                      <td>
                        <p className="text-dark p-medium text-center">
                          {formatNum(val.blog_group_stat.comments)}
                        </p>
                      </td>
                      <td>
                        <p className="text-dark p-medium text-center">
                          {formatNum(val.blog_group_stat.liked)}
                        </p>
                      </td>
                      <td>
                        <Link
                          href={`/blog/manage/[blog_id]?blog_id=${val.id}`}
                          as={`/blog/manage/${val.id}`}
                        >
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
                      <td>{checkStatus(val)}</td>
                      <td className="text-center">
                         {
                            val.status_approve && 
                            val.status_approve == 2 ? <span className="status0">รอกการอนุมัติ</span> 
                            :(  val.status_approve == 1 ?<span className="status1">เปิดใช้งาน</span>
                            :(  val.status_approve == 0 ?<span className="status2">ระงับบทความ</span> : null)
                                  
                        )}
                      </td>
                    </tr>
                  ))}
                {blog.length == 0 && (
                  <tr>
                    <td colSpan="8">
                      <div className="row mt-4">
                        <div className="col-12 ">
                          <h4 className="text-center">ไม่มีงานเขียน</h4>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
           </div>
           
            {pageCount > 1 &&
            <div className="d-flex justify-content-end">
              <Paginate
                previousLabel={"ก่อนหน้า"}
                nextLabel={"ถัดไป"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                forcePage={pageNumber}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </div>}
            <div className="row">
              <div className="col-4">
                <div className="d-flex">
                  <div className="custom-control custom-checkbox w-0">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="ch-alll"
                      value="1"
                      onChange={handleCheckAll}
                      checked={isCheckAll()}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="ch-alll"
                    ></label>
                  </div>
                  <span className="ml-4 pt-1">เลือกทั้งหมด</span>
                </div>
              </div>
              
              <div className="col-8 justify-content-end d-flex align-items-center ">
                {checkId.length != 0&&<>
                <span>เลือก {checkId.length} บทความ</span>
                <button
                  type="button"
                  className="blog-detail-story-detail-card-btn-b ml-4 w-25"
                  disabled={checkId.length != 0 ? false : true}
                  onClick={() => {
                    if (checkId.length != 0) setModalShow3(true);
                    settype("delete");
                    setselectId("");
                  }}
                >
                  ลบ
                </button>
                <button
                  type="button"
                  className="blog-detail-story-detail-card-btn-b mr-0"
                  disabled={checkId.length != 0 ? false : true}
                  onClick={() => {
                    if (checkId.length != 0) setModalShow(true);
                    setselectId("");
                    settype("notPublish");
                  }}
                >
                  ไม่เผยแพร่
                </button></>}
              </div>
            </div>
          </div>
          <ModalDate
            show={modalShow2}
            size="md"
            cancel_btn={true}
            onConfirm={() => updateStatusBlog()}
            onHide={() => setModalShow2(false)}
            startDate={startDate}
            validStartDate={validStartDate}
            showstartDate={showstartDate}
          />
          <ModalConfirmDialog
            show={modalShow}
            text="ยืนยันการเปลี่ยนสถานะงานเขียน หรือไม่?"
            size="md"
            cancel_btn={true}
            onConfirm={() => updateStatusBlog()}
            onHide={() => setModalShow(false)}
          />
          <ModalConfirmDialog
            show={modalShow3}
            text="ยืนยันการลบงานเขียน หรือไม่?"
            size="md"
            cancel_btn={true}
            onConfirm={() => updateStatusBlog()}
            onHide={() => setModalShow3(false)}
          />
          <ModalConfirmDialog2
            show={modalShow4}
            text="บทความของคุณถูกระงับ กรุณาติดต่อเจ้าหน้าที่ศูนย์หนังสือจุฬาฯ"
            size="md"
           
            onHide={() => setModalShow4(false)}
          />
        </Sidenav>
      </Layout>
    </>
  );
}
