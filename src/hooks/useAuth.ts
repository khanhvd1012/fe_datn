import { useMutation } from "@tanstack/react-query";
import { login, register } from "../service/authAPI";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

// Đăng ký
export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data.success) {
        message.success("Đăng ký thành công!");
        navigate("/login");
      } else {
        message.error(data.message || "Đăng ký thất bại!");
      }
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Đăng ký thất bại!");
    },
  });
};

// Đăng nhập
export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        message.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        message.error(data.message || "Đăng nhập thất bại!");
      }
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Đăng nhập thất bại!");
    },
  });
};