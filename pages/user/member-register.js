import React from 'react'
import Layout from '../../components/layout'
import MainRegisterMember from '../../components/user/member/MainRegisterMember'
import MobileMainRegisterMember from '../../components/user/mobile/member/MobileMainRegisterMember'
import useMediaQuery from '../../hooks/useMediaQuery'
import { withTranslation } from '../../utils/i18n'


const RegisterMember = (props) => {
  const { t } = props;

  const isMobile = useMediaQuery(992);
  
  return (
 
  <Layout title="User | Register Member" >
    {
      !isMobile ? (
        <MainRegisterMember t={t} />
      ) : (
        <MobileMainRegisterMember t={t} />
      )
    }
  </Layout>
)}
export default withTranslation(['member_register'])(RegisterMember)