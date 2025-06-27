import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import { useSizes } from '../../hooks/useSizes';
import axios from 'axios';
import type { IVariant } from '../../interface/variant';
import type { ISize } from '../../interface/size';

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const { data: sizes = [], isLoading: isSizesLoading } = useSizes();

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        // Lấy toàn bộ variants 1 lần
        axios.get('http://localhost:3000/api/variants')
            .then(res => {
                const allVariants = res.data.data || [];
                Promise.all(
                    cart.map(async (item: any) => {
                        // Tìm variant đúng với product và size
                        const variant = allVariants.find((v: any) =>
                            (v.product_id && (v.product_id._id === item._id || v.product_id === item._id)) &&
                            Array.isArray(v.size) &&
                            v.size.some((s: any) =>
                                (typeof s === 'object' && (s._id === item.size || s.size === item.size)) ||
                                (typeof s === 'string' && s === item.size)
                            )
                        );
                        // Lấy ảnh
                        const image = variant && Array.isArray(variant.image_url) && variant.image_url.length > 0
                            ? variant.image_url[0]
                            : item.image;
                        // Lấy tên size
                        let sizeName = item.size;
                        if (variant && Array.isArray(variant.size)) {
                            const found = variant.size.find((s: any) =>
                                (typeof s === 'object' && (s._id === item.size || s.size === item.size)) ||
                                (typeof s === 'string' && s === item.size)
                            );
                            if (found) sizeName = typeof found === 'object'
                                ? (found.size || found.name || found._id)
                                : found;
                        }
                        // Nếu vẫn là id, thử lấy từ hook sizes
                        if ((sizeName === item.size || !sizeName) && sizes.length > 0) {
                            const foundSize = sizes.find((s: ISize) => s._id === item.size);
                            if (foundSize) sizeName = foundSize.size || foundSize.name || item.size;
                        }
                        return { ...item, image, sizeName };
                    })
                ).then(setCartItems);
            });
    }, [sizes]);

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
                                    Size: {item.sizeName || item.size} {item.color && <>/ {item.color}</>}
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
