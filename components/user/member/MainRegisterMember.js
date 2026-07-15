import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Sidenav from '../../../components/user/sidenav'
import api from '../../../utils/api'
import AuthService from '../../../utils/AuthService'
import { Link } from '../../../utils/i18n'
import tools from '../../../utils/tools'

const MainRegisterMember = (props) => {
  const { t } = props;
  const [user, setUser] = useState();
  const [userID, setUserID] = useState(0);

  const [toggle,setToggle] = useState(false);
  const [sidenav,setSidenav] = useState(true);

  const [validPhone, setValid] = useState(false);

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
    $('#modal-success').on('hidden.bs.modal', function (e) {
      $('#modal-success').modal('hide');
      setTimeout(function() {
        Router.push('/user/member')
      }, 200);
    })
  },[]);

   //Month Value
  const day = [];
  for (var i = 1; i <= 31; i++) {
    if(i < 10) {
      i = '0' + i
    }
    day.push(i);
  }
  const month = [t('translations:january'), t('translations:february'), t('translations:march'), t('translations:april'), 
  t('translations:may'), t('translations:june'), t('translations:july'), t('translations:august'), t('translations:september'), t('translations:october'), 
  t('translations:november'), t('translations:december')];

  const year = [];
  for (var i = 2547; i >= 2400; i--) {
    year.push(i);
  }
  

  const handleSave = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const id = AuthService.getProfile().id;
    const jsonData = tools.toJson(data);
    console.log(id,jsonData)
    /*api.registerMember(id, jsonData)
    .then(res=>{
      const data = res.data;
      ;
      fetchUser();
      //$('#modal-success').modal('toggle');
      //Router.push(`/user/member-tranfer/${id}`);
      Router.push(`/user/member`);
    })
    .catch(err => {
      if(!err.response) {
        setValid(t('disconnect_server'));
        return;
      }
      if(err.response.data.code == 1101){
        setValid(true);
      }
      console.log(err.response);
    })*/
  }

  const redirectBack = () => {
    history.back();
  }
  const handleSavemodal = () => {
    $('#modal-success').modal('hide');
    setTimeout(function() {
      Router.push('/user/member')
    }, 200);
    
  }
  const handleSavemodalhome = () => {
    $('#modal-success').modal('hide');
    setTimeout(function() {
      Router.push('/')
    }, 200);
  }
  

  const handleError = (error) => {
    console.log( error);
  }

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);
  
 

  return (
    <>
      <Sidenav user={user} menuToggle={sidenav} page="member" >
        <div className="box-main-account">
          <div className="row mx-0 px-0">
            <div className="col-12 pl-0">
              <div className="mt-2 mb-4">
                <h6 className="text-black">{t('register_premium')}</h6>
              </div>
              {/* <div className="main">
                <div className="">
                  <div className="">
                    <h4 className="">{t('register_premium')} </h4>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className="edit-profile" id="edit-profile">
            <form id="profile-form" onSubmit={handleSave}>
              {
                user && (
                  <>
                  <div className="row mx-0 px-0 mt-4">
                    <div className="col-lg-4 col-md-6 col-12 pr-lg-2 pl-0 pr-0 d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('name_prefix')} <span className="text-danger">*</span></p>
                        </div>
                        <div className="styleSelect w-100">
                            <div className="d-block position-relative">
                              <select className="form-control" name="prefix" id="prefix">
                                <option value="07">{t('mr_mrs')}</option>
                              </select>
                              <img src="/icon/icon-arrow-down.svg" className="select-icon" />
                            </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12 pl-lg-2 pl-0 pr-lg-2 pr-0 d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('translations:name')} <span className="text-danger">*</span></p>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="firstname" defaultValue={user.firstname} placeholder={t('translations:please_name')} required />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12 pr-0 pl-lg-2 pl-0 d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('translations:surname')} <span className="text-danger">*</span></p>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="lastname" defaultValue={user.lastname} placeholder={t('translations:please_surname')} required />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mx-0 px-0">
                    <div className="col-lg-4 col-md-6 col-12 pr-lg-2 pl-0 pr-0 d-flex mt-2">
                      <div className="w-100">
                        <div>
                          <p>{t('translations:birthday')} <span className="text-danger">*</span></p>
                        </div>
                        <div className="mb-2">
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
                    <div className="col-lg-4 col-md-6 col-12 pl-lg-2 pl-0 pr-lg-2 pr-0 d-flex mt-2">
                      <div className="w-100">
                        <div>
                          <p>{t('translations:email')} <span className="text-danger">*</span></p>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="email" defaultValue={user.email} placeholder={t('translations:please_email')} required />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12 pr-0 pl-lg-2 pl-0 d-flex mt-2">
                      <div className="w-100">
                        <div>
                          <p>{t('translations:phone_number')} <span className="text-danger">*</span></p>
                        </div>
                        <div className="form-group mb-0">
                          <input type="text" className="form-control" name="phone" defaultValue={user.phone} minLength="9" maxLength="10"  pattern="[0-9]*" placeholder={t('translations:please_phone_number')} required />
                        </div>
                        {
                          validPhone ? (
                            <span className="font-14 text-danger">{t('member_phone')}</span>
                          ) : ''
                        }
                      </div>
                    </div>
                  </div>
                  <div className="row mx-0 px-0 mt-2">
                    <div className="col-12 px-0">
                      <div className="form-group">
                          <div className="custom-control custom-checkbox mb-3">
                            <input type="checkbox" className="custom-control-input" id="customCheck" name="information" value="1" required />
                            <label className="custom-control-label" htmlFor="customCheck">
                            <p>
                              {t('translations:read_understood')} 
                              <Link href={'/privacy_policy/condition'} as={`/privacy_policy/condition`}>
                                <a className="text-success" target="_blank">{t('translations:privacy_policy')}</a>
                              </Link>
                            </p>
                            </label>
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mx-0 px-0 mt-4">
                    <div className="col-12 px-0">
                      <div className="">
                        <div className="float-right">
                          <Link href={'/user/member-activate'} as={`/user/member-activate`}>
                            <button className="btn btn-outline-primary" type="button">{t('already_a_member')}</button>
                          </Link>
                          <button className="btn btn-primary ml-3" type="submit">{t('translations:confirm')}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                )
              }
              
            </form>
          </div>
        </div> 
        <div className="modal fade" id="modal-success" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content default-radius">
              <div className="modal-body">
                  <div className="text-center py-5">
                  <div>
                      <img src="/icon/premium-success.svg" alt="" className="" />
                  </div>
                  <div className="mt-4">
                      <h4 className="text-pink">{t('translations:membership_confirmation')}</h4>
                  </div>
                  <div className="mt-4">
                    <p>{t('translations:enjoy_special')}</p>
                  </div>
                  <div className="mt-5">
                      <button type="button" className="btn btn-outline-primary mr-3" onClick={handleSavemodal}>{t('translations:read_more')}</button>
                      <button type="button" className="btn btn-primary" onClick={handleSavemodalhome}>{t('translations:shop_now')}</button>
                  </div>
                  </div>
              </div>
              </div>
          </div>
        </div>
      </Sidenav>
    </>
  )
}

export default MainRegisterMember