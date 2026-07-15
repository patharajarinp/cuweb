import React, { useState,useEffect } from 'react'
import { withTranslation, Link, Router} from "../../utils/i18n";
import tools from "../../utils/tools";
import api from "../../utils/api";
import classNames from 'classnames';
import PackageHeader from '../order_detail/PackageHeader'
import TrackingDetail from '../order_detail/TrackingDetail'
import ButtonGroup from '../order_detail/ButtonGroup'
import ProductList from '../order_detail/ProductList'

const MainDetail = ({index,length,package : pkg, fetchDetail, slips,t, order}) =>{
  const [clickBtn, setClickBtn] = useState(false);
  const [type, setType] = useState(0);
  const [selected, setSelected] = useState([]);
	
  const handleCancel = () => {
    setClickBtn(false);
    setType(0);
    setSelected([]);
  }

  const passData = () => {
    if(!pkg)  {
      return;
    }
    localStorage.setItem('package_return', JSON.stringify({type, items : selected}));
    Router.push(`/user/order_return_report/[pkg_id]?pkg_id=${pkg.pkg_id}`, `/user/order_return_report/${pkg.pkg_id}`);
  }

  const canReturn =()=>{
    if(!pkg) {
      return true;
    }
    if(!pkg.success_date) return false;
    let bool = false;

    
    let today = new Date()
    for(var i = 0; i < pkg.package_details.length; i++) {
      let can_return_date = new Date(pkg.success_date)
      can_return_date.setDate(can_return_date.getDate() + pkg.package_details[i].return_in_days)
      if(can_return_date > today && !pkg.package_details[i].change_qty && !pkg.package_details[i].return_qty ) bool = true;
      
    }
    return bool;
  }

  const canChange =()=>{
    if(!pkg) {
      return true;
    }
    if(!pkg.success_date) return false;
    let bool = false;

    
    let today = new Date()
    for(var i = 0; i < pkg.package_details.length; i++) {
      let can_change_date = new Date(pkg.success_date)
      can_change_date.setDate(can_change_date.getDate() + pkg.package_details[i].change_in_days)
      if(can_change_date > today && !pkg.package_details[i].change_qty && !pkg.package_details[i].return_qty ) bool = true;
      
    }
    return bool;
  }

  const isInPromotion =()=>{
    if(!pkg) {
      return false;
    }
    for(var i = 0; i < pkg.package_details.length; i++) {
      if(pkg.package_details[i].promotion_id) {
        return true;
      }
    }
    return false;
  }

  const canReturnChange = () => {
    if(!pkg) {
      return true;
    }

    // console.log('canReturn()',canReturn())
    // console.log('canChange()',canChange())
    return !isInPromotion() && (canReturn() || canChange())
  }

  // console.log('pkg', pkg);
	return (
		<div className="package mb-3">
			<div className="p-3">
				
				<PackageHeader index={index} pkg={pkg} length={length} t={t} fetchDetail={fetchDetail} _dis={clickBtn} />
				
			
        <TrackingDetail index={index} pkg={pkg} fetchDetail={fetchDetail} slips={slips} t={t} order={order} />

        <ButtonGroup pkg={pkg} t={t} setClickBtn={setClickBtn} setType={setType} type={type} _dis={!canReturnChange()} canReturn={canReturn()} canChange={canChange()} />
      </div>
      <div className="">
        {
          pkg ? pkg.package_details.map((val, index) => (
            <ProductList key={val.product.id} success_date={pkg.success_date} pkg={pkg} order={val} t={t} selected={selected} setSelected={setSelected} type={type} />
          )) : ''
        }
      </div>
      <div className="p-3">
        {
          type != 0 ? (
            <div className="text-center">
              
              <button type="button" className={`btn btn-outline-grey`} onClick={() => handleCancel()}>{t('btn_cancel')}</button>
              <button type="button" className={`btn btn-primary-orange ml-3`} disabled={!selected.length} onClick={() => passData()}>{t('btn_confirm')}</button>
            </div>
          ) : ''
        }
	    </div>
    </div>
	)
}
export default withTranslation(['order_detail'])(MainDetail)