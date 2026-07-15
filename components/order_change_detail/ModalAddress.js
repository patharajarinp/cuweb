import React, { useState, useEffect } from 'react'
import classNames from 'classnames';
import api from '../../utils/api';
import { Button, Modal } from 'react-bootstrap'
import tools from '../../utils/tools'
import myData from '../../public/json/raw_database.json';
import { withTranslation, Link, Router, Trans, i18n } from "../../utils/i18n";
const ModalCancel = ({changes, show, setShow, t, fecthReturnOne}) => {

  
  const [province, setProvince] = useState();
  const [amphoe, setAmphoe] = useState();
  const [district, setDistrict] = useState();
  const [zipcode, setZipcode] = useState();

  useEffect(() => {
    getOptionAddress(myData);
  },[]);

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

  const handleSubmit = () => {
    event.preventDefault();
    var r = confirm("คุณยืนยันที่จะบันทึกข้อมูลนี้หรือไม่!!!");
    if (r) {
      var return_id = changes.id;
      var form_data = new FormData(event.target);
      api.updatePackageReturn(return_id, form_data).then(res => {
        const data = res.data;
        alert('บันทึกข้อมูลสำเร็จ!!!');
        fecthReturnOne();
        setShow(false);
      })
      .catch(err => {
        setShow(false);
        console.log(err)
        console.log(err.response);
      })
    }
    return false;
  }

  return (
    <>
      {
        changes && (
          <>
            <Modal className="modal-cart" show={show} centered onHide={() => setShow(false)} size="lg">
              <Modal.Header closeButton>
                <Modal.Title className="font-20">ที่อยู่สำหรับการรับเปลี่ยนสินค้า</Modal.Title>
              </Modal.Header>
              <Modal.Body className="row">
                <p className="font-weight-bold col-6">{t('Order:change_id')} #{changes.id}</p>
                <p className="text-right col-6">{t('Order:change_date')} {tools.formatDate(changes.createdAt)}</p>
                <div className="col-12 mb-3">
                  <hr className="use-line"></hr>
                </div>
                <form className="col-12" onSubmit={handleSubmit} >
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>{t('add_address:name')}<span className="text-pink">*</span></label>
                        <input type="text" className="form-control" name="firstname" required />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>{t('add_address:surname')}<span className="text-pink">*</span></label>
                        <input type="text" className="form-control" name="lastname" required />
                      </div>
                    </div>
                  
                    <div className="col-6">
                      <div className="form-group">
                        <label>{t('add_address:address')}<span className="text-pink">*</span></label>
                        <input type="text" className="form-control" name="address" required />
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
                                province ? Object.keys(province).map((prov,index)=>(
                                  <option value={prov} key={prov}>{prov}</option>
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
                    <div className="col-6">
                      <div className="w-100">
                        <div>
                          <p className="mb-2">{t('add_address:sub_district')}<span className="text-pink">*</span></p>
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
                    <div className="col-6">
                      <div className="w-100">
                        <div>
                          <p className="mb-2">{t('add_address:postcode')}<span className="text-pink">*</span></p>
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
                    <div className="col-12 d-flex justify-content-end mt-4">
                      <button type="button" className="btn btn-outline-primary mr-3 text-black" onClick={() => setShow(false)}>{t('ConfirmDialog:cancel')}</button>
                      <button type="submit" className="btn btn-primary"  >{t('ConfirmDialog:save')}</button>
                    </div>
                  </div>
                  
                </form>
              </Modal.Body>
            </Modal>
          </>
        )
      }

    </>
  )
}

export default withTranslation('order_detail')(ModalCancel)