import React,{useState} from 'react'
import { withTranslation } from '../../utils/i18n'
import HeaderOrder from './HeaderOrdeChange'
import Package from './Details'

const OrderShow = ({changes, status, t,type}) => {
  if(!changes) {
    return;
  }

  return (
    <>
      {
        changes ? (
          <div className="order-products">
            <div className="d-flex justify-content-between align-items-center p-3 bg-new">
              <HeaderOrder changes={changes} t={t}/>
            </div>
            <div className="border-bottom"></div>
            <div>
              {/* {
                changes.detail.map((val, index) => (
                  <Package package={val} t={t} key={index} type={type} changes={changes} />
                ))
              } */}
              <Package t={t} type={type} changes={changes} />
              
            </div>
          </div>
        ) :  ''
      }
    </>
  )
}
export default withTranslation(['Order'])(OrderShow)