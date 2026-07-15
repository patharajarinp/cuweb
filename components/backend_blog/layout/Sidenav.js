import React, { useState,useEffect,useContext,useRef } from 'react'
import SideNav, { NavIcon, NavItem, NavText } from '@trendmicro/react-sidenav';
import classNames  from 'classnames';
import Router from 'next/router';
import { Link } from "../../../utils/i18n";
import UserContext from '../../../contexts/UserContext'
import Nav from '../widget/Nav'

const Sidenav1 = (props) => {
  const {page, children} = props;
  const {user, setUser} = useContext(UserContext)
  const [expanded,onToggle] = useState(false);
  const [selected,onSelect] = useState(false);
  return (
    <>
      {
        user && (
          <div className="container-fluid px-0">
            <div className="row justify-content-center mx-0">
              {
                (user.blog_writer) ? (
                  <>
                  <div className="col-xl-3 col-12 pr-0 d-none d-xl-block" >
                    <div className="box-seller-nav bg-white">
                      <Nav page={page} />
                    </div>
                  </div>
                  <div className="col-lg-2 d-none  d-xl-none d-block">
                    <SideNav expanded={expanded} onSelect={onSelect} onToggle={onToggle}>
                      <SideNav.Toggle />
                  
                        <SideNav.Nav defaultSelected="home" selected={selected}>
                        
                            <NavItem eventKey="products" className="page">
                              <NavIcon>
                              <img className='m-0' src="/icon/blog-be-book.svg" />

                              </NavIcon>
                              <NavText>
                              จัดการงานเขียน
                              </NavText>
                              <NavItem eventKey="products/book" className="subpage">
                                <NavText>
                                <Link href={"/blog/writer/manage"}>
                                  <a className={classNames(page == "manage" ? "active" : "")}>
                                    งานเขียนของฉัน
                                  </a>
                                </Link>
                                </NavText>
                              </NavItem>
                              <NavItem eventKey="products/stationeries">
                                <NavText>
                                <Link href={"/blog/create"} as={"/blog/create"}>
                                  <a className={classNames(page == "order_cancel" ? "active" : "")}>
                                    เพิ่มงานเขียนใหม่
                                  </a>
                                </Link>
                                </NavText>
                              </NavItem>
                            </NavItem>
                            <NavItem eventKey="writer" className="page">
                              <NavIcon>
                              <img className='m-0' src="/icon/blog-be-shop.svg" />

                              </NavIcon>
                              <NavText>
                              จัดการข้อมูลนักเขียน
                              </NavText>
                              <NavItem eventKey="writer/book" className="subpage">
                                <NavText>
                                <Link href={"/blog/writer/profile"} as={"/blog/writer/profile"}>
                                  <a
                                    className={classNames(
                                      page == "product" || page == "edit-product" ? "active" : ""
                                    )}
                                  >
                                    จัดการโปรไฟล์
                                  </a>
                                </Link>
                                </NavText>
                              </NavItem>
                            </NavItem>
                        </SideNav.Nav>
                    </SideNav>
                  </div>
  
                  </>
                ) : (
                  ''
                )
              }
              <div className="col-xl-9 col-12 px-0">
                <div className="">
                  <div className="blog-backen-manage--">
                    {children}
                  </div>
                  <div className="end-page"></div>
                </div>
              </div>
            </div>
          </div>
        )
      }
          </>
  )
}

export default Sidenav1