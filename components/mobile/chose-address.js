import Link from 'next/link';
import React from 'react';
import { CustomInput } from 'reactstrap';
import { withTranslation } from '../../utils/i18n';
const Add_address = ({ user, show, toggle, selected, setSelectedAddress, t, addresschoose }) => {
    return (user && show) ? (
        <div style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: "400", backgroundColor: "#fff" }}>
            <div className="cart-nav">
                <div className=" text-center cart-nav-title">
                    <h3 className="text-black mb-0">{t("shipping_address")}</h3>
                </div>
                <a className="btn-back cart-nav-back" onClick={toggle}>
                    <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
                </a>
            </div>
            <div className="bg-light-less-gray ">
                <div className="padding-bottom-for-box-cart"></div>
                <div className="container bg-white address-scroll">
                    {
                        user.addresses.map((address, index) =>
                            (addresschoose == 'delivery' && (address.at == 'home' || address.at == 'work')) ?
                                <div className="address-for-shipping-list" key={index}>
                                    <CustomInput type="radio" name="customRadio" id={`data` + address.id} className="my-auto" onClick={() => setSelectedAddress(index)} defaultChecked={selected == index} />
                                    <div className="ml-2">
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex justify-content-start">
                                                {
                                                    address.at == 'home' ?
                                                        <div className="btn-address-home-add-list mr-2">
                                                            <p className="p-14">{t("home")}</p>
                                                        </div> :
                                                        <div className="btn-address-work-add-list mr-2">
                                                            <p className="p-14">{t("office")}</p>
                                                        </div>
                                                }
                                                <div className={address.default ? "btn-pink-default-show" : "btn-pink-default"}>
                                                    <p className="p-14">{t("translations:default")}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-black mb-0 mt-1">{address.firstname} {address.lastname}</p>
                                            <p className="p-12 text-black two-line mb-1">{address.full_address}</p>
                                            <p className="p-12 text-black mb-1">{address.phone}</p>
                                            {/*<p className="p-12">{t("shipping_address")}, {t("billingaddress")} {t("as_specified")}</p>*/}
                                        </div>
                                    </div>
                                </div> : (addresschoose == 'tax' && (address.at == 'tax')) ? <div className="address-for-shipping-list" key={index}>
                                    <CustomInput type="radio" name="customRadio" id={`data` + address.id} className="my-auto" onClick={() => setSelectedAddress(index)} defaultChecked={selected == index} />
                                    <div className="ml-2">
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex justify-content-start">
                                                {
                                                    address.at == 'tax' ?
                                                        <div className="btn-address-tax-add-list mr-2">
                                                            <p className="p-14">{t("tax")}</p>
                                                        </div> : ''
                                                }
                                                <div className={address.default ? "btn-pink-default-show" : "btn-pink-default"}>
                                                    <p className="p-14">{t("translations:default")}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-black mb-0 mt-1">{address.firstname} {address.lastname}</p>
                                            <p className="p-12 text-black two-line mb-1">{address.full_address}</p>
                                            <p className="p-12 text-black mb-1">{address.phone}</p>
                                        </div>
                                    </div>
                                </div> : ''
                        )
                    }
                </div>
            </div>
            <Link href="/user/add-address">
                <a className="btn-pink-submit btn-bottom-layout">
                    <h4 className="text-white m-auto">{t("add_new_address")}</h4>
                </a>
            </Link>
        </div>

    ) : <></>
}

export default withTranslation('mobile_address')(Add_address);