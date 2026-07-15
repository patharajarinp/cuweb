// import Link from 'next/link';
import React, { useEffect } from 'react';
import { Router, withTranslation, Link } from '../../utils/i18n';

const NavbarOder = (props) => {
    const {t, status, setOrder, setPageCount, setPagenumber} = props;

    useEffect(()=>{
        document.getElementById("order-"+props.activeSlideNav).focus();
    },[])

    const clickLink = (status) => {
        setPageCount(1);
        setPagenumber(0);
        setOrder();
        if(status) {
          // Router.push('/user/order?status=' + status);
          if(status == 2) status = [2,3]
          Router.push({pathname:'/user/order',query:{status}})
        }else{
          Router.push('/user/order');
        }
        
      }
      //console.log('count',count)
      const _status = Array.isArray(status) ? 2 : status

    return (
        <>
            <div className="order-nav">
                <div className=" text-center order-nav-title">
                    <h4>{t("order_list")}</h4>
                </div>
               <Link href="/user/dashboard">
                    <a className="btn-back order-nav-back"  >{/* onClick={() => Router.back()} */}
                        <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
                    </a>
                </Link>
            </div>
            <div className="product-detail-nav order">
                <div className="product-detail-nav-area ">
                 
                    <a  id="order-tab1" onClick={()=> clickLink(null)} className={_status == null ? "product-detail-nav-list  active" : "product-detail-nav-list "}  >
                        <h4>{t("all")}</h4>
                    </a>
            
            
                    <a  id="order-tab2" onClick={()=> clickLink('1')} className={_status == '1' ? "product-detail-nav-list active" : "product-detail-nav-list "}>
                        <h4>{t("waiting_payment")}</h4>
                    </a>
               
            
                    <a  id="order-tab3" onClick={()=> clickLink('2')} className={_status == '2' ? "product-detail-nav-list  active" : "product-detail-nav-list "} >
                        <h4>{t("to_ship")}</h4>
                    </a>
              

                    <a id="order-tab4" onClick={()=> clickLink('4')} className={_status == '4' ? "product-detail-nav-list  active" : "product-detail-nav-list "} >
                        <h4>{t("to_receive")}</h4>
                    </a>


                    <a id="order-tab5" onClick={()=> clickLink('5')} className={_status == '5'? "product-detail-nav-list  active" : "product-detail-nav-list"} >
                        <h4>{t("successful_delivery")}</h4>
                    </a>

                </div>
            </div>

            <div className="bg-light-less-gray pt-3 min-vh-100">
                <div className="h-108px"></div>
                {props.children}
                <div className="footer-space"></div>
            </div>
        </>
    );
}
export default withTranslation('mobile_Order')(NavbarOder)