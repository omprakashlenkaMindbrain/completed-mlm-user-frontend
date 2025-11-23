import { Navigate } from "react-router-dom";
import { useAuth } from "./Authcontext";

export const ProtectedRoute = ({ children }) => {
  const { isLoggedin, Logout } = useAuth();

  const stored = localStorage.getItem("adminLogin");
  if (!stored) {
    return <Navigate to="/admin/login" replace />;
  }

  const data = JSON.parse(stored);
  const now = Date.now();

  if (now >= data.expiry) {
    localStorage.removeItem("adminLogin");
    if (isLoggedin) Logout(true);
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
