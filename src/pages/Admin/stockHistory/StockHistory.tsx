import { useStockHistory, useDeleteStockHistory } from "../../../hooks/useStock";
import type { IStockHistory } from "../../../interface/stock";
import { Button, Empty, Input, message, Popconfirm, Skeleton, Table, Tag } from "antd";
import { DeleteOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const StockHistory = () => {
  const { data: stock_history, isLoading } = useStockHistory();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutate } = useDeleteStockHistory();
  const [filters, setFilters] = useState({
    stock_id: '',
  });

  const normalizeText = (value: any) =>
    typeof value === 'string'
      ? value.toLowerCase()
      : value?.name?.toLowerCase?.() || '';

  const filteredData = stock_history?.filter((stocks_history: IStockHistory) => {
    if (
      filters.stock_id &&
      !normalizeText(stocks_history.stock_id).includes(filters.stock_id.toLowerCase())
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
  if (!stock_history) return <Empty />;

  const columns = [
    {
      title: "ID Kho",
      dataIndex: "stock_id",
      key: "stock_id",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm theo ID kho"
            value={filters.stock_id}
            onChange={(e) => handleFilterChange(e.target.value, 'stock_id')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.stock_id ? '#1890ff' : undefined }} />,
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
        dataSource={filteredData}
        rowKey="_id"
        pagination={{
          total: filteredData?.length,
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
