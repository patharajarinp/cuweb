import classNames from 'classnames';
import { memo, useContext, useEffect, useState } from 'react';
import api from '../../utils/api';
import { Link, withTranslation } from "../../utils/i18n";
import { useRouter } from 'next/router';
import UserContext from '../../contexts/UserContext';


const CategoryMenu = memo(({platform = "desktop",t}) =>{
	const [cate, setCate] = useState();
	const [cateID, setCateID] = useState(undefined);
	const [activeTap, setactiveTap] = useState("book");
	const [showHam, setshowHam] = useState(false);
	const clickTap = (name) => { setactiveTap(name); setshowSublist(false);}
	const toggleshowHam = () => { setshowHam(!showHam) };
	const [showSublist, setshowSublist] = useState(false);

	const {local} = useContext(UserContext)

	const [mainCateID, setMainCateID] = useState(false);
	const [mainCate, setMainCate] = useState(false);

	const router = useRouter();

	useEffect(() => {
		if(showHam)
		setshowHam(false);
	}, [router.pathname, router.query])

	const fetchCate = () => {
		api.getCate().then(res => {
			const data = res.data;
			setCate(data);
		})
		.catch(err => {
			console.log(err.response);
		})
	};


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
	
	

	useEffect(() => {
		setCateID(undefined)
		api.getCate({type:activeTap == "ebook" ? "book" : activeTap}).then(res => {
			const data = res.data;
			setCate(data);
			// ;
		})
		.catch(err => {
			console.log(err.response);
		})
		
	},[activeTap])


	return (
		<>
			{
				(showHam) && (
					<div className="bg-transparent-dropdown" onClick={() => {setshowHam(false);setCateID(undefined);setshowSublist(false)}}></div>
				)
			}
			{
				platform == "desktop" ? 
				<div className="position-relative">
					<button className="btn btn-category text-capitalize" onClick={toggleshowHam}><img src={`${api.frontend_url}/images/berger.svg`} alt="ศูนย์หนังสือจุฬาฯ" className="pr-2 w-auto icon-header " />{t('category')}</button>
					<div className={classNames("popover-category", { "show": showHam,"active":cateID!==undefined })} >
						<div className="popover-tap-area">
							<div className="popover-tap">
								<div className={activeTap === "book" ? "popover-tap-title active book-color" : "popover-tap-title"} onClick={() => clickTap("book")}><span className='font-h5'>{t('book_menu')}</span></div>
								<div className={activeTap === "ebook" ? "popover-tap-title active ebook-color" : "popover-tap-title"} onClick={() => clickTap("ebook")}><span className='font-h5'>{t('e_book')}</span></div>
								<div className={activeTap === "course" ? "popover-tap-title active course-color" : "popover-tap-title"} onClick={() => clickTap("course")}><span className='font-h5'>{t('course_online')}</span></div>
								<div className={activeTap === "stationery" ? "popover-tap-title active write-color" : "popover-tap-title"} onClick={() => clickTap("stationery")}><span className='font-h5'>{t('stationery')}</span></div>
							</div>
							<div className="popover-in-pop">
								{
									cate ? cate.map((val, index) => (
										<div className="category-list" onClick={() => opensSublist(index, val.name_th,val.id, val.url_name)} key={Math.random()}>
											<div className="my-auto d-flex align-self-center main-menu-cate align-items-center">
												<img className="h-img img-fluid mr-2 my-auto align-self-center"  src={activeTap == "ebook" && val.image_ebook ? val.image_ebook : val.image ? val.image : `${api.frontend_url}/icon/icon-man.svg`}  />
												<div className="align-self-center"><span className={classNames("text-black my-auto font-h5", activeTap, (cateID == index ? 'active' : ''))}>{val.name_th}</span>
												</div>
											</div>
											<i className="fas fa-chevron-right text-black my-auto ml-2"></i>
										</div>
									)) : ''
								}
							</div> 
						</div>
						<div className={classNames("popover-category-list", { "show": showSublist })}>
							<div className='main-cate-all'>
								<Link 
									href={activeTap == `book` ? `/books/[main_category]?main_category=${mainCateID}` : activeTap == `ebook` ? `/ebooks/[main_category]?main_category=${mainCateID}` : activeTap == "course" ? `/courses/[main_category]?main_category=${mainCateID}` : `/stationeries/[main_category]?main_category=${mainCateID}`} 
									as={activeTap == `book` ? `/books/${mainCateID}` : activeTap == `ebook` ? `/ebooks/${mainCateID}` : activeTap == "course" ? `/courses/${mainCateID}` : `/stationeries/${mainCateID}`}>
										<a className="text-black">
											<span className={classNames('font-h5 cursor-pointer', activeTap == "book" ? 'book-color' : activeTap == "ebook" ? 'ebook-color' : activeTap == "course" ? 'course-color' : 'write-color')}>{mainCate} {t('all')}</span>
										</a>
								</Link>
							</div>
							<div className="grid">
								{
									(cateID !== undefined && cate) ? cate[cateID]?.subs?.map((val2, index2) => (
										<div className="subcategory-list" key={index2}>
											<ul className="subcategory-list-title">
												<Link 
													href={activeTap == `book` ? `/books/[main_category]/[sub_category]?main_category=${cate[cateID].url_name}&sub_category=${val2.url_name}` : activeTap == `ebook` ? `/ebooks/[main_category]/[sub_category]?main_category=${cate[cateID].url_name}&sub_category=${val2.url_name}` : activeTap == "course" ? `/courses/[main_category]/[sub_category]?main_category=${cate[cateID].url_name}&sub_category=${val2.url_name}` : `/stationeries/[main_category]/[sub_category]?main_category=${cate[cateID].url_name}&sub_category=${val2.url_name}`} 
													as={activeTap == `book` ? `/books/${cate[cateID].url_name}/${val2.url_name}` : activeTap == `ebook` ? `/ebooks/${cate[cateID].url_name}/${val2.url_name}` : activeTap == "course" ? `/courses/${cate[cateID].url_name}/${val2.url_name}` : `/stationeries/${cate[cateID].url_name}/${val2.url_name}`}>
													<a className="text-black">
														<span className='font-h5'>{val2.name_th}</span>
													</a>
												</Link>
												{
													cate ? cate[cateID]?.subs[index2]?.items?.map((val3, index3) => (
														<Link key={index3} 
															href={activeTap == `book` ? `/books/[main_category]/[sub_category]/[category]?main_category=${cate[cateID].url_name}&sub_category=${val2.url_name}&category=${val3.url_name}` : activeTap == `ebook` ? `/ebooks/[main_category]/[sub_category]/[category]?main_category=${cate[cateID].url_name}&sub_category=${val2.url_name}&category=${val3.url_name}` : activeTap == "course" ? `/courses/[main_category]/[sub_category]/[category]?main_category=${cate[cateID].url_name}&sub_category=${val2.url_name}&category=${val3.url_name}` : `/stationeries/[main_category]/[sub_category]/[category]?main_category=${cate[cateID].url_name}&sub_category=${val2.url_name}&category=${val3.url_name}`} 
															as={activeTap == `book` ? `/books/${cate[cateID].url_name}/${val2.url_name}/${val3.url_name}` : activeTap == `ebook` ? `/ebooks/${cate[cateID].url_name}/${val2.url_name}/${val3.url_name}` : activeTap == "course" ? `/courses/${cate[cateID].url_name}/${val2.url_name}/${val3.url_name}` : `/stationeries/${cate[cateID].url_name}/${val2.url_name}/${val3.url_name}`}>
												
															<a className="text-color-author">
																<li>{val3.name_th}</li>
															</a>
														</Link>
													)) : ''
												}
											</ul>
										</div>
									)) : ''
								}
							</div>
						</div>
					</div>
				</div> : platform == "ipad" &&
				<div className="position-relative">
					<button className="btn-lower1200 btn-category" onClick={toggleshowHam}><img src={`${api.frontend_url}/images/berger.svg`} alt="ศูนย์หนังสือจุฬาฯ" className="w-auto icon-header" /></button>
					<div className={classNames("layout-bg-menu-out", { "show": showHam })} onClick={toggleshowHam}></div>
                    <div className={classNames("nav-menu-1199down", { "show": showHam })}>
						<div className="h-56px bg-light-gray" >
							<a className="btn-close-right "onClick={toggleshowHam}></a>
						</div>
					     <div className="popover-tap">
							<div className={activeTap === "book" ? "popover-tap-title active book-color" : "popover-tap-title"} onClick={() => clickTap("book")}><span className='font-h5'>{t('book_menu')}</span></div>
							<div className={activeTap === "ebook" ? "popover-tap-title active ebook-color" : "popover-tap-title"} onClick={() => clickTap("ebook")}><span className='font-h5'>{t('e_book')}</span></div>
							<div className={activeTap === "course" ? "popover-tap-title active course-color" : "popover-tap-title"} onClick={() => clickTap("course")}><span className='font-h5'>{t('course_online')}</span></div>
							<div className={activeTap === "stationery" ? "popover-tap-title active write-color" : "popover-tap-title"} onClick={() => clickTap("stationery")}><span className='font-h5'>{t('stationery')}</span></div>
						</div>
						<div className="layout-menu-cate">
						{
							cate ? cate.map((val, index) => (
								<React.Fragment key={index} >
							    <div className="content-cate" >
							    	<div className={cateID === index && cateID != -1 ?'cate-list active':'cate-list'} onClick={() => openSublist_mobile(index, val.name_th,val.id, val.url_name)} key={val.id}>
										<img className="img-fluid mr-2 my-auto align-self-center" src={activeTap == "ebook" && val.image_ebook ? val.image_ebook : val.image ? val.image : `${api.frontend_url}/icon/icon-man.svg`} /> {val.name_th}
									</div>
									
							    </div>
									
									<div className={classNames("px-5 sub-main ",{"active":cateID === index } )}>
										<div className='main-cate-all mx-0'>
											<Link 
												href={activeTap == `book` ? `/books/[main_category]?main_category=${mainCateID}` : activeTap == `ebook` ? `/ebooks/[main_category]?main_category=${mainCateID}` : activeTap == "course" ? `/courses/[main_category]?main_category=${mainCateID}` : `/stationeries/[main_category]?main_category=${mainCateID}`} 
												as={activeTap == `book` ? `/books/${mainCateID}` : activeTap == `ebook` ? `/ebooks/${mainCateID}` : activeTap == "course" ? `/courses/${mainCateID}` : `/stationeries/${mainCateID}`}>
													<a className="text-black">
														<span className={classNames('font-h5 cursor-pointer', activeTap == "book" ? 'book-color' : activeTap == "ebook" ? 'ebook-color' : activeTap == "course" ? 'course-color' : 'write-color')}>{mainCate} {t('all')}</span>
													</a>
											</Link>
										</div>
										<div className={'sub-cate-two-row'} >
											{
												(cate) ? cate[index]?.subs?.map((val2, index2) => (
													<div className="item-sub-cate" key={Math.random()}>
														<Link 
															href={activeTap == `book` ? `/books/[main_category]/[sub_category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}` : activeTap == `ebook` ? `/ebooks/[main_category]/[sub_category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}` : activeTap == "course" ? `/courses/[main_category]/[sub_category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}` : `/stationeries/[main_category]/[sub_category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}`} 
															as={activeTap == `book` ? `/books/${cate[index].url_name}/${val2.url_name}` : activeTap == `ebook` ? `/ebooks/${cate[index].url_name}/${val2.url_name}` : activeTap == "course" ? `/courses/${cate[index].url_name}/${val2.url_name}` : `/stationeries/${cate[index].url_name}/${val2.url_name}`}>
														
																<a className="text-black ">
																	<span className='font-h5'>{val2.name_th}</span>
																</a>
															</Link>
														{
														   	cate ? cate[index]?.subs[index2]?.items?.map((val3, index3) => (
																	<Link key={index3} 
																	href={activeTap == `book` ? `/books/[main_category]/[sub_category]/[category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}&category=${val3.url_name}` : activeTap == `ebook` ? `/ebooks/[main_category]/[sub_category]/[category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}&category=${val3.url_name}` : activeTap == "course" ? `/courses/[main_category]/[sub_category]/[category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}&category=${val3.url_name}` : `/stationeries/[main_category]/[sub_category]/[category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}&category=${val3.url_name}`} 
																	as={activeTap == `book` ? `/books/${cate[index].url_name}/${val2.url_name}/${val3.url_name}` : activeTap == `ebook` ? `/ebooks/${cate[index].url_name}/${val2.url_name}/${val3.url_name}` : activeTap == "course" ? `/courses/${cate[index].url_name}/${val2.url_name}/${val3.url_name}` : `/stationeries/${cate[index].url_name}/${val2.url_name}/${val3.url_name}`}>
																		<a className="text-color-author mb-2">
																			<li>{val3.name_th}</li>
																		</a>
																</Link>
														   )) : ''
														}
													</div>
												)):''
											}
										</div>
									</div>
								</React.Fragment>
							)):''
						}
						</div>
					</div>
				</div>
			}
			
		</>
	)
})

export default withTranslation(['header', 'noti'])(CategoryMenu)