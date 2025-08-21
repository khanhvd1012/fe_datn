import { useMutation } from "@tanstack/react-query";
import { changePassword, forgotPassword, login, loginWithGoogle, register, requestLoginOTP, resetPassword, verifyLoginOTP } from "../service/authAPI";
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

export const useGoogleLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role || "user");
        localStorage.setItem("userName", data.user.username || "User");
        localStorage.setItem("user", JSON.stringify(data.user));
        message.success("Đăng nhập Google thành công!");
        navigate("/");
      } else {
        message.error("Thiếu token hoặc user.");
      }
    },
    onError: (error: any) => {
      console.error("Google Login lỗi:", error);
      message.error(error?.message || "Đăng nhập Google thất bại!");
    },
  });
};

export const useRequestLoginOTP = () => {
  return useMutation({
    mutationFn: requestLoginOTP,
    onSuccess: () => { message.success("OTP đã được gửi về email.") },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Không gửi được OTP.");
    },
  });
};

export const useVerifyLoginOTP = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyLoginOTP(email, otp),
    onSuccess: (data) => {
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        message.success("Đăng nhập OTP thành công!");
        navigate("/");
      } else {
        message.error("Thiếu token hoặc user.");
      }
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "OTP không hợp lệ.");
    },
  });
};

// Hook quên mật khẩu
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      message.success("Đã gửi OTP đặt lại mật khẩu qua email.");
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Không gửi được OTP.");
    },
  });
};

// Hook reset mật khẩu
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      message.success("Đặt lại mật khẩu thành công!");
      navigate("/login");
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Đặt lại mật khẩu thất bại.");
    },
  });
};

// Hook đổi mật khẩu
export const useChangePassword = () => {
  return useMutation<
    { message: string }, // type data trả về
    any,                // type error
    { oldPassword: string; newPassword: string } // variables
  >({
    mutationFn: changePassword
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

export const useRole = (): "admin" | "employee" | "user" => {
  const { user, loading } = useAuth();

  if (loading) return "user"; 
  return (user?.role as "admin" | "employee" | "user");
};
