import React, { useState } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'


const SideCart = ({ onClose }: { onClose: () => void }) => {
      const [isCartOpen, setIsCartOpen] = useState(false);
    return (
        <div
            className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-2xl z-50 px-6 py-5 flex flex-col"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold mb-6">Giỏ hàng</h2>
                <button onClick={onClose} className="text-lg">
                    <CloseOutlined />
                </button>
            </div>

            {/* Product item */}
            <div className="flex gap-3 mb-4">
                <img src="https://picsum.photos/seed/shoe1/80/80" alt="Product" className="border" />
                <div className="flex-1">
                    <h3 className="text-xs font-semibold uppercase leading-snug">
                        Nike Air Max 90 <br /> Essential “Grape”
                    </h3>
                    <div className="text-xs text-gray-500 mt-1">Tím / 36</div>
                    <div className="flex items-center mt-2">
                        <input
                            type="number"
                            value={1}
                            className="w-8 h-8 text-center border border-gray-400 text-sm mr-2"
                            readOnly
                        />
                        <span className="text-sm font-semibold">4,800,000₫</span>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-red-500">
                    <CloseOutlined />
                </button>
            </div>

            {/* Divider */}
            <div className="border-t mt-3 mb-3"></div>

            {/* Tổng tiền */}
            <div className="flex justify-between text-sm mb-4">
                <span>TỔNG TIỀN:</span>
                <span>4,800,000₫</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mb-2">
                <Link
                    to="/cart"
                    className="bg-black text-white w-1/2 py-2 text-sm text-center flex items-center justify-center"
                >
                    XEM GIỎ HÀNG
                </Link>
                <Link
                    to="/pay"
                    className="bg-black text-white w-1/2 py-2 text-sm text-center flex items-center justify-center"
                >
                    THANH TOÁN
                </Link>

            </div>

            <button className="bg-blue-700 hover:bg-blue-800 text-white text-sm  py-2 w-full">
                CLICK NHẬN MÃ GIẢM GIÁ NGAY !
            </button>
        </div>
    )
}

export default SideCart
