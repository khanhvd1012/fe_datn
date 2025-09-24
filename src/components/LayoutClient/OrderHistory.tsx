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
  Upload,
  Tooltip,
} from 'antd';
import { CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import Breadcrumb from './Breadcrumb';

const { Title, Text } = Typography;

const paymentStatusColor: Record<string, string> = {
  unpaid: "red",
  paid: "green",
  pending: "orange",
  refunded: "blue",
};

const paymentStatusLabels: Record<string, string> = {
  unpaid: "Chưa thanh toán",
  paid: "Đã thanh toán",
  pending: "Đang chờ thanh toán",
  refunded: "Đã hoàn tiền",
};

const statusColor: Record<string, string> = {
  pending: 'orange',
  processing: 'blue',
  shipped: 'purple',
  delivered: 'green',
  return_requested: 'gold',
  return_accepted: 'cyan',
  return_rejected: 'volcano',
  returned_received: 'gray',
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
  returned_received: 'Đã trả hàng',
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

  // Xác nhận đã nhận hàng
  const handleConfirmReceived = (orderId: string) => {
    Modal.confirm({
      title: 'Xác nhận đã nhận hàng',
      content: <p>Bạn có chắc chắn muốn xác nhận đã nhận được đơn hàng này không?</p>,
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
            `http://localhost:3000/api/orders/${orderId}/confirm-received`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          message.success('Xác nhận đã nhận hàng thành công');
          setOrders((prev) =>
            prev.map((o) =>
              o._id === orderId ? { ...o, confirmed_received: true } : o
            )
          );
        } catch (error) {
          console.error('Xác nhận nhận hàng thất bại:', error);
          message.error('Xác nhận nhận hàng thất bại');
          return Promise.reject();
        }
      },
    });
  };

  const handleReturn = (orderId: string) => {
    let returnReason = '';
    let fileList: any[] = [];

    Modal.confirm({
      title: 'Yêu cầu hoàn hàng',
      width: 600,
      content: (
        <div>
          <p>Vui lòng nhập lý do hoàn hàng:</p>
          <Input.TextArea
            placeholder="Nhập lý do..."
            rows={3}
            onChange={(e) => (returnReason = e.target.value)}
            style={{ marginBottom: 12 }}
          />

          <Upload
            multiple
            listType="picture-card"
            accept="image/*"
            beforeUpload={() => false}
            onChange={({ fileList: newList }) => {
              fileList = newList;
            }}
          >
            <Button icon={<UploadOutlined />}>Ảnh chứng minh</Button>
          </Upload>
          <div style={{ marginTop: 12 }}>
            <span style={{ color: "red", fontSize: 13, display: "block" }}>
              Lưu ý: Vui lòng tải lên ảnh hóa đơn, sản phẩm bị lỗi hoặc QR/số tài khoản
              ngân hàng để thuận tiện cho việc hoàn tiền.
            </span>
          </div>
        </div>
      ),
      okText: 'Gửi yêu cầu',
      cancelText: 'Thoát',
      async onOk() {
        if (!returnReason.trim()) {
          message.warning('Vui lòng nhập lý do hoàn hàng');
          return Promise.reject();
        }

        try {
          const token = localStorage.getItem('token');
          if (!token) {
            message.error('Bạn cần đăng nhập để thực hiện thao tác này');
            return Promise.reject();
          }

          const formData = new FormData();
          formData.append('return_reason', returnReason);
          fileList.forEach((file) => {
            formData.append('images', file.originFileObj);
          });

          await axios.put(
            `http://localhost:3000/api/orders/${orderId}/request-return`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          message.success('Đã gửi yêu cầu hoàn hàng');
          setOrders((prev) =>
            prev.map((o) =>
              o._id === orderId ? { ...o, status: 'return_requested' } : o
            )
          );
        } catch (error) {
          console.error('Yêu cầu hoàn hàng thất bại:', error);
          message.error('Yêu cầu hoàn hàng thất bại');
          return Promise.reject();
        }
      },
    });
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
          setOrders((prev) =>
            prev.map((o) =>
              o._id === orderId ? { ...o, status: "canceled" } : o
            )
          );
        } catch (error) {
          console.error("Hủy đơn hàng thất bại:", error);
          message.error("Hủy đơn hàng thất bại");
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

            const itemsWithDetails = await Promise.all(
              (order.items || []).map(async (item: any) => {
                const variantId = item.variant_id?._id;
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
          onChange={() => setCurrentPage(1)}
          type="card"
          tabPosition="left"
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
                      className="mb-6 shadow-sm rounded-lg"
                      title={
                        <div className="flex justify-between items-center">
                          <Text strong>
                            Mã đơn hàng: <Tag color="blue">#{order.order_code}</Tag>
                          </Text>
                          <Text type="secondary" className="text-sm">
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}{" "}
                            {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
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
                        {/* Bên trái: trạng thái */}
                        <div className="flex flex-col gap-1">
                          <div>
                            Trạng thái đơn hàng:{" "}
                            <Tag color={statusColor[order.status] || "default"}>
                              {statusLabels[order.status]}
                            </Tag>
                          </div>
                          <div>
                            Trạng thái thanh toán:{" "}
                            <Tag color={paymentStatusColor[order.payment_status] || "default"}>
                              {paymentStatusLabels[order.payment_status] || "Không rõ"}
                            </Tag>
                          </div>
                        </div>

                        {/* Bên phải: tổng tiền + nút hành động */}
                        <div className="flex items-center gap-4">
                          <div className="text-green-600 font-semibold">
                            Tổng tiền: {(order.total_price || 0).toLocaleString("vi-VN")}đ
                          </div>

                          <div className="flex items-center gap-3">
                            <a
                              href={`/OrderDetail/${order._id}`}
                              className="text-blue-500 hover:underline"
                            >
                              Xem chi tiết
                            </a>

                            {(order.status === "pending" || order.status === "processing") && (
                              <Button danger size="small" onClick={() => handleCancel(order._id)}>
                                Hủy đơn
                              </Button>
                            )}

                            {order.status === "delivered" && (
                              <>
                                {!order.confirmed_received && (
                                  <Tooltip title="Xác nhận đã nhận hàng">
                                    <Button
                                      type="primary"
                                      size="small"
                                      icon={<CheckCircleOutlined />}
                                      onClick={() => handleConfirmReceived(order._id)}
                                    />
                                  </Tooltip>
                                )}
                                {order?.updatedAt && (() => {
                                  const now = new Date();
                                  const updatedAt = new Date(order.updatedAt);

                                  const diffMs = now.getTime() - updatedAt.getTime();
                                  const diffDays = diffMs / (1000 * 60 * 60 * 24); // đổi ra ngày

                                  // Chỉ hiển thị nút nếu <= 3 ngày
                                  return diffDays <= 3 ? (
                                    <div className="flex items-center gap-2">
                                      <Button size="small" onClick={() => handleReturn(order._id)}>
                                        Hoàn đơn
                                      </Button>
                                    </div>
                                  ) : null;
                                })()}

                              </>
                            )}

                          </div>
                        </div>
                      </div>

                    </Card>
                  ))}

                  {/* Pagination */}
                  <div className="flex justify-center mt-4 mb-6">
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
