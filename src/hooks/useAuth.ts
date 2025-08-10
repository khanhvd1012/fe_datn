import { useMutation } from "@tanstack/react-query";
import { login, register } from "../service/authAPI";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IUser } from "../interface/user";
import { getProfile } from "../service/userAPI";

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
      console.log(" Login response:", data);

      if (data.token && data.user) {
        // Lưu thông tin vào localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role || "user");
        localStorage.setItem("userName", data.user.username || "User");
        localStorage.setItem("user", JSON.stringify(data.user));
        message.success("Đăng nhập thành công!");
        navigate("/"); 
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

export const useAuth = (): { user: IUser | null; loading: boolean } => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await getProfile();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); 
      } catch (error) {
        console.error("Lấy profile lỗi:", error);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};