import React, { useEffect, useState } from 'react';
import { Link, withTranslation } from '../../../../../utils/i18n';
import { useRouter } from 'next/router';

const MobileMainFail = (props) => {
  const {t} = props;
  const [order, setOrderID] = useState();
  const router = useRouter()
  const order_id = router.query.order_id;

  useEffect(() => {
    setOrderID(order_id);
  },[]);

  return ( 
    <>
      <div className="bg-light-less-gray">
        <div className="container bg-white ">
          <div className="d-flex align-items-center justify-content-center vh-100">
            <div>
              <div className="d-flex">
                <img className="img-fluid m-auto p-4 w-194px" src="/mobile/image/icon/not-cart.svg" />
              </div>
              <h2 className="text-pink text-center">การชำระเงินผ่านบัตรเครดิต/เดบิต ไม่สำเร็จ</h2>
              <p className="text-center">กรุณาตรวจสอบความถูกต้องของข้อมูลบัตรเครดิตของคุณอีกครั้งก่อนชำระเงิน</p>
            </div>
          </div>
        </div>

      </div>
      <div className="success-manu">
        <Link href='/'>
          <a className="btn-success-menu"><h4 className="text-black m-auto">กลับหน้าหลัก</h4></a>
        </Link>
        <Link href="/user/order#pending">
          <a className="btn-success-menu bg-pink"><h4 className="text-white m-auto">ชำระอีกครั้ง</h4></a>
        </Link>
      </div>
    </>
  )
}

export default MobileMainFail