import classNames from 'classnames';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState, useContext } from 'react';
import Layout from '../../../components/layout';
import Sidenav from '../../../components/user/sidenav';
import myData from '../../../public/json/raw_database.json';
import api from '../../../utils/api';
import AuthService from '../../../utils/AuthService';
import { Link, withTranslation } from '../../../utils/i18n';
import tools from '../../../utils/tools';
import UserContext from '../../../contexts/UserContext';

const EditAddress = (props) => {
  const { t } = props;

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  const [user, setUser] = useState();
  const {fetchUser} = useContext(UserContext)
  const [address, setAddress] = useState();
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

  const router = useRouter()
  const address_id = router.query.address
  const  fetchUserEdit = () => {
    api.getProfile().then(res =>{
        const data = res.data;
        setUser(data);
    })
    .catch(err =>{
      console.log(err.response);
    })
  };
  const  fetchAddressOne = () => {
    const id = AuthService.getProfile().id;
  
    api.getAddress(id, address_id)
    .then(res =>{
        const data = res.data;
        setAddress(data);
        getOptionAddress(myData, data.province, data.ampher, data.district, data.district,data.post);
        if(data.at == "home") {
          setHome(true);
          setWork(false);
          setTax(false);
        }
        if(data.at == "work") {
          setHome(false);
          setWork(true);
          setTax(false);
        }
        if(data.at == "tax") {
          setHome(false);
          setWork(false);
          setTax(true);
        }
        setIndividual(data.individual);
        if(data.branch_code != "" && data.branch_code != null) {
          setBranch(1);
        }else{
          setBranch(0);
        }
        
        
    })
    .catch(err =>{
      console.log(err.response);
    })
  };
  const getOptionAddress = (obj , __prov = 'กรุงเทพมหานคร',__amp = 0, __dis = 0)=>{
    var prov = groupBy(obj,'province');
    var amp = groupBy(prov[__prov],'amphoe')
    var dis = groupBy(amp[Object.keys(amp)[__amp == 0 ? 0 : Object.keys(amp).findIndex((a) => a == __amp) ]],'district')
    setProvince(prov)
    setAmphoe(amp)
    setDistrict(dis)
    setZipcode(groupBy(dis[Object.keys(dis)[__dis == 0 ? 0 : Object.keys(dis).findIndex((a) => a == __dis) ]],'zipcode'))
  }

  const onChangeProv = (e) => {
    resetAddress()
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

  const resetAddress = () => {
    address.ampher = ''
    address.post = ''
    address.province = ''
    address.district = ''
  }

  const setDefault = () => {
    resetAddress();
    getOptionAddress(myData,'กรุงเทพมหานคร');
    document.getElementById('address').value = '';
  }

  useEffect(() => {
    fetchUserEdit()
    fetchAddressOne()
    // getOptionAddress(myData)
  },[]);

  const handleSave = (event) => {
    const data = new FormData(event.target)
    event.preventDefault()
    const id = AuthService.getProfile().id;
    const jsonData = tools.toJson(data);
    api.updateAddress(id, address_id, jsonData)
    .then(res=>{
      const data = res.data;
      
      fetchUserEdit();
      fetchUser();
      Router.push('/user/address')
      // history.back();
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  const handleDelete = (event) => {
    const id = AuthService.getProfile().id;
    api.updatedeleteAddress(id, address_id)
    .then(res=>{
      const data = res.data;
      ;
      window.location.replace('/user/address')

      // history.back();
    })
    .catch(err => {
      console.log(err.response);
    })
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

  // const changetoOffice = () => {
  //   $('.office').removeClass('d-none');
  //   $('.office').addClass('d-flex');
  //   $('.office-required').prop('required', true)
  // }
  // const changetoHome = () => {
  //   $('.office').removeClass('d-flex');
  //   $('.office').addClass('d-none');
  //   $('.office-required').removeAttr('required')
  // }

  const changetoHome = () => {
    setHome(true);
    setWork(false);
    setTax(false);
    // setIndividual(2);
  }
  const changetoOffice = () => {
    setHome(false);
    setWork(true);
    setTax(false);
    // setIndividual(2);
  }
  const changetoTax = () => {
    setHome(false);
    setWork(false);
    setTax(true);
    // setIndividual(1);
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
    if(val != "" && val != null) {
      setBranch(1)
    }else{
      setBranch(0)
    }
  }

  return ( 
    <>
      <Sidenav user={user} page="address" >
        {
          address && (
            <div className="box-main-account">
              <div className="row mx-0 px-0">
                <div className="col-12 pl-0">
                  <div className="mt-2 mb-4 d-flex justify-content-between align-items-center">
                    <h6 className="text-black mb-0">{t('edit_address')}</h6>
                    <button type="button" className="btn-delete-address" onClick={handleDelete}>{t('deleted')}</button>
                  </div>
                </div>
              </div>
              <div className="edit-profile" id="edit-profile">
                <form id="profile-form" onSubmit={handleSave}>
                  <div className="row mx-0 px-0">
                    <div className="col-12 px-0">
                      <div>
                        <p>{t('select_delivery')}</p>
                        <div className="radio-toolbar">    

                          {
                            address.at != "tax" ? (
                              <>
                              <input type="radio" id="radioHome" name="at" value="home"  defaultChecked={address.at == "home" ? 'checked' : ''} onClick={changetoHome} />
                              <label htmlFor="radioHome" className="ml-0">{t('home')}</label>
                              <input type="radio" id="radioWork" name="at" value="work"  defaultChecked={address.at == "work" ? 'checked' : ''} onClick={changetoOffice} />
                              <label htmlFor="radioWork">{t('office')}</label>
                              </>
                            ) : (
                              <>
                              <input type="radio" id="radioTax" name="at" value="tax"  defaultChecked={address.at == "tax" ? 'checked' : ''} onClick={changetoTax} />
                              <label htmlFor="radioTax">{t('tax')}</label>
                              </>
                            )
                          }
                          
                        </div>

                      </div>
                    </div>
                  </div>
                  {
                    tax && (
                      <div className="row mt-4">
                        <div className="col-lg-4 col-12 d-flex">
                          <div className="form-group">
                            <label className="radio-button">
                              <input type="radio" className="radio-button__input" name="individual" checked={individual == 1 ? 'checked' : ''} value="1" data-id="1" onChange={change} /> 
                              <span className="radio-button__control"></span>
                              <span className="radio-button__label"></span>
                              {t('individual')}
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-4 col-12 d-flex">
                          <div className="form-group">
                            <label className="radio-button">
                              <input type="radio" className="radio-button__input" name="individual" checked={individual == 2 ? 'checked' : ''} value="2" data-id="2" onChange={change} />
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
                          <input type="text" className="form-control" name="firstname" defaultValue={address ? address.firstname : ''} placeholder={t('name_surname')} required />
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
                          <input type="text" className="form-control" name="lastname" defaultValue={address ? address.lastname : ''} placeholder={t('surname')} required/>
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
                              <input type="text" className="form-control" name="tax_id" minLength="13" maxLength="13" pattern="[0-9]+" defaultValue={address ? address.tax_id : ''} placeholder={t('please_tax')} required/>
                            </div>
                          </div>
                        </div>
                      ) 
                    }
                    {
                      work && (
                        <div className={classNames("col-lg-4 col-12 office d-flex")} >
                          <div className="w-100">
                            <div>
                              <p>{t('company_name')}<span className="text-pink">*</span></p>
                            </div>
                            <div className="form-group">
                              <input type="text" className="form-control office-required" name="company_name" maxLength="" defaultValue={address ? address.company_name : ''} placeholder={t('company_name')} required={address ? (address.at == 'work' ? 'required' : '') : ''} />
                            </div>
                          </div>
                        </div>
                      )
                    }
                    
                    {
                      !tax && (
                        <div className="col-lg-4 col-12 d-flex">
                          <div className="w-100">
                            <div>
                              <p>{t('phone_number')}<span className="text-pink">*</span></p>
                            </div>
                            <div className="form-group">
                              <input type="tel" className="form-control" name="phone" defaultValue={address ? address.phone : ''} minLength="10" maxLength="10" pattern="[0-9]+" placeholder={t('please_phone_number')} />
                            </div>
                          </div>
                        </div>
                      )
                    }
                  {/* </div>
                  <div className="row mx-0 px-0 mt-2"> */}
                    <div className="col-lg-4 col-12  d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('address')}<span className="text-pink">*</span></p>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="address" id="address" defaultValue={address ? address.address : ''} placeholder={t('please_address')} required />
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
                                province && address ? Object.keys(province).map((prov,index)=>(
                                  <option value={province[prov][0].province_code} selected={prov == address.province} key={prov}>{prov}</option>
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
                                amphoe && address ? Object.keys(amphoe).map((amp,index)=>(
                                  <option value={amp} selected={address.ampher == amp} key={amp}>{amp}</option>
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
                                district && address ? Object.keys(district).map((dis,index)=>(
                                  <option value={dis} selected={address.district == dis} key={dis}>{dis}</option>
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
                          <p>{t('postcode')}<span className="text-pink">*</span></p>
                        </div>
                        <div className="form-group styleSelect">
                          <div className="d-block position-relative">
                            <select className="form-control" name="post" id="">
                              {
                                zipcode && address ? Object.keys(zipcode).map((zip)=>(
                                  <option value={zip} selected={address.post == zip} key={zip}>{zip}</option>
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
                              <input type="text" className="form-control" name="tax_id" minLength="13" maxLength="13" pattern="[0-9]+" defaultValue={address ? address.tax_id : ''} placeholder={t('please_tax')} />
                            </div>
                          </div>
                        </div>
                        
                        </>
                      )
                    }
                    
                    {
                      work && (
                        <div className={classNames("col-4 office d-flex")} >
                          <div className="w-100">
                            <div>
                              <p>{t('branch_code')}</p>
                            </div>
                            <div className="form-group">
                              <input type="text" className="form-control" name="branch_code" pattern="[0-9]+" minLength="4" maxLength="" defaultValue={address ? address.branch_code : ''} placeholder={t('branch_code')} />
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
                              <p>{t('phone_number')}</p>
                            </div>
                            <div className="form-group">
                              <input type="tel" className="form-control" name="phone" defaultValue={address ? address.phone : ''} minLength="10" maxLength="10" pattern="[0-9]+" placeholder={t('please_phone_number')} />
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
                                <input type="text" className="form-control" size="6" maxLength="10" name="branch_code" pattern="[0-9]+" minLength="4" defaultValue={address ? address.branch_code : ''} placeholder={t('branch_code')} onChange={chkData} />
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
                        <a className="mr-3" onClick={() => setDefault()}>{t('reset_data')}</a>
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
          )
        }
        
      </Sidenav>
    </>
  )
}

export default EditAddress