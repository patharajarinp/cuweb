import React from 'react';
import Layout from '../../components/layout';
import { Link, withTranslation } from '../../utils/i18n';
import NavbarCustom from './NavbarCustom';

const Navabout = (props) => {
    const {t} = props;
    return (
        <Layout className="mb-5">
            {/* <div className="order-nav">
                <div className=" text-center order-nav-title">
                    <h3 className="text-black mb-0">{t("static_nav:about")}</h3>
                </div>
                <Link href='/'>
                    <a className="btn-back order-nav-back">
                        <img className="img-fluid" src={'/image/icon/icon-back.svg'} />
                    </a>
                </Link>
            </div> */}
            <NavbarCustom isBurger={true} isLang={false} right={<></>} _class={"box-shadow-none"} center={<h3 className="text-black mb-0">{t("mobile_static_nav:about")}</h3>}  />
            <div className="product-detail-nav order">
                <div className="product-detail-nav-area ">
                    <Link href={`/about/[subkey]?subkey=history`} as={`/about/history`}>
                        <a href="" className={props.activeSlideNav === "tab1" ? "product-detail-nav-list  active" : "product-detail-nav-list "}  >
                            <h4>{t("history")}</h4>
                        </a>
                    </Link>
                    <Link href={`/about/[subkey]?subkey=community`} as={`/about/community`}>
                        <a href="" className={props.activeSlideNav === "tab2" ? "product-detail-nav-list active" : "product-detail-nav-list "}>
                            <h4>{t("committee")}</h4>
                        </a>
                    </Link>
                    <Link href={`/about/[subkey]?subkey=branch`} as={`/about/branch`}>
                        <a href="" className={props.activeSlideNav === "tab3" ? "product-detail-nav-list  active" : "product-detail-nav-list "} >
                            <h4>{t("branch")}</h4>
                        </a>
                    </Link>
                    <Link href={`/about/[subkey]?subkey=dealer`} as={`/about/dealer`}>
                        <a href="" className={props.activeSlideNav === "tab4" ? "product-detail-nav-list  active" : "product-detail-nav-list "} >
                            <h4>{t("dealer")}</h4>
                        </a>
                    </Link>
                </div>
            </div>

            <div className="bg-light-less-gray min-vh-100">
                <div className="h-108px"></div>
                {props.children}
                
            </div>
        </Layout>
    );
}
export default withTranslation('mobile_translations')(Navabout)