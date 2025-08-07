import { useEffect, useRef, useState } from 'react';
import { Typography, Spin, message, Rate } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAddToCart } from '../../hooks/useCart';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RelatedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { mutate: addToCart } = useAddToCart();

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
      <Title level={2} style={{ textAlign: 'center', fontSize: '20px', marginBottom: 10 }}>
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
            if (!variant._id) return null;
            const product = products.find((p) =>
              Array.isArray(p.variants) && p.variants.includes(variant._id)
            );
            if (!product) return null;

            const currentColorId = typeof variant.color === 'object' ? variant.color._id : variant.color;

            const sameProductVariants = variants.filter((v) => {
              const pid = typeof v.product_id === 'object' ? v.product_id._id : v.product_id;
              const cid = typeof v.color === 'object' ? v.color._id : v.color;
              return pid === product._id && cid;
            });

            const sortedByCurrentFirst = sameProductVariants.sort((a, b) => {
              const aColorId = typeof a.color === 'object' ? a.color._id : a.color;
              const bColorId = typeof b.color === 'object' ? b.color._id : b.color;
              if (aColorId === currentColorId) return -1;
              if (bColorId === currentColorId) return 1;
              return 0;
            });

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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
