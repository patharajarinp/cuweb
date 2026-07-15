import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Paginate from 'react-paginate';
import MainReturn from '../../../../components/order_return_main/OrderReturn';
import Sidenav from '../../../../components/user/sidenav';
import UserContext from '../../../../contexts/UserContext';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { Link } from "../../../../utils/i18n";

const MainOrderReturn = (props) => {
  const { t, setLoading } = props;
  const router = useRouter();
  const { user, setUser, fetchUser } = useContext(UserContext);
  const [returns, setReturns] = useState();
 
  const limit = 5;
  const  fecthReturn = (params) => {
    setLoading(true)
    const id = AuthService.getProfile().id;
    params.user_id = id;
    params.type = 1;
    params.limit = limit;
    api.getPackageReturn(params).then(res =>{
      const data = res.data;
      setReturns(data);
      console.log(data);
      setPageCount(Math.ceil(data.count / limit));
      setLoading(false);
    })
    .catch(err =>{
      setLoading(false);
      console.log(err.response);
    })
  }
 
  useEffect(() => {
    fecthReturn({});
  },[]);

  const [pageCount,setPageCount] = useState(1)
  const [pageNumber, setPagenumber] = useState(0);

  const handlePageClick = data=>{
    let selected = data.selected;
    setPagenumber(selected);
    window.scrollTo(0, 0);
    fecthReturn({page:selected+1});
  }

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  
  return ( 
    <>
      <Sidenav user={user} menuToggle={true} page="order_return" >
        {
          returns ? (
            <div className="show-profile" id="show-profile">
              <div className="box-main-account">
                <div className="row w-100 mx-0 px-0">
                  <div className="col-12 pl-0">
                    <div className="mt-2 mb-4">
                      <h6 className="text-black">{t("return_product")}</h6>
                    </div>
                  </div>
                </div>

                {
                  returns.count > 0 ? (
                    <>
                      <div className="row w-100 mx-0 px-0">
                        <div className="col-12 px-0">
                          <div className="">
                            {
                              returns ? returns.rows.map((val, index) => (
                                <MainReturn returns={val} key={index} type='return' />
                              )) : ''
                            }
                          </div>
                        </div>
                      </div>
                      <div className="row w-100 mx-0 px-0">
                        <div className="col-12 px-0">
                          <div className="float-right page-order">
                            <Paginate
                              previousLabel={t('translations:prev')}
                              nextLabel={t('translations:next')}
                              breakLabel={'...'}
                              breakClassName={'break-me'}
                              pageCount={pageCount}
                              forcePage={pageNumber}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={5}
                              onPageChange={handlePageClick}
                              containerClassName={'pagination'}
                              subContainerClassName={'pages pagination'}
                              activeClassName={'active'}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="col-12 row align-items-center">
                      <div className="col-4 "></div>
                      <div className="col-4 no-favorite text-center">
                        <img src="/images/not-cart.svg" alt="ศูนย์หนังสือจุฬาฯ" className="img-fluid" />
                        <h3 className="text-pink my-3">{t('there_are_no_order_success')}</h3>
                        <Link href='/'>
                          <button className="btn btn-primary my-3">{t('continue_shopping')}</button>
                        </Link>
                      </div>
                      <div className="col-4"></div>
                    </div>
                  )
                }

              </div>
            </div>
          ) : ''
        }
      </Sidenav>
    </>
  )
}

export default MainOrderReturn