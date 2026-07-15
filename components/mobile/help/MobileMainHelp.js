
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import reactStringReplace from 'react-string-replace';
import { Collapse } from 'reactstrap';
import Navabout from '../Navabout';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import { Link, withTranslation } from '../../../utils/i18n';

const MobileMainHelp = (props) => {
  const {t, key_val : key, subkey} = props;
  const {user,handleCart, fetchUser} = useContext(UserContext)
  const [content, setContent] = useState();
  const [one, setOne] = useState();

  const router = useRouter();

  const fechData = () => {
    api.getAllContent({key, subkey}).then(res =>{
      const data = res.data;
      ;
      setContent(data);
    })
    .catch(err =>{
      console.log(err);
    })
  }

  const fechOne = () => {
    api.getCustompageOne(subkey).then(res =>{
      const data = res.data;
      ;
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
        <Link href="/help">
            <a className="btn-back cart-nav-back">
                <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
            </a>
        </Link>
      </div>
      <div className="bg-light-less-gray min-vh-100">
        <div className="h-64px">
        </div>
        <div className="container bg-white pb-2 mt-3 ">
          {
            content ? content.map((val, index) => (
              <div className="py-3 d-flex justify-content-between border-bottom" key={index}>
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
          }
          

        </div>
        <div className="footer-space"></div>
      </div >
        
      
    </>
  )
}
export default MobileMainHelp