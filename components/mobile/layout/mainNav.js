// import Link from 'next/link';
import React, { useContext } from 'react';
import UserContext from '../../../contexts/UserContext';
import { Link, withTranslation } from '../../../utils/i18n';


const mainNav = (props) => {
    const { user, handleCart, fetchUser } = useContext(UserContext)
    const { active, t, show } = props;
    return (
        <div className={`${show ? "navbar-main" : "d-none"} chk_load_mobile`}>
            <Link href='/'>

                <a className="col-nav-main">
                    <img src={active == 1 ? '/mobile/image/icon/icon-on-home.svg' : '/mobile/image/icon/icon-home.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
                    <p className="text-btn m-0 p-12 text-capitalize">{t("mobile_navbar:home_page")}</p>
                </a>
            </Link>
            <Link href="/categories">
                <a className="col-nav-main">
                    <img src={active == 2 ? '/mobile/image/icon/icon-on-sort.svg' : '/mobile/image/icon/icon-sort.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
                    <p className="text-btn m-0 p-12 text-capitalize">{t("mobile_header:category")}</p>
                </a>
            </Link>
            {
                user ? (
                    <>
                        <Link href="/user/notification">
                            <a className="col-nav-main">
                                <img src={active == 3 ? '/mobile/image/icon/icon-on-notification.svg' : '/mobile/image/icon/icon-notification.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
                                <p className="text-btn m-0 p-12 text-capitalize">{t("mobile_navbar:notifications")}</p>
                            </a>
                        </Link>
                        <Link href="/user/dashboard">
                            <a className="col-nav-main">
                                <img src={active == 4 ? '/mobile/image/icon/icon-on-profile.svg' : '/mobile/image/icon/icon-profile.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
                                <p className="text-btn m-0 p-12 text-capitalize">{t("mobile_navbar:my_account")}</p>
                            </a>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            <a className="col-nav-main">
                                <img src={active == 3 ? '/mobile/image/icon/icon-on-notification.svg' : '/mobile/image/icon/icon-notification.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
                                <p className="text-btn m-0 p-12 text-capitalize">{t("mobile_navbar:notifications")}</p>
                            </a>
                        </Link>
                        <Link href="/login">
                            <a className="col-nav-main">
                                <img src={active == 4 ? '/mobile/image/icon/icon-on-profile.svg' : '/mobile/image/icon/icon-profile.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
                                <p className="text-btn m-0 p-12 text-capitalize">{t("mobile_navbar:my_account")}</p>
                            </a>
                        </Link>
                    </>
                )
            }

        </div>

    );
}

export default withTranslation(['mobile_navbar', 'mobile_header'])(mainNav);