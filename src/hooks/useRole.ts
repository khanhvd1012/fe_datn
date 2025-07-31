import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchRoles,
  changeUserRole,
  getUsersByRole,
} from "../service/roleAPI";

// Lấy danh sách vai trò
export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });
};

// Cập nhật vai trò người dùng
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Lấy danh sách người dùng theo role
export const useUsersByRole = (role: string) => {
  return useQuery({
    queryKey: ["users", role],
    queryFn: () => getUsersByRole(role),
    enabled: !!role, // tránh gọi khi role chưa có
  });
};
