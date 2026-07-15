import React, { useState, useEffect,useContext } from 'react'
import Layout from '../../../../components/layout'
import Sidenav from '../../../../components/user/sidenav'
import api from '../../../../utils/api';
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../../../utils/i18n";
import UserContext from '../../../../contexts/UserContext'
import ChangeHeader from '../../../../components/order_change_detail/ChangeHeader'
import MainDetail from '../../../../components/order_change_detail/MainDetail'
import ModalAddress from '../../../../components/order_change_detail/ModalAddress'

const MainChangeDetail = (props) => {
  const { t } = props;
  const { user, setUser, fetchUser } = useContext(UserContext);
  const [changes, setChanges] = useState();
  const router = useRouter();
  const change_id = router.query.id;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  const fecthReturnOne = () => {
    api.getPackageReturnOne(change_id).then(res => {
      const data = res.data;
      setChanges(data);
      if(data.old_type == '1' && data.change_type == '1' && !data.address) {
        setShow(true);
      }
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  useEffect(() => {
    if(!change_id) return;
    fecthReturnOne();
  }, [change_id]);


  return ( 
    <>
      <Sidenav user={user} page="order_change" >
        {
          changes && (
            <>
              <div className="box-main-account">
                <div className="row mx-0 px-0">
                  <div className="col-12 px-0">
                    <div className="mt-2 mb-4">
                      <h6 className="text-black">{t('title_detail_change')}</h6>
                    </div>
                  </div>
                </div>
                <div className="row mx-0 px-0">
                  <div className="col-12 px-0">
                    <div className="border-detail">
                      <ChangeHeader changes={changes} setChanges={setChanges} t={t} fecthReturnOne={fecthReturnOne} show={show} setShow={setShow} />

                      <MainDetail changes={changes} t={t} />
                      
                    </div>
                  </div>
                </div>
              </div>

              {
                show ? (
                   <ModalAddress changes={changes} show={show} setShow={setShow} t={t} fecthReturnOne={fecthReturnOne} />
                ) : ''
              }
             
            </>
          )
        }
        

      </Sidenav>
    </>
  )
}

export default MainChangeDetail