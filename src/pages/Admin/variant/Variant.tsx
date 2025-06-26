import { useQueryClient } from "@tanstack/react-query";
import { Button, Empty, message, Popconfirm, Skeleton, Table, Tag } from "antd";
import { useState } from "react";
import type { IVariant } from "../../../interface/variant";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import DrawerVariant from "../../../components/drawer/DrawerVariant";
import { useDeleteVariant, useVariants } from "../../../hooks/useVariants";

const Variant = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { mutate } = useDeleteVariant();
  const { data, isLoading } = useVariants();
  console.log("variants data:", data);
  const handleDelete = async (id: string) => {
    try {
      mutate(id, {
        onSuccess: () => {
          messageApi.success("Xóa biến thể thành công");
          queryClient.invalidateQueries({ queryKey: ["variants"] });
        },
        onError: () => messageApi.error("Lỗi khi xóa biến thể"),
      });
    } catch (error) {
      console.error("Error deleting variant:", error);
    }
  };

  const showVariantDetails = (variant: IVariant) => {
    setDrawerLoading(true);
    setSelectedVariant(variant);
    setIsDrawerVisible(true);
    setTimeout(() => {
      setDrawerLoading(false);
    }, 500);
  };

  if (isLoading) return <Skeleton active />;
  if (!data) return <Empty />;

  const columns = [
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Sản phẩm",
      dataIndex: "product_id",
      key: "product_id",
      render: (product: any) => typeof product === 'string' ? product : product?.name,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      render: (color: any) => (
        <Tag color="blue">
          {typeof color === 'string' ? color : color?.name || 'Không rõ'}
        </Tag>
      ),
    },
    {
      title: "Kích cỡ",
      dataIndex: "size",
      key: "size",
      render: (sizes: any[]) =>
        Array.isArray(sizes)
          ? sizes.map(s => typeof s === 'string' ? s : s?.size).join(', ')
          : '',
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => {
        let color = "default";
        let label = "";

        switch (gender) {
          case "male":
            color = "blue";
            label = "Nam";
            break;
          case "female":
            color = "magenta";
            label = "Nữ";
            break;
          case "unisex":
            color = "green";
            label = "Unisex";
            break;
          default:
            color = "gray";
            label = "Không rõ";
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    },
    {
      title: "Giá nhập",
      dataIndex: "import_price",
      key: "import_price",
      render: (price: number) => price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image_url",
      key: "image_url",
      render: (urls: string[]) =>
        urls && urls.length > 0 ? (
          <div style={{ display: "flex", gap: "4px" }}>
            {urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`ảnh ${index}`}
                style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
              />
            ))}
          </div>
        ) : (
          <Tag color="default">Không có ảnh</Tag>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => status === 'inStock' ? <Tag color="success">Còn hàng</Tag> : <Tag color="red">Hết hàng</Tag>,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, variant: IVariant) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showVariantDetails(variant)}
          />
          <Link to={`/admin/variants/edit/${variant._id}`}>
            <Button type="default" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xóa biến thể"
            description="Bạn có chắc chắn muốn xóa biến thể này?"
            onConfirm={() => handleDelete(variant._id!)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <div style={{ marginBottom: 16 }}>
        <Link to="/admin/variants/create">
          <Button type="primary">Thêm biến thể</Button>
        </Link>
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
          showTotal: (total) => `Tổng ${total} biến thể`,
        }}
      />
      <DrawerVariant
        visible={isDrawerVisible}
        variant={selectedVariant}
        loading={drawerLoading}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedVariant(null);
        }}
      />
    </div>
  );
};

export default Variant;