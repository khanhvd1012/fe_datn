import {
  List,
  Button,
  Badge,
  Spin,
  message,
  Space,
  Typography,
  Popconfirm,
  Empty,
} from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import {
  useDeleteAllReadNotifications,
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from '../../hooks/useNotification';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const NotificationPopup = () => {
  const { data: allNotifications, isLoading: loadingAll } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: deleteNoti } = useDeleteNotification();
  const { mutate: deleteAllRead } = useDeleteAllReadNotifications();

  const isLoading = loadingAll;

  const list = allNotifications || [];
  const unreadCount = list.filter((n) => !n.read).length;
  const allData = [...list];

  const handleMarkAsRead = (id: string) => {
    markAsRead(id, {
      onSuccess: () => message.success('Đã đánh dấu là đã đọc'),
    });
  };

  const handleDelete = (id: string) => {
    deleteNoti(id, {
      onSuccess: () => message.success('Đã xoá thông báo'),
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => message.success('Đã đánh dấu tất cả là đã đọc'),
    });
  };

  const handleDeleteAllRead = () => {
    deleteAllRead(undefined, {
      onSuccess: () => message.success('Đã xoá tất cả thông báo đã đọc'),
    });
  };


  if (isLoading) return <Spin size="large" />;

  return (
    <div>
      <Title level={3}>Thông báo</Title>
      <Space style={{ marginBottom: 16 }}>
        <Badge count={unreadCount} >
          <Button onClick={handleMarkAllAsRead}>Đánh dấu tất cả đã đọc</Button>
        </Badge>
        <Popconfirm
          title="Bạn có chắc muốn xoá tất cả thông báo đã đọc?"
          onConfirm={handleDeleteAllRead}
          okText="Xoá"
          cancelText="Huỷ"
        >
          <Button danger>Xoá tất cả đã đọc</Button>
        </Popconfirm>
      </Space>

      {allData.length === 0 ? (
        <Empty description="Không có thông báo nào" />
      ) : (
        <List
          bordered
          dataSource={allData}
          pagination={{
            pageSize: 6,
            showSizeChanger: false,
            position: 'bottom',
          }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  size="small"
                  onClick={() => handleMarkAsRead(item._id)}
                  disabled={item.read}
                >
                  {item.read ? (
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  ) : (
                    'Đánh dấu đã đọc'
                  )}
                </Button>,
                <Popconfirm
                  title="Bạn có chắc muốn xoá thông báo này?"
                  onConfirm={() => handleDelete(item._id)}
                  okText="Xoá"
                  cancelText="Huỷ"
                >
                  <Button danger size="small">
                    Xoá
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Badge dot={!item.read}>
                    <Text strong>{item.title}</Text>
                  </Badge>
                }
                description={
                  <>
                    <div>{item.message}</div>
                    <div>
                      <Text type="secondary">
                        {dayjs(item.createdAt).format('HH:mm DD/MM/YYYY')}
                      </Text>
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
};

export default NotificationPopup;
