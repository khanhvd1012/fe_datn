import { useQueryClient } from "@tanstack/react-query";
import { Button, Empty, Input, InputNumber, message, Popconfirm, Select, Skeleton, Table, Tag } from "antd";
import { useState } from "react";
import type { IVariant } from "../../../interface/variant";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import DrawerVariant from "../../../components/LayoutAdmin/drawer/DrawerVariant";
import { useDeleteVariant, useVariants } from "../../../hooks/useVariants";
import { useRole } from "../../../hooks/useAuth";

const Variant = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { mutate } = useDeleteVariant();
  const { data: variant, isLoading } = useVariants();
  const [filters, setFilters] = useState({
    product_id: '',
    color: '',
    size: '',
    gender: '',
    priceMin: '',
    priceMax: '',
    status: ''
  });
  const role = useRole()

  const normalizeText = (value: any) =>
    typeof value === 'string'
      ? value.toLowerCase()
      : value?.name?.toLowerCase?.() || '';

  const filteredData = variant?.filter((variant: IVariant) => {
    if (
      filters.product_id &&
      !normalizeText(variant.product_id).includes(filters.product_id.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.color &&
      !normalizeText(variant.color).includes(filters.color.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.size &&
      !normalizeText(variant.size).includes(filters.size.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.gender &&
      variant.gender?.toLowerCase() !== filters.gender.toLowerCase()
    ) {
      return false;
    }

    if (
      (filters.priceMin && Number(variant.price) < Number(filters.priceMin)) ||
      (filters.priceMax && Number(variant.price) > Number(filters.priceMax))
    ) {
      return false;
    }

    if (filters.status && variant.status?.toLowerCase() !== filters.status.toLowerCase()) {
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

  const handleDelete = async (id: string) => {
    try {
      mutate(id, {
        onSuccess: () => {
          messageApi.success("Xóa biến thể thành công");
          queryClient.invalidateQueries({ queryKey: ["variants"] });
        },
        onError: (error: any) => {
          const backendErrors = error?.response?.data?.errors;

          if (Array.isArray(backendErrors) && backendErrors.length > 0) {
            message.error(backendErrors[0].message);
          } else {
            message.error(error?.response?.data?.message || "Lỗi khi xóa biến thể.");
          }
        }
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
  if (!variant) return <Empty />;

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
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm tên sản phẩm"
            value={filters.product_id}
            onChange={(e) => handleFilterChange(e.target.value, 'product_id')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.product_id ? '#1890ff' : undefined }} />,
      render: (product: any) => typeof product === 'string' ? product : product?.name,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm màu sắc"
            value={filters.color}
            onChange={(e) => handleFilterChange(e.target.value, 'color')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.color ? '#1890ff' : undefined }} />,
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
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm kích cỡ"
            value={filters.size}
            onChange={(e) => handleFilterChange(e.target.value, 'size')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.size ? '#1890ff' : undefined }} />,
      render: (size: any) =>
        typeof size === 'string' ? size : size?.size || 'Không rõ',
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Select
            style={{ width: '200px' }}
            placeholder="Chọn giới tính"
            allowClear
            value={filters.gender}
            onChange={(value) => handleFilterChange(value || '', 'gender')}
          >
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
            <Select.Option value="unisex">Unisex</Select.Option>
          </Select>
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.gender ? '#1890ff' : undefined }} />,
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
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6, width: 220 }}>
          <InputNumber
            placeholder="Giá bán min"
            value={filters.priceMin}
            onChange={(e) => handleFilterChange(e ?? '', 'priceMin')}
            style={{ width: '100%', marginRight: 8 }}
          />
          <InputNumber
            placeholder="Giá bán max"
            value={filters.priceMax}
            onChange={(e) => handleFilterChange(e ?? '', 'priceMax')}
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.priceMin || filters.priceMax ? '#1890ff' : undefined }} />,
      render: (price: number) => price?.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' }),
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
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Select
            style={{ width: '200px' }}
            placeholder="Chọn trạng thái"
            allowClear
            value={filters.status}
            onChange={(value) => handleFilterChange(value || '', 'status')}
          >
            <Select.Option value="inStock">Còn hàng</Select.Option>
            <Select.Option value="outOfStock">Hết hàng</Select.Option>
            <Select.Option value="paused">Tạm dừng</Select.Option>
          </Select>
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.status ? '#1890ff' : undefined }} />,
      render: (status: string) => {
        switch (status) {
          case "inStock":
            return <Tag color="success">Còn hàng</Tag>;
          case "outOfStock":
            return <Tag color="error">Hết hàng</Tag>;
          case "paused":
            return <Tag color="warning">Tạm dừng</Tag>;
          default:
            return <Tag color="default">Không rõ</Tag>;
        }
      }
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
          {role === "admin" && (
            <Link to={`/admin/variants/edit/${variant._id}`}>
              <Button type="default" icon={<EditOutlined />} />
            </Link>
          )}
          {role === "admin" && (
            <Popconfirm
              title="Xóa biến thể"
              description="Bạn có chắc chắn muốn xóa biến thể này?"
              onConfirm={() => handleDelete(variant._id!)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      {role === "admin" && (
        <div style={{ marginBottom: 16 }}>
          <Link to="/admin/variants/create">
            <Button type="primary">Thêm biến thể</Button>
          </Link>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{
          total: filteredData?.length,
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