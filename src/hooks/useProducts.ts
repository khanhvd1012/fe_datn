import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProduct, getById, addProduct, updateProduct, deleteProduct } from '../service/productAPI';
import type { IProduct } from '../interface/product';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProduct
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getById(id),
    enabled: !!id // Only run the query if we have an ID
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (product: IProduct) => addProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string; product: Partial<Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>> }) => 
      updateProduct(data.id, data.product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};
