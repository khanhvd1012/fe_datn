import React, { useEffect } from 'react';
import styles from '../css/NotificationPopup.module.css';
import { CloseOutlined } from '@ant-design/icons';
import type { INotification } from '../../interface/notification';
import { useMarkNotificationAsRead } from '../../hooks/useNotification';


interface Props {
  onClose: () => void;
  notifications: INotification[];
   wrapperRef: React.RefObject<HTMLDivElement | null>
}

const NotificationPopup: React.FC<Props> = ({ onClose, notifications, wrapperRef }) => {
  const markAsRead = useMarkNotificationAsRead();

  // ✅ Đánh dấu là đã đọc khi popup mở
  useEffect(() => {
    notifications.forEach((n) => {
      if (!n.read) {
        markAsRead.mutate(n._id);
      }
    });
  }, [notifications]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>🔔 Thông báo</span>
        <CloseOutlined onClick={onClose} className={styles.closeIcon} />
      </div>

      {notifications.length === 0 ? (
        <div className={styles.empty}>Không có thông báo</div>
      ) : (
        <ul className={styles.list}>
          {notifications.map((note) => (
            <li
              key={note._id}
              className={`${styles.item} ${note.read ? styles.read : ''}`}
            >
              <div className={styles.itemTitle}>{note.title}</div>
              <div className={styles.itemMessage}>{note.message}</div>
              <div className={styles.itemTime}>
                {new Date(note.createdAt).toLocaleString('vi-VN')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPopup;
