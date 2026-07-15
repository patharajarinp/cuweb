import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Loading from '../components/loading'
import LoadingMobile from '../components/LodingMobile'
import api from '../utils/api'
import { withTranslation } from '../utils/i18n'
import ControlHeader from './control_header'
import Footer from './layout/footer'
import useWindowSize from '../hooks/useWindowSize'
import useMediaQuery from '../hooks/useMediaQuery'
import MobileNav from './mobile/layout/mainNav'
import MobileFooter from './mobile/layout/Footer'

const Layout = (props) => {
  const { isBanner = false, isPreview = false, title, t, children,
    active, show, isFooter, loading: page_load, cateData } = props;
  const [loading, setLoading] = useState(true);
  const [prevScrollpos, setPrevScrollpos] = useState(0);
  const [cssLoaded, setCssLoaded] = useState(true);
  useEffect(() => {
    setPrevScrollpos(window.pageYOffset);
    setLoading(false);

    var path = window.location.pathname;

    if (!path) return;
    if (path === '/th' || path === '/en') {
      path = '/';
    }
    if (path) {
      path = path.replace(/\/th|\/en/g, '');
    }
    const regex = /user/;
    const regex_product = /product-details/;

    if (regex_product.test(path)) {
      const path1 = '/product-details/' + path.split('/product-details/')[1].split('-')[0];
      path = path1;
    }
    if (regex.test(path)) return;
    // console.log('path', path);
    api
      .sendPageStat(path)
      .then(() => { })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  const isMobile = useMediaQuery(992);

  useEffect(() => {
    const handlePrint = () => {
      const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
      linkTags.forEach((linkTag) => {
        linkTag.setAttribute('media', 'print');
      });
    };

    window.addEventListener('beforeprint', handlePrint);

    return () => {
      window.removeEventListener('beforeprint', handlePrint);
    };
  }, []);
  useEffect(() => {
    if (isMobile) {
      const mobileElement = document.querySelector('.chk_load_mobile');
      if (mobileElement) {
        const computedStyle = getComputedStyle(mobileElement);

        setTimeout(() => {
          console.log("Delayed for 4 second.");
          setCssLoaded(false);
        }, 0);
        // Perform any additional logic based on the loaded styles
      }
    }
  }, [isMobile]);

  // CSS Loading checker



  return (
    <>
      <Head>
        <title>{String(title || 'Home')}</title>
        <link rel="icon" href={`${api.frontend_url}/favicon.ico`} type="image/x-icon" />
        {/* <meta name="language" content="English" /> */}
        {/* <meta httpEquiv="content-language" content="en" /> */}
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css" rel="stylesheet"></link>
        <link async rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link async rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        <script src={`${api.frontend_url}/js/jquery-3.4.1.min.js`}></script>

        <script src={`${api.frontend_url}/js/popper.min.js`}></script>
        <script type="text/javascript" src={`${api.frontend_url}/js/jquery-ui.min.js`} ></script>
        <script src={`${api.frontend_url}/js/bootstrap.min.js`} ></script>
        <script src={`${api.frontend_url}/js/lottie-player.js`}></script>

        <meta name="facebook-domain-verification" content="8v2lzq8gw27fxcz0px4hwwn4yh9z8s" />


        {/* {
          !isMobile ? (
            <> */}
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/bootstrap.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/datetime.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/font.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/main.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/product.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/style.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/style_laptop.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/style_ipad_landscape.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/style_ipad_portrait.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/style_mobile.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/shimmer.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/blog.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/blog-edittor.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (min-width: 992px)" href={`${api.frontend_url}/css/marketplace/shop_slide.css`} />
        {/* </>
          ) : (
            <> */}
        <link async rel="stylesheet" type="text/css" media="screen and (max-width: 991px)" href={`${api.frontend_url}/mobile/css/bootstrap.min.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (max-width: 991px)" href={`${api.frontend_url}/mobile/css/cart.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (max-width: 991px)" href={`${api.frontend_url}/mobile/css/dashboard.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (max-width: 991px)" href={`${api.frontend_url}/mobile/css/datetime.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (max-width: 991px)" href={`${api.frontend_url}/mobile/css/font.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (max-width: 991px)" href={`${api.frontend_url}/mobile/css/home.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (max-width: 991px)" href={`${api.frontend_url}/mobile/css/order.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (max-width: 991px)" href={`${api.frontend_url}/mobile/css/product.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (max-width: 991px)" href={`${api.frontend_url}/mobile/css/blog.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (max-width: 991px)" href={`${api.frontend_url}/mobile/css/blog-edittor.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (max-width: 991px)" href={`${api.frontend_url}/mobile/css/change.css`} />
        <link async rel="stylesheet" type="text/css" media="screen and (max-width: 991px)" href={`${api.frontend_url}/mobile/css/seller.css`} />
        {/* </>
          )
        } */}


        <script defer src={`${api.frontend_url}/js/masonry.pkgd.min.js`}></script>
        <meta property="fb:app_id" content="215297538010306" />

        {/* <noscript>
          <img height="1" width="1" src="https://www.facebook.com/tr?id=545722546472856&ev=PageView&noscript=1" />
      </noscript> */}
        <script dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '545722546472856');
            fbq('track', 'PageView');
          `
        }} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2NLL4XNRRL"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-2NLL4XNRRL');
          
          `
        }} />

      </Head>
      <noscript>
          <img height="1" width="1" src="https://www.facebook.com/tr?id=545722546472856&ev=PageView&noscript=1" />
      </noscript>
      
      {(isMobile && cssLoaded) && <LoadingMobile />}

      {(loading || page_load) && <Loading />}
      {/* <Loading /> */}
      {
        !isMobile ? (
          <>
            <ControlHeader isBanner={isBanner} isScrollNav={!title || title != "Products | Detail"} isPreview={isPreview} cateData={cateData} />
            <div className={`${isMobile ? 'mobile-style' : ''} main-layout ${isPreview ? 'main-preview' : ''}`}>
              {children}
            </div>
            <Footer isPreview={isPreview} />
          </>
        ) : (
          <>
            <div>
              <MobileNav active={active} show={show} />
              {children}
            </div>
            {
              isFooter &&
              <div className="space-for-nav">
                <MobileFooter t={t} />
              </div>

            }
          </>
        )
      }







    </>
  );
};

export default withTranslation()(Layout);
