import { Link } from '../../utils/i18n';
import classNames from 'classnames';
import tools from '../../utils/tools'
const Footbar = (props)=>{
    const {canShip = true,selectedType=1,t} = props
    return (
        <tr className="bg-change">
          <td colSpan="6">
            <div className="d-flex justify-content-between">
              <p className="p-medium">{t('translations:shipping_options')} </p>
             
              {
                !canShip ? (
                selectedType == 1 ?
                  <p className="text-pink">{t('translations:standard_delivery_m')}</p>
                  :
                  <p className="text-pink">{t('translations:express_delivery_m')}</p>
                )
                :null
                
              } 
              {
                canShip ?(
                  calShipping == 0 || calShipping == '0.00' ? (
                    <p className="text-num">{t('translations:free_shipping')}</p>
                  ) :(
                    <p className="text-num">฿ {tools.currencyFormatDE(calShipping)}</p>
                  )
                )
                :null
                
              }
              {
                canShip ?(
                  <p className="change-track font-weight-bold ">
                  <a onClick={showSelector} className="change-shipping-s text-white">
                    {t('change')}
                  </a>
                </p>
                )
                :null
              }
              
            </div>
          </td>
        </tr>
      )
}

const ProductItem = (props) =>{
  const {cartItem,hide_btn,t,checked,handleCheck,calDetail,index,canEdit} = props
  return(
    <>
      <tr key={cartItem.id}>
        <td className="in-checkbox">
          <div className="form-group">
            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id={`item${cartItem.id}`} checked={checked} name="infor[]" value={cartItem.id} required onChange={handleCheck} />
              <label className="custom-control-label" htmlFor={`item${cartItem.id}`}>
              
              </label>
            </div>
          </div>
        </td>
        <td>
          <div className="img-cart">
          {
            (cartItem.video_type == 0 || cartItem.video_type == null) && (
              <img src={cartItem.picture ? cartItem.picture : '/images/book.png'} />
            )
          }
          
          </div>
        </td>
        <td>
          <Link {...tools.getUrlProduct(cartItem)}>
            <a><p className="text-dark p-medium">{cartItem.name}</p></a>
          </Link>
          <p className="p-14 text-grey">{cartItem.author}</p>
          <div className="d-flex align-items-center">
            <div className={classNames("tag-cat ",{"tag-book":(cartItem.item_code == 10000|| cartItem.item_code == 20000) ,"tag-stationary":(cartItem.item_code == 30000),"tag-ebook": (cartItem.item_code == null)})}>{(cartItem.item_code == 10000 || cartItem.item_code == 20000 ) ? t('header:book_menu')  :  cartItem.item_code == 30000 ? t('header:stationary') : cartItem.item_code == null && t('header:e_book') }</div>
            {!!cartItem.is_preorder && <div className={classNames("tag-cat px-3")} style={{backgroundColor : '#DE5C6E'}}>Preorder</div> } 
            {
              cartItem.item_code != null && (
                <p className="cart-text-amount">{t('quantities')} : {!!cartItem.is_preorder ? cartItem.stock : (cartItem.stock - cartItem.reserve_stock)}</p>
              )
            }
          </div>
          
          {
            calDetail.discount_shelf && calDetail.discount_shelf.cart_promotion && calDetail.discount_shelf.cart_promotion.find((c)=>c.id == cartItem.product_id)  ? 
            <p className="font-12 text-grey mt-1 border-promotion">
              {calDetail.discount_shelf.cart_promotion.find((c)=>c.id == cartItem.product_id).promotion}
            </p> : ''
          }
          
        </td>
        <td>
          {
            cartItem.price == 0 ? (
              <>
              <p className="text-ebook">{t('free')} </p>
              <p className="cart-discount"><span className="position-relative">฿ {tools.currencyFormatDE(cartItem.cover_price)}</span></p>
              </>
            )
            :
            cartItem.price >= cartItem.cover_price ? (
              <p className="cart-no-discount"><span className="position-relative">฿ {tools.currencyFormatDE(cartItem.cover_price)}</span></p>
            )
            
            
            :(
              <>
              <p className="cart-price">฿ {tools.currencyFormatDE(cartItem.price)}</p>
              <p className="cart-discount"><span className="position-relative">฿ {tools.currencyFormatDE(cartItem.cover_price)}</span></p>
              <p className="cart-percent">- {Math.round(100 - ((cartItem.price / parseInt(cartItem.cover_price)) * 100))} %</p>
              </>
            )
          }
          {index}
          {/* <p className="cart-price">฿ {currencyFormatDE(val.price)}</p>
          <p className="cart-discount"><span className="position-relative">฿ {currencyFormatDE(val.cover_price)}</span></p>
          { (parseInt(100 - ((val.price / val.cover_price) * 100)) > 0) && (
            <p className="cart-percent">- {parseInt(100 - ((val.price / val.cover_price) * 100))} %</p>)
            } */}
          
        </td>
        <td className="cart-q text-right min-w-175px">
          {
            (cartItem.item_code != null) && (
              <div className="input-group">
                <input type="button" defaultValue="-" className="button button-minus" data-id={cartItem.id} data-field="quantity" disabled={cartItem.quantity == 1} onClick={()=>{handleCart({cart:cartItem, amount:parseInt(quantity) - 1})}} />
                <input type="number" step="1" max="" min="0" pattern="[0-9]*" value={cartItem.quantity} name="quantity" data-field="quantity" data-id={cartItem.id} className="input quantity-field" onChange={(e)=>handleCart({cart:cartItem, amount:e.target.value})} />
                <input type="button" defaultValue="+" className="button button-plus" data-id={cartItem.id} data-field="quantity" disabled={(cartItem.quantity >= (!!cartItem.is_preorder ? cartItem.stock : (cartItem.stock - cartItem.reserve_stock)))} onClick={()=>handleCart({cart:cartItem, amount:parseInt(quantity) + 1})} />
              </div>
            )
          }
        </td>
        {
          canEdit ? (
            <td>
              <p className="del-cart" onClick={() => {delCart(cartItem.id, cartItem.quantity, quantity)}}><i className="fas fa-trash"></i></p>
            </td>
          ) : (
            <td>
              <p className="del-cart" onClick={() => {delCart(cartItem.id, cartItem.quantity, quantity)}}><i className="fas fa-trash"></i></p>
            </td>
          )
        }
        
      </tr>
    </>
  )
}


const Package = ({t,data,calDetail,handleCheck,handleCheckAllSller,cartDetail,isCheck,canEdit}) =>{
  console.log(data)
  const {carts,} = data
  var check = carts.filter((cart)=>cartDetail.cart_id.includes(cart.id)).length == carts.length;

    return(
        <div className="bg-white br-8 mt-3">
          <div className="row mx-0">
            <div className="col-12 pl-3 pt-3">
              <div className="form-group mb-0">
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" checked={check} id={"seller_"+data.id} name={"seller_"+data.id} value={data.id}  onChange={handleCheckAllSller} />
                  <label className="custom-control-label" htmlFor={"seller_"+data.id}>
                    <p>{data.shop_name} <i className="fas fa-chevron-right text-pink ml-2"></i></p>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-12 px-0">
              <table className="table table-cart">
                <tbody>
                  {
                    carts.map((val, index) => { 
                      let checked = isCheck(val.id)
                      let percent = (calDetail && calDetail.discount_shelf && calDetail.discount_shelf.cart_per) ? calDetail.discount_shelf.cart_per.filter((per)=>per.id == val.product_id) :null
                      //let isDiscount = (calDetail && calDetail.discount_shelf && calDetail.discount_shelf.cart_promotion) ? !!calDetail.discount_shelf.cart_promotion.find(item => item.id == val.product_id)  : false
                      
                      //console.log('isDiscount',isDiscount,val.product_id)
                      if(percent == null || percent.length == 0)
                        return ( <ProductItem key={index} handleCheck={handleCheck} cartItem={val} quantity={val.quantity} calDetail={calDetail} checked={checked} t={t} />)
                      else if(val.price_code == "c112")
                        return ( <ProductItem key={index} handleCheck={handleCheck} cartItem={val} percent={percent[0].per} calDetail={calDetail} checked={checked} quantity={val.quantity} t={t} />)
                      else{
                        let tmp1 = {...val};
                        let tmp2 = {...val};
                        tmp1.quantity = tmp1.quantity - percent.length
                        tmp2.quantity = percent.length
                        // console.log('tmp1',tmp1)
                        // console.log('tmp2',tmp2)
                        return (
  
                          <>
                            { tmp1.quantity > 0 ? <ProductItem key={val.id +index} handleCheck={handleCheck} cartItem={tmp1} calDetail={calDetail} checked={checked} quantity={val.quantity} t={t} /> : ''}
                            <ProductItem handleCheck={handleCheck} key={val.id +index+1} cartItem={tmp2} percent={percent[0].per} calDetail={calDetail} checked={checked} quantity={val.quantity} t={t} canEdit={false}/>
                          </>
                        )
                      }
                    })
                  }
                  {/* {
                    data.id == "cu" && (
                    <tr>
                      <td colSpan="6" className="py-1">
                        <p className="mb-0 font-14">
                          <img src="/icon/car.svg" className="w-32px" /> {t('free_shipping_s')} <span className="font-weight-bold">฿ 700.00</span>
                        </p>
                      </td>
                    </tr>
                    )
                  } */}
                  <Footbar t={t} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
    )

}


export default Package