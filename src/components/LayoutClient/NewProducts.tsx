import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Typography, Spin, message, Rate, Button } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LeftOutlined, RightOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAddToCart } from '../../hooks/useCart';
import { useReviews } from '../../hooks/useReview';

const { Title, Text } = Typography;

const getId = (field: any) => (typeof field === 'object' ? field?._id : field);

const NewProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { mutate: addToCart } = useAddToCart();
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();
  const sliderRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };
  // Fetch products & variants
  useEffect(() => {
    (async () => {
      try {
        const [prodRes, varRes] = await Promise.all([
          axios.get('http://localhost:3000/api/products?limit=4'),
          axios.get('http://localhost:3000/api/variants'),
        ]);
        setProducts(prodRes.data?.data?.products || []);
        setVariants(varRes.data?.data || []);
      } catch {
        message.error('Không thể tải sản phẩm hoặc biến thể');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Scroll auto
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const startScroll = () => {
      interval = setInterval(() => {
        if (!sliderRef.current) return;
        const { offsetWidth, scrollLeft, scrollWidth } = sliderRef.current;
        if (scrollLeft + offsetWidth >= scrollWidth) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: offsetWidth, behavior: 'smooth' });
        }
      }, 3000);
    };
    const stopScroll = () => clearInterval(interval);

    const container = sliderRef.current;
    container?.addEventListener('mouseenter', stopScroll);
    container?.addEventListener('mouseleave', startScroll);

    startScroll();
    return () => {
      stopScroll();
      container?.removeEventListener('mouseenter', stopScroll);
      container?.removeEventListener('mouseleave', startScroll);
    };
  }, [variants]);

  // Rating memoized
  const ratingsMap = useMemo(() => {
    const map: Record<string, number> = {};
    reviews.forEach(r => {
      const vid = getId(r.order_item?.variant_id);
      if (!vid) return;
      map[vid] = (map[vid] || 0) + r.rating;
    });
    return map;
  }, [reviews]);

  const sortedVariants = useMemo(
    () => [...variants].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [variants]
  );

  if (loadingReviews) return <div className="text-center py-10"><Spin /></div>;

  return (
    <div style={{ padding: '40px 20px' }}>
      <Title level={2} style={{ textAlign: 'center', fontSize: 20, marginBottom: 10 }}>
        <span style={{ display: 'inline-block', paddingBottom: 4, position: 'relative' }}>
          Sản phẩm mới
          <span style={{
            position: 'absolute', left: '25%', bottom: 0, width: '50%',
            borderBottom: '2px solid black', transform: 'translateY(100%)'
          }} />
        </span>
      </Title>

      <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 30 }}>
        <Link to="/products?tab=newest">
          <Text type="secondary" style={{ fontSize: 12 }}>
            Xem thêm
          </Text>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}><Spin /></div>
      ) : sortedVariants.length === 0 ? (
        <div style={{ textAlign: 'center' }}>Không có sản phẩm nào</div>
      ) : (
        <div style={{ position: 'relative' }}>
          <Button
            shape="circle" size="small" icon={<LeftOutlined />}
            onClick={() => sliderRef.current?.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: 'smooth' })}
            style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 2 }}
          />
          {/* Nút phải */}
          <Button
            shape="circle" size="small" icon={<RightOutlined />}
            onClick={() => sliderRef.current?.scrollBy({ left: sliderRef.current.offsetWidth, behavior: 'smooth' })}
            style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 2 }}
          />
          <div ref={sliderRef} style={{ display: 'flex', overflowX: 'hidden', scrollBehavior: 'smooth' }}>
            {sortedVariants.slice(0, 10).map(variant => {
              const currentColorId = getId(variant.color);
              const sameProductVariants = variants.filter(v => getId(v.product_id) === getId(variant.product_id));
              const sortedByCurrentFirst = [
                ...sameProductVariants.filter(v => getId(v.color) === currentColorId),
                ...sameProductVariants.filter(v => getId(v.color) !== currentColorId),
              ];
              const product = products.find(p => p._id === getId(variant.product_id));
              if (!product) return null;

              return (
                <div key={variant._id} style={{ flex: '0 0 auto', width: 250, padding: '0 10px', marginBottom: 20 }}>
                  <Link to={`/products/${product.slug}`} state={{ variantId: variant._id }}
                    className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block h-[370px]"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <div className="relative">
                      <img src={variant.image_url?.[0] || 'https://picsum.photos/200'}
                        alt={product.name} className="w-full h-48 object-cover rounded-md" />
                      <div className="absolute top-2 right-2 z-10">
                        <div
                          onClick={e => {
                            e.preventDefault();

                            if (!isLoggedIn()) {
                              import("antd").then(({ message }) => {
                                message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
                              });
                              return;
                            }

                            if (variant.stock?.status === "outOfStock" || (variant.stock?.quantity ?? 0) <= 0) {
                              import("antd").then(({ message }) => {
                                message.error("Sản phẩm này đã hết hàng!");
                              });
                              return;
                            }

                            if (variant.status === "paused") {
                              import("antd").then(({ message }) => {
                                message.warning("Sản phẩm này đang tạm ngưng bán!");
                              });
                              return;
                            }

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
                          <div key={idx} className="w-4 h-4 rounded-full border"
                            style={{
                              backgroundColor: colorObj?.code || '#ccc',
                              borderColor: colorObj?._id === currentColorId ? 'black' : '#ccc',
                            }}
                          />
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-[9px]"><Text strong>{product.name}</Text></div>
                    <div className="mt-1 pt-[4px]">
                      <Text type="secondary" style={{ color: 'black' }}>
                        {typeof variant.price === 'number'
                          ? variant.price.toLocaleString('vi-VN') + 'đ'
                          : 'Giá đang cập nhật'}
                      </Text>
                    </div>
                    <div className="mt-1 pt-[6px] flex justify-center items-center gap-1 h-5">
                      <Rate disabled allowHalf value={ratingsMap[variant._id!] || 0} style={{ fontSize: 14 }} />
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
