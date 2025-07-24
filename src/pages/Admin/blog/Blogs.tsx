import { useState } from 'react';
import { Button, Empty, Input, message, Popconfirm, Skeleton, Table } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { IBlogs } from '../../../interface/blogs';
import { useDeleteNews, useGetNews } from '../../../hooks/useBlogs';
import DrawerBlogs from '../../../components/LayoutAdmin/drawer/DrawerBlogs';

const Blogs = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<IBlogs | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [filters, setFilters] = useState({ title: '' });

  const { data, isLoading } = useGetNews();
  const { mutate } = useDeleteNews();

  const handleFilterChange = (value: string, type: 'title') => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const filteredData = (data ?? []).filter((news: IBlogs) => {
    if (filters.title && !news.title.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleDelete = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        messageApi.success("Xoá tin tức thành công");
        queryClient.invalidateQueries({ queryKey: ["news"] });
      },
      onError: (err: any) => {
        messageApi.error(err?.response?.data?.message || "Lỗi khi xoá tin tức");
      },
    });
  };

  const showNewsDetails = (news: IBlogs) => {
    setDrawerLoading(true);
    setSelectedNews(news);
    setIsDrawerVisible(true);
    setTimeout(() => {
      setDrawerLoading(false);
    }, 500);
  };

  if (isLoading) return <Skeleton active />;
  if (!data) return <Empty />;

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm tiêu đề"
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
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      render: (author: any) => author?.username || 'Ẩn danh',
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, news: IBlogs) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => showNewsDetails(news)} />
          <Link to={`/admin/blogs/edit/${news._id}`}>
            <Button type="default" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xóa Tin Tức"
            description="Bạn có chắc chắn muốn xóa tin tức này?"
            onConfirm={() => handleDelete(news._id!)}
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
        <Link to="/admin/blogs/create">
          <Button type="primary">Thêm Blogs</Button>
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
          showTotal: (total) => `Tổng ${total} tin tức`,
        }}
      />

      <DrawerBlogs
        visible={isDrawerVisible}
        news={selectedNews}
        loading={drawerLoading}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedNews(null);
        }}
      />
    </div>
  );
};

export default Blogs;
