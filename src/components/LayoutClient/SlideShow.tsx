import { Carousel, Spin } from 'antd';
import styled from 'styled-components';
import { useBanners } from '../../hooks/useBanner';

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
    z-index: 2;
  }

  .slick-prev:before,
  .slick-next:before {
    font-size: 24px;
    color: black;
    opacity: 1;
  }
`;


const SlideImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover; 
  object-position: center;
  display: block;
`;

const Slideshow = () => {
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
      <Carousel autoplay autoplaySpeed={2000}>
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
