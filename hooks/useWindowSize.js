import {useEffect,useState} from 'react'
function useWindowSize() {
  const isClient = typeof window === 'object';
  const [windowSize, setWindowSize] = useState(getSize);
  

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }
  
  useEffect(() => {
    if (!isClient) {
      return false;
    }
    function handleResize() {
      setWindowSize(getSize());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  var device = windowSize.width > 767 ? 'desktop' :'mobile';
  return {...windowSize,device};
}

export default useWindowSize