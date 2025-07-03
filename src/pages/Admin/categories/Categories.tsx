import { useQueryClient } from '@tanstack/react-query';
import { Button, Empty, message, Popconfirm, Skeleton, Table } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ICategory } from '../../../interface/category';
import { useCategories, useDeleteCategory } from '../../../hooks/useCategories';
import DrawerCategory from '../../../components/drawer/DrawerCategory';

const Categories = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { mutate } = useDeleteCategory();
  const { data, isLoading } = useCategories();
  console.log("Categories data:", data);


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
      title: "Hình ảnh",
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
      title: "Số lượng thương hiệu",
      dataIndex: "brand",
      key: "brand",
      render: (brand: any[]) => brand?.length || 0,
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

      <DrawerCategory
        visible={isDrawerVisible}
        category={selectedCategory}
        loading={drawerLoading}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedCategory(null);
        }}
      />
    </div>
  );
};

export default Categories;