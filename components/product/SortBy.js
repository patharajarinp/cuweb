import classNames from 'classnames';
import React from 'react';

const Search = ({ textSort, t, handleChangeSort, view, size, toglefilter, handleView }) => {
  return (
    <>
    {
      size == 'md' ? (
        <div className="d-flex justify-content-between d-lg-none">
          <button className="btn btn-primary w-76px my-3 d-block d-lg-none" onClick={toglefilter} ><i className="fas fa-filter mr-2"></i>{t('filter:title')}</button>
          <div className="text-right align-self-center w-100">
            <label>{t('filter:sort')} :</label>
            <div className="styleSelect input-month ml-2">
              <div className="btn-group w-100 mr-3">
                <button type="button" className="btn dropdown-toggle btn-fill" data-toggle="dropdown">
                  {t(textSort)}
                </button>
                <div className="dropdown-menu">
                  
                  <a onClick={() => handleChangeSort('pub_year-desc')} className="dropdown-item">{t('filter:sort_year_desc')}</a>
                  <a onClick={() => handleChangeSort('total_sales-desc')} className="dropdown-item">{t('filter:total_sales')}</a>
                  <a onClick={() => handleChangeSort('price-asc')} className="dropdown-item">{t('filter:sort_price_asc')}</a>
                  <a onClick={() => handleChangeSort('price-desc')} className="dropdown-item">{t('filter:sort_price_desc')}</a>
                  <a onClick={() => handleChangeSort('name-asc')} className="dropdown-item">{t('filter:sort_name_asc')}</a>
                  <a onClick={() => handleChangeSort('name-desc')} className="dropdown-item">{t('filter:sort_name_desc')}</a>

                </div>
              </div>
            </div>
            <button className={classNames("btn-list mr-2 ml-3", { 'active': view == 1 })} onClick={() => handleView(1)}><svg xmlns="http://www.w3.org/2000/svg" width="16.001" height="16" viewBox="0 0 16.001 16">
              <path id="Union_40" data-name="Union 40" d="M948.5,3916a.5.5,0,0,1-.5-.5v-6a.5.5,0,0,1,.5-.5h6a.5.5,0,0,1,.5.5v6a.5.5,0,0,1-.5.5Zm-9,0a.5.5,0,0,1-.5-.5v-6a.5.5,0,0,1,.5-.5h6a.5.5,0,0,1,.5.5v6a.5.5,0,0,1-.5.5Zm9-9a.5.5,0,0,1-.5-.5v-6a.5.5,0,0,1,.5-.5h6a.5.5,0,0,1,.5.5v6a.5.5,0,0,1-.5.5Zm-9,0a.5.5,0,0,1-.5-.5v-6a.5.5,0,0,1,.5-.5h6a.5.5,0,0,1,.5.5v6a.5.5,0,0,1-.5.5Z" transform="translate(-939 -3900)" fill="#fff" />
            </svg></button>
            <button className={classNames("btn-list", { 'active': view == 2 })} onClick={() => handleView(2)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16.001" viewBox="0 0 16 16.001">
              <path id="Union_44" data-name="Union 44" d="M945.5,3916a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Zm-6,0a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Zm6-6a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Zm-6,0a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Zm6-6a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Zm-6,0a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Z" transform="translate(-939 -3900)" fill="#fff" />
            </svg></button>
          </div>
        </div>
      ) : (
        <div className="text-right">
          <label>{t('filter:sort')} :</label>
          <div className="styleSelect input-month ml-2">
            <div className="btn-group w-100">
              <button type="button" className="btn dropdown-toggle btn-fill" data-toggle="dropdown">
                {t(textSort)}
              </button>
              <div className="dropdown-menu">
                
                <a onClick={() => handleChangeSort('pub_year-desc')} className="dropdown-item">{t('filter:sort_year_desc')}</a>
                <a onClick={() => handleChangeSort('total_sales-desc')} className="dropdown-item">{t('filter:total_sales')}</a>
                <a onClick={() => handleChangeSort('price-asc')} className="dropdown-item">{t('filter:sort_price_asc')}</a>
                <a onClick={() => handleChangeSort('price-desc')} className="dropdown-item">{t('filter:sort_price_desc')}</a>
                <a onClick={() => handleChangeSort('name-asc')} className="dropdown-item">{t('filter:sort_name_asc')}</a>
                <a onClick={() => handleChangeSort('name-desc')} className="dropdown-item">{t('filter:sort_name_desc')}</a>
              </div>
            </div>

            
          </div>
          <button className={classNames("btn-list mr-2 ml-3", { 'active': view == 1 })} onClick={() => handleView(1)}><svg xmlns="http://www.w3.org/2000/svg" width="16.001" height="16" viewBox="0 0 16.001 16">
            <path id="Union_40" data-name="Union 40" d="M948.5,3916a.5.5,0,0,1-.5-.5v-6a.5.5,0,0,1,.5-.5h6a.5.5,0,0,1,.5.5v6a.5.5,0,0,1-.5.5Zm-9,0a.5.5,0,0,1-.5-.5v-6a.5.5,0,0,1,.5-.5h6a.5.5,0,0,1,.5.5v6a.5.5,0,0,1-.5.5Zm9-9a.5.5,0,0,1-.5-.5v-6a.5.5,0,0,1,.5-.5h6a.5.5,0,0,1,.5.5v6a.5.5,0,0,1-.5.5Zm-9,0a.5.5,0,0,1-.5-.5v-6a.5.5,0,0,1,.5-.5h6a.5.5,0,0,1,.5.5v6a.5.5,0,0,1-.5.5Z" transform="translate(-939 -3900)" fill="#fff" />
          </svg></button>
          <button className={classNames("btn-list", { 'active': view == 2 })} onClick={() => handleView(2)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16.001" viewBox="0 0 16 16.001">
            <path id="Union_44" data-name="Union 44" d="M945.5,3916a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Zm-6,0a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Zm6-6a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Zm-6,0a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Zm6-6a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Zm-6,0a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Z" transform="translate(-939 -3900)" fill="#fff" />
          </svg></button>
        </div>
      )
    }
    </>
  )
}

export default Search