import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import tools from '../../utils/tools';
import { withTranslation, Link} from "../../utils/i18n";
import ConfirmDialog2 from '../ConfirmDialog'


const PackageHeader = ({pkg, index, length, t, fetchDetail, _dis}) => {
  const [modalShow2, setModalShow2] = useState(false);
  const handleModalClose2 = () => setModalShow2(false);

  const setDate = (date, days) => {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
  }
  
  const updatePackage = (pkg_id) => {
    event.preventDefault();
    api.confirmPackage({pkg_id})
    .then(res=>{
			const data = res.data;
			fetchDetail();
    })
    .catch(err => {
      console.log(err);
      console.log(err.response);
    })
	}
	
	const onConfirm2 = () => {
    var val = pkg && pkg.pkg_id;
    updatePackage(val);
  }

  // console.log(pkg);

  return (
   <>
   {
      pkg && (
        <>
          <div className="d-flex justify-content-between align-items-center header-detail">
            
            <p>
              <img src="/icon/icon-d-2.svg" className="mr-3 icon-package" />
              {t('package')} {index} {t('from')} {length}
            </p>
            {
              pkg.shop_name ? (
              <p>{t('vender')} : {pkg.shop_name}</p>
              ) : (
                <p>{t('vender')} : CHULABOOK</p>
              )
            }
            
          </div>
          {
					  pkg.status > 3 ? (
              <div className="pt-3 d-flex justify-content-between align-items-center header-detail">
                {
                  pkg.ship == 1 ? (
                    <p className="mb-0">
                      {pkg.company == "THAI_POST" || pkg.company == "HAPPY" ? t('shipping_normal') : t('shipping_express')} 
                      {t("date_range")} {tools.formatDate(setDate(pkg.pickup_date,1),true,false,true,false)} - {tools.formatDate(setDate(pkg.pickup_date,  pkg.shipping_type == 2 ? 5 : 9),true,false,true)}
                    </p>
                  ) : null
                }
                
                {
                  (pkg.status == 4 && !pkg.user_accept) && (
                    !_dis ? (
                      <a onClick={() => setModalShow2(true)}>
                        <button type="button" className="btn btn-primary ml-3">{t('confirm_product')}</button>
                      </a>
                    ) : (
                      <button type="button" className="btn btn-disabled ml-3" disabled>{t('confirm_product')}</button>
                    )
                    
                  )
                }
              </div>
            ) : ''
          }
          <ConfirmDialog2 show={modalShow2}
					text="ยืนยันได้รับสินค้าแล้ว ?"
					onConfirm={onConfirm2}
					size="md" onHide={handleModalClose2}
					cancel_btn={true} />
        </>
      )
    }
   </>
  )
}

export default PackageHeader