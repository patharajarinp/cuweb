import React from 'react'
import Layout from '../../components/layout'
import MainActivateMember from '../../components/user/member/MainActivateMember'
import MobileMainActivateMember from '../../components/user/mobile/member/MobileMainActivateMember'
import useMediaQuery from '../../hooks/useMediaQuery'
import { withTranslation } from '../../utils/i18n'


const ActivateMember = (props) => {
  const { t } = props;

  const isMobile = useMediaQuery(992);

  return (
 
  <Layout title="User | Register Member" >
    {
      !isMobile ? (
        <MainActivateMember t={t} />
      ) : (
        <MobileMainActivateMember t={t} />
      )
    }
  </Layout>
)}
export default withTranslation(['member_activate', 'translations'])(ActivateMember)