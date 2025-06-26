import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/LayoutClient/Breadcrumb'
import SidebarMenu from '../../components/LayoutClient/SideBarMenu'
import type { IProduct } from '../../interface/product'
import type { IVariant } from '../../interface/variant'

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([])
  const [variants, setVariants] = useState<IVariant[]>([])
  const [sortOption, setSortOption] = useState('desc')

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8080/api/products'),
      axios.get('http://localhost:8080/api/variants')
    ])
      .then(([productsRes, variantsRes]) => {
        setProducts(productsRes.data.data.products || [])
        setVariants(variantsRes.data.data || [])
      })
      .catch(() => {
        setProducts([])
        setVariants([])
      })
  }, [])

  // Lấy giá thấp nhất từ các variant của sản phẩm
  const getMinVariantPrice = (product: IProduct) => {
    if (!Array.isArray((product as any).variants) || (product as any).variants.length === 0) return null
    const productVariants = variants.filter(v =>
      ((product as any).variants as string[]).includes(v._id || '')
    )
    if (productVariants.length === 0) return null
    const prices = productVariants.map(v => v.price).filter(p => typeof p === 'number')
    if (prices.length === 0) return null
    return Math.min(...prices)
  }

  // Lấy ảnh từ variant đầu tiên có ảnh, nếu không có thì lấy ảnh sản phẩm
  const getDisplayImage = (product: IProduct) => {
    if (!Array.isArray((product as any).variants) || (product as any).variants.length === 0) return (product as any).images?.[0] || ''
    const productVariants = variants.filter(v =>
      ((product as any).variants as string[]).includes(v._id || '')
    )
    const variantWithImage = productVariants.find(v => Array.isArray((v as any).image_url) && (v as any).image_url.length > 0)
    if (variantWithImage) return (variantWithImage as any).image_url[0]
    return (product as any).images?.[0] || ''
  }

  const sortedProducts = [...products].sort((a, b) => {
    const aPrice = getMinVariantPrice(a) ?? 0
    const bPrice = getMinVariantPrice(b) ?? 0
    switch (sortOption) {
      case 'asc':
        return aPrice - bPrice
      case 'desc':
        return bPrice - aPrice
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
            {sortedProducts.map((product) => {
              const minPrice = getMinVariantPrice(product)
              const displayImage = getDisplayImage(product)
              return (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block"
                >
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="mt-3 text-base font-medium">{product.name}</div>
                  <div className="text-sm font-semibold text-gray-800 mt-1">
                    {typeof minPrice === 'number'
                      ? minPrice.toLocaleString('vi-VN') + '₫'
                      : 'Giá đang cập nhật'}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default Products
