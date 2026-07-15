import React, { useState } from 'react';
import api from '../../../utils/api';
import { withTranslation } from '../../../utils/i18n';
import ReturnProduct from "./return-product";
const CheckOrder = (props) => {
    const { status,t, pkg, fetchDetail,order_id, order } = props;
    const [returnP, setreturnP] = useState(true);
    const [type, setType] = useState(2)
    const OpenreturnP = () => setreturnP(!returnP);
    const updatePackage = () => {
        event.preventDefault();
        var r = confirm("คุณยืนยันที่จะลบข้อมูลนี้หรือไม่!!!");
        if (r == true) {
            api.confirmPackage({pkg_id : pkg.pkg_id})
            .then(res=>{
                const data = res.data;
                fetchDetail();
            })
            .catch(err => {
                console.log(err);
                console.log(err.response);
            })
        }
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
      if(can_return_date > today) bool = true;
      
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
      if(can_change_date > today) bool = true;
      
    }
    return bool;
  }
  const isReturningOrPromotion =()=>{
    if(!pkg) {
      return true;
    }
    for(var i = 0; i < pkg.package_details.length; i++) {
      if(!pkg.package_details[i].promotion_id && !pkg.package_details[i].return_qty && !pkg.package_details[i].change_qty) {
        return false;
      }
    }
    return true;
  }

  const canReturnChange = () => {
    if(!pkg) {
      return false;
    }
    return isReturningOrPromotion() && (canReturn() || canChange())
  }

    return ( 
             
        <>
        { status == 4 ?
            <div className="container my-4">
                <button className="btn btn-pink-submit h-auto minh-40px" type="button"  onClick={() => updatePackage()}><h4 className="text-white m-auto">{t("confirm_product")}</h4></button>
            </div> : (pkg && !canReturnChange())&&((pkg.status == 5 && !pkg.user_accept)&& !pkg.isOnlyEbook) ? <>
           
           {canChange() && <div className="container my-4"><button className="btn-none-width bg-white   align-items-center d-flex justify-content-center text-center btn-border-cu w-100" onClick={()=>{setType(2);OpenreturnP()}} >{t("mobile_Order:change_product")}</button> </div>}
            
            <ReturnProduct pkg={pkg} returnP={returnP} OpenreturnP={OpenreturnP} order_id={order_id} type={type} order={order}  />
            
            {canReturn() && <div className="container my-4"><button className="btn-none-width bg-white btn-primary  text-black align-items-center d-flex justify-content-center text-center  w-100" onClick={()=>{setType(1);OpenreturnP()}} >คืนสินค้า</button> </div>}

            </>:""}
        </>
    )
}
export default withTranslation('mobile_Order')(CheckOrder);