// src/pages/admin/Banners.tsx

import { useState } from 'react';
import {
  Button,
  Empty,
  Input,
  message,
  Popconfirm,
  Skeleton,
  Switch,
  Table,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { IBanner } from '../../../interface/banner';
import { useBanners, useDeleteBanner, useToggleBannerStatus } from '../../../hooks/useBanner';

const Banners = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [filters, setFilters] = useState({ title: '' });
  const { mutate: toggleStatus } = useToggleBannerStatus();
  const { data, isLoading } = useBanners();
  const { mutate: deleteBanner } = useDeleteBanner();

  const handleFilterChange = (value: string, type: 'title') => {
    setFilters(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const filteredData = (data ?? []).filter((banner: IBanner) => {
    if (filters.title && !banner.title.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleToggleStatus = (id: string) => {
    toggleStatus(id, {
      onSuccess: () => {
        messageApi.success('Cập nhật trạng thái thành công');
      },
      onError: () => {
        messageApi.error('Lỗi khi cập nhật trạng thái');
      }
    });
  };

  const handleDelete = (id: string) => {
    deleteBanner(id, {
      onSuccess: () => {
        messageApi.success('Xóa banner thành công');
        queryClient.invalidateQueries({ queryKey: ['banners'] });
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || 'Lỗi khi xóa banner';
        messageApi.error(msg);
      }
    });
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm tiêu đề banner"
            value={filters.title}
            onChange={(e) => handleFilterChange(e.target.value, 'title')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.title ? '#1890ff' : undefined }} />,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img src={image} alt="Banner" style={{ width: 80, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_: boolean, banner: IBanner) => (
        <Switch
          checked={banner.status}
          onChange={() => handleToggleStatus(banner._id)}
          checkedChildren="Hiện"
          unCheckedChildren="Ẩn"
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, banner: IBanner) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/admin/banners/edit/${banner._id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xóa Banner"
            description="Bạn có chắc chắn muốn xóa banner này?"
            onConfirm={() => handleDelete(banner._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (isLoading) return <Skeleton active />;
  if (!data) return <Empty />;

  return (
    <div>
      {contextHolder}
      <div style={{ marginBottom: 16 }}>
        <Link to="/admin/banners/create">
          <Button type="primary">Thêm Banner</Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{
          total: filteredData.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} banner`,
        }}
      />
    </div>
  );
};

export default Banners;
