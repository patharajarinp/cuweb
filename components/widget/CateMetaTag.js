import Head from 'next/head'
import api from '../../utils/api';
import tools from '../../utils/tools';

const CateMetaTag = (props) => {
  const { t, type, selected, mainData, subData, cateData, currentLanguage} = props;

  const pageType = type == 'categories' ? t('header:category') : type == 'book' ? t('book')  : type == 'ebook' ? t('ebook') : type == 'course' ? t('filter:course_online') : t('filter:stationery')

  const pageTitle = selected ? (currentLanguage == 'th' ? pageType+selected.name_th : ((capitalizeFirstLetter(pageType))+' '+selected.name_en)) : pageType;

  const urlData =  tools.getUrlCategoryFilter(mainData, subData, cateData, type, currentLanguage);

  const mainName = mainData ? (currentLanguage == 'th' ? pageType+mainData.name_th : ((capitalizeFirstLetter(pageType))+' '+mainData.name_en)) : '';
  const subName = subData ? (currentLanguage == 'th' ? pageType+subData.name_th : ((capitalizeFirstLetter(pageType))+' '+subData.name_en)) : '';
  const cateName = cateData ? (currentLanguage == 'th' ? pageType+cateData.name_th : ((capitalizeFirstLetter(pageType))+' '+cateData.name_en)) : '';

  const descriptionDetail = () => {

    if(selected && selected.seo_description_th) {
      return currentLanguage == 'th' ? selected.seo_description_th : selected.seo_description_en;
    }else{
      const selectedPage = pageTitle
      var text = '';
      text += `สั่งซื้อ${removeDuplicatePrefix(pageTitle, pageType)} ทางออนไลน์ `
      text += mainData && (mainName !== selectedPage) ? `${mainName} ` : ``
      text += subData && (subName !== selectedPage) ? `${subName} ` : ``
      text += cateData && (cateName !== selectedPage) ? `${cateName} ` : ``
      text += showAllCate()
      text += `ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี`
      return text;
    }
  }

  const showAllCate = () => {
    if(mainData && subData && !cateData) return showCateItem(subData, 'items')
    else if(mainData && !subData && !cateData) return showCateItem(mainData, 'subs')
    else return ``
  }

  const showCateItem = (data, key) => {
    return data[key].map((item, index) => {
      return item['name_'+currentLanguage]
    }).join(' ')
  }


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

  

  console.log('selected', selected)


  return (
    <>
      <Head>
        <title>{(selected && selected.seo_title_th) ? currentLanguage == 'th' ? selected.seo_title_th : selected.seo_title_en : `${removeDuplicatePrefix(pageTitle, pageType)} | ร้านหนังสือศูนย์หนังสือจุฬาฯ`}</title>
        <link rel="canonical" href={`${api.frontend_url}${urlData.url}`} />
        <meta name="description" content={type != 'categories' ? descriptionDetail() : 'เว็บไซต์ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย สั่งซื้อหนังสือออนไลน์ อีบุ๊ค สินค้าไลฟ์สไตล์ ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี'} />
        {/* <meta name="keywords" content={`ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย , ร้านหนังสือ, ร้านขายหนังสือออนไลน์,หนังสือ, คู่มือสอบ,หนังสือเรียน,เตรียมสอบ,นิยาย,หนังสือทั่วไป,คอร์สเรียนออนไลน์,Online Course,E-Book, อีบุ๊ค, ของที่ระลึก,อุปกรณ์เครื่องเขียน,chulabook,ศูนย์หนังสือจุฬาฯ,ตำราวิชาการ`} /> */}
        
        <meta property="og:type" content="website" /> 
        <meta property="og:title" content={(selected && selected.seo_title_th) ? currentLanguage == 'th' ? selected.seo_title_th : selected.seo_title_en : `${removeDuplicatePrefix(pageTitle, pageType)} | ร้านหนังสือศูนย์หนังสือจุฬาฯ`} /> 
        <meta property="og:description" content={type != 'categories' ? descriptionDetail() : 'เว็บไซต์ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย สั่งซื้อหนังสือออนไลน์ อีบุ๊ค สินค้าไลฟ์สไตล์ ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี'} /> 
        <meta property="og:image" content={`${api.frontend_url}/images/homepage.jpg`} /> 
        <meta property="og:site_name" content="CHULABOOK" /> 

        <meta name="twitter:image" content={`${api.frontend_url}/images/homepage.jpg`} /> 
        <meta name="twitter:title" content={(selected && selected.seo_title_th) ? currentLanguage == 'th' ? selected.seo_title_th : selected.seo_title_en : `${removeDuplicatePrefix(pageTitle, pageType)} | ร้านหนังสือศูนย์หนังสือจุฬาฯ`} /> 
        <meta name="twitter:description" content={type != 'categories' ? descriptionDetail() : 'เว็บไซต์ร้านหนังสือศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย สั่งซื้อหนังสือออนไลน์ อีบุ๊ค สินค้าไลฟ์สไตล์ ราคาพิเศษ ซื้อครบ 700 บาทจัดส่งฟรี'} /> 
        <meta name="twitter:site" content="CHULABOOK" /> 
        <meta name="twitter:creator" content="CHULABOOK" /> 
        <meta name="google-site-verification" content="dBDOYd14FFLmHNrRUPCDvPoN1zgAFmN9TLJ6ieEhDpU" />
      </Head>
    </>
  )
}
export default CateMetaTag