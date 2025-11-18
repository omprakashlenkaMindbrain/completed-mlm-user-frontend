import { useState } from "react";

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const signup = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("https://api.mybmpl.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = (await res.json().catch(() => ({}))) || {};
      
      if (!res.ok) {
        let messages = [];

        // Top-level array
        if (Array.isArray(resData)) {
          messages = resData.map(e => e?.message).filter(Boolean);
        }
        // Object with `error` array
        else if (resData?.error && Array.isArray(resData.error)) {
          messages = resData.error.map(e => e?.message).filter(Boolean);
        }
        // Single message
        else if (resData?.message) {
          messages = [resData.message];
        }

        // Join all messages into one string
        const message = messages.join(", ") || "Signup failed";
        throw new Error(message);
      }


      setSuccess(true);
      return resData;

    } catch (err) {
      setError(err?.message || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error, success };
};
