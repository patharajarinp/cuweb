import classNames from 'classnames';
import React from 'react';
import Collapse from 'react-bootstrap/Collapse';

const SelectFilter = ({ t, setOpen, open, reset, type, main_category, sub_category, s_category, category, FilerShow, size, only_seller, resetAll }) => {
  
  return (
    <>
    {
      size == "md" ? (
        <>
        <a
          onClick={() => setOpen(!open)}
          aria-controls="collapse-fill"
          aria-expanded={open} className={classNames("bg-light-gray py-2 col-12 d-flex justify-conten-between", { 'd-none': !type })}>
          <h4 className="mb-0 ml-2 align-self-center">{t("filter:option")}</h4> <img src="/icon/icon-arrow-down.svg" className={open ? "select-icon show" : "select-icon "}></img></a>

        <Collapse in={open} className="col-12">
          <div id="collapse-fill" className="collapse-fill">
            <div className="fill-onscroll">
            {only_seller && <p className="px-4 d-flex tags"><i onClick={resetAll} className="fa fa-times mr-2 box"></i><span>{t('product:filter_marketplace')}</span></p>}
            {type && <p className="px-4 d-flex tags"><i onClick={reset} className="fa fa-times mr-2 box"></i><span>{t('product:type_product')} : {t(type)}</span></p>}
             {main_category && s_category && <FilerShow _key="main_category" name={t("product:main_category")} list={Array.isArray(main_category) ? main_category : [main_category]} />}
              {
                main_category && sub_category && s_category &&
                <FilerShow
                  _key="sub_category"
                  name={t("product:sub_category")}
                  main_list={Array.isArray(main_category) ? main_category : [main_category]}
                  list={Array.isArray(sub_category) ? sub_category : [sub_category]}
                />
              }
              {
                main_category && sub_category && category && s_category &&
                <FilerShow
                  _key="category"
                  name={t("product:category")}
                  main_list={Array.isArray(main_category) ? main_category : [main_category]}
                  sub_list={Array.isArray(sub_category) ? sub_category : [sub_category]}
                  list={Array.isArray(category) ? category : [category]}
                />
              }

            </div>
            <hr />
            <div className="text-center px-4"><a onClick={resetAll} className="text-pink">{t('filter:reset')}</a></div>
          </div>
        </Collapse>
        </>
      ) : (
        <div className="py-4 custom-filter">
          <h3 className="px-4">{t("filter:option")}</h3>
          {only_seller && <p className="px-4 d-flex tags"><i onClick={resetAll} className="fa fa-times mr-2 box"></i><span>{t('product:filter_marketplace')}</span></p>}
          {type && <p className="px-4 d-flex tags"><i onClick={reset} className="fa fa-times mr-2 box"></i><span>{t('product:type_product')} : {t("filter:"+type)}</span></p>}
          {main_category && s_category && <FilerShow _key="main_category" name={t("product:main_category")} list={Array.isArray(main_category) ? main_category : [main_category]} />}
          {
            main_category && sub_category && s_category &&
            <FilerShow
              _key="sub_category"
              name={t("product:sub_category")}
              main_list={Array.isArray(main_category) ? main_category : [main_category]}
              list={Array.isArray(sub_category) ? sub_category : [sub_category]}
            />
          }
          
          {
            main_category && sub_category && category && s_category &&
            <FilerShow
              _key="category"
              name={t("product:category")}
              main_list={Array.isArray(main_category) ? main_category : [main_category]}
              sub_list={Array.isArray(sub_category) ? sub_category : [sub_category]}
              list={Array.isArray(category) ? category : [category]}
            />
          }
          <hr />
          <div className="text-center px-4"><a onClick={resetAll} className="text-pink">{t('filter:reset')}</a></div>
        </div>
      )
    }
    </>
  )
}

export default SelectFilter