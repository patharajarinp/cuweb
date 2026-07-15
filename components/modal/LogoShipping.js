import { Modal } from 'react-bootstrap'
import { withTranslation } from '../../utils/i18n'
import tools from '../../utils/tools'

const LogoShipping = ({pClass, imgClass, img}) => {
	
	return (
    <img src={img} className={imgClass} />
	)
}

export default LogoShipping