// import Router from 'next/router'
import classNames from 'classnames';
import { memo, useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import LoginLayout from '../../components/layout/login_layout';
import UserContext from '../../contexts/UserContext';
import api from '../../utils/api';
import AuthService from '../../utils/AuthService';
import { i18n, Link, withTranslation } from "../../utils/i18n";
import tools from '../../utils/tools';
import Cart from '../widget/cart';
import CategoryMenu from '../widget/CategoryMenu';
import CategorySeoMenu from '../widget/CategorySeoMenu'
import NotiItem from '../widget/NotiItem';
import Search from './search';

const links = api.mode == "production" ?
	[
		{ href: '/main-book', label: 'book_menu' },
		{ href: '/main-ebook', label: 'e_book' },
		{ href: '/main-course-online', label: 'course_online' },
		{ href: '/main-stationeries', label: 'stationery' },
		{ href: '/marketplace', label: 'marketplace' },
		{ href: '/blog', label: 'blog' },
		{ href: '/promotion', label: 'promotion' },
		{ href: '/news', label: 'news_and_activities' },
		{ href: '/book-article', label: 'book_article' },
		

	]
	: [
		{ href: '/main-book', label: 'book_menu' },
		{ href: '/main-ebook', label: 'e_book' },
		{ href: '/main-course-online', label: 'course_online' },
		{ href: '/main-stationeries', label: 'stationery' },
		{ href: '/marketplace', label: 'marketplace' },
		{ href: '/blog', label: 'blog' },
		{ href: '/promotion', label: 'promotion' },
		{ href: '/news', label: 'news_and_activities' },
		{ href: '/book-article', label: 'book_article' },

	].map(link => {
		link.key = `nav-link-${link.href}-${link.label}`
		return link
	})
// console.log('links', links,api.mode)

const help_links = [
	{ href: '/blog/writer/register', label: 'writer', isLogin: true, out_link: false },
	{ href: '/', label: 'want_to_sell', isLogin: false, out_link: true },
	{ href: '/premium-member', label: 'premium_members', isLogin: true, out_link: false },
	{ href: '/user/order?status=1', label: 'money_transfer_otification', isLogin: true, out_link: false },
	{ href: '/about/[subkey]?subkey=history', as: '/about/history', label: 'about_us', isLogin: false, out_link: false },
	{ href: '/help/[subkey]?subkey=faq', as: '/help/faq', label: 'help', isLogin: false, out_link: false },
	// { href: '#', label: 'เกี่ยวกับเรา' },
	// { href: '#', label: 'เปลี่ยนภาษา' },
].map(link => {
	link.key = `nav-link-${link.href}-${link.label}`
	return link
})


const Header = memo(props => {
	const [modalShow, setModalShow] = useState(false);
	const handleModalClose = () => setModalShow(false);
	const [ref_id, setRef_id] = useState();
	const { user, onSocket, setUser, local, setLocal } = useContext(UserContext)
	const { t, cateData } = props;
	const [toggleNoti, setToggleNoti] = useState(false);
	const [noti, setNoit] = useState([])
	const { isBanner, scroll, isPreview = false } = props;
	const [cerrentCate, setCerrentCate] = useState();
	const [subcate, setSubCate] = useState();
	const [visible, setvisible] = useState(false);
	const [invisible, setinvisible] = useState(true);
	const [catemoblieID, setCateMobileID] = useState();

	const [showLogin, setShowLogin] = useState(false);
	const handleCloseLogin = () => {
		setShowLogin(false);
	};
	const [perPage, setperPage] = useState(3);
	const [items, setitems] = useState(Array(10).fill());

	const loadItems = () => {
		setitems(items.concat(Array(perPage).fill()));
	}

	const IsMember = () => {
		return user && user.member && user.member.STATUS == "Y";
	}

	useEffect(() => user && onSocket(user.id, eventSuccess, 'noti'), [user])

	const eventSuccess = (data, res) => {
		// console.log('data',data)
		var temp = { ...user };
		if (temp.notifications.findIndex(val => val.id == data.id) === -1) {
			temp.unread++;
			temp.notifications = [data, ...user.notifications];
			setUser(temp)
		}

		// console.log(res, 'test')
	}

	const changeLanguage = (lang) => {
		setLocal(lang)
		if (i18n.language != lang) {
			i18n.changeLanguage(lang)
		}
	}
	const showCountFav = () => {
		if (!user || user.favorites.length == 0)
			return ''
		return user.favorites.length > 9 ? <span>9<span>+</span></span> : <span>{user.favorites.length}</span>
	}

	const actionToggleNoti = (status) => {
		if (!user)
			return;

		setToggleNoti(status)

		if (user.unread == 0 || !status) {
			return;
		}
		var temp = user;
		temp.unread = 0;
		setUser(temp)

		api.readAll(user.id)


	}




	const logout = () => {
		AuthService.logout();
		// setUser(null);
		// Router.push('/');
		window.location.href = '/';
	}

	const setModalFalse = () => {
		setToggleNoti(false);
	}

	return (
		<>
			{
				(toggleNoti) && (
					<div className="bg-transparent-dropdown" onClick={() => setModalFalse()}></div>
				)
			}
			<div>
				<div className={classNames(`d-block-1200-up navbar-main ${isPreview ? 'd-none' : ''}`, { "hide": !scroll, "box-shadow": !isBanner || props.current != "translateY(0)" })} style={{ marginTop: '-3px', transform: props.current }}>
					<div className="help-menu">
						<div className="container">
							<div className="d-flex justify-content-end">
								<ul className="help-bar">
									{help_links.map(({ key, href, as, label, isLogin, out_link }) => (
										<li className="nav-item" key={Math.random()}>
											{
												(isLogin && !user) ? (
													<a className="nav-link" onClick={() => setShowLogin(true)}><span className="font-14-h5">{t(label)}</span></a>
												) : out_link ? (
													<a className="nav-link" href={api.seller_url} target="_blank"><span className="font-14-h5">{t(label)}</span></a>
												) : label == 'writer' ? (
													<a className="nav-link" href={href} target="_blank"><span className="font-14-h5">{t(label)}</span></a>
												) : (
													<Link href={href} as={as}>
														<a className="nav-link"><span className="font-14-h5">{t(label)}</span></a>
													</Link>
												)
											}
										</li>
									))}
									<li className="nav-item">
										<div className="dropdown nav-link pr-0">
											{/*<a className="text-default d-flex align-items-center text-pink" onClick={handleToggle}></a>*/}
											<button className="p-0" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
												<span className="font-14-h5">{t('change_language')}</span> <img className="ml-1" src={`${api.frontend_url}/images/arrow-down.svg`} alt="ศูนย์หนังสือจุฬาฯ" />
											</button>
											<div className=" dropdown-menu dropdown-menu-right" style={{ minWidth: '100px' }}>
												<a className={classNames("dropdown-item ch-lang font-14-h5 ", { 'active': local == 'th' })} onClick={() => changeLanguage('th')} >ไทย</a>
												<a className={classNames("dropdown-item ch-lang font-14-h5 ", { 'active': local == 'en' })} onClick={() => changeLanguage('en')}>English</a>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className={"bg-white"}>
						<div className="container">
							<nav className="navbar navbar-expand-lg navbar-light px-0">
								<div className="row mx-0 w-100 px-0">
									<div className="col-2 pl-0">
										<Link href='/' as={'/'}>
											<a className="navbar-brand">
												<img src={`${api.frontend_url}/icon/logo.svg`} className="mar-t-2" height="56" alt="ศูนย์หนังสือจุฬาฯ" style={{filter:'grayscale(1)'}} />
											</a>
										</Link>
									</div>
									<div className="col-9 d-flex align-items-center justify-content-start">
										<div className="d-none d-xxl-flex align-items-center">
											<ul className="navbar-nav mt-0">
												{links.map(({ key, href, label }) => (
													<li className="nav-item" key={Math.random()}>
														<Link href={href} as={href}>
															<a className="nav-link"><span className="mb-0 font-h4">{t(label)}</span></a>
														</Link>
													</li>
												))}
											</ul>
										</div>
										<div className="d-flex d-xxl-none align-items-center">
											<ul className="navbar-nav mt-0">
												{links.slice(0, 6).map(({ key, href, label }) => (
													<li className="nav-item" key={Math.random()}>
														<Link href={href} as={href}>
															<a className="nav-link"><span className="mb-0 font-h4">{t(label)}</span></a>
														</Link>
													</li>
												))}
											</ul>
											{/* <li className="nav-item none-list" >
												<div className="btn-group profile ">
													<a className="text-default d-flex pl-2" data-toggle="dropdown">
														<span className="mb-0 font-h4">{t('more')}</span>
														<img alt="ศูนย์หนังสือจุฬาฯ" className="ml-2 w-10px" src={`${api.frontend_url}/images/arrow-down.svg`} />
													</a>
													<div className="dropdown-menu right profile">
														<ul className="mt-0">
														{links.slice(6, 8).map(({ key, href, label }) => (
															<li className="nav-item none-list" key={Math.random()}>
																<Link href={href} as={href}><a className="nav-link"><span className="mb-0">{t(label)}</span></a>
																</Link>
															</li>
														))}
														</ul>
													</div>
												</div>
											</li> */}
										</div>
									</div>
									<div className="col-1 d-flex align-items-center px-0 justify-content-end">
										<div className="text-right">
											{/* <a className="text-default top border-right-same position-relative px-3"><img src="/icon/logitic.svg" className="w-auto icon-header" /><span>{t('order_tracking')}</span></a> */}
											{
												user ? (
													// <div className="input-group-append">
													<div className="btn-group profile ">
														<a className="text-default d-flex pl-3" data-toggle="dropdown">
															<img alt="ศูนย์หนังสือจุฬาฯ" src={user && user.member ? (user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ? `${api.frontend_url}/icon/VIP_USER.svg` : `${api.frontend_url}/icon/user.svg`) : `${api.frontend_url}/icon/user.svg`} className="pr-1 w-auto icon-header" /><span className=" align-self-center ellipsis font-h5">{user.firstname}</span>
															<img alt="ศูนย์หนังสือจุฬาฯ" className="ml-2 w-10px" src={`${api.frontend_url}/images/arrow-down.svg`} />
														</a>
														<div className="dropdown-menu right profile pt-0">
															{
																IsMember() ? <p style={{ backgroundColor: '#F8F9FA' }} className="px-3 py-2 mb-0"><b>POINT</b> <span className="float-right cart-price">{user.member.POINT}</span></p> : ''
															}
															<div className="pt-1"></div>
															<Link href={'/user/dashboard'}>
																<a className="text-default d-block pl-3">
																	<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-user.svg`} /> {t('manage_my_account')}
																</a>
															</Link>
															<Link href={'/user/order'}>
																<a className="text-default d-block pl-3">
																	<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-bag.svg`} /> {t('my_order')}
																</a>
															</Link>
															<Link href={'/user/review'}>
																<a className="text-default d-block pl-3">
																	<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-star.svg`} /> {t('my_review')}
																</a>
															</Link>
															<Link href={'/user/favorite'}>
																<a className="text-default d-block pl-3">
																	<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-fav.svg`} /> {t('likes')}
																</a>
															</Link>
															 <Link href={'/user/member'}>
																<a className="text-default d-block pl-3">
																	<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-vip.svg`} /> {t('premium_membership')}	
																</a>
															</Link> 
															<Link href={'/user/follow'}>
																<a className="text-default d-block pl-3">
																	<img style={{ width: '25px', margin: '8px 5px 10px 10px' }} alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-follow-writer.svg`} /> {t('follow')}
																</a>
															</Link>
															<a className="text-default d-block pl-3" onClick={logout}>
																<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-logout.svg`} /> {t('log_out')}
															</a>
														</div>
													</div>
													// </div>
												) : (
													<Link href={'/login'} as={`/login`}>
														<a className="text-default pl-3"><img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/user.svg`} className="w-auto icon-header" /><span className='font-h5'>{t('login')}</span></a>
													</Link>
												)
											}

										</div>
									</div>
								</div>
							</nav>
							<div className="pb-3">
								<div className="row mx-0 w-100 px-0">
									<div className="col-2 pl-0">
										{
											cateData ? (
												<CategorySeoMenu cateData={cateData} />
											) : (
												<CategoryMenu />
											)
										}

									</div>
									<div className="col-7">
										<Search classnames={"mr-3"} />
									</div>
									<div className="col-3 d-flex align-items-center px-0 justify-content-end">
										<div className="position-relative px-3 float-right">
											{
												!user ? (
													<a onClick={() => setShowLogin(true)}><img src={`${api.frontend_url}/icon/bell2.svg`} className="w-auto icon-header" alt="ศูนย์หนังสือจุฬาฯ" /></a>
												) : (
													<a className="text-default" onClick={() => { actionToggleNoti(!toggleNoti) }}>
														<div className="popup-container-count">
															<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/bell1.svg`} className="w-auto icon-header" />
															{user && user.unread > 0 && (<span>{user.unread}</span>)}
														</div>
													</a>
												)
											}

											<div className={classNames('popup-container notification', { 'd-none': !toggleNoti })}>
												<div className="popup-container-list">
													{
														user ? user.notifications.map((item) => (<NotiItem key={Math.random()} item={item} user={user} />)) : ''
													}
												</div>
												{
													user && user.notifications.length ? (
														<div className="popup-container-footer">
															<Link href={'/user/notification'} as={`/user/notification`}>
																<a>
																	<button type="button" className="btn btn-primary w-100">{t('view_all')}</button>
																</a>
															</Link>
														</div>
													) : ('')
												}

											</div>
										</div>
										{
											user ? (
												<Link href="/user/favorite">
													<a className="text-default pl-0 pr-3 position-relative float-right border-right-same">
														<div className="popup-container-count">
															<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/heart1.svg`} className="w-auto icon-header" />{showCountFav()}
														</div>
													</a>
												</Link>
											) : (
												<a onClick={() => setShowLogin(true)} className="text-default pl-0 pr-3 position-relative float-right border-right-same">
													<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/heart2.svg`} className="w-auto icon-header" />
												</a>
											)
										}
										<div className="text-right">
											<div className="position-relative pl-3 float-right">
												<Cart user={user} />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className={classNames(`d-block-1200-down ${isPreview ? 'd-none' : ''}`, { "box-shadow": !isBanner })} style={{ marginTop: '-3px' }}>
					<div className="help-menu">
						<div className="container">
							<div className="d-flex justify-content-end">
								<ul className="help-bar">
									{help_links.map(({ key, href, as, label, isLogin, out_link }) => (
										<li className="nav-item" key={key}>
											{
												(isLogin && !user) ? (
													<a className="nav-link" onClick={() => setShowLogin(true)}><span className="font-14-h5">{t(label)}</span></a>
												) : out_link ? (
													<a className="nav-link" href={api.seller_url} target="_blank"><span className="font-14-h5">{t(label)}</span></a>
												) : label == 'writer' ? (
													<a className="nav-link" href={href} target="_blank"><span className="font-14-h5">{t(label)}</span></a>
												) : (
													<Link href={href} as={as}>
														<a className="nav-link"><span className="font-14-h5">{t(label)}</span></a>
													</Link>
												)
											}

										</li>
									))}
									<li className="nav-item">
										<div className="dropdown nav-link pr-0">
											{/*<a className="text-default d-flex align-items-center text-pink" onClick={handleToggle}></a>*/}
											<button className="p-0" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
												<span className="font-14-h5">{t('change_language')}</span> <img className="ml-1" src={`${api.frontend_url}/images/arrow-down.svg`} alt="ศูนย์หนังสือจุฬาฯ" />
											</button>
											<div className=" dropdown-menu dropdown-menu-right" style={{ minWidth: '100px' }}>
												<a className={classNames("dropdown-item text-light-grey font-14", { 'text-black': local != 'th' })} onClick={() => changeLanguage('th')} >{t('thai')}</a>
												<a className={classNames("dropdown-item text-light-grey font-14", { 'text-black': local != 'en' })} onClick={() => changeLanguage('en')}>English</a>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="bg-white">
						<div className="container">
							<nav className="navbar navbar-expand-lg navbar-light px-0">
								<div className="row mx-0 w-100 px-0">
									<div className="col-2 pl-0">
										<Link href='/' as={'/'}>
											<a className="navbar-brand">
												<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/logo.svg`} height="40" style={{filter:'grayscale(1)'}}/>
											</a>
										</Link>
									</div>
									<div className="col-7 d-flex align-items-center">
										<ul className="d-flex my-auto align-items-center px-0">
											<div className="d-none d-lg-flex">
												{links.slice(0, 4).map(({ key, href, label }) => (
													<li className="nav-item none-list" key={key + Math.random()}>
														<Link href={href} as={href}><a className="nav-link "><span className="mb-0 font-h4">{t(label)}</span></a>
														</Link>
													</li>
												))}
											</div>
											<div className="d-flex d-lg-none ">
												{links.slice(0, 3).map(({ key, href, label }) => (
													<li className="nav-item none-list" key={key + Math.random()}>
														<Link href={href} as={href}><a className="nav-link "><span className="mb-0 font-h4">{t(label)}</span></a>
														</Link>
													</li>
												))}
											</div>
											<li className="nav-item none-list" >
												<div className="btn-group profile ">
													<a className="text-default d-flex pl-3" data-toggle="dropdown">
														<span className="mb-0 font-h4">{t('more')}</span>
														<img alt="ศูนย์หนังสือจุฬาฯ" className="ml-2 w-10px" src={`${api.frontend_url}/images/arrow-down.svg`} />
													</a>
													<div className="dropdown-menu right profile">
														<ul className="d-none d-lg-block mt-0">
															{links.slice(4, 9).map(({ key, href, label }) => (
																<li className="nav-item none-list" key={Math.random()}>
																	<Link href={href} as={href}><a className="nav-link"><span className="mb-0 font-h4">{t(label)}</span></a>
																	</Link>
																</li>
															))}
														</ul>
														<ul className="d-block d-lg-none  mt-0">
															{links.slice(3, 9).map(({ key, href, label }) => (
																<li className="nav-item none-list" key={Math.random()}>
																	<Link href={href} as={href}><a className="nav-link"><span className="mb-0 font-h4">{t(label)}</span></a>
																	</Link>
																</li>
															))}
														</ul>
													</div>
												</div>
											</li>
										</ul>
									</div>
									<div className="col-3 d-flex align-items-center px-0 justify-content-end align-self-end">
										<div className="position-relative pl-3 float-right border-right-same">
											{
												!user ? (
													<a onClick={() => setShowLogin(true)}><img src={`${api.frontend_url}/icon/bell2.svg`} alt="ศูนย์หนังสือจุฬาฯ" className="w-auto icon-header" /></a>
												) : (
													<a className="text-default " onClick={() => { actionToggleNoti(!toggleNoti) }}>
														<div className="popup-container-count ">
															<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/bell1.svg`} className="w-auto icon-header" />
															{user && user.unread > 0 && (<span>{user.unread}</span>)}
														</div>
													</a>
												)
											}

											<div className={classNames('popup-container notification ', { 'd-none': !toggleNoti })}>
												<div className="popup-container-list">
													{
														user ? user.notifications.map((item) => (<NotiItem key={Math.random()} item={item} />)) : ''
													}
												</div>
												{
													user && user.notifications.length ? (
														<div className="popup-container-footer">
															<Link href={'/user/notification'} as={`/user/notification`}>
																<a>
																	<button type="button" className="btn btn-primary w-100">{t('view_all')}</button>
																</a>
															</Link>
														</div>
													) : ('')
												}

											</div>
										</div>

										<div className="text-right">
											{/* <a className="text-default top border-right-same position-relative px-3"><img src="/icon/logitic.svg" className="w-auto icon-header" /><span>{t('order_tracking')}</span></a> */}
											{
												user ? (
													// <div className="input-group-append">
													<div className="btn-group profile ">
														<a className="text-default d-flex pl-3" data-toggle="dropdown">
															<img alt="ศูนย์หนังสือจุฬาฯ" src={user && user.member ? (user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ? `${api.frontend_url}/icon/VIP_USER.svg` : `${api.frontend_url}/icon/user.svg`) : `${api.frontend_url}/icon/user.svg`} className="pr-1 w-auto icon-header" /><span className=" align-self-center ellipsis font-h5">{user.firstname}</span>
															<img alt="ศูนย์หนังสือจุฬาฯ" className="ml-2 w-10px" src={`${api.frontend_url}/images/arrow-down.svg`} />
														</a>
														<div className="dropdown-menu right profile pt-0">
															{
																IsMember() ? <p style={{ backgroundColor: '#F8F9FA' }} className="px-3 py-2 mb-0"><b>POINT</b> <span className="float-right cart-price">{tools.currencyFormatDE(user.member.POINT, 0)}</span></p> : ''
															}
															<div className="pt-1"></div>
															<Link href={'/user/dashboard'}>
																<a className="text-default d-block pl-3">
																	<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-user.svg`} /> {t('manage_my_account')}
																</a>
															</Link>
															<Link href={'/user/order'}>
																<a className="text-default d-block pl-3">
																	<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-bag.svg`} /> {t('my_order')}
																</a>
															</Link>
															<Link href={'/user/review'}>
																<a className="text-default d-block pl-3">
																	<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-star.svg`} /> {t('my_review')}
																</a>
															</Link>
															<Link href={'/user/favorite'}>
																<a className="text-default d-block pl-3">
																	<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-fav.svg`} /> {t('likes')}
																</a>
															</Link>
															<Link href={'/user/member'}>
																<a className="text-default d-block pl-3">
																	<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-vip.svg`} /> {t('premium_membership')}
																</a>
															</Link> 
															<Link href={'/user/follow'}>
																<a className="text-default d-block pl-3">
																	<img style={{ width: '25px', margin: '8px 5px 10px 10px' }} alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-follow-writer.svg`} /> {t('follow')}
																</a>
															</Link>
															<a className="text-default d-block pl-3" onClick={logout}>
																<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-logout.svg`} /> {t('log_out')}
															</a>
														</div>
													</div>
													// </div>
												) : (
													<Link href={'/login'} as={`/login`}>
														<a className="text-default pl-3 d-flex"><img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/user.svg`} className="w-auto icon-header" /><span className="align-self-center ellipsis font-h5">{t('login')}</span></a>
													</Link>
												)
											}

										</div>
									</div>
								</div>
							</nav>
							<div className="pb-3">
								<div className="row mx-0 w-100 px-0">
									<div className="col-1 pl-0">
										{
											cateData ? (
												<CategorySeoMenu platform="ipad" cateData={cateData} />
											) : (
												<CategoryMenu platform="ipad" />
											)
										}
									</div>
									<div className="col-8">
										<Search />
									</div>
									<div className="col-3 d-flex align-items-center px-0 justify-content-end">

										<div className="text-right ">
											<div className="position-relative float-right">
												<Cart user={user} />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Modal className="modal-cart" centered show={showLogin} onHide={handleCloseLogin} size="xl">
					<Modal.Header closeButton>
						<div>
							<Modal.Title className="d-flex">{t('system_login')}</Modal.Title>
						</div>
					</Modal.Header>
					<Modal.Body>
						<LoginLayout loginBy="modal" closeModal={handleCloseLogin} isModal={true} />
					</Modal.Body>
				</Modal>
			</div>
		</>
	)
})

export default withTranslation('header')(Header)
