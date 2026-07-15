import React, { useContext, useState } from 'react';
import { CustomInput } from 'reactstrap';
import UserContext from '../../../../contexts/UserContext';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { Link, Router } from '../../../../utils/i18n';
import tools from '../../../../utils/tools';

const MobileMainRegisterMember = (props) => {
  const { t } = props;

  const { user, fetchUser, local, setLocal } = useContext(UserContext)
  const [validPhone, setValid] = useState(false);
  
  const handleSave = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const id = AuthService.getProfile().id;
    const jsonData = tools.toJson(data);
    api.registerMember(id, jsonData)
    .then(res=>{
      const data = res.data;
      ;
      fetchUser();

      //Router.push(`/user/member-tranfer/[user_id]?user_id=${id}`, `/user/member-tranfer/${id}`)
      Router.push(`/user/member`);
    })
    .catch(err => {
      if(!err.response) {
        setValid(t('mobile_register:disconnect_server'));
        return;
      }
      if(err.response.data.code == 1101){
        setValid(true);
      }
      console.log(err.response);
    })
  }

  const day = [];
  for (var i = 1; i <= 31; i++) {
      if(i < 10) {
      i = '0' + i
      }
      day.push(i);
  }
  const month = [`${t("january")}`, `${t("february")}`, `${t("march")}`, `${t("april")}`, 
  ` ${t("may")}`, `${t("june")}`, `${t("july")}`,` ${t("august")}`, `${t("september")}`, `${t("october")}`, `${t("november")}`, `${t("december")}`];

  const year = [];
  for (var i = 2547; i >= 2400; i--) {
      year.push(i);
  }

  return ( 
    <>
      {
        user && (
          <>
            <div className="cart-nav">
              <div className=" text-center cart-nav-title">
                <h4>{t("mobile_member_register:register_premium")}</h4>
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
              <form onSubmit={handleSave}>
                <div className="container bg-white">
                  <div className="w-100 clearfix">
                    <div className="info-creditcard-100 mt-3 mb-4">
                      <select className="select-box-address mr-2 "name="prefix" id="prefix" required>
                        <option value="" disabled selected hidden>{t("mobile_member_register:name_prefix")}*</option>
                        <option value="07">{t('mobile_member_register:mr_mrs')}</option>
                      </select>
                    </div>
                    <div className="input-effect-50 mr-for-50">
                      <input className="effect-16" type="text" name="firstname" defaultValue={user.firstname} placeholder="" required />
                      <label>{t("mobile_register:name")}<span>*</span></label>
                      <span className="focus-border"></span>
                    </div>
                    <div className="input-effect-50">
                      <input className="effect-16" type="text" name="lastname" defaultValue={user.lastname} placeholder="" required />
                      <label>{t("mobile_register:surname")}<span>*</span></label>
                      <span className="focus-border"></span>
                    </div>
                    <div className="info-creditcard-100 mt-5 mb-1">
                      <input className="effect-16" type="text" name="email" defaultValue={user.email} placeholder="" required />
                      <label>{t("mobile_register:email")}<span>*</span></label>
                      <span className="focus-border"></span>
                    </div>

                    <div className="info-creditcard-100 mt-5 mb-1">
                      <div className="d-flex justify-content-between">
                        <select className="select-box-address mr-2 " name="day" id="day" required>
                            {
                            day.map((val, index) => {
                                if(user){
                                var d = new Date(user.birthdate);
                                return <option selected={d.getDate() == val} value={val} key={val}>{val}</option>
                                }
                                return <option value={val} key={val}>{val}</option>
                            })
                            }
                        </select>
                        <select className="select-box-address mr-2" name="month" id="month" required>
                            {
                                month.map((val, index) => {
                                    if(user){
                                    var m = new Date(user.birthdate);
                                    return <option selected={m.getMonth() == index} value={index + 1} key={val}>{val}</option>
                                    }
                                    return <option value={index + 1} key={val}>{val}</option>
                                })
                            }
                        </select>
                        <select className="select-box-address mr-2" name="year" id="year" required>
                        {  
                          year.map((val, index) => {
                            if(user){
                              var y = new Date(user.birthdate);
                              return <option selected={y.getFullYear() == val} value={val} key={val}>{val}</option>
                            }
                            return <option value={val} key={val}>{val}</option>
                          })
                        }
                        </select>
                      </div>
                    </div>
                    <div className="input-effect-100 mt-5">
                      <input className="effect-16" type="text" name="phone" defaultValue={user.phone} minLength="9" maxLength="10"  pattern="[0-9]*" placeholder="" required />
                      <label>{t("mobile_address:phone_number")}<span>*</span></label>
                      <span className="focus-border"></span>
                      {
                        validPhone ? (
                          <span className="font-14 text-danger">{t('mobile_register:member_phone')}</span>
                        ) : ''
                      }
                    </div>
                  </div>
                  <div className="d-flex mt-4">
                    <CustomInput type="checkbox" name="information" value="1" id="accept" className="my-auto" required />
                    <p className="p-12 my-auto">{t("mobile_register:receive")}</p>
                  </div>
                  <button type="submit" className="btn btn-pink-submit my-3 h-40px" ><h4 className="text-white m-auto">{t("mobile_register:sign_up")}</h4></button>
                  <p className="text-black">{t("mobile_member_register:already_a_member")}?
                    <Link href={`/user/member-activate`}>
                      <span className="text-pink ml-2">{t("mobile_member_activate:confirm_membership")}</span>
                    </Link>
                  </p>
                </div>
              </form>
              <div className="footer-space"></div>
            </div>
          </>
        )
      }
    </>
  )
}

export default MobileMainRegisterMember