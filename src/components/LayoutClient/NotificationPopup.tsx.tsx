import React from 'react';
import styles from '../css/NotificationPopup.module.css';

interface Props {
  onClose: () => void;
  notifications: string[];
}

const NotificationPopup: React.FC<Props> = ({ onClose, notifications }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>🔔 Thông báo</div>
      <ul className={styles.list}>
        {notifications?.map((note, idx) => (
          <li key={idx} className={styles.item}>{note}</li>
        ))}
      </ul>
      <div className={styles.closeBtn} onClick={onClose}>
        Đóng
      </div>
    </div>
  );
};

export default NotificationPopup;
