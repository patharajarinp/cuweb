import React,{useState,useEffect} from 'react'
import api from '../../../utils/api';
import Layout from '../../../components/layout';
import { useRouter } from 'next/router';
import { withTranslation } from '../../../utils/i18n';
import { CardGrid } from "../../../components/widget/card";
import Paginate from "react-paginate";

const MainRelated = (props) => {
  const { t } = props;
  const [book, setBook] = useState()
	const router = useRouter()
	const [pageCount,setPageCount] = useState(1)
	const [pageNumber, setPagenumber] = useState(0);
	const id = router.query.blogid
	const LIMIT = 20
	const fetchBook = (params) => {
			params.page=params.page||1
			api.blogProductGet(id,LIMIT,{...params}).then(res =>{
					const data = res.data;
					setBook(data);
					setPageCount(Math.ceil(data.count / LIMIT))
					// console.log('data', data)
			})
			.catch(err =>{
				console.log(err.response);
			})
		};
		useEffect(() => {
			fetchBook({})
		
		}, [])
		const handlePageClick = (data) => {
			let selected = data.selected;
			setPagenumber(selected);
			window.scrollTo(0, 0);
			

			fetchBook({page: selected + 1}) 

		
		};
    useEffect(() => {
      if(document.getElementsByClassName('main-layout')[0]){
        document.getElementsByClassName("main-layout")[0].style.backgroundColor = "rgb(248, 249, 250)";
      }
    },[]);
  return (
    <>
      <div className="container">
        <div className="row mt-3 pb-3">
          <div className="col-12">
            <h3 className="text-center">{t('related_products')}</h3>
          </div>
        </div>
        <div className="d-none d-xl-block">
          <div className="row">
            {book&& !!book.rows.length &&book.rows.map((val, index) => (
              <CardGrid product={val.product} key={val.product.id} classes={"pb-5  mb-6"} show={4} />
            ))}
          </div>
        </div>
        <div className="d-block d-xl-none">
          <div className="row ">
            {book&& !!book.rows.length &&book.rows.map((val, index) => (
              <CardGrid product={val.product} key={val.product.id} classes={"pb-5  mb-6"}  show={3} />
            ))}
          </div>
        </div>
        {pageCount > 1&&
        <div className="blog-pop d-flex justify-content-end">
          <Paginate
            previousLabel={t('back')}
            nextLabel={t('next')}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            forcePage={pageNumber}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </div>
        }
      </div>
        
    </>
  )
}


export default MainRelated