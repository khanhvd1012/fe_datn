import { useEffect, useState, useRef } from 'react';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import axios from 'axios';
import { Input, Select, Button, Card, Image, Row, Col, Typography, Divider, Spin, message } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

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
  // const [formData, setFormData] = useState({
  //   full_name: '',
  //   phone: '',
  //   shipping_address: '',
  //   email: '',
  //   note: '',
  //   shipping_type: 'standard',
  //   payment_method: 'cod',

  //   voucher_type: '',
  //   voucher_value: 0,
  //   voucher_code: null,


  //   province_id: null,
  //   district_id: null,
  //   ward_code: null,
  // });

  const initialFormData = {
    full_name: '',
    phone: '',
    shipping_address: '',
    email: '',
    note: '',
    shipping_type: 'standard',
    payment_method: 'COD',

    voucher_type: '',
    voucher_value: 0,
    voucher_code: null,

    province_id: null,
    district_id: null,
    ward_code: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  interface IShippingAddress {
    _id: string;
    full_name: string;
    phone: string;
    address: string;
    province_id: number;
    province_name: string;
    district_id: number;
    district_name: string;
    ward_code: string;
    ward_name: string;
    is_default: boolean;
    createdAt: string;
    updatedAt: string;
  }
  interface IProvince {
    ProvinceID: number;
    ProvinceName: string;
  }

  interface IDistrict {
    DistrictID: number;
    DistrictName: string;
  }

  interface IWard {
    WardCode: string;
    WardName: string;
  }

  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);

  const location = useLocation();
  const { variant_id, quantity, size } = location.state || {};
  const [buyNowItem, setBuyNowItem] = useState<any>(null);
  console.log(variant_id, quantity, size);

  useEffect(() => {
    if (variant_id) {
      // gọi API để lấy dữ liệu chi tiết variant
      axios.get(`http://localhost:3000/api/variants/${variant_id}`)
        .then(res => {
          const item = {
            variant_id: res.data.data._id,
            variant: res.data,
            quantity,
            size
          };
          console.log("Buy Now Item (trực tiếp):", item); // log ở đây
          setBuyNowItem(item);
        })
        .catch(err => console.error(err));
    }
  }, [variant_id, quantity, size]);

  const [shippingFee, setShippingFee] = useState(0); // phí vận chuyển
  const [shippingLoading, setShippingLoading] = useState(false);

  // Gọi API tính phí vận chuyển
  const fetchShippingFee = async () => {
    console.log("Form Data:", formData);

    if (!formData.province_id || !formData.district_id || !formData.ward_code) return;

    try {
      setShippingLoading(true);

      const body: any = {
        toDistrictId: formData.district_id,
        toWardCode: formData.ward_code,
      };

      if (buyNowItem) {
        body.variant_id = buyNowItem.variant_id;
        body.quantity = buyNowItem.quantity;
      } else {
        body.cart_id = cartData.cart_items[0].cart_id;
      }

      const res = await axios.post("http://localhost:3000/api/shipping/fee", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShippingFee(res.data.fee.service_fee);

    } catch (err) {
      console.error("Lỗi tính phí vận chuyển:", err);
      setShippingFee(0);
    } finally {
      setShippingLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingFee();
  }, [formData.province_id, formData.district_id, formData.ward_code, formData.shipping_type]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.user;
        setUserAddresses(user?.shipping_addresses || []);

      } catch (error) {
        console.error('Không lấy được thông tin người dùng:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Bảng hiển thị địa chỉ
  const addressColumns: ColumnsType<IShippingAddress> = [
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
      // width: 150,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      // width: 120,
    },
    {
      title: "Địa chỉ",
      key: "address",
      width: 250,
      render: (_, record) => (
        <span style={{ display: 'block', whiteSpace: 'normal' }}>
          {record.address}, {record.ward_name}, {record.district_name}, {record.province_name}
        </span>
      ),
    }
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection = {
    type: "radio" as const,
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
      const selected = selectedRows[0];
      setSelectedRowKeys(newSelectedRowKeys);
      setSelectedAddressId(selected._id);
      setFormData((prev) => ({
        ...prev,
        shipping_address: selected._id, // lưu ID
        full_name: selected.full_name,
        phone: selected.phone,
        province_id: selected.province_id,
        district_id: selected.district_id,
        ward_code: selected.ward_code,
      }));
    },

  };

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
    const fetchAllColors = async () => {
      const newColorMap: Record<string, { name: string; code: string }> = {};

      try {
        // Trường hợp checkout từ giỏ hàng
        if (cartData?.cart_items) {
          for (const item of cartData.cart_items) {
            const colorId = item.variant_id.color._id;
            if (!newColorMap[colorId]) {
              const res = await axios.get(`http://localhost:3000/api/colors/${colorId}`);
              const color = res.data.color;
              newColorMap[colorId] = { name: color.name, code: color.code };
            }
          }
        }

        // Trường hợp mua ngay
        // buyNowItem.variant
        console.log("Buy Now - colorId:", buyNowItem?.variant);
        if (buyNowItem?.variant.data.color) {
          const colorId = buyNowItem.variant.data.color;
          console.log("Buy Now - colorId:", colorId);
          if (!newColorMap[colorId]) {
            const res = await axios.get(`http://localhost:3000/api/colors/${colorId}`);
            const color = res.data.color;
            newColorMap[colorId] = { name: color.name, code: color.code };
          }
        }

        setItemColors(newColorMap);
      } catch (error) {
        console.error("Không lấy được màu", error);
      }
    };

    fetchAllColors();
  }, [cartData, buyNowItem]);

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

  const cartItems = cartData?.cart_items || [];
  // const total = 0;
  // const shippingFee = 35000;
  let total = 0;
  if (buyNowItem) {
    total = buyNowItem?.variant?.data?.price || 0;
    console.log("💰 Giá sản phẩm:", total);
  } else {
    total = cartData?.total || 0;
  }

  const discountAmount =
    formData.voucher_type === "percentage"
      ? Math.round((total * formData.voucher_value) / 100)
      : formData.voucher_value || 0;

  const finalTotal = total - discountAmount + shippingFee;

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const isNewAddress =
      (userAddresses && userAddresses.length > 0 && showForm) ||
      !(userAddresses && userAddresses.length > 0);

    if (isNewAddress) {
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
      }

      // Province
      if (!formData.province_id) {
        newErrors.province_id = "Vui lòng chọn Tỉnh/Thành phố";
      }

      // District
      if (!formData.district_id) {
        newErrors.district_id = "Vui lòng chọn Quận/Huyện";
      }

      // Ward
      if (!formData.ward_code) {
        newErrors.ward_code = "Vui lòng chọn Phường/Xã";
      }

      // Kiểm tra email (nếu có nhập)
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    } else {
      if (!selectedRowKeys || selectedRowKeys.length === 0) {
        newErrors.addressTable = "Vui lòng chọn địa chỉ giao hàng";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const token = localStorage.getItem("token");
  // Lấy provinces khi load form
  useEffect(() => {
    axios
      .post("http://localhost:3000/api/shipping/provinces", {}, {

        headers: { Authorization: `Bearer ${token}` }, // nếu middleware yêu cầu
      })
      .then((res) => {
        console.log("API provinces trả về:", res.data);
        setProvinces(res.data.data);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API provinces:", err.response?.data || err.message);
      });
  }, [token]);


  // Khi chọn province thì gọi districts
  useEffect(() => {
    if (formData.province_id) {
      axios
        .post(
          "http://localhost:3000/api/shipping/districts",
          { province_id: formData.province_id },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          console.log("API districts trả về:", res.data);
          setDistricts(res.data.data || []); // ✅ lấy đúng mảng
          setWards([]); // reset ward
          handleChange("district_id", null);
          handleChange("ward_code", null);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy districts:", err.response?.data || err.message);
          setDistricts([]);
        });
    }
  }, [formData.province_id, token]);


  // Khi chọn district thì gọi wards
  useEffect(() => {
    if (formData.district_id) {
      axios
        .post(
          "http://localhost:3000/api/shipping/wards",
          { district_id: formData.district_id },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          console.log("API wards trả về:", res.data);
          setWards(res.data.data || []); // ✅ lấy đúng mảng wards
          handleChange("ward_code", null); // reset ward đã chọn
        })
        .catch((err) => {
          console.error("Lỗi khi lấy wards:", err.response?.data || err.message);
          setWards([]);
        });
    }
  }, [formData.district_id, token]);


  const handleSubmit = async () => {

    if (!validate()) return;

    // Trường hợp nhập địa chỉ mới
    const isNewAddress =
      (userAddresses && userAddresses.length > 0 && showForm) ||
      !(userAddresses && userAddresses.length > 0);

    const payload = buyNowItem
      ? {
        size: buyNowItem.size,
        variant_id: buyNowItem.variant.data._id,
        quantity: buyNowItem.quantity,
        ...(isNewAddress
          ? {
            shipping_address: formData.shipping_address,
            province_id: formData.province_id,
            district_id: formData.district_id,
            ward_code: formData.ward_code,
            full_name: formData.full_name,
            phone: formData.phone,
          }
          : {
            shipping_address_id: selectedAddressId,
          }),
        payment_method: formData.payment_method,
        voucher_code: formData.voucher_code || null,
      }
      : {
        cart_id: cartData.cart_items?.[0]?.cart_id,
        ...(isNewAddress
          ? {
            shipping_address: formData.shipping_address,
            province_id: formData.province_id,
            district_id: formData.district_id,
            ward_code: formData.ward_code,
            full_name: formData.full_name,
            phone: formData.phone,
          }
          : {
            shipping_address_id: selectedAddressId,
          }),
        payment_method: formData.payment_method,
        voucher_code: formData.voucher_code || null,
      };

    console.log("Payload gửi đi:", payload);

    try {
      const token = localStorage.getItem("token");
      const url = buyNowItem
        ? "http://localhost:3000/api/orders/buy-now"
        : "http://localhost:3000/api/orders";

      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderId = res.data?.donHang?._id || res.data?.data?._id;

      if (formData.payment_method === "ZALOPAY" && res.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
        return;
      }

      message.success("Đặt hàng thành công!");
      localStorage.setItem("last_order_id", orderId);
      localStorage.removeItem("selected_voucher_id");
      localStorage.removeItem("cart_backup");
      navigate("/checkout/success");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        message.error(err.response.data.message);
      }
      else {
        console.error(err);
        message.error("Đặt hàng thất bại!");
        navigate("/checkout/failed");
      }
    }
  };

  const [showForm, setShowForm] = useState(false);

  const [vouchers, setVouchers] = useState<any[]>([]);
  const [showVouchers, setShowVouchers] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);

  const handleToggleVouchers = () => {
    if (!showVouchers && vouchers.length === 0) {
      axios.get("http://localhost:3000/api/vouchers")
        .then(res => {
          const allVouchers = res.data || [];
          console.log("📌 Active vouchers trước khi set:", allVouchers);
          const now = new Date();
          const orderTotal = buyNowItem
            ? buyNowItem.variant.data.price * buyNowItem.quantity
            : cartData?.total || 0;
          const activeVouchers = allVouchers.filter((voucher: any) =>
            new Date(voucher.startDate) <= now &&
            now <= new Date(voucher.endDate) &&
            voucher.quantity > 0
            && orderTotal >= (voucher.minOrderValue || 0) &&
           (voucher.status === "active")
          );
          setVouchers(activeVouchers);
          setShowVouchers(true);
        })
        .catch(() => {
          message.error("Không thể tải danh sách voucher");
        });
    } else {
      setShowVouchers(!showVouchers);
    }
  };

  const handleApplyVoucher = (voucher: any) => {

    if (selectedVoucherId === voucher._id) {
      setSelectedVoucherId(null);
      setFormData((prev) => ({
        ...prev,
        voucher_code: null, // bỏ chọn thì clear code
        voucher_type: '',
        voucher_value: 0,
      }));
      message.info(`Đã bỏ chọn mã: ${voucher.code}`);
    } else {
      setSelectedVoucherId(voucher._id);
      setFormData((prev) => ({
        ...prev,
        voucher_code: voucher.code, // ✅ lưu voucher_code
        voucher_type: voucher.type,
        voucher_value: voucher.value,
      }));
      message.success(`Đã chọn mã: ${voucher.code}`);
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
            <Card title="Thông tin người nhận" bordered={false}
              extra={

                userAddresses && userAddresses.length > 0 ? (
                  showForm ? (
                    <Button onClick={() => {
                      setFormData(initialFormData); // reset lại toàn bộ form
                      setSelectedRowKeys([]);
                      setShowForm(false);            // mở form
                    }}>
                      Quay lại
                    </Button>
                  ) : (
                    <Button type="primary" onClick={() => {
                      setFormData(initialFormData); // reset lại toàn bộ form
                      setSelectedRowKeys([]);
                      setShowForm(true);            // mở form
                    }}>
                      Thêm thông tin người nhận
                    </Button>
                  )
                ) : null
              }
            >
              {userAddresses && userAddresses.length > 0 && !showForm ? (
                <>
                  {/* ✅ Bảng chọn địa chỉ */}
                  <Table
                    className="mb-[10px]"
                    rowKey="_id"
                    columns={addressColumns}
                    dataSource={userAddresses}
                    rowSelection={rowSelection}
                    pagination={false}
                    scroll={{ y: 200 }}
                  />
                  {errors.addressTable && (
                    <Text type="danger" style={{ display: "block", marginTop: 4 }}>
                      {errors.addressTable}
                    </Text>
                  )}
                </>
              ) : (
                <div>
                  {/* Họ tên */}
                  <div className="mb-[10px]">
                    <Input
                      placeholder="Họ tên *"
                      onChange={(e) => handleChange("full_name", e.target.value)}
                    />
                    {errors.full_name && <Text type="danger">{errors.full_name}</Text>}
                  </div>

                  {/* Số điện thoại */}
                  <div className="mb-[10px]">
                    <Input
                      placeholder="Số điện thoại *"
                      // value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) { // chỉ cho nhập số
                          handleChange("phone", value);
                        }
                      }}
                    />
                    {errors.phone && <Text type="danger">{errors.phone}</Text>}
                  </div>

                  {/* Province */}
                  <div className="mb-[10px]">
                    <Row gutter={16}>
                      <Col span={8}>
                        <Select
                          showSearch
                          placeholder="Chọn Tỉnh/Thành phố *"
                          value={formData.province_id}
                          onChange={(value) => {
                            handleChange("province_id", value);
                          }}
                          options={provinces.map((p: any) => ({
                            label: p.ProvinceName,
                            value: p.ProvinceID,
                          }))}
                          optionFilterProp="label"
                          filterOption={(input, option) =>
                            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                          }
                          className="w-full"
                        />
                        {errors.province_id && <Text type="danger">{errors.province_id}</Text>}
                      </Col>

                      <Col span={8}>
                        <Select
                          showSearch
                          placeholder="Chọn Quận/Huyện *"
                          value={formData.district_id}
                          onChange={(value) => {
                            handleChange("district_id", value);
                          }}
                          options={districts.map((d) => ({
                            label: d.DistrictName,
                            value: d.DistrictID,
                          }))}
                          optionFilterProp="label"
                          filterOption={(input, option) =>
                            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                          }
                          className="w-full"
                        />
                        {errors.district_id && <Text type="danger">{errors.district_id}</Text>}
                      </Col>

                      <Col span={8}>
                        <Select
                          showSearch
                          placeholder="Chọn Phường/Xã *"
                          value={formData.ward_code}
                          onChange={(value) => {
                            handleChange("ward_code", value);

                          }}
                          options={wards.map((w) => ({
                            label: w.WardName,
                            value: w.WardCode,
                          }))}
                          optionFilterProp="label"
                          filterOption={(input, option) =>
                            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                          }
                          className="w-full"
                        />
                        {errors.ward_code && <Text type="danger">{errors.ward_code}</Text>}
                      </Col>
                    </Row>
                  </div>

                  {/* Địa chỉ chi tiết */}
                  <div className="mb-[10px]">
                    <Input
                      placeholder="Nhập số nhà, đường, ngõ hoặc thôn *"
                      onChange={(e) => handleChange("shipping_address", e.target.value)}
                    />
                    {errors.shipping_address && (
                      <Text type="danger">{errors.shipping_address}</Text>
                    )}
                  </div>

                  <div className="mb-[10px]">
                    <Input
                      placeholder="Email (tuỳ chọn)"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                    {errors.email && <Text type="danger">{errors.email}</Text>}
                  </div>

                  {/* Note (optional) */}
                  <div className="mb-[10px]">
                    <TextArea
                      rows={3}
                      placeholder="Ghi chú (tuỳ chọn)"
                      value={formData.note}
                      onChange={(e) => handleChange("note", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <Text strong className="block mb-2">Phương thức thanh toán</Text>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Thanh toán khi nhận hàng', value: 'COD', icon: '💰' },
                    {
                      label: "Thanh toán qua ZaloPay",
                      value: "ZALOPAY",
                      icon: (
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwPynD27LbXlPsbofv1AX-5ZXDn_XMGo-1TA&s"
                          alt="ZaloPay"
                          style={{ width: 40, height: 40 }}
                        />
                      ),
                    },
                  ].map((method) => (
                    <div
                      key={method.value}
                      onClick={() => handleChange("payment_method", method.value)}
                      className={`cursor-pointer border rounded-xl p-3 text-center transition-all ${formData.payment_method === method.value
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 hover:border-green-400"
                        }`}
                    >
                      {/* Icon nằm trên */}
                      <div className="mb-2 flex justify-center">{method.icon}</div>

                      {/* Chữ nằm dưới */}
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
                {buyNowItem ? "Mua ngay" : "Đặt hàng ngay"}
              </Button>

            </Card>
          </Col>

          {/* BÊN PHẢI: Chi tiết giỏ hàng */}

          <Col xs={24} md={10}>
            <Card title={variant_id ? "Sản phẩm Mua Ngay" : "Sản phẩm trong giỏ hàng"} bordered={false}>
              {loading ? (
                <Spin />
              ) : (
                <>
                  {variant_id && buyNowItem ? (

                    // ================= MUA NGAY =================
                    <div>
                      <div className="flex gap-4 mb-3">
                        <Image
                          width={80}
                          src={buyNowItem.variant.data.image_url[0]}
                          alt="product"
                          preview={false}
                        />
                        <div>
                          <Text strong>{buyNowItem.variant.data.product_id.name}</Text>
                          <div>Size: {buyNowItem.variant.data.size?.size || buyNowItem.size || "Không rõ"}</div>

                          {(() => {
                            const color = itemColors[buyNowItem.variant.data.color];
                            return color ? (
                              <div className="flex items-center mt-1 gap-2 text-sm">
                                <span>Màu:</span>
                                <span
                                  style={{
                                    width: 16,
                                    height: 16,
                                    display: "inline-block",
                                    backgroundColor: color.code,
                                    border: "1px solid #ccc",
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400">Đang tải màu...</div>
                            );
                          })()}

                          <div>Số lượng: {buyNowItem.quantity}</div>
                        </div>
                        <div className="ml-auto">
                          <Text>
                            {(buyNowItem.variant.data.price * buyNowItem.quantity).toLocaleString()} đ
                          </Text>
                        </div>
                      </div>

                      <Divider />

                      <div className="flex justify-between">
                        <Text>Phí vận chuyển:</Text>
                        <Text>{shippingFee.toLocaleString()} đ</Text>
                      </div>
                      {formData.voucher_code && (
                        <div className="flex justify-between mt-2">
                          <Text>Mã giảm giá:</Text>
                          <Text className="text-red-600">
                            {formData.voucher_type === "percentage"
                              ? `- ${formData.voucher_value}%`
                              : `- ${formData.voucher_value?.toLocaleString()} đ`}
                          </Text>
                        </div>
                      )}

                      <div className="flex justify-between mt-2">
                        <Text strong className="text-lg">Tổng cộng:</Text>
                        <Text strong className="text-lg text-black">
                          {shippingLoading
                            ? "Đang tính phí..."
                            : `${(finalTotal || 0).toLocaleString("vi-VN")} đ`}
                        </Text>

                      </div>
                    </div>


                  ) : (
                    // ================= GIỎ HÀNG =================
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
                            <div>Size: {item.variant_id.size.size || "Không rõ"}</div>
                            {(() => {
                              const color = itemColors[item.variant_id.color._id];
                              return color ? (
                                <div className="flex items-center mt-1 gap-2 text-sm">
                                  <span>Màu:</span>
                                  <span
                                    style={{
                                      width: 16,
                                      height: 16,
                                      display: "inline-block",
                                      backgroundColor: color.code,
                                      border: "1px solid #ccc",
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="text-sm text-gray-400">Đang tải màu...</div>
                              );
                            })()}
                            <div>Số lượng: {item.quantity}</div>
                          </div>
                          <div className="ml-auto">
                            <Text>
                              {(item.variant_id.price * item.quantity).toLocaleString()} đ
                            </Text>
                          </div>
                        </div>
                      ))}

                      <Divider />

                      <div className="flex justify-between">
                        <Text>Tổng tiền:</Text>
                        <Text>{total.toLocaleString()} đ</Text>
                      </div>

                      {formData.voucher_code && (
                        <div className="flex justify-between mt-2">
                          <Text>Mã giảm giá:</Text>
                          <Text className="text-red-600">
                            {formData.voucher_type === "percentage"
                              ? `- ${formData.voucher_value}%`
                              : `- ${formData.voucher_value?.toLocaleString()} đ`}
                          </Text>
                        </div>
                      )}
                      <div className="flex justify-between mt-2">
                        <Text>Phí vận chuyển:</Text>
                        <Text>{shippingFee.toLocaleString()} đ</Text>
                      </div>

                      <div className="flex justify-between mt-2">
                        <Text strong className="text-lg">Tổng cộng:</Text>
                        <Text strong className="text-lg text-black">
                          {shippingLoading ? "Đang tính phí..." : finalTotal.toLocaleString()} đ
                        </Text>
                      </div>
                    </>
                  )}
                </>
              )}
            </Card>

            {/* Voucher */}
            <Card>
              <div>
                <Button
                  type="default"
                  block
                  className="block mb-2 dropdown-btn"
                  style={{
                    border: "1px solid #d9d9d9",   // màu viền xám nhạt
                    borderRadius: "8px",           // bo góc
                  }}
                  onClick={handleToggleVouchers}
                >
                  <span>MÃ GIẢM GIÁ</span>
                  {showVouchers ? <UpOutlined /> : <DownOutlined />}
                </Button>
              </div>
              {showVouchers && (
                <div
                  className="voucher-list"
                  style={{
                    maxHeight: 300,           // Giới hạn chiều cao
                    overflowY: "auto",        // Cuộn dọc
                    border: "2px solid #f0f0f0", // Viền xám nhạt
                    borderRadius: 8,          // Bo góc
                    padding: 8,
                    marginTop: 12,
                    background: "#fff",
                    paddingRight: 8, // tránh che nội dung khi có scrollbar
                  }}
                >
                  {vouchers.length === 0 ? (
                    <p>Không có mã giảm giá nào</p>
                  ) : (
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {vouchers.map((voucher) => {
                        const end = new Date(voucher.endDate);
                        const now = new Date();
                        const diffMs = end.getTime() - now.getTime();
                        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                        const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
                        const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
                        const timeLeft =
                          diffMs <= 0
                            ? "Đã hết hạn"
                            : `${diffDays} ngày ${diffHours} giờ ${diffMinutes} phút`;

                        const isSelected = selectedVoucherId === voucher._id;

                        return (
                          <li
                            key={voucher._id}
                            onClick={() => handleApplyVoucher(voucher)}
                            style={{ marginBottom: 8 }}
                          >
                            <Card
                              size="small"
                              bordered
                              hoverable
                              bodyStyle={{ padding: "12px" }}
                              style={{
                                borderRadius: "10px",
                                boxShadow: isSelected ? "0 0 0 2px #91caff" : undefined,
                                backgroundColor: "#FF3300",
                              }}
                            >
                              <Row justify="space-between" align="middle" wrap={false}>
                                <Col flex="auto" style={{ color: "#FFFFFF" }}>
                                  <strong>{voucher.code}</strong>
                                  <br />
                                  <small>
                                    Đơn tối thiểu:{" "}
                                    <strong>
                                      {voucher.minOrderValue.toLocaleString("vi-VN")}đ
                                    </strong>
                                  </small>
                                  <br />
                                  <small>Còn lại: {timeLeft}</small>
                                </Col>
                                <Col>
                                  <div
                                    style={{
                                      backgroundColor:
                                        voucher.type === "percentage" ? "#f6ffed" : "#fff1f0",
                                      color:
                                        voucher.type === "percentage" ? "#52c41a" : "#cf1322",
                                      border: "1px solid",
                                      borderColor:
                                        voucher.type === "percentage"
                                          ? "#b7eb8f"
                                          : "#ffa39e",
                                      borderRadius: "12px",
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                      padding: "6px 12px",
                                      textAlign: "center",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {voucher.type === "percentage"
                                      ? `-${voucher.value}%`
                                      : `-${voucher.value.toLocaleString("vi-VN")}đ`}
                                  </div>
                                </Col>
                              </Row>
                            </Card>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Checkout;