import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, Empty, message, Popconfirm, Skeleton, Table, Tag, Typography } from 'antd';
import { useState } from 'react';
import type { IProduct } from '../../../interface/product';
import { deleteProduct, getProduct } from '../../../service/productAPI';
import { Link } from 'react-router-dom';
import { DeleteOutlined, DoubleLeftOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Products = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { mutate } = useMutation({
    mutationFn: async (id: string) => await deleteProduct(id),
  });
  const { data, isLoading, error } = useQuery<IProduct[]>({
    queryKey: ["products"],
    queryFn: async () => await getProduct(),
  });
  if (isLoading) return <Skeleton active />;
  if (!data) return <div><Empty /></div>;
  if (error) return <div>Error</div>;

  const handleDelete = async (id: string) => {
    try {
      mutate(id, {
        onSuccess: () => {
          messageApi.success("Deleted successfully", 2);
          queryClient.invalidateQueries({
            queryKey: ["products"],
          });
        },
        onError: () => messageApi.error("Error deleting"),
      });
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };
  const dataSource = data.map((product: IProduct) => {
    return {
      ...product,
      key: product._id,
    };
  });

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => {
        const colors: any = {
          unisex: "green",
          female: "pink",
          male: "blue",
        }
        return <Tag color={colors[gender] || "default"}>{gender.toUpperCase()}</Tag>
      }
    },
    { title: "Variants", dataIndex: "variants", key: "variants" },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: unknown, product: IProduct) => {
        return (
          <div>
            <Link to={`/admin/products/edit/${product._id}`}>
              <Button type="primary" icon={<EditOutlined />} />
            </Link>
            <Button
              type="dashed"
              icon={<DoubleLeftOutlined />}
              onClick={() => {
                showProductDetails(product);
              }}
              style={{ margin: '0 8px' }}
            />
            <Popconfirm
              title="Delete"
              description="Are you sure to delete this?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(product._id!)}
            >
              <Button type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        );
      },
    },
  ]

  const showProductDetails = (product: IProduct) => {
    setDrawerLoading(true);
    setSelectedProduct(product);
    setIsDrawerVisible(true);
    // Simulate loading for better UX
    setTimeout(() => {
      setDrawerLoading(false);
    }, 500);
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }}>
        <Link to="/admin/products/create">Create Product</Link>
      </Button>
      <Table 
        dataSource={dataSource} 
        columns={columns} 
        pagination={{
          total: data.length,
          pageSize: 6,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} sản phẩm`,
          pageSizeOptions: ['6', '12', '24', '36']
        }}
        scroll={{ x: 1000 }}
      />
      {contextHolder}
      <Drawer
        title={<Title level={4}>Chi tiết sản phẩm</Title>}
        open={isDrawerVisible}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedProduct(null);
        }}
        width={400}
        headerStyle={{ borderBottom: '1px solid #f0f0f0' }}
      >
        {drawerLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <Skeleton active />
          </div>
        ) : (
          selectedProduct && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Tên sản phẩm:</div>
                <div>{selectedProduct.name}</div>
              </div>

              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Mô tả:</div>
                <div>{selectedProduct.description}</div>
              </div>

              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Thương hiệu:</div>
                <div>{selectedProduct.brand}</div>
              </div>

              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Danh mục:</div>
                <div>{selectedProduct.category}</div>
              </div>

              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Giới tính:</div>
                <Tag color={
                  selectedProduct.gender === 'male' ? 'blue' :
                    selectedProduct.gender === 'female' ? 'pink' : 'green'
                }>
                  {selectedProduct.gender.toUpperCase()}
                </Tag>
              </div>

              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Biến thể:</div>
                <pre style={{
                  backgroundColor: '#f5f5f5',
                  padding: '8px',
                  borderRadius: '4px',
                  margin: '0',
                  fontSize: '13px'
                }}>
                  {JSON.stringify(selectedProduct.variants, null, 2)}
                </pre>
              </div>
            </div>
          )
        )}
      </Drawer>
    </div>
  )
}

export default Products