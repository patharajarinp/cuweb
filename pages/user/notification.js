import React, { useContext, useState } from 'react';
import Layout from '../../components/layout';
import MainNoti from '../../components/user/noti/MainNoti';
import MobileNoti from '../../components/user/mobile/noti/MobileNoti';
import UserContext from '../../contexts/UserContext';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from "../../utils/i18n";

const Notification = (props) => {
  const {user} = useContext(UserContext);
  const {t} = props;

  const isMobile = useMediaQuery(992);

  return (

    <Layout title="User | การแจ้งเตือน" active={3} show={true}  isFooter={false} >
      {
        !isMobile ? (
          <MainNoti t={t} user={user} />
        ) : (
          <MobileNoti t={t} user={user} />
        )
      }
    </Layout>
  )
}
export default withTranslation('noti')(Notification)