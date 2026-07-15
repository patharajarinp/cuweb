import React from 'react';
import { withTranslation } from "../utils/i18n";

const HomePage = (props) => {
  
  return (
    <>
    
      
    </>
  )
}

HomePage.getInitialProps = async ({ query, pathname, req, local, res }) => {
  res.redirect("/")
}
export default HomePage

