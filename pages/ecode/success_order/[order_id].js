import React from 'react';
import LayoutEcode from '../../../components/ecode/LayoutEcode';
import MobileMainSuccess from '../../../components/user/mobile/order/success_order/MobileMainSuccessEcode';
import MainSuccess from '../../../components/user/order/success_order/MainEcodeSuccess';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { withTranslation } from "../../../utils/i18n";

const Success = (props) => {
  const { t } = props
  const isMobile = useMediaQuery(992);
  return (
    <LayoutEcode title="User | Order Success" isFooter={false}>
      {
        !isMobile ? (
          <MainSuccess t={t} />
        ) : (
          <MobileMainSuccess t={t} />
        )
      }
    </LayoutEcode>
  )
}
export default withTranslation(['mobile_translations'])(Success)