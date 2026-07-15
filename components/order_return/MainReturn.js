import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";

const MainReturn = (props) => {
  const {_class, children, seller, type, picture} = props;
  

  return (
   <>
    <div className="border-detail mt-3">
      <div className="bg-profile bg-light-gray">
        <div className="mx-3">
          <img className="img-circle-card mr-2" src={seller != 'cu' ? seller.picture : "/icon/cu-icon.svg"} />
          <h5 className="p-14">{seller != 'cu' ? seller.shop_name : 'CHULABOOK'}</h5>
        </div>
      </div>
      <div>
        {children}
      </div>

    </div>
   </>
  )
}

export default MainReturn