import classNames from 'classnames';
import { memo } from 'react';
import api from '../../../utils/api';
import { Link, Trans, withTranslation } from "../../../utils/i18n";
import { CODSuccess, IconOrderSuccess, OrderTransport, PaymentFail, PaymentSuccess, PremiumMemberSuccess, PremiumMemberWanning 
  , SellerAcceptReturnSuccess , SellerAcceptProductSuccess , SellerRejectReturn , SellerTransferSuccess
  , SellerChangeRetrun , SellerRejectChange , SellerSendChange} from '../../icon/svg';

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
          temp.img = item.image ? <img className='blog-noti-img' src={item.image} /> : <img className='blog-noti-img' src='/icon/blog-icon-chapter.svg' />
        
        }else if(status == "2"){
          temp.as = '/blog/writer/'+ item.ref_id
          temp.href = `/blog/writer/[idwriter]?idwriter=${item.ref_id}`
          temp.class = 'blog-noti-list'
          if(subject == "01") temp.img = <img  src='/icon/noti/follow.svg' />
          // else if (subject == "00") temp.img = <PremiumMemberSuccess/>
        }else if(status == "3"){
          temp.as = '/blog/'+ item.ref_id
          temp.href = `/blog/[blogid]?blogid=${item.ref_id}`
          temp.class = 'blog-noti-list'
          if(subject == "00") temp.img = item.image ? <img className='blog-noti-img' src={item.image} /> : <img className='blog-noti-img' src='/icon/blog-icon-chapter.svg' />
        
        }else if(status == "4"){
          temp.as = '/blog/'+ item.ref_id
          let blogId = item.ref_id.split("/")
          temp.href = `/blog/[blogid]/[data_id]?blogid=${blogId[0]}&data_id=${blogId[1]}`
          temp.class = 'blog-noti-list'
          if(subject == "00") temp.img = item.image ? <img className='blog-noti-img' src={item.image} /> : <img className='blog-noti-img' src='/icon/blog-icon-chapter.svg' />
        
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
      default : 
        temp.as = '/'  
        temp.href = '/'
    }
    return temp
  }

const NotiItem = memo(props => {
	const { t } = props;
	var { item, user } = props;
	var item_info = getPath(item)
	var date = new Date(item.createdAt),
			month = '' + (date.getMonth() + 1),
			day = '' + date.getDate(),
			year = date.getFullYear() + 543;
	if (month.length < 2) 
		month = '0' + month;
	if (day.length < 2) 
		day = '0' + day;
	let list_title = item.title ? JSON.parse(item.title) : [];
	let list_message = item.message ? JSON.parse(item.message) : [];

	const handleNotiRead = async (e, id,link) => {
		if(!user) {
			return false;
		}
    api.readAny(user.id, id)
    window.open(link)
		return true;
	}

	return (
		// <Link href={item_info.href} as={item_info.as} key={Math.random()}>
			<a onClick={(e) => handleNotiRead(e, item.id,item_info.as)}>
				<div className={classNames("item "+item_info.class, { "unread": !item.status })}>
					<div className="item-body">
						<div className="item-img">
							<div className="item-inner-img notimenu">
								{item_info.img ? item_info.img : ''}
							</div>
						</div>
						<div className="item-content">
							<div className="item-detail">
								<b>
									<Trans i18nKey={"noti:" + list_title.key} values={{ ...list_title }} />
								</b>
								<p>
									<Trans i18nKey={"noti:" + list_message.key} values={{ ...list_message }} />
								</p>
								<b className="time">{`${day}-${month}-${year}`}</b>
							</div>
						</div>
					</div>
				</div>
			</a>
		// </Link>
	)
})

export default withTranslation(['header', 'noti'])(NotiItem)