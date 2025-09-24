import { Table, Tag, Select, message, Popconfirm, Button, Skeleton, Empty, Modal } from "antd";
import { DatePicker, Input } from "antd";
import { useState } from "react";
import { useAdminOrders, useCancelOrder, useUpdateOrderStatus, useUpdatePaymentStatus } from "../../../hooks/useOrder";
import { useUsers } from "../../../hooks/useUser";
import { DeleteOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import type { IOrder, IUser, IOrderItem } from "../../../interface/order";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
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
  const [selectedReason, setSelectedReason] = useState("");
  const [reasonType, setReasonType] = useState<"cancel" | "return" | null>(null);
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const { mutate: updatePaymentStatus } = useUpdatePaymentStatus();

  const [filters, setFilters] = useState({
    user: "",
    createdAt: "",
    status: "",
    paymentStatus: "",
    orderCode: "",
    productName: "",
    sku: "",
  });
  const role = useRole();

  const handleFilterChange = (value: string, key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: value });
  };

  const filteredOrders = orders?.filter((order) => {
    // user_id có thể là object hoặc string
    const user =
      typeof order.user_id === "string"
        ? users?.find((u) => u._id === order.user_id)
        : (order.user_id as IUser);
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

    if (filters.paymentStatus && order.payment_status !== filters.paymentStatus) {
      return false;
    }

    if (
      filters.orderCode &&
      !(order.order_code || "").toLowerCase().includes(filters.orderCode.toLowerCase())
    ) {
      return false;
    }

    // lọc theo tên sản phẩm
    if (filters.productName) {
      const productNames =
        order?.items?.map((i: IOrderItem) =>
          typeof i.variant_id === "object" && "product_id" in i.variant_id
            ? (i.variant_id as any)?.product_id?.name?.toLowerCase()
            : ""
        ) || [];
      if (
        !productNames.some((name) =>
          name?.includes(filters.productName.toLowerCase())
        )
      ) {
        return false;
      }
    }

    // lọc theo SKU
    if (filters.sku) {
      const skus =
        order?.items?.map((i: IOrderItem) =>
          typeof i.variant_id === "object"
            ? (i.variant_id as any)?.sku?.toLowerCase()
            : ""
        ) || [];
      if (!skus.some((sku) => sku?.includes(filters.sku.toLowerCase()))) {
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
        onError: (err: any) => {
          const errorMessage =
            err?.response?.data?.message || "Cập nhật trạng thái thất bại";
          messageApi.warning(errorMessage);
        },
      }
    );
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      messageApi.warning("Vui lòng nhập lý do từ chối hoàn hàng");
      return;
    }

    if (rejectOrderId) {
      updateStatus(
        { id: rejectOrderId, status: "return_rejected", reject_reason: rejectReason },
        {
          onSuccess: () => {
            messageApi.success("Đã từ chối hoàn hàng");
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            setRejectModalVisible(false);
            setRejectReason("");
            setRejectOrderId(null);
          },
          onError: (err: any) => {
            const errorMessage =
              err?.response?.data?.message || "Từ chối hoàn hàng thất bại";
            messageApi.error(errorMessage);
          },
        }
      );
    }
  };

  const showOrderDetails = (order: IOrder) => {
    setDrawerVisible(true);
    setSelectedOrder(order);
  };

  const showCancelReason = (reason: string) => {
    setSelectedReason(reason);
    setReasonType("cancel");
    setReasonModalVisible(true);
  };

  const showReturnReason = (reason: string, images: string[] = []) => {
    setSelectedReason(reason);
    setSelectedImages(images);
    setReasonType("return");
    setReasonModalVisible(true);
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

  const paymentStatusColorMap: Record<NonNullable<IOrder["payment_status"]>, string> = {
    unpaid: "orange",
    paid: "green",
    refund_processing: "gold",
    canceled: "red",
    refunded: "blue",
  };

  const paymentStatusLabelMap: Record<NonNullable<IOrder["payment_status"]>, string> = {
    unpaid: "Chưa thanh toán",
    paid: "Đã thanh toán",
    refund_processing: "Đang hoàn tiền",
    canceled: "Thanh toán hủy",
    refunded: "Đã hoàn tiền",
  };

  const statusColorMap: Partial<Record<IOrder["status"], string>> = {
    pending: "orange",
    processing: "blue",
    shipped: "purple",
    delivered: "green",
    return_requested: "gold",
    return_accepted: "geekblue",
    return_rejected: "volcano",
    returned_received: "cyan",
    returned: "magenta",
    canceled: "red",
  };

  const statusLabelMap: Partial<Record<IOrder["status"], string>> = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    delivered: "Đã giao",
    return_requested: "Yêu cầu hoàn hàng",
    return_accepted: "Chấp nhận hoàn hàng",
    return_rejected: "Từ chối hoàn hàng",
    returned_received: "Đã nhận hàng hoàn",
    returned: "Đã hoàn hàng",
    canceled: "Đã hủy",
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
        <FilterOutlined
          style={{ color: filters.orderCode ? "#1890ff" : undefined }}
        />
      ),
      render: (code: string) => <Tag color="blue">#{code}</Tag>,
    },
    {
      title: "Người đặt",
      dataIndex: "user_id",
      key: "user_id",
      render: (user: IUser | string) => {
        if (typeof user === "string") {
          const u = users?.find((x) => x._id === user);
          return u?.username || "Không rõ";
        }
        return user?.username || "Không rõ";
      },
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
      title: "Trạng thái đơn hàng",
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
            {Object.entries(statusLabelMap).map(([key, label]) => (
              <Select.Option key={key} value={key}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
      filterIcon: () => (
        <FilterOutlined style={{ color: filters.status ? "#1890ff" : undefined }} />
      ),
      render: (status: IOrder["status"]) => (
        <Tag color={statusColorMap[status] || "default"}>
          {statusLabelMap[status] || status}
        </Tag>
      ),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "payment_status",
      key: "payment_status",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: "white", borderRadius: 6 }}>
          <Select
            placeholder="Chọn trạng thái thanh toán"
            style={{ width: 180 }}
            allowClear
            value={filters.paymentStatus || undefined}
            onChange={(value) => handleFilterChange(value || "", "paymentStatus")}
          >
            {Object.entries(paymentStatusLabelMap).map(([key, label]) => (
              <Select.Option key={key} value={key}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
      filterIcon: () => (
        <FilterOutlined
          style={{ color: filters.paymentStatus ? "#1890ff" : undefined }}
        />
      ),
      render: (status: IOrder["payment_status"], order: IOrder) => {
        if (!status) return <Tag color="default">Không rõ</Tag>;

        // Nếu đang hoàn tiền → hiển thị nút xác nhận
        if (status === "refund_processing") {
          return (
            <Button
              type="primary"
              size="small"
              onClick={() =>
                updatePaymentStatus(
                  { id: order._id!, payment_status: "refunded" },
                  {
                    onSuccess: () => {
                      messageApi.success("Cập nhật thành công: Đã hoàn tiền");
                      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
                    },
                    onError: (err: any) => {
                      messageApi.error(
                        err?.response?.data?.message || "Cập nhật thất bại"
                      );
                    },
                  }
                )
              }
            >
              Xác nhận đã hoàn tiền
            </Button>
          );
        }

        // Trường hợp khác: chỉ hiển thị tag
        return (
          <Tag color={paymentStatusColorMap[status]}>
            {paymentStatusLabelMap[status]}
          </Tag>
        );
      },
    },
    {
      title: "Cập nhật trạng thái",
      key: "updateStatus",
      render: (_: any, order: IOrder) => {
        // Thứ tự trạng thái
        const statusOrder: IOrder["status"][] = [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "return_requested",
          "return_accepted",
          "return_rejected",
          "returned",
          "canceled",
        ];

        const currentIndex = statusOrder.indexOf(order.status);

        // Nếu đơn đã giao, hủy, hoặc hoàn hàng -> chỉ hiển thị tag
        if (["delivered", "canceled", "returned", "return_rejected", "returned_received"].includes(order.status)) {
          return (
            <Tag color={statusColorMap[order.status]}>
              {statusLabelMap[order.status]}
            </Tag>
          );
        }

        // Trường hợp đặc biệt: return_requested
        if (order.status === "return_requested") {
          return (
            <Select
              labelInValue
              value={{
                value: order.status,
                label: statusLabelMap[order.status] || order.status,
              } as { value: IOrder["status"]; label: string }}
              style={{ width: 180 }}
              onChange={({ value }: { value: IOrder["status"] }) => {
                if (value === "return_rejected") {
                  setRejectOrderId(order._id!);
                  setRejectModalVisible(true);
                } else {
                  handleUpdateStatus(order._id, value);
                }
              }}
            >
              <Select.Option value="return_accepted">
                {statusLabelMap["return_accepted"]}
              </Select.Option>
              <Select.Option value="return_rejected">
                {statusLabelMap["return_rejected"]}
              </Select.Option>
            </Select>
          );
        }

        // Trường hợp đặc biệt: return_accepted
        if (order.status === "return_accepted") {
          return (
            <Button
              type="primary"
              size="small"
              onClick={() => handleUpdateStatus(order._id, "returned_received")}
            >
              {statusLabelMap["returned_received"]}
            </Button>
          );
        }

        // Các trạng thái bình thường
        return (
          <Select
            labelInValue
            value={{
              value: order.status,
              label: statusLabelMap[order.status] || order.status,
            }}
            style={{ width: 180 }}
            onChange={({ value }) => handleUpdateStatus(order._id, value)}
          >
            {Object.entries(statusLabelMap)
              .filter(([key]) => {
                if (["canceled", "return_requested", "return_accepted", "return_rejected", "returned"].includes(key)) {
                  return false; // các trạng thái hoàn hàng chỉ xử lý riêng
                }
                return statusOrder.indexOf(key as IOrder["status"]) >= currentIndex;
              })
              .map(([key, label]) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ))}
          </Select>
        );
      },
    }
    ,
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
          {role === "admin" &&
            !["canceled", "shipped", "delivered", "returned", "return_accepted", "return_rejected", "returned_received", "return_requested"].includes(record.status) && (
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
    },
    {
      title: "Lý do hoàn hàng",
      key: "returnReason",
      render: (_: any, record: IOrder) =>
        (["return_requested", "return_accepted", "return_rejected", "returned"].includes(record.status)) &&
          record.return_reason ? (
          <Button
            type="link"
            onClick={() => showReturnReason(record.return_reason!, record.images || [])}
          >
            Xem lý do hoàn hàng
          </Button>
        ) : null,
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
        dataSource={[...(filteredOrders || [])].sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
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
        title="Nhập lý do từ chối hoàn hàng"
        open={rejectModalVisible}
        onOk={handleConfirmReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason("");
          setRejectOrderId(null);
        }}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do từ chối..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
      <Modal
        title={reasonType === "cancel" ? "Lý do hủy đơn hàng" : "Lý do hoàn hàng"}
        open={reasonModalVisible}
        onCancel={() => setReasonModalVisible(false)}
        onOk={() => setReasonModalVisible(false)}
        okText="Đóng"
        cancelButtonProps={{ style: { display: "none" } }}
        width={600}   // cho rộng hơn để hiển thị ảnh đẹp
      >
        <div style={{ lineHeight: 1.6 }}>
          <strong>Nội dung:</strong>
          <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
            {selectedReason}
          </div>

          {reasonType === "return" && selectedImages.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <strong>Ảnh minh chứng:</strong>
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {selectedImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`return-proof-${index}`}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
