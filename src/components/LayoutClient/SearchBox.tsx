import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { Logo } from '../css/style';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  image?: string;
  price?: number;
  slug?: string;
}

interface SearchBoxProps {
  onClose: () => void;
  products?: Product[]; // Cho phép undefined để tránh lỗi
}

const popularKeywords = [
  'nike',
  'adidas',
  'puma',
  'jordan',
  'giày trẻ em',
  'giày thể thao',
  'bóng rổ',
  'bóng đá',
];

const SearchBox: React.FC<SearchBoxProps> = ({ onClose, products = [] }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const navigate = useNavigate();

  // Auto focus khi mở
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Đóng khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      onClose();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lọc sản phẩm theo tên
  useEffect(() => {
    if (search.trim() === '') {
      setResults([]);
      return;
    }
    if (!Array.isArray(products)) {
      setResults([]);
      return;
    }
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setResults(filtered);
  }, [search, products]);

  const handleClose = useCallback(() => onClose(), [onClose]);

  return (
    <div className="fixed top-[64px] left-0 w-full h-1/2 bg-white z-[999] p-6 shadow-md border-b overflow-y-auto mt-10">
      <div ref={containerRef} className="relative w-full h-full max-w-6xl mx-auto px-4">
        {/* Hàng ngang: Logo - Search - X */}
        <div className="flex items-center w-full mb-6 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo>SNEAKER<span>TREND</span></Logo>
          </div>

          {/* Ô tìm kiếm */}
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 flex-grow">
            <SearchOutlined className="text-gray-500 text-lg mr-2" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Tìm kiếm"
              className="bg-transparent outline-none w-full text-gray-700 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && search.trim()) {
                  navigate(`/products?search=${encodeURIComponent(search.trim())}`);
                  onClose();
                }
              }}
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition"
              disabled={!search.trim()}
              onClick={() => {
                if (search.trim()) {
                  navigate(`/products?search=${encodeURIComponent(search.trim())}`);
                  onClose();
                }
              }}
            >
              Tìm kiếm
            </button>
          </div>

          {/* Nút X */}
          <div
            onClick={handleClose}
            className="flex-shrink-0 cursor-pointer text-xl text-gray-600 hover:text-black"
          >
            <CloseOutlined />
          </div>
        </div>

        {/* Kết quả tìm kiếm */}
        {search && (
          <div className="bg-white border rounded-lg shadow p-4 mb-4 max-h-64 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-gray-500 text-sm">Không tìm thấy sản phẩm phù hợp.</div>
            ) : (
              results.map(product => (
                <a
                  key={product._id}
                  href={product.slug ? `/products/${product.slug}` : '#'}
                  className="flex items-center gap-3 py-2 px-2 rounded hover:bg-gray-100 transition"
                  onClick={handleClose}
                >
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded" />
                  )}
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.price && (
                      <div className="text-xs text-gray-500">{product.price.toLocaleString('en-US')}$</div>
                    )}
                  </div>
                </a>
              ))
            )}
          </div>
        )}

        {/* Gợi ý tìm kiếm */}
        <div className="mt-6 max-w-3xl">
          <p className="text-sm text-gray-500 mb-2">Các thuật ngữ tìm kiếm phổ biến</p>
          <div className="flex flex-wrap gap-3">
            {popularKeywords.map((word, index) => (
              <span
                key={index}
                className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-black cursor-pointer hover:bg-gray-200"
                onClick={() => setSearch(word)}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;