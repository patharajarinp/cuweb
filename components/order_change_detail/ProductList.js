import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import tools from '../../utils/tools';

const ProductList = ({changes : val, t}) => {
  

  return (
   <>
   {
      val && (
        <>
          <div className="mt-4 d-flex justify-content-between align-items-center">
            <div className="img-detail">
              <img src={val.product.picture ? val.product.picture : '/images/book.png'} className="mh-100" />
            </div>
            <div className="pl-3 text-book-detail">
              <p className="mb-0 p-medium">{val.product.name}</p>
              <p className="mb-0">{val.product.author}</p>
              <div className="d-flex align-items-center">
                <div className={classNames("tag-cat ",{"tag-book":(val.product.item_code == 10000|| val.product.item_code == 20000) ,"tag-stationary":(val.product.item_code == 30000),"tag-ebook": (val.product.item_code == null)})}>{(val.product.item_code == 10000 || val.product.item_code == 20000 ) ? t('header:book_menu')  :  val.product.item_code == 30000 ? t('header:stationary') : val.product.item_code == null && t('header:e_book') }</div>
                {!!val.product.is_preorder && <div className={classNames("tag-cat px-3")} style={{backgroundColor : '#DE5C6E'}}>Preorder</div> } 
              </div>
            </div>
            <div className="pl-3 text-price-detail">
              <p className="mb-0 text-pink font-weight-bold">฿ {tools.currencyFormatDE(val.product.cover_price)}</p>
            </div>
            <div className="pl-3">
              <p className="mb-0">{t('quantity')} :  <font>{val.quantity}</font></p>
            </div>
          </div>
        </>
      )
    }
   </>
  )
}

export default ProductList