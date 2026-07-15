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
          <div className={classNames("tag-cat ",{"tag-book":(val.product.item_code == 10000|| val.product.item_code == 20000) ,"tag-stationary":(val.product.item_code == 30000),"tag-ebook": (val.product.item_code == null)})}>{(val.product.item_code == 10000 || val.product.item_code == 20000 ) ? t('header:book_menu')  :  val.product.item_code == 30000 ? t('header:stationary') : val.product.item_code == null && t('header:e_book') }</div>
          {!!val.product.is_preorder && <div className={classNames("tag-cat px-3")} style={{backgroundColor : '#DE5C6E'}}>Preorder</div> } 
        </div>
      </div>
      <div className="col-6"></div>
    </>
  )
}
export default Product
    