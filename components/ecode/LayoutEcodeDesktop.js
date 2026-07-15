import React, { useContext, useEffect, useState } from 'react';
import CartEcode from '../../pages/ecode/cartecode'
import api from '../../utils/api';
import { Link, withTranslation } from "../../utils/i18n";
import UserContext from '../../contexts/UserContext';
import AuthService from '../../utils/AuthService';
import Slick from "react-slick";
import useMediaQuery from '../../hooks/useMediaQuery';
import { useRouter } from 'next/router';
import tools from "../../utils/tools";

const LayoutEcodeDesktop = (props) => {
	const { isBanner = false, isPreview = false, title, t, children, linkPath,
		active, show, isFooter, loading: page_load, cateData } = props;
	const { user, onSocket, setUser, local, setLocal } = useContext(UserContext)
	const [loading, setLoading] = useState(true);
	const [prevScrollpos, setPrevScrollpos] = useState(0);
	let linkPathQuery = useRouter().query.name
	let link = linkPath;
	if (!linkPath) {
		link = linkPathQuery;
	}


	const IsMember = () => {
		return user && user.member && user.member.STATUS == "Y";
	}
	const logout = () => {
		AuthService.logout();
		// setUser(null);
		// Router.push('/');
		window.location.href = '/';
	}

	useEffect(() => {
		setPrevScrollpos(window.pageYOffset);
		setLoading(false);

		var path = window.location.pathname;

		if (!path) return;
		if (path === '/th' || path === '/en') {
			path = '/';
		}
		if (path) {
			path = path.replace(/\/th|\/en/g, '');
		}
		const regex = /user/;
		const regex_product = /product-details/;

		if (regex_product.test(path)) {
			const path1 = '/product-details/' + path.split('/product-details/')[1].split('-')[0];
			path = path1;
		}
		if (regex.test(path)) return;
		// console.log('path', path);
		api
			.sendPageStat(path)
			.then(() => { })
			.catch((err) => {
				console.log(err.response);
			});
	}, []);

	const isMobile = useMediaQuery(992);

	useEffect(() => {
		const handlePrint = () => {
			const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
			linkTags.forEach((linkTag) => {
				linkTag.setAttribute('media', 'print');
			});
		};

		window.addEventListener('beforeprint', handlePrint);

		return () => {
			window.removeEventListener('beforeprint', handlePrint);
		};
	}, []);

	return (

		<>
			<div style={{ backgroundColor: '#f2f2f2' }}>
				<nav className="navbar nav-box-shadow navbar-expand-lg navbar-light bg-white">
					<div className="row mx-0 w-100 px-0">
						<div className="col-3 pl-0 text-center">


							<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/logo.svg`} height="40" />

						</div>
						<div className="col-6 d-flex align-items-center">

						</div>
						<div className="col-3 d-flex align-items-center   align-self-end text-center">


							<div className="text-right">

								{
									user ? (
										<div className="input-group-append">
											<div className="btn-group profile ">
												<a className="text-default d-flex pl-3 pr-2" data-toggle="dropdown">
													<img alt="ศูนย์หนังสือจุฬาฯ" src={user && user.member ? (user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ? `${api.frontend_url}/icon/VIP_USER.svg` : `${api.frontend_url}/icon/user.svg`) : `${api.frontend_url}/icon/user.svg`} className="pr-1 w-auto icon-header" /><span className=" align-self-center ellipsis font-h5">{user.firstname}</span>
													<img alt="ศูนย์หนังสือจุฬาฯ" className="ml-2 w-10px" src={`${api.frontend_url}/images/arrow-down.svg`} />
												</a>
												<div className="dropdown-menu right profile pt-0">
													{
														IsMember() ? <p style={{ backgroundColor: '#F8F9FA' }} className="px-3 py-2 mb-0"><b>POINT</b> <span className="float-right cart-price">{tools.currencyFormatDE(user.member.POINT, 0)}</span></p> : ''
													}
													<div className="pt-1"></div>

													<Link href={'/ecode/order'}>
														<a className="text-default d-block pl-3">
															<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-bag.svg`} /> {t('my_order')}
														</a>
													</Link>
													<a className="text-default d-block pl-3" onClick={logout}>
														<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-logout.svg`} /> {t('log_out')}
													</a>
												</div>
											</div>
										</div>
									) : (
										<Link href={{
											pathname: '/ecode/login_ecode',
											query: { name: link }
										}}>
											<a className="text-default pl-3 pr-2 d-flex"><img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/user.svg`} className="w-auto icon-header" /><span className="align-self-center ellipsis font-h5">{t('login')}</span></a>
										</Link>
									)
								}

							</div>
							|
							<div className="text-right ">
								<div className="position-relative float-right">
									<CartEcode user={user} />
								</div>
							</div>
						</div>
					</div>
				</nav>
				<div style={{ height: '46px' }}>

				</div>








			</div>


			{/* {
        !isMobile ? (
          <MainNews t={t} news={news} activities={activities} procurement={procurement} />
        ) : (
          <MobileMainNews t={t} news={news} activities={activities} procurement={procurement} />
        )
      } */}
		</>
	)
}




export default withTranslation('header')(LayoutEcodeDesktop);