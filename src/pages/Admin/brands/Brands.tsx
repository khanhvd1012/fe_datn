import { useState } from 'react';
import { Button, Empty, message, Popconfirm, Skeleton, Table } from 'antd';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import type { IBrand } from '../../../interface/brand';
import { useBrands, useDeleteBrand } from '../../../hooks/useBrands';
import DrawerBrand from '../../../components/drawer/DrawerBrand';

const Brands = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { mutate } = useDeleteBrand();
  const { data, isLoading } = useBrands();

  const handleDelete = async (id: string) => {
    try {
      mutate(id, {
        onSuccess: () => {
          messageApi.success("Xóa thương hiệu thành công");
          queryClient.invalidateQueries({
            queryKey: ["brands"],
          });
        },
        onError: (error: any) => {
          if (error?.response?.data?.message) {
            messageApi.error(error.response.data.message);
          } else {
            messageApi.error("Lỗi khi xóa thương hiệu");
          }
        },
      });
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  const showBrandDetails = (brand: IBrand) => {
    setDrawerLoading(true);
    setSelectedBrand(brand);
    setIsDrawerVisible(true);
    setTimeout(() => {
      setDrawerLoading(false);
    }, 500);
  };

  if (isLoading) return <Skeleton active />;
  if (!data) return <Empty />;

  const columns = [
    {
      title: "Tên thương hiệu",
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
        <img src={logo} alt="Logo thương hiệu" style={{ width: 50, height: 50, objectFit: 'cover' }} />
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
      render: (_: any, brand: IBrand) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showBrandDetails(brand)}
          />
          <Link to={`/admin/brands/edit/${brand._id}`}>
            <Button type="default" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xóa Thương Hiệu"
            description="Bạn có chắc chắn muốn xóa thương hiệu này?"
            onConfirm={() => handleDelete(brand._id!)}
            okText="Có"
            cancelText="Không"
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
        <Link to="/admin/brands/create">
          <Button type="primary">Thêm Thương Hiệu</Button>
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
          showTotal: (total) => `Tổng ${total} thương hiệu`,
        }}
      />

      <DrawerBrand
        visible={isDrawerVisible}
        brand={selectedBrand} 
        loading={drawerLoading}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedBrand(null); 
        }}
      />
    </div>
  );
};

export default Brands;