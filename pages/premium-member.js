import React from 'react';
import Layout from '../components/layout';
import MobilePremiumMember from '../components/premium_member/mobile/MobilePremiumMember';
import PremiumMember from '../components/premium_member/PremiumMember';
import useMediaQuery from '../hooks/useMediaQuery';
import { withTranslation } from "../utils/i18n";

const PremiumMemberPage = (props) => {
	
	const {t} = props;

	const isMobile = useMediaQuery(992);

	return (
		<Layout title="สมาชิกพรีเมี่ยม | ศูนย์หนังสือจุฬาฯ">
			{
				!isMobile ? (
					<PremiumMember t={t} />
				) : (
					<MobilePremiumMember t={t} />
				)
			}
			
		</Layout>
	)

}
export default withTranslation('premiumMember')(PremiumMemberPage)