import React from 'react';
import styled from 'styled-components';

const banners = [
  {
    title: 'ĐẠI SỨ THƯƠNG HIỆU',
    subtitle: 'Bộ sưu tập',
    image: 'https://picsum.photos/600/600?random=1',
  },
  {
    title: 'THƯƠNG HIỆU',
    subtitle: 'Bộ sưu tập',
    image: 'https://picsum.photos/600/600?random=2',
  },
  {
    title: 'BLOG',
    subtitle: 'Bộ sưu tập',
    image: 'https://picsum.photos/600/600?random=3',
  },
];

const BannerSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 40px 0;
  flex-wrap: wrap;
`;

const BannerCard = styled.div<{ background: string }>`
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1 / 1; /* Vuông */
  background-image: url(${(props) => props.background});
  background-size: cover;
  background-position: center;
  position: relative;
  font-family: 'Quicksand', sans-serif;
  overflow: hidden;
`;

const BannerContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: black;
`;

const Subtitle = styled.p`
  font-size: 13px;
  margin: 0;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 4px 0;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 25%;
    width: 50%;
    height: 2px;
    background-color: #000;
  }
`;

const BrandBanner = () => {
  return (
    <BannerSection>
      {banners.map((item, index) => (
        <BannerCard key={index} background={item.image}>
          <BannerContent>
            <Subtitle>{item.subtitle}</Subtitle>
            <Title>{item.title}</Title>
          </BannerContent>
        </BannerCard>
      ))}
    </BannerSection>
  );
};

export default BrandBanner;
