import React, { useState, useContext } from "react";
import classNames from "classnames";

import {Link} from "../../../utils/i18n";

const Nav = (props) => {
  const { status, page } = props;
  
  // console.log(_click);
  return (
    <>
      <div className="menu">
        <div className="icon">
          <img src="/icon/blog-be-book.svg" />
          <p className="mb-0 ml-3 text-disabled">จัดการงานเขียน</p>
        </div>
        <div className="no-icon">
          <div>
            <Link href={"/blog/writer/manage"}>
              <a className={classNames(page == "manage" ? "active blogs" : "")}>
                งานเขียนของฉัน
              </a>
            </Link>
          </div>
          <div>
            <Link href={"/blog/create"}>
              <a className={classNames(page == "order_cancel" ? "active blogs" : "")}>
                เพิ่มงานเขียนใหม่
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="menu mt-4">
        <div className="icon">
          <img src="/icon/blog-be-shop.svg" />
          <p className="mb-0 ml-3 text-disabled">จัดการข้อมูลนักเขียน</p>
        </div>
        <div className="no-icon">
          <div>
            <Link href={"/blog/writer/profile"}>
              <a
                className={classNames(
                  page == "product" || page == "edit-product" ? "active blogs" : ""
                )}
              >
                จัดการโปรไฟล์
              </a>
            </Link>
          </div>
        </div>
      </div>
          

    </>
  );
};

export default Nav;
