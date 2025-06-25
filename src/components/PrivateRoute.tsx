import { Navigate } from "react-router-dom";
import { Result, Button } from "antd";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return (
      <Result
        status="403"
        title="403 - Không được phép"
        subTitle="Bạn không có quyền truy cập vào trang này."
        extra={
          <Button type="primary" onClick={() => (window.location.href = "/")}>
            Quay về trang chủ
          </Button>
        }
      />
    );
  }

  return <>{children}</>; // đảm bảo render mọi loại nội dung hợp lệ
};

export default PrivateRoute;
