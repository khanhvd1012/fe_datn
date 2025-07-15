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
import Breadcrumb from './Breadcrumb';

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
    if (sizeCache[id]) return sizeCache[id];
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/api/sizes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sizeValue = res.data?.size?.size?.toString() || 'Không rõ';

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

            const itemsWithDetails = await Promise.all(
              (detailRes.data.items || []).map(async (item: any) => {
                const sizeId = item.variant_id?.size;
                const sizeName = sizeId ? await fetchSizeName(sizeId) : 'Không rõ';

                const variantId = item.variant_id._id || item.variant_id;
                const variantRes = await axios.get(`http://localhost:3000/api/variants/${variantId}`);
                const imageUrl = variantRes.data.data.image_url?.[0] || 'Không có ảnh';

                return {
                  ...item,
                  sizeName,
                  imageUrl
                };
              })
            );

            return {
              ...order,
              items: itemsWithDetails,
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

  if (loading) return <Spin style={{ display: 'block', marginTop: 60 }} size="large" />;
  if (!orders.length) return <Text>Bạn chưa có đơn hàng nào</Text>;

  return (
    <>
      <Breadcrumb current="Đơn hàng" />
      <div className="max-w-5xl mx-auto p-6">
        <Title level={2}>Lịch sử đơn hàng</Title>

        {orders.map((order) => (
          <Card
            key={order._id}
            className="mb-6"
            title={
              <div className="flex justify-between items-center">
                <div>
                  <Tag color="blue">#{order._id?.slice(-6).toUpperCase()}</Tag>
                  <span className="ml-2 text-gray-600">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <Tag color={statusColor[order.status] || 'default'}>
                  {order.status === 'pending' && 'Chờ xác nhận'}
                  {order.status === 'confirmed' && 'Đã xác nhận'}
                  {order.status === 'delivering' && 'Đang giao'}
                  {order.status === 'delivered' && 'Đã giao'}
                  {order.status === 'canceled' && 'Đã hủy'}
                </Tag>
              </div>
            }
          >
            <Table
              columns={[

                {
                  title: 'Sản phẩm',
                  render: (_: any, record: any) => (
                    <>{record.product_id?.name || 'Không rõ'}</>
                  ),
                },
                {
                  title: 'Hình ảnh',
                  render: (_: any, record: any) => (
                    <img
                      src={record.imageUrl}
                      alt="product"
                      style={{ width: 60, height: 60, objectFit: 'cover' }}
                    />
                  ),
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                  render: (quantity: number) => <>{quantity}</>
                },

              ]}
              dataSource={order.items}
              rowKey={(record) => record._id}
              pagination={false}
            />

            <div className="flex justify-between items-center mt-4">
              <Text strong>Tổng thanh toán:</Text>
              <Text strong className="text-lg text-green-600">
                {(order.total_price || 0).toLocaleString()}₫
              </Text>
            </div>

            <div className="text-right mt-2">
              <a href={`/OrderDetail/${order._id}`} className="text-blue-500 hover:underline">
                Xem chi tiết
              </a>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default OrderHistory;
