import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import ChoosePaymentthis from '../../../../../components/mobile/summary/choose-payment';
import UserContext from '../../../../../contexts/UserContext';
import api from '../../../../../utils/api';
import { Link, withTranslation } from '../../../../../utils/i18n';
import tools from '../../../../../utils/tools';

const MobileMainOrderTransfer = (props) => {
  const { t } = props;

  const { user, fetchUser, local, setLocal, setUser } = useContext(UserContext)

  const [cartDetail, setCartDetail] = useState(null);
  const [calDetail, setCalDetail] = useState(null);
  const [pointState, setPointState] = useState(0);
  const [promotion, setPromotion] = useState();
  const [paymentType, setPaymentType] = useState(0);
  const toggleshowDetail = () => setShowDeatail(!showDetail);
  const [showDetail, setShowDeatail] = useState(false);

  const router = useRouter();
  const order_id = router.query.order_id;

  const fetchOrder = () => {
    api.getOrderDetail(order_id).then(res => {
      const data = res.data;
      console.log(data, 'eeee');
      setCartDetail(data)
      setCalDetail({ weight: data.total_weight, net_price: data.total_price })
    })
      .catch(err => {
        console.log(err.response);
      })
  };
  var query = '/user/order';

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <>
      <div className="cart-nav box-shadow-none">
        <div className=" text-center cart-nav-title">
          <h3 className="mb-0 text-black">{t('mobile_shippingInfo:select_payment_method')}</h3>
        </div>
        <Link href={`/user/order`}>
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
        </Link>
      </div>
      <div className="bg-gray-area min-vh-100">
        <div className="h-80px"></div>
        <ChoosePaymentthis
          paymentType={paymentType} setPaymentType={setPaymentType}
          user={user} setUser={setUser}
          promotion={promotion ? promotion : null} setPromotion={setPromotion}
          pointState={pointState} setPointState={setPointState}
          setCalDetail={setCalDetail} calDetail={calDetail}
          cartDetail={cartDetail} setCartDetail={setCartDetail}
          query={query}
        />
        <div className="footer-space bg-light-less-gray"></div>
      </div>

      <div className="cart-nav-to-payment">
        <div className="container px-3 d-flex">
          <div className="check-all-product w-100 align-items-center justify-content-between">
            <p className="text-black m-0">ยอดรวมทั้งสิ้น</p>
            <a className="my-auto text-left d-flex" onClick={toggleshowDetail}>
              {
                calDetail && (
                  <h4 className="text-pink m-0 font-weight-bold mr-2">
                    ฿ {tools.currencyFormatDE(calDetail.net_price - (pointState / 2) - (promotion && promotion.price ? promotion.price : 0))}
                  </h4>
                )
              }
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileMainOrderTransfer