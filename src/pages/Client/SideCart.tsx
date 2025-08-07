import React, { useState, useEffect, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useCart, useRemoveFromCart, useUpdateCartItem } from '../../hooks/useCart';
import { getColorById } from '../../service/colorAPI';

const SideCart = ({ onClose }: { onClose: () => void }) => {
  const { mutate: updateCartItem } = useUpdateCartItem();
  const { data: cartData } = useCart();
  const cart = cartData?.cart_items || [];

  const [cartWithColors, setCartWithColors] = useState(cart);
  const { mutate: removeFromCart } = useRemoveFromCart();
  const [closing, setClosing] = useState(false);
  const [opening, setOpening] = useState(false);
  const location = useLocation();
  const cartRef = useRef<HTMLDivElement>(null);

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.variant_id.price,
    0
  );

  // Lấy màu từ API nếu thiếu thông tin color
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const updatedCart = await Promise.all(
          cart.map(async (item) => {
            if (
              item.variant_id?.color &&
              typeof item.variant_id.color === 'object' &&
              item.variant_id.color._id
            ) {
              const color = await getColorById(item.variant_id.color._id);
              return {
                ...item,
                variant_id: {
                  ...item.variant_id,
                  color,
                },
              };
            }
            return item;
          })
        );
        setCartWithColors(updatedCart);
      } catch (err) {
        console.error("Lỗi lấy màu:", err);
      }
    };

    fetchColors();
  }, [cartData]);

  // Auto đóng khi chuyển route
  useEffect(() => {
    if (opening) handleClose();
  }, [location.pathname]);

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
            cartWithColors.map((item: any, idx: number) => {
              const variant = item.variant_id;
              const product = variant.product_id;
              const imageUrl = Array.isArray(variant.image_url) ? variant.image_url[0] : '/no-image.png';

              return (
                <div className="flex gap-3 mb-4" key={idx}>
                  <img
                    src={imageUrl || '/no-image.png'}
                    alt={product?.name}
                    className="border w-20 h-20 object-cover"
                    onError={(e) => (e.currentTarget.src = '/no-image.png')}
                  />
                  <div className="flex-1">
                    <h3 className="text-xs font-semibold uppercase leading-snug">
                      {product?.name}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                      {variant.color && typeof variant.color === 'object' && (
                        <div className="flex items-center gap-1">
                          Màu:
                          <span
                            className="w-3 h-3 border inline-block"
                            style={{
                              backgroundColor: variant.color.code || 'transparent',
                            }}
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-x-20">
                        <span>Size: {variant.size?.size}</span>

                        <div className="flex items-center">
                          <button
                            className="w-6 h-6 border border-gray-400 text-sm"
                            onClick={() =>
                              updateCartItem({
                                variant_id: variant._id,
                                quantity: item.quantity - 1,
                              })
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            min={1}
                            className="w-8 h-6 text-center border border-gray-400 text-sm mx-1 "
                            onChange={(e) => {
                              const newQty = Number(e.target.value);
                              if (newQty >= 1) {
                                updateCartItem({
                                  variant_id: variant._id,
                                  quantity: newQty,
                                });
                              }
                            }}
                          />
                          <button
                            className="w-6 h-6 border border-gray-400 text-sm"
                            onClick={() =>
                              updateCartItem({
                                variant_id: variant._id,
                                quantity: item.quantity + 1,
                              })
                            }
                          >
                            +
                          </button>
                          <button
                            className="ml-10 text-red-400 hover:text-red-500"
                            onClick={() => removeFromCart(item)}
                            title="Xóa sản phẩm"
                          >
                            <CloseOutlined />
                          </button>
                        </div>
                      </div>
                      <div>
                        Giá: <span className="font-semibold text-black">{(item.quantity * variant.price)?.toLocaleString('vi-VN')}đ</span>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t mt-3 mb-3"></div>

        <div className="flex justify-between text-sm mb-4">
          <span>TỔNG TIỀN:</span>
          <span>{total.toLocaleString('vi-VN')}đ</span>
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
