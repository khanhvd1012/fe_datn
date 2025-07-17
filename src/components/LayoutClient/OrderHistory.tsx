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
  Divider,
  Button,
  Popconfirm, Modal, Input,
} from 'antd';
import Breadcrumb from './Breadcrumb';

const { Title, Text } = Typography;

const statusColor: Record<string, string> = {
  pending: 'orange',
  processing: 'blue',
  shipped: 'purple',
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

  const handleCancel = (orderId: string) => {
    let cancelReason = "";

    Modal.confirm({
      title: "Xác nhận hủy đơn hàng",
      content: (
        <div>
          <p>Vui lòng nhập lý do hủy:</p>
          <Input
            placeholder="Lý do hủy đơn"
            onChange={(e) => (cancelReason = e.target.value)}
          />
        </div>
      ),
      okText: "Xác nhận hủy",
      cancelText: "Thoát",
      onOk: async () => {
        if (!cancelReason.trim()) {
          message.warning("Vui lòng nhập lý do hủy đơn");
          return Promise.reject();
        }

        try {
          const token = localStorage.getItem("token");

          await axios.put(
            `http://localhost:3000/api/orders/${orderId}/cancel`,
            { cancel_reason: cancelReason },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          message.success("Hủy đơn hàng thành công");
          // navigate(0);
          window.location.reload();
          
        } catch (error) {
          console.error("Hủy đơn hàng thất bại:", error);
          message.error("Hủy đơn hàng thất bại");
        }
      },
    });
  };



  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.warning("Bạn chưa đăng nhập");
          return;
        }

        const res = await axios.get("http://localhost:3000/api/orders/user", {
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

                const variantId = item.variant_id?._id;

                const imageUrl = await axios
                  .get(`http://localhost:3000/api/variants/${variantId}`)
                  .then(res => res.data?.data?.image_url?.[0] ?? 'Không có ảnh')
                  .catch(err => {
                    console.error("Không lấy được ảnh cho variant:", variantId, err);
                    return 'Không có ảnh';
                  });

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
                  render: (quantity: number) => <>{quantity}</>,
                },
                {
                  title: 'Trạng thái',
                  render: () => (
                    <Tag color={statusColor[order.status] || 'default'}>
                      {order.status === 'pending' && 'Chờ xác nhận'}
                      {order.status === 'processing' && 'Đã xác nhận'}
                      {order.status === 'shipped' && 'Đang giao'}
                      {order.status === 'delivered' && 'Đã giao'}
                      {order.status === 'canceled' && 'Đã hủy'}
                    </Tag>
                  ),
                },
                {
                  title: 'Tổng tiền',
                  render: () => (
                    <span className="text-green-600 font-semibold">
                      {(order.total_price || 0).toLocaleString()}$
                    </span>
                  ),
                },
                {
                  title: 'Hành động',
                  render: () => (
                    <div className="space-x-2">
                      <a
                        href={`/OrderDetail/${order._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Xem chi tiết
                      </a>
                      {order.status !== 'canceled' && (
                        <Button danger size="small" onClick={() => handleCancel(order._id)}>
                          Hủy
                        </Button>
                      )}

                    </div>
                  ),
                },
              ]}
              dataSource={order.items}
              rowKey={(record) => record._id}
              pagination={false}
            />
          </Card>
        ))}
      </div>
    </>
  );
};

export default OrderHistory;
