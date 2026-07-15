import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import myData from '../../public/json/raw_database.json';
import api from '../../utils/api';
import AuthService from '../../utils/AuthService';
import { Link, withTranslation,Router } from '../../utils/i18n';
import tools from '../../utils/tools';


const ModalAddress = ({t,show, handleClose,user,setUser,setCartDetail,setAddress,cartDetail,setCalDetail}) => {
	const { groupBy } = tools
	const [switchAdd, setSwitchAdd] = useState(0);
	const _cartDetail = cartDetail;
	//Address
	const [province, setProvince] = useState();
	const [amphoe, setAmphoe] = useState();
	const [district, setDistrict] = useState();
	const [zipcode, setZipcode] = useState();
  const [id, setId] = useState();
  const [tax, setTax] = useState(false);
  const [individual, setIndividual] = useState(1);
  const [home, setHome] = useState(false);
  const [work, setWork] = useState(false);
  const [branch, setBranch] = useState(0);
  const [chkpage, setChkPage] = useState(false);
  const regex = /ecode/

  useEffect(()=>{
    setId(show == 1 ? cartDetail.address_id : cartDetail.tax_address)
//testbank

  if (regex.test(Router.pathname)) {
    setChkPage(true);
  }
  },[cartDetail])

  useEffect(()=>{
    if(show == 1) {
      setHome(true);
      setWork(false);
      setTax(false);
    }else{
      setHome(false);
      setWork(false);
      setTax(true);
      setIndividual(1);
    }
  },[show])

	const change = (e) => {
	    var id = $(e.target).data('id');
	    setId(id)
	}

	 const handleSave = (event) => {
	    const data = new FormData(event.target)
	    event.preventDefault()
	    const id = AuthService.getProfile().id;
	    const jsonData = tools.toJson(data);
	    api.insertAddress(id, jsonData)
	      .then(res => {
          const data = res.data;
          // ;
	        if (user.addresses.length == 0) {
	          handleClose();
          }
          var tmp = user;
          jsonData.id = data.id;
          tmp.addresses.push(data);
          // console.log(tmp);
          setUser(tmp);
          if(show == 1) {
            setCartDetail({...cartDetail,address_id:data.id})
          }else{
            setCartDetail({...cartDetail,tax_address:data.id})
          }
          
         
	        setSwitchAdd(0);
	      })
	      .catch(err => {
          console.log(err)
	        console.log(err.response);
	      })
	}
	const handleChangeAddress = (event) => {
	    // var type = $(event.target).data('change');
      // alert(id)
      if(!id){
        handleClose();
        return;
      }

	    var tmp = {...cartDetail}
	    if (show == 1) {
        tmp.address_id = id;
        // setAddress(id)
	    	// tools.calAll(user,id,cartDetail.shipping_type,user && user.member && user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ,cartDetail.cart_id).then(data=>{
		    //   setCalDetail(data)
		    // })
	    } else {
	    	tmp.tax_address = id;
	    }
	    setCartDetail(tmp)
	    handleClose();
	}

	// const changetoOffice = () => {
	// 	$('.office').removeClass('d-none');
	// 	$('.office').addClass('d-flex');
	// 	$('.office-required').prop('required', true)
	// }

	// const changetoHome = () => {
	// 	$('.office').removeClass('d-flex');
	// 	$('.office').addClass('d-none');
	// 	$('.office-required').removeAttr('required')
  // }
  
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
	
	useEffect(() => {
    	getOptionAddress(myData);
  },[])
  
  const changeText = (e) => {
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

  const checkAddress = (type) => {
    if(!user) {
      return;
    }
    if(!user.addresses.length) {
      return;
    }
    
    if(type == 1) {
      var found = true;
      user.addresses.filter(val => val.at != 'tax').forEach((val,index) => {
        found = false;
      })
    }else{
      var found = true;
      user.addresses.filter(val => val.at == 'tax').forEach((val,index) => {
        found = false;
      })
    }
    return found;
  }

	return (
      <Modal className="modal-cart" show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <div className={classNames(switchAdd == "0" ? 'd-block' : 'd-none')}>
            <Modal.Title className="d-flex">{show == 1 ? t('address_shipping') : t('address_tax')} <p className="ml-4"><a className="text-pink" onClick={() => { setSwitchAdd(1) }}>{t('add_address')}</a></p>
           {!chkpage &&
            <p className="ml-4"><Link href={'/user/address'} as={'/user/address'}><a className="text-grey" >{t('address:address_book')}</a></Link></p>
           }
            </Modal.Title>
          
          </div>
          <div className={classNames(switchAdd == "1" ? 'd-block' : 'd-none')}>
            <Modal.Title>{t('shipment_info')}</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className={classNames(switchAdd == "0" ? 'd-block' : 'd-none')}>
            {
                user.addresses.length > 0 ? (
                  <div>
                    <div className="row">
                      <div className="col-12">
                        <div className="w-100">
                          <table className="table table-responsive d-table">
                            <thead>
                              <tr>
                                <th>{t('name')}</th>
                                <th colSpan="2" style={{ width: '30%' }}>{t('address')}</th>
                                <th>{t('postcode')}</th>
                                <th>{t('phone')}</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                user.addresses.map((val, index) => (
                                  show == 1 ? (
                                    (val.at == "home" || val.at == "work") && (
                                      <tr key={val.id}>
                                        <td>{val.firstname} {val.lastname}</td>
                                        <td><span className={classNames("btn-success span-address p-1 mr-3", val.at == "home" ? 'span-blue' : 'span-green')}>{val.at == "home" ? t('at_home') : t('at_workplace')}</span></td>
                                        <td>{val.full_address}</td>
                                        <td>{val.post}</td>
                                        <td>{val.phone}</td>
                                        <td>
                                          <div className="form-group">
                                            <label className="radio-button">
                                              <input type="radio" className="radio-button__input" name="default[]" defaultChecked={show == 1 ? (val.id == cartDetail.address_id ? 'checked' : '')  : ''} data-id={val.id} data-change={show} onChange={change} />
                                              <span className="radio-button__control"></span>
                                              <span className="radio-button__label"></span>
                                            </label>
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  ) : (
                                    (val.at == "tax") && (
                                      <tr key={val.id}>
                                        <td>{val.firstname} {val.lastname}</td>
                                        <td><span className={classNames("btn-success span-address p-1 mr-3", val.at == "home" ? 'span-blue' : val.at == 'work' ? 'span-green' : 'span-red')}>{val.at == "home" ? t('at_home') : val.at == 'work' ? t('at_workplace') : t('tax')}</span></td>
                                        <td>{val.full_address}</td>
                                        <td>{val.post}</td>
                                        <td>{val.phone}</td>
                                        <td>
                                          <div className="form-group">
                                            <label className="radio-button">
                                              <input type="radio" className="radio-button__input" name="default[]" defaultChecked={show == 2 ? (val.id == cartDetail.tax_address ? 'checked' : '') : ''} data-id={val.id} data-change={show} onChange={change} />
                                              <span className="radio-button__control"></span>
                                              <span className="radio-button__label"></span>
                                            </label>
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  )
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="row mx-0 px-0 mt-5">
                      <div className="col-12 px-0">
                        <div className="float-right">
                          <button className="btn btn-outline-primary mr-3" type="button" onClick={()=>{setCartDetail(_cartDetail);handleClose()}}>{t('cancel')}</button>
                          <button className="btn btn-primary" type="button" data-change={show} onClick={handleChangeAddress} disabled={checkAddress(show)}>{t('confirm')}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                    <>
                      <div className="text-center p-2">
                        <div className="row justify-content-center">
                          <div className="col-12">{t('pls_add_address')}</div>
                        </div>
                        <div className="row mx-0 px-0 mt-5">
                          <div className="col-12 px-0">
                            <div className="float-right">
                              <button className="btn btn-outline-primary" type="button" onClick={handleClose}>{t('cancel')}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )
            }
          </div>
          <div className={classNames(switchAdd == "1" ? 'd-block' : 'd-none')}>
            <div className="box-main-account">
              <div className="edit-profile" id="edit-profile">
                <form id="profile-form" onSubmit={handleSave}>
                  <div className="row mx-0 px-0">
                    <div className="col-12 px-0">
                      <div>
                        <p>{t('selector_type_shipment')}</p>
                        <div className="radio-toolbar">
                          {
                            show == 1 ? (
                              <>
                              <input type="radio" id="radioHome" name="at" value="home" defaultChecked onClick={changetoHome} />
                              <label htmlFor="radioHome" className="ml-0">{t('at_home')}</label>

                              <input type="radio" id="radioWork" name="at" value="work" onClick={changetoOffice} />
                              <label htmlFor="radioWork">{t('at_workplace')}</label>
                              </>
                            ) : (
                              <>
                              <input type="radio" id="radioTax" name="at" value="tax" defaultChecked onClick={changetoTax} />
                              <label htmlFor="radioTax" className="mx-0">{t('tax')}</label>
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
                              <input type="radio" className="radio-button__input" name="individual" value="1" defaultChecked={individual == 1 ? 'checked' : ''} data-id="1" onChange={changeText} /> 
                              <span className="radio-button__control"></span>
                              <span className="radio-button__label"></span>
                              {t('individual')}
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-4 col-12 d-flex">
                          <div className="form-group">
                            <label className="radio-button">
                              <input type="radio" className="radio-button__input" name="individual" value="2" defaultChecked={individual == 2 ? 'checked' : ''} data-id="2" onChange={changeText} />
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
                    <div className="col-lg-6 col-12 d-flex">
                      <div className="w-100">
                        <div>
                          <p>
                            {
                              tax ? (
                                t('name_on_receipt')
                              ) : (
                                t('label_firstname')
                              )
                            }
                            <span className="text-pink">*</span>
                          </p>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="firstname" placeholder={t('placeholder_firstname')} required />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12 d-flex">
                      <div className="w-100">
                        <div>
                          {
                            (tax && individual == 2) ? (
                              <p>{t('label_lastname')}</p>
                            ) : (
                              <p>{t('label_lastname')}<span className="text-pink">*</span></p>
                            )
                          }
                         
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="lastname" placeholder={t('placeholder_lastname')}  />
                        </div>
                      </div>
                    </div>
                    {
                      tax && (
                        <div className="col-lg-6 col-12 d-flex">
                          <div className="w-100">
                            <div>
                              <p>{t('label_tax_id')}<span className="text-pink">*</span></p>
                            </div>
                            <div className="form-group">
                              <input type="text" className="form-control" name="tax_id" minLength="13" maxLength="13" pattern="[0-9]+" placeholder={t('placeholder_tax_id')} required />
                            </div>
                          </div>
                        </div>
                      )
                    }
                    {
                      work && (
                        <div className="col-lg-6 col-12 office">
                          <div className="w-100">
                            <div>
                              <p>{t('label_company')}<span className="text-pink">*</span></p>
                            </div>
                            <div className="form-group">
                              <input type="text" className="form-control office-required" name="company_name" maxLength="" placeholder={t('placeholder_company')} />
                            </div>
                          </div>
                        </div>
                      )
                    }
                    
                    {
                      !tax && (
                        <div className="col-lg-6 col-12 d-flex">
                          <div className="w-100">
                            <div>
                              <p>{t('label_phone')}<span className="text-pink">*</span></p>
                            </div>
                            <div className="form-group">
                              <input type="text" className="form-control" name="phone" maxLength="10" placeholder={t('placeholder_phone')} />
                            </div>
                          </div>
                        </div>
                      )
                    }
                    
                    {/* </div>
                  <div className="row mx-0 px-0 mt-2"> */}
                    <div className="col-lg-6 col-12 d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('label_address')}<span className="text-pink">*</span></p>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="address" placeholder={t('placeholder_address')} required />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12 d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('label_province')}<span className="text-pink">*</span></p>
                        </div>
                        <div className="form-group styleSelect">
                          <div className="d-block position-relative">
                            <select className="form-control" name="province_code" onChange={onChangeProv}>
                              {
                                province ? Object.keys(province).map((prov, index) => (
                                  <option value={province[prov][0].province_code} key={prov}>{prov}</option>
                                )) : ''
                              }
                            </select>
                            <img src="/icon/icon-arrow-down.svg" className="select-icon" />
                          </div>
                        </div>
                        {/* <div className="form-group">
                          <input type="text" className="form-control" name="province" placeholder="select_province" />
                        </div> */}
                      </div>
                    </div>
                    <div className="col-lg-6 col-12 d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('label_amphoe')}<span className="text-pink">*</span></p>
                        </div>
                        <div className="form-group styleSelect">
                          <div className="d-block position-relative">
                            <select className="form-control" name="ampher" onChange={onChangeAmphoe}>
                              {
                                amphoe ? Object.keys(amphoe).map((amp, index) => (
                                  <option value={amp} key={amp}>{amp}</option>
                                )) : ''
                              }
                            </select>
                            <img src="/icon/icon-arrow-down.svg" className="select-icon" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12 d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('label_distrit')}<span className="text-pink">*</span></p>
                        </div>
                        <div className="form-group styleSelect">
                          <div className="d-block position-relative">
                            <select className="form-control" name="district" id="" onChange={onChangeDistrict}>
                              {
                                district ? Object.keys(district).map((dis, index) => (
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
                    <div className="col-lg-6 col-12 d-flex">
                      <div className="w-100">
                        <div>
                          <p>{t('label_postcode')}<span className="text-pink">*</span></p>
                        </div>
                        <div className="form-group styleSelect">
                          <div className="d-block position-relative">
                            <select className="form-control" name="post">
                              {
                                zipcode ? Object.keys(zipcode).map((zip) => (
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
                        <div className="col-lg-6 col-12 d-flex">
                          <div className="w-100">
                            <div>
                              <p>{t('label_tax_id')}</p>
                            </div>
                            <div className="form-group">
                              <input type="text" className="form-control" name="tax_id" minLength="13" maxLength="13" pattern="[0-9]+" placeholder={t('placeholder_tax_id')} />
                            </div>
                          </div>
                        </div>
                      )
                    }
                    
                    {
                      work && (
                        <div className="col-lg-6 col-12 office">
                          <div className="w-100">
                            <div>
                              <p>{t('label_branch_id')}</p>
                            </div>
                            <div className="form-group">
                              <input type="text" className="form-control" name="branch_code" maxLength="" placeholder={t('placeholder_branch_id')} />
                            </div>
                          </div>
                        </div>
                      )
                    }

                    {
                      tax && (
                        <div className="col-lg-6 col-12 d-flex">
                          <div className="w-100">
                            <div>
                              <p>{t('label_phone')}<span className="text-pink">*</span></p>
                            </div>
                            <div className="form-group">
                              <input type="text" className="form-control" name="phone" maxLength="10" placeholder={t('placeholder_phone')} />
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
                                {t('branch_tax')}
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
                  <div className="row mx-0 px-0 mt-5">
                    <div className="col-12 px-0">
                      <div className="float-right">
                        <button className="btn btn-outline-primary mr-3" type="button" onClick={handleClose}>{t('cancel')}</button>
                        <button className="btn btn-primary" type="submit">{t('confirm')}</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
	)
}

export default withTranslation(['shippingInfo','address'])(ModalAddress)