import Link from 'next/link'
import classNames from 'classnames';
import parse from "html-react-parser";
import { i18n } from '../../utils/i18n'

const SEODetail = (props) =>{
  const {t, main, heightDes, setDetailMore, detail_more, currentLanguage} = props;
  // const router = useRouter()
  // console.log('i18n.language', i18n.language);
  // console.log('detail_more', detail_more);
  if(!main) return null;
  const description = currentLanguage == 'th' ? (main.description_th || main.description_en) : (main.description_en || main.description_th);

  // console.log('description' , description);

  return (
    <>
      {
        description && (
          <div className="row ">
            <div className="col-12">      
              <div>
              {/* <p  dangerouslySetInnerHTML={{ __html:  description }} /> */}
              
                <div className="detail-des mt-3">
                  <h2 className="pb-3 font-h5">{currentLanguage == 'th' ? main.name_th : main.name_en}</h2>
                  <div className={`show-editor ck ck-content show-detail-category ${detail_more ? 'showall' : ''}`}>
                    <p id="text-editor-content">{parse(String(description))}</p>
                    {/* <p id="text-editor-content" dangerouslySetInnerHTML={{ __html:  description }} /> */}
                  </div>
                  {
                    heightDes > 180 && (
                      <span className="show-detail-category-readmore" onClick={() => setDetailMore(!detail_more)}>{!detail_more ? t('header:readmore') : t('header:hide_message')}</span>
                    )
                  }
                </div>
            
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default SEODetail