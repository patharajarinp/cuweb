import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";

const HeaderOrdeChange = ({changes, t}) => {
  
  return (
    <>
      <div className="order-date">
        {t('change_id')} 
        <Link href={`/user/order-change/[id]?id=${changes.id}`} as={`/user/order-change/${changes.id}`}>
          <a> #{changes.id}</a>
        </Link>
        <br></br>
        {t('change_date')} {tools.formatDate(changes.createdAt)}
      </div>
    </>
  )
}

export default HeaderOrdeChange