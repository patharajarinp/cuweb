import React,{useState} from 'react'
import Collapseimg from './collapse-img';
import classNames from 'classnames';
import { Collapse } from 'reactstrap';
export default function ReturnProduct({val,t}) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    return (
            <div key={val.product.id} className="mb-2">
                <div  className="container " onClick={toggle}>
                    <div  className="product-in-cart " >
                        <div className="product-in-cart-pic-area">
                            <div className="product-in-cart-pic bg-white ">
                                <img className="img-fluid" src={val.product.picture ||'/mobile/image/product/book.png'} />
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
                        <div className="d-flex" >
                            <i className={isOpen ? "text-orange my-auto fas fa-chevron-up" : "text-orange my-auto fas fa-chevron-down"}></i>
                        </div>
                    </div>  
                </div>
                <Collapse isOpen={isOpen} >
                    <div className="container bg-white ">
                        <hr className="row use-line my-0"></hr>
                        <h4 className="m-0 py-3 ">เหตุผลการคืนสินค้า</h4>
                        <hr className="row use-line my-0"></hr>
                    </div>
                    <div className="container bg-white py-3 ">
                        <h4 className="m-0 text-grey">{t('mobile_order_detail:reason_return' + val.subject)}</h4>
                    </div>
                    <div className="container bg-white ">
                    <hr className="row use-line my-0"></hr>
                        <Collapseimg val={val}/>
                    </div>  
                </Collapse>
            </div>
        
    )
}
