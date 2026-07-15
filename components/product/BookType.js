
const BookType = ({ t, lang, handleChangeFilter }) => {
  return (
    <>
      <p className={'mb-0 py-2 px-2 bg-gray text-white'}>{t('filter:book_lang')}</p>
      <ul className="collapse show list-unstyled px-4" id={`book-lang`}>
        <li>
          <div className="form-group my-3">
            <label className="radio-button mb-0">
              <input type="radio" className="radio-button__input" defaultChecked={!lang || lang == 'all'} id={`book-lang-all`} name={`lang`} value={'all'} onChange={handleChangeFilter} />
              <span className="radio-button__control"></span>
              <span className="radio-button__label">{t('filter:book_lang_all')}</span>
            </label>
          </div>
        </li>
        <li>
          <div className="form-group my-3">
            <label className="radio-button mb-0">
              <input type="radio" className="radio-button__input" defaultChecked={lang == 'th'} id={`book-lang-th`} name={`lang`} value={'th'} onChange={handleChangeFilter} />
              <span className="radio-button__control"></span>
              <span className="radio-button__label">{t('filter:book_lang_th')}</span>
            </label>
          </div>
        </li>
        <li>
         <div className="form-group my-3">
            <label className="radio-button mb-0">
              <input type="radio" className="radio-button__input" defaultChecked={lang == 'en'} id={`book-lang-en`} name={`lang`} value={'en'} onChange={handleChangeFilter} />
              <span className="radio-button__control"></span>
              <span className="radio-button__label">{t('filter:book_lang_en')}</span>
            </label>
          </div>
        </li>
      </ul>
    </>
  )
}

export default BookType