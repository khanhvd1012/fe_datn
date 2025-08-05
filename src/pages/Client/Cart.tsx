import { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import { useSizes } from '../../hooks/useSizes';
import axios from 'axios';
import type { ISize } from '../../interface/size';
import { message, Button } from 'antd';
const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { data: sizes = [] } = useSizes();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    axios.get('http://localhost:3000/api/variants')
      .then(res => {
        const allVariants = res.data.data || [];
        Promise.all(
          cart.map(async (item: any) => {
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

            const image = variant && Array.isArray(variant.image_url) && variant.image_url.length > 0
              ? variant.image_url[0]
              : item.image;
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
            if ((sizeName === item.size || !sizeName) && sizes.length > 0) {
              const foundSize = sizes.find((s: ISize) => s._id === item.size);
              if (foundSize) sizeName = foundSize.size || item.size;
            }
            return { ...item, image, sizeName, size_id: typeof item.size === 'object' ? item.size._id : item.size, variant_id: variant?._id, color: variant?.color || item.color, stock: variant?.stock?.quantity || 0 };
          })
        ).then(setCartItems);
      });
  }, [sizes]);

  const addAllToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await Promise.all(cartItems.map(item => {
        return axios.post(
          'http://localhost:3000/api/carts',
          {
            variant_id: item.variant_id,
            quantity: item.quantity,
            size_id: item.size_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }));
      message.success('Đã cập nhật giỏ hàng!');
      setTimeout(() => {
  window.location.href = "/checkout";
}, 3000); 

    } catch (err: any) {
      console.error(err);
      message.error('Có lỗi khi cập nhật giỏ hàng!');
    }
  };


  const formatCurrency = (value: number) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const updateQuantity = (idx: number, newQty: number) => {
    if (newQty < 1) return;

    const item = cartItems[idx];

    if (newQty > item.stock) {
      message.warning(`Số lượng tồn kho chỉ còn ${item.stock} sản phẩm`);
      return;
    }

    const newCart = [...cartItems];
    newCart[idx].quantity = newQty;
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (idx: number) => {
    const newCart = [...cartItems];
    newCart.splice(idx, 1);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <Breadcrumb current="Giỏ hàng" />
      <div
        className="max-w-6xl mx-auto px-4 py-10"
        style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
      >
        <h2 className="text-2xl font-bold text-center mb-6">GIỎ HÀNG CỦA BẠN</h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Danh sách sản phẩm */}
          <div className="flex-1">
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">Chưa có sản phẩm nào trong giỏ hàng.</div>
            ) : (
              cartItems.map((item, idx) => (
                <div
                  key={item._id + '-' + item.size}
                  className="flex flex-col md:flex-row items-center gap-6 border-b py-6"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded border"
                  />
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold">{item.name}</h3>
                        <div className="text-sm text-gray-500 mt-1">
                          Size: {item.sizeName || item.size}
                          {item.color && typeof item.color === 'object' && (
                            <div className="flex items-center gap-1">
                              <span
                                className="w-3 h-3 border"
                                style={{ backgroundColor: item.color.code }}
                              />
                              <span>{item.color.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Giá: <span className="font-semibold text-black">{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <button
                          className="w-8 h-8 border rounded text-lg"
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                        >-</button>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          max={item.stock}
                          className="w-12 text-center border rounded text-base"
                          onChange={e => updateQuantity(idx, Number(e.target.value))}
                        />
                        <button
                          className="w-8 h-8 border rounded text-lg"
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                        >+</button>
                      </div>
                      <div className="text-base font-semibold text-black min-w-[100px] text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-600 text-xl ml-2"
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
          {/* Tổng tiền và thanh toán */}
          <div className="w-full md:w-[340px] shrink-0">
            <div className="bg-gray-50 border rounded-lg p-6 sticky top-24">
              <div className="flex justify-between mb-4 text-base font-semibold">
                <span>Tổng cộng</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Button
                type="primary"
                block
                className={`bg-black text-white font-semibold py-3 rounded ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={addAllToCart}
                disabled={cartItems.length === 0}
              >
                TIẾN HÀNH THANH TOÁN
              </Button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                Giá đã bao gồm VAT (nếu có). Phí vận chuyển sẽ được tính ở bước thanh toán tiếp theo.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
