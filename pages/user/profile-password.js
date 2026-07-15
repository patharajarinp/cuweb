import Link from 'next/link'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout'
import Sidenav from '../../components/user/sidenav'
import api from '../../utils/api'
import AuthService from '../../utils/AuthService'
import tools from '../../utils/tools'


const Profile = (props) => {
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
  const month = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

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
      ;
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
      alert('รหัสผ่านใหม่ ตรงกับ รหัสผ่านปัจจุบัน');
      return;
    } else if(password != confirm_password){
      alert('รหัสผ่านใหม่ และ ยืนยันรหัสผ่านใหม่ ไม่ตรงกัน');
      return;
    }

    api.updatePassword(id, jsonData)
    .then(res=>{
      const data = res.data;
      ;
      
      fetchUser();
      Router.push('/user/profile');
    })
    .catch(err => {
      console.log(err.response);
      if(err.response.data.code == 1003){
        alert('รหัสผ่านปัจจุบันไม่ถูกต้อง');
      } else {
        console.log(err.response.data.code);
      }
    })
  }
  


  const handleError = (error) => {
    console.log( error);
  }

  
  return (
 
  <Layout title="User | Change Password" handleToggle={handleToggle} handleCloseToggle={handleCloseToggle} 
    handleLink={handleLink}>
    <Sidenav user={user} menuToggle={sidenav} page="profile" >
        <div className="" id="edit-password">
          <div className="box-main-account">
            <div className="row mx-0 px-0">
              <div className="col-12 pl-0">
                <div className="mt-2 mb-4">
                  <h6 className="text-black">เปลี่ยนรหัสผ่าน</h6>
                </div>
                {/* <div className="main">
                  <div className="">
                    <div className="">
                      <h4 className="">เปลี่ยนรหัสผ่าน</h4>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <form id="password-form" onSubmit={handleSavePass}>
              <div className="row mx-0 px-0 mt-4">
                <div className="col-lg-6 col-12 px-0 d-flex">
                  <div className="w-100">
                    <div>
                      <p>รหัสผ่านปัจจุบัน</p>
                    </div>
                    <div className="form-group">
                      <div className="position-relative">
                        <input type="password" id="old_password" className="form-control" name="old_password" placeholder="กรุณาระบุรหัสผ่านปัจจุบัน" minLength="6" required/>
                        <img src={`/icon/${imgPassword1}`} id="toggle-password" alt="" className="toggle-password" onClick={handlePassword1} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mx-0 px-0">
                <div className="col-lg-6 col-12 px-0 d-flex">
                  <div className="w-100">
                    <div>
                      <p>รหัสผ่านใหม่</p>
                    </div>
                    <div className="form-group">
                      <div className="position-relative">
                        <input type="password" id="password" className="form-control" name="password" placeholder="ต้องมีทั้งตัวเลขและตัวอักษร อย่างน้อย 6 ตัว" minLength="6"  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" title="ต้องมีทั้งตัวเลข ตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก อย่างน้อย 6 ตัว"  required/>
                        <img src={`/icon/${imgPassword2}`} id="toggle-password" alt="" className="toggle-password" onClick={handlePassword2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mx-0 px-0">
                <div className="col-lg-6 col-12 px-0 d-flex">
                  <div className="w-100">
                    <div>
                      <p>พิมพ์รหัสผ่านใหม่อีกครั้ง</p>
                    </div>
                    <div className="form-group">
                      <div className="position-relative">
                        <input type="password" id="confirm_password" className="form-control" name="confirm_password" placeholder="กรุณาระบุรหัสผ่านซ้ำ"   minLength="6" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" title="ต้องมีทั้งตัวเลข ตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก อย่างน้อย 6 ตัว" required/>
                        <img src={`/icon/${imgPassword3}`} id="toggle-password" alt="" className="toggle-password" onClick={handlePassword3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mx-0 px-0 mt-4">
                <div className="col-12 px-0">
                  <div className="">
                    <div className="">
                      <button className="btn btn-primary" type="submit">ยืนยันการแก้ไข</button>
                      <Link href={'/user/profile'} as={`/user/profile`}>
                        <button className="btn btn-outline-primary ml-3" type="button">ยกเลิก</button>
                      </Link>
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
export default Profile