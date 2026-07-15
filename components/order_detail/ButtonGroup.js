import React from 'react';


const ButtonGroup = ({pkg, t, setClickBtn, type, setType, _dis,canReturn,canChange}) => {
  
  const handleClick = (e, val) => {
    setType(val);
    setClickBtn(true);
  }

  return (
   <>
   {
      (pkg && !_dis) && (
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="p-medium">
              {type == 1 && (t('text_return'))}
              {type == 2 && (t('text_change'))}
            </p>
          </div>
          <div>
            {
              ((pkg.status == 5 && !pkg.user_accept)&& !pkg.isOnlyEbook) && (
                <>
                  {canReturn && <button type="button" className={`btn ${type == 1 ? 'btn-outline-primary-orange' : 'btn-outline-grey'}`} onClick={(e) => handleClick(e, 1)}>{t('btn_return')}</button>}
                  
                  {canChange && <button type="button" className={`btn ${type == 2 ? 'btn-outline-primary-orange' : 'btn-outline-grey '} ml-3`} onClick={(e) => handleClick(e, 2)}>{t('btn_change')}</button>}
                  
                </>
              )
            }
          </div>
        </div>
      )
    }
   </>
  )
}

export default ButtonGroup