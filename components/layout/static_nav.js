import classNames from 'classnames';
import  { useContext, useEffect, useState } from 'react';
import UserContext from '../../contexts/UserContext';
import api from '../../utils/api';
// import AuthService from '../../utils/AuthService'
import { Link, Router, withTranslation } from '../../utils/i18n';


const Nav = (props) => {
  const [pages, setPages] = useState();
  const { t,page } = props
  const {local} = useContext(UserContext)
  
  // console.log(page)
  const fechData = () => {
    api.getCustompage(page)
    .then(res=>{
      const data = res.data;
      ;
      setPages(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  useEffect(() => {
    if(!page) return;
    fechData();
  }, [page]);

  function useWindowSize() {
    const isClient = typeof window === 'object';

    function getSize() {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
      };
    }

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
      if (!isClient) {
        return false;
      }

      function handleResize() {
        setWindowSize(getSize());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return windowSize;
  }
  
  const size = useWindowSize();
  const selectPage = (e) => {
    var path = e.target.options[e.target.selectedIndex].value;
    if(path == 1 && props.page == 'contact'){
      Router.push(`/contact`);
    }else{
      Router.push({
        pathname: `/${props.page}/[subkey]`,
        query:{
          subkey:path,
          key:props.page
        }
      },`/${props.page}/${path}`);
    }
  }

  return (
    <div className="col-lg-3 border-922up-right">
      {
        props.page && (
          <>
            <div className="row">
              <div className="col-12">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href='/'>
                        <a>{t('home')}</a>
                      </Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <a>
                        {props.page == 'about' && t('about')}
                        {props.page == 'help' && t('help')}
                        {props.page == 'privacy_policy' && t('privacy_policy')}
                        {props.page == 'contact' && t('contact')}
                      </a>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="row nav-right">
              {
                pages ? (size.width < 992 ? (
                  <select className="form-control"  onChange={selectPage}>
                    {pages.map((val, index) => (
                      <option value={val.path} selected={val.path == props.subkey && 'selected'} key={val.path}>
                       {val['title_'+local]}  
                      </option>
                    ))}
                  </select>
                ) :(pages.map((val, index) => (
                  <div className="col-12" key={index}>
                    <Link href={`/${props.page}/[subkey]?subkey=${val.path}`} as={`/${props.page}/${val.path}`}>
                      <a>
                        <div className="side-nav-static">
                          <p className={classNames('p-medium', props.subkey == val.path ? 'text-pink' : '')}>{val['title_'+local]}</p>
                          <i className={classNames('far fa-chevron-right icon-right', props.subkey == 'faq' ? 'text-pink' : '')}></i>
                        </div>
                      </a>
                    </Link>
                  </div>
                )))) : ''
              }
            </div>
          </>
        )
      }
    </div>
  )
}

export default withTranslation(['static_nav'])(Nav)