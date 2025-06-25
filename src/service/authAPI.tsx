import axios from "axios";

const API = "http://localhost:8080/api/auth";

// Đăng ký tài khoản
export const register = async (payload: {
  name: string;
  sdt: string;
  email: string;
  password: string;
  address: string;
}) => {
  const { data } = await axios.post(`${API}/register`, payload);
  return data;
};

// Đăng nhập
export const login = async (payload: {
  email: string;
  password: string;
}) => {
  const { data } = await axios.post(`${API}/login`, payload);
  return data;
};