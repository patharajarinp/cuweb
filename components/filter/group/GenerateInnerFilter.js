import Link from 'next/link'
import classNames from 'classnames';

const GenerateInnerFilter = (props) =>{
  const { item, _key, local, query, handleChangeFilter } = props;

  return (
    <>
      <li key={`${_key}-${item.id}`} className="px-4">
        <div className="form-group my-3 new-radio">
          <label className="radio-button mb-0">
            <input type="radio" className="radio-button__input" 
              defaultChecked={query[_key] && Array.isArray(query[_key]) ? query[_key].indexOf(item.url_name.toString()) != -1 : query[_key] == item.url_name.toString()}              
              id={`cetagory-${_key}-${item.id}`} 
              name={_key} value={item.url_name} onChange={handleChangeFilter} />
            <span className="radio-button__control"></span>
            <span className="radio-button__label">{local == 'th' ? item.name_th : item.name_en}</span>
          </label>
          {/* <div className="custom-control custom-checkbox">
            <input type="checkbox" 
              defaultChecked={query[_key] && Array.isArray(query[_key]) ? query[_key].indexOf(item.id.toString()) != -1 : query[_key] == item.id.toString()} 
              className="custom-control-input" id={`cetagory-${_key}-${item.id}`} 
              name={_key} value={item.id} onChange={handleChangeFilter} />
            <label className="custom-control-label" htmlFor={`cetagory-${_key}-${item.id}`}>
              <p>{local == 'th' ? item.name_th : item.name_en}</p>
            </label>
          </div> */}
        </div>
      </li>
    </>
  )
}

export default GenerateInnerFilter