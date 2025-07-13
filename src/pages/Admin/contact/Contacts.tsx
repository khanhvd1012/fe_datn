import { Table, Button, Space, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

// Dữ liệu mẫu
const contactData = [
  {
    _id: '1',
    name: 'Nguyễn Văn A',
    email: 'vana@example.com',
    phone: '0987654321',
    message: 'Tôi muốn biết thêm về sản phẩm.',
    createdAt: '2025-07-12T14:30:00Z',
  },
  {
    _id: '2',
    name: 'Trần Thị B',
    email: 'thib@example.com',
    phone: '0912345678',
    message: 'Tôi cần hỗ trợ đặt hàng.',
    createdAt: '2025-07-11T09:15:00Z',
  },
];

const Contacts = () => {
  const columns: ColumnsType<any> = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => new Date(value).toLocaleString(),
    },
  {
  title: 'Thao tác',
  key: 'actions',
  render: (_, record) => (
    <Space>
      <Button type="link">
        <Link to={`/admin/contacts/${record._id}`}>Chi tiết</Link>
      </Button>
    </Space>
  ),
},

  ];

  return (
    <div>
      <Title level={3}>Danh sách liên hệ</Title>
      <Table
        rowKey="_id"
        dataSource={contactData}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Contacts;
