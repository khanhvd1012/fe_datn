import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Dropdown, Select, Spin } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import FilterContent from '../../components/LayoutClient/FilterContent';
import { useVariants, useTopSellingVariants, useTopRatedVariants } from '../../hooks/useVariants';
import type { IVariant } from '../../interface/variant';

const { Title, Text } = Typography;

interface FilterValues {
  price: [number, number];
  brands: string[];
  categories: string[];
  colors: string[];
  sizes: string[];
}

const Products = () => {
  const [sortOption, setSortOption] = useState('desc');

  const [filters, setFilters] = useState<FilterValues>({
    price: [0, 1000],
    brands: [],
    categories: [],
    colors: [],
    sizes: [],
  });

  const { data: allVariants = [], isLoading: loadingAll } = useVariants();

  const { data: topSelling = [], isLoading: loadingTopSelling } = useTopSellingVariants({
    enabled: sortOption === 'top-selling',
  });

  const { data: topRated = [], isLoading: loadingTopRated } = useTopRatedVariants({
    enabled: sortOption === 'top-rated',
  });

  const loading = loadingAll || loadingTopSelling || loadingTopRated;

  const rawVariants = (() => {
    if (sortOption === 'top-selling') return topSelling;
    if (sortOption === 'top-rated') return topRated;
    return allVariants;
  })();

  const sortedVariants = [...rawVariants].sort((a, b) => {
    if (sortOption === 'top-selling' || sortOption === 'top-rated') return 0;

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
    if (sortOption === 'top-selling' || sortOption === 'top-rated') return true;

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

    return priceMatch && colorMatch && sizeMatch && brandMatch && categoryMatch;
  });

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
                    defaultValues={filters}
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
              filteredVariants.map(variant => {
                const product = typeof variant.product_id === 'object' ? variant.product_id : null;
                const image =
                  variant.image_url?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';
                const color = typeof variant.color === 'object' ? variant.color.name : '';

                return product ? (
                  <Link
                    to={`/products/${product.slug}`}
                    key={variant._id}
                    className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block h-[340px]"
                    state={{ variantId: variant._id }}
                  >
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <div className="mt-3">
                      <Text strong>{product.name} - {color}</Text>
                    </div>
                    <div className="mt-1">
                      <Text type="secondary">
                        {typeof variant.price === 'number'
                          ? variant.price.toLocaleString('en-US', { minimumFractionDigits: 0 }) + '$'
                          : 'Giá đang cập nhật'}
                      </Text>
                    </div>
                  </Link>
                ) : null;
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
