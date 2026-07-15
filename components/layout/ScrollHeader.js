import classNames from 'classnames';
import { useContext, useState } from 'react';
import UserContext from '../../contexts/UserContext';
import api from '../../utils/api';
import AuthService from '../../utils/AuthService';
import { Link, withTranslation } from "../../utils/i18n";
import Cart from '../widget/cart';
import NotiItem from '../widget/NotiItem';
import Search from './search';

const ScrollHeader = (props) => {
	const { isBanner, scroll, isPreview = false } = props;
	const { user, setUser } = useContext(UserContext)
	const { t } = props;
	const [toggleNoti, setToggleNoti] = useState(false);

	const showCount = () => {
		if (!user || user.cart.length == 0)
			return ''
		return user.cart.length > 9 ? <span>9<span>+</span></span> : <span>{user.cart.length}</span>
	}

	const logout = () => {
		AuthService.logout();
		window.location.href = '/';
	}

	const actionToggleNoti = (status) => {
		if (!user)
			return;

		setToggleNoti(status)

		if (user.unread == 0 || !status) {
			return;
		}
		var temp = { ...user };
		temp.unread = 0;
		setUser(temp)

		api.readAll(user.id)

	}

	return (
		<>
			<div className={classNames(`d-block-1200-up navbar-sub ${isPreview ? 'd-none' : ''}`, { "box-shadow": !isBanner, "hide": scroll })} >
				<div className="bg-white">
					<div className="container">
						<nav className="navbar navbar-expand-lg navbar-light px-0">
							<div className="row mx-0 w-100 px-0">
								<div className="col-2 pl-0">
									<Link href='/' as={'/'}>
										<a className="navbar-brand">
											<img src={`${api.frontend_url}/icon/logo.svg`} height="56" alt="ศูนย์หนังสือจุฬาฯ"  style={{filter:'grayscale(1)'}} />
										</a>
									</Link>
								</div>
								<div className="col-6 d-flex align-items-center">
									<Search classnames={"mr-3"} />
								</div>
								<div className="col-4 d-flex align-items-center px-0 justify-content-end">
									<div className="text-right">
										{
											user ? (
												<div className="btn-group profile ">
													<a className="text-default d-flex pl-3" data-toggle="dropdown">
														<img alt="ศูนย์หนังสือจุฬาฯ" src={user && user.member ? (user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ? `${api.frontend_url}/icon/VIP_USER.svg` : `${api.frontend_url}/icon/user.svg`) : `${api.frontend_url}/icon/user.svg`} className="pr-1 w-auto icon-header" /><span className=" align-self-center ellipsis font-h5">{user.firstname}</span>
														<img alt="ศูนย์หนังสือจุฬาฯ" className="ml-2 w-10px" src={`${api.frontend_url}/images/arrow-down.svg`} />
													</a>
													<div className="dropdown-menu right profile">
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
														{/* <Link href={'/user/member'}>
																<a className="text-default d-block pl-3">
																	<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/icon-vip.svg`} /> {t('premium_membership')}
																</a>
															</Link> */}
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
									<div className="position-relative px-3 float-right">
										{
											!user ? (
												<a onClick={() => setShowLogin(true)}><img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/icon/bell2.svg`} className="w-auto icon-header" /></a>
											) : (
												<a className="text-default border-right-same" onClick={() => { actionToggleNoti(!toggleNoti) }}>
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
										<div className="position-relative pl-3 float-right">
											<Cart user={user} />
										</div>
									</div>
								</div>
							</div>
						</nav>
					</div>
				</div>
			</div>
		</>
	)
}

export default withTranslation(['header', 'noti'])(ScrollHeader)