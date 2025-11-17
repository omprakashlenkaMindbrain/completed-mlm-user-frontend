import { useCallback } from "react";

export const getAuthUse = () => {
  const getLoggedinuser = useCallback(async (token) => {
    try {
      const res = await fetch("http://[2a02:4780:12:b6cb::1]:8030/api/sessions", {
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
