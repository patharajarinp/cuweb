import React, { useState,useEffect } from 'react'
import Head from 'next/head'
import classNames  from 'classnames';

import { Link, withTranslation, Router } from '../../../utils/i18n'
import withAuth from '../../../utils/withAuth'
import api from '../../../utils/api';
import Sidenav from '../../../components/user/sidenav'
import AuthService from '../../../utils/AuthService'
import { useRouter } from 'next/router'

const MainAddress = (props) => {
  const { t } = props;

  useEffect(() => {
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#F2F2F2";
    }
  },[]);

  const [user, setUser] = useState();
  const [userID, setUserID] = useState(0);
  const [defaultAddress, setDefault] = useState(0);
  const [changeDefault, setChange] = useState();


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
  const handleError = (error) => {
    console.log( error);
  }


  // Default
  const switchDefault = () => {
    setDefault(1);
    $('#btn-addAddress').addClass('d-none');
    $('#btn-addDefault').removeClass('d-none');
    $('.default-group').addClass('d-none');
    $('#address-header').text(t('shipping_address'));
  }
  const switchTax = () => {
    setDefault(2);
    $('#btn-addAddress').addClass('d-none');
    $('#btn-addDefault').removeClass('d-none');
    $('.default-group').addClass('d-none');
    $('#address-header').text(t('billing_address'));
  }
  const switchCancel = () => {
    setDefault(0);
    $('#btn-addAddress').removeClass('d-none');
    $('#btn-addDefault').addClass('d-none');
    $('.default-group').removeClass('d-none');
    $('#address-header').text(t('address_book'));
  }

  const Html = (id) => {
    return (
      <div className="form-group">
        <label className="radio-button">
          <input type="radio" className="radio-button__input" name="default[]" value={id} onChange={handleChange} />
          <span className="radio-button__control"></span>
          <span className="radio-button__label"></span>
        </label>
      </div>
    )
  }
  const renderDefault = (val) =>{
    if(defaultAddress == 1){
      if(val.id == 6){
        return Html(val.id);
      }else {
        return Html(val.id);
      }
    }else if (defaultAddress == 2) {
      if(val.id == 6){
        return Html(val.id);
      }else {
        return Html(val.id);
      }
    }else {
      return <div></div>
    }
    
  }
  const handleChange = (e, id) => {
    // alert(e.target.value);
    setChange(e.target.value)
  }

  // Tax
  const handleDefault = (e) => {
    const id = AuthService.getProfile().id;
    const address_id = changeDefault;
    if(defaultAddress == 1){
      api.changeDefault(id, {id :address_id})
      .then(res=>{
        const data = res.data;
        //;
        fetchUser();
        setDefault(false)
      })
      .catch(err => {
        console.log(err.response);
      })
    }else if(defaultAddress == 2){
      api.changeTax(id, {id :address_id})
      .then(res=>{
        const data = res.data;
        //;
        fetchUser();
        setDefault(false)
      })
      .catch(err => {
        console.log(err.response);
      })
    }
    $('#btn-addAddress').removeClass('d-none');
    $('#btn-addDefault').addClass('d-none');
    $('.default-group').removeClass('d-none');
    $('#address-header').text(t('address_book'));
  }

  const showAdressStatus = (val) => {
    if(val.default == 1 && val.tax == 1){
      return   <div className="tag-address ">{t('shipping_and_tax')}</div>;{/* <p>{t("shippingaddress")}<br></br>{t('billingaddress')}<br></br>{t('as_specified')}</p> */}
    }else if (val.default == 1) {
      return  <div className="tag-address ">{t('shippingaddress')}</div>;{/* <p>{t('{t("shippingaddress")}')}<br></br>{t('as_specified')}</p>; */}
    }else if (val.tax == 1) {
      return  <div className="tag-address ">{t('billingaddress')}</div>;{/* <p>{t('billingaddress')}<br></br>{t('as_specified')}</p>; */}
    }
  }

  const showAdressMobileStatus = (val) => {
    if (val.default == 1) {
      return  <span className="address-default">{t('shippingaddress')}</span>;
    }else if (val.tax == 1) {
      return  <span className="address-default">{t('billingaddress')}</span>;
    }
  }

  return ( 
    <>
      <Sidenav user={user} menuToggle={sidenav} page="address" >
        <div className="box-main-account d-none d-xl-block">
          <div className="row mx-0 px-0">
            <div className="col-lg-6 col-12 px-0">
              <div className="mt-2 mb-4">
                <h6 className="text-black">{t('address_book')}</h6>
              </div>
              {/* <div className="main">
                <div className="">
                  <div className="">
                    <h4 className="" id="address-header">{t('address_book')}</h4>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="col-lg-6 col-12 px-0">
              <div className="text-right">
                <div className="default-tax">
                  <p className="p-medium">{t('shippingaddress')}</p><button className="p-medium text-pink" onClick={switchDefault}>{t('edit')}</button>&nbsp;|&nbsp;&nbsp; 
                  <p className="p-medium">{t('billingaddress')}</p><button className="p-medium text-pink" onClick={switchTax}>{t('edit')}</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row mx-0 px-0">
            <div className="box-main-order">
              <div className="border-r bg-white">
                <div className="row mx-0 px-0">
                  <div className="col-12 px-0">
                    <div className="p-3">
                      <p className="p-medium mb-0">{t('address')}</p>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-order">
                        <thead>
                          <tr>
                            <th colSpan="2" style={{minWidth: '160px'}}>{t('name_surname')}</th>
                            <th colSpan="2" style={{width: '30%'}}>{t('address')}</th>
                            <th>{t('postcode')}</th>
                            <th>{t('phone_number')}</th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            user ? user.addresses.map((val, index) => (
                              defaultAddress == 0 ? (
                                <tr key={val.id}>
                                  <td  colSpan="2" style={{minWidth: '160px'}}>{val.firstname} {val.lastname}</td>
                                  <td className="sp">
                                    <span className={classNames("btn-success span-address p-1 p-12 " , val.at == "home" ? 'span-blue': val.at == "work" ? 'span-green' : 'span-red')}>{val.at == "home" ? t('home') : val.at == "work" ? t('office') : t('tax')}</span></td>
                                  <td>{val.full_address}</td>
                                  <td>{val.post}</td>
                                  <td>{val.phone}</td>
                                  <td>
                                    {showAdressStatus(val)}
                                  </td>
                                  <td>
                                    {renderDefault(val)}
                                    <div className="default-group">
                                      <Link href={`/user/edit-address/[address]?address=${val.id}`} as={`/user/edit-address/${val.id}`}>
                                        <a>{(t('edit'))}</a>
                                      </Link>
                                    </div>
                                  </td>
                                </tr>
                              ) : defaultAddress == 1 ? (
                                  (val.at == "home" || val.at == "work") &&
                                  <tr key={val.id}>
                                    <td  colSpan="2" style={{minWidth: '160px'}}>{val.firstname} {val.lastname}</td>
                                    <td className="sp"><span className={classNames("btn-success span-address p-1 p-12 " , val.at == "home" ? 'span-blue': val.at == "work" ? 'span-green' : 'span-red')}>{val.at == "home" ? t('home') : val.at == "work" ? t('office') : t('tax')}</span></td>
                                    <td>{val.full_address}</td>
                                    <td>{val.post}</td>
                                    <td>{val.phone}</td>
                                    <td>
                                      {showAdressStatus(val)}
                                    </td>
                                    <td>
                                      {renderDefault(val)}
                                      {/* <div className="default-group">
                                        <Link href={`/user/edit-address/[address]?address=${val.id}`} as={`/user/edit-address/${val.id}`}>
                                          <a>{(t('edit'))}</a>
                                        </Link>
                                      </div> */}
                                    </td>
                                  </tr>
                              ) : (
                                (val.at == "tax") &&
                                <tr key={val.id}>
                                  <td  colSpan="2" style={{minWidth: '160px'}}>{val.firstname} {val.lastname}</td>
                                  <td className="sp"><span className={classNames("btn-success span-address p-1 p-12 " , val.at == "home" ? 'span-blue': val.at == "work" ? 'span-green' : 'span-red')}>{val.at == "home" ? t('home') : val.at == "work" ? t('office') : t('tax')}</span></td>
                                  <td>{val.full_address}</td>
                                  <td>{val.post}</td>
                                  <td>{val.phone}</td>
                                  <td>
                                    {showAdressStatus(val)}
                                  </td>
                                  <td>
                                    {renderDefault(val)}
                                    {/* <div className="default-group">
                                      <Link href={`/user/edit-address/[address]?address=${val.id}`} as={`/user/edit-address/${val.id}`}>
                                        <a>{(t('edit'))}</a>
                                      </Link>
                                    </div> */}
                                  </td>
                                </tr>
                              )
                              
                            )) : (<tr><td colSpan="7"></td></tr>)
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div> 
          </div>
          <div className="row mx-0 px-0">
            <div className="col-12 px-0">
              <div className="btn-group-address">
                <div id="btn-addAddress">
                <Link href={'/user/add-address'} as={`/user/add-address`}>
                  <button className="btn btn-primary" type="button">+ {t('add_new_address')}</button>
                </Link>
                </div>
                <div className="d-none" id="btn-addDefault">
                  <button className="btn btn-outline-primary mr-4" onClick={switchCancel}>{t('cancel')}</button>
                  <button className="btn btn-primary" type="button" onClick={handleDefault}>{t('save')}</button>
                </div>
              </div>
            </div>
          </div>
        </div> 
        <div className="d-block d-xl-none">
          <div className="row">
            <div className="col-12 mt-4 border-bottom pb-5">
              <div className="text-center">
                <Link href={'/user/add-address'} as={`/user/add-address`}>
                  <button className="btn btn-primary" type="button">+ {t('add_new_address')}</button>
                </Link>
              </div>
            </div>
            <div className="col-12">
              <div>
                {
                  user ? user.addresses.map((val, index) => (
                  <div className="row px-0 mx-0 border-bottom my-4 pb-3" key={val.id}>
                    <div className="col-1 px-0 mx-0">
                      <img src="/icon/icon-m-address.svg" />
                    </div>
                    <div className="col-9 px-0 mx-0 pl-2">
                      <p className="font-weight-bold mb-0">{val.firstname} {val.lastname}</p>
                      <p className="font-weight-bold mb-0">{val.phone}</p>
                      <p className="mb-0 my-3">
                        <span className={classNames("btn-success span-address p-1 mr-3" , val.at == "home" ? 'span-blue' : 'span-green')}>{val.at == "home" ? t('home') : t('office')}</span>
                        {val.full_address} {val.post}
                      </p>
                      <p>{showAdressMobileStatus(val)}</p>
                    </div>
                    <div className="col-2 px-0 mx-0">
                      <div className="default-group text-right">
                        <Link href={`/user/edit-address/[address]?address=${val.id}`} as={`/user/edit-address/${val.id}`}>
                          <a className="font-weight-bold">{t('edit')}</a>
                        </Link>
                      </div>
                    </div>
                  </div> 
                  )) : ''
                }
              </div>
            </div>
          </div>                
        </div>
      </Sidenav>
    </>
  )
}

export default MainAddress