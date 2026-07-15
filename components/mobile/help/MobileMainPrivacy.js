
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import reactStringReplace from 'react-string-replace';
import { Collapse } from 'reactstrap';
import Navabout from '../Navabout';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import { Link, withTranslation } from '../../../utils/i18n';

const MobileMainPrivacy = (props) => {
  const {t, key_val : key, subkey} = props;
  const {user,handleCart, fetchUser} = useContext(UserContext)
  const [content, setContent] = useState();
  const [one, setOne] = useState();

  const router = useRouter();


  const fechData = () => {
    api.getAllContent({key, subkey}).then(res =>{
      const data = res.data;
      setContent(data);
    })
    .catch(err =>{
      console.log(err);
    })
  }

  const fechOne = () => {
    api.getCustompageOne(subkey).then(res =>{
      const data = res.data;
      setOne(data);
    })
    .catch(err =>{
      console.log(err);
    })
  }
  

  useEffect(() => {
    fechData();
    fechOne();
  },[]);

  

  const handleError = (error) => {
    console.log( error);
  }

  
  return (
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title">
          <h4 className="text-black">{one ? one.title_th : ''}</h4>
        </div>
        <Link href='/'>
          <a className="btn-back cart-nav-back">
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
        </Link>
      </div>
      <div className="bg-light-less-gray min-vh-100">
        <div className="container bg-white pb-2 mt-3 ">
          <div className="h-64px"></div>
          {
           (
            key == "privacy_policy" || subkey == "privacy_policy") && (
              <>
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
              </> 
            )
          }
        </div>
        <div className="footer-space"></div>
      </div >

    </>
  )
}
export default MobileMainPrivacy