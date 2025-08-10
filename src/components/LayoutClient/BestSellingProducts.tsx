import React, { useEffect, useRef } from 'react';
import { Typography, Spin, Rate } from 'antd';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTopSellingVariants } from '../../hooks/useVariants';
import { getProducts } from '../../service/productAPI';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useAddToCart } from '../../hooks/useCart';
import { useReviews } from '../../hooks/useReview';
import type { IReview } from '../../interface/review';

const { Title, Text } = Typography;

const BestSellingProducts = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { mutate: addToCart } = useAddToCart();
  const { data: variants = [], isLoading: loadingVariants } = useTopSellingVariants();
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();
  console.log('reviews:', reviews);

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const getAverageRatingForVariant = (variantId: string, reviews: IReview[]) => {
    const relatedReviews = reviews.filter(r => {
      const variant = r.order_item?.variant_id;
      const variantIdInReview = typeof variant === 'string' ? variant : variant?._id;
      return variantIdInReview === variantId;
    });

    if (relatedReviews.length === 0) return 0;

    const total = relatedReviews.reduce((sum, r) => sum + r.rating, 0);
    return total / relatedReviews.length;
  };

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

  const sortedVariants = [...variants].sort((a, b) => {
    const dateA = new Date(a.createdAt!).getTime();
    const dateB = new Date(b.createdAt!).getTime();
    return dateB - dateA;
  });

  if (loadingVariants || loadingProducts || loadingReviews) {
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
        {sortedVariants.slice(0, 10).map((variant) => {
          const variantProductId =
            typeof variant.product_id === "string"
              ? variant.product_id
              : variant.product_id?._id;

          const product = products.find((p) => p._id === variantProductId);
          if (!product) return null;

          const currentColorId =
            typeof variant.color === "object" ? variant.color._id : variant.color;

          const sameProductVariants = variants.filter(
            (v) => (typeof v.product_id === "string" ? v.product_id : v.product_id?._id) === variantProductId
          );

          // Lọc màu duy nhất
          const uniqueColorVariants = sameProductVariants.filter(
            (v, index, self) => {
              const vColorId = typeof v.color === "object" ? v.color._id : v.color;
              return (
                index ===
                self.findIndex((t) => {
                  const tColorId =
                    typeof t.color === "object" ? t.color._id : t.color;
                  return tColorId === vColorId;
                })
              );
            }
          );

          // Đưa màu hiện tại lên đầu
          const sortedByCurrentFirst = [
            ...uniqueColorVariants.filter(
              (v) =>
                (typeof v.color === "object" ? v.color._id : v.color) === currentColorId
            ),
            ...uniqueColorVariants.filter(
              (v) =>
                (typeof v.color === "object" ? v.color._id : v.color) !== currentColorId
            ),
          ];

          const rating = getAverageRatingForVariant(variant._id!, reviews);

          return (
            <div
              key={variant._id}
              style={{
                flex: "0 0 auto",
                width: 250,
                padding: "0 10px",
                marginBottom: 20,
              }}
            >
              <Link
                to={`/products/${product.slug}`}
                state={{ variantId: variant._id }}
                className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block h-[370px]"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="relative">
                  <img
                    src={variant.image_url?.[0] || "https://picsum.photos/200"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({ variant_id: variant._id!, quantity: 1 });
                      }}
                      className="w-10 h-10 rounded-full bg-white bg-opacity-70 text-black flex justify-center items-center cursor-pointer hover:scale-110 transition"
                    >
                      <ShoppingCartOutlined />
                    </div>
                  </div>
                </div>

                {/* Màu sắc */}
                <div className="flex justify-center items-center gap-1 mt-2 pt-[9px]">
                  {sortedByCurrentFirst.map((v, idx) => {
                    const colorObj = typeof v.color === "object" ? v.color : null;
                    return (
                      <div
                        key={idx}
                        className="w-4 h-4 rounded-full border"
                        style={{
                          backgroundColor: colorObj?.code || "#ccc",
                          borderColor:
                            colorObj?._id === currentColorId ? "black" : "#ccc",
                        }}
                      />
                    );
                  })}
                </div>

                <div className="mt-3 pt-[9px]">
                  <Text strong>{product.name}</Text>
                </div>
                <div className="mt-1 pt-[9px]">
                  <Text type="secondary" style={{ color: "black" }}>
                    {typeof variant.price === "number"
                      ? variant.price.toLocaleString("vi-VN") + "đ"
                      : "Giá đang cập nhật"}
                  </Text>
                </div>
                <div className="mt-1 pt-[6px] flex justify-center items-center gap-1 h-5">
                  <Rate
                    disabled
                    allowHalf
                    value={rating}
                    style={{ fontSize: 14 }}
                  />
                </div>
              </Link>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default BestSellingProducts;
