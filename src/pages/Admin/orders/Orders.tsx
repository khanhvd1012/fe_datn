import { Table, Tag, Select, message, Popconfirm, Button, Skeleton, Empty, Modal } from "antd";
import { DatePicker, Input } from "antd";
import { useState } from "react";
import { useAdminOrders, useCancelOrder, useUpdateOrderStatus } from "../../../hooks/useOrder";
import { useUsers } from "../../../hooks/useUser";
import { DeleteOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import type { IOrder } from "../../../interface/order";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from 'dayjs';
import DrawerOrder from "../../../components/LayoutAdmin/drawer/DrawerOrder";
import { useRole } from "../../../hooks/useAuth";

const Orders = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: orders, isLoading } = useAdminOrders();
  const { mutate: cancelOrder } = useCancelOrder();
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { data: users } = useUsers();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState('');
  const [filters, setFilters] = useState({
    user: "",
    createdAt: "",
    status: "",
    orderCode: "",
    productName: "",
    sku: "",
  });
  const role = useRole()
  const handleFilterChange = (value: string, key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: value });
  };
  const filteredOrders = orders?.filter((order) => {
    const user = users?.find((u) => u._id === order.user_id);
    const username = user?.username?.toLowerCase() || "";

    if (filters.user && !username.includes(filters.user.toLowerCase())) {
      return false;
    }

    if (
      filters.createdAt &&
      dayjs(order.createdAt).format("DD/MM/YYYY") !== filters.createdAt
    ) {
      return false;
    }

    if (filters.status && order.status !== filters.status) {
      return false;
    }
    if (filters.orderCode && !order._id.toLowerCase().includes(filters.orderCode.toLowerCase())) {
      return false;
    }
    // lọc theo tên sản phẩm
    if (filters.productName) {
      const productNames = order?.items?.map((i: any) => i.variant_id?.product_id?.name?.toLowerCase() || "");
      if (!productNames?.some((name: string) => name.includes(filters.productName.toLowerCase()))) {
        return false;
      }
    }

    // lọc theo SKU
    if (filters.sku) {
      const skus = order?.items?.map((i: any) => i.variant_id?.sku?.toLowerCase() || "");
      if (!skus?.some((sku: string) => sku.includes(filters.sku.toLowerCase()))) {
        return false;
      }
    }
    return true;
  });

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
      dataIndex: "order_code",
      key: "order_code",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: "white", borderRadius: 6 }}>
          <Input
            placeholder="Tìm mã đơn"
            value={filters.orderCode}
            onChange={(e) => handleFilterChange(e.target.value, "orderCode")}
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 200 }}
          />
        </div>
      ),
      filterIcon: () => (
        <FilterOutlined style={{ color: filters.orderCode ? "#1890ff" : undefined }} />
      ),
      render: (code: string) => <Tag color="blue">#{code}</Tag>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "items",
      key: "product_name",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: "white", borderRadius: 6 }}>
          <Input
            placeholder="Tìm sản phẩm"
            value={filters.productName}
            onChange={(e) => handleFilterChange(e.target.value, "productName")}
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 200 }}
          />
        </div>
      ),
      filterIcon: () => (
        <FilterOutlined style={{ color: filters.productName ? "#1890ff" : undefined }} />
      ),
      render: (items: any[]) => {
        if (!items || items.length === 0) return "Không có sản phẩm";
        return items[0]?.variant_id?.product_id?.name || "Không rõ";
      },
    },
    {
      title: "SKU",
      dataIndex: "items",
      key: "product_sku",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: "white", borderRadius: 6 }}>
          <Input
            placeholder="Tìm SKU"
            value={filters.sku}
            onChange={(e) => handleFilterChange(e.target.value, "sku")}
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 200 }}
          />
        </div>
      ),
      filterIcon: () => (
        <FilterOutlined style={{ color: filters.sku ? "#1890ff" : undefined }} />
      ),
      render: (items: any[]) => {
        if (!items || items.length === 0) return "không có";
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {items.map((item, index) => (
              <Tag key={index} color="blue">
                {item.variant_id?.sku || "không có"}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Người đặt",
      dataIndex: "user_id",
      key: "user_id",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: "white", borderRadius: 6 }}>
          <Input
            placeholder="Tìm tên người dùng"
            value={filters.user}
            onChange={(e) => handleFilterChange(e.target.value, "user")}
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: "200px" }}
          />
        </div>
      ),
      filterIcon: () => (
        <FilterOutlined
          style={{ color: filters.user ? "#1890ff" : undefined }}
        />
      ),
      render: (userId: string) => {
        const user = users?.find((u) => u._id === userId);
        return user?.username || "Không rõ";
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: "white", borderRadius: 6 }}>
          <DatePicker
            placeholder="Chọn ngày"
            format="DD/MM/YYYY"
            value={filters.createdAt ? dayjs(filters.createdAt, "DD/MM/YYYY") : null}
            onChange={(_, dateString) => handleFilterChange(dateString as string, "createdAt")}
            allowClear
            style={{ width: "100%" }}
          />
        </div>
      ),
      filterIcon: () => (
        <FilterOutlined style={{ color: filters.createdAt ? "#1890ff" : undefined }} />
      ),
      render: (date: string) => dayjs(date).format("HH:mm DD/MM/YYYY"),
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
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: "white", borderRadius: 6 }}>
          <Select
            placeholder="Chọn trạng thái"
            style={{ width: 160 }}
            allowClear
            value={filters.status || undefined}
            onChange={(value) => handleFilterChange(value || "", "status")}
          >
            <Select.Option value="pending">Chờ xử lý</Select.Option>
            <Select.Option value="processing">Đang xử lý</Select.Option>
            <Select.Option value="shipped">Đang giao</Select.Option>
            <Select.Option value="delivered">Đã giao</Select.Option>
            <Select.Option value="canceled">Đã hủy</Select.Option>
            <Select.Option value="returned">Đã trả hàng</Select.Option>
          </Select>
        </div>
      ),
      filterIcon: () => (
        <FilterOutlined style={{ color: filters.status ? "#1890ff" : undefined }} />
      ),
      render: (status: IOrder["status"]) => {
        const colorMap = {
          pending: "orange",
          processing: "blue",
          shipped: "purple",
          delivered: "green",
          canceled: "red",
          returned: "magenta",
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
          returned: "Đã trả hàng",
        };

        const valueMap: Record<string, IOrder["status"]> = {
          "Chờ xử lý": "pending",
          "Đang xử lý": "processing",
          "Đang giao": "shipped",
          "Đã giao": "delivered",
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
            disabled={order.status === "canceled"}
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
          {role === "admin" &&
            record.status !== "canceled" &&
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
        dataSource={[...(filteredOrders || [])].sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        )}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
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
