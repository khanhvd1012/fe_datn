import React, { useEffect, useState, useRef } from 'react';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import axios from 'axios';
import { Input, Select, Button, Card, Image, Row, Col, Typography, Divider, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { TextArea } = Input;
  const { Title, Text } = Typography;
  const navigate = useNavigate();

  const [cartData, setCartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sizeMap, setSizeMap] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const cartItemIdsRef = useRef<string[]>([]);
  const [itemColors, setItemColors] = useState<Record<string, { name: string; code: string }>>({});
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    shipping_address: '',
    email: '',
    note: '',
    shipping_type: 'standard',
    payment_method: 'cod zalopay',
    voucher_code: '',
    voucher_type: '',
    voucher_value: 0,
  });
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.user;

        // Tìm địa chỉ có updatedAt gần nhất
        const latestAddress = (user?.shipping_addresses || [])
          .slice() // clone mảng tránh thay đổi gốc
          .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

        // Cập nhật form nếu có địa chỉ
        setFormData((prev) => ({
          ...prev,
          full_name: latestAddress?.full_name || '',
          phone: latestAddress?.phone || '',
          shipping_address: latestAddress?.address || '',
          email: user?.email || '',
        }));

      } catch (error) {
        console.error('Không lấy được thông tin người dùng:', error);
      }
    };

    fetchUserProfile();
  }, []);


  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/carts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartData(res.data.data);

        const cartItems = res.data.data.cart_items || [];
        cartItemIdsRef.current = cartItems.map((item: any) => item._id);
      } catch (error) {
        message.error('Không thể lấy dữ liệu giỏ hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);
  useEffect(() => {
    if (!cartData?.cart_items) return;

    const fetchAllColors = async () => {
      const newColorMap: Record<string, { name: string; code: string }> = {};

      for (const item of cartData.cart_items) {
        const colorId = item.variant_id.color._id;

        if (!newColorMap[colorId]) {
          try {
            const res = await axios.get(`http://localhost:3000/api/colors/${colorId}`);
            const color = res.data.color;
            newColorMap[colorId] = { name: color.name, code: color.code };
          } catch (error) {
            console.error(`Không lấy được màu với id ${colorId}`, error);
          }
        }
      }

      setItemColors(newColorMap);
    };

    fetchAllColors();
  }, [cartData]);


  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/sizes');
        const sizes = res.data.sizes;
        const map: Record<string, number> = {};
        sizes.forEach((s: any) => {
          map[s._id] = s.size;
        });
        // console.log(" Color map:", map);
        setSizeMap(map);
      } catch (err) {
        console.error('Không lấy được size', err);
      }
    };

    fetchSizes();
  }, []);

  useEffect(() => {
    const cart = localStorage.getItem('cart');
    if (cart) {
      localStorage.setItem('cart_backup', cart); // lưu lại bản sao
      localStorage.removeItem('cart'); // xoá tạm thời
    }

    return () => {
      // Khi rời khỏi trang mà chưa đặt hàng, khôi phục lại cart
      const backup = localStorage.getItem('cart_backup');
      if (backup) {
        localStorage.setItem('cart', backup);
        localStorage.removeItem('cart_backup');
      }
      const token = localStorage.getItem('token');
      if (token) {
        const ids = cartItemIdsRef.current;

        ids.forEach((id) => {
          axios
            .delete(`http://localhost:3000/api/carts/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => console.log(`Đã xoá cart item ${id}`))
            .catch((err) => console.error(`Lỗi xoá cart item ${id}:`, err));
        });
      }
    };
  }, []);


  useEffect(() => {
    const voucherId = localStorage.getItem('selected_voucher_id');
    if (voucherId) {
      axios
        .get(`http://localhost:3000/api/vouchers/${voucherId}`)
        .then((res) => {
          const voucher = res.data?.data || res.data;
          if (voucher?.code && voucher?.type && voucher?.value !== undefined) {
            setFormData((prev) => ({
              ...prev,
              voucher_code: voucher.code,
              voucher_type: voucher.type,
              voucher_value: voucher.value,
            }));
          }
        })
        .catch((err) => {
          console.error('Không tìm thấy mã giảm giá', err);
        });
    }
  }, []);

  const cartItems = cartData?.cart_items || [];
  const total = cartData?.total || 0;
  const shippingFee = 35000;

  const discountAmount =
    formData.voucher_type === 'percentage'
      ? Math.round((total * formData.voucher_value) / 100)
      : formData.voucher_value || 0;

  const finalTotal = total - discountAmount + shippingFee;

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // Kiểm tra họ tên: phải có ít nhất 2 từ, không chứa số
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Vui lòng nhập họ tên';
    } else if (!/^[\p{L}\s']+$/u.test(formData.full_name)) {
      newErrors.full_name = 'Họ tên chỉ được chứa chữ và khoảng trắng';
    } else if (formData.full_name.trim().split(/\s+/).length < 2) {
      newErrors.full_name = 'Vui lòng nhập đầy đủ họ và tên';
    }

    // Kiểm tra số điện thoại Việt Nam
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Kiểm tra địa chỉ: ít nhất 10 ký tự
    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Vui lòng nhập địa chỉ';
    } else if (formData.shipping_address.length < 10) {
      newErrors.shipping_address = 'Địa chỉ quá ngắn';
    }

    // Kiểm tra email (nếu có nhập)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      cart_id: cartData._id,
      voucher_code: formData.voucher_code,
      shipping_address: formData.shipping_address,
      full_name: formData.full_name,
      phone: formData.phone,
      payment_method: formData.payment_method,
    };

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/orders', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderId = res.data?.donHang?._id || res.data?.data?._id;

      // Nếu chọn ZaloPay thì redirect sang link thanh toán
      if (formData.payment_method === 'ZALOPAY' && res.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
        return;
      }

      // Các phương thức khác
      message.success('Đặt hàng thành công!');
      localStorage.setItem('last_order_id', orderId);
      localStorage.removeItem('selected_voucher_id');
      localStorage.removeItem('cart_backup');
      navigate('/checkout/success');
    } catch (err) {
      console.error(err);
      message.error('Đặt hàng thất bại!');
      navigate('/checkout/failed');
    }
  };

  return (
    <>
      <Breadcrumb current="Thanh toán" />
      <div className="max-w-6xl mx-auto p-6">
        <Title level={2} className="text-center">Xác nhận đơn hàng</Title>

        <Row gutter={[24, 24]}>
          {/* BÊN TRÁI: Form nhập */}
          <Col xs={24} md={14}>
            <Card title="Thông tin người nhận" bordered={false}>
              <div className="mb-[10px]">
                <Input
                  placeholder="Họ tên *"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                />
                {errors.full_name && <Text type="danger">{errors.full_name}</Text>}
              </div>
              <div className="mb-[10px]">
                <Input
                  placeholder="Số điện thoại *"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                {errors.phone && <Text type="danger">{errors.phone}</Text>}
              </div>
              <div className="mb-[10px]">
                <Input
                  placeholder="Địa chỉ nhận hàng *"
                  value={formData.shipping_address}
                  onChange={(e) => handleChange('shipping_address', e.target.value)}
                />
                {errors.shipping_address && <Text type="danger">{errors.shipping_address}</Text>}
              </div>
              <div className="mb-[10px]">
                <Input
                  placeholder="Email (tuỳ chọn)"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                {errors.email && <Text type="danger">{errors.email}</Text>}
              </div>
              <div className="mb-[10px]">
                <TextArea
                  rows={3}
                  placeholder="Ghi chú (tuỳ chọn)"
                  value={formData.note}
                  onChange={(e) => handleChange('note', e.target.value)}
                />
              </div>
              <div className="mb-[10px]">
                <Select
                  className="w-full"
                  value={formData.shipping_type}
                  onChange={(value) => handleChange('shipping_type', value)}
                >
                  <Select.Option value="standard">Giao hàng tiêu chuẩn</Select.Option>
                  <Select.Option value="fast">Giao hàng nhanh</Select.Option>
                </Select>
              </div>

              {/* ✅ Phương thức thanh toán đẹp hơn */}
              <div className="mb-4">
                <Text strong className="block mb-2">Phương thức thanh toán</Text>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Thanh toán khi nhận hàng', value: 'cod', icon: '💰' },
                    { label: 'Chuyển khoản ngân hàng', value: 'bank', icon: '🏦' },
                    {
                      label: (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwPynD27LbXlPsbofv1AX-5ZXDn_XMGo-1TA&s"
                            alt="ZaloPay"
                            style={{ width: 20, height: 20 }}
                          />
                          Thanh toán qua ZaloPay
                        </span>
                      ),
                      value: 'ZALOPAY'
                    }].map((method) => (
                      <div
                        key={method.value}
                        onClick={() => handleChange('payment_method', method.value)}
                        className={`cursor-pointer border rounded-xl p-3 text-center transition-all ${formData.payment_method === method.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-green-400'
                          }`}
                      >
                        <div className="text-2xl mb-1">{method.icon}</div>
                        <Text>{method.label}</Text>
                      </div>
                    ))}
                </div>
              </div>

              <Button
                type="primary"
                className="mt-4 w-full h-10 bg-green-600 hover:bg-green-700"
                onClick={handleSubmit}
              >
                Đặt hàng ngay
              </Button>
            </Card>
          </Col>

          {/* BÊN PHẢI: Chi tiết giỏ hàng */}
          <Col xs={24} md={10}>
            <Card title="Sản phẩm trong giỏ hàng" bordered={false}>
              {loading ? (
                <Spin />
              ) : (
                <>
                  {cartItems.map((item: any) => (
                    <div className="flex gap-4 mb-3" key={item._id}>
                      <Image
                        width={80}
                        src={item.variant_id.image_url[0]}
                        alt="product"
                        preview={false}
                      />
                      <div>
                        <Text strong>{item.variant_id.product_id.name}</Text>
                        <div>Size: {item.size_id?.size || 'Không rõ'}</div>
                        {(() => {
                          const color = itemColors[item.variant_id.color._id];
                          console.log("Màu của sản phẩm là:", item.variant_id.color.name);
                          console.log("Màu của sản phẩm là:", item.variant_id.color._id);

                          return color ? (
                            <div className="flex items-center mt-1 gap-2 text-sm">
                              <span>Màu:</span>
                              <span
                                style={{
                                  width: 16,
                                  height: 16,
                                  display: 'inline-block',
                                  backgroundColor: color.code,
                                  border: '1px solid #ccc',
                                }}
                              />
                              <span>{color.name}</span>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">Đang tải màu...</div>
                          );
                        })()}



                        <div>Số lượng: {item.quantity}</div>
                      </div>
                      <div className="ml-auto">
                        <Text>
                          {(item.variant_id.price * item.quantity).toLocaleString()} $
                        </Text>
                      </div>
                    </div>
                  ))}

                  <Divider />

                  <div className="flex justify-between">
                    <Text>Tổng tiền:</Text>
                    <Text>{total.toLocaleString()} $</Text>
                  </div>

                  {formData.voucher_code && (
                    <div className="flex justify-between">
                      <Text>Mã giảm giá:</Text>
                      <Text className="text-red-600">
                        {formData.voucher_type === 'percentage'
                          ? `- ${formData.voucher_value}%`
                          : `- ${formData.voucher_value?.toLocaleString()} $`}
                      </Text>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Text>Phí vận chuyển:</Text>
                    <Text>{shippingFee.toLocaleString()} $</Text>
                  </div>

                  <div className="flex justify-between mt-2">
                    <Text strong className="text-lg">Tổng cộng:</Text>
                    <Text strong className="text-lg text-black">
                      {finalTotal.toLocaleString()} $
                    </Text>
                  </div>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Checkout;