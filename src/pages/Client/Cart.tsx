import { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';

import { useCart, useRemoveFromCart, useUpdateCartItem } from '../../hooks/useCart';
import { getColorById } from '../../service/colorAPI';
import { message, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { mutate: updateCartItem } = useUpdateCartItem();
  const { data: cartData } = useCart();
  const cart = cartData?.cart_items || [];
  console.log(cart);
  const [cartWithColors, setCartWithColors] = useState(cart);
  const navigate = useNavigate();
  const { mutate: removeFromCart } = useRemoveFromCart();


  useEffect(() => {
    const fetchColors = async () => {
      try {
        const updatedCart = await Promise.all(
          cart.map(async (item) => {
            if (
              typeof item.variant_id?.color === 'object' &&
              item.variant_id.color !== null &&
              typeof item.variant_id.color._id === 'string'
            ) {
              console.log('✅ Màu sắc:', item.variant_id.color);
              const color = await getColorById(item.variant_id.color._id);
              console.log('✅ Màu sắc:', color);
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
        console.log("🖌️ Cart with colors:", updatedCart);
      } catch (err) {
        console.error("❌ Lỗi lấy màu:", err);
      }
    };

    fetchColors();
  }, [cartData]);

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.variant_id.price,
    0
  );


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
            {cartWithColors.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">Chưa có sản phẩm nào trong giỏ hàng.</div>
            ) : (
              cartWithColors.map((item: any, idx: number) => (
                <div
                  // key={item._id + '-' + item.size}
                  key={idx}
                  className="flex flex-col md:flex-row items-center gap-6 border-b py-6"
                >
                  <img
                    src={item.variant_id.image_url || '/no-image.png'}
                    alt={item.variant_id.product_id.name}
                    className="w-32 h-32 object-cover rounded border"
                  />
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold">{item.variant_id.product_id.name}</h3>
                        <div className="text-sm text-gray-500 mt-1">
                          <div>Size: {item?.variant_id?.size?.size || 'Không rõ'}</div>

                          {item?.variant_id?.color && typeof item.variant_id.color === 'object' && (
                            <div className="flex items-center gap-1">
                              <span>Màu:</span>
                              <span
                                className="w-3 h-3 border inline-block "
                                style={{ backgroundColor: item.variant_id.color.code }}
                              />
                              <span>{item.variant_id.color.name}</span>
                            </div>
                          )}
                        </div>

                        <div className="text-sm text-gray-500 mt-1">
                          Giá: <span className="font-semibold text-black"> {(item.variant_id.price)?.toLocaleString('en-US')}$</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <button
                          className="w-8 h-8 border rounded text-lg"
                          onClick={() =>
                            updateCartItem({
                              variant_id: item.variant_id._id,
                              quantity: item.quantity - 1,
                            })
                          }
                        >-</button>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          max={item.stock}
                          className="w-12 text-center border rounded text-base"
                          onChange={(e) => {
                            const newQty = Number(e.target.value);
                            if (newQty >= 1) {
                              updateCartItem({
                                variant_id: item.variant_id._id,
                                quantity: newQty,
                              });
                            }
                          }}
                        />
                        <button
                          className="w-8 h-8 border rounded text-lg"
                          onClick={() =>
                            updateCartItem({
                              variant_id: item.variant_id._id,
                              quantity: item.quantity + 1,
                            })
                          }
                        >+</button>
                      </div>
                      <div className="text-base font-semibold text-black min-w-[100px] text-right">
                        {/* {formatCurrency(item.price * item.quantity)} */}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Tổng Giá : <span className="font-semibold text-black"> {(item.quantity * item.variant_id.price)?.toLocaleString('en-US')}$</span>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-600 text-xl ml-2"
                        onClick={() => removeFromCart(item._id)}
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
                <span>{(total)}$</span>
              </div>
              <Button
                type="primary"
                block
                className={`bg-black text-white font-semibold py-3 rounded ${cartWithColors.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => navigate('/checkout')}
                disabled={cartWithColors.length === 0}
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
