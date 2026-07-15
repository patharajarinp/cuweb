import React, { useState,useEffect,useContext } from 'react'
import Layout from '../../components/layout'
import api from '../../utils/api';
import Sidenav from '../../components/user/sidenav'
import AuthService from '../../utils/AuthService'
import {withRouter,useRouter} from 'next/router';
import MainChange from '../../components/order_change_main/OrderChange'
import { Router , Link, withTranslation } from "../../utils/i18n";
import Paginate from 'react-paginate';
import UserContext from '../../contexts/UserContext'
import MainOrderChange from '../../components/user/order/order_change/MainOrderChange';
import useMediaQuery from '../../hooks/useMediaQuery';
import MobileOrderChange from '../../components/user/mobile/order/order_change/MobileOrderChange';

const Order = (props) => {
  const {t} = props;
  const [loading, setLoading] = useState(false);
  
  const isMobile = useMediaQuery(992);

  return (
 
  <Layout title="User | Order Change" loading={loading} >
    {
      !isMobile ? (
        <MainOrderChange t={t} setLoading={setLoading} />
      ) : (
        <MobileOrderChange t={t} />
      )
    }
    
  </Layout>
)}

export default withTranslation(['Order'])(Order)