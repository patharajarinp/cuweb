import React, { useState,useEffect } from 'react'
import { withTranslation, Link} from "../../utils/i18n";
import tools from "../../utils/tools";
import api from "../../utils/api";
import classNames from 'classnames';
import MoreDetail from "../../components/order_return_detail/MoreDetail";

const TrackingDetail = ({returns, t}) =>{
	
  
  const [showMore, setshowMore] = useState(false);
  const toggleshowMore = () => { setshowMore(!showMore) };

	console.log(returns);


	return (
		<>
			<div className="text-center bg-step-detail order-return mt-5">
				<ul className="progressbar-detail">
					{
						returns.status > '01' ? (
							<>
								<li className="active">
									<span className={(returns.status >= '10' && returns.status <= '20') && "current"}>{t('Order:return_status10')}</span>
								</li>
								<li className={returns.status >= '30' ? 'active' : ''}>
									<span className={(returns.status >= '30' && returns.status < '40') && "current"}>
										{
											returns.no_send_back == 1 ? (
												t('Order:return_status31')
											) : (
												t('Order:return_status30')
											)
										}
									</span>
								</li>
								<li className={returns.no_send_back == 1 ? (returns.status >= '50' ? 'active' : '') : (returns.status >= '40' ? 'active' : '')}>
									<span className={returns.no_send_back == 1 ? ((returns.status >= '50' && returns.status < '60') ? 'current' : '') : ((returns.status >= '40' && returns.status < '60') ? 'current' : '')}>
										{
											returns.no_send_back == 1 ? (
												t('Order:return_status50')
											) : (
												t('Order:return_status40')
											)
										}
									</span>
								</li>
								<li className={returns.status >= '60' ? 'active' : ''}>
									<span className={returns.status >= '60' && "current"}>{t('Order:return_status60')}</span>
								</li>
							</>
						) : (
							<>
								<li className="active cancel">
									<span>{t('Order:return_status10')}</span>
								</li>
								{
									returns.status == '00' ? (
										<li className="active cancel">
											<span className="current">{t('Order:return_status00')}</span>
										</li>
									) : (
										<li className="active cancel">
											<span className="current">{t('Order:return_status01')}</span>
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
					((returns.status == "00" || returns.status == "01") && returns.cancel_note) ? (
						<div>
							<p>เหตุผล : {returns.cancel_note}</p>
						</div>
					) : ''
				}

				{
					(returns.old_type == 1 && returns.change_type == 1) ? (
						<div>
							<p className="mb-0">
								{t(`change_status14`)} 
								<Link href={`/user/order-change/[id]?id=${returns.id}`} as={`/user/order-change/${returns.id}`}>
									<a className="text-stationery"> {t(`click_here`)} </a>
								</Link>
							</p>
							<p>เหตุผล : {returns.change_type_note}</p>
						</div>
					) : ''
				}

				{
					(returns.status >= "20") && returns.no_send_back == 0 ? (
						<div>
							<p>ส่งของมาที่ : {returns.seller_address ? returns.seller_address.full_address : "ศูนย์หนังสือจุฬาลงกรณ์มหาวิทยาลัย"}</p>
						</div>
					) : ''
				}


				{
					returns.logs.map((val, index)=> (
						<div key={index}>
							<p>
								{tools.formatDate(val.createdAt, false)} :&nbsp;
								{t(`Order:return_status${(val.status == 40 && returns.no_send_back == 1) ? '41' : val.status}`)}
							</p>
						</div>
					))
				}

				<MoreDetail data={returns} />
				
			</div>
			
		</>
	)
}
export default withTranslation(['order_detail'])(TrackingDetail)