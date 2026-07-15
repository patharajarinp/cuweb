import React, { useState,useEffect } from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';
import tools from '../../utils/tools';

const ProductList = ({order : val, pkg, t, type, selected, setSelected,success_date}) => {
  
  const handleChange = (e, product_id, quantity) => {
    var checked = e.target.checked;
    var tmp = [...selected];
    if(checked) {
      tmp.push({product_id, quantity});
    }else{
      var index = tmp.findIndex((val) => val.product_id == product_id);
      if(index != -1) {
        tmp.splice(index, 1);
      }
    }
    setSelected(tmp);
  }

  // const checkDisabled = !!val.promotion_id || !!val.return_qty || !!val.change_qty;

  const checkDisabled = () =>{
    if(success_date){
      let today = new Date();
      let _success_date = new Date(success_date)
      let can_return_date = new Date(_success_date)
      let can_change_date = new Date(_success_date)
      can_return_date.setDate(can_return_date.getDate() + val.return_in_days)
      can_change_date.setDate(can_change_date.getDate() + val.change_in_days)

      // console.log(_success_date)
      if(can_return_date  <= today && type == 1) return true;
  
      if(can_change_date  <= today && type == 2) return true;
    }
    


    
    return !!val.promotion_id || !!val.return_qty || !!val.change_qty;
  }
  const disabled = checkDisabled();
  // console.log('pkg', pkg);

  return (
   <>
   {
      val && (
        <>
          <div className={`row mx-0 position-relative px-4 py-3 align-items-center order-detail ${type != 0 && (disabled ? 'disabled' : '')}`}>
            {/* {val.product.id} */}
            {
              type != 0 ? (
                <div className={`form-group ${type != 0 && (disabled ? 'checkbox' : '')}`}>
                  <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id={`item${val.product.id}`} name="checked" value={val.product.id} disabled={type != 0 && disabled} onChange={(e) => handleChange(e, val.product.id, val.quantity)} />
                    <label className="custom-control-label" htmlFor={`item${val.product.id}`}>
                    
                    </label>
                  </div>
                </div>
              ) : ''
            }
            <div className="img-detail">
              <img src={val.product.picture ? val.product.picture : '/images/book.png'} className="mh-100" />
            </div>
            <div className="pl-3 text-book-detail">
              <p className="mb-0 p-medium">{val.product.name}</p>
              <p className="mb-0">{val.product.author}</p>
              <div className="d-flex align-items-center">
                <div className={classNames("tag-cat ",{"tag-book":(val.product.type == 'book') ,"tag-stationary":(val.product.type == 'non_book'),"tag-ebook": (val.product.type == 'ebook'),"tag-course": (val.product.type == 'course')})}>{(val.product.type == 'book' ) ? t('header:book_menu')  :  val.product.type == 'non_book' ? t('header:stationary') : val.product.type == 'ebook' ? t('header:e_book') :val.product.type == 'course' && t('header:course_online') }</div>
                {!!val.product.is_preorder && <div className={classNames("tag-cat px-3")} style={{backgroundColor : '#DE5C6E'}}>Preorder</div> } 
              </div>
            </div>
            <div className="pl-3 text-price-detail">
              <p className="mb-0 text-pink font-weight-bold">฿ {tools.currencyFormatDE(val.product.cover_price)}</p>
            </div>
            <div className="pl-3">
              {
                val.product.type != "course" ? (
                  <p className="mb-0">{t('quantity')} :  <font>{val.quantity}</font></p>
                ) : (
                  <>
                    {
                      pkg.status >= 2 && (
                      <div className='d-flex justify-content-end'>
                        <div className='text-right'>
                          <div>เรียนคอร์สออนไลน์</div>
                          <a target="_blank" href={`${api.course_url}/courses/${val.product.course_id}`}><button className='btn btn-course btn-course-auto'>คลิกที่นี่</button></a>
                          <div><span className='font-14'>วิธีการเข้าเรียนคอร์สออนไลน์ <a target="_blank" href='https://bit.ly/3v0cHPT'>คลิก</a></span></div>
                        </div>
                      </div>
                    )}
                  </>
                )
              }
            </div>
            {
              type != 0 && disabled ? (
                <div className="pl-5 text-disabled-top float-right">
                  <span>สินค้าชิ้นนี้ไม่สามารถ<br></br>{type ==1 ? 'คืน' : 'เปลี่ยน'  } ได้</span>
                </div>
              ) : ''
            }
            {
              type != 0 && disabled ? <div className={`order-detail-opacity`}></div> : ''
            }
          </div>
        </>
      )
    }
   </>
  )
}

export default ProductList