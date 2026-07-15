
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import reactStringReplace from 'react-string-replace';
import { Collapse } from 'reactstrap';
import Navabout from '../../../components/mobile/Navabout';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import { Link, withTranslation } from '../../../utils/i18n';

const MobileMainAbout = (props) => {
  const {t, key_val : key, subkey} = props;
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
      ;
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

  const Inner = ({val,index}) =>{
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    return(
      <>
        <div className="container "key={val.id} >
          <div className="order-manage-address" onClick={toggle}>
            <p className="text-black my-auto">{val.title_th}</p>
            <i className={isOpen ? "text-pink my-auto fas fa-chevron-up" : "text-pink my-auto fas fa-chevron-down"}></i>
          </div>
          <Collapse isOpen={isOpen} >
            <div className="py-3">
              <h6 className="text-color-author"><u>{t("mobile_translations:branch")}</u></h6>
              <p className="p-12 mb-0">{reactStringReplace(val.address_th, '\r\n', () => <br />)}</p>
              <h6 className="text-color-author mt-3"><u>{t("mobile_translations:business_hours")}</u></h6>
              <p className="p-12 mb-0">{reactStringReplace(val.worktime_th, '\r\n', () => <br />)}</p>
              <h6 className="text-color-author mt-3"><u>{t("mobile_translations:contact")}</u></h6>
              <p className="p-12 mb-0">{reactStringReplace(val.contact_th, '\r\n', () => <br />)}</p>
            </div>
          </Collapse>
        </div>
      </>
    )
  }
  
  
  return (
    <>
      {
        (key == "about" && subkey == "history") && (
          <Navabout activeSlideNav="tab1">

            <div className="container history bg-white">
              {
                content ? content.map((val, index) => (
                  <div key={val.id}>
                    <h3 className="font-medium">{val.title_th}</h3>
                    {
                      <div dangerouslySetInnerHTML={{ __html: val.description_th }} />
                    }
                  </div>
                )) : ''
              }
            </div>

          </Navabout>

        )
      }
      {
        subkey == "community" && (
          <Navabout activeSlideNav="tab2">
            <div className="container bg-white py-4">
              {
                content ? content.map((val, index) => (

                  <div className="my-4" key={val.id}>
                    <div className="d-flex mb-3">
                      <img className="img-fluid img-board-circle m-auto" src={val.image} />

                    </div>
                    <h4 className="text-black text-center mb-0">{val.title_th}</h4>
                    <p className="text-black text-center">{val.position_th}</p>
                  </div>

                )) : ''
              }
            </div>
          </Navabout>
        )
      }
      {
        subkey == "branch" && (
          <Navabout activeSlideNav="tab3">
          { 
            content ? content.map((val, index) => (
              <Inner val={val} key={index}/>
           )):""}
          </Navabout>
        )
      }
      {
        subkey == "dealer" && (
          <Navabout activeSlideNav="tab4">
            <div className="container bg-white">
              {
                content ? content.map((val, index) => (
                <div className="mt-3 mb-2 order-border"  key={val.id}>
                  <div className="img-dealer" style={{ background: `url(${val.image})` }}></div>
                  <div className="py-2">
                    <h4 className="text-black">{val.title_th} <br />{reactStringReplace(val.address_th, '\r\n', () => <br />)}</h4>
                    <p className="p-12">{reactStringReplace(val.contact_th, '\r\n', () => <br />)}</p>
                  </div>
                </div>
                )) : ''
              }
            </div>
          </Navabout>
        )
      }
      
      
    </>
  )
}
export default MobileMainAbout