// Collection.tsx
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useBrands } from '../../hooks/useBrands';
import { useCategories } from '../../hooks/useCategories';
import type { IBrand } from '../../interface/brand';
import type { ICategory } from '../../interface/category';

interface Props {
  onClose: () => void;
}

const slugify = (str: string) =>
  str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const Collection: React.FC<Props> = ({ onClose }) => {
  const { data: brands = [], isLoading: loadingBrands } = useBrands();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  // Tự động đóng khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      onClose();
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onClose]);

  return (
    <div className="fixed top-[100px] left-0 w-full h-[400px] bg-gradient-to-b from-white via-gray-50 to-white z-50 shadow-xl overflow-y-auto font-quicksand">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 gap-10">
        {/* Cột 1 - Thương hiệu */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-2">Thương hiệu</h3>
          {loadingBrands ? (
            <p>Đang tải...</p>
          ) : (
            <ul className="space-y-3">
              {(brands as IBrand[]).map((brand) => (
                <li key={brand._id}>
                  <NavLink
                    to={`/collection/${slugify(brand.name)}`}
                    onClick={onClose}
                    className="flex items-center gap-4 hover:bg-gray-100 p-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <img
                      src={brand.logo_image || '/no-image.jpg'}
                      alt={brand.name}
                      className="w-10 h-10 object-contain rounded-md bg-white shadow"
                    />
                    <span className="text-base text-gray-800 font-medium">{brand.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cột 2 - Danh mục */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-2">Danh mục</h3>
          {loadingCategories ? (
            <p>Đang tải...</p>
          ) : (
            <ul className="space-y-3">
              {(categories as ICategory[]).map((cat) => (
                <li key={cat._id}>
                  <NavLink
                    to={`/collection/${slugify(cat.name)}`}
                    onClick={onClose}
                    className="flex items-center gap-4 hover:bg-gray-100 p-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <img
                      src={cat.logo_image || '/no-image.jpg'}
                      alt={cat.name}
                      className="w-10 h-10 object-contain rounded-md bg-white shadow"
                    />
                    <span className="text-base text-gray-800 font-medium">{cat.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
