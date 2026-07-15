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
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }
  

  const slides = items.map((item) => {
    return (
        <CarouselItem
          onExiting={() => setAnimating(true)}
          onExited={() => setAnimating(false)}
          key={seller_banner ? item.index : item.src}
          > 
          <a href={seller_banner ? '' : item.href}>
            <img src={seller_banner ? item.image: item.src} className="w-100" alt={item.altText ? item.altText : "ศูนย์หนังสือจุฬาฯ"} />
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
      <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
      {slides}
      <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
    </Carousel>
  );
}

export default Banner;