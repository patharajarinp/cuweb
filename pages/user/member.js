import React from 'react';
import Layout from '../../components/layout';
import MainMember from '../../components/user/member/MainMember';
import MobileMainMember from '../../components/user/mobile/member/MobileMainMember';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from '../../utils/i18n';

const Member = (props) => {
  const {t} = props

  const isMobile = useMediaQuery(992);

  return (
    <Layout title="User | Member">
      {
        !isMobile ? (
          <MainMember t={t} />
        ) : (
          <MobileMainMember t={t} />
        )
      }
    </Layout>
  )
}
export default withTranslation('member')(Member)