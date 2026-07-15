// import Link from 'next/link';
import React, { useEffect } from 'react';
import { CustomInput } from 'reactstrap';
import { withTranslation, Link } from '../../../utils/i18n';

const Add_address = ({user,show2,toggle2,selectedTax,setSelectedTax,t}) => {
    useEffect(() => {
        if(!user) {
          return false;
        }
        var selectIndex;
        selectIndex = user.addresses.findIndex((item)=> item.tax == 1)
        setSelectedTax(selectIndex);
       
      }, []);
    return (user && show2) ?  (
        <div style={{width:"100vw",height:"100vh",position:"fixed",top:0,left:0,zIndex:"400",backgroundColor:"#fff"}}>
            <div className="cart-nav">
                <div className=" text-center cart-nav-title">
                    <h3 className="text-black mb-0">{t("mobile_address:billingaddress")}</h3>
                </div>
                <a className="btn-back cart-nav-back" onClick={toggle2}>
                    <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
                </a> 
            </div>
            <div className="bg-light-less-gray ">
                <div className="padding-bottom-for-box-cart"></div>
                <div className="container bg-white address-scroll">
                    {
                        user.addresses.map((val,index)=>
                        (val.at == 'tax') ?
                            <div className="address-for-shipping-list" key={index}>
                                <CustomInput type="radio" name="customRadio" id={`data`+val.id} className="my-auto" onClick={()=>setSelectedTax(index)} defaultChecked={selectedTax==index}/>
                                <div className="ml-2">
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex justify-content-start">
                                            {
                                                val.at == 'tax' ? 
                                                <div className="btn-address-tax-add-list mr-2">
                                                    <p className="p-14">{t("mobile_address:tax")}</p>
                                                </div> :''
                                            }
                                            <div className={ val.tax ? "btn-pink-default-show":"btn-pink-default"}>
                                                <p className="p-14">{t("mobile_translations:default")}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-black mb-0 mt-1">{val.firstname} {val.lastname}</p>
                                        <p className="p-12 text-black two-line mb-1">{val.full_address}</p>
                                    </div>
                                </div>
                            </div>:''
                        )
                    }
                </div>
            </div>
            <Link href={`/user/add-address?isAddress=${0}`}>
            <a className="btn-pink-submit btn-bottom-layout">
                <h4 className="text-white m-auto">{t("mobile_address:add_new_address")}</h4>
            </a>
            </Link>
        </div>

    ) : <></>
}

export default withTranslation('address')(Add_address);