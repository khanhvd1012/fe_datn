import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  image?: string;
  price?: number;
  slug?: string;
  brand?: string | { _id: string; name: string };
  category?: string | { _id: string; name: string };
}

interface SearchBoxProps {
  onClose: () => void;
  products?: Product[];
}

const SearchBox: React.FC<SearchBoxProps> = ({ onClose, products = [] }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const closeSearchBox = useCallback(() => onClose(), [onClose]);

  // Focus input khi mở
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeSearchBox();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSearchBox]);

  // Đóng khi scroll
  useEffect(() => {
    window.addEventListener('scroll', closeSearchBox);
    return () => window.removeEventListener('scroll', closeSearchBox);
  }, [closeSearchBox]);

  // Kết quả tìm kiếm
  const results = useMemo(() => {
    if (!search.trim() || !Array.isArray(products)) return [];
    const keyword = search.toLowerCase();

    return products.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      (typeof p.brand !== 'string' && p.brand?.name.toLowerCase().includes(keyword)) ||
      (typeof p.category !== 'string' && p.category?.name.toLowerCase().includes(keyword))
    );
  }, [search, products]);

  const handleSearch = () => {
    if (search.trim()) {
      const keyword = search.toLowerCase();

      // tìm category trùng tên
      const matchedCategory = products
        .map(p => (typeof p.category !== 'string' ? p.category : null))
        .find(c => c && c.name.toLowerCase() === keyword);

      // tìm brand trùng tên
      const matchedBrand = products
        .map(p => (typeof p.brand !== 'string' ? p.brand : null))
        .find(b => b && b.name.toLowerCase() === keyword);

      navigate('/products', {
        state: {
          categories: matchedCategory ? [matchedCategory._id] : [],
          brands: matchedBrand ? [matchedBrand._id] : [],
          search: search.trim(),
        },
      });
      closeSearchBox();
    }
  };

  return (
    <div className="fixed top-[64px] left-0 w-full h-1/2 bg-white z-[999] p-6 shadow-md border-b overflow-y-auto mt-10">
      <div ref={containerRef} className="relative w-full h-full max-w-6xl mx-auto px-4">
        <div className="flex items-center w-full mb-6 gap-4">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 flex-grow">
            <input
              ref={inputRef}
              type="text"
              placeholder="Tìm kiếm"
              className="bg-transparent outline-none w-full text-gray-700 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="ml-2 w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              disabled={!search.trim()}
              onClick={handleSearch}
            >
              <SearchOutlined className="text-lg" />
            </button>
          </div>
          <div
            onClick={closeSearchBox}
            className="flex-shrink-0 cursor-pointer text-xl text-gray-600 hover:text-black"
          >
            <CloseOutlined />
          </div>
        </div>

        {search && (
          <div className="bg-white rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-gray-500 text-sm">Không tìm thấy sản phẩm phù hợp.</div>
            ) : (
              results.map(product => (
                <Link
                  key={product._id}
                  to="/products"
                  state={{
                    productId: product._id,
                    brands: typeof product.brand !== "string" && product.brand ? [product.brand._id] : [],
                    categories: typeof product.category !== "string" && product.category ? [product.category._id] : [],
                  }}
                  onClick={closeSearchBox}
                  className="flex items-center gap-3 py-2 px-2 rounded hover:bg-gray-100 transition"
                >
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded" />
                  )}
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-gray-500">
                      {typeof product.brand !== "string" && product.brand?.name} •{" "}
                      {typeof product.category !== "string" && product.category?.name}
                    </div>
                    {product.price && (
                      <div className="text-xs text-gray-500">
                        {product.price.toLocaleString("vi-VN")}đ
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
