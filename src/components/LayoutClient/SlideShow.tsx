// Slideshow.tsx
import React from 'react';
import { Carousel } from 'antd';
import styled from 'styled-components';

const SlideContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden;

  .slick-dots-bottom {
    bottom: 16px;
  }

  .slick-prev,
  .slick-next {
    width: 40px;
    height: 40px;
    z-index: 1;
  }

  .slick-prev:before,
  .slick-next:before {
    font-size: 20px;
    color: #000;
  }
`;

const SlideImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const Slideshow: React.FC = () => {
  return (
    <SlideContainer>
      <Carousel autoplay autoplaySpeed={3000} arrows>
        <div>
          <SlideImage
            src="https://i1252.photobucket.com/albums/hh579/Shopburin/banner01_zpsddaf983d.jpg"
            alt="Slide 1"
          />
        </div>
        <div>
          <SlideImage
            src="https://file.hstatic.net/1000230642/collection/3_da9a91027cd0488581c18e767bd6e453.jpg"
            alt="Slide 2"
          />
        </div>
      </Carousel>
    </SlideContainer>
  );
};

export default Slideshow;
