import React, { useEffect } from 'react';

const Search = ({ query, text, pathnam,handleRoute, t }) => {
  const [search_text, setSearch_text] = React.useState('');
  // const router = useRouter()
  const { text :text_search ,reload} = query
  const limit = 24;
  
  useEffect(()=>{
    setSearch_text(text_search)
  },[text_search])
  useEffect(()=>{
    if(!query.text)
    setSearch_text('')
  },[query])

  const handleRedirecty = (event) => {
    let re = (!reload || reload == 0) ? 1 : 0
    if(handleRoute) {
      var params;
      if(search_text) {
        params = {...query, reload : re};
        params.text = search_text;
      }else{
        params = {...query, reload : re};
        params.text = "";
      }
      delete params.page
      delete params.main_category
      delete params.sub_category
      delete params.category
      handleRoute(params)
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleRedirecty()
    }
  }
  const go = () => {
    // setProducts(null)
    let re = (!reload || reload == 0) ? 1 : 0
    if(handleRoute) {
      var params;
      if(search_text) {
        params = {...query, reload : re};
        params.text = search_text;
      }else{
        params = {...query, reload : re};
        params.text = "";
      }
      delete params.page
      delete params.main_category
      delete params.sub_category
      delete params.category
      handleRoute(params)
    }
  }

  useEffect(() => {
    setSearch_text(text)
  }, [])
  return (
    <>
      <img src="/icon/book-search.svg" align="middle" />
      <div>
        <div className="input-group ml-2 ">
          <input type="text" className="form-control border-right-none" onKeyPress={handleKeyPress} value={search_text} onChange={(e) => setSearch_text(e.target.value)} placeholder="" />
          {/* <div className="input-group"> */}
          <button className="btn btn-outline-primary br-left-none " onClick={go} type="button">{t("filter:search")}</button>
          {/* </div> */}
        </div>
      </div>
    </>
  )
}

export default Search