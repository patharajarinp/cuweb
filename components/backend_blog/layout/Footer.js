import React, { useState, useContext } from 'react'
import classNames  from 'classnames';
  
const Footer = (props) => {
  const {_name} = props;
  return (
    <>
      <div className="footer box-shadow-top">
        <div className="col-3 px-0">
          <p className="p-medium">ติดต่อเรา : 02-255-4433</p>
        </div>
        <div className="col-6 px-0">
          <div className="text-center">
            <p className="p-medium">Copyright © 2020 chulabook.com  All Rights Reserved.Design By DEGITO</p>
          </div>
        </div>
        <div className="col-3 px-0"></div>
      </div>
    </>
  )
}

export default Footer