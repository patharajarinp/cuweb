import React, { useState, useEffect, useContext, useRef } from 'react'
import Head from 'next/head'
import classNames from 'classnames';
import Layout from '../../components/layout'

import { Link, withTranslation } from '../../utils/i18n'
import withAuth from '../../utils/withAuth'
import api from '../../utils/api';
import Sidenav from '../../components/user/sidenav'
import AuthService from '../../utils/AuthService'
import Router, { useRouter } from 'next/router'
import UserContext from '../../contexts/UserContext'
import { Button, Modal } from 'react-bootstrap'
import myData from '../../public/json/raw_database.json';
import tools from '../../utils/tools'
import { usePaymentInputs } from 'react-payment-inputs';
import Loading from '../../components/loading'

const Fail = (props) => {
  // const [order, setOrderID] = useState();
  const { t } = props;

  const [loading, setLodding] = useState(false);
  const router = useRouter()
  // const order_id = router.query.order_id;

  useEffect(() => {
    // setOrderID(order_id);
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
    
  }, []);

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
            <div className="col-8">
              <div className="bg-white br-8 p-4">
                <div className="text-center py-4">
                  <div>
                    <img src="/images/not-cart.svg" alt="ศูนย์หนังสือจุฬาฯ" className="" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-pink">{t('credit_debit_card_fail')}</h3>
                    <p>{t('please_double_check')}</p>
                  </div>

                  <div className="mt-5">
                    <Link href='/' as={'/'}>
                      <button type="button" className="btn btn-outline-primary mr-2" onClick={gotohome}>{t('translations:Back_to_home')}</button>
                    </Link>
                    <Link href="/user/order#pending">
                      <button type="button" className="btn btn-primary " >{t('translations:pay_again')}</button>
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
  )
}

Fail.getInitialProps = ({ query }) => {
  return { query }; //has to be like an object
}
export default withTranslation(['fail_order'])(Fail)