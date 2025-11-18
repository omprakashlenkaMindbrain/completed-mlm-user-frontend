import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAuthUse } from "../hooks/user/getAuthUse";
import { useLogin } from "../hooks/user/useLogin";
import { useSignup } from "../hooks/user/useSignup";

const AuthContext = createContext();

// Secret key for lightweight obfuscation (keep short & random)
const SECRET_KEY = "bmpl@2025";

// Helper: Encode token before storing
const encodeToken = (token) => {
  if (!token) return null;
  let encoded = "";
  for (let i = 0; i < token.length; i++) {
    encoded += String.fromCharCode(token.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
  }
  return btoa(encoded); // base64 encode
};

// Helper: Decode token when reading
const decodeToken = (encoded) => {
  if (!encoded) return null;
  try {
    const decodedBase64 = atob(encoded);
    let decoded = "";
    for (let i = 0; i < decodedBase64.length; i++) {
      decoded += String.fromCharCode(decodedBase64.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
    }
    return decoded;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [getaccesstoken, setGetaccesstoken] = useState(null);

  const navigate = useNavigate();
  const { signup: signupAPI } = useSignup();
  const { login: loginAPI } = useLogin();
  const { getLoggedinuser } = getAuthUse();

  const logoutTimerRef = useRef(null);

  // Check session validity on reload
  useEffect(() => {
    const storedLogin = sessionStorage.getItem("isLoggedIn");
    const storedExpiry = sessionStorage.getItem("loginExpiry");
    const savedToken = sessionStorage.getItem("accessToken");

    if (storedLogin === "true" && storedExpiry && Date.now() < parseInt(storedExpiry)) {
      setIsLoggedIn(true);

      // Decode token if available
      if (savedToken) {
        const decoded = decodeToken(savedToken);
        if (decoded) setGetaccesstoken(decoded);
      }

      // Resume logout timer
      const remainingTime = parseInt(storedExpiry) - Date.now();
      logoutTimerRef.current = setTimeout(() => {
        handleSessionExpiry();
      }, remainingTime);
    } else {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("loginExpiry");
      sessionStorage.removeItem("accessToken");
    }

    return () => clearTimeout(logoutTimerRef.current);
  }, []);

  // Auto logout after expiry
  const handleSessionExpiry = async () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("loginExpiry");
    sessionStorage.removeItem("accessToken");

    setUser(null);
    setIsLoggedIn(false);
    setGetaccesstoken(null);

    await Swal.fire({
      icon: "info",
      title: "Session Expired",
      text: "Your session has expired. Please log in again.",
      confirmButtonColor: "#0E562B",
    });

    navigate("/login");
  };

  // Handle Signup (unchanged)
  const signup = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signupAPI(formData);
      if (!res) throw new Error("Signup failed");

      await Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Your account has been successfully created.",
        confirmButtonColor: "#0E562B",
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: err.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Login (with token encoding)
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginAPI(credentials);

      if (res && res.accessToken) {
        const token = res.accessToken;
        setGetaccesstoken(token);

        // Encode before saving
        const encodedToken = encodeToken(token);
        sessionStorage.setItem("accessToken", encodedToken);

        // 15 min expiry
        const expiryTime = Date.now() + 15 * 60 * 1000;
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("loginExpiry", expiryTime.toString());
        setIsLoggedIn(true);

        // Auto logout after 15 min
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = setTimeout(() => {
          handleSessionExpiry();
        }, 15 * 60 * 1000);

        const userData = await getLoggedinuser(token);
        setUser(userData);

        await Swal.fire({
          icon: "success",
          title: "Welcome!",
          text: "Login successful.",
          confirmButtonColor: "#0E562B",
          timer: 1800,
          showConfirmButton: false,
        });

        navigate("/");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(err.message || "Login failed");
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.message || "Invalid email or password.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout (manual)
  const logout = async () => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "Logout Confirmation",
      text: "Are you sure you want to log out?",
      showCancelButton: true,
      confirmButtonColor: "#0E562B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    });

    if (confirm.isConfirmed) {

      // Call Backend API
      try {
        await fetch("https://api.mybmpl.com/api/sessions", {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${getaccesstoken}`,
          },
          credentials: "include",
        });
      } catch (err) {
        console.log("Backend logout failed (continuing local logout)");
      }

      //  Clear frontend login state
      setUser(null);
      setIsLoggedIn(false);
      setGetaccesstoken(null);
      clearTimeout(logoutTimerRef.current);

      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("loginExpiry");
      sessionStorage.removeItem("accessToken");

      await Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        confirmButtonColor: "#0E562B",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/login");
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        getaccesstoken,
        loading,
        error,
        signup,
        login,
        logout,
        setUser,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
