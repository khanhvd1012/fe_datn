import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, message, Rate, Pagination } from 'antd';
import axios from 'axios';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useBrands } from '../../hooks/useBrands';
import { useCategories } from '../../hooks/useCategories';
import Breadcrumb from './Breadcrumb';
import { useAddToCart } from '../../hooks/useCart';
import { useReviews } from '../../hooks/useReview';
import type { IReview } from '../../interface/review';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';

const slugify = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const CollectionPage = () => {
  const { slug } = useParams();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const { mutate: addToCart } = useAddToCart();
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();
  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const matchedBrand = brands.find((b: any) => slugify(b.name) === slug);
  const matchedCategory = categories.find((c: any) => slugify(c.name) === slug);
  const filterField = matchedBrand ? 'brand' : matchedCategory ? 'category' : null;
  const filterValue = matchedBrand?._id || matchedCategory?._id;

  useEffect(() => {
    if (!filterField || !filterValue) {
      setProducts([]);
      setVariants([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      axios.get(`http://localhost:3000/api/products?${filterField}=${filterValue}`),
      axios.get('http://localhost:3000/api/variants')
    ])
      .then(([productsRes, variantsRes]) => {
        const fetchedProducts = productsRes.data.data.products || [];
        const allVariants = variantsRes.data.data || [];

        const productIds = fetchedProducts.map((p: any) => p._id);
        const filteredVariants = allVariants.filter((v: any) =>
          productIds.includes(
            typeof v.product_id === 'string' ? v.product_id : v.product_id?._id
          )
        );

        setProducts(fetchedProducts);
        setVariants(filteredVariants);
        setLoading(false);
      })
      .catch(() => {
        message.error('Không thể tải dữ liệu sản phẩm hoặc biến thể');
        setLoading(false);
      });
  }, [filterField, filterValue]);

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

  if (loadingReviews) {
    return (
      <div className="text-center py-10">
        <Spin />
      </div>
    );
  }
  return (
    <>
      <Breadcrumb current="Bộ sưu tập" />
      <div style={{ padding: '40px 20px' }}>
        <Title level={2} style={{ textAlign: 'center', fontSize: '20px', marginBottom: 8 }}>
          <span style={{ display: 'inline-block', paddingBottom: 4, position: 'relative' }}>
            {matchedBrand
              ? `Thương hiệu: ${matchedBrand.name}`
              : matchedCategory
                ? `Danh mục: ${matchedCategory.name}`
                : 'Không xác định'}
            <span
              style={{
                position: 'absolute',
                left: '25%',
                bottom: 0,
                width: '50%',
                borderBottom: '2px solid black',
                transform: 'translateY(100%)'
              }}
            />
          </span>
        </Title>

        <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 30 }}>
          <Link
            to="/products"
            state={{
              brands: matchedBrand ? [matchedBrand._id] : [],
              categories: matchedCategory ? [matchedCategory._id] : []
            }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              Xem thêm
            </Text>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        ) : !variants.length ? (
          <div style={{ textAlign: 'center', fontSize: 16, marginTop: 40 }}>
            <Text type="secondary">Không có sản phẩm nào trong bộ sưu tập này.</Text>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            {products.flatMap(product => {
              // Lấy toàn bộ biến thể của product hiện tại
              const productVariants = variants.filter(v => {
                const pid = typeof v.product_id === "object" ? v.product_id._id : v.product_id;
                return pid === product._id;
              });

              // Sắp xếp mới nhất trước
              const sortedVariants = productVariants
                .slice()
                .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

              // Giữ duy nhất 1 biến thể cho mỗi màu (ưu tiên mới nhất)
              const uniqueVariants = sortedVariants.filter((v, i, self) => {
                const colorId = typeof v.color === "object" ? v.color._id : v.color;
                return i === self.findIndex(t => {
                  const tColorId = typeof t.color === "object" ? t.color._id : t.color;
                  return tColorId === colorId;
                });
              });

              return uniqueVariants.map(variant => {
                const currentColorId = typeof variant.color === "object" ? variant.color._id : variant.color;

                const colorOptions = [
                  // Màu hiện tại
                  ...uniqueVariants
                    .filter(v => {
                      const cid = typeof v.color === "object" ? v.color._id : v.color;
                      return cid === currentColorId;
                    })
                    .map(v => ({
                      id: typeof v.color === "object" ? v.color._id : v.color,
                      code: typeof v.color === "object" ? v.color.code : "#ccc",
                      name: typeof v.color === "object" ? v.color.name : "Màu",
                    })),
                  // Các màu khác
                  ...uniqueVariants
                    .filter(v => {
                      const cid = typeof v.color === "object" ? v.color._id : v.color;
                      return cid !== currentColorId;
                    })
                    .map(v => ({
                      id: typeof v.color === "object" ? v.color._id : v.color,
                      code: typeof v.color === "object" ? v.color.code : "#ccc",
                      name: typeof v.color === "object" ? v.color.name : "Màu",
                    })),
                ];

                const rating = getAverageRatingForVariant(variant._id!, reviews);

                return (
                  <div
                    key={variant._id}
                    style={{
                      flex: "0 0 10%",
                      padding: "0 10px",
                      minWidth: 250,
                      marginBottom: 20,
                    }}
                  >
                    <Link
                      to={`/products/${product.slug}`}
                      state={{ variantId: variant._id }}
                      className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block h-[370px]"
                    >
                      {/* Ảnh */}
                      <div className="relative">
                        <img
                          src={variant.image_url?.[0] || "https://picsum.photos/200"}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        {/* Nút giỏ hàng */}
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

                      {/* Chấm màu */}
                      <div className="flex justify-center items-center gap-1 mt-2 pt-[4px]">
                        {colorOptions.map(c => (
                          <div
                            key={c.id}
                            className="w-4 h-4 rounded-full border"
                            style={{
                              backgroundColor: c.code,
                              borderColor: c.id === currentColorId ? "black" : "#ccc",
                            }}
                            title={c.name}
                          />
                        ))}
                      </div>

                      <div className="mt-2 pt-[4px]"><Text strong>{product.name}</Text></div>
                      <div className="mt-1 pt-[4px]"><Text>{variant.price?.toLocaleString("vi-VN")}đ</Text></div>
                      <div className="mt-1 pt-[4px] flex justify-center items-center gap-1 h-5">
                        <Rate disabled allowHalf value={rating} style={{ fontSize: 14 }} />
                      </div>
                    </Link>
                  </div>
                );
              });
            })}
          </div>
        )}
      </div>
      <div style={{
        marginTop: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50
      }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={variants.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
};

export default CollectionPage;
