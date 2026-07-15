import React,{useEffect,useState} from 'react'
import Layout from '../../../../components/layout'
import { Link } from '../../../../utils/i18n'
import { useRouter } from 'next/router'
import CardGrid from '../../../../components/mobile/widget/Card';
import api from '../../../../utils/api';
import InfiniteScroll from 'react-infinite-scroller';
import BeatLoader from "react-spinners/BeatLoader";

const MobileMainRelated = (props) => {
  const { t } = props;

  const [book, setBook] = useState()
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const id = router.query.blogid
  const hasMore = !book ? true : (book.rows.length < book.count);
  const fetchBook = (params) => {
    params.page=params.page||1
    api.blogProductGet(id,20,{...params}).then(res =>{
        const data = res.data;
    
        let tmp;
        if (book) {
            tmp = { ...book };
            const { rows } = tmp;
            tmp.rows = [...rows, ...data.rows];
        }
        else {
            tmp = data;
        }
      
        setLoading(false)
        setBook(tmp);
        // console.log('data', data)
    })
    .catch(err =>{
        setLoading(false)
      console.log(err.response);
    })
  };
	useEffect(() => {
		fetchBook({})
	}, [])
	const loadFunc = (page) => {
		setLoading(true)
		fetchBook({ page })
  
  }

  return (
    <>
      <div className="cart-nav">
          <div className=" text-center cart-nav-title">
              <h4>สินค้าที่เกี่ยวข้อง</h4>
          </div>
          <Link href={`/blog/[blogid]?blogid=${id}`} as={`/blog/${id}`} >
              <a className="btn-back cart-nav-back">
              <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
              </a>
          </Link>
      </div>
      <div className="bg-light-less-gray min-vh-100 ">
          <div className="h-64px"></div>
          <InfiniteScroll
              pageStart={1}
              loadMore={loadFunc}
              hasMore={!loading && hasMore}
              initialLoad={false}

          >
              <div className="all-card-news ">
                  <div className="container  py-3">
                      <div className="d-flex justify-content-between flex-wrap p-2">
                          {
                              (book && book.count > 0) && book.rows.map((val, index) => (
                                  
                                <CardGrid product={val.product}  show={2} _class="my-2" key={index}/>
                                  
                              ))
                          }
                      </div>
                  </div>
              </div>
          </InfiniteScroll>
          <div className="text-center mt-3" key="loader"><BeatLoader color={"#e9c869"} loading={loading} /></div>
          <div className="h-64px"></div>
      </div>
    </>
  )
}


export default MobileMainRelated