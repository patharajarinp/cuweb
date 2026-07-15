import {useState,useEffect,useContext} from 'react'
import Link from 'next/link'
import Router from 'next/router'
import api from '../../utils/api';
import UserContext from '../../contexts/UserContext';
import CardGrid from './widget/Card';
import InfiniteScroll from 'react-infinite-scroller';
import BeatLoader from "react-spinners/BeatLoader";

const ProductRelatedNews = (props)=>{

  const { local } = useContext(UserContext)
  const [news,setNews] = useState();
  const [products,setProducts] = useState();
  const [loading , setLoading] = useState(true)
  const {news_id,page_key} = props
  const limit = 12;

  console.log('news_id', news_id)
  
  const hasMore = !products ? true : (products.rows.length < products.count);
  useEffect(() => {
    // feachNews();
    fetchNewsBook();
  }, [news_id]);

  const feachNews = () => {

    api.getOneNews(news_id).then(res => {
      const data = res.data;
      // ;
      setNews(data);

    })
    .catch(err => {
      console.log(err);
    })
  }
  console.log('page_key', page_key)
  const fetchNewsBook = (page=1) => {
    setLoading(true)
    let apiAction = page_key == 'promotion' ? api.getProductPromotion : api.getNewsByID;
    console.log('apiAction', apiAction)

    apiAction(news_id,{limit,page }).then(res => {
      const data = res.data;
      
      // console.log('data', data)
      let tmp;
      if(products){
        tmp = {...products};
        const {rows} = tmp;
        tmp.rows = [...rows,...data.rows];
      }
      else{
        tmp = data;
      }
      setProducts(tmp);
      setLoading(false)
    })
    .catch(err => {
      console.log(err.response);
      setLoading(false)
    })
  };

  const loadFunc = (page)=>{
    //alert(page)
    // if(loading || !news || !hasMore) return;
    fetchNewsBook(page)
  }
  

  return (
    <>
      <div className="cart-nav">
        <div className=" text-center cart-nav-title d-flex">
          <h4 style={{
            whiteSpace:'nowrap',
            textOverflow:'ellipsis',
            width: '40%',
            overflow:'hidden',
            marginLeft:'23px',
            marginRight:'23px'
          }} > 
          {/* {news ? news['title_'+local] : '' }  */}
          </h4>
          
        </div>
        
          <a className="btn-back cart-nav-back" onClick={() => Router.back() }>
            <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
          </a>
       
      </div>

      {/* <div className="all-card-news mt-3">
        <div className="container d-flex flex-wrap justify-content-between ">
        {
            products && products.rows.map((product, index) => (
              <CardGrid product={product} show={4} _class={"my-2"} key={product.id} />
            ))
          }
        </div>
      </div> */}
      <div className="all-card-news mt-3">
      <InfiniteScroll
        pageStart={1}
        loadMore={loadFunc}
        hasMore={!loading && hasMore}
        initialLoad={false}>
        <div className="container d-flex flex-wrap justify-content-between ">
          {
              products && products.rows.map((product, index) => (
                <CardGrid product={product} show={4} _class={"my-2"} key={product.id} />
              ))
          }
        
        </div>
      </InfiniteScroll>
      <div className="text-center mt-3" key="loader"><BeatLoader color={"#EE5294"} loading={loading} /></div>
      </div>
      

          
    </>
  )
}

export default ProductRelatedNews