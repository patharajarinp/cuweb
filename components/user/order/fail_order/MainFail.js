import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Link, Router } from '../../../../utils/i18n';

const MainFail = (props) => {
  const { t } = props;
  const [order, setOrderID] = useState();
  const [loading, setLodding] = useState(false);
  const router = useRouter()
  const order_id = router.query.order_id;

  useEffect(() => {
    setOrderID(order_id);
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  const showOrder = () => {
    Router.push(`/user/order-detail/${order}`);
  }

  const gotohome = () => {
    Router.push('/');
  }

  
  return ( 
    <>
      <div>
        <div className="container pt-5">
          <div className="row justify-content-center">
            <div className="col-8">
              <div className="bg-white br-8 p-4">
                <div className="text-center py-4">
                  <div>
                    <img src="/images/not-cart.svg" alt="ศูนย์หนังสือจุฬาฯ" className="" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-pink">การชำระเงินผ่านบัตรเครดิต/เดบิต ไม่สำเร็จ</h3>
                    <p>กรุณาตรวจสอบความถูกต้องของข้อมูลบัตรเครดิตของคุณอีกครั้งก่อนชำระเงิน</p>
                  </div>

                  <div className="mt-5">
                    <Link href='/' as={'/'}>
                      <button type="button" className="btn btn-outline-primary mr-2" onClick={gotohome}>กลับหน้าหลัก</button>
                    </Link>
                    <Link href={`/user/order-tranfer/[order_id]?order_id=${order}`} as={`/user/order-tranfer/${order}`}>
                      <button type="button" className="btn btn-primary " >ชำระอีกครั้ง</button>
                    </Link>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="end-page"></div>
    </>
  )
}

export default MainFail