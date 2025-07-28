import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();

  // Chưa đăng nhập
  if (!token) {
    if (requiredRole?.toLowerCase() === "admin") {
      return <Navigate to="/admin-login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Cho phép cả admin và employee nếu requiredRole là "admin"
  if (requiredRole?.toLowerCase() === "admin") {
    if (role !== "admin" && role !== "employee") {
      return <Navigate to="/admin-login" replace />;
    }
  }

  // Nếu requiredRole là user thì chỉ cho user
  if (requiredRole?.toLowerCase() === "user" && role !== "user") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
