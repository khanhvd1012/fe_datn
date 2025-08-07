import {
  Table,
  Tag,
  Select,
  message,
  Popconfirm,
  Button,
  Skeleton,
  Empty,
  Modal,

} from "antd";
import React, { useState } from "react";
import { useAdminOrders, useCancelOrder, useUpdateOrderStatus } from "../../../hooks/useOrder";
import { useUsers } from "../../../hooks/useUser";
import { DeleteOutlined, EditOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import type { IOrder } from "../../../interface/order";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from 'dayjs';
import DrawerOrder from "../../../components/LayoutAdmin/drawer/DrawerOrder";
const Orders = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: orders, isLoading } = useAdminOrders();
  console.log("Orders data:", orders);

  const { mutate: cancelOrder } = useCancelOrder();
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { data: users } = useUsers();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState('');

  const handleUpdateStatus = (id: string, newStatus: IOrder["status"]) => {
    updateStatus(
      { id, status: newStatus },
      {
        onSuccess: () => {
          messageApi.success("Cập nhật trạng thái thành công");
          queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
        },
        onError: () => {
          messageApi.error("Cập nhật trạng thái thất bại");
        },
      }
    );
  };

  const showOrderDetails = (order: IOrder) => {
    console.log('Chi tiết đơn hàng:');
    setDrawerVisible(true);
    setSelectedOrder(order); // chỉ cần ID nếu muốn
  };

  const showCancelReason = (reason: string) => {
    setSelectedCancelReason(reason);
    setCancelModalVisible(true);
  };

  const handleCancel = (id: string) => {
    cancelOrder(
      { id, cancel_reason: "Người quản trị hủy đơn" },
      {
        onSuccess: () => {
          messageApi.success("Hủy đơn hàng thành công");
          queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
        },
        onError: () => {
          messageApi.error("Hủy đơn hàng thất bại");
        },
      }
    );
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => <Tag color="blue">#{id.slice(-6).toUpperCase()}</Tag>,
    },
    {
      title: "Người đặt",
      dataIndex: "user_id",
      key: "user_id",
      render: (userId: string) => {
        const user = users?.find((u) => u._id === userId);
        return user?.username || "Không rõ";
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("HH:mm DD/MM/YYYY"),
    },

    {
      title: "Tổng gốc",
      dataIndex: "sub_total",
      key: "sub_total",
      render: (value: number) =>
        value.toLocaleString("en-US", { style: "currency", currency: "USD" }),
    },
    {
      title: "Giảm giá",
      dataIndex: "voucher_discount",
      key: "voucher_discount",
      render: (value: number) =>
        value
          ? `- ${value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}`
          : "-",
    },
    {
      title: "Thanh toán",
      dataIndex: "total_price",
      key: "total_price",
      render: (value: number) =>
        value.toLocaleString("en-US", { style: "currency", currency: "USD" }),
    },
    {
      title: "Phương thức",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: IOrder["status"]) => {
        const colorMap = {
          pending: "orange",      // Đang chờ xác nhận
          processing: "blue",     // Đang xử lý
          shipped: "purple",      // Đã gửi hàng
          delivered: "green",     // Đã giao hàng
          canceled: "red",        // Đã huỷ
          returned: "magenta",    // Đã trả hàng
        };

        const labelMap = {
          pending: "Chờ xử lý",
          processing: "Đang xử lý",
          shipped: "Đang giao",
          delivered: "Đã giao",
          canceled: "Đã hủy",
          returned: "Đã trả hàng",
        };

        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
    {
      title: "Cập nhật trạng thái",
      key: "updateStatus",
      render: (_: any, order: IOrder) => {
        const statusOrder = {
          pending: 0,
          processing: 1,
          shipped: 2,
          delivered: 3,
          canceled: 4,
          returned: 5,
        };


        const labelMap: Partial<Record<IOrder["status"], string>> = {
          pending: "Chờ xử lý",
          processing: "Đang xử lý",
          shipped: "Đang giao",
          delivered: "Đã giao",
          // canceled: "Đã hủy",
          returned: "Đã trả hàng",
        };


        const valueMap: Record<string, IOrder["status"]> = {
          "Chờ xử lý": "pending",
          "Đang xử lý": "processing",
          "Đang giao": "shipped",
          "Đã giao": "delivered",
          // "Đã hủy": "canceled",
          "Đã trả hàng": "returned",
        };


        const currentStatusIndex = statusOrder[order.status];

        return (
          <Select
            defaultValue={labelMap[order.status]}
            style={{ width: 140 }}
            onChange={(label) => {
              const statusEng = valueMap[label];
              handleUpdateStatus(order._id!, statusEng);
            }}
            disabled={order.status === "delivered" || order.status === "canceled" || order.status === "returned" }
          >
            {Object.entries(labelMap)
              .filter(([key]) => statusOrder[key as IOrder["status"]] > currentStatusIndex)
              .map(([key, label]) => (
                <Select.Option key={label} value={label}>
                  {label}
                </Select.Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: IOrder) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Nút xem chi tiết */}
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showOrderDetails(record)}
          />
          {/* Nút hủy đơn hàng, chỉ hiển thị nếu đơn hàng chưa bị hủy hoặc giao xong */}
          {record.status !== "canceled" &&
            record.status !== "shipped" &&
            record.status !== "delivered" &&
             record.status !== "returned" && (
              <Popconfirm
                title="Bạn chắc chắn muốn hủy đơn hàng này?"
                onConfirm={() => handleCancel(record._id!)}
                okText="Hủy"
                cancelText="Không"
              >
                <Button type="primary" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
        </div>
      ),
    },
    {
      title: "Lý do hủy",
      key: "cancelReason",
      render: (_: any, record: IOrder) =>
        record.status === "canceled" && record.cancel_reason ? (
          <Button type="link" onClick={() => showCancelReason(record.cancel_reason!)}>
            Xem lý do hủy
          </Button>
        ) : null,
    }

  ];

  if (isLoading) return <Skeleton active />;
  if (!orders?.length) return <Empty description="Không có đơn hàng nào" />;

  return (
    <div>
      {contextHolder}
      <Table
        rowKey="_id"
        columns={columns}
        // dataSource={orders}
        dataSource={[...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
        pagination={{ pageSize: 10 }}
      />
      <DrawerOrder
        visible={drawerVisible}
        order={selectedOrder}
        onClose={() => setDrawerVisible(false)}
      />
      <Modal
        title="Lý do hủy đơn hàng"
        open={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        onOk={() => setCancelModalVisible(false)}
        okText="Đóng"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div style={{ lineHeight: 1.6 }}>
          <strong>Nội dung:</strong>
          <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
            {selectedCancelReason}
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Orders;
