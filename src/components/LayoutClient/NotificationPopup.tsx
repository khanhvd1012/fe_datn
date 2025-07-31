import React, { useEffect } from 'react';
import {
  CheckCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button, Spin } from 'antd';
import styles from '../css/NotificationPopup.module.css';
import {
  useMarkNotificationAsRead,
  useDeleteAllReadNotifications,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useNotifications,
} from '../../hooks/useNotification';

interface NotificationPopupProps {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

const NotificationPopup = ({
  wrapperRef,
  onClose,
}: NotificationPopupProps) => {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteAllRead = useDeleteAllReadNotifications();
  const deleteNotification = useDeleteNotification();

  useEffect(() => {
    if (notifications) {
      notifications.forEach((n) => {
        if (!n.read) {
          markAsRead.mutate(n._id);
        }
      });
    }
  }, [notifications]);

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>Thông báo</span>
        <CloseOutlined onClick={onClose} className={styles.closeIcon} />
      </div>

      <div className={styles.actions}>
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={() => markAllAsRead.mutate()}
          disabled={markAllAsRead.isPending || unreadCount === 0}
          loading={markAllAsRead.isPending}
          className={styles.button}
        />

        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteAllRead.mutate()}
          disabled={deleteAllRead.isPending}
          loading={deleteAllRead.isPending}
          className={styles.button}
        />
      </div>

      {isLoading ? (
        <div className={styles.loading}><Spin /></div>
      ) : notifications.length === 0 ? (
        <div className={styles.empty}>Không có thông báo</div>
      ) : (
        <ul className={styles.list}>
          {notifications.map((note) => (
            <li
              key={note._id}
              className={`${styles.item} ${note.read ? styles.read : ''}`}
            >
              <div className={styles.itemContent}>
                <div className={styles.itemText}>
                  <div className={styles.itemTitle}>{note.title}</div>
                  <div className={styles.itemMessage}>{note.message}</div>
                  <div className={styles.itemTime}>
                    {new Date(note.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>

                <div className={styles.itemActions}>
                  {!note.read && (
                    <CheckCircleOutlined
                      className={styles.icon}
                      title="Đánh dấu đã đọc"
                      onClick={() => markAsRead.mutate(note._id)}
                    />
                  )}
                  <DeleteOutlined
                    className={styles.icon}
                    title="Xoá thông báo"
                    onClick={() => deleteNotification.mutate(note._id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPopup;
