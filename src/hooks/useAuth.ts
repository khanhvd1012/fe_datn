import { useMutation } from "@tanstack/react-query";
import { login, register } from "../service/authAPI";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

// Hook đăng ký
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

// Hook đăng nhập
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("✅ Login response:", data);

      if (data.token && data.user) {
        // Lưu thông tin vào localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role || "user");
        localStorage.setItem("userName", data.user.username || "User");
        console.log("Đã lưu vào localStorage:", {
          token: localStorage.getItem("token"),
          role: localStorage.getItem("role"),
          userName: localStorage.getItem("userName"),
        });
        message.success("Đăng nhập thành công!");
        navigate("/"); // 👉 điều hướng sau khi login thành công
      } else {
        message.error("Thiếu thông tin token hoặc user.");
      }
    },
    onError: (error: any) => {
      console.error("❌ Đăng nhập lỗi:", error);
      message.error(error?.response?.data?.message || "Đăng nhập thất bại!");
    },
  });
};