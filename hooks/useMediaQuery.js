// @src/hooks/useMediaQuery.js
import { useEffect, useState } from "react";

const useMediaQuery = (minWidth) => {
  const isClient = typeof window === 'object';

  const [state, setState] = useState({
    windowWidth: isClient ? window.innerWidth : undefined,
    isDesiredWidth: false,
  });

  useEffect(() => {
    const currentWindowWidth = isClient ? window.innerWidth : undefined;
    const isDesiredWidth = currentWindowWidth < minWidth;
    setState({ windowWidth: currentWindowWidth, isDesiredWidth });
  }, [])

  useEffect(() => {
    const resizeHandler = () => {
      const currentWindowWidth = isClient ? window.innerWidth : undefined;
      const isDesiredWidth = currentWindowWidth < minWidth;
      setState({ windowWidth: currentWindowWidth, isDesiredWidth });
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [state.windowWidth]);

  return state.isDesiredWidth;
};

export default useMediaQuery;