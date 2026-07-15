import Slider from '@material-ui/core/Slider';
import React, { useEffect } from 'react';

const FilterByPrice = ({ query, setProducts, t, pathname,handleRoute }) => {
  const { maxprice, minprice } = query
  const [value, setValue] = React.useState([0, 10000]);
  // const router = useRouter()
  // const pathname = router.pathname;

  useEffect(() => {
    setValue([minprice ? minprice : 0, maxprice ? maxprice : 10000])
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInput = (event) => {
    let val = 0;
    if (parseInt(event.target.value) === NaN)
      val = 0
    else
      val = parseInt(event.target.value)

    if (event.target.name == 'start')
      if (val > value[1])
        setValue([value[1], value[1]])
      else
        setValue([val, value[1]])
    else
      if (val < value[0]) {
        setValue([value[0], value[0]]);
      } else {
        setValue([value[0], val])
      }
  };

  const filterByPrice = () => {
    setProducts(null)
    query['maxprice'] = value[1]
    query['minprice'] = value[0]
    
    if(handleRoute) handleRoute({maxprice:value[1],minprice : value[0]})
    // Router.push({
    //   pathname,
    //   query: {
    //     ...query
    //   }
    // });
  }

  return (
    <>
      <p className={'py-2 px-4 bg-gray text-white'}>{t('filter:price')}</p>
      <div className="row px-4 mx-0">
        <div className="col-5 px-0">
          <div className="form-group">
            <input type="number" name="start" min="0" className="form-control" value={value[0]}
              onChange={handleInput} />
          </div>
        </div>
        <div className="col-2 px-0">
          <div className="text-center">
            <label>-</label>
          </div>
        </div>
        <div className="col-5 px-0">
          <div className="form-group">
            <input type="number" name="end" max="10000" className="form-control" value={value[1]}
              onChange={handleInput} />
          </div>
        </div>
        <div className="col-12 mt-3 px-3">
          <Slider
            value={value}
            onChange={handleChange}
            aria-labelledby="range-slider"
            max="10000"
          />
        </div>
        <div className="col-12 my-3 px-3 d-flex justify-content-center">
          <button className="btn btn-primary filter" disabled={(value[0] == 0 && value[1] == 10000) && (!maxprice) && (!minprice)} onClick={filterByPrice}>{t('filter:btn_price')}</button>
        </div>
      </div>
    </>
  )
}

export default FilterByPrice