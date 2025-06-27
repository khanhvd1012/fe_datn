import { Avatar, Dropdown, Space, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../LayoutClient/style';


const Headers = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const user = {
    name: 'Admin User',
    avatar: null,
    role: 'Administrator',
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const items = [
    {
      key: '1',
      label: 'Thông tin cá nhân',
    },
    {
      key: '2',
      label: 'Đổi mật khẩu',
    },
    {
      key: '3',
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        padding: '0 24px',
        background: colorBgContainer,
        display: 'flex',
        justifyContent: 'space-between', // 👉 chia trái (logo) và phải (avatar)
        alignItems: 'center',
      }}
    >
      {/* Logo bên trái */}
      <Logo>
               SNEAKER<span>TREND</span>
      </Logo>

      {/* Avatar dropdown bên phải */}
      <Dropdown menu={{ items }} placement="bottomRight">
        <Space style={{ cursor: 'pointer' }}>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={user.avatar}
            style={{ backgroundColor: '#1890ff' }}
          />
          <span style={{ marginLeft: 8 }}>{user.name}</span>
        </Space>
      </Dropdown>
    </Header>
  );
};

export default Headers;
