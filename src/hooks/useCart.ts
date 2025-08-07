import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ICart } from '../interface/cart';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../service/cartAPI';
import { message } from 'antd';

// Lấy toàn bộ giỏ hàng
export const useCart = () => {
  return useQuery<ICart>({
    queryKey: ['cart'],
    queryFn: getCart
  });
};

// Thêm sản phẩm vào giỏ hàng
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: { variant_id: string; quantity: number }) => addToCart(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      message.success('Đã thêm vào giỏ hàng');
    }
  });
};

// Cập nhật số lượng sản phẩm
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { variant_id: string; quantity: number }) =>
      updateCartItem(data.variant_id, data.quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },

    onError: (error: any) => {
      if (error?.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Cập nhật giỏ hàng thất bại');
      }
    }
  });
};

// Xóa sản phẩm khỏi giỏ hàng
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: {
      _id: string;
      variant_id: { product_id?: { slug?: string } };
    }) => removeFromCart(item._id),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      message.success('Đã xóa sản phẩm khỏi giỏ hàng');
    }
  });
};
