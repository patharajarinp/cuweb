import React,{useState} from 'react'
import { Collapse } from 'reactstrap';
import tools from '../../../utils/tools';
export default function Collapsetrack({change,t}) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    return (
        <>
            <div className="order-manage-address" onClick={toggle}>
                <p className="text-black my-auto">ติดตามความคืบหน้า</p>
                <i className={isOpen ? "text-orange my-auto fas fa-chevron-up" : "text-orange my-auto fas fa-chevron-down"}></i>
            </div>
            <Collapse isOpen={isOpen} >
                <div className="pb-3">
                    <div className="info-address-detail w-100 d-flex">
                   <div className="d-flex ml-2">
                       <div className="line-track-orange"></div>
                       <div className="w-100">
                           <div className="list-track">
                               <div className="on-track-orange" ></div>
                               <div >

                                   <p className=" mb-0 text-orange">
                                       
                                    {change.status == '00' && t('mobile_Order:change_status00')}
                                    {change.status == '01' && t('mobile_Order:change_status01')}
                                    {change.status == '02' && t('mobile_Order:change_status02')}
                                    {change.status == '10' && t('mobile_Order:change_status10')}
                                    {change.status == '20' && t('mobile_Order:change_status20')}
                                    {change.status == '30' && t('mobile_Order:change_status30')}
                                    {(change.status == '40' && change.no_send_back == 0) && t('mobile_Order:change_status40')}
                                    {(change.status == '40' && change.no_send_back == 1) && t('mobile_Order:change_status41')}
                                    {change.status == '41' && t('mobile_Order:change_status41')}
                                    {change.status == '42' && t('mobile_Order:change_status42')}
                                    {change.status == '50' && t('mobile_Order:change_status50')}
                                    {change.status == '51' && t('mobile_Order:change_status51')}
                                    {change.status == '60' && t('mobile_Order:change_status60')}
                                    {change.status == '61' && t('mobile_Order:change_status61')}
                                    {change.status == '62' && t('mobile_Order:change_status62')}
                                    {change.status >= '70' && t('mobile_Order:change_status70')}
                                   </p>
                                   <p className="text-content-news mb-1">{tools.formatDate(change.logs[0].createdAt, false)}</p>
                                  

                                </div>
                            </div>
                         </div>
                    </div>
                    </div>
                    
                </div>
            </Collapse>
        </>
    )
}
