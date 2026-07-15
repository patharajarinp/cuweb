import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';
const Private = (props) => {

  const [content, setContent] = useState();
  const [one, setOne] = useState();

  const router = useRouter();
  const key = 'privacy_policy'
  const subkey = router.query.key


  const fechData = () => {
    api.getAllContent({key, subkey}).then(res =>{
      const data = res.data;
      ;
      setContent(data);
    })
    .catch(err =>{
      console.log(err);
    })
  }

  const fechOne = () => {
    api.getCustompageOne(subkey).then(res =>{
      const data = res.data;
      ;
      setOne(data);
    })
    .catch(err =>{
      console.log(err);
    })
  }
  

  useEffect(() => {
    fechData();
    fechOne();
  },[]);

  return (
    <>
    {
      content ? content.map((val, index) => (
        <div className="py-3 d-flex justify-content-between border-bottom" key={index}>
          <div className="my-auto">
            <h4 className="my-auto text-black">{val.title_th}</h4>
            <div className="row px-3 pt-3 pb-0">
            {
                <p className="p-12 mb-0 p-editor" dangerouslySetInnerHTML={{ __html: val.description_th }} />
            }
            </div>
            {/* <p className="text-publisher p-12 mb-0"> </p> */}
          </div>
        </div>
      )) : ''
    }
    </>
  )

}
export default Private