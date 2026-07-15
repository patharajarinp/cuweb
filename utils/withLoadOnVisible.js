import {useEffect,useState,useRef} from 'react'
function withLoadOnVisible (WrappedComponent ){
  
  const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

    );
}


  
  return function (props)  {
    const ref = useRef(null);
    const [visible,setVisible] = useState(false)

    useEffect(() => {
      const loadData = () =>{
        if(ref.current && isInViewport(ref.current)){
          // console.log('In viewport')
          setVisible(true)
          // doFetch(loadData)
        }
        
      }
      loadData()

      document.addEventListener('scroll', loadData, {passive: true});
      return () => {
        // console.log('withLoadonVisible is destroyed')
        document.removeEventListener('scroll',loadData)
      };
    }, []);

    if(!visible) return (
      <div ref={ref}>
        <WrappedComponent visible={visible} {...props} />
      </div>
    )

    return (
      <WrappedComponent visible={visible} {...props} />
 
    )


}

}

export default withLoadOnVisible;