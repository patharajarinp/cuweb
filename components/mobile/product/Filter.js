import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CustomInput } from 'reactstrap';

const Filter = (props) => {
  const { color, title, _key, target = [], list, all = false, show = false, handleFunction, t, handleRedirect } = props;
  const [isShow, setShow] = useState(false);
  const toggleShow = () => setMainShow(!setShow);

  // console.log('target', target);
  // console.log('list', list);

  return (
    <>
      <div className="filter-select-collapse-main-sub" style={{ backgroundColor: color }}>
        <h4 className="my-auto">{title}</h4>
      </div>
      <div className="d-flex justify-content-between flex-wrap p-2">
      {
        (!all && target.length > 0) ?
          target.map((item, index) =>
            <div className="categories-btn active " key={index} onClick={() => handleRedirect(_key, item.url_name)}>
              <p className="categories-text">{item.name_th}</p>
            </div>
          ) : (
            <>
            {
              list.slice(0, 6).map((item, index) =>
                <div key={index} className={item.target ? "categories-btn active" : "categories-btn"} onClick={() => handleRedirect(_key, item.url_name)}>
                  <p className="categories-text">{item.name_th}</p>
                </div>
              )
            }
            {
              list.length > 6 &&
              <>
                {
                  !isShow ? (
                    <div className="filter-select-collapse-main-sub bg-white">
                        <h4 className=" text-pink m-auto" onClick={setShow}>{t("mobile_filter:view_more")} <i className="text-pink my-auto fas fa-chevron-down"></i></h4>
                    </div>
                  ) : ''
                }

                <div className={"additional " + (isShow ? 'show' : '')}>
                  {
                    list && list.slice(6, list.length).map((item, index) =>
                      <div key={index} className={item.target ? "categories-btn active" : "categories-btn"} onClick={() => handleRedirect(_key, item.url_name)}>
                        <p className="categories-text">{item.name_th}</p>
                      </div>
                    )
                  }
                </div>
              </>
            }
            </>
          )
        }
      </div>
    </>
  )
}
export default Filter