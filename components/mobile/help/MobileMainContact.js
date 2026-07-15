
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { CustomInput } from 'reactstrap';
import Navcontactus from '../NavContactus';
import UserContext from '../../../contexts/UserContext';
import myData from '../../../public/json/raw_database.json';
import api from '../../../utils/api';
import { Router } from '../../../utils/i18n';
import MobileMainAbout from './MobileMainAbout';
import MobileMainHelp from './MobileMainHelp';
import MobileMainPrivacy from './MobileMainPrivacy';

const MobileMainContact = (props) => {
  const { t, key_val: key, subkey, setLodding, loading } = props;
  const { user, handleCart, fetchUser } = useContext(UserContext)
  const [content, setContent] = useState();
  const [one, setOne] = useState();

  const router = useRouter();


  const fechData = () => {
    api.getAllContent({ key, subkey }).then(res => {
      const data = res.data;
      setContent(data);
    })
      .catch(err => {
        console.log(err);
      })
  }

  const fechOne = () => {
    api.getCustompageOne(subkey).then(res => {
      const data = res.data;
      setOne(data);
    })
      .catch(err => {
        console.log(err);
      })
  }


  useEffect(() => {
    fechData();
    fechOne();
  }, []);



  const handleError = (error) => {
    console.log(error);
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
    const data = new FormData(event.target)
    event.preventDefault()
    api.insertJob(data)
      .then(res => {
        const data = res.data;
        alert('สมัครงานสำเร็จ');
        Router.push('/contact/job_register');
      })
      .catch(err => {
        console.log(err.response);
      })
  }

  const handleSave = (event) => {
    var data = new FormData(event.target)
    event.preventDefault();
    api.sendContactEbook(data)
    .then(res => {
      const data = res.data;
      alert(t("successful"));
      Router.push('/');
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  return (
    <>
      {
        (key == "help") && (
          <MobileMainHelp t={t} key_val={key} subkey={subkey} />
        )
      }
      {
        (key == "about") && (
          <MobileMainAbout t={t} key_val={key} subkey={subkey} />
        )
      }
      {
        (key == "privacy_policy") && (
          <MobileMainPrivacy t={t} key_val={key} subkey={subkey} />
        )
      }
      {
        (key == "contact" && subkey != "job_register" && subkey != "contact_dealer_ebook") && (
          <>
            {
              content ? content.map((val, index) => (
                <Navcontactus activeSlideNav="tab2">
                  <div className="py-3 container" key={index}>
                    <div className="my-auto">
                      <h4 className="my-auto text-black">{val.title_th}</h4>
                      <div className="row px-3 pt-3 pb-0">
                        {
                          <p className="p-12 mb-0 p-editor" dangerouslySetInnerHTML={{ __html: val.description_th }} />
                        }
                      </div>
                    </div>
                  </div>
                </Navcontactus>

              )) : ''
            }
          </>
        )
      }
      {
        (key == "contact" && subkey == "contact_dealer_ebook") && (
          <>
            {
              content ? content.map((val, index) => (
                <Navcontactus activeSlideNav="tab4">
                  <div className="py-3 container" key={index}>
                    <div className="my-auto">
                      <h4 className="my-auto text-black">{val.title_th}</h4>
                      <div className="row px-3 pt-3 pb-0">
                        {
                          <p className="p-12 mb-0 p-editor" dangerouslySetInnerHTML={{ __html: val.description_th }} />
                        }
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <form id="promo-form" onSubmit={handleSave} encType="multipart/form-data">
                      <p>{t("more_information")}</p>
                      <div className="info-creditcard-100 mt-4 mb-3">
                        <input className="effect-16 " type="text" name="name" placeholder="" required />
                        <label>{t("mobile_translations:name_surname")}<span>*</span></label>
                        <span className="focus-border"></span>
                      </div>
                      <div className="info-creditcard-100 mt-4 mb-3">
                        <input className="effect-16 " name="email" type="text" placeholder="" required />
                        <label>{t("mobile_translations:email")}<span>*</span></label>
                        <span className="focus-border"></span>
                      </div>
                      <div className="info-creditcard-100 mt-4 mb-3">
                        <input className="effect-16 " name="phone" type="text" placeholder="" required />
                        <label>{t("mobile_translations:phone_number")}<span>*</span></label>
                        <span className="focus-border"></span>
                      </div>
                      <div className="info-creditcard-100 mt-4 mb-3">
                        <input className="effect-16 " name="subject" type="text" placeholder="" required />
                        <label>{t("heading")}<span>*</span></label>
                        <span className="focus-border"></span>
                      </div>
                      <div className="info-creditcard-100 mt-4 mb-4">
                        <input className="effect-16 " name="detail" type="text" placeholder="" required />
                        <label>{t("details")}<span>*</span></label>
                        <span className="focus-border"></span>
                      </div>
                      <div className="mt-3 pt-2">
                        <button type="submit" className="btn btn-pink-submit h-40px mt-5 mb-3"><h4 className="text-white m-auto ">{t("mobile_translations:send")}</h4></button>
                      </div>
                    </form>
                  </div>
                </Navcontactus>

              )) : ''
            }
          </>
        )
      }


      {

        (key == "contact" && subkey == "job_register") && (
          <Navcontactus activeSlideNav="tab3">
            {/*
              content ? content.map((val, index) => (

                <div className="py-3 container" key={index}>
                  <div className="my-auto">
                    <h4 className="my-auto text-black">{val.title_th}</h4>
                    <div className="row px-3 pt-3 pb-0">
                      {
                        <p className="p-12 mb-0 p-editor" dangerouslySetInnerHTML={{ __html: val.description_th }} />
                      }
                    </div>

                  </div>
                </div>

              )) : ''
            */}
            <div className="container">
              <h4 className="text-black">Coming Soon...</h4>
              {/*
              <form className="row" onSubmit={handleForm} encType="multipart/form-data">
                <div className="col-12">
                  <h4 className="text-black">{t("personal_information")}</h4>
                  <div className="info-creditcard-100 mt-4 mb-3">
                    <input className="effect-16 " name="firstname" type="text" placeholder="" required />
                    <label>{t("mobile_translations:name")}</label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="info-creditcard-100 mt-4 mb-3">
                    <input className="effect-16 " name="lastname" type="text" placeholder="" required />
                    <label>{t("mobile_translations:surname")}</label>
                    <span className="focus-border"></span>
                  </div>
                  
                  <div className="info-creditcard-100 w-70 mt-4 mb-3 mr-5p">
                    <input className="effect-16 " name="email" type="text" placeholder="" required />
                    <label>{t("mobile_translations:email")}</label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="info-creditcard-100 w-25 mt-4 mb-3">
                    <input className="effect-16 " name="age" type="text" placeholder="" required />
                    <label>{t("age")}</label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="info-creditcard-100 mt-4 mb-3">
                    <input className="effect-16 " name="phone" type="text" placeholder="" required />
                    <label>{t("mobile_translations:phone_number")}</label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="info-creditcard-100 mt-4">
                    <select className="w-100" name="comfort_province" required>
                      {
                        province ? Object.keys(province).map((prov,index)=>(
                          <option value={prov} key={prov}>{prov}</option>
                        )) : ''
                      }
                    </select>
                  </div>
                  <div className="info-creditcard-100 mt-4">
                    <select className="w-100" name="education" required>
                      <option value="" disabled selected>{t("highest_education")}</option>
                      <option>{t('bachelor_degrees')}</option>
                      <option>{t('master_degrees')}</option>
                      <option>{t('doctor_degrees')}</option>
                    </select>
                  </div>
                  <div className="info-creditcard-100 mt-4 mb-3">
                    <input className="effect-16 " name="work_exp" type="text" placeholder="" required />
                    <label>{t("work_experience")} </label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="info-creditcard-100 mt-4 mb-3 d-flex justify-content-between">
                    <p className="text-black">{t("attach_photo")}</p>
                    <label htmlFor="upload-button" className="text-pink"><h4>{t("choose_image")}</h4></label>
                    <input type="file" name="picture" id="upload-button" style={{ display: 'none' }} />
                  </div>
                  <h4 className="text-black">{t("job_application_details")}</h4>
                  <div className="info-creditcard-100 mt-4">
                    <select className="w-100" name="position"  required>
                      <option value="" disabled selected>{t("preferred_position")}</option>
                      {
                        position ? position.map((val, index) => (
                          <option value={val.name}>{val.name}</option>
                        )) : ''
                      }
                    </select>
                  </div>
                  <div className="info-creditcard-100 mt-4 mb-3">
                    <input className="effect-16 " name="salary" type="text" placeholder="" required />
                    <label>{t("expected_salary")} </label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="info-creditcard-100 mt-4 mb-3 d-flex justify-content-between">
                    <p className="text-black">{t("attach_work_history")}</p>
                    <label htmlFor="upload-button2" className="text-pink"><h4>{t("choose_image")}</h4></label>
                    <input type="file" name="work_history_file" id="upload-button2" style={{ display: 'none' }} />
                  </div>
                  <div className="info-creditcard-100 mt-4 mb-3">
                    <h4 className="text-black">{t("convenient_time_back")} </h4>
                    <div className="d-flex py-2">
                      <CustomInput type="radio" id="time_01" name="comfort_time" defaultValue="08:30 - 12:00" className="my-auto mr-2" required  /> 
                      <p className="text-black my-auto mb-0">08:30 น. - 12:00 น.</p>
                    </div>
                    <div className="d-flex py-2">
                      <CustomInput type="radio" id="time_02" name="comfort_time" defaultValue="13:00 - 17:00" className="my-auto mr-2" required  /> 
                      <p className="text-black my-auto mb-0">13:00 น. - 17:00 น.</p>
                    </div>
                  </div>
                  <div className="info-creditcard-100 mt-2 mb-3">
                    <div className="d-flex">
                      <CustomInput type="checkbox"name="information" defaultValue="1" id="accept" className="my-auto" required />
                      <p className="p-12 my-auto">{t("chula_book_center_suggest")}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2">
                    <button type="submit" className="btn btn-pink-submit h-40px mt-5 mb-3"><h4 className="text-white m-auto ">{t("mobile_translations:send_form")}</h4></button>
                  </div>
                </div>
              </form>
              */}
            </div>
          </Navcontactus>
        )

      }

    </>
  )
}
export default MobileMainContact