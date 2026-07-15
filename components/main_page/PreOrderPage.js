import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Banner from '../../components/banner';
import Layout from '../../components/layout';
import { CardGrid } from '../../components/widget/card';
import api from '../../utils/api';
import { withTranslation } from '../../utils/i18n';

const PreOrderPage = (props) => {
  const {t, query} = props;
  const [productType, setProductType] = useState();
  const [img, setImg] = useState();
  const {text,field} = query;
  const [book, setBook] = useState();
  const [recommend, setRecommend] = useState();

  const router = useRouter();
  const key = 'pre-order';

  const fetchPage = () => {
    var page = key;
    var vendor = 'cu';
    api.getBanner(page, vendor).then(res =>{
      const data = res.data;
      setProductType(data.type);
      setImg(data.banner_images);
    })
    .catch(err =>{
      console.log(err.response);
    })
  }

  const fetchBook = () => {
    api.getProducts({preorder : 1}).then(res =>{
        const data = res.data;
        setBook(data);
        // console.log(data);
    })
    .catch(err =>{
      console.log(err.response);
    })
  };

  // console.log(key);
  const fetchRecommend = () => {
    api.getRecByKey(key).then(res =>{
        const data = res.data;
        setRecommend(data);
     
    })
    .catch(err =>{
      console.log(err.response);
    })
  };



  useEffect(() => {
    fetchRecommend();
    fetchPage();
    fetchBook();
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#FFFFFF";
    }
  },[]);


  function useWindowSize() {
    const isClient = typeof window === 'object';

    function getSize() {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
      };
    }

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
      if (!isClient) {
        return false;
      }

      function handleResize() {
        setWindowSize(getSize());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return windowSize;
  }
  const size = useWindowSize();

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Banner data={img} type={productType} />
          </div>
        </div>
        <div className="row my-5">
          <div className="col-12">
            <div className="text-center">
              <h2>{t('translations:pre_order')}</h2>
            </div>
          </div>
        </div>
        <div className="row mt-5 ">
          {
            book ? (size.width < 1200 ? ( book.rows.map((product) => <CardGrid new_padding={true} show={3} classes="mb-5" />)) :  (book.rows.map((product) => <CardGrid product={product} show={4} new_padding={true} />))) : ''
          }
        </div>
      </div>
      <div className="end-page"></div>
    </>
  )
}
export default PreOrderPage