import Logo from './LogoShipping'

const Shipping = ({ list: l, delivery_date, shippingCost, defaultType, packageInfo, change, index, t, company }) => {

  const checkpreOrder = (carts) =>{
    if(!carts?.length) return true
    if(l.shipping_type != 3 ) return false
    return !!carts.find(val => val.is_preorder == 1)
  }

  const havePreOrder = checkpreOrder(packageInfo?.seller?.carts);

  const onlineType = packageInfo?.seller?.carts?.find((v) => (v.type == "ebook" || v.type == "course")) ? true : false;
  const nonShipCOD = (l.shipping_type == 3 && onlineType);

  const canShip =  ((shippingCost >= 0 && !havePreOrder) && !nonShipCOD);

  // console.log('nonShipCOD', nonShipCOD);
  // console.log('canShip', canShip);

  return (
    <>
      <div className={`shipping-border row mx-0 align-items-center ${(index > 0 ? 'border-top-0' : '')} ${!canShip ? 'disabled-row-shipping' : ''}`} style={{ position: "relative" }}>
        <div className="col-6">
          <div className="">
            <p className="p-medium">
              {t(l.shipping_type == 1 ? 'standard_delivery' : l.shipping_type == 2 ? 'express_delivery' : 'cod_delivery')}
            </p>
            <p className="my-1">
              {
                company && company.map((val, index) => (
                  <Logo imgClass={`logo-shipping`} img={val.logo} key={index} />
                ))
              }
            </p>
          </div>
        </div>
        <div className="col-2">
          <p>{canShip ? delivery_date(l.shipping_type) : ''}</p>
        </div>
        <div className={`${!canShip ? '' : 'col-2'}`}>
          

            <div className="text-right">
              <p className="text-price"> {!canShip ? `${t("translations:unsupported_shipping")}` : shippingCost ? `฿ ${shippingCost}` : t("translations:free_shipping")}</p>
              
              {shippingCost == -2 && <small className="text-danger"> เนื่องจากยอดเงินเกินที่กำหนด</small>}
              {/* {havePreOrder && <small className="text-danger">ไม่รองรับการจัดส่งแบบเก็บเงินปลายทาง</small>} */}
            </div>
            
          

        </div>
        <div className="col-2" >
          <div className="text-right">
            <div className="form-group mb-0">
              <label className="radio-button mb-0">
                <input type="radio" className="radio-button__input" name="default[]" disabled={!canShip} defaultChecked={canShip && (defaultType ? defaultType : packageInfo ? packageInfo.type : 1) == l.shipping_type} value={l.shipping_type} onChange={change} />
                <span className="radio-button__control"></span>
                <span className="radio-button__label"></span>
              </label>
            </div>
          </div>
          
        </div>
{
            !canShip && (
              <div className="shipping-disabled"></div>
            )
          }
      </div>
    </>
  )
}

export default Shipping