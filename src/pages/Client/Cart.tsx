import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';

interface CartItem {
    id: number;
    name: string;
    size: number;
    color: string;
    image: string;
    price: number;
    quantity: number;
}

const Cart: React.FC = () => {
    const cartItems: CartItem[] = [
        {
            id: 1,
            name: 'Giày thể thao Promax PR-1907',
            size: 38,
            color: 'White/Blue',
            image: 'https://picsum.photos/seed/promax/120/120',
            price: 285000,
            quantity: 1,
        },
    ];

    const formatCurrency = (value: number) =>
        value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return (
        <>
            <Breadcrumb current="Giỏ hàng" />
            <div className="max-w-5xl mx-auto px-4 py-10 font-['Quicksand']">

                <h2 className="text-2xl font-bold text-center mb-6">GIỎ HÀNG CỦA BẠN</h2>
                <p className="text-center text-gray-600 text-sm mb-8">
                    Có {cartItems.length} sản phẩm trong giỏ hàng
                </p>

                {/* Header */}
                <div className="grid grid-cols-12 gap-4 font-semibold text-sm border-b pb-3 mb-4 text-gray-700 uppercase">
                    <div className="col-span-5">Tên sản phẩm</div>
                    <div className="col-span-2 text-center">Giá</div>
                    <div className="col-span-2 text-center">Số lượng</div>
                    <div className="col-span-2 text-right">Thành tiền</div>
                    <div className="col-span-1"></div>
                </div>

                {/* Items */}
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-12 gap-4 items-center border-b py-4"
                    >
                        {/* Image + info */}
                        <div className="col-span-5 flex items-center gap-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded border"
                            />
                            <div>
                                <h3 className="text-sm font-semibold">{item.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {item.size} / {item.color}
                                </p>
                            </div>
                        </div>

                        {/* Giá */}
                        <div className="col-span-2 text-center text-sm font-medium">
                            {formatCurrency(item.price)}
                        </div>

                        {/* Số lượng */}
                        <div className="col-span-2 flex justify-center items-center gap-2">
                            <button className="px-2 py-1 border rounded text-sm">-</button>
                            <input
                                type="number"
                                readOnly
                                value={item.quantity}
                                className="w-10 text-center border rounded text-sm"
                            />
                            <button className="px-2 py-1 border rounded text-sm">+</button>
                        </div>

                        {/* Thành tiền */}
                        <div className="col-span-2 text-right text-sm font-semibold text-black">
                            {formatCurrency(item.price * item.quantity)}
                        </div>

                        {/* Xóa */}
                        <div className="col-span-1 text-right">
                            <button className="text-gray-400 hover:text-red-600 text-base">
                                <CloseOutlined />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Tổng tiền + thanh toán */}
                <div className="flex justify-end mt-8">
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="flex justify-between text-lg font-semibold border-t pt-4">
                            <span>Tổng cộng:</span>
                            <span>{formatCurrency(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0))}</span>
                        </div>
                        <button className="w-full bg-black text-white py-3 font-semibold hover:opacity-90 transition">
                            TIẾN HÀNH THANH TOÁN
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
