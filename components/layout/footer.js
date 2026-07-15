import  { memo, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import api from '../../utils/api';
import { Link, Trans, withTranslation } from "../../utils/i18n";
import Head from 'next/head'

const about_link = [
    { _key:"about", subkey:"history", label: 'about_us', class: 'font-weight-medium' },
    { _key:"about", subkey:"history", label: 'about_history' },
    { _key:"about", subkey:"community", label: 'about_community' },
    { _key:"about", subkey:"branch",label: 'about_branch' },
    { _key:"about", subkey:"dealer",label: 'about_dealer' },
].map(link => {
    link.key = `filed-link-${link.label}`
    link.href = '/about/[subkey]?subkey='+link.subkey
    link.as = `/about/${link.subkey}`
    return link
})

const help_link = [
    { _key:"help", subkey:"faq", label: 'help', class: 'font-weight-medium' },
    { _key:"help", subkey:"how_to_order", label: 'how_to_order' },
    { _key:"help", subkey:"method_of_payment", label: 'how_to_payment' },
    { _key:"help", subkey:"shipping", label: 'how_to_transpot' },
    { _key:"help", subkey:"product_cancel", label: 'how_to_return' },
    { _key:"help", subkey:"product_return", label: 'how_to_cancel' },
].map(link => {
    link.key = `filed-link-${link.label}`
    link.href = '/help/[subkey]?subkey='+link.subkey
    link.as = `/help/${link.subkey}`
    return link
})

const privacy_policy = [
    { _key:"privacy_policy", subkey:"privacy_policy", label: 'privacy_policy', class: 'font-weight-medium' },
    { _key:"privacy_policy", subkey:"condition", label: 'condition' },
].map(link => {
    link.key = `filed-link-${link.label}`
    link.href = '/privacy_policy/[subkey]?subkey='+link.subkey
    link.as = `/privacy_policy/${link.subkey}`
    return link
})

const contact_link = [
    { href: '/contact', label: 'contact', class: 'font-weight-medium' },
    { _key:"contact", subkey:"job_register", label: 'register' },
    { _key:"contact", subkey:"contact_dealer", label: 'contact_dealer' },
].map(link => {
    link.key = `filed-link-${link.label}`
    link.as = link.href ? link.href : `/contact/${link.subkey}`
    link.href = link.href ? link.href : '/contact/[subkey]?subkey='+link.subkey
    return link
})

const Footer = memo(props=>  {
    const { t, isPreview = false } = props;
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }

    const handleInsert = (event) => {
        const data = new FormData(event.target)
        event.preventDefault()
        api.insertSubcribe(data)
            .then(res => {
                const data = res.data;
                setShow(false);

            })
            .catch(err => {
                console.log(err.response);
            })
    }
  
    useEffect(() => {
        // if(!isPreview) {
            // var chatbox = document.getElementById('fb-customer-chat');
            // chatbox.setAttribute("page_id", "240453878505");
            // chatbox.setAttribute("attribution", "biz_inbox");
        // }
    }, [])


    return (
        <>
            {/* <Head>
               
                
            </Head> */}
           

            <footer className={`${isPreview ? 'd-none' : ''}`}>
                <div className="container footer">
                    <div className="row">
                        <div className="col-12">
                            <Link href='/'>
                                <a>
                                    <img src={`${api.frontend_url}/icon/logo.svg`} height="56" alt="ศูนย์หนังสือจุฬาฯ" />
                                </a>
                            </Link>

                        </div>
                    </div>
                    <div className="d-md-none d-lg-block">
                        <div className="row mt-5">
                            <div className="col-xl-3 col-md-4 col-sm-4 mt-3 mt-xl-0">
                                <Trans i18nKey="footer_detail" t={t}>
                                    <span className="font-weight-medium">
                                        ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย <br />
                                        ก่อตั้ง 18 มิถุนายน พ.ศ.2518 <br />
                                    </span>
                                    
                                </Trans>


                                <div className="mt-4" style={{ fontFamily: 'Kanit-all' }}>
                                    <a className="text-default" href="mailto:info@cubook.chula.ac.th">info@cubook.chula.ac.th</a><br></br>
                                    <a className="text-default" href="mailto:customer@cubook.chula.ac.th"> customer@cubook.chula.ac.th</a>
                                </div>
                            </div>
                            <div className="col-xl-2 col-md-2 col-sm-2 mt-3 mt-xl-0">
                                {
                                    about_link.map((link) =>
                                        <Link key={link.key} as={link.as} href={link.href}><a className={"nav-link p-0 " + (link.class && link.class)}>{t(link.label)}</a></Link>
                                    )
                                }
                            </div>
                            <div className="col-xl-2 col-md-2 col-sm-2 mt-3 mt-xl-0">
                                {
                                    help_link.map((link) =>
                                        <Link key={link.key} as={link.as} href={link.href}><a className={"nav-link p-0 " + (link.class && link.class)}>{t(link.label)}</a></Link>
                                    )
                                }
                            </div>
                            <div className="col-xl-3 col-md-2 col-sm-2 mt-3 mt-xl-0">
                                {
                                    privacy_policy.map((link) =>
                                        <Link key={link.key} as={link.as} href={link.href}><a className={"nav-link p-0 " + (link.class && link.class)}>{t(link.label)}</a></Link>
                                    )
                                }
                                <br />
                                {
                                    contact_link.map((link) =>
                                        <Link key={link.key} as={link.as} href={link.href}><a className={"nav-link p-0 " + (link.class && link.class)}>{t(link.label)}</a></Link>
                                    )
                                }
                            </div>
                            <div className="col-xl-2 col-md-2 mt-3 mt-xl-0">
                                <div className=" p-0 font-weight-medium">{t('social')}</div>
                                <div className="mt-4 d-flex align-items-center">
                                    <a href='https://www.facebook.com/cubook' target="_blank">
                                        {/* <img className="mr-4 mr-md-3 align-items-center" src={'/icon/fb.svg'} /> */}
                                        <svg className="mr-4 mr-md-3 align-items-center fb-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <g id="Group_8973" data-name="Group 8973" transform="translate(8756 4401)">
                                                <path id="Path_287" data-name="Path 287" d="M1131.5,338.065h-3.281v12.023h-4.972V338.065h-2.365v-4.227h2.365v-2.734c0-1.955.928-5.017,5.017-5.017l3.682.016v4.1h-2.671a1.012,1.012,0,0,0-1.055,1.151v2.488h3.717Z" transform="translate(-9870.884 -4727.088)" />
                                                <rect id="Rectangle_3316" data-name="Rectangle 3316" width="24" height="24" transform="translate(-8756 -4401)" fill="none" />
                                            </g>
                                        </svg>
                                    </a>
                                    <a href='https://twitter.com/Chulabook' target="_blank">
                                        {/* <img className="mr-4 mr-md-3" src={'/icon/tw.svg'} /> */}
                                        <svg className="mr-4 mr-md-3 align-items-center fb-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <g id="Group_8974" data-name="Group 8974" transform="translate(8703 4401)">
                                                <path id="Path_288" data-name="Path 288" d="M1207.9,332.1h0a9.989,9.989,0,0,1-2.456,2.548c.009.212.014.423.014.637a14,14,0,0,1-21.558,11.8,9.967,9.967,0,0,0,7.291-2.039,4.931,4.931,0,0,1-4.6-3.419,4.967,4.967,0,0,0,.927.088,4.892,4.892,0,0,0,1.3-.174,4.927,4.927,0,0,1-3.95-4.827v-.063a4.9,4.9,0,0,0,2.23.617,4.931,4.931,0,0,1-1.522-6.575,13.98,13.98,0,0,0,10.149,5.146,4.928,4.928,0,0,1,8.391-4.491,9.907,9.907,0,0,0,3.128-1.194,4.955,4.955,0,0,1-2.166,2.724A9.855,9.855,0,0,0,1207.9,332.1Z" transform="translate(-9886.898 -4729.144)" />
                                                <rect id="Rectangle_3315" data-name="Rectangle 3315" width="24" height="24" transform="translate(-8703 -4401)" fill="none" />
                                            </g>
                                        </svg>
                                    </a>
                                    <a href='https://www.instagram.com/chulabook/?hl=th' target="_blank">
                                        {/* <img className="mr-4 mr-md-3" src={'/icon/ig.svg'} /> */}
                                        <svg className="mr-4 mr-md-3 align-items-center fb-icon" id="Group_737" data-name="Group 737" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path id="Path_291" data-name="Path 291" d="M1277.883,340.349a4.192,4.192,0,1,0,4.194,4.191A4.2,4.2,0,0,0,1277.883,340.349Z" transform="translate(-1265.883 -332.54)" />
                                            <path id="Path_292" data-name="Path 292" d="M1277.4,326.111H1265.51a6.063,6.063,0,0,0-6.055,6.055v11.89a6.062,6.062,0,0,0,6.055,6.055H1277.4a6.06,6.06,0,0,0,6.053-6.055v-11.89A6.062,6.062,0,0,0,1277.4,326.111Zm-5.947,18.181a6.181,6.181,0,1,1,6.181-6.181A6.19,6.19,0,0,1,1271.455,344.292Zm6.381-11.085a1.463,1.463,0,1,1,1.463-1.462A1.463,1.463,0,0,1,1277.836,333.208Z" transform="translate(-1259.455 -326.111)" />
                                        </svg>
                                    </a>
                                    <a href='https://www.youtube.com/user/ChulabookCU' target="_blank">
                                        {/* <img className="" src={'/icon/yt.svg'} /> */}
                                        <svg className="mr-4 mr-md-3 align-items-center fb-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <g id="Group_8975" data-name="Group 8975" transform="translate(8588 4401)">
                                                <path id="Path_286" data-name="Path 286" d="M1431.4,333.371a3.005,3.005,0,0,0-2.122-2.122c-1.872-.5-9.377-.5-9.377-.5s-7.505,0-9.377.5a3.005,3.005,0,0,0-2.122,2.122,33.532,33.532,0,0,0,0,11.553,3.005,3.005,0,0,0,2.122,2.122c1.872.5,9.377.5,9.377.5s7.505,0,9.377-.5a3.005,3.005,0,0,0,2.122-2.122,33.524,33.524,0,0,0,0-11.553Zm-14.453,10.295V334.63l7.825,4.518Z" transform="translate(-9995.897 -4727.748)" />
                                                <rect id="Rectangle_3314" data-name="Rectangle 3314" width="24" height="24" transform="translate(-8588 -4401)" fill="none" />
                                            </g>
                                        </svg>
                                    </a>
                                </div>
                                <button className="btn btn-outline-primary mt-4" onClick={() => setShow(true)}><i className="fas fa-paper-plane mr-2"></i>{t('subscribe')}</button>
                            </div>
                        </div>
                    </div>
                    <div className="d-none d-md-block d-lg-none">
                        <div className="row mt-5">
                            <div className="col-xl-4 col-md-5 col-sm-4 mt-3 mt-xl-0">
                                <Trans i18nKey="footer:footer_detail" t={t}>
                                    <span className="font-weight-medium">
                                        ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย <br />
                                        ก่อตั้ง 18 มิถุนายน พ.ศ.2518 <br />
                                    </span>
                                </Trans>
                                {/* <span className="font-weight-medium">
                                    ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย <br />
                                    ก่อตั้ง 18 มิถุนายน พ.ศ.2518 <br />
                                </span>

                                <div className="flex-wrap">
                                    <Trans i18nKey="footer:footer_detail" >
                                        <div className="footer-detail"><br /></div>
                                    </Trans>
                                </div> */}

                                <div className="mt-2" style={{ fontFamily: 'Kanit-all' }}>
                                    <a className="text-default" href="mailto:info@cubook.chula.ac.th">info@cubook.chula.ac.th</a><br></br>
                                    <a className="text-default" href="mailto:customer@cubook.chula.ac.th"> customer@cubook.chula.ac.th</a>
                                </div>
                            </div>
                            <div className="col-md-1">
                            </div>
                            <div className="col-xl-2 col-md-3 col-sm-2 mt-3 mt-xl-0">
                                {
                                    about_link.map((link) =>
                                        <Link key={link.key} as={link.as} href={link.href}><a className={"nav-link p-0 " + (link.class && link.class)}>{t(link.label)}</a></Link>
                                    )
                                }
                                <br />
                                {
                                    privacy_policy.map((link) =>
                                        <Link key={link.key} as={link.as} href={link.href}><a className={"nav-link p-0 " + (link.class && link.class)}>{t(link.label)}</a></Link>
                                    )
                                }
                                <br />
                                {
                                    contact_link.map((link) =>
                                        <Link key={link.key} as={link.as} href={link.href}><a className={"nav-link p-0 " + (link.class && link.class)}>{t(link.label)}</a></Link>
                                    )
                                }
                            </div>
                            <div className="col-xl-2 col-md-3 col-sm-2 mt-3 mt-xl-0">
                                {
                                    help_link.map((link) =>
                                        <Link key={link.key} as={link.as} href={link.href}><a className={"nav-link p-0 " + (link.class && link.class)}>{t(link.label)}</a></Link>
                                    )
                                }
                                <br />
                                <div className=" p-0 font-weight-medium">{t('social')}</div>
                                <div className="mt-4 d-flex align-items-center">
                                    <a href='https://www.facebook.com/cubook' target="_blank">
                                        {/* <img className="mr-4 mr-md-3 align-items-center" src={'/icon/fb.svg'} /> */}
                                        <svg className="mr-4 mr-md-3 align-items-center fb-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <g id="Group_8973" data-name="Group 8973" transform="translate(8756 4401)">
                                                <path id="Path_287" data-name="Path 287" d="M1131.5,338.065h-3.281v12.023h-4.972V338.065h-2.365v-4.227h2.365v-2.734c0-1.955.928-5.017,5.017-5.017l3.682.016v4.1h-2.671a1.012,1.012,0,0,0-1.055,1.151v2.488h3.717Z" transform="translate(-9870.884 -4727.088)" />
                                                <rect id="Rectangle_3316" data-name="Rectangle 3316" width="24" height="24" transform="translate(-8756 -4401)" fill="none" />
                                            </g>
                                        </svg>
                                    </a>
                                    <a href='https://twitter.com/Chulabook' target="_blank">
                                        {/* <img className="mr-4 mr-md-3" src={'/icon/tw.svg'} /> */}
                                        <svg className="mr-4 mr-md-3 align-items-center fb-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <g id="Group_8974" data-name="Group 8974" transform="translate(8703 4401)">
                                                <path id="Path_288" data-name="Path 288" d="M1207.9,332.1h0a9.989,9.989,0,0,1-2.456,2.548c.009.212.014.423.014.637a14,14,0,0,1-21.558,11.8,9.967,9.967,0,0,0,7.291-2.039,4.931,4.931,0,0,1-4.6-3.419,4.967,4.967,0,0,0,.927.088,4.892,4.892,0,0,0,1.3-.174,4.927,4.927,0,0,1-3.95-4.827v-.063a4.9,4.9,0,0,0,2.23.617,4.931,4.931,0,0,1-1.522-6.575,13.98,13.98,0,0,0,10.149,5.146,4.928,4.928,0,0,1,8.391-4.491,9.907,9.907,0,0,0,3.128-1.194,4.955,4.955,0,0,1-2.166,2.724A9.855,9.855,0,0,0,1207.9,332.1Z" transform="translate(-9886.898 -4729.144)" />
                                                <rect id="Rectangle_3315" data-name="Rectangle 3315" width="24" height="24" transform="translate(-8703 -4401)" fill="none" />
                                            </g>
                                        </svg>
                                    </a>
                                    <a href='https://www.instagram.com/chulabook/?hl=th' target="_blank">
                                        {/* <img className="mr-4 mr-md-3" src={'/icon/ig.svg'} /> */}
                                        <svg className="mr-4 mr-md-3 align-items-center fb-icon" id="Group_737" data-name="Group 737" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path id="Path_291" data-name="Path 291" d="M1277.883,340.349a4.192,4.192,0,1,0,4.194,4.191A4.2,4.2,0,0,0,1277.883,340.349Z" transform="translate(-1265.883 -332.54)" />
                                            <path id="Path_292" data-name="Path 292" d="M1277.4,326.111H1265.51a6.063,6.063,0,0,0-6.055,6.055v11.89a6.062,6.062,0,0,0,6.055,6.055H1277.4a6.06,6.06,0,0,0,6.053-6.055v-11.89A6.062,6.062,0,0,0,1277.4,326.111Zm-5.947,18.181a6.181,6.181,0,1,1,6.181-6.181A6.19,6.19,0,0,1,1271.455,344.292Zm6.381-11.085a1.463,1.463,0,1,1,1.463-1.462A1.463,1.463,0,0,1,1277.836,333.208Z" transform="translate(-1259.455 -326.111)" />
                                        </svg>
                                    </a>
                                    <a href='https://www.youtube.com/user/ChulabookCU' target="_blank">
                                        {/* <img className="" src={'/icon/yt.svg'} /> */}
                                        <svg className="mr-4 mr-md-3 align-items-center fb-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <g id="Group_8975" data-name="Group 8975" transform="translate(8588 4401)">
                                                <path id="Path_286" data-name="Path 286" d="M1431.4,333.371a3.005,3.005,0,0,0-2.122-2.122c-1.872-.5-9.377-.5-9.377-.5s-7.505,0-9.377.5a3.005,3.005,0,0,0-2.122,2.122,33.532,33.532,0,0,0,0,11.553,3.005,3.005,0,0,0,2.122,2.122c1.872.5,9.377.5,9.377.5s7.505,0,9.377-.5a3.005,3.005,0,0,0,2.122-2.122,33.524,33.524,0,0,0,0-11.553Zm-14.453,10.295V334.63l7.825,4.518Z" transform="translate(-9995.897 -4727.748)" />
                                                <rect id="Rectangle_3314" data-name="Rectangle 3314" width="24" height="24" transform="translate(-8588 -4401)" fill="none" />
                                            </g>
                                        </svg>
                                    </a>
                                </div>
                                <button className="btn btn-outline-primary mt-4" onClick={() => setShow(true)}><i className="fas fa-paper-plane mr-2"></i>{t('subscribe')}</button>

                            </div>


                        </div>
                    </div>
                </div>

                <div className="footest py-4 container-fluid">
                    <div className="container ">
                        <div className="row align-items-center">
                            <div className="col-4">  
                                {t('about')} : <a className="text-default" href="tel:086-3233703-4">086-3233703-4</a> , <a className="text-default" href="tel:02-255-4433">02-255-4433</a>
                            </div>
                            <div className="col-4 copyright text-center">
                                Copyright © 2020 chulabook.com  All Rights Reserved.
                        </div>
                            <div className="col-4"></div>
                        </div>
                    </div>
                </div>
                <Modal className="modal-cart" centered show={show} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <div>
                            <Modal.Title className="d-flex"></Modal.Title>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <form id="promo-form" onSubmit={handleInsert} encType="multipart/form-data">
                            <div className="row">
                                <div className="col-12">
                                    <div className="text-center pt-2">
                                        <div>
                                            <img src={`${api.frontend_url}/icon/sub_scribe.svg`} alt="ศูนย์หนังสือจุฬาฯ" className="img-fluid" style={{ width: "40%" }} />
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="text-pink">{t('subscribe')}</h4>
                                        </div>
                                        <div className="mt-4  d-flex justify-content-center">
                                            <div className="form-group mb-4 text-left col-6">
                                                <label>{t('email')}<span className="text-pink">*</span></label>
                                                <input type="email" id="email" className="form-control" name="email" placeholder={t('enter_your_email')} required />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p>{t('read_understood')} <Link href="/privacy_policy/condition"><a className="text-success"><u>{t('modalprivacy_policy')}</u></a></Link></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 my-4">
                                    <div className="text-center">
                                        <button className="btn btn-outline-primary mr-3" type="button" onClick={handleClose}>{t('cancel')}</button>
                                        <button className="btn btn-primary" type="submit">{t('subscribe')}</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </footer>

        </>
    )
})

export default withTranslation(['footer'])(Footer)