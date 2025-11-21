import { useState } from "react";
import BASE_URL from "../../config/api";
import { useAuth } from "../../context/AuthContext";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAccessToken, setRefreshToken } = useAuth();

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/sessions`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Logout failed");
      }

      setAccessToken(null);
      setRefreshToken(null);

      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
};
