import { useQueryClient } from "@tanstack/react-query";
import { Button, Empty, Input, message, Popconfirm, Skeleton, Table } from "antd";
import { useState } from "react";
import type { IProduct } from "../../../interface/product";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import DrawerProduct from "../../../components/drawer/DrawerProduct";
import { useDeleteProduct, useProducts } from "../../../hooks/useProducts";

const Products = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { mutate } = useDeleteProduct();
  const { data, isLoading } = useProducts();
  const [filters, setFilters] = useState({
    name: '',
    brand: '',
    category: '',
    size: '',
  });

  const filteredData = data?.filter((product: IProduct) => {
    const nameMatch = filters.name ? product.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
    const brandMatch = filters.brand
      ? typeof product.brand === 'string'
        ? product.brand.includes(filters.brand)
        : product.brand?.name?.toLowerCase().includes(filters.brand.toLowerCase())
      : true;
    const categoryMatch = filters.category
      ? typeof product.category === 'string'
        ? product.category.includes(filters.category)
        : product.category?.name?.toLowerCase().includes(filters.category.toLowerCase())
      : true;
    const sizeMatch = filters.size
      ? product.size?.some(s =>
        typeof s === 'string'
          ? s.includes(filters.size)
          : s.name?.toLowerCase().includes(filters.size.toLowerCase())
      )
      : true;

    return nameMatch && brandMatch && categoryMatch && sizeMatch;
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
          messageApi.success("Xóa sản phẩm thành công");
          queryClient.invalidateQueries({
            queryKey: ["products"],
          });
        },
        onError: () => messageApi.error("Lỗi khi xóa danh mục"),
      });
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const showProductDetails = (product: IProduct) => {
    setDrawerLoading(true);
    setSelectedProduct(product);
    setIsDrawerVisible(true);
    setTimeout(() => {
      setDrawerLoading(false);
    }, 500);
  };

  if (isLoading) return <Skeleton active />;
  if (!data) return <Empty />;

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm tên sản phẩm"
            value={filters.name}
            onChange={(e) => handleFilterChange(e.target.value, 'name')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.name ? '#1890ff' : undefined }} />,
    },

    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },

    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm theo thương hiệu"
            value={filters.brand}
            onChange={(e) => handleFilterChange(e.target.value, 'brand')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.brand ? '#1890ff' : undefined }} />,
      render: (brand: any) => typeof brand === 'string' ? brand : brand?.name,
    },

    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm theo danh mục"
            value={filters.category}
            onChange={(e) => handleFilterChange(e.target.value, 'category')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.category ? '#1890ff' : undefined }} />,
      render: (category: any) => typeof category === 'string' ? category : category?.name,
    },
    {
      title: "Kích cỡ",
      dataIndex: "size",
      key: "size",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm theo kích cỡ"
            value={filters.size}
            onChange={(e) => handleFilterChange(e.target.value, 'size')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.size ? '#1890ff' : undefined }} />,
      render: (sizes: any[]) =>
        Array.isArray(sizes)
          ? sizes.map(s => typeof s === 'string' ? s : s?.size).join(', ')
          : '',
    },

    {
      title: "Biến thể",
      dataIndex: "variants",
      key: "variants",
      render: (variants: string[]) => variants?.length || 0,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, product: IProduct) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showProductDetails(product)}
          />
          <Link to={`/admin/Products/edit/${product._id}`}>
            <Button type="default" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(product._id!)}
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
        <Link to="/admin/Products/create">
          <Button type="primary">Thêm sản phẩm</Button>
        </Link>
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
          showTotal: (total) => `Tổng ${total} sản phẩm`,
        }}
      />

      <DrawerProduct
        visible={isDrawerVisible}
        product={selectedProduct}
        loading={drawerLoading}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default Products;