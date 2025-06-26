import React, { useState, useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useSizes } from '../../hooks/useSizes'
import type { ISize } from '../../interface/size'
import axios from 'axios';

const SideCart = ({ onClose }: { onClose: () => void }) => {
    const [cart, setCart] = useState<any[]>([]);
    const { data: sizes = [] } = useSizes();
    const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        const fetchCartWithImages = async () => {
            const rawCart = JSON.parse(localStorage.getItem("cart") || "[]");
            // Giả sử bạn có API lấy variant theo product._id hoặc variant._id
            const res = await axios.get('http://localhost:8080/api/variants');
            const allVariants = res.data.data || [];
            const updatedCart = rawCart.map((item: any) => {
                // Tìm variant đúng với sản phẩm và size
                const variant = allVariants.find((v: any) =>
                    v.product_id && (v.product_id._id === item._id || v.product_id === item._id) &&
                    Array.isArray(v.size) &&
                    v.size.some((s: any) =>
                        (typeof s === 'object' && (s._id === item.size || s.size === item.size)) ||
                        (typeof s === 'string' && s === item.size)
                    )
                );
                const image = variant && Array.isArray(variant.image_url) && variant.image_url.length > 0
                    ? variant.image_url[0]
                    : '/no-image.png';
                return { ...item, image };
            });
            setCart(updatedCart);
        };
        fetchCartWithImages();
    }, []);

    // Hàm lấy tên size từ id
    const getSizeName = (id: string) => {
        if (!id || !Array.isArray(sizes) || sizes.length === 0) return id;
        const found = sizes.find((s: ISize) => s._id === id);
        return found ? found.size : id;
    };

    // Hàm cập nhật số lượng
    const updateQuantity = (idx: number, newQty: number) => {
        if (newQty < 1) return;
        const newCart = [...cart];
        newCart[idx].quantity = newQty;
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    console.log(JSON.parse(localStorage.getItem("cart")));

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

            {/* Product items */}
            <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">Chưa có sản phẩm nào trong giỏ hàng.</div>
                ) : (
                    cart.map((item: any, idx: number) => (
                        <div className="flex gap-3 mb-4" key={idx}>
                            <img
                                src={item.image || '/no-image.png'}
                                alt={item.name}
                                className="border w-20 h-20 object-cover"
                                onError={e => (e.currentTarget.src = '/no-image.png')}
                            />
                            <div className="flex-1">
                                <h3 className="text-xs font-semibold uppercase leading-snug">
                                    {item.name}
                                </h3>
                                <div className="text-xs text-gray-500 mt-1">
                                    {item.color ? `${item.color} / ` : ''}
                                    Size: {getSizeName(item.size)}
                                </div>
                                <div className="flex items-center mt-2">
                                    <button
                                        className="w-7 h-7 border border-gray-400 text-lg"
                                        onClick={() => updateQuantity(idx, item.quantity - 1)}
                                    >-</button>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        min={1}
                                        className="w-8 h-8 text-center border border-gray-400 text-sm mx-2"
                                        onChange={e => updateQuantity(idx, Number(e.target.value))}
                                    />
                                    <button
                                        className="w-7 h-7 border border-gray-400 text-lg"
                                        onClick={() => updateQuantity(idx, item.quantity + 1)}
                                    >+</button>
                                    <span className="text-sm font-semibold ml-2">{item.price?.toLocaleString('vi-VN')}₫</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Divider */}
            <div className="border-t mt-3 mb-3"></div>

            {/* Tổng tiền */}
            <div className="flex justify-between text-sm mb-4">
                <span>TỔNG TIỀN:</span>
                <span>{total.toLocaleString('vi-VN')}₫</span>
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
