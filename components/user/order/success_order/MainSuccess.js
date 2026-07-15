import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Link, Router } from '../../../../utils/i18n';

const MainSuccess = (props) => {
  const { t } = props;
  const [order, setOrderID] = useState();
  const [loading, setLodding] = useState(false);
  const router = useRouter()
  const order_id = router.query.order_id;

  useEffect(() => {
    setOrderID(order_id);
    if (document.getElementsByClassName('main-layout')[0]) {
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }

  }, []);



  return (
    <>
      <div>
        <div className="container pt-5">
          <div className="row justify-content-center">
            <div className="col-6">
              <div className="bg-white br-8 p-4">
                <div className="text-center py-4">
                  <div>
                    <img src="/images/success-order.png" alt="" className="" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-pink">การสั่งซื้อสำเร็จ ขอบคุณที่ใช้บริการ</h3>
                  </div>
                  <div className="mt-4">
                    <p>หมายเลขคำสั่งซื้อ {order} ของท่าน</p>
                  </div>
                  <div className="mt-5">
                    <Link href={`/user/order-detail/[order_id]?order_id=${order}`} as={`/user/order-detail/${order}`}>
                      <a>
                        <button type="button" className="btn btn-outline-primary mr-3">ดูคำสั่งซื้อ</button>
                      </a>
                    </Link>
                    <Link href='/' as={'/'}>
                      <a>
                        <button type="button" className="btn btn-primary">ช้อปต่อ</button>
                      </a>
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

export default MainSuccess