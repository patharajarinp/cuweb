import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";

const Submenu = ({count, status, t}) => {
  

  const clickLink = (status) => {
    if(status) {
      // Router.push('/user/order?status=' + status);
      if(status == 2) status = [2,3]
      Router.push({pathname:'/user/order',query:{status}})
    }else{
      Router.push('/user/order');
    }
    
  }
  //console.log('count',count)
  const _status = Array.isArray(status) ? 2 : status
  return (
   <>
    <button className={classNames('btn-order', _status == null ? 'active' : '')} onClick={()=> clickLink(null)}>{t("all")} {count ? `(${count.status_all})` : ''}</button>
    <button className={classNames('btn-order', _status == '1' ? 'active' : '')} onClick={()=> clickLink('1')}>{t("waiting_payment")} {count ? `(${count.status1})` : ''}</button>
    <button className={classNames('btn-order', _status == '2' ? 'active' : '')} onClick={()=> clickLink('2')}>{t("to_ship")} {count ? `(${count.status23 })` : ''}</button>
    <button className={classNames('btn-order', _status == '4' ? 'active' : '')} onClick={()=> clickLink('4')}>{t("to_receive")} {count ? `(${count.status4})` : ''}</button>
    <button className={classNames('btn-order', _status == '5' ? 'active' : '')} onClick={()=> clickLink('5')}>{t("success")} {count ? `(${count.status5})` : ''}</button>
   </>
  )
}

export default Submenu