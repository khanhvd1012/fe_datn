import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrands, getBrandById, createBrand, updateBrand, deleteBrand } from '../service/brandAPI';
import type { IBrand } from '../interface/brand';

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: getBrands
  });
};

export const useBrand = (id: string) => {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: () => getBrandById(id)
  });
};

export const useAddBrand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (brand: IBrand) => createBrand(brand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string; brand: Partial<Omit<IBrand, '_id' | 'createdAt' | 'updatedAt'>> }) => 
      updateBrand(data.id, data.brand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });
};
