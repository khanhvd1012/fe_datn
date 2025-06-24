import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/LayoutClient/Breadcrumb'
import SidebarMenu from '../../components/LayoutClient/SideBarMenu'

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [sortOption, setSortOption] = useState('desc')

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(res => setProducts(res.data.data))
      .catch(() => setProducts([]))
  }, [])

  const sortedProducts = [...products].sort((a, b) => {
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
        <div className="flex gap-8">
          {/* Sidebar Filter */}
          <div className="w-1/4">
            <SidebarMenu />

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
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <Link
                to={`/products/${product._id}`}
                key={product._id}
                className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block"
              >
                <img
                  src={product.images?.[0] || ''}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <div className="mt-3 text-base font-medium">{product.name}</div>
                <div className="text-sm font-semibold text-gray-800 mt-1">
                  {product.price?.toLocaleString('vi-VN')}₫
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Products
