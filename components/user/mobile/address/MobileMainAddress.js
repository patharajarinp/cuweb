import classnames from "classnames";
import React, { useContext, useState } from 'react';
import UserContext from '../../../../contexts/UserContext';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { withTranslation, Link, Router } from '../../../../utils/i18n';


const MobileMainAddress = (props) => {
  const { t } = props;

  const { user, handleCart, fetchUser } = useContext(UserContext);
  const [isAddress, setAddress] = useState(true);
  const toggleAddress = () => setAddress(!isAddress);

  const handleDelete = (address_id) => {
    var r = confirm("คุณยืนยันที่จะลบข้อมูลนี้หรือไม่!!!");
    if (r == true) {
      const id = AuthService.getProfile().id;
      api.updatedeleteAddress(id, address_id)
      .then(res=>{
        const data = res.data;
        ;
        fetchUser()
      })
      .catch(err => {
        console.log(err.response);
      })
    }
  }

  const handleDefault = (address_id) => {
    const id = AuthService.getProfile().id;
    if(isAddress == true){
      api.changeDefault(id, {id : address_id, default : 1})
      .then(res=>{
        const data = res.data;
        fetchUser();
      })
      .catch(err => {
        console.log(err.response);
      })
    }else {
      api.changeTax(id, {id : address_id, tax : 1})
      .then(res=>{
        const data = res.data;
        fetchUser();
      })
      .catch(err => {
        console.log(err.response);
      })
    }
  }

  return ( 
    <>
      <div className="cart-nav  h-110px ">
        <div className="w-100">
          <div className="position-relative h-40px row align-content-center mb-2">
            {/* <Link href="/user/dashboard"> */}
              <a className="btn-back cart-nav-back" onClick={() => Router.back()}>
                <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
              </a>
            {/* </Link> */}

            <div className=" text-center cart-nav-title">
              <h4>{t("mobile_address:address_book")}</h4>
            </div>
          </div>
          <div className="box-address mb-3">
            <div className={classnames("btn-address left", { "active": isAddress })} onClick={toggleAddress}>ที่อยู่ในการจัดส่ง</div><div className={classnames("btn-address right", { "active": !isAddress })} onClick={toggleAddress} >ที่อยู่ในใบกำกับภาษี</div>
          </div>
        </div>
      </div>
      <div className="bg-light-less-gray pt-108px min-vh-100">
        <div className="container bg-white ">
          {
            user ? user.addresses.map((val, index) => (
              (isAddress) ?
                <>
                  {
                    (val.at != 'tax') && (<div className="address-for-shipping-list-book" key={index}>
                      <div className=" w-100">
                        <div className="d-flex justify-content-between align-content-center w-100">
                          <div className="d-flex justify-content-start">
                            {
                              val.at == 'home' && (
                                <div className="btn-address-home-add-list mr-2">
                                  <p className="p-14">{t("home")}</p>
                                </div>
                              )
                            }
                            {
                              val.at == 'work' && (
                                <div className="btn-address-work-add-list mr-2">
                                  <p className="p-14">{t("mobile_address:office")}</p>
                                </div>
                              )
                            }
                            {
                              val.default == 1 && (
                                <div className="btn-pink-default-show">
                                  <p className="p-14">{t("mobile_translations:default")}</p>
                                </div>
                              )
                            }

                          </div>
                          {
                            val.default == 0 && (
                              <a onClick={()=> handleDefault(val.id)}><p className="text-pink mb-0 p-14">{t("mobile_address:setdefault")}</p></a>
                            )
                          }

                        </div>
                        <div>
                          <p className="text-black mb-0 mt-1">{val.firstname} {val.lastname}</p>
                          <p className="p-12 text-black two-line mb-0">{val.full_address}</p>
                          <p className="p-12 text-black mb-1">{val.phone}</p>
                        </div>
                        <div className="d-flex  justify-content-between align-content-center w-100">
                          <Link href={`/user/edit-address/[address]?address=${val.id}`} as={`/user/edit-address/${val.id}`}>
                            <a><p className="text-pink mb-0 mr-2">{t("mobile_address:edit")}</p></a>
                          </Link>

                          <a onClick={() => handleDelete(val.id)}><p className="text-pink mb-0">{t("mobile_address:delete")}</p></a>
                        </div>
                      </div>
                    </div>)
                  }
                </>
                : <>{val.at == 'tax' && (
                  <div className="address-for-shipping-list-book" key={index}>
                    <div className="w-100">
                      <div className="d-flex justify-content-between">
                        <div className="d-flex justify-content-start">
                          {
                            val.at == 'tax' && (
                              <div className="btn-address-tax-add-list mr-2">
                                <p className="p-14">{t("mobile_address:tax")}</p>
                              </div>
                            )
                          }
                          {
                            (val.tax == 1) && (
                              <div className="btn-pink-default-show">
                                <p className="p-14">{t("mobile_translations:default")}</p>
                              </div>
                            )
                          }

                        </div>
                        {
                          val.tax == 0 && (
                            <a onClick={()=> handleDefault(val.id)}><p className="text-pink mb-0 p-14">{t("mobile_address:setdefault")}</p></a>
                          )
                        }

                      </div>
                      <div>
                        <p className="text-black mb-0 mt-1">{val.firstname} {val.lastname}</p>
                        <p className="p-12 text-black two-line mb-0">{val.full_address}</p>
                        <p className="p-12 text-black mb-1">{val.phone}</p>
                        {/*  <p className="p-12">
                          {
                            (val.default == 1 && val.tax == 1) && (
                              `${t("shipping_address")}`, `${t("billingaddress")}${t("as_specified")}`
                            )
                          }
                          {
                            (val.default == 1 && val.tax == 0) && (
                              `${t("shipping_address")} ${t("as_specified")}`
                            )
                          }
                          {
                            (val.default == 0 && val.tax == 1) && (
                              `${t("billingaddress")} ${t("as_specified")}`
                            )
                          }

                        </p> */}
                      </div>
                      <div className="d-flex justify-content-between align-content-center w-100">
                        <Link href={`/user/edit-address/[address]?isAddress=${isAddress ? 1 : 0}`} as={`/user/edit-address/${val.id}`}>
                          <a><p className="text-pink mb-0 mr-2">{t("mobile_address:edit")}</p></a>
                        </Link>
                        <a onClick={() => handleDelete(val.id)}><p className="text-pink mb-0">{t("mobile_address:delete")}</p></a>
                      </div>
                    </div>
                  </div>)}</>
            )) : ''
          }
        </div>
      </div>
      <Link href={`/user/add-address?isAddress=${isAddress ? 1 : 0}`}  >
        <a className="btn-pink-submit btn-bottom-layout">
          <h4 className="text-white m-auto">{t("mobile_address:add_new_address")}</h4>
        </a>
      </Link>
    </>
  )
}

export default MobileMainAddress