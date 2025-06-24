import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Spin, message } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

interface Product {
  _id: string;
  name: string;
  price?: number; // ✅ thêm ? để tránh lỗi undefined
  images?: string[]; // ✅ thêm ? vì có thể không có
}

const NewProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/products?limit=4')
      .then((res) => {
        console.log('New Products:', res.data);
        // ✅ chỉ nhận sản phẩm hợp lệ có price là số
        const filtered = (res.data?.data?.products || []).filter(
          (p: Product) => p && typeof p.price === 'number'
        );
        setProducts(filtered);
      })
      .catch(() => {
        message.error('Không thể tải sản phẩm');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Auto slide
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
      ) : (
        <div
          ref={sliderRef}
          style={{
            display: 'flex',
            overflowX: 'hidden',
            scrollBehavior: 'smooth',
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                flex: '0 0 25%',
                padding: '0 8px',
                minWidth: 250,
              }}
            >
              <Card
                hoverable
                cover={
                  <img
                    alt={product.name}
                    src={product.images?.[0] || 'https://picsum.photos/200'}
                    style={{ height: 200, objectFit: 'contain', padding: 10 }}
                  />
                }
                style={{ textAlign: 'center' }}
              >
                <Text style={{ display: 'block', marginBottom: 8 }}>{product.name}</Text>
                <Text strong>
                  {typeof product.price === 'number'
                    ? `${product.price.toLocaleString('vi-VN')}₫`
                    : 'Giá đang cập nhật'}
                </Text>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewProducts;
