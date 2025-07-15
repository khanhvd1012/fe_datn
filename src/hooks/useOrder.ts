import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { IOrder } from '../interface/order';
import {
  getUserOrders,           // của USER
  getAllOrders,        // của ADMIN
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder
} from '../service/orderAPI';

type OrderStatus = NonNullable<IOrder['status']>;

// ✅ USER - Lấy đơn hàng của chính họ
export const useUserOrders = () => {
  return useQuery({
    queryKey: ['user-orders'],
    queryFn: getUserOrders,
  });
};

// ✅ ADMIN - Lấy tất cả đơn hàng
export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: getAllOrders,
  });
};


// ✅ Lấy chi tiết đơn hàng theo ID
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order-detail', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

// ✅ Tạo đơn hàng mới
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: Partial<IOrder>) => createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
  });
};

// ✅ Cập nhật trạng thái đơn hàng (admin)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; status: OrderStatus }) =>
      updateOrderStatus(data.id, data.status),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-detail', data.id] });
    },
  });
};

// ✅ Hủy đơn hàng (admin hoặc user)
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; cancel_reason: string }) =>
      cancelOrder(data.id, data.cancel_reason),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-detail', data.id] });
    },
  });
};
