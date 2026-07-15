import { memo, useContext, useEffect, useState } from 'react';
import api from '../../../utils/api';
import classNames from 'classnames';
import { Link, withTranslation } from "../../../utils/i18n";
import { useRouter } from 'next/router';

const CateFilter = memo((props) =>{
  const { t, cateFilter, setCateFilter, cateData } = props;
	const [activeTap, setactiveTap] = useState("book");
	const [showSublist, setshowSublist] = useState(false);
	const clickTap = (name) => { setactiveTap(name); setshowSublist(false);setShow(false);;}

  const [cate, setCate] = useState();
  const [cateID, setCateID] = useState(undefined);
  const [mainCateID, setMainCateID] = useState(false);
	const [mainCate, setMainCate] = useState(false);

  const opensSublist = (id, cate_name, cate_id, url_name) => {
		console.log('url_name', url_name);
		var _id = cateID;
		setCateID(id);
		setMainCate(cate_name);
		setMainCateID(url_name);
		setshowSublist(false);
		setTimeout(() => {
			var grid = document.querySelector('.grid');
			var msnry = new Masonry(grid, {
				itemSelector: '.subcategory-list',
			});
			setshowSublist(true);
		}, 200)
	}
  const openSublist_mobile = (id, cate_name, cate_id, url_name) => {
		console.log('url_name', url_name);
    setShow(false);
		setMainCate(cate_name);
		setMainCateID(url_name);
		if(cateID  == undefined){
		setCateID(id);
		}else{
			if(cateID != id){
			setCateID(id);
			}else{
			setCateID(-1);
			}
		}
		
		setTimeout(() => {
			var grid = document.getElementsByClassName('sub-cate-two-row')[id]
			var msnry = new Masonry(grid, {
				itemSelector: '.item-sub-cate',
			});
		}, 100)
		
	}
  
  const [idx1, setIdx1] = useState(0);
  const [idx2, setIdx2] = useState(0);
  const [show, setShow] = useState(false);
  const handleSubCate = (id1, id2, shw) => {
    setIdx1(id1);
    setIdx2(id2);
    setShow(!shw);
  }

  
  useEffect(() => {
		setCateID(undefined)
		api.getCate({type:activeTap == "ebook" ? "book" : activeTap}).then(res => {
			const data = res.data;
			setCate(data);
		})
		.catch(err => {
			console.log(err.response);
		})
		
	},[activeTap])

  const handleBack = () => {
    setCateFilter(false);
    setShow(false);
  }

  return (
    <>
      <div className={`category-filter ${cateFilter ? 'show' : ''}`}>
        <div className='category-filter-list'>
          <div className="cart-nav">
            <div className=" text-center cart-nav-title">
              <h4 className="text-black">{t('header:category')}</h4>
            </div>
            <a className="btn-back cart-nav-back" onClick={() => handleBack()}>
              <img className="img-fluid" src={'/mobile/image/icon/icon-back.svg'} />
            </a>
          </div>
         <div className="popover-tap-area">
            <div className="popover-tap">
              <div className={activeTap === "book" ? "popover-tap-title active book-color" : "popover-tap-title"} onClick={() => clickTap("book")}><span className='font-h5'>{t('header:book_menu')}</span></div>
              <div className={activeTap === "ebook" ? "popover-tap-title active ebook-color" : "popover-tap-title"} onClick={() => clickTap("ebook")}><span className='font-h5'>{t('header:e_book')}</span></div>
              <div className={activeTap === "course" ? "popover-tap-title active course-color" : "popover-tap-title"} onClick={() => clickTap("course")}><span className='font-h5'>{t('header:course_online')}</span></div>
              <div className={activeTap === "stationery" ? "popover-tap-title active write-color" : "popover-tap-title"} onClick={() => clickTap("stationery")}><span className='font-h5'>{t('header:stationery')}</span></div>
            </div>
            <ul className="layout-menu-cate seocate">
              {
                cateData ? cateData?.filter(v => v.type == (activeTap == "ebook" ? "book" : activeTap))?.map((val, index) => (
                  <React.Fragment key={index} >
                    <li className="content-cate" >
                      <div className={cateID === index && cateID != -1 ?'cate-list active':'cate-list'} onClick={() => openSublist_mobile(index, val.name_th,val.id, val.url_name)} key={val.id}>
                        <img className="img-fluid mr-2 my-auto align-self-center" src={activeTap == "ebook" && val.image_ebook ? val.image_ebook : val.image ? val.image : `${api.frontend_url}/icon/icon-man.svg`} /> {val.name_th}
                      </div>
                      <ul className={classNames("sub-main ",{"active":cateID === index } )}>
                        <li className={classNames('main-cate-all mx-0', activeTap == "book" ? 'book-color' : activeTap == "ebook" ? 'ebook-color' : activeTap == "course" ? 'course-color' : 'write-color')}>
                          <Link 
                            href={activeTap == `book` ? `/books/[main_category]?main_category=${mainCateID}` : activeTap == `ebook` ? `/ebooks/[main_category]?main_category=${mainCateID}` : activeTap == "course" ? `/courses/[main_category]?main_category=${mainCateID}` : `/stationeries/[main_category]?main_category=${mainCateID}`} 
                            as={activeTap == `book` ? `/books/${mainCateID}` : activeTap == `ebook` ? `/ebooks/${mainCateID}` : activeTap == "course" ? `/courses/${mainCateID}` : `/stationeries/${mainCateID}`}>
                              <a className="text-black">
                                <span className={classNames('font-h5 cursor-pointer', activeTap == "book" ? 'book-color' : activeTap == "ebook" ? 'ebook-color' : activeTap == "course" ? 'course-color' : 'write-color')}>{mainCate} {t('header:all')}</span>
                              </a>
                          </Link>
                        </li>
                        {/* <li className={'sub-cate-two-row'} > */}
                          {
                            (val) ? val?.subs?.map((val2, index2) => (
                              <li className={`item-sub-cate ${show && (val.id == idx1 && val2.id == idx2) ? 'active' : ''}`} key={Math.random()} onClick={() => handleSubCate(val.id, val2.id, show)}>
                                <div>
                                    <div className={`d-flex justify-content-between level2 ${show && (val.id == idx1 && val2.id == idx2) ? 'active' : ''}`} onClick={() => handleSubCate(val.id, val2.id, show)}>
                                      <a className="text-black ">
                                        <span className='font-h5'>{val2.name_th}</span>
                                        <div className='a-icon'></div>
                                      </a>                                     
                                    </div>
                                    <div className={`show-cate ${show && (val.id == idx1 && val2.id == idx2) ? 'active' : ''}`}>
                                      <div className='cate-level2-active'>
                                        <Link 
                                          href={activeTap == `book` ? `/books/[main_category]/[sub_category]?main_category=${val.url_name}&sub_category=${val2.url_name}` : activeTap == `ebook` ? `/ebooks/[main_category]/[sub_category]?main_category=${val.url_name}&sub_category=${val2.url_name}` : activeTap == "course" ? `/courses/[main_category]/[sub_category]?main_category=${val.url_name}&sub_category=${val2.url_name}` : `/stationeries/[main_category]/[sub_category]?main_category=${val.url_name}&sub_category=${val2.url_name}`} 
                                          as={activeTap == `book` ? `/books/${val.url_name}/${val2.url_name}` : activeTap == `ebook` ? `/ebooks/${val.url_name}/${val2.url_name}` : activeTap == "course" ? `/courses/${val.url_name}/${val2.url_name}` : `/stationeries/${val.url_name}/${val2.url_name}`}>
                                      
                                          <a className="text-black ">
                                            <span className='font-h5'>{val2.name_th} {t('header:all')}</span>
                                          </a>
                                        </Link>
                                      </div>
                                      {
                                        (val2) ? val2?.items?.map((val3, index3) => (
                                          <Link key={index3} 
                                            href={activeTap == `book` ? `/books/[main_category]/[sub_category]/[category]?main_category=${val.url_name}&sub_category=${val2.url_name}&category=${val3.url_name}` : activeTap == `ebook` ? `/ebooks/[main_category]/[sub_category]/[category]?main_category=${val.url_name}&sub_category=${val2.url_name}&category=${val3.url_name}` : activeTap == "course" ? `/courses/[main_category]/[sub_category]/[category]?main_category=${val.url_name}&sub_category=${val2.url_name}&category=${val3.url_name}` : `/stationeries/[main_category]/[sub_category]/[category]?main_category=${val.url_name}&sub_category=${val2.url_name}&category=${val3.url_name}`} 
                                            as={activeTap == `book` ? `/books/${val.url_name}/${val2.url_name}/${val3.url_name}` : activeTap == `ebook` ? `/ebooks/${val.url_name}/${val2.url_name}/${val3.url_name}` : activeTap == "course" ? `/courses/${val.url_name}/${val2.url_name}/${val3.url_name}` : `/stationeries/${val.url_name}/${val2.url_name}/${val3.url_name}`}>
                                              <a className="text-color-author">
                                                <li>{val3.name_th}</li>
                                              </a>
                                          </Link>
                                        )) : ''
                                      }
                                  </div>
                                </div>
                              </li>
                            )):''
                          }
                        {/* </li> */}
                      </ul>
                    </li>
                  </React.Fragment>
                )):''
              }
						</ul>
          </div>
        </div>
      </div>
    </>
  )
})

export default CateFilter