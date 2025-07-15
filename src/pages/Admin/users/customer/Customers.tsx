import { Button, Empty, Input, message, Skeleton, Table, Tag } from "antd";
import { useState } from "react";
import { EyeOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import type { IUser } from '../../../../interface/user';
import { useUsers } from '../../../../hooks/useUser';
import DrawerUser from "../../../../components/LayoutAdmin/drawer/DrawerUser";

const Customers = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { data: user, isLoading } = useUsers();
  const [filters, setFilters] = useState({
    username: '',
    email: ''
  });

  const customers = user?.filter((u) => u.role === "user") || [];

  const filteredData = customers.filter((u) => {
    if (filters.username && !u.username.toLowerCase().includes(filters.username.toLowerCase())) {
      return false;
    }
    if (filters.email && !u.email.toLowerCase().includes(filters.email.toLowerCase())) {
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

  const showUserDetails = (user: IUser) => {
    setDrawerLoading(true);
    setSelectedUser(user);
    setIsDrawerVisible(true);
    setTimeout(() => {
      setDrawerLoading(false);
    }, 500);
  };

  if (isLoading) return <Skeleton active />;
  if (!user) return <Empty />;

  const columns = [
    {
      title: "ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm tên người dùng"
            value={filters.username}
            onChange={(e) => handleFilterChange(e.target.value, 'username')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.username ? '#1890ff' : undefined }} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm email"
            value={filters.email}
            onChange={(e) => handleFilterChange(e.target.value, 'email')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.email ? '#1890ff' : undefined }} />,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        let color = "default";
        let label = "";

        switch (role) {
          case "user":
            color = "blue";
            label = "user";
            break;
          case "employee":
            color = "magenta";
            label = "employee";
            break;
          case "admin":
            color = "green";
            label = "admin";
            break;
          default:
            color = "gray";
            label = "Không rõ";
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, user: IUser) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showUserDetails(user)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{
          total: filteredData.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} người dùng`,
        }}
      />

      <DrawerUser
        visible={isDrawerVisible}
        user={selectedUser}
        loading={drawerLoading}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}

export default Customers