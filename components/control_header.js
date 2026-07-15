import {useMergeState} from '../utils/state_tools'
import { useEffect ,memo} from 'react'
import Header from './layout/header'
import ScrollHeader from './layout/ScrollHeader'

const ControlHeader = memo(({isBanner = true,isScrollNav = true, isPreview = false, cateData}) => {
	const [scrollAction,setScrollAction] = useMergeState({
		isOnTop:true,
		visible:true,
	})

	var prevScrollpos = 0;
	const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const isOnTop = currentScrollPos <= 168;
    const visible = currentScrollPos < 168 || prevScrollpos > currentScrollPos;

    if(scrollAction.isOnTop != isOnTop || scrollAction.visible != visible)
    	setScrollAction({isOnTop,visible})
  	prevScrollpos = window.pageYOffset;
  }

  useEffect(()=>{
  	prevScrollpos = window.pageYOffset;
    document.addEventListener("scroll", handleScroll);
    return function cleanup(){
      document.removeEventListener("scroll", handleScroll);
    }
  },[handleScroll])

	return (
		<>
      <Header isBanner={isBanner} scroll={scrollAction.visible} 
      current={scrollAction.isOnTop ? "translateY(0)" : "translateY(-39px)"}
      isPreview={isPreview} cateData={cateData} />
      {
        isScrollNav && <ScrollHeader scroll={scrollAction.visible} isPreview={isPreview}  />
      }
		</>
	)
})

export default ControlHeader