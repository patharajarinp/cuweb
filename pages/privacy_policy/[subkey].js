import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import MainHelp from '../../components/help/MainHelp';
import Layout from '../../components/layout';
import StaticNav from '../../components/layout/static_nav';
import MainDetail from '../../components/news/MainDetail';
import Static from '../../components/widget/static';
import UserContext from '../../contexts/UserContext';
import api from '../../utils/api';
import { withTranslation } from '../../utils/i18n';

const Page = (props) =>{
  const {t} = props;
  const [content, setContent] = useState();
  const [title, setTitle] = useState();
  const [loading, setLodding] = useState(false);

  const {local} = useContext(UserContext)
  const router = useRouter();
  const key = 'privacy_policy'
  const subkey = router.query.subkey

  const fechData = () => {
    
    api.getAllContent({key, subkey}).then(res =>{
      const data = res.data;
      
      setContent(data);
    })
    .catch(err =>{
      console.log(err);
    })
  }

  useEffect(() => {
    {
      if(key == "help") {
        setTitle('ช่วยเหลือ');
      }else if(key == "about") {
        setTitle('เกี่ยวกับเรา');
      }else if(key == "privacy_policy") {
        setTitle('นโยบายส่วนบุคคล');
      }else if(key == "contact") {
        setTitle('ติดต่อเรา');
      }else if(key == "news") {
        setTitle('ข่าวประชาสัมพันธ์');
      }else if(key == "activities") {
        setTitle('ภาพกิจกรรม');
      }else if(key == "procurement") {
        setTitle('ประกาศจัดซื้อจัดจ้าง');
      }else if(key == "promotion") {
        setTitle('โปรโมชั่น');
      }
    }

    fechData();
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#FFFFFF";
    }
  },[key, subkey]);


  return (
    <Layout title={`${title ? `${title}  | ศูนย์หนังสือจุฬาฯ` : 'ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย'}`} loading={loading}>
      <div className="container">
        <MainHelp
          t={t}
          key_val={key} 
          subkey={subkey} content={content} local={local} 
          setLodding={setLodding} loading={loading}
        />
        
      </div>
    </Layout>
  )
}

Page.getInitialProps = ({query}) => {
  return {query}; //has to be like an object
}
export default withTranslation('mobile_home','mobile_header','mobile_footer', 'mobile_translations','mobile_contact')(Page); 