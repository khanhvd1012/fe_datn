import React, { useEffect, useRef, useState } from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';

const SearchBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Đóng khi chuyển tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsOpen(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <Button
        type="text"
        icon={<SearchOutlined />}
        onClick={() => setIsOpen(true)}
        style={{ fontSize: 13, marginTop:1 }}
      />

      {isOpen && (
        <Input
          ref={inputRef}
          placeholder="Tìm kiếm sản phẩm..."
          autoFocus
          style={{
            position: 'absolute',
            top: '110%',
            right: 0,
            width: 220,
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        />
      )}
    </div>
  );
};

export default SearchBox;
