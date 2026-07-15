import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/layout';
import Sidenav from '../../components/user/sidenav';
import UserContext from '../../contexts/UserContext';
import { withTranslation } from "../../utils/i18n";

const credit = (props) => {
  const {user,handleCart, fetchUser} = useContext(UserContext);
  const [sidenav,setSidenav] = useState(true);
  const {t} = props;

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
    
  }, []);

  console.log('user', user);

  return (

    <Layout title="User | การแจ้งเตือน" >
      <Sidenav user={user} menuToggle={sidenav} page="notification" >
        <div className="show-profile" id="show-profile">
          <div className="box-main-account">
            <div className="row mx-0 px-0">
              <div className="col-12 pl-0">
                <div className="mt-2 mb-4">
                  <h6 className="text-black">{t('head_title')}</h6>
                </div>
              </div>
            </div>
            <div className="row mx-0 px-0 mb-3">
              <div className="col-12 px-0">

                
              </div>
            </div>
          </div>
        </div>
                
      </Sidenav>
    </Layout>
  )
}
export default withTranslation('noti')(credit)