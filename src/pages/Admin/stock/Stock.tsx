import { Button, Empty, message, Skeleton, Table } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { useStocks } from "../../../hooks/useStock";
import type { IStock } from "../../../interface/stock";

const Stock = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data, isLoading } = useStocks();
  console.log("stocks data:", data);

  if (isLoading) return <Skeleton active />;
  if (!data) return <Empty />;

  const columns = [
    {
      title: "Biến thể",
      dataIndex: "product_variant_id",
      key: "product_variant_id",
      render: (variant: any) => variant?.product_id?.name || "Không rõ",
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
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, stock: IStock) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/admin/stocks/edit/${stock._id}`}>
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
        dataSource={Array.isArray(data) ? data : []}
        rowKey="_id"
        pagination={{
          total: data.length,
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