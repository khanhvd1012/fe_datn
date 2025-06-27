import { useQueryClient } from '@tanstack/react-query';
import { Button, Empty, message, Popconfirm, Skeleton, Table, Tag, Space } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ISize } from '../../../interface/size';
import { useSizes, useDeleteSize } from '../../../hooks/useSizes';
import DrawerSize from '../../../components/drawer/DrawerSize';
import SizeFilter from '../../../components/filter/SizeFilter';

const Sizes = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ISize | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { mutate } = useDeleteSize();
  const { data, isLoading } = useSizes();
  const [filters, setFilters] = useState({
    size: '',
  });

  const filteredData = data?.filter((size: ISize) => {
    if (filters.size && !size.size.toString().includes(filters.size.toString())) {
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

  const showSizeDetails = (size: ISize) => {
    setDrawerLoading(true);
    setSelectedSize(size);
    setIsDrawerVisible(true);
    setTimeout(() => {
      setDrawerLoading(false);
    }, 500);
  };

  const handleDelete = async (id: string) => {
    try {
      mutate(id, {
        onSuccess: () => {
          messageApi.success("Xóa kích thước thành công");
          queryClient.invalidateQueries({
            queryKey: ["sizes"],
          });
        },
        onError: () => messageApi.error("Lỗi khi xóa kích thước"),
      });
    } catch (error) {
      console.error("Lỗi khi xóa kích thước:", error);
    }
  };

  if (isLoading) return <Skeleton active />;
  if (!data) return <Empty />;

  const columns = [
    {
      title: (
        <Space size="middle">
          Kích thước
          <SizeFilter filters={filters} handleFilterChange={handleFilterChange} type="size" />
        </Space>
      ),
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, size: ISize) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showSizeDetails(size)}
          />
          <Link to={`/admin/sizes/edit/${size._id}`}>
            <Button type="default" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xóa kích thước"
            description="Bạn có chắc chắn muốn xóa kích thước này?"
            onConfirm={() => handleDelete(size._id!)}
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
        <Link to="/admin/sizes/add">
          <Button type="primary">Thêm kích thước mới</Button>
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
          showTotal: (total) => `Tổng ${total} kích thước`,
        }}
      />

      <DrawerSize
        visible={isDrawerVisible}
        size={selectedSize}
        loading={drawerLoading}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedSize(null);
        }}
      />
    </div>
  );
};

export default Sizes;