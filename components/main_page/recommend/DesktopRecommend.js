import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Paginate from 'react-paginate';
import Banner from '../../../components/banner';
import { CardGrid } from '../../../components/widget/card';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';

const DesktopRecommend = (props) => {
  const {t, query, loading, setLoading} = props;
  const [productType, setProductType] = useState();
  const [img, setImg] = useState();
  const { text, field } = query;
  const [book, setBook] = useState();
  const [recommend, setRecommend] = useState();
  const {local, setLocal } = useContext(UserContext)

  const router = useRouter();
  const key = router.query.key;

  const fetchPage = () => {
    var page = key;
    var vendor = 'cu';
    api.getBanner(page, vendor).then(res => {
      const data = res.data;
      console.log(data)
      setProductType(data.type);
      setImg(data.banner_images);
    })
      .catch(err => {
        console.log(err.response);
      })
  } 

  const LIMIT = 20;
  const fetchBook = (params) => {
    setLoading(true);
    params.page = params.page || 1;
    params.limit = params.limit || LIMIT;
    api.getRecProductByKey(key, params).then(res => {
      const data = res.data;
      setBook(data);
      setPageCount(Math.ceil(data.count / LIMIT));
      setLoading(false);

    })
      .catch(err => {
        setLoading(false);
        console.log(err.response);
      })
  };

 
  const fetchRecommend = () => {
    api.getRecByKey(key).then(res => {
      const data = res.data;
      setRecommend(data);
   
    })
      .catch(err => {
        console.log(err.response);
      })
  };



  useEffect(() => {
    fetchRecommend();
    fetchPage();
    fetchBook({});
    if(document.getElementsByClassName('main-layout')[0]){
      document.getElementsByClassName('main-layout')[0].style.backgroundColor = "#FFFFFF";
    }
  }, []);


 

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



  const [pageCount,setPageCount] = useState(1)
  const [pageNumber, setPagenumber] = useState(0);

  const handlePageClick = data=>{
    let selected = data.selected;
    setPagenumber(selected);
    window.scrollTo(0, 0);
    fetchBook({page:selected+1});
  }


  return (
    <>
      <Head>
        <title>{`${recommend ? (recommend['name_'+local] || recommend.name_th) : 'สินค้าแนะนำ'} | ศูนย์หนังสือจุฬาฯ`}</title>
      </Head>
      <div className="container">
        <div className="row">
          <Banner data={img} type={productType} />
        </div>
        <div className="row my-5">
          <div className="col-12">
            <div className="text-center">
              <h2>{recommend && (recommend['name_'+local] || recommend.name_th)}</h2>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          {
            book ? book.rows.map(size.width < 992 ? ((product) => <CardGrid key={product.id} product={product} new_padding={true} show={3} />):((product) => <CardGrid key={product.id}  product={product} new_padding={true} show={4} />)) : ''
          }
        </div>
        {book && !!book.count  && (
        <div className="row w-100 mx-0 px-0 pb-5 border-bottom">
          <div className="col-12 px-0">
            <div className="float-right page-order">
              <Paginate
                previousLabel={t('translations:prev')}
                nextLabel={t('translations:next')}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                forcePage={pageNumber}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              />
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  )
}
export default DesktopRecommend