import styled from 'styled-components';
import { useBrands } from '../../hooks/useBrands';
import { NavLink } from 'react-router-dom';
import type { IBrand } from '../../interface/brand';

const BannerSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 40px 0;
  flex-wrap: wrap;
`;

const BannerCard = styled(NavLink)`
  flex: 1 1 calc(32% - 20px);
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid #e0e0e0; 
  cursor: pointer;
  background-color: #ffffff;
  transition: transform 0.4s ease, border-color 0.3s ease;

  &:hover {
    transform: scale(1.03);
    border-color: #e6e6e6; 
  }

  @media (max-width: 1024px) {
    flex: 1 1 calc(48% - 16px);
  }

  @media (max-width: 640px) {
    flex: 1 1 100%;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.85; /* Làm logo mờ nhẹ để chữ nổi hơn */
`;

const BannerContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
  text-align: center;
  font-family: 'Quicksand', sans-serif;
  color: #ffffff;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.7); /* Làm chữ nổi bật trên nền logo */
`;

const Subtitle = styled.p`
  font-size: 13px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 800;
  margin: 4px 0;
  position: relative;
  display: inline-block;
  text-transform: uppercase;
  color: #ffffff;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 25%;
    width: 50%;
    height: 2px;
    background-color: #ffffff;
  }
`;

const slugify = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const BrandBanner = () => {
  const { data: brands = [], isLoading } = useBrands();

  const top3 = (brands as IBrand[]).slice(0, 3);

  return (
    <BannerSection>
      {isLoading ? (
        <p>Đang tải...</p>
      ) : (
        top3.map((brand) => (
          <BannerCard key={brand._id} to={`/collection/${slugify(brand.name)}`}>
            <Image src={brand.logo_image || '/no-image.jpg'} alt={brand.name} />
            <BannerContent>
              <Subtitle>Thương hiệu</Subtitle>
              <Title>{brand.name}</Title>
            </BannerContent>
          </BannerCard>
        ))
      )}
    </BannerSection>
  );
};

export default BrandBanner;
