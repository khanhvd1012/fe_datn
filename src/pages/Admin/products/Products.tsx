import { useQueryClient } from '@tanstack/react-query';
import { Button, Empty, message, Popconfirm, Skeleton, Table, Tag, Select, Space, Input, Dropdown } from 'antd';
import { useState } from 'react';
import type { IProduct } from '../../../interface/product';
import type { ICategory } from '../../../interface/category';
import type { IBrand } from '../../../interface/brand';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useProducts, useDeleteProduct } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import { useBrands } from '../../../hooks/useBrands';
import DrawerProduct from '../../../hooks/drawer/DrawerProduct';


const Products = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    minPrice: '',
    maxPrice: '',
    category: '',
    brand: '',
    status: '',
    gender: ''
  });
  const { mutate } = useDeleteProduct();
  const { data, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const filteredData = data?.filter((product: IProduct) => {
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
        onError: () => messageApi.error("Lỗi khi xóa sản phẩm"),
      });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
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
      title: (
        <Space size="middle">
          Tên sản phẩm
          <Dropdown
            trigger={['click']}
            dropdownRender={() => (
              <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <Input
                  placeholder="Tìm kiếm theo tên"
                  value={filters.name}
                  onChange={(e) => handleFilterChange(e.target.value, 'name')}
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </div>
            )}
          >
            <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
          </Dropdown>
        </Space>
      ),
      dataIndex: "name",
      key: "name",
    },
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
    {
      title: (
        <Space size="middle">
          Giá
          <Dropdown
            trigger={['click']}
            dropdownRender={() => (
              <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Input
                  placeholder="Giá tối thiểu"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange(e.target.value, 'minPrice')}
                  type="number"
                  allowClear
                />
                <Input
                  placeholder="Giá tối đa"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange(e.target.value, 'maxPrice')}
                  type="number"
                  allowClear
                />
              </div>
            )}
          >
            <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
          </Dropdown>
        </Space>
      ),
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price?.toFixed(2)} đ`
    },
    {
      title: (
        <Space size="middle">
          Thương hiệu
          <Dropdown
            trigger={['click']}
            dropdownRender={() => (
              <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <Select
                  style={{ width: '200px' }}
                  placeholder="Chọn thương hiệu"
                  allowClear
                  value={filters.brand}
                  onChange={(value) => handleFilterChange(value || '', 'brand')}
                >
                  {brands?.map((brand: IBrand) => (
                    <Select.Option key={brand._id} value={brand._id}>
                      {brand.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}
          >
            <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
          </Dropdown>
        </Space>
      ),
      dataIndex: "brand",
      key: "brand",
      render: (brand: IProduct['brand']) => {
        if (typeof brand === 'object' && brand !== null && 'name' in brand) {
          return brand.name;
        }
        return 'Chưa có thương hiệu';
      }
    },
    {
      title: (
        <Space size="middle">
          Danh mục
          <Dropdown
            trigger={['click']}
            dropdownRender={() => (
              <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <Select
                  style={{ width: '200px' }}
                  placeholder="Chọn danh mục"
                  allowClear
                  value={filters.category}
                  onChange={(value) => handleFilterChange(value || '', 'category')}
                >
                  {categories?.map((category: ICategory) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}
          >
            <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
          </Dropdown>
        </Space>
      ),
      dataIndex: "category",
      key: "category",
      render: (category: IProduct['category']) => {
        if (typeof category === 'object' && category !== null && 'name' in category) {
          return category.name;
        }
        return 'Chưa phân loại';
      }
    },
    {
      title: (
        <Space size="middle">
          Giới tính
          <Dropdown
            trigger={['click']}
            dropdownRender={() => (
              <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
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
            )}
          >
            <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
          </Dropdown>
        </Space>
      ),
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => {
        const colors: any = {
          unisex: "green",
          female: "pink",
          male: "blue",
        }
        const genderText = {
          unisex: "UNISEX",
          female: "NỮ",
          male: "NAM"
        }[gender] || gender.toUpperCase();
        return <Tag color={colors[gender] || "default"}>{genderText}</Tag>
      }
    },
    {
      title: (
        <Space size="middle">
          Trạng thái
          <Dropdown
            trigger={['click']}
            dropdownRender={() => (
              <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <Select
                  style={{ width: '200px' }}
                  placeholder="Chọn trạng thái"
                  allowClear
                  value={filters.status}
                  onChange={(value) => handleFilterChange(value || '', 'status')}
                >
                  <Select.Option value="inStock">Còn hàng</Select.Option>
                  <Select.Option value="outOfStock">Hết hàng</Select.Option>
                </Select>
              </div>
            )}
          >
            <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
          </Dropdown>
        </Space>
      ),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === 'inStock' ? 'success' : 'error';
        return <Tag color={color}>{status === 'inStock' ? 'Còn hàng' : 'Hết hàng'}</Tag>
      }
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
          <Link to={`/admin/products/edit/${product._id}`}>
            <Button type="default" icon={<EditOutlined />} />
          </Link>          <Popconfirm
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