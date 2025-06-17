import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSizes, getSizeById, addSize, updateSize, deleteSize } from '../service/sizeAPI';
import type { ISize } from '../interface/size';

export const useSizes = () => {
    return useQuery<{ message: string; sizes: ISize[] }>({
        queryKey: ['sizes'],
        queryFn: getSizes
    });
};

export const useSize = (id: string) => {
    return useQuery({
        queryKey: ['size', id],
        queryFn: () => getSizeById(id),
        enabled: !!id // Only run the query if we have an ID
    });
};

export const useAddSize = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (size: ISize) => addSize(size),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sizes'] });
        }
    });
};

export const useUpdateSize = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: { id: string; size: Partial<Omit<ISize, '_id' | 'createdAt' | 'updatedAt'>> }) => 
            updateSize(data.id, data.size),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sizes'] });
        }
    });
};

export const useDeleteSize = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => deleteSize(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sizes'] });
        }
    });
};
