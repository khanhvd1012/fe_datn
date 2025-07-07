import { useQueryClient } from "@tanstack/react-query";
import { Button, Empty, message, Popconfirm, Skeleton, Table, Tag, Select  } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import type { IOrder } from "../../../interface/order";
import { useCancelOrder, useOrders, useUsers,useUpdateOrderStatus } from "../../../hooks/useOrder";
import type { IUser } from '../../../interface/user';

const Orders = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { data, isLoading } = useOrders();
  const { mutate: cancelOrder } = useCancelOrder();
  const { data: users} = useUsers();
  const { mutate: updateStatus } = useUpdateOrderStatus();


  const handleCancelOrder = (id: string) => {
    cancelOrder(
      { id, cancel_reason: "Người quản trị hủy đơn" },
      {
        onSuccess: () => {
          messageApi.success("Hủy đơn hàng thành công");
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: () => messageApi.error("Hủy đơn hàng thất bại"),
      }
    );
  };

  const handleUpdateStatus = (orderId: string, newStatus: IOrder["status"]) => { //
    updateStatus(
      { id: orderId, status: newStatus },
      {
        onSuccess: () => {
          message.success("Cập nhật trạng thái thành công");
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: () => {
          message.error("Cập nhật trạng thái thất bại");
        },
      }
    );
  };



  if (isLoading) return <Skeleton active />;
  if (!data) return <Empty description="Không có đơn hàng nào" />;

  const userMap = new Map((users as IUser[])?.map((u) => [u._id, u.username]));

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => <Tag color="blue">#{id?.slice(-6).toUpperCase()}</Tag>,
    },
    {
      title: "Người đặt",
      dataIndex: "user_id",
      key: "user_id",
      render: (user: any) => {
         const username = userMap.get(user);
         console.log("username field:", username);
         return username || "Không rõ";
      }
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_price",
      key: "total_price",
      render: (price: number) =>
        price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Phương thức",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (method: string) => <Tag>{method}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: IOrder["status"]) => {
        const colorMap: Record<IOrder["status"], string> = {
          pending: "orange",
          processing: "blue",
          shipped: "purple",
          delivered: "green",
          canceled: "red",
        };

        const labelMap: Record<IOrder["status"], string> = {
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
      render: (_: any, order: IOrder) => (
        <div style={{ display: "flex", gap: 8 }}>
          {/* <Link to={`/admin/orders/edit/${order._id}`}>
            <Button icon={<EyeOutlined />} />
          </Link> */}
          {
            order.status !== "canceled" && order.status !== "delivered" && order.status !== "shipped" && (
              <Popconfirm
                title="Hủy đơn hàng"
                description="Bạn có chắc muốn hủy đơn hàng này?"
                onConfirm={() => handleCancelOrder(order._id!)}
                okText="Hủy đơn"
                cancelText="Không"
              >
                <Button danger>Hủy</Button>
              </Popconfirm>
            )
          }

        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        rowKey="_id"
        pagination={{
          total: data.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} đơn hàng`,
        }}
      />
    </div>
  );
};

export default Orders;
