import React, { useEffect } from 'react';
import { withTranslation, Trans, Link } from "../../../../utils/i18n";
import {
  CODSuccess, IconOrderSuccess,
  OrderTransport, PaymentFail, PaymentSuccess, PremiumMemberSuccess,
  PremiumMemberWanning
  , SellerAcceptReturnSuccess , SellerAcceptProductSuccess , SellerRejectReturn , SellerTransferSuccess
, SellerChangeRetrun , SellerRejectChange , SellerSendChange
} from '../../../mobile/icon/svg';
import tools from '../../../../utils/tools';

const MobileNoti = (props) => {
  const { t, user } = props;

  const NotificationItem = ({noti}) =>{
    let list_title = noti.title ? JSON.parse(noti.title) : [];
    let list_message = noti.message ? JSON.parse(noti.message) : [];
    
    const getPath = (item) => {
      var type = parseInt(item.code.toString().substring(0, 1));
      var status = item.code.toString().substring(1, 2);
      var subject = item.code.toString().substring(2, 4);
  
      var temp = {
        type,
        status,
        subject,
        href: null,
        as: null,
        class: '',
      }
        
      switch (type) {
        case 1:
        case 2:
          if (status == "0") {
            temp.as = '/user/order-detail/' + item.ref_id
            temp.href = `/user/order-detail/[order_id]?order_id=${item.ref_id}`
            temp.class = ''
            if(subject == "11")
              temp.img = <PaymentFail/> //ORDER_FAILURE
          } else if (status == "1") {
            temp.as = '/user/order-detail/' + item.ref_id
            temp.href = `/user/order-detail/[order_id]?order_id=${item.ref_id}`
            temp.class = ''
            if(subject == "01")
              temp.img = <PaymentSuccess/>
          else if(subject == "02")
              temp.img = <CODSuccess/>
            else if(subject == "21")
              temp.img = <OrderTransport/>
            else if(subject == "22")
              temp.img = <IconOrderSuccess/>
          }
          break;
        case 3:
          temp.as = '/user/order-return/' + item.ref_id
          temp.href = `/user/order-return/[id]?id=${item.ref_id}`
          temp.img = <PaymentSuccess/>
          break;
        case 4:
          break;
        case 5:
          break;
      case 6:
        if(status == "1") {
          let blogId = item.ref_id.split("/")
          temp.as = `/blog/${blogId[0]}/${blogId[1]}`
          temp.href = `/blog/[blogid]/[data_id]?blogid=${blogId[0]}&data_id=${blogId[1]}`
          temp.class = 'blog-noti-list'
          temp.img = item.image ? <img className='blog-noti-img' src={item.image} /> : <img className='blog-noti-img' src='/mobile/icon/blog/blog-icon-chapter.svg' />
        
        }else if(status == "2"){
          temp.as = '/blog/writer/'+ item.ref_id
          temp.href = `/blog/writer/[idwriter]?idwriter=${item.ref_id}`
          temp.class = 'blog-noti-list'
          if(subject == "01") temp.img = <img  src='/mobile/icon/noti/follow.svg' />
          // else if (subject == "00") temp.img = <PremiumMemberSuccess/>
        }else if(status == "3"){
          temp.as = '/blog/'+ item.ref_id
          temp.href = `/blog/[blogid]?blogid=${item.ref_id}`
          temp.class = 'blog-noti-list'
          if(subject == "00") temp.img = item.image ? <img className='blog-noti-img' src={item.image} /> : <img className='blog-noti-img' src='/mobile/icon/blog/blog-icon-chapter.svg' />
        
        }else if(status == "4"){
          temp.as = '/blog/'+ item.ref_id
          let blogId = item.ref_id.split("/")
          temp.href = `/blog/[blogid]/[data_id]?blogid=${blogId[0]}&data_id=${blogId[1]}`
          temp.class = 'blog-noti-list'
          if(subject == "00") temp.img = item.image ? <img className='blog-noti-img' src={item.image} /> : <img className='blog-noti-img' src='/mobile/icon/blog/blog-icon-chapter.svg' />
        }

        break;
      case 7:
          temp.as = '/user/member'
          temp.href = '/user/member'
          temp.class = ''
          if(subject == "01")
            temp.img = <PremiumMemberSuccess/>
          else if(subject == "21")
            temp.img = <PremiumMemberWanning/>
        break;
      case 8:
            if (status == "0") {
            temp.as = '/user/order-return/' + item.ref_id
            temp.href = `/user/order-return/[id]?id=${item.ref_id}`
            temp.class = 'return-noti'
            if(subject == "01") temp.img = <SellerAcceptReturnSuccess/>
            else if (subject == "02") temp.img = <SellerAcceptProductSuccess/>
            else if (subject == "91") temp.img = <SellerRejectReturn/>
            else if (subject == "03") temp.img = <SellerTransferSuccess/>
            }else if (status == "1"){
            temp.as = '/user/order-change/' + item.ref_id
            temp.href = `/user/order-change/[id]?id=${item.ref_id}`
            temp.class = 'return-noti'
            if(subject == "01") temp.img = <SellerChangeRetrun/>
            else if (subject == "02") temp.img = <SellerRejectChange/>
            else if (subject == "03") temp.img = <SellerAcceptProductSuccess/>
            else if (subject == "04") temp.img = <SellerSendChange/>
            }
        break;
      }
      return temp
    }

    var item_info = getPath(noti)

    return(
        <>
        {
            <Link href={item_info.href} as={item_info.as}>
                <a>
                    <div className={"notification-list-border container "+item_info.class + (!status ? " bg-notification-unread" : "")}>
                        <div className="product-in-cart border-0 pb-2">
                            <div className="product-in-cart-pic-area">
                                <div className="product-in-cart-pic ">
                                    {/* <img className="img-fluid" src={noti.image} /> */}
                                    {item_info.img ? item_info.img : ''}
                                </div>
                            </div>
                            <div className="product-in-cart-content">
                                <p className="text-black mb-0">
                                    <Trans i18nKey={"noti:" + list_title.key} values={{ ...list_title }} />
                                </p>
                                
                                <p className="p-12 mb-0 text-color-author notification-list-detail">
                                    <Trans i18nKey={"noti:" + list_message.key} values={{ ...list_message }} />
                                </p>
                                <p className="p-10 text-date-news "> {tools.formatDate(noti.createdAt,false,false)}</p>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
            
        }
        </>
    )
  }
  
  return ( 
    <>
      <div className="vh-100 bg-light-less-gray">
        <div className="container ">
          <div className="notification-nav">
            <div className="d-flex justify-content-center">
              <Link href="/user/order?status=1">
                <a className="col-4 p-0">
                  <div className="d-flex py-2">
                    <img className="img-fluid w-56px m-auto" src="/mobile/image/icon/icon-payment.svg" />
                  </div>
                  <p className="text-black p-12 text-center mb-0">{t("mobile_dashboard:waiting_payment")}</p>
                </a>
              </Link>
              <Link href="/user/order?status=2&status=3">
                <a className="col-4 p-0">
                  <div className="d-flex py-2">
                    <img className="img-fluid w-56px  m-auto" src="/mobile/image/icon/icon-preshipping.svg" />
                  </div>
                  <p className="text-black p-12 text-center mb-0">{t("mobile_dashboard:to_ship")}</p>
                </a>
              </Link>
              <Link href="/user/order?status=4">
                <a className="col-4 p-0">
                  <div className="d-flex py-2">
                    <img className="img-fluid w-56px  m-auto" src="/mobile/image/icon/icon-shipping.svg" />
                  </div>
                  <p className="text-black p-12 text-center mb-0">{t("mobile_dashboard:to_receive")}</p>
                </a>
              </Link>
            </div>
          </div>
        </div>
        {
            user ? 
            <div className="mt-3 bg-white">
              {
                  user.notifications.map(item => <NotificationItem noti={item} key={item.id}/>)
              }
            </div>:null
        }
        <div className="footer-space"></div>
      </div>
      
    </>
  )
}

export default MobileNoti