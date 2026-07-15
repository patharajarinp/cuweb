import React,{useState} from 'react'
import classNames  from 'classnames';
import api from '../../utils/api';

const PackagePage = ({package : pkg, t,type, order}) => {
  // console.log(pkg)
  if(!order) return null;
  var order_slip = order.slips.length;
  let items = [];
  if(pkg){
    items = type != 'return' ? pkg.package_details :  pkg.products_return ? pkg.products_return.detail : []
  }

  // console.log('pkg', pkg)
  // console.log('items', items)
  
  return (
    <>
      <div className="row mx-0 products d-flex align-items-center ">
        <div className="col-12 px-0">
          <div className="shop px-3 py-2">
            <div className="d-flex align-items-center">
              {
                pkg.shop_name ? (
                  <>
                    <img src={pkg.seller.picture ? pkg.seller.picture : "/icon/cu-icon.svg"} className="shop-logo" />
                    <p className="mb-0 ml-3">{pkg.shop_name}</p>
                  </>
                ) : (
                  <>
                    <img src="/icon/cu-icon.svg" className="shop-logo" />
                    <p className="mb-0 ml-3">CHULABOOK</p>
                  </>
                )
              }
              
            </div>
            <div>
                {`${t('status')} : `}
                {pkg.status == 0 && t('status0')}
                {(pkg.status == 1 && order_slip == 0) && t('status1')}
                {(pkg.status == 1 && order_slip != 0) && t('confirm_slip')}
                {pkg.status == 2 && t('status2')}
                {pkg.status == 3 && t('status3')}
                {pkg.status == 4 && t('status4')}
                {pkg.status >= 5 && t('status5')}
                {/* {pkg.status == 6 && t('status6')}
                {pkg.status == 7 && t('status7')}
                {pkg.status == 8 && t('status8')} */}
            </div>
          </div>
        </div>
        {
          items.map((val, index) => (
            <>
              <div className="col-2 mt-3">
                <div className="img-detail"> 
                {
                 
                  (val.product.video_type == 0 || val.product.video_type == null) && (
                    <img src={val.product.picture ? val.product.picture : '/images/book.png'} className="mh-100" />
                  )
                }
                {
                  (val.product.video_type == 1 || val.product.video_type == 2) && (
                    <img src={'/images/video.svg'} className="mh-100 video" />
                  )
                }
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
              <div className="col-6">
                {
                  (pkg.status >= 2 && val.product.type === 'course') && (
                  <div className='d-flex justify-content-end'>
                    <div className='text-right'>
                      <div>เรียนคอร์สออนไลน์</div>
                      <a target="_blank" href={`${api.course_url}/courses/${val.product.course_id}`}><button className='btn btn-course btn-course-auto'>คลิกที่นี่</button></a>
                      <div><span className='font-14'>วิธีการเข้าเรียนคอร์สออนไลน์ <a target="_blank" href='https://bit.ly/3v0cHPT'>คลิก</a></span></div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ))
        }
        
      </div>
    </>
  )
}
export default PackagePage
