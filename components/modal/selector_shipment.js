import { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { withTranslation } from '../../utils/i18n'
import tools from '../../utils/tools'
import api from '../../utils/api'
import Shipping from './Shipping'

const SelectorShipment = ({action:changePackage,packageInfo, show, handleClose,defaultType,t, shippingClick}) => {
  const [select, setSelect] = useState(0);
  const list = packageInfo && packageInfo.list;
  const {shippingCost} = packageInfo || {}

  var type_list = [{shipping_type : 1},{shipping_type : 2},{shipping_type : 3}];
  // if(packageInfo && packageInfo.list){
  //   type_list = [...packageInfo.list]
  //   let index = type_list.findIndex(l => l.shipping_type == 3)
  //   if(index === -1)  type_list.push({shipping_type : 3})
  // }
  // console.log(shippingCost)
  // if(!shippingCost) return null;
  

  const change = (e) => {
    var val = e.target.value;
  
    // if(val == 1) {
    //   setSelect(1);
    // }
    // else if(val == 2){
    //   setSelect(2);
    // }
    setSelect(val)
  }

  const handleChange = () => {
    if(select){
      packageInfo && packageInfo.handle(select);
    } 
    
    handleClose();
  }

  const delivery_date = (type)=>{
    if(!packageInfo) return ;
    const {seller} = packageInfo;
    const {id,seller_shippings} = seller
    const now = new Date();

    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + parseInt(days));
      return date;
    }
    let std_date,end_date;
    if(id != 'cu'){
      
      let item = seller_shippings.find(val => val.shipping_type ==type)
      const shipping_time =item && item.shipping_time;
      

      const [start,end] = type < 3 ? shipping_time.split(/-/g) : [1,3]
      //console.log('start',start)
      std_date = now.addDays(start);
      end_date = now.addDays(end);
      
      
    }
    else{
      const start = type == 1? 3 : 1;
      const end = type == 1 ? 5 : 3;
      std_date = now.addDays(start);
      end_date = now.addDays(end);
    }
    return `${tools.formatDate(std_date,true,false,true,false)} - ${tools.formatDate(end_date,true,false,true,false)}`
  }

  const [shipping, setShipping]  = useState(false);
  const fecthShipping = () => {
    api.getShippingCom()
    .then(res=>{
      const data = res.data;
      // console.log(data);
      setShipping(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  useEffect(() => {
    fecthShipping();
  }, [])


  const filterShipping = (shipping_type) => {
    if(!shipping) return [];
    var key = shipping_type == 1 ? 'normal' : shipping_type == 2 ? 'express' : 'cod';
    var company = shipping.filter((val) => (val[key] == 1 ? shipping_type : 0) == shipping_type);
    // var apply_with = 
    var isSeller = shippingClick?.id != 'cu';
    // console.log('type', company);
    // console.log('shippingClick', shippingClick);
    // console.log('isSeller', isSeller);
    company = company?.filter(val => (val.apply_with == 'seller' && isSeller) || (val.apply_with == 'cu' && !isSeller) || val.apply_with == 'all')
    // console.log('company', company);
    return company;
    // if(shipping_type == 1) {
    //   return shipping.filter((val) => (val.[key] == 1 ? shipping_type : 0) == shipping_type)
    // }
    // if(shipping_type == 2) {
    //   return shipping.filter((val) => (val.express == 1 ? 2 : 0) == shipping_type)
    // }
    // if(shipping_type == 3) {
    //   return shipping.filter((val) => (val.cod == 1 ? 3 : 0) == shipping_type)
    // }
    
  }

  // console.log('type_list', type_list);
  // console.log('shippingClick', shippingClick);

	return (
		<Modal className="modal-cart" show={show} centered onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title className="font-20">{t('selector_type_shipment')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-0">
          <div className="shipping-border">
            <p className="p-medium">{t('shipping_supported_by_cu')} {shippingClick?.id == 'cu' ? 'Chulabook' : shippingClick?.shop_name}</p>
            <p>{t('delivery_track')} {shippingClick?.id == 'cu' ? 'Chulabook' : shippingClick?.shop_name}</p>
          </div>
          {
            type_list.map((l,index) => (
              <Shipping key={index} list={l} company={filterShipping(l.shipping_type)} shippingCost={shippingCost && shippingCost['total'+l.shipping_type]} delivery_date={delivery_date}
              defaultType={defaultType} packageInfo={packageInfo} change={change} index={index} t={t} />
            ))
          }
          <div className="row mx-0 mt-3">
            <div className="col-12">
              <div className="float-right">
                <button className="btn btn-outline-primary mr-3" type="button" onClick={() => handleClose()} >{t('cancel')}</button>
                <button className="btn btn-primary" type="button" onClick={handleChange}>{t('confirm')}</button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
	)
}

export default withTranslation(['shippingInfo'])(SelectorShipment)