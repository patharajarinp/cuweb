import React, { useState } from 'react';
import LayoutEcode from '../../components/ecode/LayoutEcode';
import MobileMainOrder from '../../components/user/mobile/order/MobileMainOrder';
import MainOrder from '../../components/user/order/MainOrder';
import useMediaQuery from '../../hooks/useMediaQuery';
import { withTranslation } from "../../utils/i18n";

const Order = (props) => {
  const { t } = props;
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery(992);

  return (
    <LayoutEcode title="User | Order" loading={loading} >
      {
        !isMobile ? (
          <MainOrder t={t} setLoading={setLoading} />

        ) : (
          <MobileMainOrder t={t} setLoading={setLoading} />
        )
      }
    </LayoutEcode>
  )
}

export default withTranslation(['Order', 'mobile_translations'])(Order)