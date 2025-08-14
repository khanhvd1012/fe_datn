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
import { useEffect } from 'react';
import { io } from 'socket.io-client';

// Hàm tiện ích để invalidate cả 2 loại thông báo
const invalidateAllNotifications = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ['notifications'] });
  queryClient.invalidateQueries({ queryKey: ['notifications', 'low-stock'] });
};

export const useNotifications = () =>
  useQuery<INotification[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchInterval: 5000, 
  });

export const useLowStockNotifications = () =>
  useQuery<INotification[]>({
    queryKey: ['notifications', 'low-stock'],
    queryFn: getLowStockNotifications,
    select: (data) => data ?? [],
    refetchInterval: 5000, 
  });

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      invalidateAllNotifications(queryClient);
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      invalidateAllNotifications(queryClient);
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      invalidateAllNotifications(queryClient);
    },
  });
};

export const useDeleteAllReadNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllReadNotifications,
    onSuccess: () => {
      invalidateAllNotifications(queryClient);
    },
  });
};

export const useNotificationSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
    });
    socket.on('new-notification', () => {
      invalidateAllNotifications(queryClient);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
};
