import React, { useState,useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'

import { Link, withTranslation } from '../../utils/i18n'
import withAuth from '../../utils/withAuth'
import api from '../../utils/api';
import Sidenav from '../../components/user/sidenav'
import AuthService from '../../utils/AuthService'
import tools from '../../utils/tools'
import Router from 'next/router'
import ImageInput from '../../components/ImageInput'

const EditProfile = (props) => {
  const { t } = props;
  const [user, setUser] = useState();
  const [userID, setUserID] = useState(0);


  const [toggle,setToggle] = useState(false);
  const [sidenav,setSidenav] = useState(true);

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
    fetchUser()
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
    
  },[]);

   //Month Value
  const day = [];
  for (var i = 1; i <= 31; i++) {
    if(i < 10) {
      i = '0' + i
    }
    day.push(i);
  }
  const month = [t('january'), t('february'), t('march'), t('april'), 
  t('may'), t('june'), t('july'), t('august'), t('september'), t('october'), 
  t('november'), t('december')];

  const year = [];
  for (var i = 2547; i >= 2400; i--) {
    year.push(i);
  }
  

  const handleSaveAddress = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const id = AuthService.getProfile().id;
    // const jsonData = tools.toJson(data);
    api.updateUser(id, data)
    .then(res=>{
      const data = res.data;
      ;
      fetchUser();
      Router.push('/user/profile');
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  const redirectBack = () => {
    history.back();
  }

  const handleError = (error) => {
    console.log( error);
  }
  
  return (
 
  <Layout title="User | Edit Profile" handleToggle={handleToggle} handleCloseToggle={handleCloseToggle} 
    handleLink={handleLink}>
    <Sidenav user={user} menuToggle={sidenav} page="profile" >
      <div className="box-main-account">
        <div className="row mx-0 px-0">
          <div className="col-12 pl-0">
            <div className="mt-2 mb-4">
              <h6 className="text-black">{t('my_profile')}</h6>
            </div>
            {/* <div className="main">
              <div className="">
                <div className="">
                  <h4 className="">{t('my_profile')} </h4>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="edit-profile" id="edit-profile">
          <form id="profile-form" onSubmit={handleSaveAddress} encType="multipart/form-data">
            <div className="row mx-0 px-0">
              <div className="col-12 pr-lg-2 pl-0 pr-0 pr-md-2 mb-3">
                <div>
                  <ImageInput 
                  picture={ user && user.picture ? user.picture : '/images/no-picture.png'} 
                  name="picture"/>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12 pr-lg-2 pl-0 pr-0 pr-md-2 d-flex">
                <div className="w-100">
                  <div>
                    <p>{t('name')}</p>
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control" name="firstname"  pattern="[A-Za-zก-๏\s]+" title={t('a_z')} defaultValue={user ? user.firstname : ''} placeholder={t('name')} required />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12 pl-lg-2 pl-0 pr-lg-2 pr-0 d-flex">
                <div className="w-100">
                  <div>
                    <p>{t('surname')}</p>
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control" name="lastname"  pattern="[A-Za-zก-๏\s]+"  title={t('a_z')}  defaultValue={user ? user.lastname : ''} placeholder={t('surname')} required />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12 pr-0 pl-lg-2 pl-0 d-flex">
                <div className="w-100">
                  <div>
                    <p>{t('email')}</p>
                  </div>
                  <div>
                    <p className="p-medium text-transform-none">{user ? user.email : ''}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mx-0 px-0 mt-2">
              <div className="col-lg-4 col-md-6 col-12 pr-lg-2 pl-0 pr-0  pr-md-2 d-flex">
                <div className="w-100">
                  <div>
                    <p>{t('phone_number')}</p>
                  </div>
                  <div className="form-group">
                    <input type="tel" className="form-control" name="phone" defaultValue={user ? user.phone : ''}   minLength="9" maxLength="15" pattern='[0-9.+-]*' title={`${t('number')} 0-9 +-`} placeholder={t('please_phone_number')} />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12 pl-lg-2 pl-0 pr-lg-2 pr-0 d-flex">
                <div className="w-100">
                  <div>
                    <p>{t('birthday')}</p>
                  </div>
                  <div>
                    <div className="styleSelect input-day">
                      <div className="d-block position-relative">
                        <select className="form-control border-radius-right-none" name="day" id="">
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
                        <img src="/icon/icon-arrow-down.svg" className="select-icon" />
                      </div>
                    </div>
                    <div className="styleSelect input-month">
                      <div className="d-block position-relative">
                        <select className="form-control border-radius-none" name="month" id="month">
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
                        <img src="/icon/icon-arrow-down.svg" className="select-icon" />
                      </div>
                    </div>
                    <div className="styleSelect input-year">
                      <div className="d-block position-relative">
                        <select className="form-control border-radius-left-none" name="year" id="">
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
                        <img src="/icon/icon-arrow-down.svg" className="select-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mx-0 px-0 mt-4">
              <div className="col-12 px-0">
                <div className="">
                  {/* <p>{t('subscribe')}</p> */}
                  <div className="">
                    <button className="btn btn-primary" type="submit">{t('confirm')}</button>
                    <button className="btn btn-outline-primary ml-3" type="button" onClick={redirectBack}>{t('cancel')}</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div> 
    </Sidenav>
  </Layout>
)}
export default withTranslation(['edit_profiles'])(EditProfile)