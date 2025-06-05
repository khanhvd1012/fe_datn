import { useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, Empty, message, Popconfirm, Skeleton, Table, Tag, Typography, Select, Space, Input, Dropdown } from 'antd';
import { useState } from 'react';
import type { IProduct } from '../../../interface/product';
import type { ICategory } from '../../../interface/category';
import type { IBrand } from '../../../interface/brand';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useProducts, useDeleteProduct } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import { useBrands } from '../../../hooks/useBrands';

const { Title } = Typography;

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
      {contextHolder}      <div style={{ marginBottom: 16 }}>
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

      <Drawer
        title={<Title level={4}>{selectedProduct?.name}</Title>}
        placement="right"
        width={600}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedProduct(null);
        }}
        open={isDrawerVisible}
      >
        {drawerLoading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : selectedProduct && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <strong>Hình ảnh:</strong>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  selectedProduct.images.map((image, index) => (
                    <img 
                      key={index} 
                      src={image} 
                      alt={`Sản phẩm ${index + 1}`} 
                      style={{ 
                        width: 120, 
                        height: 120, 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0'
                      }} 
                    />
                  ))
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có ảnh" />
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong>Giá:</strong>
                <p style={{ margin: '8px 0', fontSize: '16px' }}>{selectedProduct.price?.toFixed(2)} đ</p>
              </div>

              <div>
                <strong>Trạng thái:</strong>
                <p style={{ margin: '8px 0' }}>
                  <Tag color={selectedProduct.status === 'inStock' ? 'success' : 'error'}>
                    {selectedProduct.status === 'inStock' ? 'Còn hàng' : 'Hết hàng'}
                  </Tag>
                </p>
              </div>
              
              <div>
                <strong>Thương hiệu:</strong>
                <p style={{ margin: '8px 0' }}>
                  {typeof selectedProduct.brand === 'object' && selectedProduct.brand !== null && 'name' in selectedProduct.brand
                    ? selectedProduct.brand.name
                    : 'Chưa có thương hiệu'}
                </p>
              </div>
              
              <div>
                <strong>Danh mục:</strong>
                <p style={{ margin: '8px 0' }}>
                  {typeof selectedProduct.category === 'object' && selectedProduct.category !== null && 'name' in selectedProduct.category
                    ? selectedProduct.category.name
                    : 'Chưa phân loại'}
                </p>
              </div>

              <div>
                <strong>Giới tính:</strong>
                <p style={{ margin: '8px 0' }}>
                  <Tag color={
                    selectedProduct.gender === 'male' ? 'blue' :
                    selectedProduct.gender === 'female' ? 'pink' : 'green'
                  }>
                    {selectedProduct.gender === 'male' ? 'NAM' :
                     selectedProduct.gender === 'female' ? 'NỮ' : 'UNISEX'}
                  </Tag>
                </p>
              </div>
            </div>

            <div>
              <strong>Mô tả:</strong>
              <p style={{ margin: '8px 0', whiteSpace: 'pre-wrap' }}>{selectedProduct.description}</p>
            </div>

            <div>
              <strong>Biến thể:</strong>
              <div style={{ marginTop: '8px' }}>
                {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                  <div style={{ 
                    backgroundColor: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    <pre style={{ margin: 0, fontSize: '13px' }}>
                      {JSON.stringify(selectedProduct.variants, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <Empty description="Không có biến thể" />
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong>Ngày tạo:</strong>
                <p style={{ margin: '8px 0' }}>
                  {new Date(selectedProduct.createdAt!).toLocaleString()}
                </p>
              </div>

              <div>
                <strong>Cập nhật lần cuối:</strong>
                <p style={{ margin: '8px 0' }}>
                  {new Date(selectedProduct.updatedAt!).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Products;