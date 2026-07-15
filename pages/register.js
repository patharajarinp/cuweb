import Head from 'next/head';
import React, { useState } from 'react';
import Layout from '../components/layout';
import MobileMainRegister from '../components/mobile/register/MobileMainRegister';
import MainRegister from '../components/register/MainRegister';
import useMediaQuery from '../hooks/useMediaQuery';
import { withTranslation } from '../utils/i18n';

const Home = (props) => {
  const { t } = props;
  const [loading, setLodding] = useState(false);
  
  const isMobile = useMediaQuery(992);

  return (
    <Layout loading={loading} title="สร้างบัญชี (register) | ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย">
      <Head>
        <meta name="description" content={`ท่านสามารถเข้าเยี่ยมชมเว็บไซต์ www.chulabook.com ได้ เพื่อการค้นหาสินค้าและบริการต่างๆ และสร้างบัญชีศูนย์หนังสือจุฬาฯ (register)`} />
        <meta name="keywords" content={`chulabook register,สมัครสมาชิก ศูนย์หนังสือจุฬา,สมัครสมาชิกใหม่,สมาชิกร้านหนังสือ,chulabook,cubook`} />
      </Head>

      {
        !isMobile ? (
          <MainRegister t={t} setLodding={setLodding} key={'desktop'} />
        ) : (
          <MobileMainRegister t={t} setLodding={setLodding} key={'mobile'} />
        )
      }
    </Layout>
  )
}

export default withTranslation(['register', 'mobile_register'])(Home)
