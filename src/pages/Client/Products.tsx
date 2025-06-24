import React, { useState } from 'react'
import Breadcrumb from '../../components/LayoutClient/Breadcrumb'
import SidebarMenu from '../../components/LayoutClient/SideBarMenu'

interface Product {
  id: number
  name: string
  price: number
  imageUrl: string
}

const mockProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Adidas EQT Cushion ADV #${i + 1}`,
  price: Math.floor(5000000 + Math.random() * 3000000), // 5tr - 8tr
  imageUrl: `https://picsum.photos/300/200?random=${i + 1}`,
}))

const Products = () => {
  const [sortOption, setSortOption] = useState('desc')

  const sortedProducts = [...mockProducts].sort((a, b) => {
    switch (sortOption) {
      case 'asc':
        return a.price - b.price
      case 'desc':
        return b.price - a.price
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })

  return (
    <>
     <Breadcrumb current="Sản phẩm" />
    <div className="px-10 py-5 font-[Quicksand]">
      {/* Title + Sort */}
      <div className="flex justify-between items-center mt-6 mb-4">
       <h2 className="text-2xl font-semibold mb-6">Tất cả sản phẩm</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm">Giá:</label>
          <select
            id="sort"
            className="border-b border-black focus:outline-none text-sm"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
          </select>
        </div>
      </div>
    
      <div className="flex gap-10">

        {/* Sidebar Filter */}
        <div className="w-1/4">
           {/* sidebar menu */}
           <SidebarMenu/>

          <h3 className="font-semibold mb-3">THƯƠNG HIỆU</h3>
          <label><input type="checkbox" className="mr-2" /> Khác</label>

          <h3 className="font-semibold mt-5 mb-3">GIÁ SẢN PHẨM</h3>
          <div className="space-y-1">
            {[
              'Dưới 500,000₫',
              '500,000₫ - 1,000,000₫',
              '1,000,000₫ - 1,500,000₫',
              '2,000,000₫ - 5,000,000₫',
              'Trên 5,000,000₫',
            ].map((label, i) => (
              <div key={i}><label><input type="checkbox" className="mr-2" /> {label}</label></div>
            ))}
          </div>

          <h3 className="font-semibold mt-5 mb-3">MÀU SẮC</h3>
          <div className="flex flex-wrap gap-2">
            {[
              '#f44336', '#3f51b5', '#000000', '#03a9f4',
              '#e1e1e1', '#607d8b', '#ff4081', '#9e9e9e',
            ].map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <h3 className="font-semibold mt-5 mb-3">KÍCH THƯỚC</h3>
          <div className="flex flex-wrap gap-2">
            {[35, 36, 37, 38, 39, 40].map((size) => (
              <button key={size} className="border px-2 py-1">{size}</button>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="mt-3 text-base font-medium">{product.name}</div>
              <div className="text-sm font-semibold text-gray-800 mt-1">
                {product.price.toLocaleString('vi-VN')}₫
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default Products
