import React, { useEffect, useState } from 'react';
import Sidenav from '../../../components/user/sidenav';
import api from '../../../utils/api';
import AuthService from '../../../utils/AuthService';
import { Link, Router } from '../../../utils/i18n';

const MainMember = (props) => {
  const { t } = props;
  const [user, setUser] = useState();
  const [userID, setUserID] = useState(0);
  const [defaultAddress, setDefault] = useState(0);
  const [changeDefault, setChange] = useState();
  const [order, setOrder] = useState();
  


  const [toggle,setToggle] = useState(false);
  const [sidenav,setSidenav] = useState(true);
  

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  const handleToggle = () => {
    setToggle(true);
    setSidenav(false)
    $('#show-header-mobile').addClass('d-none');
    $('#show-header-profile').removeClass('d-none');
  }
  const handleCloseToggle = () => {
      setToggle(false);
      setSidenav(true)
      $('#show-header-mobile').removeClass('d-none');
      $('#show-header-profile').addClass('d-none');
  }
  const handleLink = (link) =>{
    Router.push(link);
    handleCloseToggle();
  }

  const  fetchOrder = () => {
    const id = AuthService.getProfile().id;
    api.getMemberOne(id).then(res =>{
        const data = res.data;
        setOrder(data);
        ;
    })
    .catch(err =>{
      console.log(err.response);
    })
  };
  const  fetchUser = () => {
    api.getProfile().then(res =>{
        const data = res.data;
        setUser(data);
    })
    .catch(err =>{
      console.log(err.response);
    })
  };
  useEffect(() => {
    fetchUser();
    fetchOrder();
  },[]);
  const handleError = (error) => {
    console.log( error);
  }

  const Datemonth = [t("january"), t("february"), t("march"), t("april"), 
  t("may"), t("june"), t("july"), t("august"), t("september"), t("october"), 
  t("november"), t("december")];

  const formatDate = (date) => {
    // console.log('date', date);
    if(!user || !date) {
      return;
    }
    // console.log(user);
    var data = date.split("/");
    var day = parseInt(data[0]);
    var month = data[1];
    var year = parseInt(data[2]);
        
    Datemonth.map((val, index) => {
      // console.log(val);
      if((month - 1) == index){
        month = val;
      }
    })
    
    if (day < 10) 
        day = '0' + day;
        
    var dataDate = [day, month, (year + 543)].join(' ');
    return dataDate;
  }


  var checkDate = (date) => {
    // var date = '30/9/2021'
    if(!date) return;
    const now = new Date();
    const [day,month,year] = date.split('/')
    const expire = new Date(parseInt(year),parseInt(month)-1,parseInt(day))
    // var diff = now.setDate(now.getDate() - expire.getDate());
    return expire.getTime() > now.getTime()
  }

  const renewMember = (event) => {
    event.preventDefault();
    api.renewMember(user.id)
    .then(res => {
      const data = res.data;
      // console.log('data', data)
      Router.push(`/user/member-renew/[user_id]?user_id=${user.id}`, `/user/member-renew/${user.id}`);

    })
    .catch(err => {
      console.log(err.response);
    })
    
  }

  // console.log(user?.member?.EXPIRY_DATE);
  // console.log('defDate', checkDate(user?.member?.EXPIRY_DATE));

  return ( 
    <>
      <Sidenav user={user} menuToggle={sidenav} page="member" >
        <div className="box-main-account">
          <div className="row mx-0 px-0">
            <div className="col-6 pl-0">
              <div className="mt-2 mb-4">
                <h6 className="text-black">{t("premium_membership")}</h6>
                <p>
                  { user && user.member ? 
                    (
                      user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ? (
                        <span className="text-success">{t("status")} : {t("be_a_member")} ID CARD {user.member.MEMBER_ID}</span>
                      ) : <span className="text-cancel">{t("status")} : {t("not_yet_a_member")}</span>
                    ) : ''
                  }
                </p>
              </div>
              {/* <div className="main">
                <div className="">
                  <div className="">
                    <h4 className="" id="address-header">{t("premium_membership")}</h4>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className="row mx-0 px-0 ">
            <div className="col-lg-6 col-xxl-5 col-12 px-0">
              <div className="box-main-order">
                  <div className="border-r bg-white p-3">
                      <div className="row mx-0 px-0">
                        <div className="w-100 mt-2 d-flex justify-content-between align-items-center">
                          <h4 className="mb-0">{t("your_reward_points")}</h4>
                          <h3 className="mb-0 text-pink cu-point">{ user && user.member ? user.member.POINT : '0'}</h3>
                          </div>
                        <div className="w-100 mt-2 d-flex justify-content-between align-items-center">
                          {
                          
                            !checkDate(user?.member?.EXPIRY_DATE) ?
                            <p className="mb-0 text-danger"></p>
                            :
                              {/*<p className="mb-0">{t("will_expire_in")} { user && user.member ? formatDate(user.member.EXPIRY_DATE,true,false) : ''}</p>*/}
                          }
                          <p className="p-medium mb-0">POINT</p>
                        </div>
                          
                      </div>
                  </div>
              </div> 
            </div> 
          </div>

          <div className="row mt-4">
              <div className="col-12">
                  <div className="new-nav">
                      <ul className="nav nav-tabs" role="tablist">
                          <li className="nav-item">
                              <a className="nav-link active" href="#privilege" role="tab" data-toggle="tab">{t("benefits")}</a>
                          </li>
                          <li className="nav-item">
                              <a className="nav-link" href="#reward" role="tab" data-toggle="tab">{t("reward_point")}</a>
                          </li>
                          <li className="nav-item">
                              <a className="nav-link" href="#register" role="tab" data-toggle="tab">{t("how_register")}</a>
                          </li>
                          {/* <li className="nav-item">
                              <a className="nav-link" href="#stores" role="tab" data-toggle="tab">{t("project_stores")}</a>
                          </li> */}
                      </ul>
                  </div>
                  <div className="tab-content my-4">
                      <div role="tabpanel" className="tab-pane fade in active show" id="privilege">
                        <h6 className="py-2">{t("privileges")}</h6>
                        <p>
                          • {t("book_center_members")}<br></br>
                          • {t("book_center_members1")}<br></br>
                          • {t("receive_news")} <br></br>
                          • {t("can_participate")} <br></br>
                          {/*• {t("companies_stores")} */}
                        </p>
                      </div>
                      <div role="tabpanel" className="tab-pane fade" id="reward">
                        <h6 className="py-2">{t("about_accumulation")}</h6>
                        <p>
                          {t("just_apply")}
                        </p>
                        <p>
                          • {t("after_discount")} <br></br>
                          • {t("collecting_points")}<br></br>
                          • {t("in_case")}<br></br>
                          {/* • {t("cash_coupon")}<br></br> */}
                        </p>
                      </div>
                      <div role="tabpanel" className="tab-pane fade" id="register">
                      <h6 className="py-2">{t("how_to_membership")}</h6>
                        <p>
                          • {t("application_fee")}<br></br>
                          • {t("can_apply")}
                        </p>
                      </div>
                      <div role="tabpanel" className="tab-pane fade" id="stores">{t("project_stores")}</div>
                  </div>
                  <div>
                    {
                      user ? user.member ? (
                        user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ? '' : (
                          order ? 
                          (
                            
                            (order.slips.length > 0) ? (
                              <>
                                {
                                  order.slips && (order.slips[0].status == 1 ) && (
                                    <div className="">
                                      <a><button type="button" className="btn btn-disabled mr-3" disabled>{t("awaiting_review")}</button></a>  
                                    </div>
                                  )
                                } 
                                {
                                  order.slips && (order.slips[0].status == 0 ) && (
                                    <div className="">
                                      <Link href={`/user/order-tranfer-detail/[order_id]?order_id=${order.order_id}`} as={`/user/order-tranfer-detail/${order.order_id}`}>
                                        <a><button type="button" className="btn btn-primary mr-3">{t('incorrect_evidence')}</button></a>  
                                      </Link>
                                    </div>
                                  )
                                }
                              </>
                            ) : (
                              <Link href={`/user/member-tranfer/[user_id]?user_id=${user.id}`} as={`/user/member-tranfer/${user.id}`}>
                                <button className="btn btn-primary mr-3">{t("payment")}</button>
                              </Link>
                            )
                          ) : (
                            <Link href={`/user/member-tranfer/[user_id]?user_id=${user.id}`} as={`/user/member-tranfer/${user.id}`}>
                              <button className="btn btn-primary mr-3">{t("payment")}</button>
                            </Link>
                          )
                        )
                      ) : (
                        <>
                          <Link href={'/user/member-register'} as={`/user/member-register`}>
                            <button className="btn btn-primary mr-3">{t("sign_up")}</button>
                          </Link>
                          <Link href={'/user/member-activate'} as={`/user/member-activate`}>
                            <button className="btn btn-outline-primary mr-3">{t("already_a_member")}</button>
                          </Link>
                        </>
                      )
                      : null
                    } 
                    {
                      /*
                      !checkDate(user?.member?.EXPIRY_DATE) && (
                        // <Link href={`/user/member-tranfer/[user_id]?user_id=${user.id}`} as={`/user/member-tranfer/${user.id}`}>
                          <button type="button" className="btn btn-primary mr-3" onClick={(e) => renewMember(e)}>{'ต่ออายุสมาชิก'}</button>
                        // </Link>
                      )
                    */}
                  </div>
              </div>
          </div>
        
        </div> 
      </Sidenav>
      
    </>
  )
}

export default MainMember