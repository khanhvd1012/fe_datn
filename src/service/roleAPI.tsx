import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Lấy tất cả vai trò
export const fetchRoles = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// Cập nhật vai trò người dùng
export const changeUserRole = async ({
  userId,
  newRole,
}: {
  userId: string;
  newRole: string;
}) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(
    `${API_URL}/roles/update-user-role`,
    { userId, newRole },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Lấy người dùng theo vai trò
export const getUsersByRole = async (role: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/roles/users/${role}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};
