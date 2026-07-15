import React,{useState} from 'react'
import classNames  from 'classnames';
import Product from './Product'

const PackagePage = ({t,type, changes}) => {
  if(!changes) return null;
  
  return (
    <>
      <div className="row mx-0 products d-flex align-items-center ">
        <div className="col-12 px-0">
          <div className="shop px-3 py-2">
            <div className="d-flex align-items-center">
              {
                changes.seller ? (
                  <>
                    <img src={changes.seller.picture ? changes.seller.picture : "/icon/cu-icon.svg"} className="shop-logo" />
                    <p className="mb-0 ml-3">{changes.seller.shop_name}</p>
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
                {changes.status == '00' && t('Order:change_status00')}
                {changes.status == '01' && t('Order:change_status01')}
                {changes.status == '02' && t('Order:change_status02')}
                {changes.status == '10' && t('Order:change_status10')}
                {changes.status == '20' && t('Order:change_status20')}
                {changes.status == '30' && t('Order:change_status30')}
                {(changes.status == '40' && changes.no_send_back == 0) && t('Order:change_status40')}
                {(changes.status == '40' && changes.no_send_back == 1) && t('Order:change_status41')}
                {changes.status == '41' && t('Order:change_status41')}
                {changes.status == '42' && t('Order:change_status42')}
                {changes.status == '43' && t('Order:change_status43')}
                {changes.status == '50' && t('Order:change_status50')}
                {changes.status == '51' && t('Order:change_status51')}
                {changes.status == '60' && t('Order:change_status60')}
                {changes.status == '61' && t('Order:change_status61')}
                {changes.status == '62' && t('Order:change_status62')}
                {changes.status >= '70' && t('Order:change_status70')}
            </div>
          </div>
        </div>
        {
          changes.detail.map((val, index) => (
            <Product product={val} t={t} key={index} />
          ))
        }
        
      </div>
    </>
  )
}
export default PackagePage
