import {useEffect} from 'react'
import LoadingLine from 'react-top-loading-bar';
import Router from 'next/router'
// import api from '../utils/api'
const LoadingBar = () =>{
    let loadBar;
    useEffect(()=>{

        const pageLoadStart = url => {
            
            loadBar.continuousStart()
        }
        const pageLoadEnd = url => {
            loadBar.complete()
        }
        Router.events.on('routeChangeStart', pageLoadStart)
        Router.events.on("routeChangeComplete", pageLoadEnd)
        return () => {
          Router.events.off('routeChangeStart', pageLoadStart)
          Router.events.off("routeChangeComplete", pageLoadEnd)
        }
    
      },[])

    

    return (
        <LoadingLine
        height={3}
        color='#f11946'
        onRef={ref => (loadBar = ref)}
      />
    )

}

export default LoadingBar