// src/components/SidebarMenu.tsx
import { Link } from 'react-router-dom';

const menuItems = [
  { name: 'Trang chủ', path: '/' },
  { name: 'Bộ sưu tập', path: '/collection' },
  { name: 'Sản phẩm', path: '/products' },
  { name: 'Giới thiệu', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Liên hệ', path: '/contact' },
];

const SidebarMenu = () => {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '16px',
        marginBottom: '24px',
        fontFamily: 'Quicksand, sans-serif',
      }}
    >
      <h3
        style={{
          borderBottom: '2px solid black',
          paddingBottom: '8px',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '18px',
        }}
      >
        DANH MỤC TRANG
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '12px' }}>
        {menuItems.map((item, index) => (
          <li key={index} style={{ padding: '10px 0', borderBottom: '1px dotted #ccc' }}>
            <Link to={item.path} style={{ color: '#333', textDecoration: 'none', fontSize: '15px' }}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
