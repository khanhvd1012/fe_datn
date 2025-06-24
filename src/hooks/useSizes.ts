import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSizeById, addSize, updateSize, deleteSize, getSizes } from '../service/sizeAPI';
import type { ISize } from '../interface/size';

export const useSizes = () => {
    return useQuery<ISize[]>({
        queryKey: ['sizes'],
        queryFn: async () => {
            const res = await getSizes();
            return res.sizes; 
        }
    });
};


export const useSize = (id: string) => {
    return useQuery({
        queryKey: ['sizes', id],
        queryFn: () => getSizeById(id),
        enabled: !!id //
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
