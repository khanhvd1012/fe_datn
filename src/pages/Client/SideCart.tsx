import React, { useState, useEffect, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useSizes } from '../../hooks/useSizes';
import type { ISize } from '../../interface/size';
import axios from 'axios';
import { message } from 'antd';

const SideCart = ({ onClose }: { onClose: () => void }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [closing, setClosing] = useState(false);
  const [opening, setOpening] = useState(false);
  const { data: sizes = [] } = useSizes();
  const location = useLocation();
  const cartRef = useRef<HTMLDivElement>(null);

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  // Auto đóng khi chuyển route
  useEffect(() => {
    if (opening) handleClose();
  }, [location.pathname]);

  useEffect(() => {
    const fetchCartWithImages = async () => {
      const rawCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const res = await axios.get('http://localhost:3000/api/variants');
      const allVariants = res.data.data || [];

      const updatedCart = rawCart.map((item: any) => {
        const variant = allVariants.find((v: any) =>
          (v.product_id && (v.product_id._id === item._id || v.product_id === item._id)) &&
          Array.isArray(v.size) &&
          v.size.some((s: any) =>
            (typeof s === 'object' && (s._id === item.size || s.size === item.size)) ||
            (typeof s === 'string' && s === item.size)
          ) &&
          (
            !item.color || !v.color ||
            (typeof item.color === 'object' && typeof v.color === 'object' &&
              (item.color._id === v.color._id || item.color.name === v.color.name)) ||
            (typeof item.color === 'string' &&
              (item.color === v.color?._id || item.color === v.color?.name))
          )
        );

        const image = variant?.image_url?.[0] || '/no-image.png';

        return {
          ...item,
          image,
          variant_id: variant?._id || null,
          color: variant?.color || item.color,
        };
      });

      setCart(updatedCart);
    };

    fetchCartWithImages();
  }, []);

  useEffect(() => {
    setTimeout(() => setOpening(true), 10);
  }, []);

  // Đóng khi click ra ngoài hoặc scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    const handleScroll = () => {
      handleClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const addAllToCart = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!cart || cart.length === 0) {
        message.warning('Không có sản phẩm nào để thêm vào giỏ!');
        return;
      }

      await Promise.all(
        cart.map(async (item, idx) => {
          if (!item.variant_id) {
            console.warn(` Item ${idx + 1} thiếu variant_id`);
            return null;
          }

          await axios.post(
            'http://localhost:3000/api/carts',
            {
              variant_id: item.variant_id,
              quantity: item.quantity,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        })
      );

      message.success('Đã cập nhật giỏ hàng!');
      window.location.href = '/checkout';
    } catch (err) {
      console.error('Lỗi khi thêm giỏ hàng:', err);
      message.error('Có lỗi khi cập nhật giỏ hàng!');
    }
  };

  const removeItem = (idx: number) => {
    const newCart = [...cart];
    newCart.splice(idx, 1);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    message.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const getSizeName = (id: string) => {
    const found = sizes.find((s: ISize) => s._id === id);
    return found ? found.size : id;
  };

  const updateQuantity = (idx: number, newQty: number) => {
    if (newQty < 1) return;
    const newCart = [...cart];
    newCart[idx].quantity = newQty;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 300);
  };

  return (
    <>
      <div
        ref={cartRef}
        className={`sidecart-transition fixed top-0 right-0 w-[400px] h-full bg-white shadow-2xl z-50 px-6 py-5 flex flex-col ${closing ? 'sidecart-close' : opening ? 'sidecart-open' : 'sidecart-close'
          }`}
        style={{ fontFamily: 'Quicksand, sans-serif' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold mb-6">Giỏ hàng</h2>
          <button onClick={handleClose} className="text-lg">
            <CloseOutlined />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              Chưa có sản phẩm nào trong giỏ hàng.
            </div>
          ) : (
            cart.map((item: any, idx: number) => (
              <div className="flex gap-3 mb-4" key={idx}>
                <img
                  src={item.image || '/no-image.png'}
                  alt={item.name}
                  className="border w-20 h-20 object-cover"
                  onError={(e) => (e.currentTarget.src = '/no-image.png')}
                />
                <div className="flex-1">
                  <h3 className="text-xs font-semibold uppercase leading-snug">
                    {item.name}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.color && typeof item.color === 'object' && (
                      <div className="flex items-center gap-1">
                        <span
                          className="w-3 h-3 border"
                          style={{ backgroundColor: item.color.code }}
                        />
                        <span>{item.color.name}</span>
                      </div>
                    )}
                    <span>Size: {getSizeName(item.size)}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <button
                      className="w-7 h-7 border border-gray-400 text-lg"
                      onClick={() => updateQuantity(idx, item.quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      className="w-8 h-8 text-center border border-gray-400 text-sm mx-2"
                      onChange={(e) =>
                        updateQuantity(idx, Number(e.target.value))
                      }
                    />
                    <button
                      className="w-7 h-7 border border-gray-400 text-lg"
                      onClick={() => updateQuantity(idx, item.quantity + 1)}
                    >
                      +
                    </button>
                    <span className="text-sm font-semibold ml-2">
                      {item.price?.toLocaleString('en-US')}$
                    </span>
                    <button
                      className="ml-auto text-gray-400 hover:text-red-500"
                      onClick={() => removeItem(idx)}
                      title="Xóa sản phẩm"
                    >
                      <CloseOutlined />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t mt-3 mb-3"></div>

        <div className="flex justify-between text-sm mb-4">
          <span>TỔNG TIỀN:</span>
          <span>{total.toLocaleString('en-US')}$</span>
        </div>

        <div className="flex gap-2 mb-2">
          <Link
            to="/cart"
            className="bg-black text-white w-1/2 py-2 text-sm text-center flex items-center justify-center"
          >
            XEM GIỎ HÀNG
          </Link>
          <Link
            to="/checkout"
            className="bg-black text-white w-1/2 py-2 text-sm text-center flex items-center justify-center"
            onClick={addAllToCart}
          >
            THANH TOÁN
          </Link>
        </div>

        <button className="bg-blue-700 hover:bg-blue-800 text-white text-sm py-2 w-full">
          CLICK NHẬN MÃ GIẢM GIÁ NGAY!
        </button>
      </div>

      <style>{`
        .sidecart-transition {
          transition: transform 0.3s, opacity 0.3s;
        }
        .sidecart-open {
          transform: translateX(0);
          opacity: 1;
        }
        .sidecart-close {
          transform: translateX(100%);
          opacity: 0;
        }
      `}</style>
    </>
  );
};

export default SideCart;
