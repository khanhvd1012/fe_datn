import React, { useEffect, useRef } from 'react';
import { Typography, Spin, Rate } from 'antd';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTopSellingVariants } from '../../hooks/useVariants';
import { getProducts } from '../../service/productAPI';
import type { IVariant } from '../../interface/variant';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useAddToCart } from '../../hooks/useCart';

const { Title, Text } = Typography;

const BestSellingProducts = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { mutate: addToCart } = useAddToCart();
  const { data: variants = [], isLoading: loadingVariants } = useTopSellingVariants();
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const productMap = new Map<string, any>();
  products.forEach((p) => {
    p.variants?.forEach((v: any) => {
      if (typeof v === 'string') {
        productMap.set(v, p);
      }
    });
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startScroll = () => {
      interval = setInterval(() => {
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
    };

    const container = sliderRef.current;
    if (container) {
      container.addEventListener('mouseenter', () => clearInterval(interval));
      container.addEventListener('mouseleave', startScroll);
    }

    startScroll();

    return () => {
      clearInterval(interval);
      if (container) {
        container.removeEventListener('mouseenter', () => clearInterval(interval));
        container.removeEventListener('mouseleave', startScroll);
      }
    };
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
      <Title level={2} style={{ textAlign: 'center', fontSize: '20px', marginBottom: 10 }}>
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

      <div
        ref={sliderRef}
        style={{ display: 'flex', overflowX: 'hidden', scrollBehavior: 'smooth' }}
      >
        {variants.map((variant: IVariant) => {
          const product = productMap.get(variant._id ?? '');
          if (!product) return null;

          const currentColorId = typeof variant.color === 'object' ? variant.color._id : variant.color;

          const sameProductVariants = variants.filter(
            (v) => {
              const pid = typeof v.product_id === 'object' ? v.product_id._id : v.product_id;
              const cid = typeof v.color === 'object' ? v.color._id : v.color;
              return pid === product._id && cid;
            }
          );

          const sortedByCurrentFirst = sameProductVariants.sort((a, b) => {
            const aColorId = typeof a.color === 'object' ? a.color._id : a.color;
            const bColorId = typeof b.color === 'object' ? b.color._id : b.color;
            return aColorId === currentColorId ? -1 : bColorId === currentColorId ? 1 : 0;
          });

          return (
            <Link
              to={`/products/${product.slug}`}
              key={variant._id}
              className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block h-[370px]"
              state={{ variantId: variant._id }}
            >
              <div className="relative">
                <img
                  src={variant.image_url?.[0] || 'https://picsum.photos/200'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md"
                />

                <div className="absolute top-2 right-2 z-10">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({ variant_id: variant._id!, quantity: 1 });
                    }}
                    className="w-10 h-10 rounded-full bg-white bg-opacity-70 text-black flex justify-center items-center cursor-pointer hover:scale-110 transition"
                  >
                    <ShoppingCartOutlined />
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center gap-1 mt-2 pt-[9px]">
                {sortedByCurrentFirst.map((v, idx) => {
                  const colorObj = typeof v.color === 'object' ? v.color : null;
                  return (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border"
                      style={{
                        backgroundColor: colorObj?.code || '#ccc',
                        borderColor: colorObj?._id === currentColorId ? 'black' : '#ccc',
                      }}
                    />
                  );
                })}
              </div>
              <div className="mt-3 pt-[9px]">
                <Text strong>{product.name}</Text>
              </div>
              <div className="mt-1 pt-[9px]">
                <Text style={{ color: 'black' }}>
                  {variant.price?.toLocaleString('vi-VN')}đ
                </Text>
              </div>
              <div className="mt-1 pt-[6px] flex justify-center items-center gap-1 h-5">
                <Rate
                  disabled
                  allowHalf
                  value={variant.averageRating || 0}
                  style={{ fontSize: 14 }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BestSellingProducts;
