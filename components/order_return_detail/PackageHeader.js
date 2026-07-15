import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import tools from '../../utils/tools';
import { withTranslation, Link} from "../../utils/i18n";
import ConfirmDialog from '../ConfirmDialog'

const PackageHeader = ({returns, t}) => {
  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);

  const setDate = (date, days) => {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
  }
  
  const updatePackage = (pkg_id) => {
    // event.preventDefault();
    // api.confirmPackage({pkg_id})
    // .then(res=>{
		// 	const data = res.data;
		// 	fetchDetail();
    // })
    // .catch(err => {
    //   console.log(err);
    //   console.log(err.response);
    // })
	}
	
	const onConfirm2 = () => {
    var val = pkg && pkg.pkg_id;
    updatePackage(val);
  }

  // console.log('returns   555555', returns);

  return (
   <>
   {
      returns && (
        <>
          <div className="d-flex justify-content-between align-items-center header-detail">
            {
              returns.seller ? (
              <p>{t('vender')} : {returns.seller.shop_name}</p>
              ) : (
                <p>{t('vender')} : CHULABOOK</p>
              )
            }
            <div>
              {`${t('Order:status')} : `}
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
              {returns.status == '51' && t('Order:return_status51')}
              {returns.status == '60' && t('Order:return_status60')}
              {returns.status >= '70' && t('Order:return_status70')}
            </div>
            {/* <a onClick={() => setModalShow(true)}>
              <button type="button" className="btn btn-primary ml-3">{t('confirm_product')}</button>
            </a> */}
          </div>
          <ConfirmDialog show={modalShow}
					text="ยืนยันได้รับสินค้าแล้ว ?"
					onConfirm={onConfirm2}
					size="md" onHide={handleModalClose}
					cancel_btn={true} />
        </>
      )
    }
   </>
  )
}

export default PackageHeader