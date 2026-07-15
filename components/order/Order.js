import React,{useState} from 'react'
import AuthService from '../../utils/AuthService'
import Link from 'next/link'
import classNames  from 'classnames';
import { withTranslation } from '../../utils/i18n'
import tools from '../../utils/tools'
import HeaderOrder from '../../components/order/HeaderOrder'
import Package from '../../components/order/Package'

const OrderShow = ({order, status, t,type}) => {
  if(!order) {
    return;
  }
  var sort = [];
  function sorting (arr){
    arr.sort((a,b) =>{
      const order = ['cu']
      const aIndex = order.indexOf(a.seller_id)!= -1 ? order.indexOf(a.seller_id) : 999;
      const bIndex = order.indexOf(b.seller_id)!= -1 ? order.indexOf(a.seller_id) : 999;
      return aIndex - bIndex;
    })
    return arr;
  }

  sort = sorting(order.packages);

  return (
    <>
      {
        order ? (
          <div className="order-products">
            <div className="d-flex justify-content-between align-items-center p-3 bg-new">
              <HeaderOrder order={order} t={t}/>
            </div>
            <div className="border-bottom"></div>
            <div>
              {
                sort.map((val, index) => (
                  <Package package={val} t={t} key={index} type={type} order={order} />
                ))
              }
              
            </div>
          </div>
        ) :  ''
      }
    </>
  )
}
export default withTranslation(['Order'])(OrderShow)