import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, getCategoryById, addCategory, updateCategory, deleteCategory } from '../service/categoryAPI';
import type { ICategory } from '../interface/category';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id)
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (category: ICategory) => addCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string; category: Partial<Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>> }) => 
      updateCategory(data.id, data.category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};
