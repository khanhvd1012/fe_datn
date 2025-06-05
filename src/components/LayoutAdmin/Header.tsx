import { Avatar, Dropdown, Space, theme } from 'antd';
import { Header } from 'antd/es/layout/layout'
import { UserOutlined } from '@ant-design/icons';

const Headers = () => {
    const {token: { colorBgContainer }} = theme.useToken();

    // Data mẫu cho người dùng
    const user = {
        name: "Admin User",
        avatar: null, // Nếu không có avatar thì sẽ hiển thị icon mặc định
        role: "Administrator"
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
        },
    ];

    return (
        <Header style={{ 
            padding: '0 24px', 
            background: colorBgContainer, 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center' 
        }}>
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
    )
}

export default Headers