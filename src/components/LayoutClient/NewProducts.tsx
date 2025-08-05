import React, { useEffect, useRef, useState } from 'react';
import { Typography, Spin, message } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const NewProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:3000/api/products?limit=4'),
      axios.get('http://localhost:3000/api/variants'),
    ])
      .then(([productsRes, variantsRes]) => {
        setProducts(productsRes.data?.data?.products || []);
        setVariants(variantsRes.data?.data || []);
      })
      .catch(() => {
        message.error('Không thể tải sản phẩm hoặc biến thể');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
  }, [products]);

  const latestProductIds = products.map((p) => p._id);
  const latestVariants = variants.filter((v) =>
    latestProductIds.includes(v.product_id?._id || v.product_id)
  );

  return (
    <div style={{ padding: '40px 20px' }}>
      <Title level={2} style={{ textAlign: 'center', fontSize: '20px', marginBottom: 8 }}>
        <span style={{ display: 'inline-block', paddingBottom: 4, position: 'relative' }}>
          Sản phẩm mới
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

      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      ) : latestVariants.length === 0 ? (
        <div style={{ textAlign: 'center' }}>Không có sản phẩm nào</div>
      ) : (
        <div
          ref={sliderRef}
          style={{
            display: 'flex',
            overflowX: 'hidden',
            scrollBehavior: 'smooth',
          }}
        >
          {latestVariants.map((variant) => {
            const product = products.find(
              (p) => p._id === (variant.product_id?._id || variant.product_id)
            );
            if (!product) return null;

            const image =
              Array.isArray(variant.image_url) && variant.image_url.length > 0
                ? variant.image_url[0]
                : product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';

            const colorName = typeof variant.color === 'object' ? variant.color.name : '';

            return (
              <div
                key={variant._id}
                style={{
                  flex: '0 0 auto',
                  width: 250,
                  padding: '0 10px',
                  marginBottom: 20,
                }}
              >
                <Link
                  to={`/products/${product.slug}`}
                  state={{ variantId: variant._id }}
                  className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block h-[340px]"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="mt-3 pt-[9px]">
                    <Text strong>
                      {product.name} - {colorName}
                    </Text>
                  </div>
                  <div className="mt-1 pt-[9px]">
                    <Text type="secondary" style={{ color: 'black' }}>
                      {typeof variant.price === 'number'
                        ? variant.price.toLocaleString('vi-VN', {
                            minimumFractionDigits: 0,
                          }) + 'đ'
                        : 'Giá đang cập nhật'}
                    </Text>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewProducts;
