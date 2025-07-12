import { Table, Button, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Blogs = () => {
  // Dữ liệu giả
  const data = [
    {
      key: '1',
      title: 'Giày sneaker mới ra mắt',
      author: 'Admin',
      status: 'active',
      createdAt: '2025-07-12',
    },
    {
      key: '2',
      title: 'Cách bảo quản giày thể thao',
      author: 'Admin',
      status: 'inactive',
      createdAt: '2025-06-25',
    },
  ];

  // Cột của bảng
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'volcano'}>
          {status === 'active' ? 'Hiển thị' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Link to={`/admin/blogs/edit/${record.key}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Button danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Quản lý Blog</h2>
        <Link to="/admin/blogs/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm Blog
          </Button>
        </Link>
      </div>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default Blogs;
