import React from 'react';
import { withTranslation } from '../utils/i18n';
import Loading from './loading';


// import LoadingBar from './LoadingBar';
// import Loading from './loading'
//const UserContext = React.createContext();
class Forcoverpage extends React.Component {

  render() {
    
    // console.log(this.props.t('title'))
    //console.log(user)
    return (
      <>
         {this.props.loading && <Loading />}
       
          {this.props.children}
        

      </>
    )
  }
}
export default withTranslation()(Forcoverpage)
