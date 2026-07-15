import React, { useState, useContext, useRef, useEffect } from 'react'
import classNames from 'classnames';
import { withTranslation, Link, Router } from '../../utils/i18n'
import api from '../../utils/api';
import AuthService from '../../utils/AuthService';
import UserContext from '../../contexts/UserContext';
import LoginLayout from '../../components/layout/login_layout'
import { Accordion, Card, Button } from 'react-bootstrap';
import reactStringReplace from 'react-string-replace'
import { useRouter } from 'next/router';
import ModalSuccessDialog from '../../components/ModalSuccessDialog'
import myData from '../../public/json/raw_database.json';
import ReCAPTCHA from "react-google-recaptcha";

const Static = (props, ref) => {
  const [modalShow1, setModalShow1] = useState(false);
  const handleModalClose1 = () => setModalShow1(false);
  const { t, setLodding, loading } = props;
  const { local } = useContext(UserContext);
  const [icon, setIcon] = useState('collapsed');
  const [address, setAddress] = useState();
  const [one, setOne] = useState();
  const [nameFile, setnameFile] = useState("No file chosen")
  const fileInput = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    setnameFile(fileInput.current.files[0].name);
  }
  const [nameFile2, setnameFile2] = useState("No file chosen")
  const fileInput2 = useRef();
  const handleSubmit2 = (e) => {
    e.preventDefault();
    setnameFile2(fileInput2.current.files[0].name);
  }
  var key = props.key;
  var subkey = props.subkey;
  const router = useRouter()
  const pathname = router.pathname;

  const feachAddress = (id) => {
    api.getContact(id).then(res => {
      const data = res.data;
      // ;
      setAddress(data);
    })
      .catch(err => {
        console.log(err);
      })
  }

  const fechOne = () => {
    api.getCustompageOne(subkey).then(res => {
      const data = res.data;
      // ;
      setOne(data);
    })
      .catch(err => {
        console.log(err);
      })
  }

  const handleSave = () => {
    event.preventDefault();
    if (!captcha) {
      setCaptText(t('recaptcha'));
      return;
    }
    setLodding(true)
    var data = new FormData(event.target)
    api.sendContact(data)
      .then(res => {
        const data = res.data;
        // alert(t('translations:successful'));
        setLodding(false)
        setModalShow1(true);
        document.getElementById("contact-form").reset();

      })
      .catch(err => {
        console.log(err.response);
      })
  }

  
  const handleSaveEbook = () => {
    event.preventDefault();
    if (!captcha) {
      setCaptText(t('recaptcha'));
      return;
    }
    setLodding(true)
    var data = new FormData(event.target)
    api.sendContactEbook(data)
      .then(res => {
        const data = res.data;
        // alert(t('translations:successful'));
        setLodding(false)
        setModalShow1(true);
        document.getElementById("contact-form").reset();

      })
      .catch(err => {
        console.log(err.response);
      })
  }

  React.useEffect(() => {
    if (props.subkey == 'contact' && props.content && props.content.length) {
      var id = props.content[0].id;
      feachAddress(id);
    }
    fechOne();
  }, [props]);

  const selectAddress = (e) => {
    var id = e.target.options[e.target.selectedIndex].value;
    feachAddress(id);
  }
  const [plusShow, setplusShow] = useState(true);
  const ToggleplusShow = () => { setplusShow(!plusShow); };
  const [onindex, setonindex] = useState(null);

  const onConfirm1 = () => {
    handleModalClose1();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    Router.push(pathname);
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

  const [position, setPosition] = useState(false);
  const [province, setProvince] = useState();
  const fecthPosition = () => {
    api.getPosition()
      .then(res => {
        const data = res.data;
        setPosition(data);
      })
      .catch(err => {
        console.log(err.response);
      })
  }
  useEffect(() => {
    fecthPosition();
    getOptionAddress(myData)
  }, []);

  const getOptionAddress = (obj, index = 'กรุงเทพมหานคร') => {
    var prov = groupBy(obj, 'province');
    setProvince(prov)
  }

  const handleForm = () => {
    event.preventDefault();
    if (!captcha) {
      setCaptText(t('recaptcha'));
      return;
    }
    setLodding(true)
    const data = new FormData(event.target)
    api.insertJob(data)
      .then(res => {
        const data = res.data;
        setModalShow1(true);
        document.getElementById("contact-form").reset();
        setnameFile("No file chosen");
        setnameFile2("No file chosen");
        setLodding(false)
      })
      .catch(err => {
        setLodding(false)
        if (!err && !err.response) {
          return;
        }
        if (err.response.data.code == 8001) {
          alert('File not is Match!!!');
        }
        console.log(err.response);
      })
  }

  const [captcha, setCaptcha] = useState(false);
  const [captText, setCaptText] = useState(false);
  const handleRecaptcha = (value) => {
    setCaptcha(true);
    setCaptText(false);
  }

  return (
    <>
      <div className="col-lg-9 show-editor set-min-hieght mt-5 pl-4">
        <div className="row">
          <div className="col-12">
            <div className="text-left d-flex">
              <div className="col-8 px-0">
                <h2 className="font-semi">
                  {one ? one["title_" + local] : ''}
                </h2>
              </div>
              {
                props.subkey == "contact" && (
                  <div className="col-4 px-0">
                    <select className="form-control" onChange={selectAddress}>
                      {
                        props.content ? props.content.map((val, index) => (
                          <option value={val.id}>{val["title_" + local]}</option>
                        )) : ''
                      }
                    </select>
                  </div>
                )
              }
            </div>
          </div>
        </div>

        <div className="row mt-5 pb-5">
          <div className="col-12">
            {(props.page == "contact" && props.subkey == "job_register") && (
              <div>
                <div>
                  {
                    props.content ? props.content.map((val, index) => (
                      <div key={val.id}>
                        <h3 className="font-medium">{val["title_" + local]}</h3>
                        {
                          <div dangerouslySetInnerHTML={{ __html: val['description_' + local] }} />
                        }
                      </div>
                    )) : ''
                  }
                </div>
                <h4 className="text-black">Coming Soon</h4>
                {/* <p>ศูนย์หนังสือจุฬาลงกรณ์มหาวิทยาลัย เป็นหน่วยงานของจุฬาลงกรณ์มหาวิทยาลัยเป็น”ร้านหนังสือในดวงใจ ของ คนไทยทั้งประเทศไทย” ผู้นำความครบถ้วนหลากหลาย หนังสือภาษาไทย - ต่างประเทศ และสื่อการศึกษา ให้ข้อมูลที่เป็นกลางทั้งลูกค้า และสำนักพิมพ์ ดำเนินกิจการในรูปวิสาหกิจที่ต้องเลี้ยงตัวเอง และ ดำเนินงานคล้าย ระบบธุรกิจเอกชน ที่มิได้แสวงหากำไรสูงสุด แต่เพื่อให้สามารถแข่งขันกับตลาดภายนอกได ้ ศูนย์หนังสือจุฬาฯ อยู่ในฐานะเป็นหน่วยงานบริการของมหาวิทยาลัย ที่มีนโยบาย แน่วแน่ในการสร้างคนไทยให้มีคุณภาพ มีนิสัย ใฝ่รู้ รักการอ่าน รู้จักค้นคว้าหาข้อมูล และนำความรู้ไปใช้ให้เกิดประโยชน์แก่ตนเองและบ้านเมือง</p> */}
                {/*
                <h4 className="text-black">{t('personal_information')}</h4>
                <p>{t('your_information')}</p>
                <form className="row" id="contact-form" onSubmit={handleForm} encType="multipart/form-data">
                  <div className="form-group mb-4 col-6">
                    <label>{t('translations:name')}<span className="text-pink">*</span></label>
                    <input type="text" id="firstname" className="form-control" name="firstname" placeholder={t('translations:name')} required />
                  </div>
                  <div className="form-group mb-4 col-6">
                    <label>{t('translations:surname')}<span className="text-pink">*</span></label>
                    <input type="text" id="lastname" className="form-control" name="lastname" placeholder={t('translations:surname')} required />
                  </div>
                  <div className="form-group mb-4 col-6">
                    <label>{t('translations:age')}<span className="text-pink">*</span></label>
                    <input type="number" name="age" min="1" max="100" id="age" className="form-control" placeholder={t('translations:please_age')} required />
                  </div>
                  <div className="form-group mb-4 col-6">
                    <label>{t('translations:email')}<span className="text-pink">*</span></label>
                    <input type="email" id="email" className="form-control" name="email" placeholder={t('translations:please_email')} required />
                  </div>
                  <div className="form-group mb-4 col-6">
                    <label>{t('translations:phone_number')}<span className="text-pink">*</span></label>
                    <input type="text" id="phone" maxlength="10" className="form-control" name="phone" placeholder={t('translations:please_phone_number')} required />
                  </div>
                  <div className="form-group mb-4 col-6 styleSelect">
                    <label>{t('housing_to_work')}<span className="text-pink">*</span></label>
                    <div className="d-block position-relative">
                      <select className="form-control" name="comfort_province" id="">
                        {
                          province ? Object.keys(province).map((prov,index)=>(
                            <option value={prov} key={prov}>{prov}</option>
                          )) : ''
                        }
                      </select>
                      <img src={`${api.frontend_url}/icon/icon-arrow-down.svg`} className="select-icon" />
                    </div>
                  </div>
                  <div className="form-group mb-4 col-6">
                    <label>{t('highest_education')}<span className="text-pink">*</span></label>
                    <select className="form-control" name="education" required>
                      <option value="" selected >{t('choose_education')}</option>
                      <option>{t('bachelor_degrees')}</option>
                      <option>{t('master_degrees')}</option>
                      <option>{t('doctor_degrees')}</option>
                    </select>
                  </div>
                  <div className="form-group mb-4 col-6">
                    <label>{t('work_experience')}<span className="text-pink">*</span></label>
                    <input type="text" id="work_exp" className="form-control" name="work_exp" placeholder={t('translations:please_address')} required />
                  </div>
                  <div className="form-group mb-4 col-12">
                    <label>{t('attach_photo')}<span className="text-pink">*</span></label>
                    <div className="d-flex align-items-center">
                      <label htmlFor="up_img1" className="upimgbtn font-semi">{t('choose_file')}</label>
                      <div className="upImg-area" >
                        <input type="file" id="up_img1" className="upImg" name="picture" ref={fileInput} onChange={handleSubmit} required />
                       {/*  <span className="font-semi">{t('choose_image')}</span> 
                      </div>
                      <p className="ml-3 my-auto"> {nameFile}</p>
                    </div>
                  </div>
                  <div className="col-12">
                    <h4 className="text-black">{t('job_application_details')}</h4>
                  </div>
                  <div className="form-group mb-4 col-6">
                    <label>{t('preferred_position')}<span className="text-pink">*</span></label>
                    <select className="form-control" name="position" required>
                      <option value="">{t('choose_position')}</option>
                      {
                        position ? position.map((val, index) => (
                          <option value={val.name}>{val.name}</option>
                        )) : ''
                      }
                    </select>
                  </div>
                  <div className="form-group mb-4 col-6">
                    <label>{t('expected_salary')}<span className="text-pink">*</span></label>
                    <input type="number" name="quantity" min="1" max="50000" id="salary" className="form-control" name="salary" placeholder={t('expected_salary')} required />
                  </div>
                  <div className="form-group mb-4 col-6">
                    <label>{t('attach_work_history')}<span className="text-pink">*</span></label>
                    <div className="d-flex align-items-center">
                    <label htmlFor="up_img2" className="upimgbtn font-semi">{t('choose_file')}</label>
                      <div className="upImg-area ">
                        <input type="file" id="up_img2" className="upImg" name="work_history_file" ref={fileInput2} onChange={handleSubmit2} required multiple />
                        {/* <span className="font-semi ">{t('choose_file')}</span> 
                      </div>
                      <p className="ml-3 my-auto"> {nameFile2}</p>
                    </div>
                  </div>
                  <div className="form-group mb-4 col-6 row">
                    <label className="col-12">{t('convenient_time_back')}<span className="text-pink">*</span></label>
                    <div className="form-group d-flex align-items-center col-6">
                      <label className="radio-button">
                        <input type="radio" className="radio-button__input" name="comfort_time" defaultValue="08:30 - 12:00" required />
                        <span className="radio-button__control"></span>
                        <span className="radio-button__label">08:30 - 12:00</span>
                        
                      </label>
                    </div>
                    <div className="form-group d-flex align-items-center col-6">
                      <label className="radio-button">
                        <input type="radio" className="radio-button__input" name="comfort_time" defaultValue="13:00 - 17:00" required />
                        <span className="radio-button__control"></span>
                        <span className="radio-button__label">13:00 - 17:00</span>
                      </label>
                    </div>
                  </div>
                  <div className="form-group col-12">
                    <div className="custom-control custom-checkbox mb-0">
                      <input type="checkbox" className="custom-control-input" id="customCheck" name="information" value="1" required />
                      <label className="custom-control-label" htmlFor="customCheck">
                      <p>
                      {t('chula_book_center_suggest')} *
                      </p>
                      </label>
                    </div>
                  </div>
                  <div className="col-12 d-flex justify-content-center ">
                    <ReCAPTCHA
                      sitekey="6Ld08KQZAAAAAK-4xAOAI6hoWe5VnijI4mApdmaS"
                      onChange={handleRecaptcha}
                    />
                  </div>
                  {
                    captText ? (
                      <div className="col-12 d-flex justify-content-center ">
                        <p className="mb-0 font-14 text-danger">{captText}</p>
                      </div>
                    ) : ''
                  }
                 
                  <div className="col-12 d-flex justify-content-center mt-4">
                    <input type="submit" className="btn btn-primary" />
                  </div>
                </form>
                */}
              </div>
            )
            }
            {
              (props.page == "help" && props.subkey == "faq") && (
                <Accordion>
                  {
                    props.content ? props.content.map((val, index) => (
                      <Card className="card-collapse" key={val.id}>
                        <Card.Header className={onindex === index ? (plusShow ? "px-0 collapsed " : "px-0 collapsed show") : "px-0 collapsed"} onClick={() => { (onindex == index ? setplusShow(!plusShow) : setplusShow(false)); setonindex(index); }}>
                          <Accordion.Toggle as={Button} className="px-0" variant="link" eventKey={index}>
                            <h3 className="font-medium pr-3">{val['title_' + local]}</h3>
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={index}>
                          <Card.Body>
                            {
                              <div dangerouslySetInnerHTML={{ __html: val['description_' + local] }} />
                            }
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    )) : ''
                  }
                </Accordion>
              )
            }

            {
              (props.page == "help" && props.subkey != "faq") && (
                <div>
                  {
                    props.content ? props.content.map((val, index) => (
                      <div key={val.id}>
                        <h3 className="font-medium">{val['title_' + local]}</h3>
                        {
                          <div className="editor" dangerouslySetInnerHTML={{ __html: val['description_' + local] }} />
                        }
                      </div>
                    )) : ''
                  }
                </div>
              )
            }

            {
              (props.subkey == "history" || props.subkey == "contact_dealer" || props.subkey == "register" || props.page == "privacy_policy") && (
                <div>
                  {
                    props.content ? props.content.map((val, index) => (
                      <div key={val.id}>
                        <h3 className="font-medium">{val['title_' + local]}</h3>
                        {
                          <div dangerouslySetInnerHTML={{ __html: val['description_' + local] }} />
                        }
                      </div>
                    )) : ''
                  }
                </div>
              )
            }
            {
              props.subkey == "contact_dealer_ebook" && (
                <div>
                  {
                    props.content ? props.content.map((val, index) => (
                      <div key={val.id}>
                        <h3 className="font-medium">{val['title_' + local]}</h3>
                        {
                          <div dangerouslySetInnerHTML={{ __html: val['description_' + local] }} />
                        }
                      </div>
                    )) : ''
                  }
                  <form id="contact-form" onSubmit={handleSaveEbook} encType="multipart/form-data">
                      <div className="row mt-5 pb-3">
                        <div className="col-12">
                          <h2 className="font-semi">{t('how_to_contact_us')}</h2>
                          <p>{t('for_more_information')} Call Center 0-2255-4433</p>
                        </div>
                      </div>
                      <div className="row pb-5">
                        <div className="col-6">
                          <div className="form-group">
                            <label>{t('translations:name_surname')}<span className="text-pink">*</span></label>
                            <input type="text" name="name" className="form-control" placeholder={t('translations:name_surname')} />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label>{t('translations:email')}<span className="text-pink">*</span></label>
                            <input type="email" name="email" className="form-control" placeholder={t('translations:please_email')} />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label>{t('translations:phone_number')}<span className="text-pink">*</span></label>
                            <input type="text" name="phone" className="form-control" placeholder={t('translations:please_phone_number')} />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <label>{t('heading')}<span className="text-pink">*</span></label>
                            <input type="text" name="subject" className="form-control" placeholder={t("please_heading")} />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <label>{t('details')}<span className="text-pink">*</span></label>
                            <textarea name="detail" className="form-control" rows="3"></textarea>
                            {/* <input type="text" name="detail" className="form-control" placeholder="{t('please_details')}" /> */}
                          </div>
                        </div>
                        <div className="col-12 d-flex justify-content-center mt-3">
                          <ReCAPTCHA
                            sitekey="6Ld08KQZAAAAAK-4xAOAI6hoWe5VnijI4mApdmaS"
                            onChange={handleRecaptcha}
                          />
                        </div>
                        {
                          captText ? (
                            <div className="col-12 d-flex justify-content-center ">
                              <p className="mb-0 font-14 text-danger">{captText}</p>
                            </div>
                          ) : ''
                        }
                        <div className="col-12 mt-4">
                          <div className="text-center">
                            <button className="btn btn-primary" type="submit">{t('translations:send')}</button>
                          </div>
                        </div>
                      </div>
                    </form>
                </div>
              )
            }

            {
              props.subkey == "community" && (
                <div className="row">
                  {
                    props.content ? props.content.map((val, index) => (
                      <div className="col-xl-4 col-lg-6 col-md-12" key={val.id}>
                        <div className="community">
                          <div className="box-img">
                            <img src={val.image} className="" align="middle" />
                          </div>
                          <div className="text-center mt-3">
                            <p className="p-medium">{val['title_' + local]}</p>
                            <p className="">{val['position_' + local]}</p>
                          </div>
                        </div>
                      </div>
                    )) : ''
                  }
                </div>
              )
            }

            {
              props.subkey == "branch" && (
                props.content ? props.content.map((val, index) => (
                  <div className="row border-branch py-3" key={val.id}>
                    <div className="col-4">
                      <p className="p-medium text-pink">{val['title_' + local]}</p>
                      <p className="">{reactStringReplace(val['address_' + local], '\r\n', () => <br />)}</p>
                    </div>
                    <div className="col-4">
                      <p className="p-medium text-pink">{t('business_hours')}</p>
                      <p className="">{reactStringReplace(val['worktime_' + local], '\r\n', () => <br />)}</p>
                    </div>
                    <div className="col-4">
                      <p className="p-medium text-pink">{t('translations:contact')}</p>
                      <p className="">{reactStringReplace(val['contact_' + local], '\r\n', () => <br />)}</p>
                    </div>
                  </div>
                )) : ''
              )
            }

            {
              props.subkey == "dealer" && (
                <div className="row">
                  {
                    props.content ? props.content.map((val, index) => (
                      <div className="col-xl-4 col-lg-6 col-md-6" key={val.id}>
                        <div className="dealer">
                          <div className="box-img">
                            <img src={val.image} className="w-100" />
                          </div>
                          <div className="mt-3">
                            <p className="p-medium name">{val['title_' + local]}</p>
                            <p className="pt-3 address">{reactStringReplace(val['address_' + local], '\r\n', () => <br />)}</p>
                            <p className="">{reactStringReplace(val['contact_' + local], '\r\n', () => <br />)}</p>
                          </div>
                        </div>
                      </div>
                    )) : ''
                  }
                </div>
              )
            }


            {
              props.subkey == "contact" && (
                address && (
                  <div>
                    <div className="row">
                      <div className="col-12">
                        <iframe className="map" src={address.map}
                          frameBorder="0" allowFullScreen=""></iframe>
                      </div>
                    </div>
                    <div className="row mt-5 pb-5">
                      <div className="col-4 border-right">
                        <h3 className="font-medium"><img src={`${api.frontend_url}/icon/c_home.svg`} />{t('translations:address')}</h3>
                        <p>
                          {reactStringReplace(address['address_' + local], '\r\n', () => <br />)}
                        </p>
                      </div>
                      <div className="col-4 border-right">
                        <h3 className="font-medium"><img src={`${api.frontend_url}/icon/c_time.svg`} />{t('business_hours')}</h3>
                        <p>
                          {reactStringReplace(address['worktime_' + local], '\r\n', () => <br />)}
                        </p>
                      </div>
                      <div className="col-4">
                        <h3 className="font-medium"><img src={`${api.frontend_url}/icon/c_tel.svg`} />{t('translations:contact')}</h3>
                        <p>
                          {reactStringReplace(address['contact_' + local], '\r\n', () => <br />)}
                        </p>
                      </div>
                    </div>
                    <form id="contact-form" onSubmit={handleSave} encType="multipart/form-data">
                      <div className="row mt-5 pb-3">
                        <div className="col-12">
                          <h2 className="font-semi">{t('how_to_contact_us')}</h2>
                          <p>{t('for_more_information')} Call Center 0-2255-4433</p>
                        </div>
                      </div>
                      <div className="row pb-5">
                        <div className="col-6">
                          <div className="form-group">
                            <label>{t('translations:name_surname')}<span className="text-pink">*</span></label>
                            <input type="text" name="name" className="form-control" placeholder={t('translations:name_surname')} />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label>{t('translations:email')}<span className="text-pink">*</span></label>
                            <input type="email" name="email" className="form-control" placeholder={t('translations:please_email')} />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label>{t('translations:phone_number')}<span className="text-pink">*</span></label>
                            <input type="text" name="phone" className="form-control" placeholder={t('translations:please_phone_number')} />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label>{t('translations:address')}<span className="text-pink">*</span></label>
                            <input type="text" name="address" className="form-control" placeholder={t('translations:please_address')} />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <label>{t('heading')}<span className="text-pink">*</span></label>
                            <input type="text" name="subject" className="form-control" placeholder={t("please_heading")} />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <label>{t('details')}<span className="text-pink">*</span></label>
                            <textarea name="detail" className="form-control" rows="3"></textarea>
                            {/* <input type="text" name="detail" className="form-control" placeholder="{t('please_details')}" /> */}
                          </div>
                        </div>
                        <div className="col-12 d-flex justify-content-center mt-3">
                          <ReCAPTCHA
                            sitekey="6Ld08KQZAAAAAK-4xAOAI6hoWe5VnijI4mApdmaS"
                            onChange={handleRecaptcha}
                          />
                        </div>
                        {
                          captText ? (
                            <div className="col-12 d-flex justify-content-center ">
                              <p className="mb-0 font-14 text-danger">{captText}</p>
                            </div>
                          ) : ''
                        }
                        <div className="col-12 mt-4">
                          <div className="text-center">
                            <button className="btn btn-primary" type="submit">{t('translations:send')}</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )
              )
            }
          </div>
        </div>

        {
          (props.page == "help") && (
            <div className="row mt-5 pb-5">
              <div className="col-12">
                <div className="text-center">
                  <h2 className="font-semi">{t('need_more_help')}?</h2>
                </div>
              </div>
              <div className="col-12 mt-4">
                <div className="text-center">
                  <Link href={`/contact`}>
                    <a><button className="btn btn-primary">{t('translations:contact_us')}</button></a>
                  </Link>
                </div>
              </div>
            </div>
          )
        }
      </div>
      <ModalSuccessDialog show={modalShow1}
        text="ส่งข้อมูลสำเร็จ!!!"
        onConfirm={onConfirm1}
        size="md" onHide={handleModalClose1} />
    </>
  )
}

export default withTranslation(['static', 'translations'])(Static)