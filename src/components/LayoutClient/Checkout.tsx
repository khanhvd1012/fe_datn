import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import axios from 'axios';
import {
  Input,
  Select,
  Radio,
  Button,
  Card,
  Image,
  Row,
  Col,
  Typography,
  Divider,
  Spin,
  message
} from 'antd';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { TextArea } = Input;
  const { Title, Text } = Typography;

  const [cartData, setCartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sizeMap, setSizeMap] = useState<Record<string, number>>({});
  const navigate =useNavigate()
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    shipping_address: '',
    email: '',
    note: '',
    shipping_type: 'standard',
    payment_method: 'cod',
    voucher_code: '',
    voucher_type: '',
    voucher_value: 0
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get('http://localhost:3000/api/carts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(" Dữ liệu giỏ hàng:", res.data.data);
        setCartData(res.data.data);
      } catch (error) {
        message.error('Không thể lấy dữ liệu giỏ hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/sizes');
        const sizes = res.data.sizes;
        const map: Record<string, number> = {};
        sizes.forEach((s: any) => {
          map[s._id] = s.size;
        });
        setSizeMap(map);
      } catch (err) {
        console.error('Không lấy được size', err);
      }
    };

    fetchSizes();
  }, []);

  useEffect(() => {
    const tempCart = localStorage.getItem('cart');
    if (tempCart) {
      localStorage.removeItem('cart'); // Xóa giỏ hàng tạm thời để ẩn
    }

  }, []);

  useEffect(() => {
    const voucherId = localStorage.getItem("selected_voucher_id");
    if (voucherId) {
      axios.get(`http://localhost:3000/api/vouchers/${voucherId}`)
        .then(res => {
          const voucher = res.data?.data || res.data;

          if (voucher?.code && voucher?.type && voucher?.value !== undefined) {
            setFormData(prev => ({
              ...prev,
              voucher_code: voucher.code,
              voucher_type: voucher.type,
              voucher_value: voucher.value
            }));
          } else {
            console.warn("Thiếu thông tin voucher");
          }
        })
        .catch(err => {
          console.error("Không tìm thấy mã giảm giá", err);
        });
    }
  }, []);





  const cartItems = cartData?.cart_items || [];
  const total = cartData?.total || 0;
  const shippingFee = 35000;
  const discountAmount = formData.voucher_type === 'percentage'
    ? Math.round((total * formData.voucher_value) / 100)
    : formData.voucher_value || 0;
  // const finalTotal = total + shippingFee;
  const finalTotal = total - discountAmount + shippingFee;
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
  if (!formData.full_name || !formData.phone || !formData.shipping_address) {
    return message.error("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.");
  }

  const payload = {
    cart_id: cartData._id,
    voucher_code: formData.voucher_code,
    shipping_address: formData.shipping_address,
    full_name: formData.full_name,
    phone: formData.phone,
    payment_method: formData.payment_method,
  };

  try {
    const token = localStorage.getItem("token");
    await axios.post('http://localhost:3000/api/orders', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    message.success("Đặt hàng thành công!");
    localStorage.removeItem('selected_voucher_id');
    localStorage.removeItem('cart_backup');

    // 👉 Điều hướng tới trang thành công
    navigate('/checkout/success');

  } catch (err) {
    console.error(err);
    message.error("Đặt hàng thất bại!");
  }
};

  return (
    <>
      <Breadcrumb current="Thanh toán" />
      <div className="max-w-6xl mx-auto p-6">
        <Title level={2} className="text-center">Xác nhận đơn hàng</Title>
        <Text type="secondary" className="block text-center mb-6">
          Mã đơn hàng của bạn: <strong>ORD-M1NQW</strong>
        </Text>

        <Row gutter={[24, 24]}>
          {/* Thông tin người nhận */}
          <Col xs={24} md={14}>
            <Card title="Thông tin người nhận" bordered={false}>
              <Input className="mb-3" placeholder="Nhập tên của bạn" value={formData.full_name} onChange={(e) => handleChange('full_name', e.target.value)} />
              <Input className="mb-3" placeholder="Số điện thoại *" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
              <Input className="mb-3" placeholder="Địa chỉ nhận hàng *" value={formData.shipping_address} onChange={(e) => handleChange('shipping_address', e.target.value)} />
              <Input className="mb-3" placeholder="Nhập gmail của bạn" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
              <TextArea className="mb-3" rows={3} placeholder="Ghi chú (tùy chọn)" value={formData.note} onChange={(e) => handleChange('note', e.target.value)} />
              <Select className="w-full mb-3" value={formData.shipping_type} onChange={(value) => handleChange('shipping_type', value)}>
                <Select.Option value="standard">Giao hàng tiêu chuẩn</Select.Option>
                <Select.Option value="fast">Giao hàng nhanh</Select.Option>
              </Select>

              <div className="mb-3">
                <Text strong>Phương thức thanh toán</Text>
                <Radio.Group value={formData.payment_method} onChange={(e) => handleChange('payment_method', e.target.value)} className="block mt-2 space-y-2">
                  <div><Radio value="cod">Thanh toán khi nhận hàng</Radio></div>
                  <div><Radio value="momo">Thanh toán qua Momo</Radio></div>
                  <div><Radio value="bank">Chuyển khoản ngân hàng</Radio></div>
                </Radio.Group>
              </div>

              <Button type="primary" className="mt-4 w-full h-10 bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
                Đặt hàng ngay
              </Button>
            </Card>
          </Col>

          {/* Sản phẩm trong giỏ hàng */}
          <Col xs={24} md={10}>
            <Card title="Sản phẩm trong giỏ hàng" bordered={false}>
              {loading ? (
                <Spin />
              ) : (
                <>
                  {cartItems.map((item: any) => (
                    <div className="flex gap-4 mb-3" key={item._id}>
                      <Image width={80} src={item.variant_id.image_url[0]} alt="product" preview={false} />
                      <div>
                        <Text strong>{item.variant_id.product_id.name}</Text>
                        <div>Size: {sizeMap[item.variant_id.size[0]] || 'Không rõ'}</div>
                        <div>Số lượng: {item.quantity}</div>
                      </div>
                      <div className="ml-auto">
                        <Text>
                          {(item.variant_id.price * item.quantity).toLocaleString()} ₫
                        </Text>
                      </div>
                    </div>
                  ))}

                  <Divider />

                  <div className="flex justify-between">
                    <Text>Tổng tiền:</Text>
                    <Text>{total.toLocaleString()} ₫</Text>
                  </div>

                  {formData.voucher_code && (
                    <>
                      <div className="flex justify-between">
                        <Text>Mã giảm giá:</Text>
                        <Text className="text-red-600">
                          {formData.voucher_type === 'percentage'
                            ? `- ${formData.voucher_value}%`
                            : `- ${formData.voucher_value?.toLocaleString()} ₫`}
                        </Text>
                      </div>
                    </>
                  )}


                  <div className="flex justify-between">
                    <Text>Phí vận chuyển:</Text>
                    <Text>{shippingFee.toLocaleString()} ₫</Text>
                  </div>
                  <div className="flex justify-between mt-2">
                    <Text strong className="text-lg">Tổng cộng:</Text>
                    <Text strong className="text-lg text-black">
                      {finalTotal.toLocaleString()} ₫
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
