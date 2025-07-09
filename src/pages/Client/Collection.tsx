import React from 'react';
import { NavLink } from 'react-router-dom';
import { useBrands } from '../../hooks/useBrands';
import { useCategories } from '../../hooks/useCategories';

interface Props {
  onClose: () => void;
}

// Hàm chuyển tên -> slug URL-friendly
const slugify = (str: string) =>
  str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu tiếng Việt
    .replace(/\s+/g, '-')            // đổi khoảng trắng thành dấu -
    .replace(/[^a-z0-9-]/g, '');     // bỏ ký tự đặc biệt

const Collection: React.FC<Props> = ({ onClose }) => {
  const { data: brands = [], isLoading: loadingBrands } = useBrands();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  return (
    <div className="fixed top-[100px] left-0 w-full h-[300px] bg-white z-50 shadow-xl border-t overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 gap-10">
        {/* Cột 1 - Thương hiệu */}
        <div>
          <h3 className="text-base font-semibold mb-4">Thương hiệu</h3>
          <ul className="space-y-2 text-sm">
            {loadingBrands ? (
              <li>Đang tải...</li>
            ) : (
              brands.map((brand: any) => (
                <li key={brand._id}>
                  <NavLink
                    to={`/collection/${slugify(brand.name)}`}
                    className="text-gray-700 hover:text-black"
                    onClick={onClose}
                  >
                    {brand.name}
                  </NavLink>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Cột 2 - Danh mục */}
        <div>
          <h3 className="text-base font-semibold mb-4">Danh mục</h3>
          <ul className="space-y-2 text-sm">
            {loadingCategories ? (
              <li>Đang tải...</li>
            ) : (
              categories.map((cat: any) => (
                <li key={cat._id}>
                  <NavLink
                    to={`/collection/${slugify(cat.name)}`}
                    className="text-gray-700 hover:text-black"
                    onClick={onClose}
                  >
                    {cat.name}
                  </NavLink>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Collection;
