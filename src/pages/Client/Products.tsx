import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Typography, Button, Dropdown, Select, Spin, Pagination, Rate, message } from 'antd';
import { FilterOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import FilterContent from '../../components/LayoutClient/FilterContent';
import { useVariants, useTopSellingVariants, useTopRatedVariants } from '../../hooks/useVariants';
import type { IVariant } from '../../interface/variant';
import { useAddToCart } from '../../hooks/useCart';
import { useReviews } from '../../hooks/useReview';
import type { IReview } from '../../interface/review';

const { Title, Text } = Typography;

interface FilterValues {
  price: [number, number];
  brands: string[];
  categories: string[];
  colors: string[];
  sizes: string[];
  gender: string[];
}

const Products = () => {
  const [sortOption, setSortOption] = useState('default');
  const location = useLocation();
  const [productIdFromSearch, setProductIdFromSearch] = useState<string | undefined>(
    (location.state as { productId?: string })?.productId
  );
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();
  const initialFilters = (location.state as Partial<FilterValues>) || {};
  const [filters, setFilters] = useState<FilterValues>({
    price: initialFilters.price || [0, 30000000],
    brands: initialFilters.brands || [],
    categories: initialFilters.categories || [],
    colors: initialFilters.colors || [],
    sizes: initialFilters.sizes || [],
    gender: initialFilters.gender || [],
  });
  // Cập nhật lại filters khi state thay đổi
  useEffect(() => {
    const newFilters = (location.state as Partial<FilterValues>) || {};
    setFilters({
      price: newFilters.price || [0, 30000000],
      brands: newFilters.brands || [],
      categories: newFilters.categories || [],
      colors: newFilters.colors || [],
      sizes: newFilters.sizes || [],
      gender: newFilters.gender || [],
    });
  }, [location.state]);

  // Cập nhật lại productId khi state thay đổi
  useEffect(() => {
    const newState = location.state as { productId?: string };
    setProductIdFromSearch(newState?.productId);
  }, [location.state]);

  // Reset trang về 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, productIdFromSearch]);

  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };
  const { mutate: addToCart } = useAddToCart();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const { data: allVariants = [], isLoading: loadingAll } = useVariants();

  const { data: topSelling = [], isLoading: loadingTopSelling } = useTopSellingVariants({
    enabled: sortOption === 'top-selling',
  });

  const { data: topRated = [], isLoading: loadingTopRated } = useTopRatedVariants({
    enabled: sortOption === 'top-rated',
  });

  const loading = loadingAll || loadingTopSelling || loadingTopRated;

  const rawVariants = (() => {
    if (sortOption === 'top-selling') {
      return topSelling
        .map(item => allVariants.find(v => v._id === item._id)) 
        .filter(Boolean) as IVariant[];
    }
    if (sortOption === 'top-rated') {
      return topRated
        .map(item => allVariants.find(v => v._id === item._id))
        .filter(Boolean) as IVariant[];
    }
    return allVariants;
  })();

  const sortedVariants = [...rawVariants].sort((a, b) => {
    if (sortOption === 'top-selling') {
      return (b.totalSold ?? 0) - (a.totalSold ?? 0);
    }
    if (sortOption === 'top-rated') {
      return (b.averageRating ?? 0) - (a.averageRating ?? 0);
    }

    const aPrice = a.price ?? 0;
    const bPrice = b.price ?? 0;

    switch (sortOption) {
      case 'asc':
        return aPrice - bPrice;
      case 'desc':
        return bPrice - aPrice;
      case 'az':
        return (
          (typeof a.product_id === 'object' ? a.product_id.name : '').localeCompare(
            typeof b.product_id === 'object' ? b.product_id.name : ''
          )
        );
      case 'za':
        return (
          (typeof b.product_id === 'object' ? b.product_id.name : '').localeCompare(
            typeof a.product_id === 'object' ? a.product_id.name : ''
          )
        );
      case 'newest':
        return (
          new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime()
        );
      default:
        return 0;
    }
  });

  const filteredVariants = sortedVariants.filter((variant: IVariant) => {
    const priceMatch = variant.price >= filters.price[0] && variant.price <= filters.price[1];

    const colorId = typeof variant.color === 'string' ? variant.color : variant.color._id;
    const colorMatch = filters.colors.length === 0 || filters.colors.includes(colorId);

    const sizeId = typeof variant.size === 'string' ? variant.size : variant.size._id;
    const sizeMatch = filters.sizes.length === 0 || filters.sizes.includes(sizeId);

    const product = typeof variant.product_id === 'object' ? variant.product_id : null;
    const brandId = typeof product?.brand === 'object' ? product?.brand._id : product?.brand;
    const brandMatch = filters.brands.length === 0 || (brandId && filters.brands.includes(brandId));

    const categoryId = typeof product?.category === 'object' ? product.category._id : product?.category;
    const categoryMatch = filters.categories.length === 0 || (categoryId && filters.categories.includes(categoryId));

    const genderMatch = filters.gender.length === 0 || (variant.gender && filters.gender.includes(variant.gender));

    return priceMatch && colorMatch && sizeMatch && brandMatch && categoryMatch && genderMatch;
  });

  const filteredVariantsByProduct = productIdFromSearch
    ? filteredVariants.filter(
      v => (typeof v.product_id === 'object' ? v.product_id._id : v.product_id) === productIdFromSearch
    )
    : filteredVariants;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "top-selling") {
      setSortOption("top-selling");
    } else if (tab === "newest") {
      setSortOption("newest");
    }
  }, [location.search]);

  useEffect(() => {
    if (!loading && filteredVariants.length === 0) {
      message.warning('Không có sản phẩm phù hợp');
    }
  }, [filteredVariants, loading]);

  const variantsByProduct: { [key: string]: IVariant[] } = {};
  filteredVariantsByProduct.forEach(variant => {
    const productId =
      typeof variant.product_id === 'object'
        ? variant.product_id._id
        : variant.product_id;

    if (!productId) return;

    if (!variantsByProduct[productId]) {
      variantsByProduct[productId] = [];
    }

    variantsByProduct[productId].push(variant);
  });

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

  // Nhóm biến thể theo product + color, chỉ lấy mới nhất
  const uniqueVariants = Object.values(
    filteredVariantsByProduct.reduce((acc, v) => {
      const productId = typeof v.product_id === 'object' ? v.product_id._id : v.product_id;
      const colorId = typeof v.color === 'object' ? v.color._id : v.color;
      const key = `${productId}-${colorId}`;

      if (
        !acc[key] ||
        new Date(v.createdAt ?? 0).getTime() > new Date(acc[key].createdAt ?? 0).getTime()
      ) {
        acc[key] = v;
      }
      return acc;
    }, {} as Record<string, IVariant>)
  );

  // Phân trang trên danh sách đã gộp
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedVariants = uniqueVariants.slice(startIndex, endIndex);

  if (loadingReviews) {
    return (
      <div className="text-center py-10">
        <Spin />
      </div>
    );
  }

  return (
    <>
      <Breadcrumb current="Sản phẩm" />
      <div className="px-10 py-5 font-[Quicksand]">
        <div className="flex justify-between items-center mb-6">
          <Title level={3} className="!mb-0">Tất cả sản phẩm</Title>
          <div>
            <Select
              value={sortOption}
              onChange={setSortOption}
              className="w-52"
              options={[
                { label: 'Mặc định', value: 'default' },
                { label: 'Mới nhất', value: 'newest' },
                { label: 'Giá: Thấp đến Cao', value: 'asc' },
                { label: 'Giá: Cao đến Thấp', value: 'desc' },
                { label: 'Tên: A-Z', value: 'az' },
                { label: 'Tên: Z-A', value: 'za' },
                { label: 'Bán chạy', value: 'top-selling' },
                { label: 'Đánh giá cao', value: 'top-rated' },
              ]}
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-1/4">
            <Dropdown
              trigger={['click']}
              overlay={
                <div className="bg-white p-4 rounded-lg shadow">
                  <FilterContent
                    onChange={setFilters}
                    defaultValues={{
                      price: initialFilters.price ?? [0, 30000000],
                      brands: initialFilters.brands ?? [],
                      categories: initialFilters.categories ?? [],
                      colors: initialFilters.colors ?? [],
                      sizes: initialFilters.sizes ?? [],
                      gender: initialFilters.gender ?? [],
                    }}
                  />
                </div>
              }
              placement="bottomLeft"
              getPopupContainer={trigger => trigger.parentElement!}
            >
              <Button icon={<FilterOutlined />}>Bộ lọc</Button>
            </Dropdown>
          </div>

          {/* Product Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <Spin size="large" />
              </div>
            ) : (
              paginatedVariants.map(variant => {
                const product = typeof variant.product_id === 'object' ? variant.product_id : null;
                const productId = product?._id;
                const currentColorId = typeof variant.color === 'object' ? variant.color._id : variant.color;

                // Các biến thể cùng sản phẩm
                const variantsOfSameProduct = productId ? variantsByProduct[productId] || [] : [];

                // Lấy biến thể mới nhất cho mỗi màu
                const latestVariantsByColor = Object.values(
                  (variantsOfSameProduct || []).reduce((acc, v) => {
                    const colorId = typeof v.color === 'object' ? v.color._id : v.color;
                    if (
                      !acc[colorId] ||
                      new Date(v.createdAt ?? 0).getTime() > new Date(acc[colorId].createdAt ?? 0).getTime()
                    ) {
                      acc[colorId] = v;
                    }
                    return acc;
                  }, {} as Record<string, IVariant>)
                );

                // Sắp xếp: màu hiện tại trước, sau đó tới các màu khác
                const sortedByCurrentFirst = [
                  ...latestVariantsByColor.filter(v => {
                    const cid = typeof v.color === 'object' ? v.color._id : v.color;
                    return cid === currentColorId;
                  }),
                  ...latestVariantsByColor.filter(v => {
                    const cid = typeof v.color === 'object' ? v.color._id : v.color;
                    return cid !== currentColorId;
                  }),
                ];

                const rating = getAverageRatingForVariant(variant._id!, reviews);

                return product ? (
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

                    {/* Danh sách các màu */}
                    <div className="flex justify-center items-center gap-1 mt-2 pt-[4px]">
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

                    <div className="mt-2 pt-[4px]">
                      <Text strong>{product.name}</Text>
                    </div>
                    <div className="mt-1 pt-[4px]">
                      <Text type="secondary" style={{ color: 'black' }}>
                        {typeof variant.price === 'number'
                          ? variant.price.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + 'đ'
                          : 'Giá đang cập nhật'}
                      </Text>
                    </div>
                    <div className="mt-1 pt-[4px] flex justify-center items-center gap-1">
                      <Rate
                        disabled
                        allowHalf
                        defaultValue={rating}
                        style={{ fontSize: 14 }}
                      />
                    </div>
                  </Link>
                ) : null;
              })

            )}
            <div className="col-span-full flex justify-center mt-8">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={uniqueVariants.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;