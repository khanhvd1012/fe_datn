// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({
  children,
  requiredRole,
}: {
  children: JSX.Element;
  requiredRole?: string;
}) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Debug log
  // console.log("role in localStorage:", role, "requiredRole:", requiredRole);

  if (!token) return <Navigate to="/login" />;
  if (requiredRole && role?.toLowerCase() !== requiredRole.toLowerCase())
    return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;