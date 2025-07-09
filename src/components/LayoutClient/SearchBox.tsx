import React, { useRef, useEffect } from 'react';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { Logo } from '../css/style';

interface SearchBoxProps {
  onClose: () => void;
}

const popularKeywords = [
  'những thứ cần thiết cho mùa hè',
  'thời đại jordan cmft',
  'không quân 1',
  'jordan',
  'giày bóng rổ',
  'không khí tối đa',
  'jordan 1 thấp',
  'nike dunk thấp',
];

const SearchBox: React.FC<SearchBoxProps> = ({ onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, [onClose]);

  return (
  <div className="fixed top-0 left-0 w-full h-1/2 bg-white z-50 p-6 shadow-md border-b overflow-y-auto">
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
          />
        </div>

        {/* Nút X */}
        <div
          onClick={onClose}
          className="flex-shrink-0 cursor-pointer text-xl text-gray-600 hover:text-black"
        >
          <CloseOutlined />
        </div>
      </div>

      {/* Gợi ý tìm kiếm */}
      <div className="mt-6 max-w-3xl">
        <p className="text-sm text-gray-500 mb-2">Các thuật ngữ tìm kiếm phổ biến</p>
        <div className="flex flex-wrap gap-3">
          {popularKeywords.map((word, index) => (
            <span
              key={index}
              className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-black cursor-pointer hover:bg-gray-200"
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
