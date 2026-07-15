import React,{useState} from 'react'
import classNames  from 'classnames';


const Product = ({t, product: val}) => {
  if(!val) return null;
  
  return (
    <>
      <div className="col-2 mt-3">
        <div className="img-detail">
          <img src={val.product.picture ? val.product.picture : '/images/book.png'} className="mh-100" />
        </div>
      </div>
      <div className="pl-3 text-book-detail col-4">
        <p className="mb-0 p-medium">{val.product.name}</p>
        <p className="mb-0">{t('quantity')} : {val.quantity}</p>
        <div className="d-flex align-items-center">
          <div className={classNames("tag-cat ",{"tag-book":(val.product.type == 'book') ,"tag-stationary":(val.product.type == 'non_book'),"tag-ebook": (val.product.type == 'ebook'),"tag-course": (val.product.type == 'course')})}>{(val.product.type == 'book') ? t('header:book_menu')  :  val.product.type == 'non_book' ? t('header:stationary') : val.product.type == 'ebook' ? t('header:e_book') :val.product.type == 'course' && t('header:course_online')}</div>
          {!!val.product.is_preorder && <div className={classNames("tag-cat px-3")} style={{backgroundColor : '#DE5C6E'}}>Preorder</div> } 
        </div>
      </div>
      <div className="col-6"></div>
    </>
  )
}
export default Product
    