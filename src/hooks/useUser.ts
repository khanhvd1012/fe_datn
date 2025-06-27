import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, updateProfile } from "../service/userAPI";
import type { IUser } from "../interface/user";
import { getProductById } from "../service/productAPI";


// Lấy thông tin người dùng hiện tại
export const useUsers = () => {
    return useQuery<IUser[]>({
        queryKey: ['users'],
        queryFn: getAllUsers
    });
};


export const useUser = (id: string) => {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => getProductById(id),
        enabled: !!id
    });
};

// Cập nhật thông tin người dùng
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { id: string; userData: Partial<Omit<IUser, "_id" | "createdAt" | "updatedAt">>; }) => updateProfile(data.id, data.userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
};
