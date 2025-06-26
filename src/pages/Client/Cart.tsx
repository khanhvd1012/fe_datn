import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import { useSizes } from '../../hooks/useSizes';

interface CartItem {
    _id: string;
    name: string;
    size: string; // lưu id size
    color?: string;
    image: string;
    price: number;
    quantity: number;
}

interface Size {
    _id: string;
    name: string;
}

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const { data: sizes = [], isLoading: isSizesLoading } = useSizes();

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(cart);
    }, []);

    const getSizeName = (id: string) => {
        if (!id || !Array.isArray(sizes) || sizes.length === 0) return id;
        const found = sizes.find(s => s._id === id);
        return found ? found.name : id;
    };

    const formatCurrency = (value: number) =>
        value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    // Cập nhật số lượng
    const updateQuantity = (idx: number, newQty: number) => {
        if (newQty < 1) return;
        const newCart = [...cartItems];
        newCart[idx].quantity = newQty;
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    // Xóa sản phẩm
    const removeItem = (idx: number) => {
        const newCart = [...cartItems];
        newCart.splice(idx, 1);
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    return (
        <>
            <Breadcrumb current="Giỏ hàng" />
            <div className="max-w-5xl mx-auto px-4 py-10 font-['Quicksand']">
                <h2 className="text-2xl font-bold text-center mb-6">
                    GIỎ HÀNG CỦA BẠN
                </h2>
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
                {cartItems.map((item, idx) => (
                    <div
                        key={item._id + '-' + item.size}
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
                                    Size: {getSizeName(item.size)} {item.color && <>/ {item.color}</>}
                                </p>
                            </div>
                        </div>

                        {/* Giá */}
                        <div className="col-span-2 text-center text-sm font-medium">
                            {formatCurrency(item.price)}
                        </div>

                        {/* Số lượng */}
                        <div className="col-span-2 flex justify-center items-center gap-2">
                            <button
                                className="px-2 py-1 border rounded text-sm"
                                onClick={() => updateQuantity(idx, item.quantity - 1)}
                            >-</button>
                            <input
                                type="number"
                                value={item.quantity}
                                min={1}
                                className="w-10 text-center border rounded text-sm"
                                onChange={e => updateQuantity(idx, Number(e.target.value))}
                            />
                            <button
                                className="px-2 py-1 border rounded text-sm"
                                onClick={() => updateQuantity(idx, item.quantity + 1)}
                            >+</button>
                        </div>

                        {/* Thành tiền */}
                        <div className="col-span-2 text-right text-sm font-semibold text-black">
                            {formatCurrency(item.price * item.quantity)}
                        </div>

                        {/* Xóa */}
                        <div className="col-span-1 text-right">
                            <button
                                className="text-gray-400 hover:text-red-600 text-base"
                                onClick={() => removeItem(idx)}
                            >
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
                            <span>
                                {formatCurrency(
                                    cartItems.reduce(
                                        (acc, item) => acc + item.price * item.quantity,
                                        0
                                    )
                                )}
                            </span>
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
