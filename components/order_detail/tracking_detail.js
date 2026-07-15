import React, { useState,useEffect } from 'react'
import { withTranslation, Link} from "../../utils/i18n";
import tools from "../../utils/tools";
import api from "../../utils/api";
import classNames from 'classnames';
import ConfirmDialog2 from '../ConfirmDialog'

const TrackingDetail = ({index,length,package : pkg, fetchDetail, slips,t, order}) =>{
	const [modalShow2, setModalShow2] = useState(false);
  const handleModalClose2 = () => setModalShow2(false);
  
  const [showMore, setshowMore] = useState(false);
  const toggleshowMore = () => { setshowMore(!showMore) };
	const setDate = (date, days) => {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	const updatePackage = (pkg_id) => {
    event.preventDefault();
    api.confirmPackage({pkg_id})
    .then(res=>{
			const data = res.data;
			fetchDetail();
    })
    .catch(err => {
      console.log(err);
      console.log(err.response);
    })
	}
	
	const onConfirm2 = () => {
    var val = pkg && pkg.pkg_id;
    updatePackage(val);
  }

	// console.log('order', order);
	// console.log('pkg', pkg);
	return (
		<div className="package mb-3">
            <div className="border-bottom"></div>
            <div className="p-3">
            	<div className="d-flex justify-content-between align-items-center header-detail">
								<p>{t('package')} {index} {t('from')} {length}</p>
								{
									pkg.shop_name ? (
									<p>{t('vender')} : {pkg.shop_name}</p>
									) : (
										<p>{t('vender')} : CHULABOOK</p>
									)
								}
								
              </div>
							{
								pkg.status > 3 ?
								<div className="pt-3 d-flex justify-content-between align-items-center header-detail">
									<p className="mb-0">
										<img src="/icon/car.svg" className="pr-3" /> {pkg.company == "THAI_POST" || pkg.company == "HAPPY" ? t('shipping_normal') : t('shipping_express')} 
										{t("date_range")} {tools.formatDate(pkg.pickup_date,true,false,true,false)} - {tools.formatDate(setDate(pkg.pickup_date,  pkg.shipping_type == 2 ? 3 : 7),true,false,true)}
									</p>
									{
										(pkg.status == 4) && (
											<a onClick={() => setModalShow2(true)}><button type="button" className="btn btn-primary ml-3">{t('confirm_product')}</button></a>
										)
									}

									{
										(pkg.status == 5 && !pkg.isOnlyEbook) && (
										<Link href={`/user/order_return_report/[pkg_id]?pkg_id=${pkg.pkg_id}`} as={`/user/order_return_report/${pkg.pkg_id}`}>
                      <a><button type="button" className="btn btn-outline-primary">{t('btn_retrun')}</button></a>
                    </Link>
										)
									}
								</div> : ''
	            }
							<div className="text-center bg-step-detail mt-5">
								<ul className="progressbar-detail">
									<li className="active"><span className={(pkg.status == 1 && slips.length) && "current"}>{t('pending')}</span></li>
									<li className={classNames("",{"active":pkg.status > 1})}><span className={(((index == 1 && pkg.status > 1 && pkg.status <= 3) || (index == 2 && pkg.status == 3)) && order.payment_type != 4) && "current"}>{t('shipping')}</span></li>
									<li className={pkg.status >= 4 ? 'active' : ''}><span className={pkg.status == 4 && "current"}>{t('transport')}</span></li>
									<li className={pkg.status >= 5 ? 'active' : ''}><span className={pkg.status >= 5 && "current"}>{t('success')}</span></li>
								</ul>
							</div>
				{
					((slips &&slips.length > 0) || (order && (order.payment_type == 1 || order.payment_type == 3) && (index == 1 && pkg.status > 1) || (index == 2 && pkg.status >= 3)) || pkg.status >= 3) &&
					<div className={classNames("mt-5 mb-4 track-area",{"active" : showMore === true })}>
						<div className="track-btn-bar text-pink font-weight-bold"> 
							<div className="track-btn" onClick={toggleshowMore}>
								{showMore === true ? t('translations:view_less'):t('translations:view_more')}
							</div>
						</div>
					{
						!!(pkg.status > 2 && (pkg.trackings.length > 0)) && 
						<p><b>{t("tracking")} 
							&nbsp;{t(pkg.company)} : {pkg.tracking_id}</b>
						</p>
					}
					{
						!!(pkg.status >= 5 && pkg.isOnlyEbook) && 
						<p>{tools.formatDate(pkg.paid_time, false)} : {t('ebook_success')}</p>
					}
					{
						pkg.trackings.sort((a,b)=>new Date(b.date) - new Date(a.date)).map((tracking, index) =>
							<>
								<p key={Math.random()}>{tools.formatDate(tracking.date, false)} :&nbsp; 
									{ 
										 !tracking.description ? 
										 	(
												<>
												{
													pkg.company != 'CHULABOOK' ? (
														<a href={`${t(pkg.company + "_link")}${(pkg.company == 'HAPPY' ? pkg.tracking_id : '')}`} target="_blank" > {t('tracking_click')}</a> 
													) : (
														<span className="p-medium">{t('tracking_chualabook_info')}</span>
													)
												}
												
												</>
											)
										: tracking.description
									}
								</p>
							</>
						)
					}
					{
						(pkg.status > 2 && !pkg.isOnlyEbook) && 
						<p>{tools.formatDate(pkg.pickup_date, false)} : {t('pickup_success')}</p>
					}
					{
						(index == 1 && pkg.status >= 2 && (order.payment_type == 1 || order.payment_type == 3)) &&
						<p>{tools.formatDate(pkg.paid_time, false)} : {t('payment_success')}</p>
					}
					{
						index == 1 && slips && slips.map((slip) =>
							<>
								{
									slip.status == 2 && <p>{tools.formatDate(slip.updatedAt, false)} : {t('slip_success')}</p>
								}
								{
									slip.status == 0 && <p>{tools.formatDate(slip.updatedAt, false)} : {t('slip_error')}</p>
								}
								<p key={Math.random()}>{tools.formatDate(slip.createdAt, false)} : {t('silp_pending')}</p>
							</>
						)
					}
	        </div>
	      }

	            <div className="mt-5 mb-4 mx-5">
	              {
	                pkg ? pkg.package_details.map((val, index) => (
	                  <div key={Math.random()} className="mt-4 d-flex justify-content-between align-items-center">
	                    <div className="img-detail">
	                      {
	                        (val.product.video_type == 0 || val.product.video_type == null) && (
	                          <img src={val.product.picture ? val.product.picture : '/images/book.png'} className="mh-100" />
	                        )
	                      }
	                      {
	                        (val.product.video_type == 1 || val.product.video_type == 2) && (
	                          <img src={'/images/video.svg'} className="mh-100 video" />
	                        )
	                      }
	                    </div>
	                    <div className="pl-3 text-book-detail">
	                      <p className="mb-0 p-medium">{val.product.name}</p>
	                      <p className="mb-0">{val.product.author}</p>
												<div className="d-flex align-items-center">
													<div className={classNames("tag-cat ",{"tag-book":(val.product.item_code == 10000|| val.product.item_code == 20000) ,"tag-stationary":(val.product.item_code == 30000),"tag-ebook": (val.product.item_code == null)})}>{(val.product.item_code == 10000 || val.product.item_code == 20000 ) ? t('header:book_menu')  :  val.product.item_code == 30000 ? t('header:stationary') : val.product.item_code == null && t('header:e_book') }</div>
													{!!val.product.is_preorder && <div className={classNames("tag-cat px-3")} style={{backgroundColor : '#DE5C6E'}}>Preorder</div> } 
												</div>
	                    </div>
	                    <div className="pl-3 text-price-detail">
	                      <p className="mb-0 text-pink font-weight-bold">฿ {tools.currencyFormatDE(val.product.cover_price)}</p>
	                    </div>
	                    <div className="pl-3">
	                      <p className="mb-0">{t('quantity')} :  <font>{val.quantity}</font></p>
	                    </div>
	                  </div>
	                )) : ''
	              }

								<ConfirmDialog2 show={modalShow2}
								text="ฉันได้ตรวจสอบและยอมรับสินค้า ?"
								onConfirm={onConfirm2}
								size="md" onHide={handleModalClose2}
								cancel_btn={true} />
	            </div>
	        </div>
        </div>
	)
}
export default withTranslation(['order_detail'])(TrackingDetail)