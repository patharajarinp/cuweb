import classnames from "classnames";
import React, { useEffect, useState } from 'react';
import { Collapse } from 'reactstrap';
import Layout from '../components/layout';
import api from '../utils/api';
import { Link, withTranslation } from '../utils/i18n';

const Helper = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState();
    const [pagesHelp, setPagesHelp] = useState();
    const {t} = props;
    const fechData = () => {
        api.getAllContent({key : 'help', subkey : 'faq' }).then(res =>{
          const data = res.data;
          setContent(data);
        //   ;
        })
        .catch(err =>{
          console.log(err);
        })
    }
    const fechHelp = () => {
        var key = 'help'
        api.getCustompage(key)
        .then(res=>{
          const data = res.data;
          ;
          setPagesHelp(data);
        })
        .catch(err => {
          console.log(err.response);
        })
    }

    const toggle = (id) => {
        if(id == isOpen) {
            setIsOpen(false);
        }else{
            setIsOpen(id);
        }
        
    }
    
    useEffect(() => {
        fechData();
        fechHelp();
    },[]);

  return (

    <Layout className="mb-5">
      <div className="bg-light-less-gray min-vh-100">
        <div className="help-nav ">
          <div className="container px-0">
            <Link href="/user/dashboard">
              <a className="btn-back help-nav-back">
                <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
              </a>
            </Link>
            <h2 className="h20 text-course mt-auto mb-3">{t("need_help")} <br />{t("which")}?</h2>
          </div>

        </div>
        <div className="container mt-3">
          <div className="help-list">
              <h4 className="text-black my-auto">{t("faq")}</h4>
          </div>
          {
            content ? content.map((val, index) => (
              <>
                <div className="help-list" key={index} onClick={() => toggle(val.id)}>
                  <p className="text-black my-auto two-line mr-2">{val.title_th}</p>
                  <i className={classnames("text-pink my-auto fas ",{"fa-chevron-up":(isOpen == val.id),"fa-chevron-down":(isOpen != val.id)})}></i>
                </div>
                
                <Collapse isOpen={isOpen == val.id} >
                  <div className="p-12 py-3 bg-light-less-gray img-fix">
                    {
                      <div dangerouslySetInnerHTML={{ __html: val.description_th }} ></div>
                    }
                  </div>
                </Collapse>
              </>
            )) : ''
          }
        </div>
        <div className="container mt-3">
          <div className="help-list">
            <h4 className="text-black my-auto">{t("topic")}</h4>
          </div>
          {
            pagesHelp ? pagesHelp.map((val, index) => (
              val.path != 'faq' && (
                <Link href={`/help/[subkey]?key=help&subkey=${val.path}`} as={`/help/${val.path}`}>
                  <a key={index}>
                    <div className="help-list">
                      <div className="d-flex w-100">
                        <img className="img-fluid mr-3 w-24px" src={val.image ? val.image : "/mobile/image/icon/icon-cart-pink.svg"} />
                        <p className="text-black my-auto two-line mr-2">{val.title_th}</p>
                      </div>
                      <i className="text-pink my-auto fas fa-chevron-right"></i>
                    </div>
                  </a>
                </Link>
              )
            )) : ''
          }
        </div>
        <div className="container bg-white mt-3  py-5">
          <div className="d-flex">
            <h2 className="text-black h20 text-center m-auto">{t("need_more_help")}?</h2>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <Link href="/contact">
              <a className="btn bg-pink text-white shadow-likecard">{t("translations:contact_us")}</a>
            </Link>
          </div>
        </div>
        <div className="footer-space"></div>
      </div>
    </Layout >

  );
}

export default withTranslation('mobile_help')(Helper); 