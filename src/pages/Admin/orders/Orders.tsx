import { useQueryClient } from "@tanstack/react-query";
import { Button, Empty, message, Popconfirm, Skeleton, Table, Tag, Select, Input, InputNumber } from "antd";
import type { IOrder } from "../../../interface/order";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useCancelOrder, useOrders, useUsers, useUpdateOrderStatus } from "../../../hooks/useOrder";
import type { IUser } from "../../../interface/user";
import { useState } from "react";

const Orders = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: order, isLoading } = useOrders();
  const { mutate: cancelOrder } = useCancelOrder();
  const { data: users } = useUsers();
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const [filters, setFilters] = useState({
    _id: '',
    user_id: '',
    status: '',
    payment_method: '',
    total_priceMin: '',
    total_priceMax: '',
  });

  const normalizeText = (value: any) =>
    typeof value === 'string'
      ? value.toLowerCase()
      : value?.name?.toLowerCase?.() || '';

  const filteredData = order?.filter((orders: IOrder) => {
    if (
      filters._id &&
      !normalizeText(orders._id).includes(filters._id.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.user_id &&
      !normalizeText(orders.user_id).includes(filters.user_id.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.payment_method &&
      orders.payment_method?.toLowerCase() !== filters.payment_method.toLowerCase()
    ) {
      return false;
    }

    if (
      (filters.total_priceMin && Number(orders.total_price) < Number(filters.total_priceMin)) ||
      (filters.total_priceMax && Number(orders.total_price) > Number(filters.total_priceMax))
    ) {
      return false;
    }

    if (
      filters.status &&
      orders.status?.toLowerCase() !== filters.status.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (value: string | number, type: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

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

  const handleUpdateStatus = (orderId: string, newStatus: IOrder["status"]) => {
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
  if (!order) return <Empty description="Không có đơn hàng nào" />;

  // Map user_id (string) -> username
  const userMap = new Map((users as IUser[])?.map((u) => [u._id, u.username]));

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm theo mã đơn"
            value={filters._id}
            onChange={(e) => handleFilterChange(e.target.value, '_id')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters._id ? '#1890ff' : undefined }} />,
      render: (id: string) => <Tag color="blue">#{id?.slice(-6).toUpperCase()}</Tag>,
    },
    {
      title: "Người đặt",
      dataIndex: "user_id",
      key: "user_id",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm theo tên người dùng"
            value={filters.user_id}
            onChange={(e) => handleFilterChange(e.target.value, 'user_id')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.user_id ? '#1890ff' : undefined }} />,
      render: (user: any) => {
        const username = userMap.get(user?._id);
        return username || "Không rõ";
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_price",
      key: "total_price",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6, width: 220 }}>
          <InputNumber
            placeholder="Tổng tiền min"
            value={filters.total_priceMin}
            onChange={(e) => handleFilterChange(e ?? '', 'total_priceMin')}
            style={{ width: '100%', marginRight: 8 }}
          />
          <InputNumber
            placeholder="Tổng tiền max"
            value={filters.total_priceMax}
            onChange={(e) => handleFilterChange(e ?? '', 'total_priceMax')}
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.total_priceMin || filters.total_priceMax ? '#1890ff' : undefined }} />,
      render: (price: number) =>
        price?.toLocaleString("en-US", { style: "currency", currency: "USD" }),
    },
    {
      title: "Phương thức",
      dataIndex: "payment_method",
      key: "payment_method",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm theo phương thức thanh toán"
            value={filters.payment_method}
            onChange={(e) => handleFilterChange(e.target.value, 'payment_method')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.payment_method ? '#1890ff' : undefined }} />,
      render: (method: string) => <Tag>{method}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Select
            style={{ width: '200px' }}
            placeholder="Chọn trạng thái"
            allowClear
            value={filters.status}
            onChange={(value) => handleFilterChange(value || '', 'status')}
          >
            <Select.Option value="pending">Chờ xử lý</Select.Option>
            <Select.Option value="processing">Đang xử lý</Select.Option>
            <Select.Option value="shipped">Đang giao</Select.Option>
            <Select.Option value="delivered">Đã giao</Select.Option>
            <Select.Option value="canceled">Đã hủy</Select.Option>
          </Select>
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.status ? '#1890ff' : undefined }} />,
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
          {order.status !== "canceled" &&
            order.status !== "delivered" &&
            order.status !== "shipped" && (
              <Popconfirm
                title="Hủy đơn hàng"
                description="Bạn có chắc muốn hủy đơn hàng này?"
                onConfirm={() => handleCancelOrder(order._id!)}
                okText="Hủy đơn"
                cancelText="Không"
              > 
                <Button danger>Hủy</Button>
              </Popconfirm>
            )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{
          total: filteredData?.length,
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
