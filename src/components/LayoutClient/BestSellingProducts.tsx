import React, { useEffect, useRef } from 'react';
import { Typography, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTopSellingVariants } from '../../hooks/useVariants';
import { getProducts } from '../../service/productAPI';
import type { IVariant } from '../../interface/variant';

const { Title, Text } = Typography;

const BestSellingProducts: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data: variants = [], isLoading: loadingVariants } = useTopSellingVariants();
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const container = sliderRef.current;
        const scrollAmount = container.offsetWidth;
        if (container.scrollLeft + scrollAmount >= container.scrollWidth) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [variants]);

  if (loadingVariants || loadingProducts) {
    return (
      <div className="text-center py-10">
        <Spin />
      </div>
    );
  }

  return (
    <div className="px-5 py-10">
      <Title level={2} style={{ textAlign: 'center', fontSize: '20px', marginBottom: 20 }}>
        <span style={{ display: 'inline-block', paddingBottom: 4, position: 'relative' }}>
          Sản phẩm bán chạy
          <span
            style={{
              position: 'absolute',
              left: '25%',
              bottom: 0,
              width: '50%',
              borderBottom: '2px solid black',
              transform: 'translateY(100%)',
            }}
          />
        </span>
      </Title>

      <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 30 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Tự động trượt qua sản phẩm
        </Text>
      </div>

      <div
        ref={sliderRef}
        style={{ display: 'flex', overflowX: 'hidden', scrollBehavior: 'smooth' }}
      >
        {variants.map((variant: IVariant) => {
          const product = products.find((p) =>
            Array.isArray(p.variants) &&
            p.variants.some((v: any) => typeof v === 'string' && v === variant._id)
          );
          if (!product) return null;

          return (
            <Link
              to={`/products/${product.slug}`}
              key={variant._id}
              className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block h-[340px] min-w-[250px] mx-2 mb-5"
              state={{ variantId: variant._id }}
            >
              <img
                src={
                  variant.image_url?.[0] || 'https://picsum.photos/200'
                } alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="mt-3 pt-[9px]">
                <Text strong>{product.name}</Text>
              </div>
              <div className="mt-1 pt-[9px]">
                <Text style={{ color: 'black' }}>
                  {variant.price?.toLocaleString('vi-VN')}đ
                </Text>
              </div>
              <div className="mt-1">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Đã bán: {variant.totalSold}
                </Text>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BestSellingProducts;
