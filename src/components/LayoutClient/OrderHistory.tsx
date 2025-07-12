import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Typography,
  message,
  Spin,
  Divider
} from 'antd';

const { Title, Text } = Typography;

const statusColor: Record<string, string> = {
  pending: 'gold',
  confirmed: 'blue',
  delivering: 'orange',
  delivered: 'green',
  canceled: 'red',
};

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sizeCache, setSizeCache] = useState<Record<string, string>>({});

const fetchSizeName = async (id: string): Promise<string> => {
  console.log("Đang fetch size với ID:", id);

  if (sizeCache[id]) return sizeCache[id];

  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:3000/api/sizes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Kết quả trả về từ API size:", res.data);

    const sizeValue = res.data?.size?.size?.toString() || 'Không rõ';
    console.log("sizeValue", sizeValue);
    setSizeCache((prev) => ({ ...prev, [id]: sizeValue }));

    return sizeValue;
  } catch (err) {
    console.error('Lỗi khi lấy size:', err);
    return 'Không rõ';
  }
};


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.warning("Bạn chưa đăng nhập");
          return;
        }

        const res = await axios.get("http://localhost:3000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const baseOrders = res.data || [];

        const ordersWithDetails = await Promise.all(
          baseOrders.map(async (order: any) => {
            const detailRes = await axios.get(`http://localhost:3000/api/orders/${order._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const itemsWithSizeName = await Promise.all(
              (detailRes.data.items || []).map(async (item: any) => {
                const sizeId = item.variant_id?.size;
                const sizeName = sizeId ? await fetchSizeName(sizeId) : 'Không rõ';
                // console.log("Đơn hàng:", order._id);
                // console.log("Sản phẩm:", item.product_id?.name || "Không rõ");
                console.log("Size:",  sizeName);
                // console.log("Số lượng:", item.quantity);
                // console.log("Giá:", item.price);
                // console.log("-------------------------");
                return {
                  ...item,
                  sizeName
                };
              })
            );

            return {
              ...order,
              items: itemsWithSizeName,
            };
          })
        );

        setOrders(ordersWithDetails);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
        message.error("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: 'Sản phẩm',
      render: (_: any, record: any) => (
        <>{record.product_id?.name || 'Không rõ'}</>
      )
    },
    {
    title: 'Size',
    render: (_: any, record: any) => (
        <>{record.sizeName || 'Không có'}</>
    )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (quantity: number) => <>{quantity}</>
    },
    {
      title: 'Giá',
      render: (_: any, record: any) => (
        <>{(record.price || 0).toLocaleString()}₫</>
      )
    },
  ];

  if (loading) return <Spin style={{ display: 'block', marginTop: 60 }} size="large" />;
  if (!orders.length) return <Text>Bạn chưa có đơn hàng nào</Text>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Title level={2}>Lịch sử đơn hàng</Title>

      {orders.map((order) => (
        <Card
          key={order._id}
          className="mb-6"
          title={<Tag color="blue">#{order._id?.slice(-6).toUpperCase()}</Tag>}
        >
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Ngày đặt">
              {new Date(order.createdAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusColor[order.status] || 'default'}>
                {order.status === 'pending' && 'Chờ xác nhận'}
                {order.status === 'confirmed' && 'Đã xác nhận'}
                {order.status === 'delivering' && 'Đang giao'}
                {order.status === 'delivered' && 'Đã giao'}
                {order.status === 'canceled' && 'Đã hủy'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Người nhận">
              {order.full_name} - {order.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ giao hàng">
              {order.shipping_address}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Table
            columns={columns}
            dataSource={order.items}
            rowKey={(record) => record._id}
            pagination={false}
          />

          <div className="flex justify-between mt-4">
            <Text strong className="text-lg">Tổng thanh toán:</Text>
            <Text strong className="text-lg">
              {(order.total_price || 0).toLocaleString()}₫
            </Text>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default OrderHistory;
