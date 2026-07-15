import React from 'react';
import Layout from '../../../../components/layout';
import MobileMainDetail from '../../../../components/user/mobile/review/MobileMainDetail';
import MainDetail from '../../../../components/user/review/MainDetail';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import { withTranslation } from '../../../../utils/i18n';

const ReviewDetail = (props) => {
  const { t } = props;

  const isMobile = useMediaQuery(992);

  return (
 
  <Layout title="User | Review" >
    {
      !isMobile ? (
        <MainDetail t={t} />
      ) : (
        <MobileMainDetail t={t} />
      )
    }
  </Layout>
)}

ReviewDetail.getInitialProps = ({query}) => {
    return {query}; //has to be like an object
}
  

export default withTranslation('review')(ReviewDetail)