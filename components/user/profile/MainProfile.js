import React, { useEffect, useState } from 'react';
import Sidenav from '../../../components/user/sidenav';
import api from '../../../utils/api';
import AuthService from '../../../utils/AuthService';
import { Link, Router, withTranslation } from '../../../utils/i18n';
import tools from '../../../utils/tools';

const MainProfile = (props) => {
  const { t } = props;

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

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
  },[]);

   //Month Value
  const month = [t('january'), t('february'), t('march'), t('april'), 
  t('may'), t('june'), t('july'), t('august'), t('september'), t('october'), t('november'), t('december')];

  const handlePassword = (event) => {
    $('#edit-password').removeClass('d-none');
    $('#show-profile').addClass('d-none');
  }
  const handleShow = (event) => {
    $('#show-profile').removeClass('d-none');
    $('#edit-password').addClass('d-none');
  }

  const getBirthDate = str =>{
    let date = new Date(str);
    var day = date.getDate();
    if(day < 10) {
      day = '0'+day;
    }else{
      day;
    }
    return `${day} ${month[date.getMonth()]} ${date.getFullYear()}`
  }

  const [imgPassword1,setStateImg1] = React.useState(['icon-hide-password.svg'])
  const [imgPassword2,setStateImg2] = React.useState(['icon-hide-password.svg'])
  const [imgPassword3,setStateImg3] = React.useState(['icon-hide-password.svg'])
  const handlePassword1 = () => {
    var x = document.getElementById("old_password");
    if (x.type === "password") {
      x.type = "text";
      setStateImg1('icon-show-password.svg');
    } else {
      x.type = "password";
      setStateImg1('icon-hide-password.svg');
    }
  }
  const handlePassword2 = () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      setStateImg2('icon-show-password.svg');
    } else {
      x.type = "password";
      setStateImg2('icon-hide-password.svg');
    }
  }
  const handlePassword3 = () => {
    var x = document.getElementById("confirm_password");
    if (x.type === "password") {
      x.type = "text";
      setStateImg3('icon-show-password.svg');
    } else {
      x.type = "password";
      setStateImg3('icon-hide-password.svg');
    }
  }


  const handleSave = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const id = AuthService.getProfile().id;
    const jsonData = tools.toJson(data);
    api.updateUser(id, jsonData)
    .then(res=>{
      const data = res.data;
      //;
      fetchUser();
      $('#show-profile').removeClass('d-none');
      $('#edit-password').addClass('d-none');
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  const handleSavePass = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const id = AuthService.getProfile().id;
    const jsonData = tools.toJson(data);

    var old_password = $('#old_password').val();
    var password = $('#password').val();
    var confirm_password = $('#confirm_password').val();

    if(old_password == password){
      alert(t('same_password'));
      return;
    } else if(password != confirm_password){
      alert(t('password_not_match'));
      return;
    }

    api.updatePassword(id, jsonData)
    .then(res=>{
      const data = res.data;
      ;
      
      fetchUser();
      $('#show-profile').removeClass('d-none');
      $('#edit-password').addClass('d-none');
    })
    .catch(err => {
      //console.log(err.response);
      if(err.response.data.code == 1003){
        alert(t('password_not_correct'));
      } else {
        console.log(err.response.data.code);
      }
    })
  }
  


  const handleError = (error) => {
    console.log( error);
  }


  return ( 
    <>
      <Sidenav user={user} page="profile" >
        <div className="show-profile" id="show-profile">
          <div className="box-main-account">
            <div className="row mx-0 px-0">
              <div className="col-12 pl-0">
                <div className="mt-2 mb-4">
                  <h6 className="text-black">{t('personal_profile')}</h6>
                </div>
              </div>
            </div>
            <div className="row mx-0 px-0 mt-4">
              <div className="col-lg-4 col-md-6 col-12 mx-0 px-0 mb-md-3 d-flex">
                <div className="w-100">
                  <div>
                    <p>{t('name')}</p>
                  </div>
                  <div>
                    <p className="p-medium">{user ? user.firstname : ''}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12 mx-0 px-0 mb-md-3 d-flex">
                <div className="w-100">
                  <div>
                    <p>{t('surname')}</p>
                  </div>
                  <div>
                    <p className="p-medium">{user ? user.lastname : ''}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12 mx-0 px-0 mb-md-3 d-flex">
                <div className="w-100">
                  <div>
                    <p>{t('email')}</p>
                  </div>
                  <div>
                    <p className="p-medium text-transform-none">{user ? user.email : ''}</p>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6 col-12 mt-lg-4 mt-0 mx-0 px-0 mb-md-3 d-flex">
                <div className="w-100">
                  <div>
                    <p>{t('phone_number')}</p>
                  </div>
                  <div>
                    <p className="p-medium">{user ? user.phone : ''}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12 mt-lg-4 mt-0  mx-0 px-0 mb-md-3 d-flex">
                <div className="w-100">
                  <div>
                    <p>{t('birthday')}</p>
                  </div>
                  <div>
                    <p className="p-medium">
                      {
                        user ?  (
                          user.birthdate ? getBirthDate(user.birthdate) : ''
                        ) : ''
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mx-0 px-0 mt-4">
              <div className="col-12 mx-0 px-0 ">
                <div className="">
                  <div className="">
                    <Link href={'/user/edit-profile'} as={`/user/edit-profile`}>
                      <button className="btn btn-primary" type="button">{t('edit_profile')}</button>
                    </Link>
                    <Link href={'/user/profile-password'} as={`/user/profile-password`}>
                      <button className="btn btn-outline-primary ml-3" type="button">{t('change_password')}</button>
                    </Link>
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

export default MainProfile