import React from 'react'
import { Link } from '../../../utils/i18n'
import tools from '../../../utils/tools'
import classNames from 'classnames';
export default function Returnlist({t,order}) {

    return (
        <div key={order.id}>
            <div className="d-flex justify-content-between align-items-center mt-2">
                <div className="container bg-white ">
                    <div>
                        <div className="pt-2">
                            <Link href={`/user/order-return/[order_id]?order_id=${order.id}`} as={`/user/order-return/${order.id}`}>
                                <h4 className="text-black mb-1">หมายเลขการคืนสินค้า : #{order.id}</h4>
                            </Link>
                            <p className="text-content-news mb-1">{t('change_date')} :  {tools.formatDate(order.createdAt)}</p>
                            <div className="d-flex justify-content-between">
                                <p className="text-content-news ">จัดจำหน่ายโดย : {order.seller ? order.seller.shop_name :'CHULABOOK'}</p>
                                <p className="p-12 mb-0">
                                {`${t('status')} : `}
                                    {order.status == '00' && t('mobile_Order:return_status00')}
                                    {order.status == '01' && t('mobile_Order:return_status01')}
                                    {order.status == '02' && t('mobile_Order:return_status02')}
                                    {order.status == '10' && t('mobile_Order:return_status10')}
                                    {order.status == '20' && t('mobile_Order:return_status20')}
                                    {order.status == '30' && t('mobile_Order:return_status30')}
                                    {(order.status == '40' && order.no_send_back == 0) && t('mobile_Order:return_status40')}
                                    {(order.status == '40' && order.no_send_back == 1) && t('mobile_Order:return_status41')}
                                    {order.status == '42' && t('mobile_Order:return_status42')}
                                    {order.status == '61' && t('mobile_Order:return_status61')}
                                    {order.status == '50' && t('mobile_Order:return_status50')}
                                    {order.status == '60' && t('mobile_Order:return_status60')}
                                    {order.status >= '70' && t('mobile_Order:return_status70')}
                                    
                                    </p>
                            </div>
                            
                        </div> 
                    </div>
                </div>
            </div>
            <div className="container bg-white">
       {
           order.detail.map((val,index)=>(
                <div key={Math.random()} className="product-in-cart bg-white " >
                    <div className="product-in-cart-pic-area">
                        <div className="product-in-cart-pic ">
                            <img className="img-fluid" src={val.product.picture||'/mobile/image/product/book.png'} />
                        </div>
                    </div>
                    <div className="product-in-cart-content w-100">
                        <h4 className="text-black two-line">{val.product.name}</h4>
                        <div className={classNames("tag-cat ",{"tag-book":(val.product.item_code == 10000|| val.product.item_code == 20000) ,"tag-stationary":(val.product.item_code == 30000),"tag-ebook": (val.product.item_code == null)})}>{(val.product.item_code == 10000 || val.product.item_code == 20000 ) ? t('mobile_header:book_menu')  :  val.product.item_code == 30000 ? t('mobile_header:stationary') : val.product.item_code == null && t('mobile_header:e_book') }</div>
                            {!!val.product.is_preorder && <div className="tag-cat px-3" style={{backgroundColor : '#DE5C6E'}}>Preorder</div> } 
                    
                        <div className="d-flex justify-content-between">
                            <h4 className="text-black font-weight-bold my-auto">
                            <span className="font-weight-normal text-grey p-14">{t("quantity")} :</span>  {val.quantity}
                            </h4>
                            
                        </div>
                        
                    </div>
              </div>
           ))
       }     
            

              </div>
        </div>
    )
}
