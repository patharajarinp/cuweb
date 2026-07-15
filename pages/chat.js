import MessengerCustomerChat from 'react-messenger-customer-chat';
import { Link, Router, i18n, Trans, withTranslation, useTranslation } from "../utils/i18n";
import PropTypes from 'prop-types'
// import {Link} from '../utils/i18n'
const Chat = props =>{
    var {t,tReady} = props;
    // const t2 = t;
    
    // t = (val)=>{
        
    //     return tReady ? t2(val) : ''
    // }
    // if(!tReady) return <div></div>
    //console.log(t);
    const onClick = (e)=>{
        alert('asdsad')
    }
    return(
        <div>
            <h1>Chat Page </h1>
            <h2>{t('header:vendor')}</h2>
            <h2>{t('translations:h1')}</h2>
            <h2>{t('login:forgot_password')}</h2>
            <Link href={`/test-slug/[id]?id=1`} as="/test-slug/1" >
                <a>Click</a>
            </Link>
            <button onClick={onClick}>CLick</button>
            {/* <MessengerCustomerChat
            pageId="240453878505"
            appId="177242226882002"
            htmlRef="/aaa"
            />
         */}
        </div>
        
    )
}

Chat.getInitialProps = async () => ({
    namespacesRequired: ['translations','header','login'],
})
Chat.propTypes = {
    t: PropTypes.func.isRequired,
}
export default withTranslation()(Chat);