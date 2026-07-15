import classNames from 'classnames';
import React, { useState } from 'react';
import { CustomInput } from 'reactstrap';
import api from '../../../utils/api';
import { Link, withTranslation, Router } from '../../../utils/i18n';
const CancelOrder = (props) => {
    const { status, slips, order_id,t } = props;
    const [cancelPop,setcancelPop] =useState(false);
    const toggleCancelPop = () => setcancelPop(!cancelPop);
    const [charsCount, setcharsCount] = useState(0);
    
    const handleChange = (e) => {
        setcharsCount(e.target.value.length);

    }
    const [confirmcancel,setconfirmcancel] = useState(false);
    const openconfirmcancel = () => setconfirmcancel(true);
    const closeconfirmcancel =() => setconfirmcancel(false);


    const [chk, setChk] = useState(0);
    const handleChangeRadio = () => {
        setChk(1);
    }

    const handleCancel = () => {
        event.preventDefault();
        setconfirmcancel(true);
    }

    const saveCancel = () => {
        var status = 0;
        var cancel_type = document.getElementById('cancel_type').value;
        var cancel_note = document.getElementById('cancel_note').value;
        api.updateOrderStatus(order_id, { status, cancel_type, cancel_note }).then(res => {
            const data = res.data;
            setconfirmcancel(false);
            Router.push('/user/order_cancel');
        })
        .catch(err => {
            console.log(err.response);
        })
        
    }

    let options_val = [];
    for(let i = 1 ; i <= 8 ;i++){
        options_val.push(<option value={i} key={'reason'+i}>{t('mobile_order_detail:reason_cancel'+i)}</option>)
    }

    return (
        <>
            { 
                ((status == 1 || status == 2) && (slips && !slips.length)) ? 
                    <div className="container">
                    <button className="btn btn-cancel" onClick={toggleCancelPop} >{t("mobile_order_detail:cancel_order")}</button>
                </div>:" "
            }
            {
                (status == 1 && !slips.length) ? 
                <Link href={`/user/order-tranfer/[order_id]?order_id=${order_id}`} as={`/user/order-tranfer/${order_id}`}>
                <a><button className="btn-bottom-layout btn-pink-submit btn-none-border">
                    <h4 className="text-white m-auto">{t("mobile_translations:payment")}</h4>
                </button></a></Link> : ''
            }

            {
                (status == 1 && slips.length) ?
                <button className="btn-bottom-layout btn-cancel h-56px btn-none-border">
                    <h4 className="text-white m-auto">{t("mobile_translations:awaiting_review")}</h4>
                </button> :''
            }
            

            <div className={classNames("cancel-pop",{"show" : cancelPop})}>
                <div className="cancel-product ">
                    <div className="cancel-product-nav">
                        <div className="text-center m-auto">
                            <h3 className="mb-0">{t("mobile_order_detail:cancel_order")}</h3>
                        </div>

                        <a className="btn-close-left" onClick={toggleCancelPop}  ></a>

                    </div>
                    <div className="container">
                        <form onSubmit={handleCancel}>
                            <div className="info-creditcard-100 mt-5">
                                <select className="w-100" required id="cancel_type">
                                    <option value="" disabled selected hidden>{t("mobile_order_detail:choose_reason")}*</option>
                                    {options_val}
                                    
                                </select>
                            </div>
                            <div className="info-creditcard-100 mt-5 mb-1">
                                <input className="effect-16" id="cancel_note" type="text" maxLength="255" minLength="0" placeholder="" onChange={handleChange} />
                                <label>{t("mobile_order_detail:more_info")} ({t("mobile_order_detail:if_have")})</label>
                                <span className="focus-border"></span>
                            </div>


                            <div className="info-creditcard-100 mt-4">
                                <div className="d-flex">
                                    <CustomInput type="checkbox" name="accept_cancel" id="accept_cancel" value="1" defaultChecked={chk == 1} className="my-auto" required onChange={handleChangeRadio} />
                                    <p className="p-12 my-auto">{t("mobile_translations:read_understood")} {t("mobile_translations:privacy_policy")}</p>
                                </div>
                                <button type="submit" className="btn btn-pink-submit mt-5 h-40px"><h4 className="text-white m-auto">{t("mobile_translations:send_form")}</h4></button>
                                <div className="footer-space"></div>
                            </div>
                        </form>
                    </div>


                </div>
                <div className={classNames("modals-confirm-cancel-area", { "show": confirmcancel })}>
                    <div className="modals-confirm-cancel">
                        <div className="d-flex">
                            <img className="img-fluid m-auto" src="/mobile/image/icon/Attention.svg" />
                        </div>
                        <p className="text-black text-center mt-2">{t("mobile_order_detail:want_cancel_order")}?</p>
                        <div className="btn-modals-confirm-cancel-area">
                            <h4 className="m-auto text-pink" onClick={closeconfirmcancel}>{t("mobile_translations:cancel")}</h4>
                            <div className="btn-line-cancel"></div>
                            <h4 className="m-auto text-pink" onClick={saveCancel}>{t("mobile_translations:confirm")}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default withTranslation('mobile_order_detail')(CancelOrder);