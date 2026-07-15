import Link from 'next/link'
import classNames from 'classnames';

const SearchBar = (props) =>{
  const {t, query, isSeller, text} = props;

  return (
    <>
      {
        !isSeller && (
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href='/' as={'/'}>
                      <a>{t('filter:main')}</a>
                    </Link>
                    
                  </li>
                  <li className={classNames("breadcrumb-item ", { 'active': !text })} aria-current="page">
                    <Link href="/categories" as={`/categories`}>
                      <a>{t('filter:search')}</a>
                    </Link>
                  </li>
                  {
                    text ? <li className="breadcrumb-item active" aria-current="page">{text}</li> : ''
                  }
                </ol>
              </nav>
            </div>
          </div>
        )
      }
    </>
  )
}

export default SearchBar