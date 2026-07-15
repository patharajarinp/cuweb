import React, { memo } from 'react';
import { Carousel } from 'react-bootstrap';

const Banner = memo(props =>{


  const renderImg = (card_index) => {
    if(!props.data) {
      return;
    }
    let data = props.data || []
   
    let items = [];
    data.forEach((val,index) => {
      // console.log(val.link)
      if(val.index == card_index) 
      items.push(
        <Carousel.Item key={index}>
          
            <a href={val.link}>
              <img
                className="d-block w-100 height-img lazyload"
                src={val.image}
                alt={val.alt_image || "ศูนย์หนังสือจุฬาฯ"}
              />
            </a>
         
        </Carousel.Item>  
      )
    })
    return items
  }
  // const let data = props.data || []

  if(props.type == 1)
  return (
    <div className="col-12" >
      <Carousel controls={props.data && props.data.filter((d)=>d.index == 1).length > 1} indicators={props.data && props.data.filter((d)=>d.index == 1).length > 1}>
        {
          props.data ? props.data.map((val, index) => (
            val.index == 1 && (
              <Carousel.Item key={index}>
                 <a href={val.link}>
                    <img
                      className="d-block w-100 banner-img lazyload"
                      data-src={val.image}
                      alt={val.alt_image || "ศูนย์หนังสือจุฬาฯ"}
                    />
                  </a>
              </Carousel.Item>    
            )
          )) : ''
        }
      </Carousel>
    </div>
  )
  else if(props.type == 2)
  return (
    <>
    <div className="col-8" >
      <Carousel controls={props.data && props.data.filter((d)=>d.index == 1).length > 1} indicators={props.data && props.data.filter((d)=>d.index == 1).length > 1}>
        {renderImg(1)}
      </Carousel>
    </div>
    <div className="col-4 type-2" >
      <div className="row mx-0 pb-carousel">
        <div className="col-12 px-0">
          <Carousel controls={props.data && props.data.filter((d)=>d.index == 2).length > 1} indicators={props.data && props.data.filter((d)=>d.index == 2).length > 1}>
            {renderImg(2)}
          </Carousel>
        </div>
      </div>
      <div className="row mx-0 pt-carousel">
        <div className="col-12 px-0">
          <Carousel controls={props.data && props.data.filter((d)=>d.index == 3).length > 1} indicators={props.data && props.data.filter((d)=>d.index == 3).length > 1}>
            {renderImg(3)}
          </Carousel>
        </div>
      </div>
    </div>
    </>
  )
  else if(props.type == 3)
  return (
    <>
    <div className="col-4" >
      <Carousel controls={props.data && props.data.filter((d)=>d.index == 1).length > 1} indicators={props.data && props.data.filter((d)=>d.index == 1).length > 1}>
        {renderImg(1)}
      </Carousel>
    </div>
    <div className="col-4" >
      <Carousel controls={props.data && props.data.filter((d)=>d.index == 2).length > 1} indicators={props.data && props.data.filter((d)=>d.index == 2).length > 1}>
        {renderImg(2)}
      </Carousel>
    </div>
    <div className="col-4 type-2" >
      <div className="row mx-0 pb-carousel">
        <div className="col-12 px-0">
          <Carousel controls={props.data && props.data.filter((d)=>d.index == 3).length > 1} indicators={props.data && props.data.filter((d)=>d.index == 3).length > 1}>
            {renderImg(3)}
          </Carousel>
        </div>
      </div>
      <div className="row mx-0 pt-carousel">
        <div className="col-12 px-0">
          <Carousel controls={props.data && props.data.filter((d)=>d.index == 4).length > 1} indicators={props.data && props.data.filter((d)=>d.index == 4).length > 1}>
            {renderImg(4)}
          </Carousel>
        </div>
      </div>
    </div>
    </>
  )
  else return null;

})

export default Banner