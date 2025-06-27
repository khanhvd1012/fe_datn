import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IShippingAddress } from "../interface/user";
import { deleteAddress, getShippingAddresses, setDefaultAddress } from "../service/userAPI";

export const useShippingAddresses = () => {
  return useQuery<IShippingAddress[]>({
    queryKey: ["shipping_addresses"],
    queryFn: getShippingAddresses,
  });
};

// Hook: đặt địa chỉ mặc định
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => setDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping_addresses"] });
    }
  });
};

// Hook: xóa địa chỉ giao hàng
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping_addresses"] });
    }
  });
};