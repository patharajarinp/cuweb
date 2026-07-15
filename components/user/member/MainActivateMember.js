import classNames from 'classnames'
import Router from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import Sidenav from '../../../components/user/sidenav'
import Loadbutton from '../../../components/widget/Button'
import UserContext from '../../../contexts/UserContext'
import api from '../../../utils/api'
import AuthService from '../../../utils/AuthService'
import { Link } from '../../../utils/i18n'
import tools from '../../../utils/tools'

const MainActivateMember = (props) => {
  const { t } = props;

  const {user,handleCart, fetchUser} = useContext(UserContext);
  const [userID, setUserID] = useState(0);

  const [toggle,setToggle] = useState(false);
  const [sidenav,setSidenav] = useState(true);
  const [OTP, setOTP] = useState(0);
  const [token, settoken] = useState()
  const [reOtp, setreOtp] = useState(true)
  const [errorOtp, seterrorOtp] = useState(false)
  const [loading, setLoading] = useState(false)

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


  // const  fetchUser = () => {
  //   api.getProfile().then(res =>{
  //       const data = res.data;
  //       setUser(data);
  //   })
  //   .catch(err =>{
  //     console.log(err.response);
  //   })
  // };
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
  t('translations:may'), t('translations:june'), t('translations:july'), t('translations:august'), t('translations:september'), t('october'), 
  t('translations:november'), t('translations:december')];

  const year = [];
  for (var i = 2547; i >= 2400; i--) {
    year.push(i);
  }
  

  const handleSave = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const id = AuthService.getProfile().id;
    data.append("token",token.token)
    const jsonData = tools.toJson(data);
    setLoading(true)

    if($('#phone').val() == '' && $('#member_id').val() == ''){
      alert(t('translations:please_phone_number'));
    }else{
      api.activateMember(id, jsonData)
      .then(res=>{
        const data = res.data;
        setLoading(false)
        
        fetchUser();
        $('#modal-success').modal('toggle');
      })
      .catch(err => {
        if(err.response.data.code == '1001') {
          alert(t('phone_number_cannot'));
        }else if(err.response.data.code == '1101') {
          alert(t('member_exists'));
        }
        if(err.response){
          seterrorOtp(true)
         
        } 
        setLoading(false)
        console.log(err.response);
      })
    }
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


  const getOTP = () => {
    seterrorOtp(false)
    var phone = document.getElementById("phone").value;
    if(phone.length == 10) {
      const id = AuthService.getProfile().id;
      // const jsonData = tools.toJson(phone);
      api.checkPhome(id, {phone})
      .then(res=>{
        const data = res.data;
        console.log(data)
        let tmp = {phone}
        tmp.token = data.token
        settoken(tmp)
        setreOtp(true)
        setOTP(1);
        reOTP()
        ;
      })
      .catch(err => {
        if(err.response.data.code == '1001') {
          alert(t('phone_number_cannot'));
        }else if(err.response.data.code == '1101') {
          alert(t('member_exists'));
        }
        console.log(err.response);
        
      })
      
    }else{
      alert(t('correct_phone_number'));
    }
    
  }
   

  const handleError = (error) => {
    console.log( error);
  }
  const reOTP = ()=>{
    setTimeout(()=>{
      setreOtp(false)
    },60000)
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
              <h6 className="text-black">{t('confirm_membership')}</h6>
            </div>
            {/* <div className="main">
              <div className="">
                <div className="">
                  <h4 className="">{t('confirm_membership')} </h4>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="edit-profile" id="edit-profile">
          <form id="profile-form" onSubmit={handleSave}>
            <div className="row justify-content-center mx-0 px-0">
              <div className="col-xl-6 col-lg-8 col-md-8 col-12 d-flex">
                <div className="w-100">
                  <div className="form-group">
                      <label>{t('translations:phone_number')}</label>
                      <input type="text" id="phone" className="form-control" name="phone" placeholder={t('translations:please_phone_number')} minLength="9" maxLength="10"  pattern="[0-9]*"   />
                  </div>
                </div>
              </div>
            </div>
            <div className={classNames(OTP == 1 ? 'd-none' : '')}>
              <div className="row  justify-content-center mx-0 px-0">
                <div className="col-xl-6 col-lg-8 col-md-8 col-12">
                  <div>
                    <div className="">
                    
                        <button className="btn btn-primary w-100" type="button" onClick={getOTP}>{t('translations:confirm')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classNames(OTP == 0 ? 'd-none' : '')}>
              <div className="row justify-content-center mx-0 px-0">
                <div className="col-xl-6 col-lg-8 col-md-8 col-12 d-flex">
                  <div className="w-100">
                    <div className="form-group">
                        <label>{t('translations:confirm_otp')}</label>
                        <input type="text" id="otp" className="form-control" name="otp" placeholder={t('translations:please_otp')} minLength="4" maxLength="4"  pattern="[0-9]*" required=""  />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`row justify-content-center mx-0 px-0 ${errorOtp ? 'd-flex':'d-none'}`}>
                <div className="col-xl-6 col-lg-8 col-md-8 col-12 d-flex">
                  <div className="w-100">
                    <div className="form-group">
                      <span className="text-danger">รหัส OTP ไม่ถูกต้อง หรือหมดอายุ </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center mx-0 px-0">
                <div className="col-xl-6 col-lg-8 col-md-8 col-12 d-flex">
                  <div className="w-100">
                    <div className="form-group">
                      <button className="btn btn-outline-primary w-100" type="button" disabled={reOtp}  onClick={getOTP} >ขอรับรหัส OTP อีกครั้ง</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row justify-content-center mx-0 px-0">
                <div className="col-xl-6 col-lg-8 col-md-8 col-12 d-flex">
                  <div className="w-100">
                    <div className="form-group">
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="customCheck" name="information" value="1" required />
                        <label className="custom-control-label" htmlFor="customCheck">
                        <p className="mb-0">{t('translations:read_understood')}</p>
                        <p><a onClick={()=>{window.open('/privacy_policy/condition')}} ><font className="text-success">{t('translations:privacy_policy')}</font></a></p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row  justify-content-center mx-0 px-0">
                <div className="col-xl-6 col-lg-8 col-md-8 col-12">
                  <div>
                    <div className="">
                   
                      {loading?<Loadbutton loading={loading} name="btn-member" click={() => {  }} />:
                      <button className="btn btn-primary w-100" type="submit">{t('translations:confirm')}</button>
                      }
                    
                        
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </form>
          <div className="row  justify-content-center mx-0 px-0 mt-4">
            <div className="col-xl-6 col-lg-8 col-md-8 col-12">
              <div>
                <div className="text-center">
                  <Link href={'/user/member-register'} as={`/user/member-register`}>
                    <a className="text-black">{t('not_registered_premium')}</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
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

export default MainActivateMember