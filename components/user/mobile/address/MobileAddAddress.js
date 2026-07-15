import classnames from "classnames";
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { CustomInput, Label } from 'reactstrap';
// import Layout from '../../../../components/Layout';
import UserContext from '../../../../contexts/UserContext';
import myData from '../../../../public/json/raw_database.json';
import api from '../../../../utils/api';
import { withTranslation, Router } from '../../../../utils/i18n';
import tools from '../../../../utils/tools';


const MobileAddAddress = (props) => {
  const { t } = props;
  const {user,handleCart, fetchUser} = useContext(UserContext)
  const [province, setProvince] = useState();
  const [amphoe, setAmphoe] = useState();
  const [district, setDistrict] = useState();
  const [zipcode, setZipcode] = useState();
  const [work, setwork] = useState(false);

  const togglework = () => setwork(true);
  const togglehome = () => setwork(false)
  const [individual, setIndividual] = useState(1);
  const [branch, setBranch] = useState(1);
  const router = useRouter()
  var { isAddress = 1 } = router.query
  isAddress = parseInt(isAddress)

  useEffect(() => {
    fetchUser()
    getOptionAddress(myData)
  }, []);

  const getOptionAddress = (obj, index = 'กรุงเทพมหานคร') => {
    var prov = groupBy(obj, 'province');
    var amp = groupBy(prov[index], 'amphoe')
    var district = groupBy(amp[Object.keys(amp)[0]], 'district')
    setProvince(prov)
    setAmphoe(amp)
    setDistrict(district)
    setZipcode(groupBy(district[Object.keys(district)[0]], 'zipcode'))
  }

  const onChangeProv = (e) => {
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
    event.preventDefault()
    if(isAddress) {
      var at;
      if (work == true) {
        at = 'work'
      } else {
        at = 'home'
      }
      var data = new FormData(event.target)
      data.append('at', at);
    }else{
      var data = new FormData(event.target)
    }
    const id = user.id;
    const jsonData = tools.toJson(data);
    api.insertAddress(id, jsonData)
    .then(res => {
      const data = res.data;
      ;
      fetchUser();
      Router.back();
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
          <h4 >{t("mobile_translations:add_new_address")}</h4>
        </div>

        <a className="btn-back cart-nav-back" onClick={() => Router.back()}>
          <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
        </a>

      </div>
      <form id="profile-form" onSubmit={handleSave}>
        <div className="bg-white ">
          <div className="padding-bottom-for-box-cart"></div>

          {/*  <p className="p-12 mb-0">{t("mobile_translations:calculated_address")}</p> 
              <p className="p-12 mb-0">{t("mobile_add_address:select_delivery")}</p>*/}
          {
            isAddress ? (
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
              : 
              <div className="container">
                <input type="hidden" name="at" value="tax" />
                <div className="row align-content-center  mt-4 mb-3">
                  <div className="d-flex align-content-center col-6">
                    <CustomInput type="radio" id="individual" name="customRadio" className="my-auto mr-2" defaultChecked onChange={() => setIndividual(1)} />
                    <Label for="individual" className="mb-0">บุคคลธรรมดา</Label>
                  </div>
                  <div className="d-flex align-content-center col-6">
                    <CustomInput type="radio" id="institution" name="customRadio" className="my-auto mr-2" onChange={() => setIndividual(2)} />
                    <Label for="institution" className="mb-0">นิติบุคคล</Label>
                  </div>
                </div>
              </div >
          }


          <div className="container bg-white mt-3 clearfix">
            <div className="input-effect-50 mr-for-50">
              <input className="effect-16" name="firstname" type="text" placeholder="" required />
              <label>{t("mobile_add_address:name")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="input-effect-50">
              <input className="effect-16" name="lastname" type="text" placeholder="" required />
              <label>{t("mobile_add_address:surname")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>

            {
              work && (
                <div className="input-effect-100">
                  <input className="effect-16" name="company_name" type="text" placeholder="" required />
                  <label>{t("mobile_translations:name_office")}<span>*</span></label>
                  <span className="focus-border"></span>
                </div>
              )
            }
            {
              !isAddress ? <div className="input-effect-100">
                <input className="effect-16" name="tax_id" type="text" placeholder="" required />
                <label>{t("mobile_add_address:tax_id")}<span>*</span></label>
                <span className="focus-border"></span>
              </div> : null
            }
            <div className="input-effect-100">
              <input className="effect-16" name="phone" type="text" placeholder="" maxLength="10" minLength="10" pattern="[0-9]*" required  />
              <label>{t("mobile_add_address:phone_number")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="input-effect-100">
              <input className="effect-16" name="address" type="text" placeholder="" required />
              <label>{t("mobile_add_address:address")}<span>*</span></label>
              <span className="focus-border"></span>
            </div>
            <div className="input-effect-100 d-flex justify-content-between">
              <select className="select-box-address" required name="province_code" id="" onChange={onChangeProv}>
                {
                  province ? Object.keys(province).map((prov, index) => (
                    <option value={province[prov][0].province_code} key={prov}>{prov}</option>
                  )) : ''
                }
              </select>
              <select className="select-box-address" required name="ampher" id="" onChange={onChangeAmphoe}>
                {
                  amphoe ? Object.keys(amphoe).map((amp, index) => (
                    <option value={amp} key={amp}>{amp}</option>
                  )) : ''
                }
              </select>
            </div>
            <div className="input-effect-100 d-flex justify-content-between">
              <select className="select-box-address" required name="district" id="" onChange={onChangeDistrict}>
                {
                  district ? Object.keys(district).map((dis, index) => (
                    <option value={dis} key={dis}>{dis}</option>
                  )) : ''
                }
              </select>
              <select className="select-box-address" required name="post" id="">
                {
                  zipcode ? Object.keys(zipcode).map((zip) => (
                    <option value={zip} key={zip}>{zip}</option>
                  )) : ''
                }
              </select>
            </div>
            {
              isAddress ? <div className="input-effect-100">
                <input className="effect-16" name="tax_id" type="text" placeholder="" required />
                <label>{t("mobile_add_address:tax_id")}</label>
                <span className="focus-border"></span>
              </div> : null
            }
            
            {
              work ? (
                <div className="input-effect-100">
                  <input className="effect-16" name="branch_code" type="text" placeholder="" required />
                  <label>{t("mobile_add_address:branch_code")}</label>
                  <span className="focus-border"></span>
                </div>
              ) : ''
            }
            
            {
              individual == 2 ?
                <form >
                  <div className="input-effect-100 ">
                    <div className="d-flex align-content-center ">
                      <CustomInput type="radio" id="branch" name="customRadio" className="my-auto mr-2" onChange={() => setBranch(1)} />
                      <Label for="branch" className="mb-0">สำนักงานใหญ่</Label>
                    </div>
                  </div>
                  <div className="input-effect-100 mt-3 mb-3">
                    <div className="d-flex align-content-center ">
                      <CustomInput type="radio" id="branch_code" name="customRadio" className="my-auto mr-2" onChange={() => setBranch(2)} />
                      <Label for="branch_code" className="mb-0">รหัสสาขา</Label>
                    </div>
                  </div>
                  {
                    branch == 2 ?
                    <>
                      <div className="input-effect-100 mt-4">
                        <input className="effect-16" name="branch_code" type="text" placeholder="" required />
                        <label>{t("mobile_add_address:branch_code")}</label>
                        <span className="focus-border"></span>
                      </div> 
                      <div className="for-all-have-input-text  padding-bottom-for-box-cart "></div></>: null
                  }
                </form > : null
            }
            <input type="hidden" name="type" defaultValue="normal" />
          </div>
          <div className="for-all-have-input-text  padding-bottom-for-box-cart "></div>
        </div>

        <button type="submit" className="btn-pink-submit btn-bottom-layout">
          <h4 className="text-white m-auto">{t("mobile_add_address:save")}</h4>
        </button>
      </form>
    </>
  )
}

export default MobileAddAddress