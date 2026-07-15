import Link from 'next/link'
import classNames from 'classnames';

const BreadcrumbNew = (props) =>{
  const {t, query, isSeller, text, type, local, page_path, main_category, sub_category, s_category, category, CateShow} = props;

  return (
    <>
      {
        !isSeller && (
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb filter">
                  <li className="breadcrumb-item">
                    <Link href='/' as={'/'}>
                      <a>{t('filter:main')}</a>
                    </Link>
                    
                  </li>
                  <li className={classNames("breadcrumb-item ")} aria-current="page">
                    <Link href={`/${page_path != 'categories' ? page_path : 'categories'}`}>
                      <a>{type == 'categories' ? t('header:category') : type == 'book' ? t('book')  : type == 'ebook' ? t('ebook') : type == 'course' ? t('filter:course_online') : t('filter:stationery')}</a>
                    </Link>
                  </li>
                  {
                    main_category && s_category && 
                    <CateShow 
                      show_type={"breadcrumb"}
                      _key="main_category" 
                      name={"main_category"} 
                      list={Array.isArray(main_category) ? main_category : [main_category]} 
                    />
                  }
                  {
                    main_category && sub_category && s_category &&
                    <CateShow
                      show_type={"breadcrumb"}
                      _key="sub_category"
                      name={"sub_category"}
                      main_list={Array.isArray(main_category) ? main_category : [main_category]}
                      list={Array.isArray(sub_category) ? sub_category : [sub_category]}
                    />
                  }
                  
                  {
                    main_category && sub_category && category && s_category &&
                    <CateShow
                      show_type={"breadcrumb"}
                      _key="category"
                      name={"category"}
                      main_list={Array.isArray(main_category) ? main_category : [main_category]}
                      sub_list={Array.isArray(sub_category) ? sub_category : [sub_category]}
                      list={Array.isArray(category) ? category : [category]}
                    />
                  }

                  {/* {
                    text ? <li className="breadcrumb-item active" aria-current="page">{text}</li> : ''
                  } */}
                </ol>
              </nav>
            </div>
          </div>
        )
      }
    </>
  )
}

export default BreadcrumbNew