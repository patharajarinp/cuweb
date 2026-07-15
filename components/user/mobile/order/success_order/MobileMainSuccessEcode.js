import React, { useEffect, useState } from 'react';
import { Link, withTranslation } from '../../../../../utils/i18n';
import { useRouter } from 'next/router';
import api from '../../../../../utils/api';
const MobileMainSuccessEcode = (props) => {
 const { t } = props;
 const [order, setOrderID] = useState();
 const router = useRouter()
 const order_id = router.query.order_id;
 const [project_id, setProjectId] = useState(null);
 useEffect(() => {
  setOrderID(order_id);
  getOrderEcodeById();
 }, []);
 const getOrderEcodeById = async () => {
  await api.getOrderEcode(order_id)
   .then((res) => {
    let order = res.data;
    if (order.detail && order.detail.length > 0) {
     if (order.detail[0].product.project.project_id) {
      setProjectId(order.detail[0].product.project.project_id);
     }
    }
   })
   .catch((err) => {
    console.log(err.response);
   });
 }

 return (
  <>
   <div className="cart-nav">
    <div className=" text-center cart-nav-title">
     <h4>{t("order_successful")}</h4>
    </div>
   </div>
   <div className="status-payment">
    <div className="status-payment-line-area container">
     <div className="status-payment-line"></div>
     <div className="status-payment-success-state circle-left"></div>
     <div className="status-payment-success-state circle-center"></div>
     <div className="status-payment-success-state circle-right"></div>
    </div>
   </div>
   <div className="bg-light-less-gray">
    <div className="h-120px"></div>
    <div className="container bg-white ">
     <div className="d-flex w-100 pt-50px">
      <img className="img-fluid m-auto p-4 w-194px" src="/mobile/image/banner/success-payment.png" />
     </div>

     <h2 className="text-pink text-center">{t("order_successful")}<br />
      {t("thank_you")}</h2>
     <p className="text-black text-center">{t("order_id")} {order}</p>
     <p className="text-black text-center">กรุณาตรวจสอบ E-mail ของท่าน</p>
     <p className="text-black text-center">เพื่อรับรหัส <b>E-CODE</b> พร้อมคู่มือการเข้าใช้งาน</p>
     <div className="footer-space"></div>
    </div>

   </div>
   <div className="success-manu">
    <Link href={`/user/order-detail/[order_id]?order_id=${order}`} as={`/user/order-detail/${order}`}>
     <a className="btn-success-menu"><h4 className="text-black m-auto">{t("view_order")}</h4></a>
    </Link>
    <Link href={`/ecode/${project_id}`} as={`/ecode/${project_id}`}>
     <a className="btn-success-menu bg-pink"><h4 className="text-white m-auto">{t("shop_now")}</h4></a>
    </Link>
   </div>
  </>
 )
}

export default MobileMainSuccessEcode