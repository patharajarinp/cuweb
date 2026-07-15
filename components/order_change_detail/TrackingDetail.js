import React, { useState,useEffect } from 'react'
import { withTranslation, Link} from "../../utils/i18n";
import tools from "../../utils/tools";
import api from "../../utils/api";
import classNames from 'classnames';
import MoreDetail from "../../components/order_change_detail/MoreDetail";
const TrackingDetail = ({changes, t}) =>{
	
  
  const [showMore, setshowMore] = useState(false);
  const toggleshowMore = () => { setshowMore(!showMore) };

	console.log(changes);


	return (
		<>
			<div className="text-center bg-step-detail order-return mt-5">
				<ul className="progressbar-detail">
					{
						changes.status > '01' ? (
							<>
								<li className="active">
									<span className={changes.status == '10' && "current"}>{t('Order:change_status10')}</span>
								</li>
								<li className={changes.status >= '30' ? 'active' : ''}>
									<span className={(changes.status >= '30' && changes.status < '41') && "current"}>
										{
											changes.no_send_back == 1 ? (
												t('Order:change_status31')
											) : (
												t('Order:change_status30')
											)
										}
									</span>
								</li>
								<li className={changes.no_send_back == 1 ? ((changes.status >= '50') ? 'active' : '') : ((changes.status >= '51') ? 'active' : '')}>
									<span className={changes.no_send_back == 1 ? ((changes.status >= '50' && changes.status < '60') ? 'current' : '') : (((changes.status >= '51' && changes.status < '60') && !(changes.dispute2 == 1 || changes.dispute3 == 1 || changes.dispute4 == 1)) ? 'current' : '')}>
										{
											changes.no_send_back == 1 ? (
												t('Order:change_status51')
											) : (
												t('Order:change_status51')
											)
										}
									</span>
								</li>
								<li className={changes.status >= '70' ? 'active' : ''}>
									<span className={changes.status >= '70' && "current"}>{t('Order:change_status70')}</span>
								</li>
							</>
						) : (
							<>
								<li className="active cancel">
									<span>{t('Order:change_status10')}</span>
								</li>
								{
									changes.status == '00' ? (
										<li className="active cancel">
											<span className="current">{t('Order:change_status00')}</span>
										</li>
									) : (
										<li className="active cancel">
											<span className="current">{t('Order:change_status01')}</span>
										</li>
									)
								}
								
							</>
						)
					}
					
				</ul>
			</div>
		
			<div className={classNames("mt-5 mb-4 bg-step-detail order-return track-area",{"active" : showMore === true })}>
				<div className="track-btn-bar text-pink font-weight-bold"> 
					<div className="track-btn" onClick={toggleshowMore}>
						{showMore === true ? t('translations:view_less'):t('translations:view_more')}
					</div>
				</div>
				{
					((changes.status == "00" || changes.status == "01") && changes.cancel_note) ? (
						<div>
							<p>เหตุผล : {changes.cancel_note}</p>
						</div>
					) : ''
				}
				{
					((changes.status >= "51") && !(changes.dispute2 == 1 || changes.dispute3 == 1)) ? (
						<div>
							<p>
								<b>{t("tracking")} {changes.shipping_company2} : {changes.tracking_number2}</b>
							</p>
						</div>
					) : ''
				}

				{
					(changes.old_type == 2 && changes.change_type == 1) ? (
						<div>
							<p className="mb-0">
								{t(`change_status13`)} 
								<Link href={`/user/order-return/[id]?id=${changes.id}`} as={`/user/order-return/${changes.id}`}>
									<a className="text-stationery"> {t(`click_here`)} </a>
								</Link>
							</p>
							<p>เหตุผล : {changes.change_type_note}</p>
						</div>
					) : ''
				}

				{
					(changes.status >= "20" && changes.no_send_back == 0) ? (
						<div>
							<p>ส่งของมาที่ : {changes.seller_address ? changes.seller_address.full_address : "ศูนย์หนังสือจุฬาลงกรณ์มหาวิทยาลัย"}</p>
						</div>
					) : ''
				}

				{
					changes.logs.map((val, index)=> (
						<div key={index}>
							<p>
								{tools.formatDate(val.createdAt, false)} :&nbsp;
								{t(`Order:change_status${(val.status == 40 && changes.no_send_back == 1) ? '41' : val.status}`)}
							</p>
						</div>
					))
				}

				<MoreDetail data={changes} />
				
			</div>
			
		</>
	)
}
export default withTranslation(['order_detail'])(TrackingDetail)