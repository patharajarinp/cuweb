import React, { memo, useContext, useState } from 'react';
import UserContext from '../../contexts/UserContext';
import { withTranslation } from '../../utils/i18n';
import RegisterEcode from '../../components/ecode/RegisterEcode'
import RegisterEcodeMobile from '../../components/ecode/RegisterEcodeMobile'
import useMediaQuery from '../../hooks/useMediaQuery';
import LayoutEcode from '../../components/ecode/LayoutEcode';
import { useRouter } from 'next/router';

const Register = memo(props => {

  const { t } = props;
  const router = useRouter();
  const isMobile = useMediaQuery(992);
  const linkPath = router.query;

  return (
    <LayoutEcode>

      {
        isMobile ? <RegisterEcodeMobile t={t} linkPath={linkPath} /> :


          <RegisterEcode t={t} linkPath={linkPath} />

      }
    </LayoutEcode>

  )
})

export default withTranslation(['register', 'mobile_register'])(Register)
