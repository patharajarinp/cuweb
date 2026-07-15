import React, { useEffect, useState } from 'react'
import Paginate from 'react-paginate'
import Layout from '../../components/layout'
import Loading from '../../components/loading'
import Sidenav from '../../components/user/sidenav'
import api from '../../utils/api'
import AuthService from '../../utils/AuthService'
import { Link, withTranslation } from '../../utils/i18n'
import tools from '../../utils/tools'
import classNames  from 'classnames';
import MainReview from '../../components/user/review/MainReview'
import useMediaQuery from '../../hooks/useMediaQuery'
import MobileMainReview from '../../components/user/mobile/review/MobileMainReview'

const Review = (props) => {
  const { t } = props;
  const [loading, setLoading] = useState(false)

  const isMobile = useMediaQuery(992);

  return (
 
  <Layout title="User | Review" loading={loading} >
    {
      !isMobile ? (
        <MainReview t={t} loading={loading} setLoading={setLoading} /> 
      ) : (
        <MobileMainReview t={t} loading={loading} setLoading={setLoading} />        
      )
    }
  </Layout>
)}
export default withTranslation(['review','favorite'])(Review)