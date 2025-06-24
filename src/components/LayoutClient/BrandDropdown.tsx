import React from 'react';
import { NavLink } from 'react-router-dom';
import { useBrands } from '../../hooks/useBrands'; // chỉnh path nếu khác
import type { IBrand } from '../../interface/brand';


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

const BrandDropdown = () => {
  const { data: brands, isLoading, isError } = useBrands();

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
      <NavLink to="/brand" style={styles.link}>THƯƠNG HIỆU</NavLink>
      <div className="dropdown-content" style={styles.content}>
        {isLoading && <span style={styles.contentItem}>Đang tải...</span>}
        {isError && <span style={styles.contentItem}>Lỗi tải dữ liệu</span>}
        {brands && brands.map((brand: IBrand) => (
          <NavLink
            key={brand._id}
            to={`/brand/${brand._id}`}
            style={styles.contentItem}
          >
            {brand.logo_image && (
              <img src={brand.logo_image} alt={brand.name} style={styles.logo} />
            )}
            {brand.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BrandDropdown;
