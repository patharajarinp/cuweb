import React from 'react'
import Layout from '../../components/layout'
import MainDashboard from '../../components/user/dashboard/MainDashboard'
import MobileDashboard from '../../components/user/mobile/dashboard/MobileDashboard'
import useMediaQuery from '../../hooks/useMediaQuery'
import { withTranslation } from '../../utils/i18n'


const Dashboard = (props) => {
  const {t} = props;

  const isMobile = useMediaQuery(992);

  return (
    <Layout title="User | Dashboard" active={4} show={true} isFooter={false} >
      {
        !isMobile ? (
          <MainDashboard t={t} />             
        ) : (
           <MobileDashboard t={t} />      
        )
      }

    </Layout>
  )
}
export default withTranslation(['dashboard'])(Dashboard)