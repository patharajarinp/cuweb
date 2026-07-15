import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import tools from '../../utils/tools';
import { withTranslation, Link} from "../../utils/i18n";
import ConfirmDialog from '../ConfirmDialog'

const PackageHeader = ({changes, t}) => {
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

  // console.log('changes   555555', changes);

  return (
   <>
   {
      changes && (
        <>
          <div className="d-flex justify-content-between align-items-center header-detail">
            {
              changes.seller ? (
              <p>{t('vender')} : {changes.seller.shop_name}</p>
              ) : (
                <p>{t('vender')} : CHULABOOK</p>
              )
            }
            <div>
              {`${t('Order:status')} : `}
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