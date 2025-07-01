import { useStockHistory, useDeleteStockHistory } from "../../../hooks/useStock";
import type { IStockHistory } from "../../../interface/stock";
import { Button, Empty, message, Popconfirm, Skeleton, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const StockHistory = () => {
  const { data, isLoading } = useStockHistory();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutate } = useDeleteStockHistory();

  const handleDelete = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        messageApi.success("Xóa lịch sử thành công");
        queryClient.invalidateQueries({ queryKey: ["stock-history"] });
      },
      onError: () => {
        messageApi.error("Lỗi khi xóa bản ghi");
      },
    });
  };

  if (isLoading) return <Skeleton active />;
  if (!data || data.length === 0) return <Empty description="Không có lịch sử kho" />;

  const columns = [
    {
      title: "ID Kho",
      dataIndex: "stock_id",
      key: "stock_id",
      render: (stock: any) =>
        typeof stock === "string" ? stock : stock?.product_variant_id || "Không rõ",
    },
    {
      title: "Thay đổi SL",
      dataIndex: "quantity_change",
      key: "quantity_change",
      render: (value: number) => (
        <Tag color={value >= 0 ? "green" : "red"}>{value >= 0 ? `+${value}` : value}</Tag>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: IStockHistory) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/admin/stocks_history/edit/${record._id}`}>
            <Button type="default" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xóa bản ghi này?"
            onConfirm={() => handleDelete(record._id!)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      )
    },
  ];

  return (
    <div>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        pagination={{
          total: data.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} lịch sử kho`,
        }}
      />
    </div>
  );
};

export default StockHistory;
