import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColor, deleteColor, getColorById, getColors, updateColor } from '../service/colorAPI';
import type { IColor } from '../interface/color';

export const useColors = () => {
  return useQuery({
    queryKey: ['colors'],
    queryFn: getColors
  });
};

export const useColor = (id: string) => {
  return useQuery({
    queryKey: ['color', id],
    queryFn: () => getColorById(id)
  });
};

export const useAddColor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (color: Omit<IColor, '_id' | 'createdAt' | 'updatedAt'>) => createColor(color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    }
  });
};

export const useUpdateColor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string; color: Partial<Omit<IColor, '_id' | 'createdAt' | 'updatedAt'>> }) => 
      updateColor(data.id, data.color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    }
  });
};

export const useDeleteColor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteColor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    }
  });
};
