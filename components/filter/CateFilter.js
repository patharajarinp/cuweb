import classNames from 'classnames';
import React from 'react';
import BookType from './BookType';
import FilterByPrice from './FilterByPrice';
import ProductStockFilter from './ProductStockFilter'
import { Link, Router } from "../../utils/i18n";


const CateFilter = ({ t, lang, handleChangeFilter, query, setProducts,have_stock, 
  pathname, BtnFilter, toglefilter, type, handleRedirect, GenerateFilter, FilterGenerate, 
  main_category, sub_category, s_category, category, isSeller,handleRoute,show_all }) => {
  
  // console.log("type", type);
  return (
    <>
     <div className={BtnFilter ? "bg-fill show" : "bg-fill"} onClick={toglefilter}></div>
      <div className={BtnFilter ? "custom-filter custom-fill show" : "custom-filter custom-fill "}>
        <div className={classNames({ 'd-none': !show_all })}>
          <h3 className="px-4 py-3">{t('filter:title')}</h3>
          <p className="bg-light-gray py-2"><span className="px-4">{t('filter:type')}</span></p>
      
          <p className="px-4">
              {/* <a className={classNames("text-black")}>{t('book')}</a> */}
              <a className={classNames("", { 'text-pink': type == "book" })} onClick={() => handleRedirect('type', 'book')}>{t('book')}</a>
            
          </p>

          {
            !isSeller && (
              <>
              <p className="px-4"><a className={classNames("", { 'text-pink': type === "ebook" })} onClick={() => handleRedirect('type', 'ebook')}>{t('ebook')}</a></p>
              <p className="px-4"><a className={classNames("", { 'text-pink': type === "course" })} onClick={() => handleRedirect('type', 'course')}>{t('filter:course_online')}</a></p>
              </>
            )
          }
          
          <p className="px-4"><a className={classNames("", { 'text-pink': type === "stationery" })} onClick={() => handleRedirect('type', 'stationery')}>{t('filter:stationery')}</a></p>
        </div>
        <div className={classNames("filter", { 'd-none': show_all })}>
          <div className="d-flex justify-content-between position-relative">
            <h3 className="px-xl-4 px-2 py-3 m-0">{t('filter:title')}</h3>
            <a className={BtnFilter ? "btn-close-right" : "d-none"} onClick={toglefilter}></a>
          </div>
          <GenerateFilter list={s_category ? s_category[type] : []} _key={'main_category'} color={'bg-pink text-white'} />
          {
            main_category && s_category ? Array.isArray(main_category) ? main_category.map((index) => <FilterGenerate color={'bg-gray text-white mb-1px'} index={index} />) : s_category && (<FilterGenerate color={'bg-gray text-white mb-1px'} index={main_category} />) : ''
          }
          
          {
            type && (type == "book" || type == "ebook") && (
              <>
                <BookType t={t} lang={lang} handleChangeFilter={handleChangeFilter} />
              </>
            )
          }
          
        </div>
        <ProductStockFilter t={t} have_stock={have_stock} handleChangeFilter={handleChangeFilter} />
        <FilterByPrice query={query} setProducts={setProducts} pathname={pathname} t={t} handleRoute={handleRoute}/>
        
      </div>
    </>
  )
}

export default CateFilter