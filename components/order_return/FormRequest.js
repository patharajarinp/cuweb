import React, { useState,useEffect, useContext } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import tools from '../../utils/tools'
import { useRouter } from 'next/router'
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";
import myData from '../../public/json/raw_database.json';
import FormAddress from './FormAddress';
import UserContext from '../../contexts/UserContext'

const FormRequest = ({type, t,payment_type,total_price,member_discount}) => {
  const {user, handleCart, fetchUser} = useContext(UserContext)
  const [address, setAddress] = useState({});

  var checked = true;

  if(user) {
    checked = !!user.addresses.find((val) => val.default == 1);
  }
  



  const handleChange = (event) => {
    if(!user) return;
    var checked = event.target.checked;
    if(checked) {
      var addr = user.addresses.find((val) => val.default == 1);
      if(addr) {
        setAddress(addr);
      }
    }else{
      setAddress({});
    }
  }

  console.log('type', type);
  console.log('payment_type', payment_type);
  console.log('total_price', total_price);
  console.log('member_discount', member_discount);
  console.log('test', payment_type !== 1 || ( total_price == 0 && member_discount !== 0 ));

  return (
    <>
      <input type="hidden" className="form-control" name="type" defaultValue={type} />
      {
        type == 1 ? (<>
        { (payment_type !== 1 || ( total_price == 0 && member_discount !== 0 )) &&
          <div className="row px-0">
            <div className="col-12 mb-4">
              <p className="p-medium">ชื่อบัญชีธนาคารสำหรับคืนเงิน</p>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>ชื่อบัญชี<span className="text-pink">*</span></label>
                <input type="text" className="form-control" name="bank_bookname" required />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>ธนาคาร<span className="text-pink">*</span></label>
                <select id="options"   name="bank_name" className="form-control" required>
                  <option value="" className="selected">{t("select_bank")}</option>
                  <option data-index="0">{t("scb")}</option><option data-index="1" className="selected">{t("kasikorn")}</option><option data-index="2">{t("krungthai")}</option><option data-index="3">{t("bangkok_bank")}</option><option data-index="4">{t("krungsri")}</option><option data-index="5">{t("thanachart")}</option><option data-index="6">{t("tmb")}</option><option data-index="7">{t("gsb")}</option><option data-index="8">{t("baac")}</option><option data-index="9">{t("kiatnakin")}</option><option data-index="10">{t("sc")}</option><option data-index="11">{t("uob")}</option><option data-index="12">{t("tisco")}</option><option data-index="13">{t("cimb")}</option><option data-index="14">{t("icbc")}</option>
                </select>
                {/* <input type="text" className="form-control" name="bank_name" required /> */}
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>เลขที่บัญชี<span className="text-pink">*</span></label>
                <input type="text" className="form-control" name="bank_number" required />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>สาขา</label>
                <input type="text" className="form-control" name="branch" />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>เบอร์โทรศัพท์มือถือ<span className="text-pink">*</span></label>
                <input type="text" className="form-control" name="phone" required />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>อีเมล<span className="text-pink">*</span></label>
                <input type="text" className="form-control" name="email" required />
              </div>
            </div>
          </div>
        }
                 </> ) : (
          <div className="row px-0">
            <div className="col-12 mb-4">
              <p className="p-medium">ที่อยู่สำหรับการรับเปลี่ยนสินค้า</p>
            </div>
            <div className="col-12 pb-3">
              <div className="form-group">
                <div className="custom-control custom-checkbox mb-3">
                  <input type="checkbox" className="custom-control-input" id="use_address" name="use_address" value="1" disabled={!checked} onChange={(e) => handleChange(e)} />
                  <label className="custom-control-label" htmlFor="use_address">
                    {t('use_address')}
                  </label>
                </div>
              </div>
            </div>
            <FormAddress t={t} address={address} />

          </div>
        )
      }
    </>
  )
}

export default FormRequest