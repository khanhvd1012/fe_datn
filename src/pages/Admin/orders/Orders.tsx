import {
  Table,
  Tag,
  Select,
  message,
  Popconfirm,
  Button,
  Skeleton,
  Empty,

} from "antd";
import { useAdminOrders, useCancelOrder, useUpdateOrderStatus } from "../../../hooks/useOrder";
import { useUsers } from "../../../hooks/useUser";

import type { IOrder } from "../../../interface/order";
import { useQueryClient } from "@tanstack/react-query";

const Orders = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: orders, isLoading } = useAdminOrders();
  console.log("Orders data:", orders);
  
  const { mutate: cancelOrder } = useCancelOrder();
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { data: users } = useUsers();

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
      title: "Tổng gốc",
      dataIndex: "sub_total",
      key: "sub_total",
      render: (value: number) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Giảm giá",
      dataIndex: "voucher_discount",
      key: "voucher_discount",
      render: (value: number) =>
        value
          ? `- ${value.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}`
          : "-",
    },
    {
      title: "Thanh toán",
      dataIndex: "total_price",
      key: "total_price",
      render: (value: number) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
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
          pending: "orange",
          processing: "blue",
          shipped: "purple",
          delivered: "green",
          canceled: "red",
        };
        const labelMap = {
          pending: "Chờ xử lý",
          processing: "Đang xử lý",
          shipped: "Đang giao",
          delivered: "Đã giao",
          canceled: "Đã hủy",
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
        };

        const labelMap: Record<IOrder["status"], string> = {
          pending: "Chờ xử lý",
          processing: "Đang xử lý",
          shipped: "Đang giao",
          delivered: "Đã giao",
        };

        const valueMap: Record<string, IOrder["status"]> = {
          "Chờ xử lý": "pending",
          "Đang xử lý": "processing",
          "Đang giao": "shipped",
          "Đã giao": "delivered",
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
            disabled={order.status === "delivered" || order.status === "canceled"}
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
      render: (_: any, record: IOrder) =>
        record.status !== "canceled" &&
        record.status !== "shipped" &&
        record.status !== "delivered" && (
          <Popconfirm
            title="Bạn chắc chắn muốn hủy đơn hàng này?"
            onConfirm={() => handleCancel(record._id!)}
            okText="Hủy"
            cancelText="Không"
          >
            <Button danger>Hủy</Button>
          </Popconfirm>
        ),
    },
  ];

  if (isLoading) return <Skeleton active />;
  if (!orders?.length) return <Empty description="Không có đơn hàng nào" />;

  return (
    <div>
      {contextHolder}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={orders}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Orders;
