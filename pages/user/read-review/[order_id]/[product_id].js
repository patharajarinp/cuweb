// import myData from '../../../public/json/raw_database.json';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Rating from 'react-rating';
import Layout from '../../../../components/layout';
import MobileReadReview from '../../../../components/user/mobile/review/MobileReadReview';
import ReadReview from '../../../../components/user/review/ReadReview';
import Sidenav from '../../../../components/user/sidenav';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { withTranslation } from '../../../../utils/i18n';
import tools from '../../../../utils/tools';



const ReviewDetail = (props) => {
  const { t } = props;
  
  const isMobile = useMediaQuery(992);

  return (
 
  <Layout title="User | Review" >
    {
      !isMobile ? (
        <ReadReview t={t} />             
      ) : (
        <MobileReadReview t={t} />             
      )
    }
  </Layout>
)}

ReviewDetail.getInitialProps = ({query}) => {
    return {query}; //has to be like an object
}
  
export default withTranslation('review')(ReviewDetail)