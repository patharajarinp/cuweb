import React, { useState, useEffect, useContext } from "react";
import classNames from "classnames";

import AuthService from "../../../utils/AuthService";
import api from "../../../utils/api";
import UserContext from "../../../contexts/UserContext";
import { Dropdown } from "react-bootstrap";
import Router from "next/router";
import NotiItem from '../../../components/backend_blog/widget/NotiItem';
import { Link } from "../../../utils/i18n";
import Loading from "../../loading";
const Header = (props) => {
  const { user, setUser ,onSocket } = useContext(UserContext);
  const { _name, isHome, isLoggin, page_name, isSubmenu,page_name2 ,page_link,blogRegis} = props;
  const [toggleNoti, setToggleNoti] = useState(false);
  const [load, setLoad] = useState(true)
  const logout = () => {
    AuthService.logout();
    window.location.href = "/login";
  };

  const checkPublic = () => {
    if (!user) return;
    if (!user.active_shipping || !user.active_product || !user.picture) {
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
   
    if(AuthService.isLoggin() == null){
     
      Router.push('/login')
    }
    
  }, []);
  useEffect(() => user && onSocket(user.id, eventSuccess, 'noti'), [user])

	const eventSuccess = (data, res) => {
		// console.log('data',data)
		var temp = {...user};
		if(temp.notifications.findIndex(val => val.id == data.id) === -1){
			temp.unread++;
			temp.notifications = [data, ...user.notifications];
			setUser(temp)
		}
		
		// console.log(res, 'test')
	}
  const actionToggleNoti = (status) => {
		if (!user)
			return;

		setToggleNoti(status)

		if (user.unread == 0 || !status) {
			return;
		}
		var temp = user;
		temp.unread = 0;
		setUser(temp)

		api.readAll(user.id)


	}
  useEffect(() => {
    setLoad(true)
    if (user) {
      if (!user.blog_writer) Router.push('/blog/writer/register')
      else if (user.blog_writer.status == 2 ) Router.push('/blog')
      setLoad(false)
    }
  }, [user]);
  return (
    <>
    {load?<Loading />:
      <div id="blog-backend" className="navbar-main box-shadow">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-12">
              <div className="nav-content d-flex">
                <div className="d-flex align-items-center">
                  {isLoggin ? (
                    <div className="py-1">
                      <img src={`${api.frontend_url}/icon/blog-icon-logo.svg`} alt="ศูนย์หนังสือจุฬาฯ" />
                    </div>
                  ) : isHome ? (
                    <Link href={`/blog/writer/manage`}>
                      <a>
                        <div className="py-1">
                          <img src={`${api.frontend_url}/icon/blog-icon-logo.svg`} alt="ศูนย์หนังสือจุฬาฯ" />
                        </div>
                      </a>
                    </Link>
                  ) : (
                    <>
                      <div className="mr-4">
                        <Link href={`/blog/writer/manage`}>
                          <a>
                            <img src={`${api.frontend_url}/images/blog-be-logo.jpg`} alt="ศูนย์หนังสือจุฬาฯ" />
                          </a>
                        </Link>
                      </div>
                      <div className="top-breadcrumb">
                        <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                              <Link href={`/blog/writer/manage`}>
                                <a>หน้าหลัก</a>
                              </Link>
                            </li>
                            <li className="breadcrumb-item">
                              <Link href={`/blog/writer/manage`}>
                                <a>งานเขียนของฉัน</a>
                              </Link>
                            </li>
                            <li
                              className={classNames(
                                "breadcrumb-item ",
                                !isSubmenu ? "active" : ""
                              )}
                            >
                              {page_name == "create" && (
                                <Link href={`/blog/create`}>
                                  <a>เพิ่มงานเขียน</a>
                                </Link>
                              )}
                              {page_name != "create" && (
                                <Link href={`/blog/manage/[blog_id]?blog_id=${page_link}`} as={`/blog/manage/${page_link}`}>
                                  <a>{page_name}</a>
                                </Link>
                              )}
                            </li>
                            {isSubmenu && (
                              <li
                                className={classNames("breadcrumb-item active")}
                              >
                                {page_name2 == "episode" && <a>เพิ่มตอนต่อไป</a>}
                                {page_name2 != "episode" && <a>{page_name2}</a>}
                              </li>

                            
                         )}
                          </ol>
                        </nav>
                      </div>
                    </>
                  )}
                </div>
                {!isLoggin && user &&!blogRegis&& (
                  <div className="d-flex align-items-center">
                     <button type="button" className="blog-detail-story-detail-card-btn-b" onClick={()=>{window.open("/blog")}} >หน้าเว็บบล็อก</button>
                    <div className="position-relative px-3 float-right d-flex ">
                    {/* <div className="mr-4 pr-4 border-right">
                      <img src={`${api.frontend_url}/icon/bell1.svg`} alt="ศูนย์หนังสือจุฬาฯ" />
                    </div> */}
                          <a className="mr-4 pr-4 border-right" onClick={() => { actionToggleNoti(!toggleNoti) }}>
															<div className="popup-container-count">
																<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/bell1.svg`} className="w-auto icon-header" />
																{user && user.unread > 0 && (<span>{user.unread}</span>)}
															</div>
														</a> 
											<div className={classNames('blog popup-container notification', { 'd-none': !toggleNoti })}>
												<div className="popup-container-list">
													{
														user ? user.notifications.map((item) => (<NotiItem key={Math.random()} item={item} user={user} />)) : ''
													}
												</div>
                        {
													user && user.notifications.length ? (
														<div className="popup-container-footer">
                              
                                <a href={'/user/notification'}>
                                  <button type="button" className="btn btn-primary w-100">ดูทั้งหมด</button>
                                </a>
                              
                            </div>
													) : ('')
												}
												
											</div>
                      </div>
                    <div className="btn-group btn-profile">
                      <Dropdown >
                        <Dropdown.Toggle id="dropdown-basic">
                          <div className={`text-default d-flex`}>
                            <div className="position-relative public-shop">
                              <img
                                src={
                                  user.picture
                                    ? user.picture
                                    : `${api.frontend_url}/images/no-picture.png`
                                }
                                className="icon-header-user logo"
                                alt="ศูนย์หนังสือจุฬาฯ"
                              />
                              {/* {checkPublic() ? (
                                <span className="shop-online"></span>
                              ) : (
                                <span className="shop-offline"></span>
                              )} */}
                            </div>
                            <h5 className=" align-self-center ellipsis ml-3">{`${user.firstname} ${user.lastname}`}</h5>
                            <img className="ml-2" src={`${api.frontend_url}/icon/arrow-down.svg`} alt="ศูนย์หนังสือจุฬาฯ" />
                          </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu  >
                          {/* <Link href={`/profile`} as={`/profile`}>
                            <a
                              className={classNames(
                                page_name == "profile" ? "active" : ""
                              )}
                            >
                              <Dropdown>ประวัติส่วนตัว</Dropdown>
                            </a>
                          </Link>
                          <Link href={`/`} as={`/`}>
                            <a>
                              <Dropdown>สมุดที่อยู่</Dropdown>
                            </a>
                          </Link>*/}
                          {/* <Link href={`/`} as={`/`}>
                            <a>
                              <Dropdown>จัดการโปรไฟล์นักเขียน</Dropdown>
                            </a>
                          </Link>  */}
                          <Link href={'/blog/writer/edit-profile'}>
																<a style={{width:'200px'}} className="text-default d-block px-2">
																	<img src="/icon/icon-user.svg" /> จัดการบัญชีของฉัน
																</a>
															</Link>
                          <a style={{width:'200px'}} className="text-default d-block px-2" onClick={logout}>
                            <img src="/icon/icon-logout.svg" /> ออกจากระบบ
                          </a>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  </>
  );
};

export default Header;
