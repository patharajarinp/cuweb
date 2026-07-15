import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import api from '../../utils/api';
import { Link, withTranslation } from '../../utils/i18n';

const NavContactus = (props) => {

	const [pagesContact, setPagesContact] = useState();
	const {t} = props;
	const key = 'contact';
	const fechContact = () => {
		api.getCustompage(key)
		.then(res=>{
			const data = res.data;
			setPagesContact(data);
		})
		.catch(err => {
			console.log(err.response);
		})
	}

	useEffect(() => {
		fechContact();
	}, []);

	return (
		<Layout className="mb-5">
			<div className="order-nav">
				<div className=" text-center order-nav-title">
					<h4>{t("mobile_translations:contact_us")}</h4>
				</div>
				<Link href='/'>
					<a className="btn-back order-nav-back">
						<img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
					</a>
				</Link>
			</div>
				<div className="product-detail-nav order">
					<div className="product-detail-nav-area ">
						<Link href="/contact">
							<a href="" className={props.activeSlideNav === "tab1" ? "product-detail-nav-list  active" : "product-detail-nav-list "}  >
								<h4>{t("mobile_translations:contact_us")}</h4>
							</a>
						</Link>
						{/* {
								pagesContact ? pagesContact.map((val, index) => (
								<Link href={`/contact/[key]`} as={`/contact/${val.path}`}>
										<a href="" className={props.activeSlideNav === `'tab'${index+2}` ? "product-detail-nav-list active" : "product-detail-nav-list"}>
												<h4>{val.title_th}</h4>
										</a>
								</Link>
								)) : ''
						} */}
						<Link href={`/contact/[subkey]?subkey=contact_dealer`} as={`/contact/contact_dealer`}>
							<a href="" className={props.activeSlideNav === "tab2" ? "product-detail-nav-list active" : "product-detail-nav-list "}>
								<h4>{t("contact_dealer")}</h4>
							</a>
						</Link>
						<Link href={`/contact/[subkey]?subkey=contact_dealer_ebook`} as={`/contact/contact_dealer_ebook`}>
							<a href="" className={props.activeSlideNav === "tab4" ? "product-detail-nav-list active" : "product-detail-nav-list "}>
								<h4>ติดต่อตัวแทนจำหน่าย E-Book</h4>
							</a>
						</Link>
						<Link href={`/contact/[subkey]?subkey=job_register`} as={`/contact/job_register`}>
							<a href="" className={props.activeSlideNav === "tab3" ? "product-detail-nav-list  active" : "product-detail-nav-list "} >
								<h4>{t("job_register")}</h4>
							</a>
						</Link>
					</div>
				</div>

				<div className="bg-white pt-3 min-vh-100">
					<div className="h-108px"></div>
					{props.children}
					<div className="footer-space"></div>
				</div>
		</Layout>
	);
}
export default withTranslation('mobile_contact')(NavContactus)