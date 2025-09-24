import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { IOrder } from '../interface/order';
import {
  getUserOrders,           // của USER
  getAllOrders,        // của ADMIN
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from '../service/orderAPI';


export const useUserOrders = () => {
  return useQuery({
    queryKey: ['user-orders'],
    queryFn: getUserOrders,
  });
};

// ADMIN - Lấy tất cả đơn hàng
export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: getAllOrders,
  });
};


// Lấy chi tiết đơn hàng theo ID
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order-detail', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

// Tạo đơn hàng mới
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: Partial<IOrder>) => createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
  });
};

type UpdateOrderStatusInput =
  | { id: string; status: IOrder["status"]; reject_reason?: string } 
  | { id: string; formData: FormData };            

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrderStatusInput) => {
      // Nếu có formData thì gửi multipart
      if ("formData" in data) {
        return updateOrderStatus(data.id, data.formData);
      }
      // Nếu chỉ có status thì gửi JSON
      return updateOrderStatus(data.id, { status: data.status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
};

// Hủy đơn hàng (admin hoặc user)
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
