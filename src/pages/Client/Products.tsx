import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import SidebarMenu from '../../components/LayoutClient/SideBarMenu';
import type { IProduct } from '../../interface/product';
import { useVariants } from '../../hooks/useVariants';
import { useColors } from '../../hooks/useColors';
import { useSizes } from '../../hooks/useSizes';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [sortOption, setSortOption] = useState('desc');
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [colorFilters, setColorFilters] = useState<string[]>([]);
  const [sizeFilters, setSizeFilters] = useState<string[]>([]);

  const { data: variants = [] } = useVariants();
  const { data: colors = [] } = useColors();
  const { data: sizes = [] } = useSizes();

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/products')
      .then(res => setProducts(res.data.data.products || []))
      .catch(() => setProducts([]));
  }, []);

  const getMinVariantPrice = (product: IProduct) => {
    const productVariants = variants.filter(v =>
      (product as any).variants?.includes(v._id || '')
    );
    const prices = productVariants.map(v => v.price).filter(p => typeof p === 'number');
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const getDisplayImage = (product: IProduct) => {
    const productVariants = variants.filter(v =>
      (product as any).variants?.includes(v._id || '')
    );
    const variantWithImage = productVariants.find(
      v => Array.isArray(v.image_url) && v.image_url.length > 0
    );
    return variantWithImage?.image_url?.[0] || (product as any).images?.[0] || '';
  };

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

  const sortedProducts = [...products].sort((a, b) => {
    const aPrice = getMinVariantPrice(a) ?? 0;
    const bPrice = getMinVariantPrice(b) ?? 0;
    switch (sortOption) {
      case 'asc':
        return aPrice - bPrice;
      case 'desc':
        return bPrice - aPrice;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const filteredProducts = sortedProducts.filter(product => {
    const productVariants = variants.filter(v =>
      (product as any).variants?.includes(v._id || '')
    );
    const minPrice = getMinVariantPrice(product) ?? 0;

    const priceMatch =
      priceFilters.length === 0 ||
      priceFilters.some(range => isInPriceRange(minPrice, range));

    const colorMatch =
      colorFilters.length === 0 ||
      productVariants.some(variant => {
        if (typeof variant.color === 'string') {
          return colorFilters.includes(variant.color);
        }
        if (Array.isArray(variant.color)) {
          return variant.color.some(c => colorFilters.includes((c as any)._id));
        }
        return colorFilters.includes((variant.color as any)?._id);
      });

    const sizeMatch =
      sizeFilters.length === 0 ||
      productVariants.some(variant => {
        if (!variant.size) return false;
        const sizeIds = Array.isArray(variant.size)
          ? variant.size.map(s =>
              typeof s === 'string' ? s : (s as any)._id
            )
          : [];
        return sizeIds.some(id => sizeFilters.includes(id));
      });

    return priceMatch && colorMatch && sizeMatch;
  });

  return (
    <>
      <Breadcrumb current="Sản phẩm" />
      <div className="px-10 py-5 font-[Quicksand]">
        <div className="flex gap-8">
          {/* Sidebar Filter */}
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
                    className={`w-6 h-6 rounded border cursor-pointer ${
                      colorFilters.includes(color._id!) ? 'ring-2 ring-black' : ''
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
                  className={`border px-2 py-1 rounded ${
                    sizeFilters.includes(size._id!) ? 'bg-black text-white' : ''
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

          {/* Product List */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const minPrice = getMinVariantPrice(product);
              const displayImage = getDisplayImage(product);
              return (
                <Link
                  to={`/products/${product.slug}`}
                  key={product._id}
                  className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block"
                >
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="mt-3 text-base font-medium">{product.name}</div>
                  <div className="text-sm font-semibold text-gray-800 mt-1">
                    {typeof minPrice === 'number'
                      ? minPrice.toLocaleString('vi-VN') + '₫'
                      : 'Giá đang cập nhật'}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
