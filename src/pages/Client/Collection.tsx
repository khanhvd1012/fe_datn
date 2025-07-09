import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  onClose: () => void;
}

const Collection: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed top-[100px] left-0 w-full h-[300px] bg-white z-50 shadow-xl border-t">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 gap-10">

        {/* Cột 1 - Thương hiệu */}
        <div>
          <h3 className="text-base font-semibold mb-4">Thương hiệu</h3>
          <ul className="space-y-2 text-sm">
            {['Nike', 'Adidas', 'Vans', 'Puma', 'Converse', 'New Balance'].map(brand => (
              <li key={brand}>
                <NavLink
                  to={`/collection/${brand.toLowerCase().replace(/\s/g, '-')}`}
                  className="text-gray-700 hover:text-black"
                >
                  {brand}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 2 - Danh mục */}
        <div>
          <h3 className="text-base font-semibold mb-4">Danh mục</h3>
          <ul className="space-y-2 text-sm">
            {['Sneakers', 'Chạy bộ', 'Thể thao', 'Giày nữ', 'Giày trẻ em'].map(cat => (
              <li key={cat}>
                <NavLink
                  to={`/collection/${cat.toLowerCase().replace(/\s/g, '-')}`}
                  className="text-gray-700 hover:text-black"
                >
                  {cat}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Collection;
