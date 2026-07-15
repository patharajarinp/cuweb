import React, { useEffect } from 'react';
import Noti from '../noti';
import Sidenav from '../sidenav';

const MainNoti = (props) => {
  const { t, user } = props;

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  return ( 
    <>
      <Sidenav user={user} page="notification" >
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
                {
                  user ? user.notifications.map((item) => (<Noti key={Math.random()} item={item} />)) : ''
                }
              </div>
            </div>
          </div>
        </div>
                
      </Sidenav>
      
    </>
  )
}

export default MainNoti