import React, { useState, useContext } from 'react'
import classNames  from 'classnames';
  
const Button = (props) => {
  const {_type, _name, _class, _click, _disabled, _value, btnName, _id} = props;

  return (
    <>
      <button type={_type} className={classNames("btn", _class)} name={btnName} 
      value={_value} id={_id} onClick={_click} disabled={_disabled}>{_name}</button>
    </>
  )
}

export default Button