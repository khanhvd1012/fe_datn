import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import SidebarMenu from '../../components/LayoutClient/SideBarMenu';
import { useVariants } from '../../hooks/useVariants';
import { useColors } from '../../hooks/useColors';
import { useSizes } from '../../hooks/useSizes';
import type { IVariant } from '../../interface/variant';

const Products = () => {
  const [sortOption, setSortOption] = useState('desc');
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [colorFilters, setColorFilters] = useState<string[]>([]);
  const [sizeFilters, setSizeFilters] = useState<string[]>([]);


  const { data: variants = [] } = useVariants();
  const { data: colors = [] } = useColors();
  const { data: sizes = [] } = useSizes();

  const isInPriceRange = (price: number, range: string) => {
    switch (range) {
      case '0-500':
        return price < 500_000;
      case '500-1000':
        return price >= 500_000 && price <= 1_000_000;
      case '1000-1500':
        return price > 1_000_000 && price <= 1_500_000;
      case '2000-5000':
        return price > 2_000_000 && price <= 5_000_000;
      case '5000+':
        return price > 5_000_000;
      default:
        return true;
    }
  };

  const sortedVariants = [...variants].sort((a, b) => {
    const aPrice = a.price ?? 0;
    const bPrice = b.price ?? 0;

    switch (sortOption) {
      case 'asc':
        return aPrice - bPrice;
      case 'desc':
        return bPrice - aPrice;
      case 'name-asc':
        return (
          (typeof a.product_id === 'object' ? a.product_id.name : '')?.localeCompare(
            typeof b.product_id === 'object' ? b.product_id.name : ''
          ) || 0
        );
      case 'name-desc':
        return (
          (typeof b.product_id === 'object' ? b.product_id.name : '')?.localeCompare(
            typeof a.product_id === 'object' ? a.product_id.name : ''
          ) || 0
        );
      default:
        return 0;
    }
  });

  const filteredVariants = [...sortedVariants].filter((variant: IVariant) => {
    const priceMatch =
      priceFilters.length === 0 ||
      priceFilters.some(range => isInPriceRange(variant.price, range));

    const colorMatch =
      colorFilters.length === 0 ||
      (typeof variant.color === 'string'
        ? colorFilters.includes(variant.color)
        : Array.isArray(variant.color)
          ? variant.color.some(c => colorFilters.includes((c as any)._id))
          : colorFilters.includes((variant.color as any)?._id));

    const sizeMatch =
      sizeFilters.length === 0 ||
      (Array.isArray(variant.size)
        ? variant.size
          .map(s => (typeof s === 'string' ? s : (s as any)._id))
          .some(id => sizeFilters.includes(id))
        : false);

    return priceMatch && colorMatch && sizeMatch;
  });
  filteredVariants.sort((a, b) => {
    if (sortOption === "asc") {
      return a.price - b.price;
    } else if (sortOption === "desc") {
      return b.price - a.price;
    } else if (sortOption === "az") {
      const nameA = typeof a.product_id === 'object' ? a.product_id.name : '';
      const nameB = typeof b.product_id === 'object' ? b.product_id.name : '';
      return nameA.localeCompare(nameB);
    } else if (sortOption === "za") {
      const nameA = typeof a.product_id === 'object' ? a.product_id.name : '';
      const nameB = typeof b.product_id === 'object' ? b.product_id.name : '';
      return nameB.localeCompare(nameA);
    }
    return 0;
  });


  return (
    <>
      <Breadcrumb current="Sản phẩm" />
      <div className="px-10 py-5 font-[Quicksand]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Tất cả sản phẩm</h1>
          <div>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-3 py-1 rounded mr-2"
            >
              <option value="default">Mặc định</option>
              <option value="asc">Giá: Thấp đến Cao</option>
              <option value="desc">Giá: Cao đến Thấp</option>
              <option value="az">Tên: A-Z</option>
              <option value="za">Tên: Z-A</option>
            </select>
          </div>
        </div>
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-1/4">
            <SidebarMenu />

            <h3 className="font-semibold mb-3">GIÁ SẢN PHẨM</h3>
            <div className="space-y-1">
              {[
                { label: 'Dưới 500.000₫', value: '0-500' },
                { label: '500.000₫ - 1.000.000₫', value: '500-1000' },
                { label: '1.000.000₫ - 1.500.000₫', value: '1000-1500' },
                { label: '2.000.000₫ - 5.000.000₫', value: '2000-5000' },
                { label: 'Trên 5.000.000₫', value: '5000+' },
              ].map(({ label, value }) => (
                <div key={value}>
                  <label>
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={priceFilters.includes(value)}
                      onChange={() =>
                        setPriceFilters(prev =>
                          prev.includes(value)
                            ? prev.filter(v => v !== value)
                            : [...prev, value]
                        )
                      }
                    />
                    {label}
                  </label>
                </div>
              ))}
            </div>

            <h3 className="font-semibold mt-5 mb-3">MÀU SẮC</h3>
            <div className="flex flex-wrap gap-2">
              {colors
                .filter(color => color.status === 'active')
                .map(color => (
                  <div
                    key={color._id}
                    className={`w-6 h-6 rounded border cursor-pointer ${colorFilters.includes(color._id!) ? 'ring-2 ring-black' : ''
                      }`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                    onClick={() =>
                      setColorFilters(prev =>
                        prev.includes(color._id!)
                          ? prev.filter(id => id !== color._id)
                          : [...prev, color._id!]
                      )
                    }
                  />
                ))}
            </div>

            <h3 className="font-semibold mt-5 mb-3">KÍCH THƯỚC</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size._id}
                  className={`border px-2 py-1 rounded ${sizeFilters.includes(size._id!) ? 'bg-black text-white' : ''
                    }`}
                  onClick={() =>
                    setSizeFilters(prev =>
                      prev.includes(size._id!)
                        ? prev.filter(id => id !== size._id!)
                        : [...prev, size._id!]
                    )
                  }
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>
          {/* Product Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-4 gap-6">
            {filteredVariants.map(variant => {
              const product =
                typeof variant.product_id === 'object' ? variant.product_id : null;
              const image =
                variant.image_url?.[0] || product?.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';

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
                  <div className="mt-3 text-base font-medium">
                    {product.name} - {Array.isArray(variant.color) ? variant.color[0]?.name : (variant.color as any)?.name}
                  </div>
                  <div className="text-sm font-semibold text-gray-800 mt-1">
                    {typeof variant.price === 'number'
                      ? variant.price.toLocaleString('en-US', { minimumFractionDigits: 0 }) + '$'
                      : 'Giá đang cập nhật'}
                  </div>
                </Link>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
