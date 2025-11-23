import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useLogin } from "../hooks/auth/useLogin";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { adminLogin: loginAPI } = useLogin();

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Restore session from localStorage on refresh
  useEffect(() => {
    const stored = localStorage.getItem("adminLogin");
    if (stored) {
      const data = JSON.parse(stored);
      const now = Date.now();
      if (now < data.expiry) {
        setAccessToken(data.token);
        setUser(data.user);
        setIsLoggedin(true);
      } else {
        localStorage.removeItem("adminLogin");
      }
    }
  }, []);

  // Auto-logout timer (15 min)
  useEffect(() => {
    if (!isLoggedin) return;
    const timer = setTimeout(() => handleLogout(true), 15 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [isLoggedin]);

  // Logout handler
  const handleLogout = async (auto = false) => {
    setIsLoggedin(false);
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("adminLogin");

    if (!auto) {
      await Swal.fire({
        title: "Logged Out",
        text: "You have been logged out successfully.",
        icon: "info",
        confirmButtonColor: "#0E562B",
        timer: 1500,
        showConfirmButton: false,
      });
    }
    navigate("/admin/login");
  };

  // Auto-logout on tab close
  // useEffect(() => {
  //   const onBeforeUnload = () => {
  //     localStorage.removeItem("adminLogin");
  //   };
  //   window.addEventListener("beforeunload", onBeforeUnload);
  //   return () => window.removeEventListener("beforeunload", onBeforeUnload);
  // }, []);

  // 🔹 Login
  const Login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginAPI(credentials);
      if (res && res.accessToken) {
        const token = res.accessToken;
        const data = {
          token,
          user: res.user,
          expiry: Date.now() + 15 * 60 * 1000, // 15 min
        };
        localStorage.setItem("adminLogin", JSON.stringify(data));

        setAccessToken(token);
        setUser(res.user);
        setIsLoggedin(true);

        await Swal.fire({
          title: "Login Successful!",
          text: "Welcome back, Admin 🎉",
          icon: "success",
          confirmButtonColor: "#0E562B",
          timer: 1800,
          showConfirmButton: false,
        });

        navigate("/");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      Swal.fire({
        title: "Login Failed",
        text: err?.message || "Login failed",
        icon: "error",
        confirmButtonColor: "#B63333",
      });
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        Login,
        Logout: handleLogout,
        isLoggedin,
        accessToken,
        user,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
