import { Avatar, Dropdown, Space, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../css/style';


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
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Logo bên trái */}
      <Link to={"/"}>
        <Logo>
          SNEAKER<span>TREND</span>
        </Logo>
      </Link>
      
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
