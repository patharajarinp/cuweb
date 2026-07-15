import React from 'react';

const LoadingMobile = () => {
 const loadingStyle = {
  position: 'fixed',
  backgroundColor: '#B2B2B2',
  opacity: 1,
  width: "100vw",
  height: "100vh",
  zIndex: 11,
  top: 0,
  left: 0,
 };

 const loadingAnimate = {
  position: 'fixed',
  float: 'left',
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 12,
 };



 const keyframes = `
    @keyframes loading {
      0% {
        transform: translateX(-100%);
      }
      50% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `;

 // Inject keyframes into the document head
 React.useEffect(() => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = keyframes;
  document.head.appendChild(styleSheet);

  // Clean up the effect to prevent memory leaks
  return () => {
   document.head.removeChild(styleSheet);
  };
 }, []);

 return <div style={loadingStyle}>
  <div style={loadingAnimate}>
   <img src="/icon/Cubook-Loading.gif" />
  </div>
 </div>;
};

export default LoadingMobile;
