import React, { useEffect, useRef, useState } from 'react';
import { Typography, Spin, message, Rate, Button } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LeftOutlined, RightOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAddToCart } from '../../hooks/useCart';


const { Title, Text } = Typography;

const NewProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { mutate: addToCart } = useAddToCart();
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

  const sortedVariants = [...variants].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <div style={{ padding: '40px 20px' }}>
      <Title level={2} style={{ textAlign: 'center', fontSize: '20px', marginBottom: 10 }}>
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

      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      ) : sortedVariants.length === 0 ? (
        <div style={{ textAlign: 'center' }}>Không có sản phẩm nào</div>
      ) : (
        <div style={{ position: 'relative' }}>
          {/* Nút trái */}
          <Button
            shape="circle"
            size="small"
            icon={<LeftOutlined />}
            onClick={() => {
              if (sliderRef.current) {
                sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: 'smooth' });
              }
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          />

          {/* Nút phải */}
          <Button
            shape="circle"
            size="small"
            icon={<RightOutlined />}
            onClick={() => {
              if (sliderRef.current) {
                sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: 'smooth' });
              }
            }}
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          />
          <div
            ref={sliderRef}
            style={{
              display: 'flex',
              overflowX: 'hidden',
              scrollBehavior: 'smooth',
            }}
          >
            {sortedVariants.slice(0, 10).map((variant) => {
              const currentColorId = typeof variant.color === 'object' ? variant.color._id : null;
              const sameProductVariants = variants.filter(
                (v) =>
                  (v.product_id?._id || v.product_id) === (variant.product_id?._id || variant.product_id)
              );

              // Ưu tiên đưa biến thể hiện tại lên đầu
              const sortedByCurrentFirst = [
                ...sameProductVariants.filter((v) => (v.color?._id || v.color) === currentColorId),
                ...sameProductVariants.filter((v) => (v.color?._id || v.color) !== currentColorId),
              ];
              const product = products.find(
                (p) => p._id === (variant.product_id?._id || variant.product_id)
              );
              if (!product) return null;
              
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
                    className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block h-[370px]"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
                          e.stopPropagation();
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
                      <Text strong>
                        {product.name}
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
                    <div className="mt-1 pt-[6px] flex justify-center items-center gap-1 h-5">
                      <Rate
                        disabled
                        allowHalf
                        value={variant.averageRating || 0}
                        style={{ fontSize: 14 }}
                      />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProducts;
