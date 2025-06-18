// Gallery.tsx
import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 40px 20px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 20px; /* nhỏ hơn */
  margin-bottom: 16px;
  font-weight: 600;
  position: relative;
  display: inline-block;
  text-align: center;
  

  &::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 25%;
    width: 50%;
    height: 2px;
    background-color: #000;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 32px;
`;

const GridImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Gallery: React.FC = () => {
  const images = [
    'https://img.lovepik.com/png/20231111/nike-clipart-cartoon-nike-logo-graphic-vector-cartoon-illustration-of_559741_wh1200.png',
    'https://img.lovepik.com/png/20231120/nike-air-dunk-high-orange-shoe-vector-illustration-clipart-nike_642233_wh1200.png',
    'https://png.pngtree.com/png-vector/20241217/ourlarge/pngtree-nike-mens-gymnastics-shoes-png-image_14788807.png',
    'https://img.lovepik.com/png/20231117/cartoon-illustration-of-a-nike-air-max-shoe-vector-clipart_613988_wh1200.png',
    'https://img.lovepik.com/png/20231120/nike-air-force-90-mid-retro-vector-design-illustration-vektor_642190_wh300.png',
    'https://img.lovepik.com/element/45007/8123.png_300.png',
  ];

  return (
    <Section>
      <Title>Khách hàng và SneakerTrend</Title>
      <ImageGrid>
        {images.map((src, index) => (
          <GridImage key={index} src={src} alt={`Gallery image ${index + 1}`} />
        ))}
      </ImageGrid>
    </Section>
  );
};

export default Gallery;
