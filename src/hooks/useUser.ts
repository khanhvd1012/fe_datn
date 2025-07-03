import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, getProfile, updateProfile } from "../service/userAPI";
import type { IUser } from "../interface/user";

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

