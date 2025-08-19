import axios from "axios";

// Khai báo base API
const API = "http://localhost:3000/api/auth";

// Gọi API đăng nhập
export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API}/login`, credentials);
    return response.data;
  } catch (error: any) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error;
  }
};

// Gọi API đăng ký
export const register = async (payload: any) => {
  try {
    const response = await axios.post(`${API}/register`, payload);
    return response.data;
  } catch (error: any) {
    console.error("Error during register:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy thông tin profile
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.user;
  } catch (error: any) {
    console.error("Error fetching profile:", error.response?.data || error.message);
    throw error;
  }
};

// Đăng xuất
export const logout = async () => {
  try {
    const response = await axios.post(`${API}/logout`);
    return response.data;
  } catch (error: any) {
    console.error("Error during logout:", error.response?.data || error.message);
    throw error;
  }
};

// Đăng nhập với Google
export const loginWithGoogle = async (idToken: string) => {
  try {
    const response = await axios.post(`${API}/google`, { idToken });
    const data = response.data;

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error: any) {
    console.error("Error during loginWithGoogle:", error.response?.data || error.message);
    throw error;
  }
};

// Yêu cầu OTP
export const requestLoginOTP = async (email: string) => {
  try {
    const response = await axios.post(`${API}/login-otp-request`, { email });
    return response.data;
  } catch (error: any) {
    console.error("Error requesting login OTP:", error.response?.data || error.message);
    throw error;
  }
};

// Xác thực OTP
export const verifyLoginOTP = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${API}/login-otp-verify`, { email, otp });
    return response.data;
  } catch (error: any) {
    console.error("Error verifying login OTP:", error.response?.data || error.message);
    throw error;
  }
};

// Quên mật khẩu (gửi OTP qua email)
export const forgotPassword = async ({ email }: { email: string }) => {
  try {
    const response = await axios.post(`${API}/forgot-password`, { email });
    return response.data;
  } catch (error: any) {
    console.error("Error during forgotPassword:", error.response?.data || error.message);
    throw error;
  }
};

// Reset mật khẩu bằng OTP
export const resetPassword = async ({
  email,
  otp,
  newPassword,
}: { email: string; otp: string; newPassword: string }) => {
  try {
    const response = await axios.post(`${API}/reset-password`, {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error during resetPassword:", error.response?.data || error.message);
    throw error;
  }
};

// Đổi mật khẩu (yêu cầu token đã đăng nhập)
export const changePassword = async ({
  oldPassword,
  newPassword,
}: { oldPassword: string; newPassword: string }) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.put(`${API}/change-password`,
      { oldPassword, newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (error: any) {
    console.error("Error during changePassword:", error.response?.data || error.message);
    throw error;
  }
};

