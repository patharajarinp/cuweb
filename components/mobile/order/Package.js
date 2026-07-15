import classNames from 'classnames';
import React from 'react';
import api from '../../../utils/api';
const Package = (props) => {
  const { package: pkg, t, type, order } = props;
  if (!order) return null;
  var order_slip = order.slips.length;

  let items = [];
  if (pkg) {
    items = type != 'return' ? pkg.package_details : pkg.products_return ? pkg.products_return.detail : []
  }
  return (
    <>
      <div className="bg-light-gray row">
        <div className="order-publisher">
          <div className="d-flex align-items-center">
            {
              pkg.shop_name ? (
                <>
                  <img className="img-fluid img-circle-order mr-2" src={pkg.seller.picture ? pkg.seller.picture : "/mobile/icon/cu-icon.svg"} />
                  <h5 className="my-auto text-black">{pkg.shop_name}</h5>
                </>
              ) : (
                <>
                  <img className="img-fluid img-circle-order mr-2" src="/mobile/image/icon/icon-cu.svg" />
                  <h5 className="my-auto text-black">Chulabook</h5>
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
      <div>
        {
          items.map((val, index) => (
            <>
              <div className="product-in-cart" key={index}>
                <div className="product-in-cart-pic-area">
                  <div className="product-in-cart-pic ">
                    <img className="img-fluid" src={val.product.picture ? val.product.picture : '/mobile/image/product/book.png'} />
                  </div>
                </div>
                <div className="product-in-cart-content w-100">
                  <h4 className="text-black two-line">{val.product.name}</h4>
                  <div className="d-flex align-items-center">
                    <div className={classNames("tag-cat ", {
                      "tag-book": (val.product.item_code == 10000 || val.product.item_code == 20000), "tag-stationary": (val.product.item_code == 30000),
                      "tag-ebook": (val.product.item_code == null), "tag-course": (val.product.type == "course"),
                      "tag-course-ecode": (val.type == 'course_ecode')
                    })}>{(val.product.item_code == 10000 || val.product.item_code == 20000) ? t('header:book_menu') : val.product.item_code == 30000 ? t('header:stationary') : val.product.item_code == null ? t('header:e_book') : val.product.type == "course" ? t('header:online_course') : null}</div>
                    {!!val.product.is_preorder && <div className="tag-cat px-3" style={{ backgroundColor: '#DE5C6E' }}>Preorder</div>}
                  </div>
                  {
                    val.product.type != "course" ? (
                      <div className="d-flex justify-content-between">
                        <h4 className="text-black font-weight-bold my-auto">
                          <span className="font-weight-normal text-grey p-14">{t("quantity")} :</span> {val.quantity}
                        </h4>
                      </div>
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
              </div>
            </>
          ))
        }
      </div>
    </>
  )
}
export default Package