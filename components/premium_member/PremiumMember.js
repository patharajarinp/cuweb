import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Layout from '../../components/layout';
import LoginLayout from '../../components/layout/login_layout';
import UserContext from '../../contexts/UserContext';
import { Link, withTranslation } from "../../utils/i18n";
import api from "../../utils/api";

const PremiumMember = (props) => {
  const { t } = props;
  const { user, fetchUser, setUser } = useContext(UserContext)
	const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => {
		setShowLogin(false);
	};

  return (
    <>
      <div className="container mt-5">
				<h2 className="text-center text-pink">{t("benefits")}</h2>
				<h2 className="text-center">{t("chulabook")}</h2>
				<div className="row mt-68px">
					<img className="col-6 img-fluid" src={`${api.frontend_url}/images/premium-1.svg`} />
					<div className="col-6 text-center d-flex  align-items-center">
						<div className="m-auto ">
							<div className="circle-num mb-3">
								<h3 className="text-white text-circle-num">1</h3>
							</div>
							<h4 className="title-premium">{t("discount")}</h4>
							<p className="mb-0">{t("one_year_membership")}</p>
							<p className="mb-0">({t("except_n_code")})</p>
						</div>
					</div>
				</div>
				<div className="row mt-64px">
					<div className="col-6 text-center d-flex  align-items-center">
						<div className="m-auto ">
							<div className="circle-num mb-3">
								<h3 className="text-white text-circle-num">2</h3>
							</div>

							<h4 className="title-premium">{t('receive_news')}</h4>
							<p className="mb-0">{t("interesting_activities")}</p>
						</div>
					</div>
					<img className="col-6 img-fluid" src="/images/premium-2.svg" />
				</div>
				<div className="row mt-64px">
					<img className="col-6 img-fluid" src="/images/premium-3.svg" />
					<div className="col-6 text-center d-flex  align-items-center">
						<div className="m-auto ">
							<div className="circle-num mb-3">
								<h3 className="text-white text-circle-num">3</h3>
							</div>
							<h4 className="title-premium">{t("participate")}</h4>
							<p className="mb-0">{t("organized")}</p>

						</div>
					</div>
				</div>
				<div className="row mt-64px">
					<div className="col-6 text-center d-flex  align-items-center">
						<div className="m-auto ">
							<div className="circle-num mb-3">
								<h3 className="text-white text-circle-num">4</h3>
							</div>

							<h4 className="title-premium">{t("companies")}</h4>
							<p className="mb-0">{t("please_contact")}</p>
						</div>
					</div>
					<img className="col-6 img-fluid" src="/images/premium-4.svg" />
				</div>
				<div className="d-flex justify-content-center mt-68px mb-80px">
						{
							user ? (
								user.member ? (
									user.member.STATUS == "Y" && user.member.MEMBER_STAT == "N" ? (
										<>
											<Link href={`/user/member`}>
												<a><button className="btn btn-outline-primary text-black">{t("already_a_member")}</button></a>
											</Link>
										</>
									): (
										<>
											<Link href={`/user/member`}>
												<a><button className="btn btn-primary mr-3">{t("register")}</button></a>
											</Link>
											<Link href={`/user/member-activate`}>
												<a><button className="btn btn-outline-primary text-black">{t("already_a_member")}</button></a>
											</Link>
										</>    
									)
								) : (
									<>
										<Link href={`/user/member`}>
											<a><button className="btn btn-primary mr-3">{t("register")}</button></a>
										</Link>
										<Link href={`/user/member-activate`}>
											<a><button className="btn btn-outline-primary text-black">{t("already_a_member")}</button></a>
										</Link>
									</>    
								)	
							) : (
								<>
									<button className="btn btn-primary mr-3" onClick={() => setShowLogin(true)}>{t("register")}</button>
									{/* <button className="btn btn-outline-primary text-black" onClick={() => setShowLogin(true)}>{t("already_a_member")}</button> */}
								</>
							)
						}
				</div>
			</div>

			<Modal className="modal-cart" centered show={showLogin} onHide={handleCloseLogin} size="xl">
				<Modal.Header closeButton>
					<div>
					<Modal.Title className="d-flex">{t("login")}</Modal.Title> 
					</div>
				</Modal.Header>
				<Modal.Body>
					<LoginLayout loginBy="modal" closeModal={handleCloseLogin} isModal={true}  />                     
				</Modal.Body>
			</Modal> 
    </>
  )
}

export default PremiumMember