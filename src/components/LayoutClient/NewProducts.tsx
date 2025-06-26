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
      axios.get('http://localhost:8080/api/products?limit=4'),
      axios.get('http://localhost:8080/api/variants')
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

  // Hàm lấy giá thấp nhất từ variants của product
  const getMinVariantPrice = (product: any) => {
    if (!Array.isArray(product.variants) || product.variants.length === 0) return null;
    // Lọc ra các variant object thuộc về product này
    const productVariants = variants.filter(
      (v) => product.variants.includes(v._id)
    );
    if (productVariants.length === 0) return null;
    const prices = productVariants.map((v) => v.price).filter((p) => typeof p === 'number');
    if (prices.length === 0) return null;
    return Math.min(...prices);
  };

  // Hàm lấy ảnh từ variant đầu tiên (ưu tiên ảnh variant, fallback ảnh sản phẩm)
  const getDisplayImage = (product: any) => {
    if (!Array.isArray(product.variants) || product.variants.length === 0) {
      return product.images?.[0] || 'https://picsum.photos/200';
    }
    const productVariants = variants.filter(
      (v) => product.variants.includes(v._id)
    );
    const variantWithImage = productVariants.find(
      (v) => Array.isArray(v.image_url) && v.image_url.length > 0
    );
    if (variantWithImage) {
      return variantWithImage.image_url[0];
    }
    return product.images?.[0] || 'https://picsum.photos/200';
  };

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
      ) : products.length === 0 ? (
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
          {products.map((product) => {
            const minPrice = getMinVariantPrice(product);
            const displayPrice =
              typeof minPrice === 'number'
                ? `${minPrice.toLocaleString('vi-VN')}₫`
                : 'Giá đang cập nhật';

            return (
              <div
                key={product._id}
                style={{
                  flex: '0 0 25%',
                  padding: '0 8px',
                  minWidth: 250,
                }}
              >
                <Link to={`/products/${product._id}`}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={getDisplayImage(product)}
                        style={{ height: 200, objectFit: 'contain', padding: 10 }}
                      />
                    }
                    style={{ textAlign: 'center' }}
                  >
                    <Text style={{ display: 'block', marginBottom: 8 }}>{product.name}</Text>
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

export default NewProducts;
