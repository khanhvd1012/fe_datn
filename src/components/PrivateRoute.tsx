import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Chưa đăng nhập
  if (!token) {
    if (requiredRole?.toLowerCase() === "admin") {
      return <Navigate to="/admin-login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập nhưng sai quyền
  if (requiredRole && role?.toLowerCase() !== requiredRole.toLowerCase()) {
    // ❌ Không hiển thị 403 nữa — chỉ redirect về trang phù hợp hoặc giữ nguyên
    if (requiredRole.toLowerCase() === "admin") {
      return <Navigate to="/admin-login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
