import React from 'react';
import LayoutEcode from '../../components/ecode/LayoutEcode';
import useMediaQuery from '../../hooks/useMediaQuery';
import EcodeMainCartDesktop from '../../components/ecode/EcodeMainCartDesktop';
import EcodeMainCartMoblie from '../../components/ecode/EcodeMainCartMoblie';
import { withTranslation } from '../../utils/i18n';

const Cart = (props) => {
  const { t } = props
  const isMobile = useMediaQuery(992);
  return (
    <LayoutEcode title="User | Cart">
      {
        !isMobile ? (
          <EcodeMainCartDesktop t={t} />
        ) : (
          <EcodeMainCartMoblie t={t} />
        )
      }

    </LayoutEcode>
  )
}
export default withTranslation(['shippingInfo', 'header', 'mobile_shippingInfo', 'mobile_header', 'mobile_address'])(Cart)