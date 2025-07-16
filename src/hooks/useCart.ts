import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ICart } from '../interface/cart';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../service/cartAPI';

export const useCart = () => {
  return useQuery<ICart>({
    queryKey: ['cart'],
    queryFn: getCart
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: { variant_id: string; quantity: number }) =>
      addToCart(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { variant_id: string; quantity: number }) =>
      updateCartItem(data.variant_id, data.quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: string) => removeFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};
