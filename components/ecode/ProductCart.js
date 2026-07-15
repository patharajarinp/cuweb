import tools from '../../utils/tools'
import Link from 'next/link'
import classNames from 'classnames'

const ProductCart = ({ t, product, handleCheck, handleCart, checked, hide_btn, quantity, total_price, delCart, promotion }) => {
  let val = { ...product }
  var total_discount = (val.cover_price * val.quantity) - total_price;
  return (
    <tr >
      <td className="in-checkbox">
        <div className="form-group">
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" id={`item${val.id}`} checked={checked} name="infor[]" value={val.id} required onChange={handleCheck} />
            <label className="custom-control-label" htmlFor={`item${val.id}`}>

            </label>
          </div>
        </div>
      </td>
      <td>
        <div className="img-cart">
          {
            (val.video_type == 0 || val.video_type == null) && (
              <img src={val.picture ? val.picture : '/images/book.png'} />
            )
          }
          {
            (val.video_type == 1 || val.video_type == 2) && (
              <img src={'/images/video.svg'} className="mh-100 video" />
            )
          }
        </div>
      </td>
      <td>
        {/* <Link {...tools.getUrlProduct({ ...val, id: val.product_id })}>
          <a></a>
        </Link> */}
        <p className="text-dark p-medium product_name_2row">{val.name}</p>
        <p className="p-14 text-grey">{val.author}</p>

        <div className="d-flex align-items-center">
          <div className={classNames("tag-cat ", { "tag-book": (val.type == 'ecode') })}>{(val.type == 'ecode') ? t('header:e_code') : ""}</div>
          {!!val.is_preorder && <div className={classNames("tag-cat px-3")} style={{ backgroundColor: '#DE5C6E' }}>Preorder</div>}

        </div>

        {
          promotion ?
            <p className="font-12 text-grey mt-1 border-promotion">
              {promotion}
            </p> : ''
        }

      </td>
      <td className="text-center">
        {
          val.cover_price == 0 ? (
            <>
              <p className="text-ebook">{t('free')} </p>
              {/* <p className="cart-discount"><span className="position-relative">฿ {tools.currencyFormatDE(val.cover_price)}</span></p> */}

            </>
          ) : (
            <>
              <p className="cart-no-discount"><span className="position-relative">฿ {tools.currencyFormatDE(val.cover_price)}</span></p>
            </>
          )
        }
      </td>
      <td className="cart-q text-center">
        {
          (val.type != 'ebook' && val.type != 'course') && (
            <div className="input-group input-group-number">

              <input type="button" defaultValue="-" className="button button-minus" data-id={val.id} data-field="quantity" disabled={val.quantity == 1} onClick={() => { handleCart({ cart: val, amount: parseInt(quantity) - 1 }) }} />
              <input type="number" step="1" max="" min="0" pattern="[0-9]*" value={val.quantity} name="quantity" data-field="quantity" data-id={val.id} className="input quantity-field" onChange={(e) => handleCart({ cart: val, amount: e.target.value })} />
              <input type="button" defaultValue="+" className="button button-plus" data-id={val.id} data-field="quantity" disabled={(val.quantity >= (val.is_preorder ? 1000 : val.stock))} onClick={() => handleCart({ cart: val, amount: parseInt(quantity) + 1 })} />
            </div>
          )
        }
      </td>
      <td className="text-right">

        {
          total_price ? (
            <>
              <p className="cart-price">฿ {tools.currencyFormatDE(total_price)}</p>
              {
                !!total_discount && (
                  <>
                    <p className="text-prayut">ประหยัด</p>
                    <p className="cart-price-prayut"><span className="position-relative">฿ {tools.currencyFormatDE(total_discount)}</span></p>
                  </>
                )
              }
            </>
          ) : (
            <p className="text-ebook">{t('free')} </p>
          )
        }

      </td>

      {
        !hide_btn ? (
          <td>
            <p className="del-cart" onClick={() => { delCart(val.id, val.quantity, quantity) }}><i className="fas fa-trash"></i></p>
          </td>
        ) : (
          <td>
            <p className="del-cart" onClick={() => { delCart(val.id, val.quantity, quantity) }}><i className="fas fa-trash"></i></p>
          </td>
        )
      }

    </tr>


  )
}
export default ProductCart