import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";

const HeaderOrderReturn = ({returns, t}) => {
  
  return (
    <>
      <div className="order-date">
        {t('return_id')} 
        <Link href={`/user/order-return/[id]?id=${returns.id}`} as={`/user/order-return/${returns.id}`}>
          <a> #{returns.id}</a>
        </Link>
        <br></br>
        {t('return_date')} {tools.formatDate(returns.createdAt)}
      </div>
    </>
  )
}

export default HeaderOrderReturn