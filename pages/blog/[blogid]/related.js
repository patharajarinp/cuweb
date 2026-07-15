import React from 'react';
import MobileMainRelated from '../../../components/blog_res/mobile/related/MobileMainRelated';
import MainRelated from '../../../components/blog_res/related/MainRelated';
import Layout from '../../../components/layout';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { withTranslation } from '../../../utils/i18n';
function related({t}) {

	const isMobile = useMediaQuery(992);

	return (
		<div>
			<Layout title={"Blog"} isBanner={true}>
				{
					!isMobile ? (
						<MainRelated t={t} />
					) : (
						<MobileMainRelated t={t} />
					)
				}
			</Layout>
		</div>
	)
}
export default withTranslation("blog_index")(related);