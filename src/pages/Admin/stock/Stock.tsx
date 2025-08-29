import { Button, Empty, Input, message, Skeleton, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useStocks } from "../../../hooks/useStock";
import type { IStock } from "../../../interface/stock";
import { useState } from "react";
import { useRole } from "../../../hooks/useAuth";

const Stock = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: stock, isLoading } = useStocks();
  const [filters, setFilters] = useState({
    sku: '',
    product_name: '',
    color: '',
    size: '',
  });
  const role = useRole()

  const normalize = (value: string | number | undefined | null) =>
    typeof value === 'string' ? value.toLowerCase() : value?.toString().toLowerCase() || '';

  const filteredData = stock?.filter((item: IStock) => {
    if (
      filters.sku &&
      !normalize(item.sku).includes(filters.sku.toLowerCase())
    ) return false;

    if (
      filters.product_name &&
      !normalize(item.product_name).includes(filters.product_name.toLowerCase())
    ) return false;

    if (
      filters.color &&
      !normalize(item.color).includes(filters.color.toLowerCase())
    ) return false;

    if (
      filters.size &&
      !normalize(item.size).includes(filters.size.toLowerCase())
    ) return false;

    return true;
  });

  const handleFilterChange = (value: string, field: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) return <Skeleton active />;
  if (!stock) return <Empty />;

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
      filterDropdown: () => (
        <Input
          placeholder="Lọc theo tên sản phẩm"
          value={filters.product_name}
          onChange={(e) => handleFilterChange(e.target.value, 'product_name')}
          prefix={<SearchOutlined />}
          allowClear
          style={{ padding: 8, borderRadius: 6 }}
        />
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.product_name ? '#1890ff' : undefined }} />,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      filterDropdown: () => (
        <Input
          placeholder="Lọc theo SKU"
          value={filters.sku}
          onChange={(e) => handleFilterChange(e.target.value, 'sku')}
          prefix={<SearchOutlined />}
          allowClear
          style={{ padding: 8, borderRadius: 6 }}
        />
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.sku ? '#1890ff' : undefined }} />,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      render: (color: string) => <Tag color="geekblue">{color}</Tag>,
      filterDropdown: () => (
        <Input
          placeholder="Lọc theo màu"
          value={filters.color}
          onChange={(e) => handleFilterChange(e.target.value, 'color')}
          prefix={<SearchOutlined />}
          allowClear
          style={{ padding: 8, borderRadius: 6 }}
        />
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.color ? '#1890ff' : undefined }} />,
    },
    {
      title: "Kích cỡ",
      dataIndex: "size",
      key: "size",
      render: (size: string) => <Tag>{size}</Tag>,
      filterDropdown: () => (
        <Input
          placeholder="Lọc theo size"
          value={filters.size}
          onChange={(e) => handleFilterChange(e.target.value, 'size')}
          prefix={<SearchOutlined />}
          allowClear
          style={{ padding: 8, borderRadius: 6 }}
        />
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.size ? '#1890ff' : undefined }} />,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Lần cập nhật cuối",
      dataIndex: "last_updated",
      key: "last_updated",
      render: (text: string) =>
        text ? new Date(text).toLocaleString() : "Không có",
    },
    ...(role === "admin"
      ? [
        {
          title: "Thao tác",
          key: "actions",
          render: (_: any, stock: IStock) => (
            <Link to={`/admin/stocks/stock/edit/${stock._id}`}>
              <Button type="default" icon={<EditOutlined />} />
            </Link>
          ),
        },
      ]
      : []),
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
          showTotal: (total) => `Tổng ${total} sản phẩm trong kho`,
        }}
      />
    </div>
  );
};

export default Stock;
