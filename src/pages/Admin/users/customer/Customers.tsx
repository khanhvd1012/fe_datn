import { Button, Empty, message, Skeleton, Table, Tag } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { IUser } from '../../../../interface/user';
import { useUsers } from '../../../../hooks/useUser';
import DrawerUser from "../../../../components/LayoutAdmin/drawer/DrawerUser";

const Customers = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { data, isLoading } = useUsers();
  console.log("User data:", data);

  const showUserDetails = (user: IUser) => {
    setDrawerLoading(true);
    setSelectedUser(user);
    setIsDrawerVisible(true);
    setTimeout(() => {
      setDrawerLoading(false);
    }, 500);
  };

  if (isLoading) return <Skeleton active />;
  if (!data) return <Empty />;

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
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
          <Link to={`/admin/users/customers/edit/${user._id}`}>
            <Button type="default" icon={<EditOutlined />} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}

      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? data.filter(user => user.role === "user") : []}
        rowKey="_id"
        pagination={{
          total: Array.isArray(data) ? data.filter(user => user.role === "user").length : 0,
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