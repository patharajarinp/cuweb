import { useEffect, useState } from 'react';
import StaticNav from '../../components/layout/static_nav'
import Static from '../../components/widget/static'
import api from '../../utils/api'

const MainContact = (props) => {
  const {t, setLodding, loading} = props;
  const [content, setContent] = useState();
  const key = 'about'
  const subkey = 'branch'

  const fechData = () => {
    setLodding(true)
    api.getAllContent({key, subkey}).then(res =>{
      const data = res.data;
      
      setContent(data);
      setLodding(false)
    })
    .catch(err =>{
      setLodding(false)
      console.log(err);
    })
  }

  useEffect(() => {
    fechData();
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#FFFFFF";
    }
  },[]);
  
  return (
    <>
      <div className="container">
        <div className="row static-page-start">
          <StaticNav page="contact" subkey="contact" content={content} />
          <Static page="contact" subkey="contact" content={content} setLodding={setLodding} loading={loading} />
        </div>
      </div>
    </>
  )
}
export default MainContact