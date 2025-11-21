import { useCallback } from "react";
import BASE_URL from "../../config/api";

export const getAuthUse = () => {
  const getLoggedinuser = useCallback(async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/api/sessions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data; 
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  }, []);

  return { getLoggedinuser };
};
