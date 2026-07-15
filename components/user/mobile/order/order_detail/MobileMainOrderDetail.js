import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import OrderAddress from "../../../../../components/mobile/order-detail/address";
import CancelOrder from "../../../../../components/mobile/order-detail/cancel-order";
import Orderlist from "../../../../../components/mobile/order-detail/order";
import OrderPackage from "../../../../../components/mobile/order-detail/package";
import PaymentDetail from "../../../../../components/mobile/order-detail/payment-detail";
import WaitPayment from "../../../../../components/mobile/order-detail/wait-payment";
import api from '../../../../../utils/api';
import { withTranslation, Link } from '../../../../../utils/i18n';
import tools from '../../../../../utils/tools';

const MobileMainOrderDetail = (props) => {
  const { t } = props;
  const [order, setOrder] = useState();
  const [sum, setSum] = useState();
  const [amount, setAmount] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const router = useRouter()

  const order_id = router.query.order_id

  const fetchDetail = () => {
    // console.log(order_id);
    api.getOrderDetail(order_id).then(res => {
      var data = res.data;
      var invoice = {
        status : data.packages.length > 0 ? 0 : data.status - 1,
        round: 2,
        package_details : [],
        trackings: []
      }

      data.products.forEach((product)=>{
        if(product.quantity != product.sent){
          invoice.package_details.push({
            quantity:product.quantity - product.sent,
            product
          })
        } 
      })




      setOrder(data);

      var sum = 0;
      var num = 0;
      data.products.map((val, index) => {
        sum += val.quantity * val.cover_price;
        num += val.quantity;
      })
      setSum(sum);
      setAmount(num);
    })
      .catch(err => {
        console.log(err.response);
      })
  };


  useEffect(() => {
    fetchDetail();
  }, []);

  var sort = [];
  function sorting (arr){
    arr.sort((a,b) =>{
      const order = ['cu']
      const aIndex = order.indexOf(a.seller_id)!= -1 ? order.indexOf(a.seller_id) : 999;
      const bIndex = order.indexOf(b.seller_id)!= -1 ? order.indexOf(a.seller_id) : 999;
      return aIndex - bIndex;
    })
    return arr;
  }

  if(order) {
    sort = sorting(order.packages);
  }

  var total_price = 0,discount = 0,shipping_cost = 0,summary = 0;
  if(order){
    order.packages.filter((v) => (v.status != 0 || order.status == 0)).map((val, index) => {
      
      shipping_cost += val.shipping_cost;
      discount += val.discount;

      val.package_details.map((val2) => {
        total_price += (val2.item_cover_price * val2.quantity);
      })
    })
  }

  return ( 
    <>
      {
        order && (
          <>
            <div className="order-manage-nav">
                <div className="text-center m-auto">
                    <h3 className="mb-0">{t("mobile_order_detail:title_detail")}</h3>
                </div>
                <Link href={`/user/order`}>
                  <a className="btn-back order-manage-back">
                      <img className="img-fluid my-auto" src={'/mobile/image/icon/icon-back.svg'} />
                  </a>
                </Link>
                
            </div>
            <div className="bg-light-less-gray min-vh-100">
                <div className="h-56px"></div>
                <WaitPayment date={tools.formatDate(order.expired_at)} paymentStatus={order.status!=1} />
                <Orderlist orderId={order.order_id} date={tools.formatDate(order.createdAt,true,true)} price={tools.currencyFormatDE(order.total_price)} paymentStatus={order.status>=2}/>
                <div className="container mt-3">
                    <OrderAddress address={order.address} type={'address'}/>
                    {
                      order.require_tax == 1 && (
                        order.tax_address ? <OrderAddress address={order.tax_address} type={'tax'}/>:''
                      )
                    }
                    
                </div>
                <div className="mt-3">
                    <OrderPackage order={order} order_id={order.order_id} fetchDetail={fetchDetail}/>
                </div>
                <PaymentDetail paymentStatus={order.packages[0].status != 1} paymentType={order.payment_type} numProduct={order.products.length} tools={tools} 
                discount={discount} total_price={total_price} order={order} productPriceTotal={tools.currencyFormatDE(order.products.reduce((total,p)=>{total += parseFloat(p.cover_price);return total},0))} shippingPrice={tools.currencyFormatDE(order.shipping_cost)} totalPrice={tools.currencyFormatDE(order.total_price)}/>
                {
                  order.packages[0].status == 1 && (
                    <CancelOrder status={order.packages[0].status} slips={order.slips} order_id={order.order_id} />
                  )
                }
                
                <div className="footer-space"></div>
            </div>
          </>
        ) 
      }
    </>
  )
}

export default MobileMainOrderDetail