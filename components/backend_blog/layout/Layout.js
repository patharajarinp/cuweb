
import React, { useState,useEffect,useContext,useRef } from 'react'
import Head from 'next/head'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import api from '../../../utils/api'
// import Loading from '../LoadingBar'
// import ActiveShop from '../dashboard/ActiveShop'
// import '@trendmicro/react-sidenav/dist/react-sidenav.css';
const Layout = (props) => {
  const {title, loading, children, isHome, isLoggin, page_name,page_name2, isSubmenu,page_link,blogRegis} = props;

  return (
    <>
      <Head>
        <title>{title ? title : 'Home'}</title>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>

        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css" rel="stylesheet"></link>
        <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        {/* <script src="/js/jquery.autocomplete.min.js"></script> */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossOrigin="anonymous"></script>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js" ></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossOrigin="anonymous"></script>
        <link rel="stylesheet" href={`${api.frontend_url}/css/bootstrap.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/datetime.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/font.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/backend_blog/main.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/backend_blog/style.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/style_laptop.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/style_ipad_landscape.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/style_ipad_portrait.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/style_mobile.css`}/>
        
        <link rel="stylesheet" href={`${api.frontend_url}/css/shimmer.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/blog.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/backend_blog/input_tags.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/backend_blog/blog.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/backend_blog/editor_style.css`}/>
        <link rel="stylesheet" href={`${api.frontend_url}/css/backend_blog/react-sidenav.css`}/>
        <script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>
      </Head>
      
      <Header isHome={isHome} isLoggin={isLoggin} page_name2={page_name2} page_name={page_name} isSubmenu={isSubmenu} page_link={page_link} blogRegis={blogRegis} />
      <div className='main-layout'>
        {/* {loading && <Loading />} */}
        {children}

        {/* <ActiveShop /> */}
      </div>
      <Footer/>
    </>
  )
}

export default Layout