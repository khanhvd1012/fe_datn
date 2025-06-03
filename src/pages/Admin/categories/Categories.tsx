import { useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, Empty, message, Popconfirm, Skeleton, Table, Typography } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ICategory } from '../../../interface/category';
import { useCategories, useDeleteCategory } from '../../../hooks/useCategories';

const { Title } = Typography;

const Categories = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { mutate } = useDeleteCategory();
  const { data, isLoading } = useCategories();

  const handleDelete = async (id: string) => {
    try {
      mutate(id, {
        onSuccess: () => {
          messageApi.success("Xóa danh mục thành công");
          queryClient.invalidateQueries({
            queryKey: ["categories"],
          });
        },
        onError: () => messageApi.error("Lỗi khi xóa danh mục"),
      });
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const showCategoryDetails = (category: ICategory) => {
    setDrawerLoading(true);
    setSelectedCategory(category);
    setIsDrawerVisible(true);
    setTimeout(() => {
      setDrawerLoading(false);
    }, 500);
  };

  if (isLoading) return <Skeleton active />;
  if (!data) return <Empty />;

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Logo",
      dataIndex: "logo_image",
      key: "logo_image",
      render: (logo: string) => (
        <img src={logo} alt="Logo danh mục" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "products",
      key: "products",
      render: (products: string[]) => products?.length || 0,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, category: ICategory) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showCategoryDetails(category)}
          />
          <Link to={`/admin/categories/edit/${category._id}`}>
            <Button type="default" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(category._id!)}
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
        <Link to="/admin/categories/create">
          <Button type="primary">Thêm danh mục</Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        pagination={{
          total: data.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} danh mục`,
        }}
      />

      <Drawer
        title={<Title level={4}>{selectedCategory?.name}</Title>}
        placement="right"
        width={500}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedCategory(null);
        }}
        open={isDrawerVisible}
      >
        {drawerLoading ? (
          <Skeleton active />
        ) : selectedCategory && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <strong>Mô tả:</strong>
              <p>{selectedCategory.description}</p>
            </div>

            <div>
              <strong>Logo:</strong>
              <div style={{ marginTop: '8px' }}>
                <img
                  src={selectedCategory.logo_image}
                  alt={selectedCategory.name}
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                />
              </div>
            </div>

            <div>
              <strong>Sản phẩm:</strong>
              <p>{selectedCategory.products?.length || 0} sản phẩm trong danh mục này</p>
            </div>

            <div>
              <strong>Ngày tạo:</strong>
              <p>{new Date(selectedCategory.createdAt!).toLocaleDateString()}</p>
            </div>

            <div>
              <strong>Cập nhật lần cuối:</strong>
              <p>{new Date(selectedCategory.updatedAt!).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Categories;