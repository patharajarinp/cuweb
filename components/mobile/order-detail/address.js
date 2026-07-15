import React, { useState } from 'react';
import { Collapse } from 'reactstrap';
import { withTranslation } from '../../../utils/i18n';
const OderAddress = ({ address, type ,t}) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    return (
        <>
            <div className="order-manage-address" onClick={toggle}>
                <p className="text-black my-auto">{(type == "address") ? `${t("mobile_order_detail:shipment_address")}` : `${t("mobile_address:billingaddress")}`}</p>
                <i className={isOpen ? "text-pink my-auto fas fa-chevron-up" : "text-pink my-auto fas fa-chevron-down"}></i>
            </div>
            <Collapse isOpen={isOpen} >
                <div className="py-3">
                    <div className="info-address-detail w-100">
                        <div className="d-flex justify-content-between align-items-center">
                            {
                                address.at == "home" ?
                                    <div className="btn-address-home-add-list mr-2">
                                        <p className="p-14">{t("mobile_address:home")}</p>
                                    </div> :
                                    <div className="btn-address-work-add-list mr-2">
                                        <p className="p-14">{t("mobile_address:office")}</p>
                                    </div>
                            }
                        </div>
                        <p className="text-black mb-0 mt-1">{address.firstname} {address.lastname}</p>

                        <p className="p-12 text-black two-line mb-0">{address.full_address}
                        </p>
                        <p className="p-12 text-black mb-1">{address.phone}</p>
                    </div>
                    
                </div>
            </Collapse>
        </>
    )
}
export default withTranslation('mobile_order_detail')(OderAddress);