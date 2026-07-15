// import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../../components/layout';
import { Link, Router, withTranslation } from '../../../utils/i18n';
const forget_sendmail = (props) => {
	const router = useRouter();
	const { email } = router.query;
	const { t } = props;
	return (
		<Layout className="mb-5" title={'ลืมรหัสผ่าน (forgot password) | ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย'}>
			<div className="cancel-product ">
				<div className="container">
					<Link href="/user/forgot-password">
						<img className="img-fluid my-auto on-left" src={'/mobile/image/icon/icon-back.svg'} />
					</Link>
					<h2 className="text-black ">{t('mobile_login:forgot_password')}</h2>
					<div className="d-flex">
						<img className="m-auto img-fluid" src="/mobile/image/icon/icon-mail-lg.svg" />
					</div>
					<h2 className="text-center text-pink text-uppercase">{t('email_sent')}</h2>
					<p className="text-black text-center mb-1">{t('we_sent_a_message_to')}</p>
					<h4 className="text-black text-center mb-1 text-tran-none">{email}</h4>
					<p className="text-black text-center">{t('please_check_your_email_box_then')} <br /> {t('follow_the_steps')}</p>
					<div className="mt-3 pt-2">
						<Link href="/login">
							<button className="btn btn-pink-submit h-40px mt-5 mb-3"><h4 className="text-white m-auto  text-uppercase">{t('back_to_login_page')}</h4></button>
						</Link>
						<Link href="/user/forgot-password">
							<button className="btn btn-border-cu h-40px mt-2 mb-3"><h4 className="text-black m-auto  text-uppercase">{t('try_again')}</h4></button>
						</Link>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default withTranslation('mobile_register')(forget_sendmail);