import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getLowStockNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllReadNotifications
} from '../service/notificationAPI';
import type { INotification } from '../interface/notification';

// ✅ Lấy tất cả thông báo
export const useNotifications = () =>
  useQuery<INotification[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

// ✅ Lấy thông báo tồn kho thấp
export const useLowStockNotifications = () =>
  useQuery<INotification[]>({
    queryKey: ['notifications', 'low-stock'],
    queryFn: getLowStockNotifications,
  });

// ✅ Đánh dấu 1 thông báo là đã đọc
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// ✅ Đánh dấu tất cả là đã đọc
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// ✅ Xóa 1 thông báo
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// ✅ Xóa tất cả thông báo đã đọc
export const useDeleteAllReadNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllReadNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
