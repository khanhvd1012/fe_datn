import { useState } from 'react';
import { Button, Drawer, Input, Popconfirm, Skeleton, Table, Tag } from 'antd';
import { Link } from 'react-router-dom';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const Banners = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const fakeData = [
    {
      _id: '1',
      title: 'Banner Mùa Hè',
      image: 'https://via.placeholder.com/200x80',
      link: 'https://example.com',
      status: 'active',
    },
    {
      _id: '2',
      title: 'Banner Giảm Giá',
      image: 'https://via.placeholder.com/200x80',
      link: 'https://example.com/sale',
      status: 'inactive',
    },
  ];

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input placeholder="Tìm tiêu đề banner" prefix={<SearchOutlined />} allowClear />
        </div>
      ),
      filterIcon: () => <FilterOutlined />,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (img: string) => (
        <img src={img} alt="Banner" style={{ width: 100, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Liên kết',
      dataIndex: 'link',
      key: 'link',
      render: (link: string) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) =>
        status === 'active' ? <Tag color="green">Hiển thị</Tag> : <Tag color="gray">Ẩn</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => setIsDrawerVisible(true)} />
          <Link to="#">
            <Button type="default" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa banner này?"
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
      <div style={{ marginBottom: 16 }}>
        <Link to="#">
          <Button type="primary">Thêm Banner</Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={fakeData}
        rowKey="_id"
        pagination={{
          total: fakeData.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} banner`,
        }}
      />

      <Drawer
        title="Chi tiết Banner"
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        width={400}
      >
        <Skeleton active />
      </Drawer>
    </div>
  );
};

export default Banners;
