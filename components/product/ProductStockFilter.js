
const ProductStockFilter = ({ t, have_stock, handleChangeFilter }) => {
  return (
    <>
      <p className={'mb-0 py-2 px-2 bg-gray text-white'}>{t('filter:product_stock')}</p>
      <ul className="collapse show list-unstyled px-4" id={`product_stock_filter`}>
        <li>
          <div className="form-group my-3">
            <label className="radio-button mb-0">
              <input type="radio" className="radio-button__input" defaultChecked={!have_stock || have_stock != 1} id={`have_stock_all`} name="have_stock" value="0" onChange={handleChangeFilter} />
              <span className="radio-button__control"></span>
              <span className="radio-button__label">{t('filter:all')}</span>
            </label>
          </div>
        </li>
        <li>
          <div className="form-group my-3">
            <label className="radio-button mb-0">
              <input type="radio" className="radio-button__input" defaultChecked={have_stock == 1} id={`have_stock`} name="have_stock" value="1" onChange={handleChangeFilter} />
              <span className="radio-button__control"></span>
              <span className="radio-button__label">{t('filter:ready_to_sell')}</span>
            </label>
          </div>
        </li>
      </ul>
    </>
  )
}

export default ProductStockFilter