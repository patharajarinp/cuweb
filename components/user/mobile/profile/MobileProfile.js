import classnames from "classnames";
import React, { useContext, useState } from 'react';
import { CustomInput } from 'reactstrap';
import UserContext from '../../../../contexts/UserContext';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { withTranslation, Link } from '../../../../utils/i18n';
import tools from '../../../../utils/tools';

const MobileProfile = (props) => {
  const {t} = props;
  const {user,handleCart, fetchUser} = useContext(UserContext)
    
  const [name, setName] = useState();
  const getName = (e) => setName(e.target.value);
  const [Showname, setShowName] = useState(false);
  const closeName = (e) => setShowName(false);
  const openName = (e) => setShowName(true);

  const [surname, setsurName] = useState();
  const getsurName = (e) => setsurName(e.target.value);
  const [Showsurname, setShowsurName] = useState(false);
  const closesurName = (e) => setShowsurName(false);
  const opensurName = (e) => setShowsurName(true);

  const [tel, settel] = useState();
  const gettel = (e) => setstel(e.target.value);
  const [Showtel, setShowtel] = useState(false);
  const closetel = (e) => setShowtel(false);
  const opentel = (e) => setShowtel(true);

  const [Showbirthday, setShowbirthday] = useState(false);
  const closebirthday = (e) => setShowbirthday(false);
  const openbirthday = (e) => setShowbirthday(true);

  const [Showchagepass, setShowchagepass] = useState(false);
  const closeShowchagepass = (e) => setShowchagepass(false);
  const openShowchagepass = (e) => setShowchagepass(true);

  const [isPasswordShow, setisPasswordShow] = useState(false);
  const togglePasswordVisiblity = () => setisPasswordShow(!isPasswordShow);

  const [isPasswordShowNew1, setisPasswordShowNew1] = useState(false);
  const togglePasswordVisiblityNew1 = () => setisPasswordShowNew1(!isPasswordShowNew1);

  const [isPasswordShowNew2, setisPasswordShowNew2] = useState(false);
  const togglePasswordVisiblityNew2 = () => setisPasswordShowNew2(!isPasswordShowNew2);


  const getBirthDate = (data) => {
    var d = new Date(data);
    d.setFullYear(d.getFullYear() - 543);
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    var str = d.toLocaleDateString("th-TH",options)
    return str;
  }

  const saveName = () => {
    var firstname = document.getElementById('firstname').value;
    var lastname = document.getElementById('lastname').value;
    var phone = document.getElementById('phone').value;
    var day = document.getElementById('day').options[document.getElementById('day').selectedIndex].value;
    var month = document.getElementById('month').options[document.getElementById('month').selectedIndex].value;
    var year = document.getElementById('year').options[document.getElementById('year').selectedIndex].value;
    var data = new FormData()
    data.append('firstname' , firstname)
    data.append('lastname' , lastname)
    data.append('phone' , phone)
    data.append('day' , day)
    data.append('month' , month)
    data.append('year' , year)
    event.preventDefault()
    const id = AuthService.getProfile().id;
    const jsonData = tools.toJson(data);
    api.updateUser(id, jsonData)
    .then(res=>{
      const data = res.data;
      fetchUser();
      closeName();
      closesurName();
      closetel();
      closebirthday();
    })
      .catch(err => {
      console.log(err.response);
    })
  }

  const [validform, setValid] = useState(false);
  const [validform2, setValid2] = useState(false);
  const [validform3, setValid3] = useState(false);

  const handleSavePass = (event) => {
    var data = new FormData()
    var old_password = document.getElementById('old_password').value;
    var password = document.getElementById('password').value;
    var confirm_password = document.getElementById('confirm_password').value;
    event.preventDefault()
    data.append('old_password' , old_password)
    data.append('password' , password)
    const id = AuthService.getProfile().id;
    const jsonData = tools.toJson(data);
    if(old_password == password){
      setValid2(true)
      setValid(false);
      setValid3(false)
      return;
    } else if(password != confirm_password){
      setValid3(true)
      setValid(false);
      setValid2(false)
      return;
    }

    api.updatePassword(id, jsonData)
    .then(res=>{
      const data = res.data;
      ;
      fetchUser();
      closeShowchagepass();
    })
    .catch(err => {
      console.log(err.response);
      if(err.response.data.code == 1003){
        setValid(true)
        setValid2(false);
        setValid3(false)
      } else {
        console.log(err.response.data.code);
      }
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

  const [information, setInformation] = useState(false);
  const saveInformation = (event) => {
      
    if(!user) {
      return;
    }
    
    var checked = event.target.checked;
    if(checked){
      setInformation(true);
      var data = {'email' : user.email}
      api.insertSubcribe(data)
      .then(res => {
        const data = res.data;
        fetchUser();
      })
      .catch(err => {
        console.log(err.response);
      })
    }else{
      setInformation(false);
      var data = {'email' : user.email}
      api.delSubcribe(data)
      .then(res => {
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
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4>{t("mobile_profile:personal_profile")}</h4>
        </div>
        <Link href="/user/dashboard">
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
        </Link>
      </div>

      <div className="bg-gray-area">
        <div className="h-64px"></div>
        <div className="container bg-white">
          <a className="information-list-link" onClick={openName}>
            <p className="text-black my-auto">{t("mobile_profile:name")}</p>
            <div className="d-flex my-auto">
              <p className="text-black-50 my-auto mr-2">{user ? user.firstname : ''}</p>
              <i className="fas fa-chevron-right text-black-50 my-auto"></i>
            </div>
          </a>
        <a className="information-list-link" onClick={opensurName}>
            <p className="text-black my-auto">{t("mobile_profile:surname")}</p>
            <div className="d-flex my-auto">
              <p className="text-black-50 my-auto mr-2">{user ? user.lastname : ''}</p>
              <i className="fas fa-chevron-right text-black-50 my-auto"></i>
            </div>
          </a>
        </div>
        <div className="container bg-white mt-3">
          <a className="information-list-link">
            <p className="text-black my-auto">{t("mobile_profile:email")}</p>
            <p className="text-black-50 my-auto">{user && user.email}</p>

          </a>
          <a className="information-list-link" onClick={opentel}>
            <p className="text-black my-auto">{t("mobile_profile:phone_number")}</p>
            <div className="d-flex my-auto">
              <p className="text-black-50 my-auto mr-2">{user ? user.phone : ''}</p>
              <i className="fas fa-chevron-right text-black-50 my-auto"></i>
            </div>
          </a>
          <a className="information-list-link" onClick={openbirthday}>
            <p className="text-black my-auto">{t("mobile_profile:birthday")}</p>
            <div className="d-flex my-auto">
              <p className="text-black-50 my-auto mr-2">
                  {
                      user ?  (
                          user.birthdate ? getBirthDate(user.birthdate) : ''
                      ) : ''
                  }
              </p>
              <i className="fas fa-chevron-right text-black-50 my-auto"></i>
            </div>
          </a>
        </div>
        <div className="container bg-white mt-3">
            
          <a className="information-list-link" onClick={openShowchagepass} >
            <p className="text-black my-auto">{t("mobile_profile:change_password")}</p>
            <i className="fas fa-chevron-right text-black-50 my-auto"></i>

          </a>
          {
            user && (
              <>
              <a className="information-list-link">
                  <p className="text-black my-auto">{t("mobile_profile:subscribe")}</p>
                  <CustomInput type="switch" id="chx-shipping-as-specified" name="information" defaultValue="1" checked={information} onChange={saveInformation}  className="cu-book" />
                </a>
              </>
            )
          }
            
        </div>
      </div>
      <div className={classnames("information-name", { "show": Showname })}>
        <div className="container ">
          <div className="h-64px d-flex">
            <a className="btn-close-left" onClick={closeName}></a>
            <h3 className="text-black m-auto">{t("mobile_profile:name")}</h3>
          </div>
          <div className="input-for-edit">
            <input type="text" className="input_mobile" defaultValue={user ? user.firstname : ''} id="firstname" placeholder={t('mobile_profile:name')} required />
            <span className="input-border"></span>
          </div>
          <button className="btn bg-pink w-100 my-4 text-white" onClick={saveName}>{t("mobile_address:save")}</button>
        </div>
      </div>

      <div className={classnames("information-name", { "show": Showsurname })}>
        <div className="container ">
          <div className="h-64px d-flex">
            <a className="btn-close-left" onClick={closesurName}></a>
            <h3 className="text-black m-auto">{t("mobile_profile:surname")}</h3>
          </div>
          <div className="input-for-edit">
            <input type="text" className="input_mobile" defaultValue={user ? user.lastname : ''} id="lastname" placeholder={t('mobile_profile:surname')} required />
            <span className="input-border"></span>
          </div>
          <button className="btn bg-pink w-100 my-4 text-white" onClick={saveName}>{t("mobile_address:save")}</button>
        </div>
      </div>
      <div className={classnames("information-name", { "show": Showtel })}>
        <div className="container ">
          <div className="h-64px d-flex">
            <a className="btn-close-left" onClick={closetel}></a>
            <h3 className="text-black m-auto">{t("mobile_profile:phone_number")}</h3>
          </div>
          <div className="input-for-edit">
            <input type="text" className="input_mobile" defaultValue={user ? user.phone : ''} id="phone" placeholder={t('mobile_translations:please_phone_number')} required />
            <span className="input-border"></span>
          </div>
          <button className="btn bg-pink w-100 my-4 text-white" onClick={saveName}>{t("mobile_address:save")}</button>
        </div>
      </div>

      <div className={classnames("information-name", { "show": Showbirthday })}>
        <div className="container ">
          <div className="h-64px d-flex">
            <a className="btn-close-left" onClick={closebirthday}></a>
            <h3 className="text-black m-auto">{t("mobile_profile:birthday")}</h3>
          </div>
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

          <button className="btn bg-pink w-100 my-4 text-white" onClick={saveName}>{t("mobile_address:save")}</button>
        </div>
      </div>
      <div className={Showchagepass ? "chage-pass" : "d-none"}>
        <div className="cart-nav">
          <div className=" text-center cart-nav-title">
            <h4>{t("mobile_profile:change_password")}</h4>
          </div>
          
          <a className="btn-back cart-nav-back" onClick={closeShowchagepass}>
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>

        </div>

          <div className="bg-light-less-gray min-vh-100">
            <div className="h-64px"></div>
            <div className="container bg-white">
              <div className="information-list-link border-bottom-unset" >
                <div className="input-for-edit pr-2">
                  <input type={isPasswordShow ? "text" : "password"} minLength="6" id="old_password" name="old_password" className="input_mobile" placeholder={t('mobile_profile:current_password')} required />
                  <i className={isPasswordShow ? "fas fa-eye fa-flip-horizontal text-gray my-auto" : "fas fa-eye-slash fa-flip-horizontal text-pink my-auto"} onClick={togglePasswordVisiblity}></i>
                  <span className="input-border"></span>
                </div>
              </div>
              {
                validform && (
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-error pb-3">{t("mobile_profile:password_not_correct")}</span>
                  </div>
                )
              }

            </div>
            <div className="container bg-white mt-3 pb-3 ">
              <div className="information-list-link" >
                <p className="text-black my-auto">{t("mobile_profile:password_below")}</p>
              </div>
              <p className="p-12 mt-3">{t("mobile_profile:least_six")}</p>
              <div className="pt-4">
                <div className="input-for-edit pr-2">
                  <input type={isPasswordShowNew1 ? "text" : "password"} id="password" name="password" minLength="6" className="input_mobile" placeholder={t('mobile_profile:new_password')} required />
                  <i className={isPasswordShowNew1 ? "fas fa-eye fa-flip-horizontal text-gray my-auto" : "fas fa-eye-slash fa-flip-horizontal text-pink my-auto"} onClick={togglePasswordVisiblityNew1}></i>
                  <span className="input-border"></span>
                </div>

              </div>
              <div className="pt-4">
                <div className="input-for-edit pr-2">
                  <input type={isPasswordShowNew2 ? "text" : "password"} id="confirm_password" name="confirm_password" minLength="6" className="input_mobile" placeholder={t('mobile_profile:password_again')} required />
                  <i className={isPasswordShowNew2 ? "fas fa-eye fa-flip-horizontal text-gray my-auto" : "fas fa-eye-slash fa-flip-horizontal text-pink my-auto"} onClick={togglePasswordVisiblityNew2}></i>
                  <span className="input-border"></span>
                </div>
              </div>
              {
                validform2 && (
                  <div className="d-flex justify-content-between mt-3">
                    <span className="text-error pb-3">{t("mobile_profile:same_password")}</span>
                  </div>
                )
              }
              {
                validform3 && (
                  <div className="d-flex justify-content-between mt-3">
                    <span className="text-error pb-3">{t("mobile_profile:password_not_match")}</span>
                  </div>
                )
              }
            </div>
            <div className="footer-space"></div>
          </div>

          <a className=" btn-pink-submit text-white on-footer" onClick={handleSavePass}><h4 className="m-auto">{t("mobile_profile:change_password")}</h4></a>
      </div>
    </>
  )
}

export default MobileProfile