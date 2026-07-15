import React, { useState, useEffect, useContext,memo } from 'react'
import { withTranslation, Link, Router } from "../../utils/i18n";
import tools from '../../utils/tools'
import api from '../../utils/api'
import classNames from 'classnames';
import UserContext from '../../contexts/UserContext';
import { ProgressBar, Button, Modal } from 'react-bootstrap';
import LoginLayout from '../../components/layout/login_layout'


const CartItem = (props) => {
	const { user, fetchUser } = useContext(UserContext);
	var { item } = props;

	const delCart = (cart_id) => {
    //alert(cart_id);
		api.delCart(cart_id)
		.then(res=>{
			const data = res.data;
			fetchUser();
		
			if(user.cart.length == 1){
			
				setToggle(false);
			}else{
		
			}
		})
		.catch(err => {
			console.log(err.response);
		})
	}

	return (
		<div className="item" key={item.id}>
			<a className="item-remove" onClick={() => { delCart(item.id) }}><i className="fas fa-trash"></i></a>
			<div className="item-body">
				<div className="item-content">
					<div className="item-detail">
						<p>{item.name}</p>
						<p><b>{item.quantity} x ฿ {parseFloat(item.cover_price).toFixed(2)}</b></p>
					</div>
				</div>
				<div className="area-72px">
					<div className="area-img">
						<div className="item-img">
							<img src={item.picture ? item.picture : `${api.frontend_url}/images/book.png`} align="middle" className="mh-100 no-img  mw-100per" />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const Cart = memo(({user,t}) =>{
	const { setHandle } = useContext(UserContext);
	const [toggle, setToggle] = useState(false);
	const [calDetail,setCalDetail] = useState();
	const [animate,setAnimate] = useState();
	const [productEcode, setProductEcode] = useState(0);

	// useEffect(()=>{
	// 	setHandle({key:"cart",fn:setAnimate})
	// },[])

	useEffect(()=>{
		if(!user) return;
		var total = 0;
		let hasEcode = 0;
		user.cart.forEach(data => {
			if (data.type === 'ecode') hasEcode = 1;
			total += parseFloat(data.price) * parseFloat(data.quantity);
		});
		setCalDetail({total});
		setProductEcode(hasEcode);
	},[user])

	const showCount = () => {
		if (!user || user.cart.length == 0)
			return ''
		return user.cart.length > 99 ? <span>99<span>+</span></span> : <span>{user.cart.length}</span>
	}

	const handleToggle = () => {
		if (!user || user.cart.length == 0) {
			Router.push('/user/no-cart');
		} else {
			setToggle(!toggle)
		}
	}

	const [showLogin, setShowLogin] = useState(false);
	const handleCloseLogin = () => {
		setShowLogin(false);
	};

	console.log(`productEcode : ${productEcode}`)

	return (
		<>
			{
				(toggle) && (
					<div className="bg-transparent-dropdown" onClick={() => setToggle(false)}></div>
				)
			}
			{
				!user ? (
					<a className="text-default d-flex align-items-center" onClick={() => setShowLogin(true)}>
						<div className="popup-container-count">
							<img src={`${api.frontend_url}/icon/cart.svg`} alt="ศูนย์หนังสือจุฬาฯ" className="pr-1 w-auto icon-header icon-cart" />{showCount()}
						</div>
						<b>฿ {tools.currencyFormatDE( calDetail && calDetail.total ? calDetail.total : 0)}</b>
					</a>
				) : (
						<a className="text-default d-flex align-items-center" onClick={handleToggle}>
							<div className="popup-container-count">
								<img src={`${api.frontend_url}/icon/cart.svg`} alt="ศูนย์หนังสือจุฬาฯ" className="pr-1 w-auto icon-header icon-cart" />{showCount()}
							</div>
							<b>฿ {tools.currencyFormatDE( calDetail && calDetail.total ? calDetail.total : 0)}</b>
						</a>
					)
			}
			<div className={classNames('popup-container cart', { 'd-none': !toggle })}>
				<div className="popup-container-list">
					{
						user ? user.cart.map((item) => (<CartItem key={Math.random()} item={item} />)) : ''
					}
				</div>
				<div className="popup-container-summary">
					<p className="text-center m-0"><b>ราคารวม : ฿/ {tools.currencyFormatDE(calDetail && calDetail.total ? calDetail.total : 0)}</b></p>
				</div>
				<div className="popup-container-footer">
					<Link
						href={productEcode === 1 ? '/ecode/cart' : '/user/cart'}
						as={productEcode === 1 ? '/ecode/cart' : '/user/cart'}
					>
						<button type="button" className="btn btn-primary w-100">ดูรถเข็น ( {user ? user.cart.length : 0} )</button>
					</Link>
				</div>
			</div>

			<Modal className="modal-cart" centered show={showLogin} onHide={handleCloseLogin} size="xl">
				<Modal.Header closeButton>
					<div>
						<Modal.Title className="d-flex">{t('system_login')}</Modal.Title>
					</div>
				</Modal.Header>
				<Modal.Body>
					<LoginLayout loginBy="modal" closeModal={handleCloseLogin} isModal={true}  />
				</Modal.Body>
			</Modal>
		</>
	)
})

export default withTranslation(['header'])(Cart)