import React from 'react';
import HeaderOrder from '../../../components/mobile/order/HeaderOrder';
import Package from '../../../components/mobile/order/Package';
import { withTranslation } from '../../../utils/i18n';

const OrderShow = (props) => {
  const {order, btnStatus,t,type} = props;
  

  const Datemonth = [`${t("january")}`, `${t("february")}`, `${t("march")}`, `${t("april")}`, `${t("may")}`, `${t("june")}`, `${t("july")}`, `${t("august")}`, `${t("september")}`, `${t("october")}`, `${t("november")}`, `${t("december")}`];

  const currencyFormatDE = (num) => {
    num = parseFloat(num);
    return (
      num
        .toFixed(2) // always two decimal digits
        .replace(',', '.') // replace decimal point character with ,
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    ) // use . as a separator
  }
  if(!order) {
    return;
  }
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

  sort = sorting(order.packages);


  return (
    <>

      <div className="container bg-white mb-3" key={order.order_id}>
        <div>
          <HeaderOrder order={order} btnStatus={btnStatus} t={t} />
        </div>
        <div>
          {
            sort.map((val, index) => (
              <Package package={val} t={t} key={index} type={type} order={order} />
            ))
          }
        </div>
            
      </div>
        
    </>
  )
}
export default withTranslation('Order')(OrderShow)