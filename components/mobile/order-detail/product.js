import classNames from 'classnames';
import React, { useState } from 'react';
import { withTranslation, Link } from '../../../utils/i18n';
import tools from '../../../utils/tools';
import Tracking from "./tracking";
const OrderPackage = (props) => {
    const { invoice, order_id ,t, order} = props;
    const [returnP, setreturnP] = useState(true);
    const OpenreturnP = () => setreturnP(!returnP);
    const [tracking, settracking] = useState(true);
    const OpenTracking = () => settracking(!tracking);

    const [product, setProduct] = useState(null);
    //const [quantity, setQuantity] = useState(0);
    const ClickReturn = (prod) => {
        // console.log(id);
        setreturnP(!returnP);
        setProduct(prod);
        //setQuantity(quantity);
        
    }
    //products_return.detail
    // console.log(invoice)
    const isProductReturn = (product_id)=>{
        if(!invoice) return;
        if(!invoice.products_return) return;
        let index = invoice.products_return.detail.findIndex(val=> val.product_id == product_id)
        return index != -1
    }

    var text = invoice.status == 6 ? 5 : invoice.status;
    var statusText = t('mobile_order_detail:status' + text);

    return (
        <>
            <div className="py-3 d-flex justify-content-between">
                <div className="my-auto">
                    <p className="text-black mb-0">{t("mobile_translations:shipping_fee")}</p>
                    <p className="p-12 mb-0">{(invoice.company == 'THAI_POST' || invoice.company == 'HAPPY') ? `${t("mobile_translations:standard_delivery")}`:`${t("mobile_translations:express_delivery")}`} ฿ {tools.currencyFormatDE(invoice.shipping_cost ? invoice.shipping_cost : 0)}</p>
                </div>
                {((order.slips && order.slips.length > 0) || invoice.status >= 2) ? <p className="mb-0 text-pink" onClick={OpenTracking}>
                    <img className="img-fluid mr-1 h-50" src="/mobile/image/icon/icon-cube.svg" />{t("mobile_order_detail:track_package")}</p> : ""
                }
            </div>
            <hr className="use-line my-0 row"></hr>
            {
                invoice.package_details.map((invoice_detail, index)=>{
                    return (
                        <div className="product-in-cart" key={index}>
                            <div className="product-in-cart-pic-area">
                                <div className="product-in-cart-pic ">
                                    <img className="img-fluid" src={invoice_detail.product.picture ? invoice_detail.product.picture : '/mobile/image/product/book.png'} />
                                </div>
                            </div>
                            <div className="product-in-cart-content">
                                <h4 className="text-black two-line">{invoice_detail.product.name}</h4>
                                <div className="d-flex align-items-center">
                  <div className={classNames("tag-cat ",{"tag-book":(invoice_detail.product.type == "book") ,"tag-stationary":(invoice_detail.product.type == "non_book"),"tag-ebook": (invoice_detail.product.type == "ebook"),"tag-course": (invoice_detail.product.type == "course")})}>{(invoice_detail.product.type == "book" ) ? t('mobile_header:book_menu')  :  invoice_detail.product.type == "non_book" ? t('mobile_header:stationary') : invoice_detail.product.type == "ebook" ? t('mobile_header:e_book') : invoice_detail.product.type == "course" ? t('mobile_header:online_course') : null  }</div>
                  {!!invoice_detail.product.is_preorder && <div className="tag-cat px-3" style={{backgroundColor : '#DE5C6E'}}>Preorder</div> } 
                </div>
                                <div className="d-flex justify-content-between">
                                    <h4 className="text-black font-weight-bold my-auto"><span className="font-weight-normal text-grey p-14">{t("mobile_order_detail:quantity")} :</span> {invoice_detail.quantity}</h4>
                                    <p className="my-auto font-weight-bold text-pink">฿ {invoice_detail.product.cover_price}</p>
                                </div>
                                <div className="d-flex justify-content-end my-2">
                                    {invoice.status == 5 ? <p className="p-12 mb-0 text-green">{t("mobile_translations:status")} : {t("mobile_translations:successful")}</p> :
                                    isProductReturn(invoice_detail.product_id) ? <p className="p-12 mb-0">{t('mobile_order_detail:status6')}</p> :
                                    <p className="p-12 mb-0">{statusText}</p>
                                    }
                                </div>
                                {
                                    invoice.status >= 5 ? <div className="d-flex justify-content-end ">
                                        <Link href={`/user/reviews/[order_id]/[product_id]?order_id=${order_id}&product_id=${invoice_detail.product_id}`} as={`/user/reviews/${order_id}/${invoice_detail.product_id}`}>
                                            <a>
                                                <button className="btn-none-width bg-pink text-white text-center w-120px h-40px border-0 ">{t("mobile_translations:reviews")}</button>
                                            </a>
                                        </Link>
                                        
                                    </div> : ""
                                }
                            </div>
                        </div>
                    )
                })
            }
            
           
            <Tracking invoice={invoice} tracking={tracking} OpenTracking={OpenTracking} order={order} />
        </>
    )
}
export default withTranslation('order_detail')(OrderPackage);