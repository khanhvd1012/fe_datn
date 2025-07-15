import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { IOrder } from '../interface/order';
import { getOrders, getOrderById, createOrder, updateOrderStatus, cancelOrder , getUserById, getAllOrders } from '../service/orderAPI';


type OrderStatus = NonNullable<IOrder['status']>;

// Lấy tất cả đơn hàng
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrders,
  });
}

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: getUserById,
    });
};


// Lấy chi tiết 1 đơn hàng theo ID
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

// Thêm đơn hàng mới
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: Partial<IOrder>) => createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Cập nhật trạng thái đơn hàng
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; status: OrderStatus }) =>
      updateOrderStatus(data.id, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Hủy đơn hàng
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; cancel_reason: string }) =>
      cancelOrder(data.id, data.cancel_reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
