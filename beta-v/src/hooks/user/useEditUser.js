import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export const useEditUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const {getaccesstoken}=useAuth();

  const editUser = async (updates) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("https://api.mybmpl.com/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getaccesstoken}`, 
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update user");
      }

      setSuccessMsg(data.message || "User updated successfully");
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editUser, loading, error, successMsg };
};
