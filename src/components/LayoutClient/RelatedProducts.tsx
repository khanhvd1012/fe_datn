import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Spin, message } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const RelatedProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:3000/api/products?limit=4'),
      axios.get('http://localhost:3000/api/variants')
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
  }, [variants]);

  return (
    <div style={{ padding: '40px 20px' }}>
      <Title level={2} style={{ textAlign: 'center', fontSize: '20px', marginBottom: 8 }}>
        <span style={{ display: 'inline-block', paddingBottom: 4, position: 'relative' }}>
          Sản phẩm liên quan
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
        <Text type="secondary" style={{ fontSize: 12 }}>Tự động trượt qua sản phẩm</Text>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}><Spin /></div>
      ) : variants.length === 0 ? (
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
          {variants.map((variant) => {
            const product = products.find((p) => p.variants.includes(variant._id));
            if (!product) return null;

            const displayImage =
              Array.isArray(variant.image_url) && variant.image_url.length > 0
                ? variant.image_url[0]
                : product.images?.[0] || 'https://picsum.photos/200';

            const displayPrice =
              typeof variant.price === 'number'
                ? `${variant.price.toLocaleString('en-US')}$`
                : 'Giá đang cập nhật';

            return (
              <div
                key={variant._id}
                style={{
                  flex: '0 0 10%',
                  padding: '0 10px',
                  minWidth: 250,
                  marginBottom: 20
                }}
              >
                <Link to={`/products/${product.slug}`} state={{ variantId: variant._id }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={displayImage}
                        style={{ objectFit: 'contain' }}
                      />
                    }
                    style={{ textAlign: 'center' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                      <Text style={{ fontWeight: 500 }}>{product.name} - {variant.color?.name}</Text>
                    </div>
                    <Text strong>{displayPrice}</Text>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
