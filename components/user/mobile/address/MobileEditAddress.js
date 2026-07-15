import classnames from "classnames";
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { CustomInput, Label } from 'reactstrap';
import UserContext from '../../../../contexts/UserContext';
import myData from '../../../../public/json/raw_database.json';
import api from '../../../../utils/api';
import AuthService from '../../../../utils/AuthService';
import { withTranslation, Link, Router } from '../../../../utils/i18n';
import tools from '../../../../utils/tools';


const MobileEditAddress = (props) => {
  const { t } = props;
  const { user, handleCart, fetchUser } = useContext(UserContext)
  const [province, setProvince] = useState();
  const [amphoe, setAmphoe] = useState();
  const [district, setDistrict] = useState();
  const [zipcode, setZipcode] = useState();
  const [work, setwork] = useState(false);
  const [address, setAddress] = useState();

  const router = useRouter()
  const address_id = router.query.address
  var { isAddress = 1 } = router.query
  const [individual, setIndividual] = useState(1);
  const [branch, setBranch] = useState(1);
  isAddress = parseInt(isAddress)
  /* const router = useRouter()  */


  const togglework = () => setwork(true);
  const togglehome = () => setwork(false)

  const fetchAddressOne = () => {
    const id = AuthService.getProfile().id;
   
    api.getAddress(id, address_id)
      .then(res => {
        const data = res.data;
        setAddress(data);
        getOptionAddress(myData, data.province, data.ampher, data.district, data.district, data.post)
        if (data.at == "home") {
          setwork(false);
        } else {
          setwork(true);
        }
        // setwork(data.at);
    
        // getOptionAmphoe(data.ampher)
      })
      .catch(err => {
        console.log(err.response);
      })
  };
  const setBranchData = () => {
    address ? address.branch_code ? setBranch(2) : setBranch(1) : null
  }
  useEffect(() => {
    fetchUser()
    fetchAddressOne();
    setBranchData();
    // getOptionAddress(myData)
  }, []);

  const getOptionAddress = (obj, __prov = 'กรุงเทพมหานคร', __amp = 0, __dis = 0) => {
    var prov = groupBy(obj, 'province');
    var amp = groupBy(prov[__prov], 'amphoe')
    var dis = groupBy(amp[Object.keys(amp)[__amp == 0 ? 0 : Object.keys(amp).findIndex((a) => a == __amp)]], 'district')
    setProvince(prov)
    setAmphoe(amp)
    setDistrict(dis)
    setZipcode(groupBy(dis[Object.keys(dis)[__dis == 0 ? 0 : Object.keys(dis).findIndex((a) => a == __dis)]], 'zipcode'))
  }

  const onChangeProv = (e) => {
    resetAddress()
    getOptionAddress(myData, e.target.options[e.target.selectedIndex].text)
  }

  const getOptionAmphoe = (index = 0) => {
    var district = groupBy(amphoe[index], 'district')
    setDistrict(district)
    setZipcode(groupBy(district[Object.keys(district)[0]], 'zipcode'))
    // console.log(groupBy(amphoe[index],'zipcode'));
  }

  const onChangeAmphoe = (e) => {
    getOptionAmphoe(e.target.options[e.target.selectedIndex].text)
  }

  const getOptionDistrict = (index = 0) => {
    setZipcode(groupBy(district[index], 'zipcode'))
  }

  const onChangeDistrict = (e) => {
    getOptionDistrict(e.target.options[e.target.selectedIndex].text)
  }

  const resetAddress = () => {
    address.ampher = ''
    address.post = ''
    address.province = ''
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

  const handleError = (error) => {
    console.log(error);
  }

  const handleSave = (event) => {
    var at;
    if (isAddress == 0) {
      at = 'tax'
    } else if (work == true) {
      at = 'work'
    } else {
      at = 'home'
    }
    var data = new FormData(event.target)
    data.append('at', at);
    event.preventDefault()
    const id = AuthService.getProfile().id;
    const jsonData = tools.toJson(data);
    api.updateAddress(id, address_id, jsonData)
      .then(res => {
        const data = res.data;
        ;
        fetchUser();
        Router.push('/user/address')
        // history.back();
      })
      .catch(err => {
        console.log(err.response);
      })
  }

  return ( 
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4 >{t("mobile_add_address:edit_address")}</h4>
        </div>
        <Link href="/user/address">
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
        </Link>
      </div>
      <form id="profile-form" onSubmit={handleSave}>
        <div className="bg-white">
          <div className="padding-bottom-for-box-cart"></div>
          {
            address && (isAddress && (address.at == 'home' || address.at == 'work') ? (
              <div className="container switch-address">
                <div className="switch-address-btn">
                  <a className={classnames({
                    "btn-address-home-show": !work,
                    "btn-address-home": work
                  })} onClick={togglehome}>
                    <h4>{t("mobile_add_address:home")}</h4>
                  </a>
                  <a className={classnames({
                    "btn-address-work": !work,
                    "btn-address-work-show": work
                  })} onClick={togglework}>
                    <h4>{t("mobile_add_address:office")}</h4>
                  </a>
                </div>
              </div>
            )
              : <form className="container">
                <div className="row align-content-center  mt-4 mb-3">
                  <div className="d-flex align-content-center col-6">
                    <CustomInput type="radio" id="individual" name="customRadio" className="my-auto mr-2" defaultChecked={address ? address.individual == 1 ? 'checked' : '' : null} onChange={() => setIndividual(1)} />
                    <Label for="individual" className="mb-0">บุคคลธรรมดา</Label>
                  </div>
                  <div className="d-flex align-content-center col-6">
                    <CustomInput type="radio" id="institution" name="customRadio" className="my-auto mr-2" defaultChecked={address ? address.individual == 2 ? 'checked' : '' : null} onChange={() => setIndividual(2)} />
                    <Label for="institution" className="mb-0">นิติบุคคล</Label>
                  </div>
                </div>
              </form >)
          }
          <div className="container bg-white mt-3">
            <div className="input-effect-50 mr-for-50">
              <input className="effect-16" name="firstname" defaultValue={address ? address.firstname : ''} type="text" placeholder="" required />
              <label>{t("mobile_translations:name")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="input-effect-50">
              <input className="effect-16" name="lastname" defaultValue={address ? address.lastname : ''} type="text" placeholder="" required />
              <label>{t("mobile_translations:surname")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>

            {
              (isAddress == 1 && work) && (
                <div className="input-effect-100">
                  <input className="effect-16" name="company_name" defaultValue={address ? address.company_name : ''} type="text" placeholder="" required />
                  <label>{t("mobile_translations:name_office")}<span>*</span></label>
                  <span className="focus-border"></span>
                </div>
              )
            }
            {
              !isAddress ? <div className="input-effect-100">
                <input className="effect-16" name="tax_id" defaultValue={address ? address.tax_id : ''} type="text" placeholder="" />
                <label>{t("mobile_add_address:tax_id")}</label>
                <span className="focus-border"></span>
              </div> : null
            }
            <div className="input-effect-100">
              <input className="effect-16" name="phone" type="text" defaultValue={address ? address.phone : ''} placeholder="" required />
              <label>{t("mobile_add_address:phone_number")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="input-effect-100">
              <input className="effect-16" name="address" defaultValue={address ? address.address : ''} type="text" placeholder="" required />
              <label>{t("mobile_add_address:address")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="input-effect-100 d-flex justify-content-between">
              <select className="select-box-address" required name="province_code" id="" onChange={onChangeProv}>
                {
                  province && address ? Object.keys(province).map((prov, index) => (
                    <option value={province[prov][0].province_code} selected={prov == address.province} key={prov}>{prov}</option>
                  )) : ''
                }
              </select>
              <select className="select-box-address" required name="ampher" id="" onChange={onChangeAmphoe}>
                {
                  amphoe && address ? Object.keys(amphoe).map((amp, index) => (
                    <option value={amp} selected={address.ampher == amp} key={amp}>{amp}</option>
                  )) : ''
                }
              </select>
            </div>
            <div className="input-effect-100 d-flex justify-content-between">
              <select className="select-box-address" required name="district" id="" onChange={onChangeDistrict}>
                {
                  district && address ? Object.keys(district).map((dis, index) => (
                    <option value={dis} selected={address.district == dis} key={dis}>{dis}</option>
                  )) : ''
                }
              </select>
              <select className="select-box-address" required name="post" id="">
                {
                  zipcode && address ? Object.keys(zipcode).map((zip) => (
                    <option value={zip} selected={address.post == zip} key={zip}>{zip}</option>
                  )) : ''
                }
              </select>
            </div>
            {
              isAddress ?
                <div className="input-effect-100">
                  <input className="effect-16" name="tax_id" defaultValue={address ? address.tax_id : ''} type="text" placeholder="" required />
                  <label>{t("mobile_add_address:tax_id")}</label>
                  <span className="focus-border"></span>
                </div> : null
            }
            <div className={classnames("input-effect-100", {
              "d-none": (!work  || !isAddress)
            })}>
              <input className="effect-16" name="branch_code" defaultValue={address ? address.branch_code : ''} type="text" placeholder="" />
              <label>{t("mobile_add_address:branch_code")}</label>
              <span className="focus-border"></span>
            </div>

            {
              address ? (address.individual == 2 || individual == 2) ?
                <form >
                  <div className="input-effect-100 ">
                    <div className="d-flex align-content-center ">
                      <CustomInput type="radio" id="branch" name="customRadio" className="my-auto mr-2" defaultChecked={address ? address.branch_code ? null : 'checked' : null} onChange={() => setBranch(1)} />
                      <Label for="branch" className="mb-0">สำนักงานใหญ่</Label>
                    </div>
                  </div>
                  <div className="input-effect-100 mt-3 mb-3">
                    <div className="d-flex align-content-center ">
                      <CustomInput type="radio" id="branch_code" name="customRadio" className="my-auto mr-2" defaultChecked={address ? address.branch_code ? 'checked' : null : null} onChange={() => setBranch(2)} />
                      <Label for="branch_code" className="mb-0">รหัสสาขา</Label>
                    </div>
                  </div>
                  {
                    ( address.branch_code || branch == 2) ?
                      <>
                        <div className="input-effect-100 mt-4">
                          <input className="effect-16" name="branch_code" type="text" defaultValue={address ? address.branch_code : ''} placeholder="" required />
                          <label>{t("mobile_add_address:branch_code")}</label>
                          <span className="focus-border"></span>
                        </div>
                        <div className="for-all-have-input-text  padding-bottom-for-box-cart "></div></> : null 
                  }
                </form > : null : null
            }
            <input type="hidden" name="type" defaultValue="normal" />
          </div>
          <div className="for-all-have-input-text  padding-bottom-for-box-cart"></div>
        </div>

        <button type="submit" className="btn-pink-submit btn-bottom-layout">
          <h4 className="text-white m-auto">{t("mobile_add_address:save")}</h4>
        </button>
      </form>
    </>
  )
}

export default MobileEditAddress