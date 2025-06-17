import { useQueryClient } from '@tanstack/react-query';
import { Button, Empty, Input, message, Popconfirm, Select, Skeleton, Space, Table, Tag, Dropdown } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ISize } from '../../../interface/size';
import { useSizes, useDeleteSize } from '../../../hooks/useSizes';
import DrawerSize from '../../../hooks/drawer/DrawerSize';

const Sizes = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ISize | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { mutate } = useDeleteSize();
  const { data, isLoading } = useSizes();
  const [filters, setFilters] = useState({
    name: '',
    value: '',
    status: ''
  });
  const filteredData = data?.sizes?.filter((size: ISize) => {
    if (filters.name && !size.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    if (filters.value && !size.value.toLowerCase().includes(filters.value.toLowerCase())) {
      return false;
    }
    if (filters.status && size.status !== filters.status) {
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
          Tên kích thước
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
      title: (
        <Space size="middle">
          Giá trị
          <Dropdown
            trigger={['click']}
            dropdownRender={() => (
              <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <Input
                  placeholder="Tìm kiếm theo giá trị"
                  value={filters.value}
                  onChange={(e) => handleFilterChange(e.target.value, 'value')}
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
      dataIndex: "value",
      key: "value",
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
                  <Select.Option value="active">Đang hoạt động</Select.Option>
                  <Select.Option value="inactive">Ngừng hoạt động</Select.Option>
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
        const color = status === 'active' ? 'success' : 'error';
        return <Tag color={color}>{status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}</Tag>
      }
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