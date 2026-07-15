import React, { useContext, useState } from 'react';
import UserContext from '../../../contexts/UserContext';
import { Link, withTranslation } from '../../../utils/i18n';

const MobilePremiumMember = (props) => {
  const { t } = props;
  const { user, fetchUser, setUser } = useContext(UserContext)
	const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => {
		setShowLogin(false);
	};

  return (
    <>
      <div className="d-flex align-items-center">
        <div className=" text-center cart-nav-title"></div>
        <Link href="/user/dashboard">
          <a className="btn-close-left">
          </a>
        </Link>
      </div>
      <div className="h-64px"></div>
      <div className="bg-white d-flex">
        <div className="container bg-white  pb-5 ">
          <div className="premiummember-item">
            <h3 className="text-pink text-center font-20">{t("benefits")}</h3>
            <h3 className="text-center font-20">{t("chulabook")}</h3>
          </div>
          <div className="premiummember-item">
            <img className="img-fluid w-100" src="/mobile/image/banner/premium01.png" alt="First slide"
            />
            <h3 className="mt-4 text-pink text-center font-20">{t("discount")}</h3>
            <p className="mb-0 text-center">{t("one_year_membership")}</p>
            <p className="mb-0 text-center">({t("except_n_code")})</p>
          </div>
          <div className="premiummember-item">
            <img className="img-fluid w-100" src="/mobile/image/banner/premium02.png" alt="2 slide"
            />
            <h3 className="mt-4 text-pink text-center font-20">{t('receive_news')}</h3>
            <p className="mb-0 text-center">{t("interesting_activities")}</p>
          </div>
          <div className="premiummember-item">
            <img className="img-fluid w-100" src="/mobile/image/banner/premium03.png" alt="First slide"
            />
            <h3 className="mt-4 text-pink text-center font-20">{t("participate")}</h3>
            <p className="mb-0 text-center">{t("organized")}</p>
          </div>
          <div className="premiummember-item">
            <img className="img-fluid w-100" src="/mobile/image/banner/premium04.png" alt="First slide"
            />
            <h3 className="mt-4 text-pink text-center font-20">{t("companies")}</h3>
            <p className="mb-0 text-center">{t("please_contact")}</p>
          </div>
          <div>
          	<div className="h-64px"></div>
          </div>
        </div>

        <div className="footer-space"></div>
      </div>
      <div className="success-manu">
        <Link href="/user/member-activate">
          <a className="btn-success-menu"><h4 className="text-black m-auto">{t("already_a_member")}</h4></a>
        </Link>
        <Link href="/user/member-register">
          <a className="btn-success-menu bg-pink"><h4 className="text-white m-auto">{t("translations:sign_up")}</h4></a>
        </Link>
      </div>
    </>
  )
}

export default MobilePremiumMember