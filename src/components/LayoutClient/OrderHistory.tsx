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
  Modal,
  Input,
  Tabs,
} from 'antd';
import Breadcrumb from './Breadcrumb';
import { getVariantById } from '../../service/variantAPI';
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const statusColor: Record<string, string> = {
  pending: 'orange',
  processing: 'blue',
  shipped: 'purple',
  delivered: 'green',
  canceled: 'red',
};

const statusLabels: Record<string, string> = {
  pending: 'Chờ xác nhận',
  processing: 'Đã xác nhận',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  canceled: 'Đã hủy',
};

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sizeCache, setSizeCache] = useState<Record<string, string>>({});

  const fetchSizeName = async (id: string): Promise<string> => {
    if (sizeCache[id]) return sizeCache[id];
    try {
      const token = localStorage.getItem('token');
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
    let cancelReason = '';

    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: (
        <div>
          <p>Vui lòng nhập lý do hủy:</p>
          <Input
            placeholder="Lý do hủy đơn"
            onChange={(e) => (cancelReason = e.target.value)}
          />
        </div>
      ),
      okText: 'Xác nhận hủy',
      cancelText: 'Thoát',
      onOk: async () => {
        if (!cancelReason.trim()) {
          message.warning('Vui lòng nhập lý do hủy đơn');
          return Promise.reject();
        }

        try {
          const token = localStorage.getItem('token');
          await axios.put(
            `http://localhost:3000/api/orders/${orderId}/cancel`,
            { cancel_reason: cancelReason },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          message.success('Hủy đơn hàng thành công');
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } catch (error) {
          console.error('Hủy đơn hàng thất bại:', error);
          message.error('Hủy đơn hàng thất bại');
          return Promise.reject();
        }
      },
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          message.warning('Bạn chưa đăng nhập');
          return;
        }

        const res = await axios.get('http://localhost:3000/api/orders/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const baseOrders = res.data || [];

        const ordersWithDetails = await Promise.all(
          baseOrders.map(async (order: any) => {
            const detailRes = await axios.get(
              `http://localhost:3000/api/orders/${order._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            console.log("Chi tiết đơn hàng:", detailRes.data);

            const itemsWithDetails = await Promise.all(
              (detailRes.data.items || []).map(async (item: any) => {

                const variantId = item.variant_id?._id;
                console.log('variantId:', variantId);
                const variantData = await axios
                  .get(`http://localhost:3000/api/variants/${variantId}`)
                  .then((res) => res.data?.data)
                  .catch((err) => {
                    console.error('Không lấy được variant:', variantId, err);
                    return null;
                  });

                const imageUrl = variantData?.image_url?.[0] ?? 'Không có ảnh';
                const sizeName = variantData?.size?.size ?? 'Không có size';
                return {
                  ...item,
                  sizeName,
                  imageUrl,
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
        console.error('Lỗi khi lấy đơn hàng:', err);
        message.error('Không thể tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const groupOrdersByStatus = (status: string) =>
    orders.filter((order) => order.status === status);

  if (loading)
    return <Spin style={{ display: 'block', marginTop: 60 }} size="large" />;
  if (!orders.length) return <Text>Bạn chưa có đơn hàng nào</Text>;

  return (
    <>
      <Breadcrumb current="Đơn hàng" />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <Title level={2} style={{ margin: 0 }}>Lịch sử đơn hàng</Title>

          <Button
            type="primary"
            onClick={() => (window.location.href = '/ProductReview')}
          >
            Đánh giá sản phẩm
          </Button>
        </div>
        <Tabs defaultActiveKey="pending" type="card">
          {Object.keys(statusLabels).map((status) => (
            <TabPane tab={statusLabels[status]} key={status}>
              {groupOrdersByStatus(status).length === 0 ? (
                <Text>Không có đơn hàng nào ở trạng thái này</Text>
              ) : (
                groupOrdersByStatus(status).map((order) => (
                  <Card
                    key={order._id}
                    className="mb-6"
                    title={
                      <div className="flex justify-between items-center">
                        <div>
                          <Tag color="blue">
                            #{order._id?.slice(-6).toUpperCase()}
                          </Tag>
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
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                              }}
                            />
                          ),
                        },
                        {
                          title: 'Số lượng',
                          dataIndex: 'quantity',
                        },
                        {
                          title: 'Size',
                          dataIndex: 'sizeName',
                        },
                      ]}
                      dataSource={order.items}
                      rowKey={(record) => record._id}
                      pagination={false}
                    />

                    <Divider />

                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <Tag color={statusColor[order.status] || 'default'}>
                          {statusLabels[order.status]}
                        </Tag>
                      </div>

                      <div className="text-green-600 font-semibold">
                        Tổng tiền:{' '}
                        {(order.total_price || 0).toLocaleString('vi-VN')}đ
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                      <a
                        href={`/OrderDetail/${order._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Xem chi tiết
                      </a>
                      {order.status === 'pending' && (
                        <Button
                          danger
                          size="small"
                          onClick={() => handleCancel(order._id)}
                        >
                          Hủy đơn
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default OrderHistory;
