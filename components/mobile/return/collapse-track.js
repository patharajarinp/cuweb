import React,{useState} from 'react'
import { Collapse } from 'reactstrap';
import tools from '../../../utils/tools';
export default function Collapsetrack({returns,t}) {
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
                                       
                                    {returns.status == '00' && t('mobile_Order:return_status00')}
                                    {returns.status == '01' && t('mobile_Order:return_status01')}
                                    {returns.status == '02' && t('mobile_Order:return_status02')}
                                    {returns.status == '10' && t('mobile_Order:return_status10')}
                                    {returns.status == '20' && t('mobile_Order:return_status20')}
                                    {returns.status == '30' && t('mobile_Order:return_status30')}
                                    {(returns.status == '40' && returns.no_send_back == 0) && t('mobile_Order:return_status40')}
                                    {(returns.status == '40' && returns.no_send_back == 1) && t('mobile_Order:return_status41')}
                                    {returns.status == '42' && t('mobile_Order:return_status42')}
                                    {returns.status == '61' && t('mobile_Order:return_status61')}
                                    {returns.status == '50' && t('mobile_Order:return_status50')}
                                    {returns.status == '60' && t('mobile_Order:return_status60')}
                                    {returns.status >= '70' && t('mobile_Order:return_status70')}
                                   </p>
                                   <p className="text-content-news mb-1">{tools.formatDate(returns.logs[0].createdAt, false)}</p>
                                  

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
