import React, {Component} from 'react'
import AuthService from './AuthService'
import Router from 'next/router'
import Head from 'next/head'
import api from './api'
import Loading from '../components/loading'
//import Layout from '../components/layout'
//router = useRouter()
//const UserContext = React.createContext('light');
export default function withAuth(Page) {
    
    return class Authenticated extends Component {
      
      constructor(props) {
        super(props)
        this.state = {
          isLoading: true,
          user : null,
        };
      }
      // static getInitialProps(ctx) {
      //   if(Page.getInitialProps)
      //     return Page.getInitialProps(ctx);
      //   //return this.getInitialProps(ctx);
      // }
      componentDidMount () {
        // if (!AuthService.isLoggin()) {
        //     Router.push('/login')
        // }
        const user = AuthService.getProfile();
        this.setState({ isLoading: false ,user})
      }

      render() {
        return (
          <>
           <Head>
            <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
            <title>{this.props.title? this.props.title : 'Home'}</title>
            <link rel='icon' href='/favicon.ico' />
            <link href="https://fonts.googleapis.com/css?family=Kanit:400,700|Montserrat:400,700&display=swap" rel="stylesheet"/>
            <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossOrigin="anonymous"></script>
            <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js" ></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
            <link rel="stylesheet" href={`${api.frontend_url}/css/bootstrap.css`}/>
            <link rel="stylesheet" href={`${api.frontend_url}/css/main.css`}/>
            <link rel="stylesheet" href={`${api.frontend_url}/css/style.css`}/>
            <link rel="stylesheet" href={`${api.frontend_url}/css/style_laptop.css`}/>
            <link rel="stylesheet" href={`${api.frontend_url}/css/style_ipad_landscape.css`}/>
            <link rel="stylesheet" href={`${api.frontend_url}/css/style_ipad_portrait.css`}/>
            <link rel="stylesheet" href={`${api.frontend_url}/css/style_mobile.css`}/>
          </Head>
          {this.state.isLoading ?

              <Loading/>
             : 
              <Page {...this.props}  user={this.state.isLoading} />
          }
          
          </>
        )
      }
    }
}