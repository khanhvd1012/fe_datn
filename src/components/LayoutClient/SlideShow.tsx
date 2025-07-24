import React from 'react';
import { Carousel, Spin } from 'antd';
import styled from 'styled-components';
import { useBanners } from '../../hooks/useBanner'; // hoặc đường dẫn tương ứng

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
  object-fit: cover; /* Hoặc contain tùy mục đích */
  object-position: center;
  display: block;
`;

const Slideshow: React.FC = () => {
  const { data: banners, isLoading } = useBanners();

  if (isLoading) {
    return (
      <SlideContainer>
        <Spin tip="Đang tải banner..." />
      </SlideContainer>
    );
  }

  // Lọc banner có status là true
  const visibleBanners = banners?.filter((banner) => banner.status);

  return (
    <SlideContainer>
      <Carousel autoplay autoplaySpeed={3000} arrows>
        {visibleBanners?.map((banner) => (
          <div key={banner._id}>
            <SlideImage src={banner.image} alt={banner.title} />
          </div>
        ))}
      </Carousel>
    </SlideContainer>
  );
};

export default Slideshow;
