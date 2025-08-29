import { useEffect, useRef } from 'react';
import { Typography, Spin, Rate, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTopSellingVariants } from '../../hooks/useVariants';
import { getProducts } from '../../service/productAPI';
import { LeftOutlined, RightOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAddToCart } from '../../hooks/useCart';
import { useReviews } from '../../hooks/useReview';

const { Title, Text } = Typography;

const BestSellingProducts = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { mutate: addToCart } = useAddToCart();
  const { data: variants = [], isLoading: loadingVariants } = useTopSellingVariants();
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };

  const getAverageRatingForVariant = (variantId: string) => {
    const related = reviews.filter(r => {
      const variant = r.order_item?.variant_id;
      return (typeof variant === 'string' ? variant : variant?._id) === variantId;
    });
    return related.length
      ? related.reduce((sum, r) => sum + r.rating, 0) / related.length
      : 0;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const startScroll = () => {
      interval = setInterval(() => {
        if (sliderRef.current) {
          const { offsetWidth, scrollLeft, scrollWidth } = sliderRef.current;
          if (scrollLeft + offsetWidth >= scrollWidth) {
            sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            sliderRef.current.scrollBy({ left: offsetWidth, behavior: 'smooth' });
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

  if (loadingVariants || loadingProducts || loadingReviews) {
    return <div className="text-center py-10"><Spin /></div>;
  }

  const sortedVariants = [...variants]
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 10);

  return (
    <div className="px-5 py-10">
      <Title level={2} style={{ textAlign: 'center', fontSize: '20px', marginBottom: 10 }}>
        <span style={{ display: 'inline-block', paddingBottom: 4, position: 'relative' }}>
          Sản phẩm bán chạy
          <span style={{
            position: 'absolute', left: '25%', bottom: 0, width: '50%',
            borderBottom: '2px solid black', transform: 'translateY(100%)',
          }} />
        </span>
      </Title>
      <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 30 }}>
        <Link to="/products?tab=top-selling">
          <Text type="secondary" style={{ fontSize: 12 }}>
            Xem thêm
          </Text>
        </Link>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Nút trái */}
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
          {sortedVariants.map(variant => {
            const product = products.find(p =>
              p._id === (typeof variant.product_id === 'string' ? variant.product_id : variant.product_id?._id)
            );
            if (!product) return null;

            const currentColorId = typeof variant.color === 'object' ? variant.color._id : variant.color;
            const sameProductVariants = variants.filter(v =>
              (typeof v.product_id === 'string' ? v.product_id : v.product_id?._id) === product._id
            );
            const uniqueColors = sameProductVariants.filter((v, i, self) => {
              const colorId = typeof v.color === 'object' ? v.color._id : v.color;
              return i === self.findIndex(t => (typeof t.color === 'object' ? t.color._id : t.color) === colorId);
            });
            const sortedColors = [
              ...uniqueColors.filter(v => (typeof v.color === 'object' ? v.color._id : v.color) === currentColorId),
              ...uniqueColors.filter(v => (typeof v.color === 'object' ? v.color._id : v.color) !== currentColorId),
            ];

            return (
              <div key={variant._id} style={{ flex: '0 0 auto', width: 250, padding: '0 10px', marginBottom: 20 }}>
                <Link
                  to={`/products/${product.slug}`} state={{ variantId: variant._id }}
                  className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block h-[370px]"
                >
                  <div className="relative">
                    <img src={variant.image_url?.[0] || 'https://picsum.photos/200'} alt={product.name}
                      className="w-full h-48 object-cover rounded-md" />
                    <div className="absolute top-2 right-2 z-10"
                      onClick={e => {
                        e.preventDefault();

                        if (!isLoggedIn()) {
                          import("antd").then(({ message }) => {
                            message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
                          });
                          return;
                        }
                        addToCart({ variant_id: variant._id!, quantity: 1 });
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-white bg-opacity-70 text-black flex justify-center items-center cursor-pointer hover:scale-110 transition">
                        <ShoppingCartOutlined />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-1 mt-2 pt-[9px]">
                    {sortedColors.map((v, idx) => {
                      const colorObj = typeof v.color === 'object' ? v.color : null;
                      return (
                        <div key={idx} className="w-4 h-4 rounded-full border"
                          style={{
                            backgroundColor: colorObj?.code || '#ccc',
                            borderColor: colorObj?._id === currentColorId ? 'black' : '#ccc',
                          }} />
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-[9px]"><Text strong>{product.name}</Text></div>
                  <div className="mt-1 pt-[4px]"><Text>{variant.price?.toLocaleString('vi-VN') + 'đ'}</Text></div>
                  <div className="mt-1 flex justify-center pt-[6px]"><Rate disabled allowHalf value={getAverageRatingForVariant(variant._id!)} style={{ fontSize: 14 }} /></div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export default BestSellingProducts;
