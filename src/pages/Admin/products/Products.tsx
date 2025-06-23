import { Button, Empty, message, Popconfirm, Skeleton, Table } from 'antd';
import { useState } from 'react';
import type { IProduct } from '../../../interface/product';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useProducts, useDeleteProduct } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import { useBrands } from '../../../hooks/useBrands';
import DrawerProduct from '../../../components/drawer/DrawerProduct';
import { ProductFilters } from '../../../components/ProductFilters';

const Products = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    minPrice: '',
    maxPrice: '',
    category: '',
    brand: '',
    status: '',
    gender: ''
  });

  // Sử dụng các hooks đã được đơn giản hóa
  const { data: productsResponse, isLoading, refetch } = useProducts();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { mutate: deleteProduct } = useDeleteProduct();

  const filteredData = productsResponse?.data?.filter((product: IProduct) => {
    if (filters.name && !product.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    if (filters.minPrice && product.price < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && product.price > Number(filters.maxPrice)) {
      return false;
    }
    if (filters.category && typeof product.category === 'object' &&
      product.category !== null && 'name' in product.category &&
      product.category._id !== filters.category) {
      return false;
    }
    if (filters.brand && typeof product.brand === 'object' &&
      product.brand !== null && 'name' in product.brand &&
      product.brand._id !== filters.brand) {
      return false;
    }
    if (filters.status && product.status !== filters.status) {
      return false;
    }
    if (filters.gender && product.gender !== filters.gender) {
      return false;
    }
    return true;
  }) || [];

  const handleFilterChange = (value: string | number, type: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleDelete = (id: string) => {
    deleteProduct(id, {
      onSuccess: () => {
        messageApi.success('Xóa sản phẩm thành công!');
        refetch(); // Tải lại danh sách sau khi xóa
      },
      onError: (error: any) => {
        messageApi.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm!');
      }
    });
  };

  const handleView = (product: IProduct) => {
    setSelectedProduct(product);
    setIsDrawerVisible(true);
  };

  if (isLoading) return <Skeleton active />;
  if (!productsResponse?.data) return <Empty />;

  const filterProps = {
    filters,
    onFilterChange: handleFilterChange,
    categories,
    brands
  };

  const columns = [
    ProductFilters.nameColumn(filterProps),
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images: string[]) => (
        images && images.length > 0 ? (
          <img src={images[0]} alt="Sản phẩm" style={{ width: 50, height: 50, objectFit: 'cover' }} />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có ảnh" style={{ margin: 0 }} />
        )
      )
    },
    ProductFilters.priceColumn(filterProps),
    ProductFilters.brandColumn(filterProps),
    ProductFilters.categoryColumn(filterProps),
    ProductFilters.genderColumn(filterProps),
    ProductFilters.statusColumn(filterProps),
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, product: IProduct) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(product)}
          />
          <Link to={`/admin/products/edit/${product._id}`}>
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
        <Link to="/admin/products/create">
          <Button type="primary">Thêm sản phẩm mới</Button>
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
        loading={false}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default Products;