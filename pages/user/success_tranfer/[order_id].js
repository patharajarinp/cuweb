import React, { useState,useEffect,useContext,useRef } from 'react'
import Head from 'next/head'
import classNames  from 'classnames';
import Layout from '../../../components/layout'

import Link from 'next/link'
import withAuth from '../../../utils/withAuth'
import api from '../../../utils/api';
import Sidenav from '../../../components/user/sidenav'
import AuthService from '../../../utils/AuthService'
import Router, { useRouter } from 'next/router'
import UserContext from '../../../contexts/UserContext'
import {Button, Modal} from 'react-bootstrap'
import myData from '../../../public/json/raw_database.json';
import tools from '../../../utils/tools'
import { usePaymentInputs } from 'react-payment-inputs';
import Loading from '../../../components/loading'

const Success = (props) => {
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
    <Layout title="User | Order Success">
      <div>   
        <div className="container pt-5">
          <div className="row justify-content-center">
            <div className="col-6">
              <div className="bg-white br-8 p-4">
                <div className="text-center py-4">
                  <div>
                    <img src="/images/BANK.svg" alt="" className="" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-pink">แจ้งการโอนเงินสำเร็จ</h3>
                    <p>หมายเลขคำสั่งซื้อ {order} ของท่าน</p>
                  </div>
                  <div className="mt-2">
                    <p>กรุณารอการตรวจสอบจากเจ้าหน้าที่ ภายใน 48 ชั่วโมง</p>
                  </div>
                  <div className="mt-5">
                    <Link href="/user/dashboard" as={`/user/dashboard`}>
                      <a>
                        <button type="button" className="btn btn-outline-primary mr-3" onClick={showOrder}>ดูคำสั่งซื้อ</button>
                      </a>
                    </Link>
                    <Link href='/' as={'/'}>
                      <button type="button" className="btn btn-primary" onClick={gotohome}>ช้อปต่อ</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="end-page"></div>
    </Layout>
  )}

  Success.getInitialProps = ({query}) => {
  return {query}; //has to be like an object
}
export default Success