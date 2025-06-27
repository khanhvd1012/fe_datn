import axios from "axios";

// Khai báo base API
const API = "http://localhost:3000/api/auth";

// Gọi API đăng nhập
export const login = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API}/login`, credentials);
  return response.data; // ⚠️ Quan trọng: chỉ return data
};

// Gọi API đăng ký
export const register = async (payload: any) => {
  const response = await axios.post(`${API}/register`, payload);
  return response.data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`http://localhost:3000/api/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user;
};

// Đăng xuất (cần token)
export const logout = async () => {
  const response = await axios.post(`http://localhost:3000/api/auth/logout`);
  return response.data;
};