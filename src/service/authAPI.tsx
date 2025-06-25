import axios from "axios";

// Khai báo base API
const API = "http://localhost:8080/api/auth";

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
