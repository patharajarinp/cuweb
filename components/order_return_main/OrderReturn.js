import React,{useState} from 'react'
import { withTranslation } from '../../utils/i18n'
import HeaderOrder from './HeaderOrdeReturn'
import Package from './Details'

const OrderShow = ({returns, status, t,type}) => {
  if(!returns) {
    return;
  }

  return (
    <>
      {
        returns ? (
          <div className="order-products">
            <div className="d-flex justify-content-between align-items-center p-3 bg-new">
              <HeaderOrder returns={returns} t={t}/>
            </div>
            <div className="border-bottom"></div>
            <div>
              {/* {
                returns.detail.map((val, index) => (
                  <Package package={val} t={t} key={index} type={type} returns={returns} />
                ))
              } */}
              <Package t={t} type={type} returns={returns} />
              
            </div>
          </div>
        ) :  ''
      }
    </>
  )
}
export default withTranslation(['Order'])(OrderShow)