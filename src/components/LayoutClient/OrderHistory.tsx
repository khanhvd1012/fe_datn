import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
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
  Pagination,
} from 'antd';
import Breadcrumb from './Breadcrumb';
const { Title, Text } = Typography;

const statusColor: Record<string, string> = {
  pending: 'orange',
  processing: 'blue',
  shipped: 'purple',
  delivered: 'green',
  return_requested: 'gold',
  return_accepted: 'cyan',
  return_rejected: 'volcano',
  returned: 'gray',
  canceled: 'red',
};

const statusLabels: Record<string, string> = {
  pending: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  return_requested: 'Yêu cầu hoàn hàng',
  return_accepted: 'Yêu cầu hoàn được chấp nhận',
  return_rejected: 'Yêu cầu hoàn bị từ chối',
  returned: 'Đã trả hàng',
  canceled: 'Đã hủy',
};


const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const paginateOrders = (status: string) => {
    const filtered = orders
      .filter((order) => order.status === status)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      data: filtered.slice(startIndex, endIndex),
      total: filtered.length,
    };
  };

  // hoàn đơn hàng
  const handleReturn = (orderId: string) => {
    Modal.confirm({
      title: 'Xác nhận yêu cầu hoàn đơn',
      content: (
        <p>Bạn có chắc chắn muốn gửi yêu cầu hoàn (trả) đơn hàng này không?</p>
      ),
      okText: 'Xác nhận',
      cancelText: 'Thoát',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            message.error('Bạn cần đăng nhập để thực hiện thao tác này');
            return Promise.reject();
          }

          await axios.put(
            `http://localhost:3000/api/orders/${orderId}`,
            { status: "return_requested" }, // chuyển trạng thái sang return_requested
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          message.success('Đã gửi yêu cầu hoàn đơn hàng');
          // ✅ Không nên reload cứng, chỉ cần cập nhật state
          setOrders((prev) =>
            prev.map((o) =>
              o._id === orderId ? { ...o, status: "return_requested" } : o
            )
          );
        } catch (error) {
          console.error('Yêu cầu hoàn đơn hàng thất bại:', error);
          message.error('Yêu cầu hoàn đơn hàng thất bại');
          return Promise.reject();
        }
      },
    });
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
        console.log("Orders từ API:", baseOrders);
        const ordersWithDetails = await Promise.all(
          baseOrders.map(async (order: any) => {

            const itemsWithDetails = await Promise.all(
              (order.items || []).map(async (item: any) => {
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
        <Tabs
          defaultActiveKey="pending"
          type="card"
          items={Object.keys(statusLabels).map((status) => ({
            key: status,
            label: statusLabels[status],
            children: (() => {
              const { data, total } = paginateOrders(status);

              return data.length === 0 ? (
                <Text>Không có đơn hàng nào ở trạng thái này</Text>
              ) : (
                <>
                  {data.map((order) => (
                    <Card
                      key={order.order_code}
                      className="mb-6"
                      title={
                        <div className="flex justify-between items-center">
                          <div>
                            <Tag color="blue">
                              #{order.order_code}
                            </Tag>
                            <span className="ml-2 text-gray-600">
                              {new Date(order.createdAt).toLocaleString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      }
                    >
                      <Table
                        columns={[
                          {
                            title: "Sản phẩm",
                            render: (_: any, record: any) => (
                              <>{record.variant_id.product_id?.name || "Không rõ"}</>
                            ),
                          },
                          {
                            title: "Hình ảnh",
                            render: (_: any, record: any) => (
                              <img
                                src={record.imageUrl}
                                alt="product"
                                style={{
                                  width: 60,
                                  height: 60,
                                  objectFit: "cover",
                                }}
                              />
                            ),
                          },
                          {
                            title: "Số lượng",
                            dataIndex: "quantity",
                          },
                          {
                            title: "Size",
                            dataIndex: "sizeName",
                          },
                          {
                            title: "Màu sắc",
                            render: (_: any, record: any) => (
                              <>{record.variant_id.color?.name || "Không rõ"}</>
                            ),
                          },
                        ]}
                        dataSource={order.items}
                        rowKey={(record) => record._id}
                        pagination={false}
                      />

                      <Divider />

                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <Tag color={statusColor[order.status] || "default"}>
                            {statusLabels[order.status]}
                          </Tag>
                        </div>

                        <div className="text-green-600 font-semibold">
                          Tổng tiền: {(order.total_price || 0).toLocaleString("vi-VN")}đ
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 mt-4">
                        <a
                          href={`/OrderDetail/${order._id}`}
                          className="text-blue-500 hover:underline"
                        >
                          Xem chi tiết
                        </a>
                        {(order.status === "pending" || order.status === "processing") && (
                          <Button
                            danger
                            size="small"
                            onClick={() => handleCancel(order._id)}
                          >
                            Hủy đơn
                          </Button>
                        )}

                        {/* {order.status === "delivered" && (
                          <Button
                            size="small"
                            onClick={() => handleReturn(order._id)}
                          >
                            Hoàn đơn
                          </Button>
                        )} */}
                        {order.status === "delivered" && (
                          <Button
                            size="small"
                            onClick={() => handleReturn(order._id)}
                          >
                            Hoàn đơn
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}

                  {/* Pagination */}
                  <div className="flex justify-center mt-4">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={total}
                      onChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                </>
              );
            })(),
          }))}
        />
      </div>
    </>
  );
};

export default OrderHistory;
