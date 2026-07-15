import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import tools from '../../utils/tools'
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";
import myData from '../../public/json/raw_database.json';

const FormAddress = (props) => {
  const {t, address} = props;
  
  const [province, setProvince] = useState();
  const [amphoe, setAmphoe] = useState();
  const [district, setDistrict] = useState();
  const [zipcode, setZipcode] = useState();

  useEffect(() => {
    getOptionAddress(myData, address.province, address.ampher, address.district, address.district,address.post);
  },[address]);

  const getOptionAddress = (obj , __prov = 'กรุงเทพมหานคร',__amp = 0, __dis = 0)=>{
    try {
      var prov = groupBy(obj,'province');
      var amp = groupBy(prov[__prov],'amphoe')
      var dis = groupBy(amp[Object.keys(amp)[__amp == 0 ? 0 : Object.keys(amp).findIndex((a) => a == __amp) ]],'district')
      setProvince(prov)
      setAmphoe(amp)
      setDistrict(dis)
      setZipcode(groupBy(dis[Object.keys(dis)[__dis == 0 ? 0 : Object.keys(dis).findIndex((a) => a == __dis) ]],'zipcode'))
    }catch (err) {
      address.ampher = ''
      address.post = ''
      address.province = ''
      address.district = ''
      getOptionAddress(myData,'กรุงเทพมหานคร');
      setTimeout(() => {
        alert('ข้อมูลที่อยู่ไม่ถูกต้อง กรุณาตั้งค่าที่อยู่ใหม่');
      }, 500)
      
    }
    
  }

  const onChangeProv = (e) => {
    resetAddress()
    getOptionAddress(myData,e.target.options[e.target.selectedIndex].text)
  }

  const getOptionAmphoe = (index = 0)=>{
    var district = groupBy(amphoe[index],'district')
    setDistrict(district)
    setZipcode(groupBy(district[Object.keys(district)[0]],'zipcode'))
    
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


  return (
   <>
      <div className="col-6">
        <div className="form-group">
          <label>ชื่อ<span className="text-pink">*</span></label>
          <input type="text" className="form-control" name="firstname" required  defaultValue={address?.firstname} />
        </div>
      </div>
      <div className="col-6">
        <div className="form-group">
          <label>นามสกุล<span className="text-pink">*</span></label>
          <input type="text" className="form-control" name="lastname" required  defaultValue={address?.lastname} />
        </div>
      </div>
      
      <div className="col-6">
        <div className="form-group">
          <label>ที่อยู่<span className="text-pink">*</span></label>
          <input type="text" className="form-control" name="address" required   defaultValue={address?.address}/>
        </div>
      </div>

      <div className="col-6">
        <div className="w-100">
          <div>
            <p className="mb-2">{t('add_address:province')}<span className="text-pink">*</span></p>
          </div>
          <div className="form-group styleSelect">
            <div className="d-block position-relative">
              <select className="form-control" name="province" id="" onChange={onChangeProv}>
               {
                  province && address ? Object.keys(province).map((prov,index)=>(
                    <option value={province[prov][0].province_code} selected={prov == address.province} key={prov}>{prov}</option>
                  )) : ''
                }
              </select>
              <img src="/icon/icon-arrow-down.svg" className="select-icon" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-6">
        <div className="w-100">
          <div>
            <p className="mb-2">{t('add_address:district')}<span className="text-pink">*</span></p>
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
      <div className="col-6">
        <div className="w-100">
          <div>
            <p className="mb-2">{t('add_address:sub_district')}<span className="text-pink">*</span></p>
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
      <div className="col-6">
        <div className="w-100">
          <div>
            <p className="mb-2">{t('add_address:postcode')}<span className="text-pink">*</span></p>
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
      <div className="col-6">
        <div className="form-group">
          <label>เบอร์โทรศัพท์มือถือ<span className="text-pink">*</span></label>
          <input type="text" className="form-control" name="phone" required defaultValue={address?.phone} />
        </div>
      </div>
      <div className="col-6">
        <div className="form-group">
          <label>อีเมล<span className="text-pink">*</span></label>
          <input type="text" className="form-control" name="email" required />
        </div>
      </div>
   </>
  )
}

export default FormAddress