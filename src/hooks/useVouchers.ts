import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getVouchers, 
  getVoucherById, 
  addVoucher, 
  updateVoucher, 
  deleteVoucher 
} from '../service/voucherAPI';
import type { IVoucher } from '../interface/voucher';

export const useVouchers = () => {
  return useQuery({
    queryKey: ['vouchers'],
    queryFn: getVouchers
  });
};

export const useVoucher = (id: string) => {
  return useQuery({
    queryKey: ['voucher', id],
    queryFn: () => getVoucherById(id)
  });
};

export const useAddVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (voucher: IVoucher) => addVoucher(voucher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    }
  });
};

export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; voucher: Partial<Omit<IVoucher, '_id' | 'createdAt' | 'updatedAt'>> }) => {
      return updateVoucher(data.id, data.voucher);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    }
  });
};

export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    }
  });
};
