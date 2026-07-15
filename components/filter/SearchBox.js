import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Search from './Search';
import SortBy from './SortBy';
import Shimmer from '../Shimmer';
// import { Link, Router } from "../../utils/i18n";

const SearchBar = (props) =>{
  const {t, query, isSeller, text, products, pathname, seller_name,getTextSort, textSort, setTextsort,
    handleView, view, handleChangeSort, handleRoute } = props;

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

  return (
    <>
      <div className={classNames('row', isSeller ? 'mt-5' : 'mt-3')}>
        <div className="col-lg-6 col-md-12 d-flex align-items-center">
          <Search text={text} t={t} pathname={pathname} query={query} handleRoute={handleRoute} />
        </div>
        <div className="col-6 d-none d-lg-block">
          <SortBy t={t} textSort={textSort} handleChangeSort={handleChangeSort} view={view} handleView={handleView} />
        </div>
        <div className="col-12 mt-3">
          {
            products ?
              <div>
                <h3 className="font-weight-normal text-transform-none">
                  {
                    text ? (
                      <>{`${products.count ? formatNumber(products.count) : '0'} ${t("filter:filter_result")} "${text}"`}</>
                    ) : (
                      <>{`${products.count ? formatNumber(products.count) : '0'} ${t("filter:filter_result")}`}</>
                    )
                  }
                  
                </h3>
              </div> : <Shimmer size={[500, 16]} />
          }
        </div>
      </div>
    </>
  )
}

export default SearchBar