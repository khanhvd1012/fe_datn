import { Button, Empty, Input, message, Skeleton, Table } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useStocks } from "../../../hooks/useStock";
import type { IStock } from "../../../interface/stock";
import { useState } from "react";

const Stock = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: stock, isLoading } = useStocks();
  const [filters, setFilters] = useState({
    product_variant_id: '',
    quantity: '',
  });

  const normalizeText = (value: any) =>
    typeof value === 'string'
      ? value.toLowerCase()
      : value?.name?.toLowerCase?.() || '';

  const filteredData = stock?.filter((stocks: IStock) => {
    if (
      filters.product_variant_id &&
      !normalizeText(stocks.product_variant_id).includes(filters.product_variant_id.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.quantity &&
      !normalizeText(stocks.quantity).includes(filters.quantity.toLowerCase())
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

  if (isLoading) return <Skeleton active />;
  if (!stock) return <Empty />;

  const columns = [
    {
      title: "Biến thể",
      dataIndex: "product_variant_id",
      key: "product_variant_id",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm theo tên biến thể"
            value={filters.product_variant_id}
            onChange={(e) => handleFilterChange(e.target.value, 'product_variant_id')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.product_variant_id ? '#1890ff' : undefined }} />,
      render: (variant: any) => variant?.product_id?.name || "Không rõ",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm theo số lượng"
            value={filters.quantity}
            onChange={(e) => handleFilterChange(e.target.value, 'quantity')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.quantity ? '#1890ff' : undefined }} />,
    },
    {
      title: "Lần cập nhật cuối",
      dataIndex: "last_updated",
      key: "last_updated",
      render: (text: string) =>
        text ? new Date(text).toLocaleString() : "Không có",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, stock: IStock) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/admin/stocks/stock/edit/${stock._id}`}>
            <Button type="default" icon={<EditOutlined />} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <div style={{ marginBottom: 16 }}>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{
          total: filteredData?.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} số lượng kho`,
        }}
      />
    </div>
  );
};

export default Stock;