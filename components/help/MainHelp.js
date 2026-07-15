
import React from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import Static_nav from '../layout/static_nav';
import MobileMainContact from '../mobile/help/MobileMainContact';
import Static from '../widget/static';

const MainHelp = (props) => {
  const {t, key_val : key, subkey, content, local, setLodding, loading} = props;

  const isMobile = useMediaQuery(992);
 
  return (
    <>
      {
        !isMobile ? (
          <>
            {
              (key == "help" || key == "about" || key == "contact" || key == "privacy_policy") && (
                <div className="row static-page-start">
                  <Static_nav page={key} subkey={subkey} content={content} local={local} />
                  <Static page={key} subkey={subkey} content={content} local={local} setLodding={setLodding} loading={loading} />
                </div>
              ) 
            }
          </>
        ) : (
          <MobileMainContact 
            t={t}
            key_val={key} 
            subkey={subkey} content={content} local={local} 
            setLodding={setLodding} loading={loading}
          />
        )
      }
      
    </>
  )
}
export default MainHelp