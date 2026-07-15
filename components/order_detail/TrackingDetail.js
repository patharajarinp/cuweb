import React, { useState,useEffect } from 'react'
import { withTranslation, Link} from "../../utils/i18n";
import tools from "../../utils/tools";
import api from "../../utils/api";
import classNames from 'classnames';
import PackageHeader from './PackageHeader'
import ProductList from './ProductList'

const TrackingDetail = ({index,pkg, fetchDetail, slips,t, order}) =>{
	
  
  const [showMore, setshowMore] = useState(false);
  const toggleshowMore = () => { setshowMore(!showMore) };

	var trackings = [];

	if(pkg.trackings){
		var had = false;
		pkg.trackings.forEach(val => {
			if(val.code == 0 ){
				if(!had){
					trackings.push(val);
					had = true;
				}
				// console.log('asdad')
				
			}
			else{
				// console.log('asdad2')
				trackings.push(val);
			}
		})
	}

	const checkData = () => {

	}
	console.log('asdad2', pkg);
	return (
		<>
			{
				pkg.status > 0 ? (
					<div className="text-center bg-step-detail mt-5">
						<ul className="progressbar-detail">
							<li className="active"><span className={(pkg.status == 1 && (slips.length > 0 && index == 1)) && "current"}>{t('pending')}</span></li>
							<li className={classNames("",{"active":pkg.status > 1})}><span className={(((index == 1 && pkg.status > 1 && pkg.status == 3) || (index == 2 && pkg.status == 3)) && order.payment_type != 4) && "current"}>{t('shipping')}</span></li>
							<li className={pkg.status >= 4 ? 'active' : ''}><span className={pkg.status == 4 && "current"}>{t('transport')}</span></li>
							<li className={pkg.status >= 5 ? 'active' : ''}><span className={pkg.status >= 5 && "current"}>{t('success')}</span></li>
						</ul>
					</div>
				) : (
					<div className="text-center bg-step-detail mt-5">
						<ul className="progressbar-detail">
							<li className={pkg.status == 0 ? 'active w-50' : ''}><span>{t('pending')}</span></li>
							<li className={pkg.status == 0 ? 'active w-50' : ''}><span>{t('link_cancel')}</span></li>
						</ul>
					</div>
				)
			}
			
			{
				(((slips &&slips.length > 0) && index == 1 ) || (order && (order.payment_type == 1 || order.payment_type == 3) && (index == 1 && pkg.status > 1) || (index == 2 && pkg.status >= 3)) || pkg.status >= 3) &&
				<div className={classNames("mt-5 mb-4 track-area",{"active" : showMore === true })}>
					<div className="track-btn-bar text-pink font-weight-bold"> 
						<div className="track-btn" onClick={toggleshowMore}>
							{showMore === true ? t('translations:view_less'):t('translations:view_more')}
						</div>
					</div>
					{
						!!(pkg.status > 2 && (trackings.length > 0)) && 
						<p><b>{t("tracking")} 
							&nbsp;{pkg.shipping_company ? pkg.shipping_company.company_name : ''} : {pkg.tracking_id}</b>
						</p>
					}
					{
						!!(pkg.status >= 5 && pkg.isOnlyEbook) && 
						<p>{pkg.paid_time ? tools.formatDate(pkg.paid_time, false) :  tools.formatDate(pkg.createdAt, false)} : {t('ebook_success')}</p>
					}
					{
						trackings.sort((a,b)=>new Date(b.date) - new Date(a.date)).map((tracking, index) =>
							<p key={index}>{tools.formatDate(tracking.date, false)} :&nbsp; 
								{ 
									!tracking.description ? 
									(
										<>
										{
											pkg.company != 'CHULABOOK' ? (
												<a href={pkg.shipping_company ? pkg.shipping_company.company_track_link : ''} target="_blank" > {t('tracking_click')}</a> 
											) : (
												<span className="p-medium">{t('tracking_chualabook_info')}</span>
											)
										}
										
										</>
									)
									: tracking.description
								}
							</p>
						)
					}
					{
						(pkg.status > 2 && !pkg.isOnlyEbook) && 
						<p>{tools.formatDate(pkg.pickup_date, false)} : {t('pickup_success')}</p>
					}
					{
						(index == 1 && pkg.status >= 2 && (order.payment_type == 1 || order.payment_type == 3) && pkg.paid_time) && (
							<>
								<p>{tools.formatDate(pkg.paid_time, false)} : {t('payment_success')}</p>
							</>
						)
					}
					{
						index == 1 && slips && slips.map((slip, index) =>
							<div key={index}>
								{
									slip.status == 2 && <p>{tools.formatDate(slip.updatedAt, false)} : {t('slip_success')}</p>
								}
								{
									slip.status == 0 && <p>{tools.formatDate(slip.updatedAt, false)} : {t('slip_error')}</p>
								}
								<p>{tools.formatDate(slip.createdAt, false)} : {t('silp_pending')}</p>
							</div>
						)
					}
				</div>
			}
		</>
	)
}
export default withTranslation(['order_detail'])(TrackingDetail)