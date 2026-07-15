import Link from 'next/link'
import classNames from 'classnames';
import { i18n } from '../../utils/i18n'

const TextH1 = (props) =>{
  const {t, type, page_path, main_category, sub_category, s_category, category, CateShow, local, main, currentLanguage} = props;

  const pageType = type == 'categories' ? t('header:category') : type == 'book' ? t('book')  : type == 'ebook' ? t('ebook') : type == 'course' ? t('filter:course_online') : t('filter:stationery')

  function capitalizeFirstLetter(string) {
    return string.replace(/^./, string[0].toUpperCase());
  }
  function removeDuplicatePrefix(text, prefix) {
    const duplicatePrefix = prefix + prefix;
    while (text.startsWith(duplicatePrefix)) {
      text = text.replace(duplicatePrefix, prefix);
    }
    return text;
  }

  const pageTitle = main ? (currentLanguage == 'th' ? pageType+main.name_th : ((capitalizeFirstLetter(pageType))+' '+main.name_en)) : pageType;

  return (
    <>
      <div className="row ">
        <div className="col-12">
          <div className="text-center">  
            
            <h1>
              {
                main ? (
                  removeDuplicatePrefix(pageTitle, pageType)
                ) : (
                  <>
                    {type == 'categories' ? t('header:category') : type == 'book' ? t('book')  : type == 'ebook' ? t('ebook') : type == 'course' ? t('filter:course_online') : t('filter:stationery')}
                  </>
                  
                )
              }  
            </h1> 
          </div>
        </div>
      </div>
    </>
  )
}

export default TextH1