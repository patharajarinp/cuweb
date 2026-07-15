import React, { useState, useEffect,useContext } from 'react'
import Layout from '../../../../components/layout'
import Sidenav from '../../../../components/user/sidenav'
import api from '../../../../utils/api';
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../../../utils/i18n";
import UserContext from '../../../../contexts/UserContext'
import ReturnHeader from '../../../../components/order_return_detail/ReturnHeader'
import MainDetail from '../../../../components/order_return_detail/MainDetail'
import ModalBank from '../../../../components/order_return_detail/ModalBank'

const MainReturnDetail = (props) => {
  const { t, setLoading } = props;
  const { user, setUser, fetchUser } = useContext(UserContext);
  const [returns, setReturns] = useState();
  const router = useRouter();
  const return_id = router.query.id;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);
  

  const fecthReturnOne = () => {
    api.getPackageReturnOne(return_id).then(res => {
      const data = res.data;
      setReturns(data);
      if(data.old_type == '2' && data.change_type == '1' && !data.book_bank) {
        setShow(true);
      }
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  useEffect(() => {
    if(!return_id) return;
    fecthReturnOne();
  }, [return_id]);
  
  return ( 
    <>
      <Sidenav user={user} page="order_return" >
        {
          returns && (
            <>
              <div className="box-main-account">
                <div className="row mx-0 px-0">
                  <div className="col-12 px-0">
                    <div className="mt-2 mb-4">
                      <h6 className="text-black">{t('title_detail_return')}</h6>
                    </div>
                  </div>
                </div>
                <div className="row mx-0 px-0">
                  <div className="col-12 px-0">
                    <div className="border-detail">
                      <ReturnHeader returns={returns} setReturns={setReturns} t={t} fecthReturnOne={fecthReturnOne} show={show} setShow={setShow} />

                      <MainDetail returns={returns} t={t} />
                      
                    </div>
                  </div>
                </div>
              </div>
              {
                show ? (
                   <ModalBank returns={returns} show={show} setShow={setShow} t={t} fecthReturnOne={fecthReturnOne} />
                ) : ''
              }
            </>
          )
        }
        

      </Sidenav>
    </>
  )
}

export default MainReturnDetail