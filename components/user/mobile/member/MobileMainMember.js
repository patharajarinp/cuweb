import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../../../contexts/UserContext';
import api from '../../../../utils/api';
import { Link, Router } from '../../../../utils/i18n';

const MobileMainMember = (props) => {
  const { t } = props;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);


  const [tabname, setTabname] = useState('tab1');
  const { user, order } = useContext(UserContext);

  /* const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    setDirection(e.direction);
  }; */

  const numberFormat = (num) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

  useEffect(() => {

    if (!user) return;
    // if (!user.member) Router.push('/')
  }, [user])

  const { member } = user || {};
  const { POINT = 0, EXPIRY_DATE = '' } = member || {}

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
      Router.push(`/user/member-renew/${user.id}`)
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  
  return ( 
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4>{t("mobile_member:premium_membership")}</h4>
        </div>
        <Link href="/user/dashboard">
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
        </Link>
      </div>

      <div className="bg-white min-vh-100">
        <div className="h-64px">

        </div>
        <div className="container bg-white">
          <div className="premium-card">
            <h4>{t("mobile_member:your_reward_points")}</h4>
            <div className="d-flex mb-2">
              <h1 className="font-weight-bold mt-auto mb-0 mr-3">{numberFormat(POINT)}</h1>
              <h4 className="font-weight-bold mt-auto mb-0">POINT</h4>
            </div>
            {
                         
              !checkDate(user?.member?.EXPIRY_DATE)  ?
              <p className="p-12 mb-0 mt-4"></p>
              :
              <p className="p-12 mb-0 mt-4">{t("mobile_member:will_expire_in")} {EXPIRY_DATE}</p>
            }
            
          </div>

          {/* <div className="bg-white pt-3 min-vh-100">
                <div className="h-108px"></div>
                
                <div className="footer-space"></div>
            </div> */}
        </div>
        <div className="row product-detail-nav order premium ">
          <div className="product-detail-nav-area ">

            <a className={tabname === "tab1" ? "product-detail-nav-list  active" : "product-detail-nav-list "} onClick={() => setTabname('tab1')} >
              <h4>{t("mobile_member:benefits")}</h4>
            </a>



            <a className={tabname === "tab2" ? "product-detail-nav-list active" : "product-detail-nav-list "} onClick={() => setTabname('tab2')}>
              <h4>{t("mobile_member:reward_point")}</h4>
            </a>


            <a className={tabname === "tab3" ? "product-detail-nav-list  active" : "product-detail-nav-list "} onClick={() => setTabname('tab3')}>
              <h4>{t("mobile_member:how_register")}</h4>
            </a>
            {/* <a className={tabname === "tab4" ? "product-detail-nav-list  active" : "product-detail-nav-list "} onClick={() => setTabname('tab4')}>
              <h4>{t("mobile_member:project_stores")}</h4>
            </a> */}

          </div>
        </div>
        <div className="container">
          {
            tabname === 'tab1' && (<>
              <h3 className="py-2">{t("mobile_member:privileges")}</h3>
              <p>
                • {t("mobile_member:book_center_members")}<br></br>
                • {t("mobile_member:receive_news")} <br></br>
                • {t("mobile_member:can_participate")} <br></br>
                {/*• {t("mobile_member:companies_stores")} */}
              </p></>)
          }
          {
            tabname === 'tab2' && (<>
              <h3 className="py-2">{t("mobile_member:about_accumulation")}</h3>
              <p>
                {t("mobile_member:just_apply")}
              </p>
              <p>
                • {t("mobile_member:after_discount")} <br></br>
                • {t("mobile_member:collecting_points")}<br></br>
                • {t("mobile_member:in_case")}<br></br>
                • {t("mobile_member:cash_coupon")}<br></br>
              </p></>)
          }
          {
            tabname === 'tab3' && (<>
              <h3 className="py-2">{t("mobile_member:how_to_membership")}</h3>
              <p>
                • {t("mobile_member:application_fee")}<br></br>
                • {t("mobile_member:can_apply")}
              </p></>)
          }
          {
            tabname === 'tab4' && (<>
              <h3 className="py-2">{t("mobile_member:project_stores")}</h3>
              <p>

              </p></>)
          }
          {
            !checkDate(user?.member?.EXPIRY_DATE) && (
              <div className="success-manu">
                {/* <Link href={`/user/member-tranfer/[user_id]?user_id=${user.id}`} as={`/user/member-tranfer/${user.id}`}> */}
                 {/* <a className="bg-pink btn-success-menu" onClick={(e) => renewMember(e)}><h4 className="text-white m-auto">{`ต่ออายุสมาชิก`}</h4></a>*/}
                {/* </Link> */}
              </div>
            )
          }
          {
            user && user.member ? (
              user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ? '' : (
                order ?
                  (

                    (order.slips.length > 0) ? (
                      <>
                        {
                          order.slips && (order.slips[0].status == 1) && (
                            <div className="success-manu">
                              <a className="bg-light-gray btn-success-menu disable"><h4 className="text-light-grey m-auto">{t("mobile_member:awaiting_review")}</h4></a>
                            </div>
                          )
                        }
                        {
                          order.slips && (order.slips[0].status == 0) && (
                            <div className="success-manu">
                              <Link href={`/user/order-tranfer-detail/[order_id]?order_id=${order.order_id}`} as={`/user/order-tranfer-detail/${order.order_id}`}>
                              <a className="bg-pink btn-success-menu"><h4 className="text-white m-auto">{t('mobile_member:incorrect_evidence')}</h4></a>
                                
                              </Link>
                            </div>
                          )
                        }
                      </>
                    ) : (
                      <div className="success-manu">
                        <Link href={`/user/member-tranfer/[user_id]?user_id=${user.id}`} as={`/user/member-tranfer/${user.id}`}>
                        <a className="bg-pink btn-success-menu"><h4 className="text-white m-auto">{t("mobile_member:payment")}</h4></a>
                        </Link>
                        </div>
                      )
                  ) : (
                    <div className="success-manu">
                    <Link href={`/user/member-tranfer/[user_id]?user_id=${user.id}`} as={`/user/member-tranfer/${user.id}`}>
                      <a className="bg-pink btn-success-menu"><h4 className="text-white m-auto">{t("mobile_member:payment")}</h4></a>
                    </Link>
                    </div>
                  )
              )
            ) : (
                <>
                  <div className="success-manu">
                    <Link href="/user/member-activate">
                      <a className="btn-success-menu"><h4 className="text-black m-auto">{t("mobile_member:already_a_member")}</h4></a>
                    </Link>
                    <Link href="/user/member-register">
                      <a className="btn-success-menu bg-pink"><h4 className="text-white m-auto">{t("mobile_translations:sign_up")}</h4></a>
                    </Link>
                  </div>
                </>
              )
          }
        </div>
        <div className="footer-space"></div>
      </div>
      
    </>
  )
}

export default MobileMainMember