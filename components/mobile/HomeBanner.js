import React, { useState } from 'react';
import {
  Carousel,

  CarouselControl,
  CarouselIndicators, CarouselItem
} from 'reactstrap';



const Banner = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const { items, seller_banner } = props;

  // console.log('items', items)

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.filter((d)=>d.index == 5).length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.filter((d)=>d.index == 5).length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }
  

  const slides = items.filter((d)=>d.index == 5).map((item) => {
    return (
        <CarouselItem
          onExiting={() => setAnimating(true)}
          onExited={() => setAnimating(false)}
          key={seller_banner ? item.index : item.src}
          > 
          <a href={seller_banner ? '' : item.link}>
            <img src={seller_banner ? item.image: item.image} className="w-100" alt={item.alt_image ? item.alt_image : "ศูนย์หนังสือจุฬาฯ"} />
            {/* <CarouselCaption captionText={item.caption} captionHeader={item.caption} /> */}
          </a>
        </CarouselItem>
    );
  });

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
    >
      <CarouselIndicators items={items.filter((d)=>d.index == 5)} activeIndex={activeIndex} onClickHandler={goToIndex} />
      {slides}
      <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
    </Carousel>
  );
}

export default Banner;