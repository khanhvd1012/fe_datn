// src/components/Breadcrumb.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

interface BreadcrumbProps {
  current: string; // Tên trang hiện tại (vd: "Blog", "Liên hệ", "Sản phẩm")
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ current }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        fontFamily: "'Quicksand', sans-serif",
        margin: '24px 0',
        gap: '6px',
      }}
    >
      <HomeOutlined style={{ color: '#b0b0b0' }} />
      <Link to="/" style={{ color: '#b0b0b0', textDecoration: 'none' }}>
        Trang chủ
      </Link>
      <span style={{ color: '#b0b0b0' }}>/</span>
      <span style={{ color: '#b0b0b0' }}>{current}</span>
    </div>
  );
};

export default Breadcrumb;
