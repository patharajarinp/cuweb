import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import Router from 'next/router';
import Sidenav from '../../../components/user/sidenav';
import myData from '../../../public/json/raw_database.json';
import api from '../../../utils/api';
import AuthService from '../../../utils/AuthService';
import { Link } from '../../../utils/i18n';
import tools from '../../../utils/tools';

const AddAddress = (props) => {
  const { t } = props;

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  const [user, setUser] = useState();
  const [province, setProvince] = useState();
  const [amphoe, setAmphoe] = useState();
  const [district, setDistrict] = useState();
  const [zipcode, setZipcode] = useState();
  const [userID, setUserID] = useState(0);
  const [tax, setTax] = useState(false);
  const [individual, setIndividual] = useState(1);
  const [home, setHome] = useState(false);
  const [work, setWork] = useState(false);
  const [branch, setBranch] = useState(0);

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
      // console.log(err.response);
    })
  };
  const getOptionAddress = (obj , index = 'กรุงเทพมหานคร')=>{
    var prov = groupBy(obj,'province');
    var amp = groupBy(prov[index],'amphoe')
    var district = groupBy(amp[Object.keys(amp)[0]],'district')
    setProvince(prov)
    setAmphoe(amp)
    setDistrict(district)
    setZipcode(groupBy(district[Object.keys(district)[0]],'zipcode'))
  }
 
  const onChangeProv = (e) => {
    getOptionAddress(myData,e.target.options[e.target.selectedIndex].text)
  }

  const getOptionAmphoe = (index = 0)=>{
    var district = groupBy(amphoe[index],'district')
    setDistrict(district)
    setZipcode(groupBy(district[Object.keys(district)[0]],'zipcode'))
    // console.log(groupBy(amphoe[index],'zipcode'));
  }

  const onChangeAmphoe = (e) => {
    getOptionAmphoe(e.target.options[e.target.selectedIndex].text)
  }

  const getOptionDistrict = (index = 0)=>{
    setZipcode(groupBy(district[index],'zipcode'))
  }

  const onChangeDistrict = (e) => {
    getOptionDistrict(e.target.options[e.target.selectedIndex].text)
  }

  useEffect(() => {
    fetchUser()
    getOptionAddress(myData)
  },[]);

  const handleSave = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const id = AuthService.getProfile().id;
    const jsonData = tools.toJson(data);
    api.insertAddress(id, jsonData)
    .then(res=>{
      const data = res.data;
      // ;
      fetchUser();
      Router.push('/user/address')
      // history.back();
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  const validateNum =(event) =>{
    var keycode = event.which;
    if (!(event.shiftKey == false && (keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
      event.preventDefault();
    }

  }

  const handleError = (error) => {
    console.log( error);
  }

  const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };
  

  const changetoHome = () => {
    setHome(true);
    setWork(false);
    setTax(false);
    setIndividual(2);
  }
  const changetoOffice = () => {
    setHome(false);
    setWork(true);
    setTax(false);
    setIndividual(2);
  }
  const changetoTax = () => {
    setHome(false);
    setWork(false);
    setTax(true);
    setIndividual(1);
  }

  const change = (e) => {
    var val = $(e.target).data('id');
    setIndividual(val)
  }

  const changeBranch = (e) => {
    var val = $(e.target).data('id');
    if(val == 0) {
      document.getElementById("branch_code").value = "";
    }
    setBranch(val);
  }

  const chkData = (e) => {
    var val = e.target.value;
    if(val != "" || val != null) {
      setBranch(1)
    }else{
      setBranch(0)
    }
  }

  return ( 
    <>
      <Sidenav user={user} page="address" >
        <div className="box-main-account">
          <div className="row mx-0 px-0">
            <div className="col-12 pl-0">
              <div className="mt-2 mb-4">
                  <h6 className="text-black">{t('add_address')}</h6>
              </div>
              {/* <div className="main">
                <div className="">
                  <div className="">
                    <h4 className="">{t('add_address')}</h4>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className="edit-profile" id="edit-profile">
            <form id="profile-form" onSubmit={handleSave}>
              <div className="row mx-0 px-0">
                <div className="col-12 px-0">
                  <div>
                    <p>{t('select_delivery')}</p>
                    <div className="radio-toolbar">
                        <input type="radio" id="radioHome" name="at" value="home" defaultChecked onClick={changetoHome} />
                        <label htmlFor="radioHome" className="ml-0">{t('home')}</label>

                        <input type="radio" id="radioWork" name="at" value="work" onClick={changetoOffice} />
                        <label htmlFor="radioWork">{t('office')}</label>

                        <input type="radio" id="radioTax" name="at" value="tax" onClick={changetoTax} />
                        <label htmlFor="radioTax">{t('tax')}</label>
                    </div>
                    {/* <div className="">
                      <button className="btn btn-primary" type="button">{t('office')}</button>
                      <button className="btn btn-outline-primary ml-4" type="button">{t('home')}</button>
                    </div> */}
                  </div>
                </div>
              </div>
              {
                tax && (
                  <div className="row mt-4">
                    <div className="col-lg-4 col-12 d-flex">
                      <div className="form-group">
                        <label className="radio-button">
                          <input type="radio" className="radio-button__input" name="individual" value="1" defaultChecked={individual == 1 ? 'checked' : ''} data-id="1" onChange={change} /> 
                          <span className="radio-button__control"></span>
                          <span className="radio-button__label"></span>
                          {t('individual')}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-4 col-12 d-flex">
                      <div className="form-group">
                        <label className="radio-button">
                          <input type="radio" className="radio-button__input" name="individual" value="2" defaultChecked={individual == 2 ? 'checked' : ''} data-id="2" onChange={change} />
                          <span className="radio-button__control"></span>
                          <span className="radio-button__label"></span>
                          {t('institution')}
                        </label>
                      </div>
                    </div>
                  </div>
                )
              }
              <div className={classNames("row", !tax && 'mt-4')}>
                <div className="col-lg-4 col-12 d-flex">
                  <div className="w-100">
                    <div>
                      <p>
                        {
                          tax ? (
                            t('name_on_receipt')
                          ) : (
                            t('name')
                          )
                        }
                        
                        <span className="text-pink">*</span>
                      </p>
                    </div>
                    <div className="form-group">
                      <input type="text" className="form-control" name="firstname"  pattern="[A-Za-zก-๏\s]+"  title={t('a_z')} placeholder={t('name_surname')} required />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-12 d-flex">
                  <div className="w-100">
                    <div>
                      {
                        (tax && individual == 2) ? (
                          <p>{t('surname')}</p>
                        ) : (
                          <p>{t('surname')}<span className="text-pink">*</span></p>
                        )
                      }
                    
                    </div>
                    <div className="form-group">
                      <input type="text" className="form-control" name="lastname"  pattern="[A-Za-zก-๏\s]+"  title={t('a_z')} placeholder={t('surname')}  />
                    </div>
                  </div>
                </div>
                {
                  
                  tax && (
                    <div className="col-lg-4 col-12 d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('tax_id')}<span className="text-pink">*</span></p>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="tax_id" required maxLength="20" onKeyPress={() => validateNum(event) } placeholder={t('please_tax')} />
                        </div>
                      </div>
                    </div>
                  ) 
                }
                {
                  work && (
                    <div className="col-lg-4 col-12 office">
                      <div className="w-100">
                        <div>
                          <p>{t('company_name')}<span className="text-pink">*</span></p>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control office-required" name="company_name" maxLength="" placeholder={t('company_name')} />
                        </div>
                      </div>
                    </div>
                  )
                }
                
                {
                  !tax && (
                    <>
                    <div className="col-lg-4 col-12 d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('phone_number')}<span className="text-pink">*</span></p>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="phone" minLength="9" maxLength="15" pattern="[0-9.+-]*" title={`${t('number')} 0-9 +-`} placeholder={t('please_phone_number')} required/>
                        </div>
                      </div>
                    </div>
                    </>
                  )
                }
                
              {/* </div>
              <div className="row mx-0 px-0 mt-2"> */}
                <div className="col-lg-4 col-12 d-flex">
                  <div className="w-100">
                    <div>
                      <p>{t('address')}<span className="text-pink">*</span></p>
                    </div>
                    <div className="form-group">
                      <input type="text" className="form-control" name="address" placeholder={t('please_address')} required />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-12 d-flex">
                  <div className="w-100">
                    <div>
                      <p>{t('province')}<span className="text-pink">*</span></p>
                    </div>
                    <div className="form-group styleSelect">
                      <div className="d-block position-relative">
                        <select className="form-control" name="province_code" id="" onChange={onChangeProv}>
                          {
                            province ? Object.keys(province).map((prov,index)=>(
                              <option value={province[prov][0].province_code} key={prov}>{prov}</option>
                            )) : ''
                          }
                        </select>
                        <img src="/icon/icon-arrow-down.svg" className="select-icon" />
                      </div>
                    </div>
                    {/* <div className="form-group">
                      <input type="text" className="form-control" name="province" placeholder="{t('please_province')}" />
                    </div> */}
                  </div>
                </div>
                <div className="col-lg-4 col-12 d-flex">
                  <div className="w-100">
                    <div>
                      <p>{t('district')}<span className="text-pink">*</span></p>
                    </div>
                    <div className="form-group styleSelect">
                      <div className="d-block position-relative">
                        <select className="form-control" name="ampher" id="" onChange={onChangeAmphoe}>
                          {
                            amphoe ? Object.keys(amphoe).map((amp,index)=>(
                              <option value={amp} key={amp}>{amp}</option>
                            )) : ''
                          }
                        </select>
                        <img src="/icon/icon-arrow-down.svg" className="select-icon" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-12 d-flex">
                  <div className="w-100">
                    <div>
                      <p>{t('sub_district')}<span className="text-pink">*</span></p>
                    </div>
                    <div className="form-group styleSelect">
                      <div className="d-block position-relative">
                        <select className="form-control" name="district" id="" onChange={onChangeDistrict}>
                          {
                            district ? Object.keys(district).map((dis,index)=>(
                              <option value={dis} key={dis}>{dis}</option>
                            )) : ''
                          }
                        </select>
                        <img src="/icon/icon-arrow-down.svg" className="select-icon" />
                      </div>
                    </div>
                  </div>
                </div>
                
              {/* </div>
              <div className="row mx-0 px-0 mt-2"> */}
                <div className="col-lg-4 col-12 d-flex">
                  <div className="w-100">
                    <div>
                      <p>{t('postcode')}<span className="text-pink">*</span></p>
                    </div>
                    <div className="form-group styleSelect">
                      <div className="d-block position-relative">
                        <select className="form-control" name="post" id="">
                          {
                            zipcode ? Object.keys(zipcode).map((zip)=>(
                              <option value={zip} key={zip}>{zip}</option>
                            )) : ''
                          }
                        </select>
                        <img src="/icon/icon-arrow-down.svg" className="select-icon" />
                      </div>
                    </div>
                  </div>
                </div>
                {
                  !tax && (
                    <>
                    <div className="col-lg-4 col-12 d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('tax_id')}</p>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="tax_id" maxLength="20" onKeyPress={() => validateNum(event) } placeholder={t('please_tax')} />
                        </div>
                      </div>
                    </div>
                    
                    </>
                  )
                }

                {
                  work && (
                    <div className="col-lg-4 col-12 office">
                      <div className="w-100">
                        <div>
                          <p>{t('branch_code')}</p>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="branch_code" maxLength="" placeholder={t('branch_code')} />
                        </div>
                      </div>
                    </div>
                  )
                }
                {
                  tax && (
                    <div className="col-lg-4 col-12 d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('phone_number')}<span className="text-pink">*</span></p>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="phone"minLength="9" maxLength="15" pattern="[0-9.+-]*" title={`${t('number')} 0-9 +-`} placeholder={t('please_phone_number')} required/>
                        </div>
                      </div>
                    </div>
                  )
                }

                {
                  (tax && individual == 2) && (
                    <div className="col-lg-4 col-12 office">
                      <div className="w-100">
                        <div>
                          <label className="radio-button">
                            <input type="radio" className="radio-button__input" name="branch" checked={branch == 0 ? 'checked' : ''} data-id="0" onChange={changeBranch} /> 
                            <span className="radio-button__control"></span>
                            <span className="radio-button__label"></span>
                            {t('head_office')}
                          </label>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="radio-button mb-0">
                            <input type="radio" className="radio-button__input" name="branch" checked={branch == 1 ? 'checked' : ''} data-id="1" onChange={changeBranch} /> 
                            <span className="radio-button__control"></span>
                            <span className="radio-button__label"></span>
                            {t('branch')}
                          </label>
                          <div className="form-group mb-0">
                            <input type="text" className="form-control" size="6" name="branch_code" id="branch_code" maxLength="10" placeholder={t('branch_code')} onChange={chkData} />
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  )
                }
                
                
              </div>
              
              <input type="hidden" name="type" defaultValue="normal" />
              {/* <input type="text" name="at" defaultValue="home" /> */}
              <div className="row mx-0 px-0 mt-5">
                <div className="col-12 px-0">
                  <div className="float-right">
                    <Link href={'/user/address'} as={`/user/address`}>
                      <button className="btn btn-outline-primary mr-3" type="button">{t('cancel')}</button>
                    </Link>
                    <button className="btn btn-primary" type="submit">{t('save')}</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div> 
      </Sidenav>
    </>
  )
}

export default AddAddress