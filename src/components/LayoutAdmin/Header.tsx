import { Avatar, Badge, List, Popover, Space, Typography, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../css/style';
import { useCurrentUser } from '../../hooks/useUser';
import {
  useNotifications,
  useLowStockNotifications,
  useMarkNotificationAsRead,
} from '../../hooks/useNotification';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';

const { Text } = Typography;

const Headers = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useCurrentUser();
  const { data: notis } = useNotifications();
  const { data: lowStockNotis } = useLowStockNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const unreadCount = (notis || []).filter((n) => !n.read).length;

  // chuyển sang dạng "10+"
  const displayUnreadCount = unreadCount > 10 ? '10+' : unreadCount;

  const allNotis = [...(lowStockNotis || []), ...(notis || [])]
    .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
    .slice(0, 5);

  const handleLogout = () => {
    localStorage.clear();
    queryClient.removeQueries();
    navigate('/');
  };

  const [visible, setVisible] = useState(false);

  const handleNotificationClick = (id: string, read: boolean) => {
    if (!read) markAsRead(id);
    setVisible(false);
    navigate('/admin/notifications');
  };

  const notificationContent = (
    <div style={{ width: 320, maxHeight: 320, overflowY: 'auto' }}>
      {allNotis.length === 0 ? (
        <div style={{ padding: 16 }}>Không có thông báo</div>
      ) : (
        <List
          dataSource={allNotis}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: 'pointer', backgroundColor: item.read ? '#fff' : '#f6f6f6' }}
              onClick={() => handleNotificationClick(item._id, item.read)}
            >
              <List.Item.Meta
                title={<Text strong>{item.title}</Text>}
                description={
                  <>
                    <div>{item.message}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {dayjs(item.createdAt).format('HH:mm DD/MM/YYYY')}
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

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
      <Link to="/">
        <Logo>
          SNEAKER<span>TREND</span>
        </Logo>
      </Link>

      <Space>
        <Popover
          content={notificationContent}
          trigger="click"
          placement="bottomRight"
          open={visible}
          onOpenChange={(open) => setVisible(open)}
        >
          <Badge
            count={displayUnreadCount}
            offset={[-4, 4]}
            style={{
              borderRadius: '50%',
              minWidth: 15,
              height: 15,
              lineHeight: '15px',
              textAlign: 'center',
              padding: 0,
              fontSize: 9,
            }}
          >
            <BellOutlined
              style={{ padding: 10 }}
              onClick={() => setVisible(!visible)}
            />
          </Badge>
        </Popover>

        <Popover
          content={
            <div onClick={handleLogout} style={{ cursor: 'pointer', padding: 10, color: 'red' }}>
              Đăng xuất
            </div>
          }
          trigger="click"
          placement="bottomRight"
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar
              size="large"
              icon={!user?.image && <UserOutlined />}
              src={user?.image}
            />
            <span style={{ marginLeft: 8, fontWeight: 500 }}>
              {isLoading ? 'Đang tải...' : user?.username || 'Người dùng'}
            </span>
          </Space>
        </Popover>
      </Space>
    </Header>
  );
};

export default Headers;
