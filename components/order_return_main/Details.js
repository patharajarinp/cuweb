import React,{useState} from 'react'
import classNames  from 'classnames';
import Product from './Product'

const PackagePage = ({t,type, returns}) => {
  if(!returns) return null;
  
  return (
    <>
      <div className="row mx-0 products d-flex align-items-center ">
        <div className="col-12 px-0">
          <div className="shop px-3 py-2">
            <div className="d-flex align-items-center">
              {
                returns.seller ? (
                  <>
                    <img src={returns.seller.picture ? returns.seller.picture : "/icon/cu-icon.svg"} className="shop-logo" />
                    <p className="mb-0 ml-3">{returns.seller.shop_name}</p>
                  </>
                ) : (
                  <>
                    <img src="/icon/cu-icon.svg" className="shop-logo" />
                    <p className="mb-0 ml-3">CHULABOOK</p>
                  </>
                )
              }
              
            </div>
            <div>
                {`${t('status')} : `}
                {returns.status == '00' && t('Order:return_status00')}
                {returns.status == '01' && t('Order:return_status01')}
                {returns.status == '02' && t('Order:return_status02')}
                {returns.status == '10' && t('Order:return_status10')}
                {returns.status == '20' && t('Order:return_status20')}
                {returns.status == '30' && t('Order:return_status30')}
                {(returns.status == '40' && returns.no_send_back == 0) && t('Order:return_status40')}
                {(returns.status == '40' && returns.no_send_back == 1) && t('Order:return_status41')}
                {returns.status == '42' && t('Order:return_status42')}
                {returns.status == '61' && t('Order:return_status61')}
                {returns.status == '50' && t('Order:return_status50')}
                {returns.status == '60' && t('Order:return_status60')}
                {returns.status >= '70' && t('Order:return_status70')}
            </div>
          </div>
        </div>
        {
          returns.detail.map((val, index) => (
            <Product product={val} t={t} key={index} />
          ))
        }
        
      </div>
    </>
  )
}
export default PackagePage
