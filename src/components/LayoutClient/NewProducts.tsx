import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Spin, message } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const NewProducts: React.FC = () => {
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
  }, [products]);

  // Lọc ra các biến thể thuộc về các sản phẩm mới
  const latestProductIds = products.map(p => p._id);
  const latestVariants = variants.filter(v =>
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
        <Text type="secondary" style={{ fontSize: 12 }}>Tự động trượt qua sản phẩm</Text>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}><Spin /></div>
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
                      <div
                        style={{
                          height: 200,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}
                      >
                        <img
                          alt={product.name}
                          src={
                            Array.isArray(variant.image_url) && variant.image_url.length > 0
                              ? variant.image_url[0]
                              : product.images?.[0] || 'https://picsum.photos/200'
                          }
                          style={{
                            marginTop: 2,
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            display: 'block',
                          }}
                        />
                      </div>
                    }
                    style={{
                      textAlign: 'center',
                      height: 340,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        height: 48,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ fontWeight: 500 }}>{product.name} - {variant.color?.name}</Text>
                    </div>
                    <Text strong>{variant.price?.toLocaleString('en-US')}$</Text>
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

export default NewProducts;
