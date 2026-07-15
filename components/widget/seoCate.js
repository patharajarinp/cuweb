import classNames from 'classnames';
import { memo, useContext, useEffect, useState } from 'react';
import api from '../../utils/api';
import { Link, withTranslation } from "../../utils/i18n";
import { useRouter } from 'next/router';
import UserContext from '../../contexts/UserContext';

const seoCate = (props) => {
  const { t, cateData : cate } = props;
	const [activeTap, setactiveTap] = useState("book");
	const clickTap = (name) => { setactiveTap(name); setshowSublist(false);}
	const [showSublist, setshowSublist] = useState(false);

  return (
    <>
      <div className='seo-cate-hidden'>
        {
          cate ? cate.map((val, index) => (
            <React.Fragment key={index} >
              <Link 
                href={activeTap == `book` ? `/books/[main_category]?main_category=${val.url_name}` : activeTap == `ebook` ? `/ebooks/[main_category]?main_category=${val.url_name}` : activeTap == "course" ? `/courses/[main_category]?main_category=${val.url_name}` : `/stationeries/[main_category]?main_category=${val.url_name}`} 
                as={activeTap == `book` ? `/books/${val.url_name}` : activeTap == `ebook` ? `/ebooks/${val.url_name}` : activeTap == "course" ? `/courses/${val.url_name}` : `/stationeries/${val.url_name}`}>
                  <a className="text-black">
                    {val.name_th}
                  </a>
              </Link>
              {
                (cate) ? cate[index]?.subs?.map((val2, index2) => (
                  <React.Fragment key={index2} >
                    <Link 
                      href={activeTap == `book` ? `/books/[main_category]/[sub_category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}` : activeTap == `ebook` ? `/ebooks/[main_category]/[sub_category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}` : activeTap == "course" ? `/courses/[main_category]/[sub_category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}` : `/stationeries/[main_category]/[sub_category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}`} 
                      as={activeTap == `book` ? `/books/${cate[index].url_name}/${val2.url_name}` : activeTap == `ebook` ? `/ebooks/${cate[index].url_name}/${val2.url_name}` : activeTap == "course" ? `/courses/${cate[index].url_name}/${val2.url_name}` : `/stationeries/${cate[index].url_name}/${val2.url_name}`}>
                  
                      <a className="text-black ">
                        {val2.name_th}
                      </a>
                    </Link>
                    {
                      (cate) ? cate[index]?.subs[index2]?.items?.map((val3, index3) => (
                        <Link key={index3} 
                          href={activeTap == `book` ? `/books/[main_category]/[sub_category]/[category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}&category=${val3.url_name}` : activeTap == `ebook` ? `/ebooks/[main_category]/[sub_category]/[category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}&category=${val3.url_name}` : activeTap == "course" ? `/courses/[main_category]/[sub_category]/[category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}&category=${val3.url_name}` : `/stationeries/[main_category]/[sub_category]/[category]?main_category=${cate[index].url_name}&sub_category=${val2.url_name}&category=${val3.url_name}`} 
                          as={activeTap == `book` ? `/books/${cate[index].url_name}/${val2.url_name}/${val3.url_name}` : activeTap == `ebook` ? `/ebooks/${cate[index].url_name}/${val2.url_name}/${val3.url_name}` : activeTap == "course" ? `/courses/${cate[index].url_name}/${val2.url_name}/${val3.url_name}` : `/stationeries/${cate[index].url_name}/${val2.url_name}/${val3.url_name}`}>
                            <a className="text-color-author">
                              {val3.name_th}
                            </a>
                        </Link>
                      )) : ''
                    }
                  </React.Fragment>
                )) : ''
              }


            </React.Fragment>
          )) : ''
        }
      </div>
    </>
  )
}

export default seoCate;
