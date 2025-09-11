import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAddress, getAllUsers, getProfile, setDefaultAddress, toggleBlockUser, updateProfile } from "../service/userAPI";
import type { IUser } from "../interface/user";
import { message } from "antd";

// Lấy toàn bộ người dùng (chỉ dùng cho admin)
export const useUsers = () => {
    return useQuery<IUser[]>({
        queryKey: ['users'],
        queryFn: getAllUsers,
    });
};

export const useCurrentUser = () => {
    return useQuery<IUser>({
        queryKey: ['me'],
        queryFn: getProfile,
    });
};

// Cập nhật thông tin người dùng
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            id: string;
            userData: Partial<Omit<IUser, "_id" | "createdAt" | "updatedAt">>;
        }) => updateProfile(data.id, data.userData),
        onSuccess: (_, variables) => {
            // Làm mới danh sách người dùng
            queryClient.invalidateQueries({ queryKey: ['users'] });

            // Làm mới thông tin user hiện tại nếu id vừa cập nhật trùng với user hiện tại
            queryClient.invalidateQueries({ queryKey: ['me'] });

            // Có thể làm mới cache của người dùng cụ thể (nếu bạn dùng useUser(id))
            queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
        },
    });
};

export const useToggleBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; reason?: string }) =>
      toggleBlockUser(data.userId, data.reason),
    onSuccess: (_, variables) => {
      // Làm mới danh sách users
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // Làm mới user cụ thể (nếu có query theo id)
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
    },
  });
};

// Hook đặt địa chỉ mặc định
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => setDefaultAddress(addressId),
    onSuccess: (data) => {
      message.success(data.message || "Đã đặt địa chỉ mặc định");
      // Cập nhật lại profile để đồng bộ danh sách địa chỉ
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || "Lỗi khi đặt địa chỉ mặc định");
    },
  });
};

// Hook xóa địa chỉ giao hàng
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => deleteAddress(addressId),
    onSuccess: (data) => {
      message.success(data.message || "Đã xóa địa chỉ");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || "Lỗi khi xóa địa chỉ");
    },
  });
};
