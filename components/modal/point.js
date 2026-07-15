import { Modal } from 'react-bootstrap'
import { withTranslation } from '../../utils/i18n'
import tools from '../../utils/tools'

const ModalPoint = ({action:setPointState, show, handleClose,user,pointState,t, order_price}) => {
	const Selector = (data) =>{
		var options = [];
		var point = data.max.toString();
	  const POINT_BALANCE = parseInt(point.replace(/,/g, ''));
	  for(var i = 0; i <= parseInt(POINT_BALANCE) ;i += 80 ){
	    options.push(i)
	  }
	  options.sort(function(a, b){return b-a})
	  return (
	    <>
	    <option value="0" selected disabled >{t('choose_point')}</option>
	    {
	      options.map((o,index)=><option selected={pointState == o} value={o} >{o}</option>)
	    }
	    </>
	  )
	}

	const toDateFormat=(str)=>{
		if(!user.member.EXPIRY_DATE){
			return
		}
		let [day,month,year] = user.member.EXPIRY_DATE.split('/')
		let date = new Date(`${year}-${month}-${day}`)
		let new_str = tools.formatDate(date,false,false)
		return new_str
		// user.member.EXPIRY_DATE
	}

	var discount_point = (order_price * 8);
	// console.log(order_price)

	return (
		<Modal className="modal-cart" show={show} centered onHide={()=>{handleClose();}} size="lg">
	        <Modal.Header closeButton>
	          <Modal.Title className="font-20">{t('use_reward_points')}</Modal.Title>
	        </Modal.Header>
	        <Modal.Body className="px-0">
	          <div className="shipping-border d-flex justify-content-between align-items-center">
	            <div className="">
	              <p className="p-medium">{t('your_reward_points')}</p>
	              <p>{t('can_use')}</p>
	            </div>
	            <div className="text-right">
	              <h3 className="mb-0 text-pink cu-point">{user && user.member ? user.member.POINT : '0'} <span className="p-medium mb-0">POINT</span></h3>
	              <p className="mb-0">{t('will_expire_in')} {user && user.member ? toDateFormat(user.member.EXPIRY_DATE) : ''}</p>
	            </div>
	          </div>
	          <div className="shipping-border ">
	            <div className="row">
	              <div className="col-7 d-flex align-items-center">
	                <p className="p-medium w-auto mr-2">{t('use_points')}</p>
	                <div className="form-group styleSelect my-auto w-230px mr-2">
	                  <div className="d-block position-relative align-items-center">
	                    <select className="form-control w-100" onChange={(e)=>{setPointState(e.target.options[e.target.selectedIndex].value)}}>
	                      {
	                        user && <Selector max={user && user.member ? Math.min(user.member.POINT, (discount_point % 80) != 0 ? discount_point + 80 : discount_point) : '0'}/>
	                      }
	                    </select>
	                    <img src="/icon/icon-arrow-down.svg" className="select-icon" />
	                  </div>
	                </div>
	                <span className="p-medium mb-0">POINT</span>
	              </div>

	              <div className="col-5 d-flex justify-content-end align-items-center">
	                <p className="mr-2">{t('total_amount')} : </p>
	                <p className="cart-price">฿ {tools.currencyFormatDE(pointState ? pointState/8 : 0)}</p>
	              </div>
	            </div>
	          </div>
	          <div className="shipping-border border-bottom-none d-flex justify-content-end">
	            <button className="btn btn-outline-secondary mr-2" onClick={()=>{handleClose();setPointState(0)}}>{t('cancel')}</button>
	            <button className="btn btn-primary" onClick={handleClose}>{t('confirm')}</button>
	          </div>
	        </Modal.Body>
	      </Modal>
	)
}

export default withTranslation(['point'])(ModalPoint)