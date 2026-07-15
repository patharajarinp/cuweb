import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import MainDetail from '../../../order_detail/MainDetail';
import OrderHeader from '../../../order_detail/OrderHeader';
import Summary from '../../../order_detail/Summary';
import Sidenav from '../../sidenav';
import api from '../../../../utils/api';

const MainOrderDetail = (props) => {
  const { t, setLoading } = props;
  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const [user, setUser] = useState();
  const [order, setOrder] = useState();
  const [sum, setSum] = useState();
  const [amount, setAmount] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const router = useRouter()
  
  const order_id = router.query.order_id

  const fetchUser = () => {
    api.getProfile().then(res => {
      const data = res.data;
      setUser(data);
    })
      .catch(err => {
        console.log(err.response);
      })
  };
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
        console.log(err)
        console.log(err.response);
      })
  };



  useEffect(() => {
    if(!order_id) return;
    fetchUser();
    fetchDetail();
  }, [order_id]);



  const getYoutube = (val) => {
    var namepath = val;
    if (namepath) {
      var [path, link] = namepath.split("watch?v=");
      if (link) {
        return 'https://www.youtube.com/embed/' + link + '?autoplay=0&controls=0';
      }
    }
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

  if(order) {
    sort = sorting(order.packages);
  }

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  


  return ( 
    <>
      <Sidenav user={user} page="order" >
        {
          order && (
            <div className="box-main-account">
              <div className="row mx-0 px-0">
                <div className="col-12 px-0">
                  <div className="mt-2 mb-4">
                    <h6 className="text-black">{t('title_detail')}</h6>
                  </div>
                </div>
              </div>
              <div className="row mx-0 px-0">
                <div className="col-12 px-0">
                  <div className="main-order-detail">
                    <OrderHeader order={order} order_id={order_id} t={t} />

                    {
                      sort.map((val,index)=><MainDetail order={order} slips={order.slips} package={val} fetchDetail={fetchDetail} length={order.packages.length} index={index+1}/>)
                    }
                  </div>
                </div>
              </div>
              <Summary order={order} address={order.address} tax={order.tax_address} t={t} amount={amount} sum={sum} />
            </div>
          )
        }
        

      </Sidenav>
    </>
  )
}

export default MainOrderDetail