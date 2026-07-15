import React, { useState } from 'react';
import LayoutEcode from '../../components/ecode/LayoutEcode';
import EcodeMainSummaryDesktop from '../../components/ecode/EcodeMainSummaryDesktop';
import EcodeMainSummaryMobile from '../../components/ecode/EcodeMainSummaryMobile';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from '../../utils/i18n';


const Summary = (props) => {
  const { t } = props
  const [loading, setLodding] = useState(false);

  const isMobile = useMediaQuery(992);
  return (
    <LayoutEcode title="User | Summary" loading={loading}>
      {
        !isMobile ? (
          <EcodeMainSummaryDesktop t={t} loading={loading} setLodding={setLodding} />
        ) : (
          <EcodeMainSummaryMobile t={t} loading={loading} setLodding={setLodding} />
        )
      }
    </LayoutEcode>
  )
}
export default withTranslation(['shippingInfo', 'header', 'mobile_shippingInfo', 'mobile_header', 'mobile_address'])(Summary)