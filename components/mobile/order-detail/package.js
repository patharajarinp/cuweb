import React from 'react';
import CheckOrder from "../../../components/mobile/order-detail/check-order";
import { withTranslation } from '../../../utils/i18n';
import Product from "./product";

const OderPackage = (props) => {
    const { order, order_id, t, fetchDetail } = props;
    if (!order) {
        return;
    }
    // console.log(order);
    return (
        <>
            {
                order.packages.map((invoice, index) =>
                    (
                        <>
                            <div className="container" key={index}>
                                <div className="bg-light-gray row">
                                    <div className="order-publisher">
                                        <div className="d-flex">
                                            <img className="img-fluid img-circle-order mr-2" src={invoice.seller ? (invoice.seller.picture ? invoice.seller.picture : "/mobile/image/icon/icon-cu.svg") : "/mobile/image/icon/icon-cu.svg"} />
                                            <h5 className="my-auto text-black">{invoice.shop_name ? invoice.shop_name : "CHULABOOK"}</h5>
                                        </div>
                                        <p className="text-black my-auto  p-14 w-auto">{t("mobile_order_detail:package")} {index + 1}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="container bg-white ">
                                <Product invoice={invoice} order_id={order_id} order={order} />
                            </div>
                            {
                                !order.isOnlyEbook ? (
                                    <CheckOrder status={invoice.status} pkg={invoice} fetchDetail={fetchDetail} order_id={order_id} order={order}  />
                                ) : ''
                            }
                            
                            
                        </>
                    )
                )
            }

        </>
    )
}
export default withTranslation('order_detail')(OderPackage);