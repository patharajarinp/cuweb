import React, { useState } from 'react';

const DesCate = (props) => {
  const {seo} = props;

  if(!seo) return null;

  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            {seo?.description_th}
          </div>
        </div>
      </div>
    </>
  )
}
export default DesCate