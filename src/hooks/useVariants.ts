import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addVariant, deleteVariant, getVariantById, getVariants, updateVariant } from "../service/variantAPI";
import type { IVariant } from "../interface/variant";

export const useVariants = () => {
  return useQuery<IVariant[]>({
    queryKey: ['variants'],
    queryFn: getVariants
  });
};

export const useVariant = (id: string) => {
  return useQuery({
    queryKey: ['variants', id],
    queryFn: () => getVariantById(id),
    enabled: !!id 
  });
};

export const useAddVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => addVariant(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants'] });
    }
  });
};

export const useUpdateVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; variant: FormData}) =>
      updateVariant(data.id, data.variant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants'] });
    }
  });
};

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVariant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants'] });
    }
  });
};