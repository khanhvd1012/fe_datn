import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories'; // chỉnh path nếu khác
import type { ICategory } from '../../interface/category';

const styles: { [key: string]: React.CSSProperties } = {
  dropdown: {
    position: 'relative',
    display: 'inline-block',
  },
  link: {
    padding: '0px 0px',
    display: 'inline-block',
    color: '#000',
    textDecoration: 'none',
    fontWeight: 500,
  },
  content: {
    display: 'none',
    position: 'absolute',
    backgroundColor: '#fff',
    minWidth: 200,
    boxShadow: '0px 8px 16px rgba(0,0,0,0.1)',
    zIndex: 999,
  },
  contentItem: {
    color: '#000',
    padding: '10px 16px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logo: {
    width: 20,
    height: 20,
    objectFit: 'contain',
  },
};

const CateDropdown = () => {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <div
      style={styles.dropdown}
      onMouseEnter={(e) => {
        const content = e.currentTarget.querySelector('.dropdown-content') as HTMLElement;
        if (content) content.style.display = 'block';
      }}
      onMouseLeave={(e) => {
        const content = e.currentTarget.querySelector('.dropdown-content') as HTMLElement;
        if (content) content.style.display = 'none';
      }}
    >
      <NavLink to="/category" style={styles.link}>DANH MỤC</NavLink>
      <div className="dropdown-content" style={styles.content}>
        {isLoading && <span style={styles.contentItem}>Đang tải...</span>}
        {isError && <span style={styles.contentItem}>Lỗi tải dữ liệu</span>}
        {categories && categories.map((category: ICategory) => (
          <NavLink
            key={category._id}
            to={`/category/${category._id}`}
            style={styles.contentItem}
          >
            {category.logo_image && (
              <img src={category.logo_image} alt={category.name} style={styles.logo} />
            )}
            {category.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default CateDropdown;
